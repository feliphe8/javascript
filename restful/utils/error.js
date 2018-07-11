module.exports = {
    send: (err, req, res, code = 400) => {
                
            console.log(`error: ${err}`);
            res.status(400).json({ // Mostra o erro pro usuário que fez a solicitação
                    error:err
            });
    }
};