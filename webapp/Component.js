sap.ui.define([
    "sap/ui/core/UIComponent",
    "fiori2904/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("fiori2904.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            var oModel = this.getModel();
            var empModel =this.getModel("empModel")

            oModel.read("/Employees",{
             success: function(data){
                      for (var i = 0; i < data.results.length; i++) {
                        data.results[i].Sno=i+1 ;
                       //data.results[i].FirstName= "Mr."+ " "+ data.results[i].FirstName
                        
                      }
                empModel.setData(data);

             },
             error:function(){

             }

            })
        }
    });
});