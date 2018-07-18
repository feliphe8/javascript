// Arquivo de configuração do Webpack

// Utilizando o modulo path para não dar problema com o caminho
const path = require('path');

module.exports = {
    entry: './src/app.js', // Arquivo de entrada
    output: {
        filename: 'bundle.js', // Arquivo compilado de todos os .js finais
        path: path.resolve(__dirname, '/dist'), // A partir da pasta fisica que ele esta(dirname), traz o /dist
        publicPath: 'dist' // Pasta publica de distribuição
    }
}