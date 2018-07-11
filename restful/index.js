// Toda vez que fizer uma alteração no arquivo principal, parar o servidor e startar novamente - Utilizar nodemon para n ter que ficar fazendo isso
// npm install nodemon -g (-g = global)
// nodemon index
// Rodar o comando npm init para gerar o package.json
// npm install express --save (o --save faz com que o arquvio package.json seja alterado com a nova dependência)
// npm install consign --save - para rotas
// npm install body-parser --save - printar o body
// npm install nedb --save - db
// npm install express-validator --save - pacote para validação

//const http = require('http'); // carrega o módulo http

//let server = http.createServer((req, res) => { // Cria o servidor - informações de solicitações ficam na variável req

    // Printa quando uma requisição é feita
    //console.log('URL:', req.url); // Printa qual url foi chamada
   // console.log('METHOD: ', req.method); // Printa qual método foi chamado

    //res.end('Ok'); // Printa no navegador

    //switch(req.url){
       // case '/':

          //  res.statusCode = 200;
           // res.setHeader('Content-Type', 'text/html');
           // res.end('<h1>Hello World</h1>');
           // break;

        //case '/users':

            //res.statusCode = 200;
           // res.setHeader('Content-Type', 'application/json');
           // res.end(JSON.stringify({
             //   users: [{
             //       name: 'Feliphe',
            //        email: 'feliphe@email.com',
             //       id: 1
              //  }]
           // }));
   // }
//});

const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

//let routesIndex = require('./routes/index');
//let routesUsers = require('./routes/users');

let app = express(); // retorna toda a aplicação


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());

consign().include('routes').include('utils').into(app); // Inclui todas as rotas em app

//app.use(routesIndex); // faz uso da rota /
//app.use('/users', routesUsers); // faz uso da rota /users



app.listen(3000, '127.0.0.1', () =>{
    console.log('Servidor rodando!');
});