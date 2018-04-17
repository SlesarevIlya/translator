const express = require("express");
const {getLanguages} = require("./src/scraping");

const app = express();

app.get('/', (req, res) => {
    res.send("Hello in Beauty Tran!");
});

app.get("/languages", (req, res) => {
    getLanguages()
        .then((languages) => {
            res.send(languages);
        })
});

app.listen(3000);