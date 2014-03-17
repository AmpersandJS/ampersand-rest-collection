var Collection = require('ampersand-collection');
var underscoreMixins = require('./underscoreMixins');
var restMixins = require('./restMixins');


module.exports = Collection.extend(underscoreMixins, restMixins);
