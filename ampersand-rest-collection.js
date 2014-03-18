var Collection = require('ampersand-collection');
var underscoreMixin = require('ampersand-collection-underscore-mixin');
var restMixins = require('./restMixins');


module.exports = Collection.extend(underscoreMixin, restMixins);
