# ampersand-rest-collection

Extends ampersand-collection with REST and Underscore mixins.

This makes ampersand-collection work and act a lot like Backbone.Collection, if youre planning on hitting a REST-ful API this is probably what you want to use.

<!-- starthide -->
## browser support

[![testling badge](https://ci.testling.com/AmpersandJS/ampersand-rest-collection.png)](https://ci.testling.com/AmpersandJS/ampersand-rest-collection)

Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.
<!-- endhide -->

## Install

```
npm install ampersand-rest-collection
```

<!-- starthide -->
## example

Define a collection

```javascript
var Collection = require("ampersand-rest-collection");
var Model = require("some-model");


module.exports = Collection.extend({
    model: Model,
    url: "/models"
});
```

Using it:

```javascript
var Collection = require("./path-to-your-collection-module");


var c = new Collection();

// call RESTful methods
c.fetch();

// also has underscore mixins
c.each(function (model) {
    console.log("model:", model);
});
```
<!-- endhide -->

## API Reference

The ampersand-rest-collection is simply an [ampersand-collection](#ampersand-collection) extended with two mixins: ampersand-collection-rest-mixin and ampersand-collection-underscore-mixin.

```javascript
var Collection = require("ampersand-collection");
var underscoreMixin = require("ampersand-collection-underscore-mixin");
var restMixins = require("ampersand-collection-rest-mixin");

module.exports = Collection.extend(underscoreMixin, restMixins);
```

### ajaxConfig `AmpersandRestCollection.extend({ ajaxConfig: function () { ... } })`

ampersand-sync will call ajaxConfig on your collection before it makes the request to the server, and will merge in any options you return to the request. When extending your own collection, set an ajaxConfig function to modify the request before it goes to the server.

ajaxConfig can either be an object, or a function that returns an object, with the following options:

* `useXDR` [boolean]: (applies to IE8/9 only with cross domain requests): signifies that this is a cross-domain request and that IE should use it's XDomainRequest object. This is required if you're making cross-domain requests and want to support IE8/9). Note that XDR doesn't support headers/withCredentials.
* `headers` [object]: any extra headers to send with the request.
* `xhrFields` [object]: any fields to set directly on the [XHR](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest) request object, most typically:
    * `withCredentials` [boolean]: whether to send cross domain requests with authorization headers/cookies. Useful if you're making cross sub-domain requests with a root-domain auth cookie.
* `beforeSend` [function]: beforeSend will be called before the request is made, and will be passed the raw `xhr` object if you wish to modify it directly before it's sent.

```javascript
var MyCollection = AmpersandRestCollection.extend({
    url: 'http://otherdomain.example.com/stuff',

    ajaxConfig: function () {
        return {
            headers: {
                'Access-Token': this.accessToken
            },
            xhrFields: {
                withCredentials: true
            }
        };
    }
});

var collection = new MyCollection()
collection.fetch();
```

### fetch `collection.fetch([options])`

Fetch the default set of models for the collection from the server, [setting](#ampersand-collection-set) them on the collection when they arrive. If the collection already contains data, by default, the operation of [set](#ampersand-collection-set) will add new models from the server, merge the attributes of existing ones, and remove any which aren't in the response. This behaviour can be modified with the `reset`, `add`, `remove`, `merge` options.

Options:

* `success` {Function} [optional] - callback to be called if the request was successful, will be passed `(collection, response, options)` as arguments.
* `error` {Function} [optional] - callback to be called if the request was not successful, will be passed `(collection, response, options)` as arguments.
* `reset` {Boolean} [optional] - call [reset](#ampersand-collection-reset) instead of set with the models returned from the server, _defaults to false_.
* `add` {Boolean} [optional] - (assuming `reset` is false), `{add: false}` prevents the call to `set` from adding new models retrieved from the server that aren't in the local collection. _Defaults to false_
* `remove` {Boolean} [optional] - (assuming `reset` is false), `{remove: false}` prevents the call to `set` from removing models that are in the local collection but aren't returned by the server. _Defaults to false_
* `merge` {Boolean} [optional] - (assuming `reset` is false), `{merge: false}` prevents the call to `set` from updating models in the local collection which have changed on the server. _Defaults to false_

You can also pass any options that [xhr](https://github.com/Raynos/xhr) expects to modify the query. For example: to fetch a specific page of a paginated collection: `collection.fetch({ data: { page: 3 } })`

### getOrFetch `collection.getOrFetch('id', [options], callback)`

Convenience method for gets a model from the server or from the collection if it's already has a model with that id.

By default it will only fetch and add the model with the ID you pass in.

```js
collection.getOrFetch('42', function (err, model) {
    if (err) {
        console.log('handle');
    } else {
        // `model` here is a fully inflated model
        // It gets added to the collection automatically.
        // If the collection was empty before, it's got 1
        // now.
    }
});
```

If you pass `{all: true}` it will fetch the entire collection (by calling its `fetch` method) and then do a `get` to attempt to pull out the model by the `id` you specified.

```js
collection.getOrFetch('42', {all: true}, function (err, model) {
    if (err) {
        console.log('handle');
    } else {
        // `model` here is a fully inflated model
        // It gets added to the collection automatically.
    }
});
```

### fetchById `collection.fetchById('id', callback)`

Fetches and adds a model by id to the collection. This is what `getOrFetch` uses if it doesn't have a model already.

```js
collection.fetchById('42', function (err, model) {
    // returns inflated, added model with a `null` error
    // or an error object.
});
```

### create `collection.create(model, [options])`

Convenience to create a new instance of a model within a collection. Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created. Returns the new model. If client-side validation failed, the model will be unsaved, with validation errors. In order for this to work, you should set the `model` property of the collection. The create method can accept either an attributes hash or an existing, unsaved model object.

Creating a model will cause an immediate ``"add"`` event to be triggered on the collection, a `"request"` event as the new model is sent to the server, as well as a `"sync"` event, once the server has responded with the successful creation of the model. Pass `{wait: true}` if you'd like to wait for the server before adding the new model to the collection.

```
var Library = AmpersandRestCollection.extend({
  model: Book
});

var library = new Library;

var othello = library.create({
  title: "Othello",
  author: "William Shakespeare"
});
```

### sync `model.sync(method, collection, [options])`

Simple delegation to ampersand-sync to persist the collection to the server. Can be overridden for custom behaviour.

### underscore methods (42)

The ampersand-collection-underscore-mixin proxies the collection methods in underscore onto the underlying models array for the collection. For example:

```javascript
books.each(function(book) {
  book.publish();
});

var titles = books.map(function(book) {
  return book.get("title");
});

var publishedBooks = books.filter(function(book) {
  return book.get("published") === true;
});

var alphabetical = books.sortBy(function(book) {
  return book.author.get("name").toLowerCase();
});
```

The full list of proxied methods is:

* [forEach](http://underscorejs.org#forEach)
* [each](http://underscorejs.org#each)
* [map](http://underscorejs.org#map)
* [collect](http://underscorejs.org#collect)
* [reduce](http://underscorejs.org#reduce)
* [foldl](http://underscorejs.org#foldl)
* [inject](http://underscorejs.org#inject)
* [reduceRight](http://underscorejs.org#reduceRight)
* [foldr](http://underscorejs.org#foldr)
* [find](http://underscorejs.org#find)
* [detect](http://underscorejs.org#detect)
* [filter](http://underscorejs.org#filter)
* [select](http://underscorejs.org#select)
* [reject](http://underscorejs.org#reject)
* [every](http://underscorejs.org#every)
* [all](http://underscorejs.org#all)
* [some](http://underscorejs.org#some)
* [any](http://underscorejs.org#any)
* [include](http://underscorejs.org#include)
* [contains](http://underscorejs.org#contains)
* [invoke](http://underscorejs.org#invoke)
* [max](http://underscorejs.org#max)
* [min](http://underscorejs.org#min)
* [toArray](http://underscorejs.org#toArray)
* [size](http://underscorejs.org#size)
* [first](http://underscorejs.org#first)
* [head](http://underscorejs.org#head)
* [take](http://underscorejs.org#take)
* [initial](http://underscorejs.org#initial)
* [rest](http://underscorejs.org#rest)
* [tail](http://underscorejs.org#tail)
* [drop](http://underscorejs.org#drop)
* [last](http://underscorejs.org#last)
* [without](http://underscorejs.org#without)
* [difference](http://underscorejs.org#difference)
* [indexOf](http://underscorejs.org#indexOf)
* [shuffle](http://underscorejs.org#shuffle)
* [lastIndexOf](http://underscorejs.org#lastIndexOf)
* [isEmpty](http://underscorejs.org#isEmpty)
* [chain](http://underscorejs.org#chain)
* [sample](http://underscorejs.org#sample)
* [partition](http://underscorejs.org#partition)

<!-- starthide -->
## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT

<!-- endhide -->
