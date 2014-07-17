define([], function() {
    /**
     * @model Settings
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            $(window).resize(_.bind(function(event) {
                setTimeout(_.bind(function() {
                    this.trigger('resize', this);
                }, this), 500);
                event.preventDefault();
            }, this));
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            gradingColors: {
                1: '#d95757',
                2: '#efec10',
                3: '#30a930',
                4: '#4097d3'
            },
            hintColor: '#87cefa',
            maxCanvasSize: 1800,
            webWorkers: false
        },
        /**
         * @method getAppHeight
         * @returns {Number}
         */
        getAppHeight: function() {
            return $(window).height();
        },
        /**
         * @method getAppWidth
         * @returns {Number}
         */
        getAppWidth: function() {
            return $(window).width();
        },
        /**
         * @method getCanvasSize
         * @returns {Number}
         */
        getCanvasSize: function() {
            var size = 0;
            if (this.isPortrait()) {
                var calculatedMaxSize = this.getContentHeight() * 0.8;
                var width = this.getContentWidth();
                if (width > this.get('maxCanvasSize')) {
                    size = this.get('maxCanvasSize');
                } else {
                    size = width;
                }
                if (size > calculatedMaxSize) {
                    size = calculatedMaxSize;
                }
            } else {
                size = this.getContentHeight();
            }
            return size;
        },
        /**
         * @method getContentHeight
         * @returns {Number}
         */
        getContentHeight: function() {
            return $('#content').height();
        },
        /**
         * @method getContentWidth
         * @returns {Number}
         */
        getContentWidth: function() {
            return $('#content').width();
        },
        /**
         * @method isLandscape
         * @returns {Boolean}
         */
        isLandscape: function() {
            return this.getContentWidth() >= this.getContentHeight() ? true : false;
        },
        /**
         * @method isPortrait
         * @returns {Boolean}
         */
        isPortrait: function() {
            return this.getContentWidth() < this.getContentHeight() ? true : false;
        }
    });
    
    return Model;
});