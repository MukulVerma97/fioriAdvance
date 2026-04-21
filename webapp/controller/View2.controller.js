sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "fiori2904/model/models",
    "fiori2904/model/formatter"
], function (Controller, MessageBox, MessageToast, models, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.View2", {
        f: formatter,

        onInit: function () {
            // Attach route pattern matched handler
            this.getOwnerComponent().getRouter()
                .getRoute("RouteView2")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        /**
         * Route matched — bind view to employee by ID
         */
        _onRouteMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").employeeId;
            if (sEmployeeId) {
                var sPath = "/Employees(" + sEmployeeId + ")";
                this.getView().bindElement({
                    path: sPath
                });
            }
        },

        /**
         * Navigate back to dashboard
         */
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        /**
         * Navigate to Order Entry form (View3)
         */
        onSimple: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        },

        /**
         * Save button handler — shows success toast
         * (Northwind is read-only, so we simulate save)
         */
        onSave: function () {
            MessageToast.show("Employee details saved successfully!", {
                duration: 3000,
                width: "20em"
            });
        },

        /**
         * Open employee value help dialog
         */
        onPressValueHelpDAilog: function () {
            if (!this.oDailog) {
                this.oDailog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "fiori2904.fragment.employee",
                    this
                );
                this.getView().addDependent(this.oDailog);
            }
            this.oDailog.open();
        },

        /**
         * Close value help dialog
         */
        onDialogClose: function () {
            this.oDailog.close();
        },

        /**
         * Handle row press in value help — fill form with selected employee
         */
        onPressFragRow: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var sEmployeeId = oContext.getProperty("EmployeeID");

            // Rebind the view to the selected employee
            var sPath = "/Employees(" + sEmployeeId + ")";
            this.getView().bindElement({
                path: sPath
            });

            this.oDailog.close();
            MessageToast.show("Loaded Employee #" + sEmployeeId);
        },

        /**
         * Search handler for the value help dialog
         */
        onFragmentSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("City", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            // Get table inside fragment via view
            var oTable = sap.ui.getCore().byId(this.getView().getId() + "--fragEmpTable") ||
                         this.byId("fragEmpTable");
            if (oTable) {
                oTable.getBinding("items").filter(aFilters);
            }
        }
    });
});
