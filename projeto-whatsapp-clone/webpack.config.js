// Arquivo de configuração do Webpack

// Utilizando o modulo path para não dar problema com o caminho
const path = require('path');

module.exports = {
    entry: {
        app: './src/app.js', // Arquivo de entrada do app
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js' // Arquivo de entra do pdf worker js
    },
    output: {
        filename: '[name].bundle.js', // Arquivo compilado de todos os .js finais [name] vem das chaves do entry(app e pdf.worker)
        path: path.join(__dirname, 'dist'), // Junta o dist com o que a gente já tem
        publicPath: 'dist' // Pasta publica de distribuição
    }
}