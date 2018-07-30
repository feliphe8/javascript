import { Model } from "./Model";
import { Firebase } from "../util/Firebase";

export class Chat extends Model {

    constructor() {
        super();

    }

    get users(){return this._data.users;}
    set users(value){this._data.users = value;}

    get timeStamp(){return this._data.timeStamp;}
    set timeStamp(value){this._data.timeStamp = value;}


    // Método que retorna a referência da coleção no Firebase
    static getRef() {

        return Firebase.db().collection('/chats');
    }

    // Método que cria uma conversa
    static create(meEmail, contactEmail){
     
        return new Promise((resolve, reject) => {


            // Cria um objeto users, adicionando meu email em base64 e bool true, e o email do contato em base64 e bool true
            let users = {};
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;

            // add retorna uma promise
            Chat.getRef().add({
                users,
                timeStamp: new Date()
            }).then(doc => {
                // Pega o doc(o doc só tem o id do chat) criado e retorna o chat
                Chat.getRef().doc(doc.id).get().then(chat => {

                    // Retorna o chat
                    resolve(chat);

                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    // Método que procura a conversa
    static find(meEmail, contactEmail){

        // Método where do Firebase, procura o email(em base64) e verifica '==' se é true. Faz isso para EU(meEmail) e VC(contactEmail) 
        // .get() para retornar uma promise
        return Chat.getRef().where(btoa(meEmail), '==', true).where(btoa(contactEmail), '==', true).get();
    }

    // Método que cria o chat se não existir, se existir retorna o chat
    static createIfNotExists(meEmail, contactEmail){

        return new Promise((resolve, reject) => {

            // Método que procura a conversa
            Chat.find(meEmail, contactEmail).then(chats => {

                // empty é do Firebase, verifica se o chat é vazio
                if(chats.empty) {

                    // Cria a conversa
                    Chat.create(meEmail, contactEmail).then(chat => {
                        resolve(chat);
                    });

                } else {

                    // Percorre os chats
                    chats.forEach(chat => {
                        // Retorna o chat em questão
                        resolve(chat);
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
}