/**
 * @module Skritter
 * @submodule View
 * @param templateReview
 * @author Joshua McFarland
 */
define([
    'require.text!template/admin-review.html'
], function(templateReview) {
    /**
     * @class AdminReview
     */
    var Review = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateReview);
            this.load();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        },
        /**
         * @method load
         */
        load: function() {
            var reviews = skritter.user.data.reviews;
            var div = '';
            for (var a = 0, lengthA = reviews.length; a < lengthA; a++) {  
                var review = reviews.at(a).get('reviews');
                for (var b = 0, lengthB = review.length; b < lengthB; b++) {
                    var contained = review[b];
                    if (parseInt(b, 10) === 0) {
                        switch (contained.score) {
                            case 1:
                                div += "<tr class='danger'>";
                                break;
                            case 2:
                                div += "<tr class='warning'>";
                                break;
                            case 3:
                                div += "<tr class='success'>";
                                break;
                            case 4:
                                div += "<tr class='info'>";
                                break;
                        }
                    } else {
                        div += "<tr>";
                    }
                    div += "<td>" + contained.itemId +"</td>";
                    div += "<td>" + moment(contained.submitTime * 1000).format('YYYY/MM/DD HH:mm:ss') +"</td>";
                    div += "<td>" + contained.previousInterval +"</td>";
                    div += "<td>" + contained.newInterval +"</td>";
                    div += "<td>" + contained.reviewTime +"</td>";
                    div += "<td>" + contained.thinkingTime +"</td>";
                    div += "<td>" + contained.score +"</td>";
                    div += "</tr>";
                }
            }
            this.$('#review-table table tbody').html(div);
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        }
    });
    
    return Review;
});