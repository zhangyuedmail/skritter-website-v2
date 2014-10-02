/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataDecomp
     * @extends BaseModel
     */
    var DataDecomp = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'writing',
        /**
         * @method getChildrenRows
         * @return {String}
         */
        getChildrenRows: function() {
            var decompHTML = '';
            var children = this.get('Children');
            for (var i = 0, length = children.length; i < length; i++) {
                var child = children[i];
                decompHTML += '<tr>';
                decompHTML += "<td class='writing character-font'>" + child.writing + '</td>';
                decompHTML += "<td class='reading'>" + app.user.isChinese() ? app.fn.pinyin.toTone(child.reading) : child.reading + '</td>';
                //TODO: fix this to support other languages
                decompHTML += "<td class='definition'>" + child.definitions.en + '</td>';
                decompHTML += '</tr>';
            }
            return decompHTML;
        }
    });

    return DataDecomp;
});
