sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "fiori2904/model/formatter"
], function (Controller, MessageBox, MessageToast, JSONModel, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.View3", {
        f: formatter,
        onInit: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var that = this;
            oDataModel.read("/Employees", {
                success: function (oData) {
                    var countries = [];
                    var countryMap = {};
                    oData.results.forEach(function (item) {
                        if (!countryMap[item.Country]) {
                            countryMap[item.Country] = true;
                            countries.push({ Country: item.Country });
                        }
                    });
                    var oCountryModel = new JSONModel({ Countries: countries });
                    that.getView().setModel(oCountryModel, "countryModel");
                }
            });
        },
        onProductPress: function () {
            this.getOwnerComponent().getRouter().navTo("Products");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onEmployeeSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext();
                if (oContext) {
                    this.byId("empTitleField").setValue(oContext.getProperty("Title") || "");
                    MessageToast.show("Employee: " + oContext.getProperty("FirstName"));
                }
            }
        },
        onSelectionCombo: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext();
                if (oContext) {
                    this.byId("shipCity").setValue(oContext.getProperty("City") || "");
                    this.byId("shipCountry").setValue(oContext.getProperty("Country") || "");
                    MessageToast.show("Ship to: " + oContext.getProperty("City"));
                }
            }
        },
        onSelectionMCB: function (oEvent) {
            var aItems = oEvent.getParameter("selectedItems");
            MessageToast.show((aItems ? aItems.length : 0) + " product(s) selected");
        },
        onSimpleForm: function () {
            var oEmpSelect = this.byId("empSelect");
            var oCustCombo = this.byId("customerCombo");
            var oMCB = this.byId("mlcb");
            var sEmp = oEmpSelect ? oEmpSelect.getSelectedItem() : null;
            var sCust = oCustCombo ? oCustCombo.getSelectedKey() : "";
            var aProds = oMCB ? oMCB.getSelectedKeys() : [];
            var aErrors = [];
            if (!sEmp) aErrors.push("Select an Employee");
            if (!sCust) aErrors.push("Select a Customer");
            if (aProds.length === 0) aErrors.push("Select at least one Product");
            if (aErrors.length > 0) {
                MessageBox.warning("Please fix:\n• " + aErrors.join("\n• "), { title: "Validation" });
                return;
            }
            var aProdNames = oMCB.getSelectedItems().map(function (i) { return i.getText(); });
            var sNotes = this.byId("orderNotes") ? this.byId("orderNotes").getValue() : "";
            MessageBox.success(
                "Employee: " + sEmp.getText() + "\nCustomer: " + oCustCombo.getValue() +
                "\nProducts (" + aProds.length + "): " + aProdNames.join(", ") +
                (sNotes ? "\nNotes: " + sNotes : ""),
                { title: "Order Submitted!" }
            );
        },
        onResetForm: function () {
            var that = this;
            MessageBox.confirm("Reset the form?", {
                onClose: function (action) {
                    if (action === MessageBox.Action.OK) {
                        ["empSelect", "customerCombo", "combo"].forEach(function (id) {
                            var c = that.byId(id); if (c) c.setSelectedKey("");
                        });
                        ["empTitleField", "shipCity", "shipCountry", "orderNotes"].forEach(function (id) {
                            var c = that.byId(id); if (c) c.setValue("");
                        });
                        var oMCB = that.byId("mlcb"); if (oMCB) oMCB.setSelectedKeys([]);
                        MessageToast.show("Form reset.");
                    }
                }
            });
        }
    });
});