const {getLanguages, getWords} = require("./scraping");

// getLanguages()
//     .then((languages) => {
//         console.log(languages);
//     });

getWords("https://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1", "car")
    .then((dictionary) => {
        console.log(dictionary);
    });
