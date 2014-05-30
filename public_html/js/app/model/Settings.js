define([], function() {
    /**
     * @model Settings
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            /**$(window).resize(_.bind(function(event) {
                this.trigger('resize', this);
                event.preventDefault();
            }, this));**/
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            gradingColors: {
                1: '#f7977a',
                2: '#fff79a',
                3: '#82ca9d',
                4: '#8493ca'
            },
            hintColor: '#87cefa',
            languageCode: '@@languageCode',
            version: '@@version'
        },
        /**
         * @method appHeight
         * @returns {Number}
         */
        appHeight: function() {
            return $(window).height();
        },
        /**
         * @method appWidth
         * @returns {Number}
         */
        appWidth: function() {
            return $(window).width();
        },
        /**
         * @method contentHeight
         * @returns {Number}
         */
        contentHeight: function() {
            return $('#content').height();
        },
        /**
         * @method contentWidth
         * @returns {Number}
         */
        contentWidth: function() {
            return $('#content').width();
        },
        /**
         * @method getVersion
         * @returns {String}
         */
        getVersion: function() {
            return this.get('version').indexOf('@@') === -1 ? this.get('version') : 'edge';
        },
        /**
         * @method isLandscape
         * @returns {Boolean}
         */
        isLandscape: function() {
            return this.contentWidth() >= this.contentHeight() ? true : false;
        },
        /**
         * @method isPortrait
         * @returns {Boolean}
         */
        isPortrait: function() {
            return this.contentWidth() < this.contentHeight() ? true : false;
        }
    });
    
    return Model;
});