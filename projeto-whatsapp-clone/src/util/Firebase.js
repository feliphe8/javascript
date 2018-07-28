
// Faz uso do Firebase
const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor(){

        // Configuração do Firebase
        this._config = {
            apiKey: "AIzaSyBgvuU7lDFPB5bc5E7wABIl3Il32f2FnF0",
            authDomain: "whatsapp-clone-ea062.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-ea062.firebaseio.com",
            projectId: "whatsapp-clone-ea062",
            storageBucket: "",
            messagingSenderId: "1040885861896"
        };

        this.init();
    }

    init(){

        // Verifica se o Firebase já foi inicializado
        // window._initializedFirebase - torna a váriavel global, para que todas as instâncias da classe Firebase possa ver o mesmo atributo
        if(!window._initializedFirebase){

            // Initialize Firebase
            firebase.initializeApp(this._config);

            // Seta o firestore para ficar olhando e pegar o timestamp em snapshots
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;
        }
    }

    // Método estático que retorna o db
    static db(){

        return firebase.firestore();
    }

    // Método estático que retorna o storage
    static hd(){

        return firebase.storage();
    }

    initAuth(){
        // Retorna uma promise
        return new Promise((resolve, reject) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            // Quer iniciar a aplicação com qual conta? Provider = Google
            firebase.auth().signInWithPopup(provider).then(result => {

                // Pega o token de acesso do firebase, existe apenas por um certo tempo, utilizado para validação
                let token = result.credential.accessToken;

                // Pega o usuario
                let user = result.user;

                // Retorna o usuário e o token
                resolve({user, token});

            }).catch(error => {
                reject(error);
            });
        });
    }

}