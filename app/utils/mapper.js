const map = require('../data/base-map.js');

/**
 * @method fromBase
 * @param {String} base
 * @returns {String}
 */
function fromBase(base) {
  const splitBase = base.split('-');
  const splitBaseRunes = splitBase[1].split('');
  const language = splitBase[0];
  const variation = parseInt(splitBase[2], 10);
  let rune = '';

  if (language === 'zh') {
    for (let i = 0, length = splitBaseRunes.length; i < length; i++) {
      const splitBaseRune = splitBaseRunes[i];
      const splitMatchedRune = map[splitBaseRune];

      if (variation !== 0 && splitMatchedRune) {
        const offset = variation > 1 ? 2 : 1;

        console.log(splitBaseRune, splitMatchedRune[1], offset);

        rune += splitMatchedRune[variation - offset];
      } else {
        rune += splitBaseRune;
      }
    }
  } else {
    rune = splitBase[1];
  }

  return rune;
}
/**
 * @method toBase
 * @param {String} word
 * @param {Object} [options]
 * @returns {String}
 */
function toBase(word, options) {
  const mappedRunes = [];
  const runes = word.split('');
  let multiple = false;
  let style = 'simp';
  let variation = 0;

  //set default option values
  options = _.defaults(options, {
    lang: 'zh'
  });

  //return base variations for japanese
  if (options.lang === 'ja') {
    return ['ja', word, '0'].join('-');
  }

  //cycle through each rune in a word
  for (let i in runes) {
    //get the mapped information for the rune
    for (let key in map) {
      //check the map values for the rune
      const valueIndex = map[key].indexOf(runes[i]) + 1;

      if (valueIndex > 0) {
        //flag trad variants that map to multiple runes
        mappedRunes.push(key);
        variation = variation < valueIndex ? valueIndex : variation;

        if (key !== runes[i])
          style = 'trad';
        if (map[key].split('').length > 1) {
          multiple = true;

          break;
        }
      }
    }
    //push the simp rune if no match was found
    if (!mappedRunes[i]) {
      mappedRunes.push(runes[i]);
    }
  }

  //determines the variation based on mapping results
  if (runes.length === 1) {
    if (style === 'simp') {
      variation = 0;
    } else {
      if (multiple) {
        variation = variation + 1;
      } else {
        variation = 1;
      }
    }
  } else {
    if (style === 'simp') {
      variation = 0;
    } else {
      if (multiple) {
        variation = 2;
      } else {
        variation = 1;
      }
    }
  }

  return ['zh', mappedRunes.join(''), variation].join('-');
}

/**
 * @method toSimplified
 * @param {String} word
 * @returns {String}
 */
function toSimplified(word) {
  const result = [];

  _.forEach(word.split(''), function(character) {
    const key = _.findKey(map, function(value) {
      return _.includes(value, character);
    });

    result.push(key || character);
  });

  return result.join('');
}

/**
 * Takes a list of simplified Chinese characters and gives a list of
 * possible traditional Chinese permutations.
 * @method toTraditional
 * @param {String} wordString
 * @returns {Array}
 */
function toTraditional(wordString) {
  let words = [''];

  const simplifiedString = toSimplified(wordString);
  simplifiedString.split('').forEach(function(c) {
    const trads = simpCharToTrad(c, true);
    const tradWords = [];

    words.forEach(function(w) {
      trads.forEach(function(t) {
        tradWords.push(w + t);
      });
    });

    words = tradWords;
  });

  return words;
}

/**
 * Converts a single simplified Chinese character to its corresponding
 * traditional variant(s).
 * @param {string} character a single simplified Chinese character
 * @param {boolean} [multiples] whether to return a list of multiple traditional
 *                              characters if a simplified character corresponds
 *                              to more than one traditional character
 * @returns {string|string[]} the traditional version(s) of the simplified character
 */
function simpCharToTrad(character, multiples) {
  const tradList = map[character];

  if (!tradList) {
    return (multiples) ? [character] : character;
  }

  if (multiples) {
    return tradList.split('');
  }

  return tradList[0];
}

module.exports = {
  fromBase: fromBase,
  toBase: toBase,
  toSimplified: toSimplified,
  toTraditional: toTraditional,
  simpCharToTrad: simpCharToTrad
};
