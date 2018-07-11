//let express = require('express');
//let routes = express.Router();


let NeDB = require('nedb');
let db = new NeDB({
    filename:'users.db',
    autoload:true
});


module.exports = (app) => {


    let route = app.route('/users'); // definindo a rota principal do arquivo

    route.get((req,res) => {

        db.find({}).sort({name: 1}).exec((err, users) => {

            if(err){
                app.utils.error.send(err, req, res); // chama a função send do arquivo error.js na pasta utils
            } else {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users//: users - quando a chave é o mesmo nome da váriavel basta colocar uma vez
                });
            }
        }); // sort by name de forma ascendente. -1 para desc
    });
    
    route.post((req,res) => {
        

        if(!app.utils.validator.user(app, req, res)) return false; // return false interrompe o app

        db.insert(req.body, (err, user) => {

            if(err){ // Se erro for true

                app.utils.error.send(err, req, res); // chama a função send do arquivo error.js na pasta utils

            } else { // Sucesso
                res.status(200).json(user);
            }
        });
    });

    let routeId = app.route('/users/:id');

    routeId.get((req, res) => {

        db.findOne({_id: req.params.id}).exec((err, user) => {

            if(err){

                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }

        }); // o parâmetro é de acordo com a rota, no caso o routeId é apenas o id
    });

    routeId.put((req, res) => {

        if(!app.utils.validator.user(app, req, res)) return false; // return false interrompe o app

        // req.body recupera os dados
        db.update({_id: req.params.id}, req.body, err => {

            if(err){

                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body)); // junta o req.params que está o id com o req.body que contêm outras informações
            }

        });
    });

    routeId.delete((req, res) => {

        db.remove({_id: req.params.id}, {}, err => {

            if(err){

                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });

};