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
                    this[name] = json[name];
            }

        }
    }

    // Função que verifica se existe dados na sessão. Cria um array users e verifica se existe dados na sessão, se existir coloca os dados no array. Retorna o array users
    static getUsersStorage(){
        let users = [];

        if (localStorage.getItem("users")) { // Verifica se já existe na sessão um array users
            users = JSON.parse(localStorage.getItem("users")); // Sobreescreve com o conteudo que está armazenado no sessionStorage
        }

        return users;
    }

    getNewId(){

        let usersID = parseInt(localStorage.getItem("usersID")); // Pega o id do localStorage

        if(!usersID > 0) usersID = 0; // Verifica se não existe
        usersID++;

        localStorage.setItem("usersID", usersID); // Guarda o novo valor no localStorage

        return usersID;
    }

    save(){

        let users = User.getUsersStorage(); // Traz o array user

        if(this.id > 0){ // Verifica se o id já existe
            // Editando um usuário

            //let user = users.filter(u=>{ return u._id == this.id}) // Filtra no array um usuário que tem o mesmo id - retorna todo o objeto

            users.map( u => {

                if(u._id == this.id){ // Verifica se o user que está no localStorate (user) é igual a instância atual (this)
                   Object.assign(u, this); // Sobreescreve o user do array (localStorage) com o novo valor (a instância atual (this))
                }
                return u;
            }); 



        } else { // Criando um usuário

            this._id = this.getNewId(); // Atribui o id ao objeto
            users.push(this); // push adiciona ao final do array
    
            // sessionStorage permite gravar dados na sessão. Se fechar o navegador ou trocar de aba, deixa de existir.
            //sessionStorage.setItem("users", JSON.stringify(users));
        }

        // localStorage grava no navegador
        localStorage.setItem("users", JSON.stringify(users));

    }

    remove(){
        let users = User.getUsersStorage(); // Traz o array user do localStorage
        users.forEach((userData, index) => { // Percorre o array

            if(this._id == userData._id){ // Verifica se o id que eu quero excluir é o mesmo que veio do localStorage

                users.splice(index, 1); // Remove o usuário do array. O primeiro parâmetro é o index e o segundo é quantos elementos(no caso usuários) vc quer remover

            }
        });

        localStorage.setItem("users", JSON.stringify(users));
    }
}