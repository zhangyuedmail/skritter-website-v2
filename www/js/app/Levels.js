/**
 * @module Application
 * @class Levels
 */
define([], function() {
    /**
     * @property data
     * @type Array
     */
    var data = [
        {items: 0, level: 1, title: "Novice"},
        {items: 20, level: 2, title: "Apprentice"},
        {items: 50, level: 3, title: "Journeyman"},
        {items: 100, level: 4, title: "Adept"},
        {items: 150, level: 5, title: "Magus"},
        {items: 200, level: 6, title: "Master"},
        {items: 400, level: 7, title: "Grandmaster"},
        {items: 600, level: 8, title: "Legendary"},
        {items: 800, level: 9, title: "Transcended"},
        {items: 1000, level: 10, title: "Archmage"},
        {items: 1500, level: 11, title: "Promethean"},
        {items: 2000, level: 12, title: "Exalted"}
    ];
    /**
     * @method getData
     * @returns {Object}
     */
    function getData() {
        return data;
    }
    /**
     * @method getLevel
     * @param {Number} itemCount
     * @returns  {Object}
     */
    function getLevel(itemCount) {
        var level = data[0];
        for (var i = 0, length = data.length; i < length; i++) {
            if (itemCount >= data[i].items) {
                level = data[i];
            }
        }
        return level;
    }

    return {
        getData: getData,
        getLevel: getLevel
    };
});