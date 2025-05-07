sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "fiori2904/model/models"],
  (Controller, MessageBox, models) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View2", {
      onInit() {},

      onstbn: function () {
        history.go(-1);
      },
      onSimple: function () {
        this.getOwnerComponent().getRouter().navTo("RouteView3");
      },
      onPressValueHelpDAilog: function () {
        /// load the fragment
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

      onDialogClose: function () {
        this.oDailog.close();
      },

      onPressFragRow: function (oEvent) {
        var empId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty("EmployeeID");

          this.getView().byId("empId").setValue(empId)
          this.oDailog.close();
      },
    });
  }
);
