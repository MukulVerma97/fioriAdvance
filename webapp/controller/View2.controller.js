sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View2", {
        onInit() {
        },

        onstbn : function(){
          alert("Hello")
        }
    });
});