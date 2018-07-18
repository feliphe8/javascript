export class Format {

    static getCamelCase(text){

        // Cria uma div apenas para gerar o data-set que já passa pro JS como CamelCase.
        let div = document.createElement('div');

        // Atribui a div criada uma outra div com um dataset onde o nome desse data-set será o que vier no parâmetro
        div.innerHTML = `<div data-${text} = "id"></div>`;

        // Retorna um array com todas as chaves que ele encontrar em um determinado objeto.
        return Object.keys(div.firstChild.dataset)[0]; // Pega o primeiro filho da div criada nesse método.No caso é a div atribuida no innerHTML e retorna o dataset na posição 0
    }

    // Método que converte a hora de milisegundos para segundos, minutos e horas
    static toTime(duration){

        let seconds = parseInt((duration / 1000) % 60); // Converte de milisegundos para segundos. O módulo 60 limita a váriavel para 60 segundos.
        let minutes = parseInt((duration / (1000 * 60)) % 60); // Converte de milisegundos para minuto. O módulo 60 limita para 60 minutos.
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24); // Converte de milisegundos para hora. O módulo 24 limita para 24 horas.

        // Verifica se existe hora
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Converte os segundos para string para mostrar o 0 à esquerda
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}