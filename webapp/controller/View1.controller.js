sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "fiori2904/model/formatter"
], (Controller, MessageBox, formatter) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View1", {

        f: formatter,
        onInit() {
        },

        onsbt: function () {

            this.getOwnerComponent().getRouter().navTo("RouteView2")
        },

        onSubmit: function (oEvent) {
            var ipName = this.getView().byId("idName").getValue();
            console.log(ipName);
            var msg = "Welcome To " + ipName;

            this.getView().byId("id_text").setText(msg).setTextAlign("Left");

            this.getView().byId("btn1").setType("Accept").setText("Great")

            this.getView().byId("nameLabel").setRequired(false)
            this.getView().byId("idName").setEnabled(false)


        },
        getSelectedEmployeeData: function(oEvent){
        
            var bindingContext = this.getView.byId("idTable").getSelectedItem().getBindingContext().getProperty("EmployeeID")
            var selecBindingContexts = this.getView().byId("idTable").getSelectedContexts(); 

            for(var i =0; i<selecBindingContexts.length;i++){

                selecBindingContexts[i].getObject(); // -- give binding conttext
            }
        
        },
        onPressRow:function(oEvent){
                
        }

    });
});