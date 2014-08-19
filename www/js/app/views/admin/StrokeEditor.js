/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "require.text!templates/admin-stroke-editor.html",
    "app/views/prompts/Canvas"
], function(GelatoPage, template, PromptCanvas) {
    return GelatoPage.extend({
        /**
         * @class ViewStrokeEditor
         * @extends GelatoPage
         * @constructor
         */
        initialize: function() {
            this.canvas = new PromptCanvas();
            this.paramIndex = undefined;
            this.stroke = undefined;
            this.strokeId = undefined;
        },
        /**
         * @property title
         * @type String
         */
        title: "Stroke Editor",
        /**
         * @method render
         * @returns {ViewStrokeEditor}
         */
        render: function() {
            this.$el.html(this.compile(template));
            this.canvas.setElement(this.$(".canvas-container")).render();
            this.resize();
            this.renderStroke();
            return this;
        },
        /**
         * @method renderStroke
         * @returns {ViewStrokeEditor}
         */
        renderStroke: function() {
            app.router.navigate("admin/stroke/" + this.strokeId);
            this.params = app.user.data.params.where({strokeId: this.strokeId});
            this.stroke = app.assets.getStroke(this.strokeId);
            this.canvas.clearAll();
            this.canvas.drawShape("stroke", this.stroke);
            this.loadDetails();
            this.loadParams();
            return this;
        },
        /**
         * @method loadDetails
         */
        loadDetails: function() {
            this.$(".stroke-id").text(this.strokeId);
            this.$(".stroke-height").text(this.stroke.getBounds().height);
            this.$(".stroke-width").text(this.stroke.getBounds().width);
        },
        /**
         * @method loadParams
         */
        loadParams: function() {
            var param = this.params[this.paramIndex];
            if (param) {
                app.router.navigate("admin/stroke/" + this.strokeId + "/" + this.paramIndex);
                for (var i = 0, length = param.get("corners").length; i < length; i++) {
                    this.canvas.drawCircle("overlay", param.get("corners")[i].x, param.get("corners")[i].y, 10, {fill: "red"});
                }
                this.$(".stroke-param").text(this.paramIndex);
                this.$(".stroke-json").text(JSON.stringify(param.toJSON()));
            } else {
                this.$(".stroke-param").text("none");
            }
        },
        /**
         * @method resize
         * @returns {ViewStrokeEditor}
         */
        resize: function() {
            this.canvas.resize(this.getContent().height() - 4);
            return this;
        },
        /**
         * @method set
         * @returns {ViewStrokeEditor}
         */
        set: function(strokeId, paramIndex) {
            this.strokeId = strokeId ? parseInt(strokeId, 10) : 0;
            this.paramIndex = paramIndex ? parseInt(paramIndex, 10) : 0;
            return this;
        }
    });
});
