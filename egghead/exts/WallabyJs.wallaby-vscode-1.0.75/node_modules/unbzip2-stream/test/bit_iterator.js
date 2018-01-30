var test = require('tape');
var bitIterator = require('../lib/bit_iterator');

test('should return the correct bit pattern across byte boundaries', function(t) {
    t.plan(5);

    var bi = bitIterator(function() {
        return new Buffer([0x0f,0x10,0x01,0x80]);
    });

    t.equal(bi(16), 0x0f10);
    t.equal(bi(7), 0x0);
    t.equal(bi(2), 0x03);
    t.equal(bi(7), 0x0);
    t.equal(bi.bytesRead, 5);
});

test('should correctly switch from one buffer to the next', function(t) {
    t.plan(4);

    var i = 0;
    var buffs = [[0x01],[0x80]];
    var bi = bitIterator(function() {
        return buffs[i++];
    });

    t.equal(bi(7), 0x0);
    t.equal(bi(2), 0x03);
    t.equal(bi(7), 0x0);
    t.equal(bi.bytesRead, 3);
});

test('each iterator has an independent bytesRead property', function(t) {
    t.plan(6);

    var i = 0, ii = 0;
    var buffs = [[0x01],[0x80]];
    var bi1 = bitIterator(function() {
        return buffs[i++];
    });
    var bi2 = bitIterator(function() {
        return buffs[ii++];
    });

    t.equal(bi1.bytesRead, 1);
    t.equal(bi2.bytesRead, 1);
    bi1(9);
    t.equal(bi1.bytesRead, 2);
    t.equal(bi2.bytesRead, 1);
    bi2(7);
    t.equal(bi1.bytesRead, 2);
    t.equal(bi2.bytesRead, 1);
});
