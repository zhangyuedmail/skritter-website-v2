/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/demo.html',
    'core/modules/GelatoPage',
    'modules/collections/TutorialCollection',
    'modules/components/Prompt'
], function(Template, GelatoPage, TutorialCollection, Prompt) {

    /**
     * @class PageDemo
     * @extends GelatoPage
     */
    var PageDemo = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.index = 0;
            this.prompt = new Prompt();
            this.tutorials = new TutorialCollection();
            this.listenTo(this.prompt, 'prompt:next', this.handlePromptNext);
        },
        /**
         * @property title
         * @type String
         */
        title: 'Tutorial - ' + i18n.global.title,
        /**
         * @property bodyClass
         * @type {String}
         */
        bodyClass: 'background-light',
        /**
         * @method render
         * @returns {PageDemo}
         */
        render: function() {
            this.renderTemplate(Template);
            this.prompt.setElement(this.$('#prompt-container'));
            this.prompt.render();
            return this;
        },
        /**
         * @method renderPrompt
         * @returns {PageDemo}
         */
        renderPrompt: function() {
            var tutorial = this.tutorials.at(this.index);
            var vocab = app.user.data.vocabs.get(tutorial.get('vocabId'));
            this.prompt.detail.$('#tutorial-title').html(tutorial.get('title'));
            if (this.language === 'chinese') {
                if (tutorial.get('module') === 'chinese-stroke-order') {
                    this.prompt.detail.$('#tutorial-buttons').html('<button id="tones-button" type="button" class="btn btn-primary">Next Tutorial: Tones</button>');
                } else {
                    this.prompt.detail.$('#tutorial-buttons').html('<button id="stroke-order-button" type="button" class="btn btn-primary">Previous Tutorial: Stroke Order</button>');
                }
            }
            this.prompt.detail.$('#tutorial-content').html(tutorial.get('content'));
            this.prompt.set(vocab.getPromptItems(tutorial.get('part')), {teaching: true});
            this.renderEvents();
            return this;
        },
        /**
         * @property events
         * @type {Object}
         */
        events: {
            'vclick #stroke-order-button': 'handleClickStrokeOrderButton',
            'vclick #tones-button': 'handleClickTonesButton'
        },
        /**
         * @method handleClickStrokeOrderButton
         * @param {Event} event
         */
        handleClickStrokeOrderButton: function(event) {
            event.preventDefault();
            this.index = this.tutorials.indexOf(this.tutorials.findWhere({module: 'chinese-stroke-order'}));
            console.log(this.index);
            this.renderPrompt();
        },
        /**
         * @method handleClickTonesButton
         * @param {Event} event
         */
        handleClickTonesButton: function(event) {
            event.preventDefault();
            this.index = this.tutorials.indexOf(this.tutorials.findWhere({module: 'chinese-tones'}));
            console.log(this.index);
            this.renderPrompt();
        },
        /**
         * @method load
         * @param {String} language
         * @returns {PageDemo}
         */
        load: function(language) {
            var self = this;
            app.dialog.show('loading');
            this.language = language || 'chinese';
            if (this.language === 'japanese') {
                this.tutorials.add(app.tutorials.getByModule('japanese-stroke-order').models);
            } else {
                this.tutorials.add(app.tutorials.getByModule('chinese-stroke-order').models);
                this.tutorials.add(app.tutorials.getByModule('chinese-tones').models);
            }
            Async.series([
                function(callback) {
                    self.tutorials.fetch(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('DEMO LOAD ERROR:', error);
                } else {
                    app.dialog.hide();
                    self.renderPrompt();
                }
            });
            return this;
        },
        /**
         * @method handlePromptNext
         */
        handlePromptNext: function() {
            this.index++;
            this.renderPrompt();
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.prompt.remove();
            return GelatoPage.prototype.remove.call(this);
        }
    });

    return PageDemo;

});