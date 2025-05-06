sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
 "fiori2904/model/models"

], (Controller,MessageBox,models) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View2", {
        onInit() {
       
        },

        
        onstbn : function(){
        history.go(-1)
        },
        onSimple : function(){

            this.getOwnerComponent().getRouter().navTo("RouteView3")
        }


    });
});