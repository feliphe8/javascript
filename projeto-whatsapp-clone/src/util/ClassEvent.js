export class ClassEvent {

    constructor(){

        // Objeto será guardado todos os eventos que serão usados
        this._events = {};
    }

    // Método que cria eventos
    on(eventName, func){

        // Senão existir um evento com o nome passado no parâmetro, cria um array com a chave eventName _events{ play: new Array()}
        if(!this._events[eventName]) this._events[eventName] = new Array();

        // Adiciona a função ao evento
        this._events[eventName].push(func);

    }

    // Método gatilho que executa a função
    trigger(){

        // arguments - comando nativo do JS para pegar os argumentos passados no parâmetro. Para pegar parametros que não são obrigatórios
        let args = [...arguments]; // spread transforma o arguments em array

        // Remove o nome do evento na primeira posição do array e guarda em eventName
        let eventName = args.shift(); // shift remove o primeiro elemento de um array e retorna ele

        // Guarda no args um novo evento com o nome que veio no parâmetro
        args.push(new Event(eventName));

        // Verifica se existe uma instância do Array(significa que alguem já chamou esse evento)
        if (this._events[eventName] instanceof Array) {
            
            // Faz um forEach no evento, percorrendo as funções
            this._events[eventName].forEach(func => {

                // Executa um código(nesse caso a função) - primeiro parâmetro sempre null, segundo parâmetro os argumentos
                func.apply(null, args);
            });
        }
     }
}