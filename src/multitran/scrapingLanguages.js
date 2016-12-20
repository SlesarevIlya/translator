"use strict";

var needle = require('needle');
var cheerio = require('cheerio');

var URL = 'http://www.multitran.com/m.exe?a=1&all=1&l1=1';
var languages = [];

needle.get(URL, function(err, res) {
    if (err) throw err;

    var $ = cheerio.load(res.body);
    /*
    $('select[id="l1"] option').each(function() {
        languages.push({
            name: this.children[0].data,
            value: +this.attribs.value
        });
    });
    */

    $('.morelangs>a').each(function() {
        if (this.children.length != 0) {
            let language = this.children[0].data;
            let link = $(this).attr('href');
            let number = +link.substring(link.indexOf('&l1') + 4, link.indexOf('&l2'));

            languages.push({
                name: this.next == null ? language : language + " " + this.next.next.children[0].data, // transliteration
                value: number
            });
        }

    });

    languages.sort(function(a, b) {
        return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
    });
    console.log(languages);

});