var test = require('tape');
var Collection = require('../ampersand-rest-collection');


test('basics', function (t) {
    var Coll = Collection.extend({
        url: '/test'
    });
    var c = new Coll();
    t.ok(c);
    c.fetch();
    t.end();
});
