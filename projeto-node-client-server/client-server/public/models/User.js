class User {

    constructor(name, gender, birth, country,  email, password, photo, admin){

        this._id
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value){
        this._photo = value;
    }

    // Carrega a instância do usuário a partir de um JSON
    loadFromJSON(json){

        for(let name in json){


            switch(name){
                case '_register':
                    this[name] = new Date(json[name]); // Transforma de string para Data
                    break;
                default:
                    if(name.substring(0, 1) === '_')this[name] = json[name]; // verifica se o name(atributo) começa com underline => 0 = primeira posição, 1 apenas um char
            }

        }
    }

    // Função que verifica se existe dados na sessão. Cria um array users e verifica se existe dados na sessão, se existir coloca os dados no array. Retorna o array users
    static getUsersStorage(){

        return Fetch.get('/users');
    }

    // Método para converter o objeto para json
    toJSON(){
        
        let json = {};

        Object.keys(this).forEach(key => { // Lê os atributos do objeto instânciado *** retorna um array

            if(this[key] !== undefined) json[key] = this[key]; // Verifica se o atributo do objeto não é undefined
        });

        return json;
    }

    save(){

        return new Promise((resolve, reject) => { // retorna uma promessa para quem chamou o save

            let promise;

            if (this.id) { // Se tem id é pq vai editar
                promise = Fetch.put(`/users/${this.id}`, this.toJSON()); // Retorna uma promise e guarda em promise
            } else { // Senão é cadastro
                promise = Fetch.post(`/users`, this.toJSON()); // Retorna uma promise e guarda em promise
            }

            promise.then(data => {

                this.loadFromJSON(data); // Carrega o objeto com informações que vem de um json

                resolve(this);
            }).catch(e => {

                reject(e);
            });
        });

    }

    remove(){
        
        return Fetch.delete(`/users/${this.id}`); // Retorna uma promessa
    }
}