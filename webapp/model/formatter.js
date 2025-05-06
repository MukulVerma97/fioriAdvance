sap.ui.define([


],function(){


 return {
 formatName : function(FirstName){
    return "Mr " + FirstName
 },

 countryColor: function(Country){
    if(Country === "USA"){
        return "Success"
    }else if(Country ==="UK"){
        return "Error"
    }
 },

 formatDate: function(BirthDate) {
    if (!BirthDate) return ""; // Handle undefined/null

    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "dd-MM-yyyy"
    }, sap.ui.getCore().getConfiguration().getLocale());

    return oDateFormat.format(new Date(BirthDate));
}




 }



})