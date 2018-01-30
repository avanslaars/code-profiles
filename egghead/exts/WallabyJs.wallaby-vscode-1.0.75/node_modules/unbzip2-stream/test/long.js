var unbzip2Stream = require('../');
var test = require('tape');
var through = require('through');
var throughout = require('throughout');
var fs = require('fs');

test('a very large binary file piped into unbzip2-stream results in original file content', function(t) {
    t.plan(2);
    var source = fs.createReadStream('test/fixtures/vmlinux.bin.bz2');
    var unbz2 = unbzip2Stream();
    var received = 0;
    var buffers = [];
    
    unbz2.on('error', function(err) {
        console.log(err);
        //t.notOk(err.message);
    });
    
    var sink = through( function write(data) {
        received += data.length;
        buffers.push(data);
    }, function end() {
        console.log('EMD');
        var expected = fs.readFileSync('test/fixtures/vmlinux.bin');
        t.equal(received, expected.length);
        t.deepEqual(Buffer.concat(buffers), expected);
        this.queue(null);
    });
    source.pipe(throughout(unbz2,sink));
});

