var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs'); // Módulo do node que mexe com sistema de arquivos

// Quando alterar uma rota, para o servidor (CTRL C no console) e iniciar novamente(npm start)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Rota para abrir um arquivo
router.get('/file', (req, res) => {

  let path = './' + req.query.path; // Pega o caminho

  if(fs.existsSync(path)){ // Verifica se o caminho existe

    // Abre o arquivo
    fs.readFile(path, (error, data) => {

      // Se der erro ao abrir o arquivo
      if (error) {
        console.error(error);
        res.status(400).json({error: error});
      } else {

        res.status(200).end(data); // Manda como resposta o conteúdo do arquivo
      }

    });
  } else {
    res.status(404).json({error: 'File not found.'});
  }
});

// Rota para o delete de arquivo
router.delete('/file', (req, res) => {

  // Faz uso do formidable passando os parâmetros necessários: o diretório de upload e bool para manter as extensões
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => { // Interpreta os dados que estão vindo. Passa a requisição e uma arrow function com o erro, os campos e os arquivos(separa os dados enviados via POST e o que é arquivo)

    let path = "./" + fields.path; // Concatena a raiz com o path que vei do firebase

    if(fs.existsSync(path)){ // Verifica se o caminho existe

      fs.unlink(path, error => { // Delete o arquivo
        if(error){ // Caso exista um erro
          res.status(400).json({error}); // retorna o status do erro
        } else {
          res.json({// Dá uma resposta para o servidor. Envia o que vier do body da requisição em json.
            fields
          });
        }
      });
    } else {
      res.status(404).json({error: 'File not found.'});
    }
  });

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
