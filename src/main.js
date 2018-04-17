const {getLanguages, getWords} = require("./scraping");

getLanguages("https://www.multitran.com/m.exe?a=1&SHL=1");
getWords("https://www.multitran.ru/c/m.exe?CL=1&s=car&l1=1", "car");
