var test = require('tape');
var Collection = require('../ampersand-rest-collection');


// NOTE: this module simply pulls together other modules, the tests are
// intentionally light here because it doesn't do much.

test('existance of fetch methods basic functionality etc.', function (t) {
    var Coll = Collection.extend({
        url: '/test'
    });
    var c = new Coll();
    t.ok(c);
    c.fetch();
    t.ok(c.each);
    t.end();
});

test('existance of underscore methods', function (t) {
    var c = new Collection();
    t.ok(c.find);
    t.ok(c.filter);
    t.end();
});
