module.exports = {
  /**
   * Takes text with formatting characters and turns it into its corresponding HTML representation.
   * @param {String} text the plaintext to convert to limited HTML
   * @return {String} a HTML formatted string with correct bold, italics, newlines, and images
   */
  textToHTML: function(text) {
    var html = text.replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')  // img:http://...
        .replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')    // _italicizes_ it
        .replace(/\n/gi, '<br/>')                               // newlines
        .replace(/\*([^*]+)\*/gi, '<b>$1</b>');                  // *bolds* it

    return html;
  },

  htmlToText: function(mnem) {
    mnem = mnem.replace(/<img src="(http:\/\/\S+)"\/?>/gi, 'img:$1')
        .replace(/<br\/?>/gi, '\n')
        .replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<em>(.*?)<\/em>/gi, '_$1_')
        .replace(/<span class="other_mnem_byline">.*?<\/span>/gi, '');

    return mnem;
  }
};
