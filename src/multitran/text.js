var fs     = require('fs');
const needle = require('needle');

var url  = 'http://ibl.gamechaser.net/f/tagqfxtteucbuldhezkz/bt_level1.gz';

var resp = needle.get(url);
console.log('Downloading...');

resp.on('readable', function(res) {

    while (data = this.read()) {
        var lines = data.toString().split('\n');
        console.log(lines);
        console.log('Got ' + lines.length + ' items.');
        // console.log(lines);
        var res = lines.join();
    }

})

console.log(res);

resp.on('end', function(data) {
    console.log('Done');
})