"use strict";

const needle = require("needle");
const cheerio = require('cheerio');

const getLanguages = (URL) => {

    const promise = new Promise((resolve, reject) => {

        needle.get(URL, (err, res) => {
            if (err) {
                reject(err);
            }

            let $ = cheerio.load(res.body);
            let languages = [];

            $('.morelangs>a').each(function() {
                if (this.children.length !== 0) {
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
};

const getWords = (URL, translateWord) => {
    needle("get", URL)
        .then((resp) => {
            const table = getTable(resp.body);
            return getListOfWords(table, translateWord);
        })
        .then((dictionary) => {
            console.log(dictionary); // do something with dictionary
        })
        .catch((err) => {
            console.log(err);
        });
};

const getListOfWords = (table, translateWord) => {
    let pos = 0;
    let dictionary = [];

    const endOfFile = table.indexOf("<td bgcolor=\"#DBDBDB\" colspan=\"2\" width=\"700\">", 150);
    table = table.substring(0, endOfFile);

    while (true) {
        const titleStr = "title=\"";
        let startPosTitle = table.indexOf(titleStr, pos);
        if (startPosTitle === -1) { //Title not found
            break;
        }
        startPosTitle += titleStr.length; //start of Title
        const endPosTitle = table.indexOf("\"", startPosTitle); //end of Title
        const titleTr = table.substring(startPosTitle, endPosTitle); //Title
        pos = endPosTitle + 1;

        //if not found next title then index = end of dictionary
        let nextTitle = table.indexOf(titleStr, pos);
        if (nextTitle === -1) {
            nextTitle = endOfFile;
        }

        let wordsTr = [];
        while (pos < nextTitle) {
            const wordStr = "=" + translateWord;
            let startPosWord = table.indexOf(wordStr, pos);
            if (startPosWord === -1) {
                break;
            }
            startPosWord += translateWord.length + 3; //start of Word
            const endPosWord = table.indexOf("<", startPosWord); //end of Word
            const wordTr = table.substring(startPosWord, endPosWord); //Word
            pos = endPosWord + 1;
            wordsTr.push(wordTr);
        }

        dictionary.push({
            title: titleTr, //title translated
            word: wordsTr //words translated
        });
    }

    return dictionary;
};

const getTable = (text) => {
    const regexp = /<table border="0" cellspacing="0" cellpadding="0">\s*<tr><td bgcolor="#DBDBDB" colspan="2" width="700">&nbsp;(.|\s)*/;
    const endLine = "<a name=\"phrases\"></a>";

    const table = regexp.exec(text);
    const indexEndLine = table[0].indexOf(endLine);

    return table[0].substring(0, indexEndLine);
};


module.exports.getLanguages = getLanguages;
module.exports.getWords = getWords;