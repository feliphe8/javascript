var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Rota para o upload de arquivos
router.post('/upload', (req, res) => {

  // Faz uso do formidable passando os parâmetros necessários: o diretório de upload e bool para manter as extensões
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => { // Interpreta os dados que estão vindo. Passa a requisição e uma arrow function com o erro, os campos e os arquivos(separa os dados enviados via POST e o que é arquivo)

    res.json({// Dá uma resposta para o servidor. Envia o que vier do body da requisição em json.
      files
    });
  });

});

module.exports = router;
