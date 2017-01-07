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

    static getLanguages(URL) {

        let languages = [];
        let promise = new Promise((resolve, reject) => {

            needle.get(URL, (err, res) => {
                if (err) {
                    reject(err);
                }

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

                languages.sort((a, b) => {
                    return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
                });

                resolve(languages);
            });
        });

        return promise;
    }

    /*
     @param {String} - example 'http://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1'
     @param {String} - word to translate
     @return {Array<Object>} - List of languages
        Object - {
         name:
         value:
        }
     */

    static getWords(URL, translateWord) {

        let words = [];
        let promise = new Promise((resolve, reject) => {

            needle.get(URL, (err, res) => {
                if (err) {
                    reject(err);
                }

                let text = res.body;
                let getTable = (text) => {
                    let regexp = /<table border="0" cellspacing="0" cellpadding="0">\s*<tr><td bgcolor="#DBDBDB" colspan="2" width="700">&nbsp;(.|\s)*/;
                    let findEnd = "<a name=\"phrases\"></a>";

                    let table = regexp.exec(text);
                    let indexEnd = table[0].indexOf(findEnd);

                    return table[0].substring(0, indexEnd);
                };
                let table = getTable(text);
                let dictionary = [];

                let getListOfWords = (table) => {
                    let pos = 0;
                    let endOfFile = table.indexOf("<td bgcolor=\"#DBDBDB\" colspan=\"2\" width=\"700\">", 150);
                    table = table.substring(0, endOfFile);

                    while (true) {
                        let titleStr = "title=\"";
                        let startPosTitle = table.indexOf(titleStr, pos);
                        //if not found title
                        if (startPosTitle == -1) {

                            break;
                        }
                        startPosTitle += titleStr.length; //start index Title
                        let endPosTitle = table.indexOf("\"", startPosTitle); //end index Title
                        let titleTr = table.substring(startPosTitle, endPosTitle); //Title
                        pos = endPosTitle + 1;

                        //if not found next title then index = end of dict
                        let nextTitle = table.indexOf(titleStr, pos);
                        if (nextTitle == -1) {
                            nextTitle = endOfFile;
                        }

                        let wordsTr = [];
                        while (pos < nextTitle) {
                            let wordStr = "=" + translateWord;
                            let startPosWord = table.indexOf(wordStr, pos);

                            if (startPosWord == -1) {

                                break;
                            }

                            startPosWord += translateWord.length + 3; //start index Word
                            let endPosWord = table.indexOf("<", startPosWord); //end index Word
                            let wordTr = table.substring(startPosWord, endPosWord); //Word
                            pos = endPosWord + 1;
                            wordsTr.push(wordTr);
                        }

                        dictionary.push({
                            title: titleTr, //title translated
                            word: wordsTr //words translated
                        });
                    }
                };
                getListOfWords(table);

                resolve(dictionary);
            });
        });

        return promise;
    }
}

module.exports = Scraping;

Scraping.getLanguages("http://www.multitran.com/m.exe?a=1&all=1&l1=1").then((languages) => {
    console.log(languages);
});

Scraping.getWords("http://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1", "car").then((words) => {
    console.log(words);
});
