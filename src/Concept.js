"use strict";

const request = require('request');

class Concept {

    /*
     @param {String} - word for get concept
     @return {Array<Object>} - List of concepts in numbers
        Object - {
         name:
         value:
        }
    */

    static getConcepts(instance) {
        /*
         request example
         concept.research.microsoft.com/api/Concept/ScoreByProb?instance=microsoft&topK=10&api_key={YOUR API-KEY HERE}
         */
        let URL =  "https://concept.research.microsoft.com/api/Concept/ScoreByProb?";
        let topK = "5";
        let api_key = "ehUUyRtEhfoOEwqXruoFwcne8lh7S1OV";

        URL += "instance=" + instance + "&topK=" + topK + "&api_key=" + api_key;

        let promise = new Promise((resolve, reject) => {

            request(URL, function (error, response, body) {
                let concepts = [];

                if (!error && response.statusCode == 200) {
                    body = body.split("\"");
                    let i = 1;
                    while (i < body.length) {
                        let name = body[i];
                        let value = body[i + 1].substring(1, body[i + 1].length - 1);
                        concepts.push({
                            name: name,
                            value: value
                        });
                        i += 2;
                    }
                } else {
                    reject(error);
                }

                resolve(concepts)
            });
        });

        return promise;
    }
}

module.exports = Concept;

Concept.getConcepts("microsoft").then((concepts) => {
    console.log(concepts);
});