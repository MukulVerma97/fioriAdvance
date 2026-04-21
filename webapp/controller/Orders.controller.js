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

    return Controller.extend("fiori2904.controller.Orders", {
        f: formatter,
        _bSortDescending: true,

        onInit: function () {
        },

        /**
         * Search orders by OrderID or CustomerID
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("CustomerID", FilterOperator.Contains, sQuery),
                        new Filter("ShipCity", FilterOperator.Contains, sQuery),
                        new Filter("ShipCountry", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            // Combine with country filter if active
            var sCountry = this.byId("countryFilter").getSelectedKey();
            if (sCountry) {
                aFilters.push(new Filter("ShipCountry", FilterOperator.EQ, sCountry));
            }

            this.byId("ordersTable").getBinding("items").filter(aFilters);
        },

        /**
         * Filter orders by ship country
         */
        onCountryFilter: function (oEvent) {
            var sCountry = oEvent.getParameter("selectedItem").getKey();
            var aFilters = [];

            if (sCountry) {
                aFilters.push(new Filter("ShipCountry", FilterOperator.EQ, sCountry));
            }

            // Combine with search filter if active
            var sSearch = this.byId("orderSearchField").getValue();
            if (sSearch) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("CustomerID", FilterOperator.Contains, sSearch),
                        new Filter("ShipCity", FilterOperator.Contains, sSearch),
                        new Filter("ShipCountry", FilterOperator.Contains, sSearch)
                    ],
                    and: false
                }));
            }

            this.byId("ordersTable").getBinding("items").filter(aFilters);
        },

        /**
         * Toggle sort direction on OrderID
         */
        onSort: function () {
            this._bSortDescending = !this._bSortDescending;
            var oSorter = new Sorter("OrderID", this._bSortDescending);
            this.byId("ordersTable").getBinding("items").sort(oSorter);
            MessageToast.show("Sorted " + (this._bSortDescending ? "Newest First" : "Oldest First"));
        },

        /**
         * Order row press — show order details
         */
        onOrderPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sOrderId = oContext.getProperty("OrderID");
            var sCustomer = oContext.getProperty("CustomerID");
            var sShipCountry = oContext.getProperty("ShipCountry");
            var sFreight = formatter.formatFreight(oContext.getProperty("Freight"));
            var sStatus = oContext.getProperty("ShippedDate") ? "Shipped ✓" : "Pending ⏳";

            MessageBox.information(
                "Order #" + sOrderId + "\n" +
                "Customer: " + sCustomer + "\n" +
                "Ship To: " + sShipCountry + "\n" +
                "Freight: " + sFreight + "\n" +
                "Status: " + sStatus,
                { title: "Order Details" }
            );
        },

        /**
         * Navigate back to dashboard
         */
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        /**
         * Navigate to Customers view
         */
        onNavCustomers: function () {
            this.getOwnerComponent().getRouter().navTo("Customers");
        }
    });
});
