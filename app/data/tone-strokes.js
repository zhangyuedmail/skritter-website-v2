/**
 * @property data
 * @type {Object}
 */
const data = [
  {
    lang: 'zh',
    rune: 'tones',
    strokes: [
      [[383, 0.20, 0.20, 0.0018, 0.002, 0.0]],
      [[384, 0.25, 0.25, 0.0018, 0.0015, 0.0]],
      [[385, 0.15, 0.20, 0.002, 0.0022, 0.0]],
      [[386, 0.25, 0.25, 0.0016, 0.0016, 0.0]],
      [[387, 0.40, 0.40, 0.0022, 0.0026, 0.0]]
    ]
  }
];

module.exports = {
  getData: function() {
    return _.map(
      data,
      function (row) {
        const strokeData = _
          .chain(row.strokes)
          .flatten()
          .map(
            function (stroke, index) {
              return {
                strokeId: index,
                shapeId: stroke[0],
                x: stroke[1],
                y: stroke[2],
                scaleX: stroke[3],
                scaleY: stroke[4],
                rotation: stroke[5]
              };
            }
          )
          .value();

        let count = -1;
        const strokeVariations = _
          .chain(row.strokes)
          .map(
            function (stroke, index) {

              return {
                variationId: index,
                strokeIds: _.map(
                  stroke,
                  function () {
                    count++;

                    return count;
                  }
                )
              }
            }
          )
          .value();

        return {
          languageCode: row.lang,
          strokeData: strokeData,
          strokeVariations: strokeVariations,
          writing: row.rune
        };
      }
    );
  }
};
