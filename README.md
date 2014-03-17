# ampersand-rest-collection

Extends ampersand-collection with REST and Underscore mixins.

This makes ampersand-collection work and act a lot like Backbone.Collection, if you're planning on hitting a REST-ful API this is probably what you want to use.

## install

```
npm install ampersand-rest-collection
```

## example

Define a collection

```javascript
var Collection = require('ampersand-rest-collection');
var Model = require('some-model');


module.exports = Collection.extend({
    model: Model,
    url: '/models'
});
```

Using it:

```javascript
var Collection = require('./path-to-your-collection-module');


var c = new Collection();

// call RESTful methods
c.fetch();

// also has underscore mixins
c.each(function (model) {
    console.log('model:', model);
});
```

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT

