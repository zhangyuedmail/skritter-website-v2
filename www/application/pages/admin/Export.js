/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/admin/export.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageExport
     * @extends BasePage
     */
    var PageExport = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Export';
            this.data = undefined;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageExport}
         */
        render: function() {
            var self = this;
            this.$el.html(this.compile(TemplateMobile));
            this.resize();
            //load all data for output processing
            app.user.data.loadAll(function(data) {
                self.data = data;
                self.process();
            });
            return this;
        },
        /**
         * @method process
         */
        process: function() {
            console.log('DATA', this.data);
            var decomps = this.data.Decomps;
            var items = this.data.Items;
            var sentences = this.data.Sentences;
            var srsconfigs = this.data.SRSConfigs;
            var strokes = this.data.Strokes;
            var vocablists = this.data.VocabLists;
            var vocabs = this.data.Vocabs;
            var output = [];
            for (var i = 0, length = vocabs.length; i < length; i++) {
                var vocab = vocabs[i];
                output.push({
                    _id: vocab.id,
                    audio: vocab.audio ? vocab.audio.replace('/sounds?file=', '') : null,
                    banned: vocab.bannedParts.length ? true: false,
                    definitions: vocab.definitions,
                    reading: vocab.reading,
                    starred: vocab.starred,
                    writing: vocab.writing
                });
            }
            this.$('#output').val(JSON.stringify(output));
            this.cAuth();
        },
        /**
         * @method resize
         * @returns {PageExport}
         */
        resize: function() {
            this.$('#output').css({
                height: '99%',
                width: '100%'
            });
            return this;
        }
    });

    return PageExport;
});
