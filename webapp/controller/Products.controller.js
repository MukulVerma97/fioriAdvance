sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Item",
    "fiori2904/model/formatter"
], function (Controller, MessageBox, MessageToast, Filter, FilterOperator, Sorter, Item, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.Products", {
        f: formatter,
        _bSortAsc: true,

        onInit: function () {
            this._loadCategories();
        },

        _loadCategories: function () {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oModel.read("/Categories", {
                success: function (oData) {
                    var oSelect = that.byId("categoryFilter");
                    oData.results.forEach(function (cat) {
                        oSelect.addItem(new Item({
                            key: cat.CategoryID.toString(),
                            text: cat.CategoryName
                        }));
                    });
                }
            });
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || "";
            this._applyFilters(sQuery);
        },

        onCategoryFilter: function () {
            var sSearch = this.byId("productSearchField").getValue();
            this._applyFilters(sSearch);
        },

        _applyFilters: function (sSearch) {
            var aFilters = [];
            if (sSearch) {
                aFilters.push(new Filter("ProductName", FilterOperator.Contains, sSearch));
            }
            var sCatKey = this.byId("categoryFilter").getSelectedKey();
            if (sCatKey) {
                aFilters.push(new Filter("CategoryID", FilterOperator.EQ, parseInt(sCatKey)));
            }
            this.byId("productList").getBinding("items").filter(aFilters);
        },

        onSort: function () {
            this._bSortAsc = !this._bSortAsc;
            var oSorter = new Sorter("ProductName", !this._bSortAsc);
            this.byId("productList").getBinding("items").sort(oSorter);
            MessageToast.show("Sorted " + (this._bSortAsc ? "A → Z" : "Z → A"));
        },

        onProductItemPress: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            MessageBox.information(
                "Product: " + oCtx.getProperty("ProductName") + "\n" +
                "Price: " + formatter.addCurrency(oCtx.getProperty("UnitPrice")) + "\n" +
                "In Stock: " + oCtx.getProperty("UnitsInStock") + "\n" +
                "On Order: " + oCtx.getProperty("UnitsOnOrder") + "\n" +
                "Reorder Level: " + oCtx.getProperty("ReorderLevel") + "\n" +
                "Discontinued: " + (oCtx.getProperty("Discontinued") ? "Yes" : "No"),
                { title: "Product Details" }
            );
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onNavOrders: function () {
            this.getOwnerComponent().getRouter().navTo("Orders");
        }
    });
});