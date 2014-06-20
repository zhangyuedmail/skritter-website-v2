define(function() {
    /**
     * @class DataDecomp
     */
    var Decomp = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('decomps', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
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
                decompHTML += "<td class='reading'>" + skritter.user.isChinese() ? skritter.fn.pinyin.toTone(child.reading) : child.reading + '</td>';
                //TODO: fix this to support other languages
                decompHTML += "<td class='definition'>" + child.definitions.en + '</td>';
                decompHTML += '</tr>';
            }
            return decompHTML;
        }
    });

    return Decomp;
});