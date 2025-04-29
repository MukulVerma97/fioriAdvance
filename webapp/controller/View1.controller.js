sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View1", {
        onInit() {
        },

        onsbt : function(){

          MessageBox.show("Hello Dear",{
            icon: MessageBox.Icon.INFORMATION,
			title: "My message box title",
          })
        }
    });
});