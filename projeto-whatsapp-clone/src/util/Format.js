class Format {

    static getCamelCase(text){

        // Cria uma div apenas para gerar o data-set que já passa pro JS como CamelCase.
        let div = document.createElement('div');

        // Atribui a div criada uma outra div com um dataset onde o nome desse data-set será o que vier no parâmetro
        div.innerHTML = `<div data-${text} = "id"></div>`;

        // Retorna um array com todas as chaves que ele encontrar em um determinado objeto.
        return Object.keys(div.firstChild.dataset)[0]; // Pega o primeiro filho da div criada nesse método.No caso é a div atribuida no innerHTML e retorna o dataset na posição 0
    }
}