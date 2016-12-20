"use strict";

var needle = require('needle');
var cheerio = require('cheerio');

var URL = 'http://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1';
var words = [];

needle.get(URL, (err, res) => {
    if (err) throw err;

    var $ = cheerio.load(res.body);

    $('a').each(() => {
        let tmp = 1;

/*        if (this.children.length != 0) {
            let language = this.children[0].data;
            let link = $(this).attr('href');
            let number = +link.substring(link.indexOf('&l1') + 4, link.indexOf('&l2'));

            languages.push({
                name: this.next == null ? language : language + " " + this.next.next.children[0].data, // transliteration
                value: number
            });
        }*/

    });

/*    languages.sort((a, b) => {
        return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
    });
    console.log(languages);*/

});