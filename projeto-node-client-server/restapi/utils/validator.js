module.exports = {
    user:(app, req, res) => {

        req.assert('_name', 'O nome é obrigatório.').notEmpty();// Valida se o campo name não está vazio
        req.assert('_email', 'O email é está invalido.').notEmpty().isEmail();

        let errors = req.validationErrors();
        if (errors) {// Se errors for true
            app.utils.error.send(errors, req, res);
            return false; // para a execução para que não ocorra o insert
        } else {
            return true;
        }
    }
};