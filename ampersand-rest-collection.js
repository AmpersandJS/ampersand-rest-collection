/*$AMPERSAND_VERSION*/
var Collection = require('ampersand-collection');
var lodashMixin = require('ampersand-collection-lodash-mixin');
var restMixins = require('ampersand-collection-rest-mixin');


module.exports = Collection.extend(lodashMixin, restMixins);
