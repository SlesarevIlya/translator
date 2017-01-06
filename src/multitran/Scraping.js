"use strict";
//use https://habrahabr.ru/post/301426/

const needle = require('needle');
const cheerio = require('cheerio');

//const URL = 'http://www.multitran.com/m.exe?a=1&all=1&l1=1';

class Scraping {

    /*
     @param {String} - example 'http://www.multitran.com/m.exe?a=1&all=1&l1=1'
     @return {Array<Object>} - List of languages
        Object - {
         name:
         value:
        }
    */

    static getLanguages() {

        let URL = 'http://www.multitran.com/m.exe?a=1&all=1&l1=1';
        let languages = [];

        needle.get(URL, function(err, res) {
            if (err) throw err;

            let $ = cheerio.load(res.body);

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

            /*languages.sort(function (a, b) {
                return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
            });*/

            languages.sort((a, b) => {
                return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
            });
        });

        return languages;
    }

    /*
     @param {String} - example 'http://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1'
     @return {Array<Object>} - List of languages
        Object - {
         name:
         value:
        }
     */

    static getWords(URL) {

        let words = [];

        needle.get(URL, (err, res) => {
            if (err) throw err;

            let text = res.body;
            let getTable = (text) => {
                let regexp = /<table border="0" cellspacing="0" cellpadding="0">\s*<tr><td bgcolor="#DBDBDB" colspan="2" width="700">&nbsp;(.|\s)*/;
                let findEnd = "<a name=\"phrases\"></a>";

                let table = regexp.exec(text);
                let indexEnd = table[0].indexOf(findEnd);

                return table[0].substring(0, indexEnd);
            };
            let table = getTable(text);
            console.log(table);

            let getListOfWords = (table) => {
                console.log(table);
                let regexp = /"*"/;
                let word = regexp.exec(table);
                console.log(word);
            };

            let pos = 0;
            while (false) {
                let foundPos = table.indexOf("title=\"", pos);
                if (foundPos == -1) {
                    break;
                }
            }

            //words = table;
            console.log(words);
        });

        return words;
    }
}

module.exports = Scraping;

//let a = Scraping.getLanguages("http://www.multitran.com/m.exe?a=1&all=1&l1=1");
let a = Scraping.getWords("http://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1");
//console.log(a);
