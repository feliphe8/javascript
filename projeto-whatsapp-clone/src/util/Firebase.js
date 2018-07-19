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
        if(!this._initialized){

            // Initialize Firebase
            firebase.initializeApp(this._config);

            // Seta o firestore para ficar olhando e pegar o timestamp em snapshots
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            this._initialized = true;
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

}