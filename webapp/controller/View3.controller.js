sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
     "fiori2904/model/models"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("fiori2904.controller.View3", {
        onInit() {
            var oDataModel = this.getOwnerComponent().getModel(); // ODataModel
            var that = this;
            
            oDataModel.read("/Employees", {
                success: function (oData) {
                    // Extract unique countries
                    var countries = [];
                    var countryMap = {};
                    oData.results.forEach(function (item) {
                        if (!countryMap[item.Country]) {
                            countryMap[item.Country] = true;
                            countries.push({ Country: item.Country });
                        }
                    });
        
                    // Set to JSON model
                    var oCountryModel = new sap.ui.model.json.JSONModel({ Countries: countries });
                    that.getView().setModel(oCountryModel, "countryModel");
                }
            });

        },
        onProductPress:function(){
    //alert("Products")
    this.getOwnerComponent().getRouter().navTo("Products")
           
        },
        onSimpleForm:function(){

            var comboAdd= this.getView().byId("combo").getSelectedKey();

            var multiCombo = this.getView().byId("mlcb").getSelectedKeys ();
        },
        onSelectionCombo: function(oEvent){
            var selectedItem = this.getView().byId("combo").getSelectedKey();


        }

        
     
    });
});