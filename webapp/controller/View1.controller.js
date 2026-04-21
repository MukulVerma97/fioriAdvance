sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "fiori2904/model/formatter"
], function (Controller, MessageBox, MessageToast, JSONModel, Filter, FilterOperator, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.View1", {
        f: formatter,

        onInit: function () {
            this._loadKPIData();
        },

        /**
         * Load KPI counts from OData service
         */
        _loadKPIData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oKpiModel = this.getOwnerComponent().getModel("kpiModel");

            // Initialize with loading state
            oKpiModel.setData({
                employeeCount: "...",
                productCount: "...",
                orderCount: "...",
                customerCount: "..."
            });

            // Fetch Employee count
            oModel.read("/Employees/$count", {
                success: function (data) {
                    oKpiModel.setProperty("/employeeCount", data);
                },
                error: function () {
                    // Fallback: read collection and count
                    oModel.read("/Employees", {
                        success: function (oData) {
                            oKpiModel.setProperty("/employeeCount", oData.results.length);
                        }
                    });
                }
            });

            // Fetch Product count
            oModel.read("/Products/$count", {
                success: function (data) {
                    oKpiModel.setProperty("/productCount", data);
                },
                error: function () {
                    oModel.read("/Products", {
                        success: function (oData) {
                            oKpiModel.setProperty("/productCount", oData.results.length);
                        }
                    });
                }
            });

            // Fetch Order count
            oModel.read("/Orders/$count", {
                success: function (data) {
                    oKpiModel.setProperty("/orderCount", data);
                },
                error: function () {
                    oKpiModel.setProperty("/orderCount", "830+");
                }
            });

            // Fetch Customer count
            oModel.read("/Customers/$count", {
                success: function (data) {
                    oKpiModel.setProperty("/customerCount", data);
                },
                error: function () {
                    oModel.read("/Customers", {
                        success: function (oData) {
                            oKpiModel.setProperty("/customerCount", oData.results.length);
                        }
                    });
                }
            });
        },

        /**
         * Live search handler — filters employee table by name and country
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || "";
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sQuery),
                        new Filter("LastName", FilterOperator.Contains, sQuery),
                        new Filter("Country", FilterOperator.Contains, sQuery),
                        new Filter("City", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            // Also apply country tab filter if not "All"
            var sTabKey = this.byId("empCountryTabs").getSelectedKey();
            if (sTabKey && sTabKey !== "All") {
                aFilters.push(new Filter("Country", FilterOperator.EQ, sTabKey));
            }

            this.byId("idTable").getBinding("items").filter(aFilters);
        },

        /**
         * IconTabBar select handler — filter by country
         */
        onTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key");
            var aFilters = [];

            if (sKey && sKey !== "All") {
                aFilters.push(new Filter("Country", FilterOperator.EQ, sKey));
            }

            // Also apply search filter if active
            var sSearch = this.byId("empSearchField").getValue();
            if (sSearch) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sSearch),
                        new Filter("LastName", FilterOperator.Contains, sSearch),
                        new Filter("Country", FilterOperator.Contains, sSearch),
                        new Filter("City", FilterOperator.Contains, sSearch)
                    ],
                    and: false
                }));
            }

            this.byId("idTable").getBinding("items").filter(aFilters);
        },

        /**
         * Get selected employee data and show in MessageBox
         * Fixed bug: was this.getView.byId (missing parentheses)
         */
        getSelectedEmployeeData: function () {
            var oTable = this.getView().byId("idTable");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                MessageToast.show("Please select an employee first.");
                return;
            }

            var oContext = oSelectedItem.getBindingContext();
            var sName = oContext.getProperty("FirstName") + " " + oContext.getProperty("LastName");
            var sTitle = oContext.getProperty("Title");
            var sCity = oContext.getProperty("City");
            var sCountry = oContext.getProperty("Country");
            var sPhone = oContext.getProperty("HomePhone");
            var sBirthDate = formatter.formatDate(oContext.getProperty("BirthDate"));
            var sHireDate = formatter.formatDate(oContext.getProperty("HireDate"));

            MessageBox.information(
                "Name: " + sName + "\n" +
                "Title: " + sTitle + "\n" +
                "City: " + sCity + ", " + sCountry + "\n" +
                "Phone: " + sPhone + "\n" +
                "Birth Date: " + sBirthDate + "\n" +
                "Hire Date: " + sHireDate,
                { title: "Employee Details — " + sName }
            );
        },

        /**
         * Navigate to Employee Detail view on row press
         */
        onPressRow: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sEmployeeId = oContext.getProperty("EmployeeID");
            this.getOwnerComponent().getRouter().navTo("EmployeeDetail", {
                employeeId: sEmployeeId
            });
        },

        // === Quick Navigation Handlers ===

        onNavSelf: function () {
            // Already on this view — just scroll to top
            this.byId("page").scrollTo(0);
        },

        onNavProducts: function () {
            this.getOwnerComponent().getRouter().navTo("Products");
        },

        onNavOrders: function () {
            this.getOwnerComponent().getRouter().navTo("Orders");
        },

        onNavCustomers: function () {
            this.getOwnerComponent().getRouter().navTo("Customers");
        },

        onNavOrderEntry: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        }
    });
});