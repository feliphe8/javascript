//let express = require('express');
//let routes = express.Router();

module.exports = (app) => {

    app.get('/',(req, res) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Hello World</h1>');
    
    });
} // exporta o routes para quem estiver chamando o arquivo index.js