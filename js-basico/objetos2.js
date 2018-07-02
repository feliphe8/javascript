class Celular {

    constructor(){
        this.cor = "prata";
    }

    ligar(){
        console.log("Fazendo uma ligação.");
        return "Ligando...";
    }
}

let objeto = new Celular();
console.log(objeto);
console.log(objeto.ligar());