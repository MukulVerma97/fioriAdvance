sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "fiori2904/model/formatter"
], function (Controller, MessageBox, MessageToast, Filter, FilterOperator, Sorter, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.Customers", {
        f: formatter,
        _bSortAsc: true,

        onInit: function () {
        },

        /**
         * Live search on customers by multiple fields
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || "";
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("CompanyName", FilterOperator.Contains, sQuery),
                        new Filter("ContactName", FilterOperator.Contains, sQuery),
                        new Filter("City", FilterOperator.Contains, sQuery),
                        new Filter("Country", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            this.byId("customerList").getBinding("items").filter(aFilters);
        },

        /**
         * Toggle sort between Company Name and Country
         */
        onSort: function () {
            this._bSortAsc = !this._bSortAsc;
            var oSorter = new Sorter("CompanyName", !this._bSortAsc);
            this.byId("customerList").getBinding("items").sort(oSorter);
            MessageToast.show("Sorted by Company " + (this._bSortAsc ? "A → Z" : "Z → A"));
        },

        /**
         * Customer press — show customer details
         */
        onCustomerPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sCompany = oContext.getProperty("CompanyName");
            var sContact = oContext.getProperty("ContactName");
            var sTitle = oContext.getProperty("ContactTitle");
            var sAddress = oContext.getProperty("Address");
            var sCity = oContext.getProperty("City");
            var sCountry = oContext.getProperty("Country");
            var sPhone = oContext.getProperty("Phone");
            var sFax = oContext.getProperty("Fax") || "N/A";

            MessageBox.information(
                "Company: " + sCompany + "\n" +
                "Contact: " + sContact + " (" + sTitle + ")\n" +
                "Address: " + sAddress + "\n" +
                "City: " + sCity + ", " + sCountry + "\n" +
                "Phone: " + sPhone + "\n" +
                "Fax: " + sFax,
                { title: "Customer Details — " + sCompany }
            );
        },

        /**
         * Navigate back to dashboard
         */
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        /**
         * Navigate to Orders view
         */
        onNavOrders: function () {
            this.getOwnerComponent().getRouter().navTo("Orders");
        }
    });
});
