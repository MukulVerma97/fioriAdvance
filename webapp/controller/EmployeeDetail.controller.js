sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "fiori2904/model/formatter"
], function (Controller, MessageToast, JSONModel, formatter) {
    "use strict";

    return Controller.extend("fiori2904.controller.EmployeeDetail", {
        f: formatter,

        onInit: function () {
            // Create a local model for employee detail metadata
            var oEmpDetailModel = new JSONModel({
                orderCount: 0
            });
            this.getView().setModel(oEmpDetailModel, "empDetailModel");

            // Attach route pattern matched handler
            this.getOwnerComponent().getRouter()
                .getRoute("EmployeeDetail")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        /**
         * Route matched handler — binds view to selected employee
         * @param {sap.ui.base.Event} oEvent - Route matched event
         */
        _onRouteMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").employeeId;
            var sPath = "/Employees(" + sEmployeeId + ")";

            // Bind the view to the employee entity with expanded orders
            this.getView().bindElement({
                path: sPath,
                parameters: {
                    expand: "Orders"
                },
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        /**
         * Data received handler — updates order count
         */
        _onDataReceived: function () {
            var oContext = this.getView().getBindingContext();
            if (oContext) {
                var oData = oContext.getObject();
                if (oData && oData.Orders) {
                    this.getView().getModel("empDetailModel").setProperty("/orderCount", oData.Orders.length);
                }
            }
        },

        /**
         * Navigate back to the dashboard
         */
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        /**
         * Navigate to edit form (View2) with employee ID
         */
        onEditEmployee: function () {
            var oContext = this.getView().getBindingContext();
            if (oContext) {
                var sEmployeeId = oContext.getProperty("EmployeeID");
                this.getOwnerComponent().getRouter().navTo("RouteView2", {
                    employeeId: sEmployeeId
                });
            }
        }
    });
});
