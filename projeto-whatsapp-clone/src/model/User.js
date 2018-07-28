import { Firebase } from './../util/Firebase';
import { Model } from './Model';

export class User extends Model {

    constructor(id) {

        // Extende o constructor do Model
        super();

        // Se passar o id, chama o método getById()
        if(id) this.getById(id);
    }

    get name() {
        return this._data.name;
    }

    set name(value) {
        this._data.name = value;
    }

    get email() {
        return this._data.email;
    }

    set email(value) {
        this._data.email = value;
    }

    get photo() {
        return this._data.photo;
    }

    set photo(value) {
        this._data.photo = value;
    }

    getById(id) {

        return new Promise ((resolve, reject) => {

            // O ID É O EMAIL
            // onSnapshot fica espelhando o Firebase com o app, para sempre que houver mudança, atualizar no app
            User.findByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data());
                resolve(doc);
            });

            // A promesa do get retorna o documento que está salvo no Firebase
            //User.findByEmail(id).get().then(doc => {

                //this.fromJSON(doc.data());
                //resolve(doc);

            //}).catch(error => {
               // reject(error);
            //});
        });
    }

    // Método que salva os dados no Firebase
    save() {

        return User.findByEmail(this.email).set(this.toJSON());
    }

    // Método que traz a referência do DB
    static getRef() {
        // Retorna a coleção users
        return Firebase.db().collection('/users');
    }

    static getContactsRef(id){

        return User.getRef().doc(id).collection('contacts');
    }

    // Método que encontra um usuário pelo email
    static findByEmail(email) {

        // Retorna o documento encontrado pelo email passado no parâmetro na coleção retornada do getRef()
        return User.getRef().doc(email);
    }

    // Método de adicionar contato
    addContact(contact) {

        // Busca na referência do usuário na coleção contatos o documento com o contato passado no parâmetro e seta o contato
        // Retorna uma promise
        //btoa() converte para base64
        //atob() é o inverso
        return User.getContactsRef(this.email).doc(btoa(contact.email)).set(contact.toJSON());
    }


    getContacts() {
        return new Promise((resolve, reject) => {

            // Acessa a referência dos contatos e faz um snapshot(espelhando o Firebase com a aplicação)
            User.getContactsRef(this.email).onSnapshot(docs => {

                let contacts = [];
                
                // Para cada documento de contato que for encontrado
                docs.forEach(doc => {

                    // Pega os dados que estão no documento
                    let data = doc.data();

                    // Guarda o id do documento
                    data.id = doc.id;

                    // Guarda as informações no array
                    contacts.push(data);
                });

                // Avisa pra que tem o evento contactschange que houve mudanças
                this.trigger('contactschange', docs);

                resolve(contacts);

            });
        });
    }
}