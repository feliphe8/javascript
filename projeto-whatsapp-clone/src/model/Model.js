import { ClassEvent } from "../util/ClassEvent";

// Classe intermediária: User - Model - ClassEvent
export class Model extends ClassEvent {

    constructor() {

        // Extende o constructor do ClassEvent
        super();

        // Objeto onde será guardado os dados
        this._data = {};
    }

    fromJSON(json) {

        // Mescla o que tem no json com data. (O que tiver de novo no JSON substitui no data, e o que estiver no data que não veio do JSON mantém no data)
        // Mantém o dado mais novo
        this._data = Object.assign(this._data, json);

        // Avisa para todos que possuem o evento datachange e manda os dados atualizados
        // O evento datachange é criado aqui
        this.trigger('datachange', this.toJSON());
    }

    toJSON() {
        return this._data;
    }


}