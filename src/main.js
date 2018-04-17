const {getLanguages, getWords, getTest} = require("./scraping");


// getLanguages("https://www.multitran.com/m.exe?a=1&SHL=1").then((languages) => {
//     console.log(languages);
// });

/*getWords("https://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1", "car").then((words) => {
    console.log(words);
});*/
//
getWords("https://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1", "car");
