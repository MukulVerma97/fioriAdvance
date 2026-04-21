sap.ui.define([
], function () {
    "use strict";

    return {
        /**
         * Formats employee name with title of courtesy
         * @param {string} FirstName - Employee first name
         * @param {string} TitleOfCourtesy - e.g. "Mr.", "Ms.", "Dr."
         * @returns {string} Formatted name
         */
        formatName: function (FirstName, TitleOfCourtesy) {
            if (!FirstName) return "";
            var prefix = TitleOfCourtesy || "Mr.";
            return prefix + " " + FirstName;
        },

        /**
         * Returns semantic color state based on country
         * @param {string} Country - Country name
         * @returns {string} Semantic state
         */
        countryColor: function (Country) {
            if (Country === "USA") {
                return "Success";
            } else if (Country === "UK") {
                return "Error";
            } else {
                return "Warning";
            }
        },

        /**
         * Formats date to dd-MM-yyyy pattern
         * @param {Date|string} BirthDate - Date value
         * @returns {string} Formatted date
         */
        formatDate: function (BirthDate) {
            if (!BirthDate) return "";
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd MMM yyyy"
            });
            return oDateFormat.format(new Date(BirthDate));
        },

        /**
         * Adds currency prefix to price
         * @param {number} UnitPrice - Unit price value
         * @returns {string} Formatted price with currency
         */
        addCurrency: function (UnitPrice) {
            if (UnitPrice === undefined || UnitPrice === null) return "";
            var price = parseFloat(UnitPrice).toFixed(2);
            return "$ " + price;
        },

        /**
         * Returns semantic state for discontinued status
         * @param {boolean} Discontinued - Whether product is discontinued
         * @returns {string} Semantic state
         */
        formatDiscontinued: function (Discontinued) {
            if (Discontinued === true) {
                return "Error";
            }
            return "Success";
        },

        /**
         * Returns text for discontinued status
         * @param {boolean} Discontinued - Whether product is discontinued
         * @returns {string} Status text
         */
        formatDiscontinuedText: function (Discontinued) {
            if (Discontinued === true) {
                return "Discontinued";
            }
            return "Active";
        },

        /**
         * Returns semantic state based on shipping status
         * @param {Date|string} ShippedDate - Shipped date (null if not shipped)
         * @returns {string} Semantic state
         */
        formatShippingState: function (ShippedDate) {
            return ShippedDate ? "Success" : "Warning";
        },

        /**
         * Returns text for shipping status
         * @param {Date|string} ShippedDate - Shipped date
         * @returns {string} Status text
         */
        formatShippingStatus: function (ShippedDate) {
            return ShippedDate ? "Shipped" : "Pending";
        },

        /**
         * Returns shipping status icon
         * @param {Date|string} ShippedDate - Shipped date
         * @returns {string} Icon URI
         */
        formatShippingIcon: function (ShippedDate) {
            return ShippedDate ? "sap-icon://shipping-status" : "sap-icon://pending";
        },

        /**
         * Formats stock level status text
         * @param {number} UnitsInStock - Units in stock
         * @param {number} ReorderLevel - Reorder threshold
         * @returns {string} Stock status text
         */
        formatStockStatus: function (UnitsInStock, ReorderLevel) {
            if (UnitsInStock === 0) {
                return "Out of Stock";
            } else if (UnitsInStock <= (ReorderLevel || 10)) {
                return "Low Stock";
            }
            return "In Stock";
        },

        /**
         * Returns semantic state for stock level
         * @param {number} UnitsInStock - Units in stock
         * @param {number} ReorderLevel - Reorder threshold
         * @returns {string} Semantic state
         */
        formatStockState: function (UnitsInStock, ReorderLevel) {
            if (UnitsInStock === 0) {
                return "Error";
            } else if (UnitsInStock <= (ReorderLevel || 10)) {
                return "Warning";
            }
            return "Success";
        },

        /**
         * Formats freight value with currency
         * @param {number} Freight - Freight value
         * @returns {string} Formatted freight
         */
        formatFreight: function (Freight) {
            if (Freight === undefined || Freight === null) return "";
            return "$ " + parseFloat(Freight).toFixed(2);
        },

        /**
         * Formats employee photo URL from ID
         * @param {number} EmployeeID - Employee ID
         * @returns {string} Photo URL
         */
        formatEmployeePhoto: function (EmployeeID) {
            if (!EmployeeID) return "";
            return "https://randomuser.me/api/portraits/men/" + EmployeeID + ".jpg";
        },

        /**
         * Formats full name from first and last name
         * @param {string} FirstName - First name
         * @param {string} LastName - Last name
         * @returns {string} Full name
         */
        formatFullName: function (FirstName, LastName) {
            return (FirstName || "") + " " + (LastName || "");
        }
    };
});