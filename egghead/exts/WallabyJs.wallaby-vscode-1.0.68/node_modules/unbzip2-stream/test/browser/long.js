var http = require('http');
var unbzip2Stream = require('../../');
var through = require('through');
var concat = require('concat-stream');
var test = require('tape');
var fs = require('fs');

test('http stream piped into unbzip2-stream results in original file content', function(t) {
    t.plan(1);

    http.get({path: '/test/fixtures/vmlinux.bin.bz2', responseType: "arraybuffer"}, function(res) {
        res.pipe( unbzip2Stream() ).pipe(
            concat(function(data) {
                var expected = fs.readFileSync('test/fixtures/vmlinux.bin');
                t.equal(data.length, expected.length);
            })
        );
    });
});
