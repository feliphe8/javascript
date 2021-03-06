class DropBoxController {

    constructor(){

        this.currentFolder = ['principal']; // Pasta atual

        this.onSelectionChange = new Event('selectionchange'); // Adiciona um novo atributo na classe e cria seu próprio evento

        this.navElement = document.querySelector('#browse-location'); // Pega o nav para navegação(breadcrumbs)
        this.btnSendFileElement = document.querySelector('#btn-send-file'); // Pega o botão de enviar arquivos
        this.inputFilesElement = document.querySelector('#files'); // Pega o input escondido
        this.snackModalElement = document.querySelector('#react-snackbar-root'); // Pega o modal escondido(barra de progresso)
        this.progressBarElement = this.snackModalElement.querySelector('.mc-progress-bar-fg'); // Procura a classe da progressBar dentro do elemento snackModal
        this.namefileElement = this.snackModalElement.querySelector('.filename'); // Procura a classe filename dentro do Modal
        this.timeleftElement = this.snackModalElement.querySelector('.timeleft'); // Procura a classe timeleft dentro do Modal
        this.listFilesElement = document.querySelector('#list-of-files-and-directories'); // Pega a UL onde vai ser listado os arquivos

        this.btnNewFolder = document.querySelector('#btn-new-folder'); // Pega o botão de criar nova pasta
        this.btnRename = document.querySelector('#btn-rename'); // Pega o botão de renomear
        this.btnDelete = document.querySelector('#btn-delete'); // Pega o botão de deletar

        this.connectFirebase(); // Conecta com o DB Firebase
        this.initEvents(); // Chama o método que inicia os eventos
        this.openFolder(); // Abre uma pasta, acessa o db e lê as informações
    }

    connectFirebase(){
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyDedNy4hFLV1oKqmPIDdGEspCbVBzJTJLc",
            authDomain: "dropbox-clone-bfc40.firebaseapp.com",
            databaseURL: "https://dropbox-clone-bfc40.firebaseio.com",
            projectId: "dropbox-clone-bfc40",
            storageBucket: "dropbox-clone-bfc40.appspot.com",
            messagingSenderId: "206936401270"
        };
        firebase.initializeApp(config);
    }

    // Método que retorna todos os elementos da lista que estão selecionados(com a classe selected)
    getSelection(){
        return this.listFilesElement.querySelectorAll('.selected');
    }

    // Método que remove uma pasta
    removeFolderTask(ref, name){

        return new Promise((resolve, reject) => {

            // Retorna a referência da pasta no database
            let folderRef = this.getFirebaseReference(ref + '/' + name);

            // o Firebase fica olhando para a pasta desejada
            folderRef.on('value', snapshot => {

                // Tira a atenção do Firebase dessa pasta
                folderRef.off('value'); // Dessa maneira ele não executa mais de uma vez

                // Para cada item que ele encontrar
                snapshot.forEach(item => {
                    
                    // Guarda as informações no data
                    let data = item.val();
                    data.key = item.key;

                    // Verifica se é uma pasta
                    if(data.type === 'folder'){

                        // Chama o próprio método passando a referência da pasta e o nome que veio do Firebase
                        this.removeFolderTask(ref + '/' + name, data.name).then(() => {
                            
                            resolve({fields:{key: data.key}});

                        }).catch(error => {
                            reject(error);
                        });
                    } else if(data.type){ // Se tem um type(para não dar bug)

                        // Remove um arquivo
                        this.removeFile(ref + '/' + name, data.name).then(() => {
                            
                            resolve({fields:{key: data.key}});

                        }).catch(error => {
                            reject(error);
                        });
                    }

                });

                // Remove do Firebase
                folderRef.remove();
            });

        });
    }

    // Método que remove o arquivo do disco no servidor
    removeTask(){

        let promises = []; // cria um array
        this.getSelection().forEach(li => { // faz um foreach nos li's que foram selecionados

            let file = JSON.parse(li.dataset.file); // pega as informações contidas no dataset.file do li
            let key = li.dataset.key; // pega a chave do dataset do li

            promises.push(new Promise((resolve, reject) => { // Cria uma promise e guarda no array

                // Verifica se o arquivo é uma pasta
                if(file.type === 'folder'){

                    // Método que remove uma pasta
                    this.removeFolderTask(this.currentFolder.join('/'), file.name).then(() => {

                        resolve({fields: {key}});
                    });

                } else if(file.type) {// Esse if é para não cair como referência(aquele bug onde aparecia um undefined no app)

                    // Chama o método que remove o arquivo, passando a referência da pasta e o nome do arquivo
                    this.removeFile(this.currentFolder.join('/'), file.name).then(() => {

                        resolve({fields: {key}});
                    });
                }
                
            }));

            /* CÓDIGO PARA O REMOVE DO SERVIDOR WEB
            let formData = new FormData(); // Instância o formdata para guarda as informações que serão enviadas
            formData.append('path', file.path); // guarda o nome do atributo(path) e o seu valor(file.path) no formData
            formData.append('key', key);

            promises.push(this.ajax('/file', 'DELETE', formData));

            */

        });

        return Promise.all(promises); // Retorna todas as promises
    }

    // Rotina para apagar arquivo
    removeFile(ref, name){

        // Pega a referência do arquivo no storage
        let fileRef = firebase.storage().ref(ref).child(name);

        // Apaga o arquivo no Firebase Storage
        return fileRef.delete(); // Retorna a promise que vem do delete() = método do Firebase
    }

    initEvents(){

        this.btnNewFolder.addEventListener('click', event => { // Adiciona o evento de click no botão Criar nova pasta

            let name = prompt("Nome da nova pasta:"); // Prompt para o usuário para pegar o nome da nova pasta

            if(name){ // Se name existir
                this.getFirebaseReference().push().set({ // Envia para o Firebase
                    name,
                    type: 'folder',
                    path: this.currentFolder.join('/') // pega o nome da pasta atual e coloca uma barra
                });
            }
        });

        this.btnDelete.addEventListener('click', event => { // Adiciona o evento de click no botão delete

            this.removeTask().then(responses => { // Chama o método removeTask que remove o arquivo no disco no servidor e retorna uma promessa para excluir a referência do arquivo no Firebase
                
                responses.forEach(response => { // Para cada response(item excluido)

                    if(response.fields.key){ // Se existe o campo key
                        this.getFirebaseReference().child(response.fields.key).remove(); // Remove a referência no Firebase
                    }
                });

            }).catch(error => {
                console.error(error);
            });
        });

        this.btnRename.addEventListener('click', event => { // Adiciona o evento de click no botão rename

            let li = this.getSelection()[0]; // Retorna o primeiro index

            // As informações do dataset é do tipo string, o JSON.parse converte para JSON
            let file = JSON.parse(li.dataset.file);// Pega as informações do arquivo contidas no dataset do li

            let name = prompt("Renomear o arquivo:", file.name); // abre um prompt para o usuário renomear

            // Se name tiver algum conteúdo, é pq o usuário altero o nome. Entra no if
            if(name) {
                file.name = name; // Troca o nome

                this.getFirebaseReference().child(li.dataset.key).set(file); // Encontra o li selecionado com a hash que está no dataset e salva no Firebase
            }

        });

        this.listFilesElement.addEventListener('selectionchange', event => { // Adiciona o evento criado nessa classe ao ul
            
            // Faz um switch nos li's que estão selecionados. .length traz a quantidade
            switch(this.getSelection().length){
                // Esconde os botões delete e rename caso nenhum li esteja selecionado
                case 0:
                    this.btnDelete.style.display = 'none';
                    this.btnRename.style.display = 'none';
                    break;
                // Mostra os botões delete e rename caso apenas 1 li esteja selecionado
                case 1:
                    this.btnDelete.style.display = 'block';
                    this.btnRename.style.display = 'block';
                    break;
                // Mostra o botão delete e esconde o rename caso mais de um li esteja selecionado
                default:
                    this.btnDelete.style.display = 'block';
                    this.btnRename.style.display = 'none';

            };

        });


        this.btnSendFileElement.addEventListener('click', event => { // adiciona o evento click ao botão de enviar arquivos

            this.inputFilesElement.click(); // Força o click no input que está escondido

        });

        this.inputFilesElement.addEventListener('change', event => { // adiciona o evento para quando alterarem o inputFile

            this.btnSendFileElement.disabled = true; // Desabilita o botão para o processamento da tarefa.

            this.uploadTask(event.target.files).then(responses => {// event.target.files = onde estão os arquivos que vieram do input
                // Recebe respostas(Promises) do uploadTask

                console.log('responses', responses);

                responses.forEach(response => { // Para cada response faça:
                    
                    this.getFirebaseReference().push().set({ // Faz o push das informações para o Firebase
                        // Cria um objeto JSON e guarda apenas as informações necessárias que vem do response(Firebase) no app
                        name: response.name,
                        type: response.contentType,
                        path: response.fullPath, // response.downloadURLs[0]
                        size: response.size
                    });

                });

                console.log('responses',responses);


                this.uploadComplete();

                /* CÓDIGO PARA UPLOAD DE ARQUIVOS EM SERVIDOR WEB
                responses.forEach(response => { // Para cada response faça:
                    
                    this.getFirebaseReference().push().set(response.files['input-file']); // Faz o push das informações para o Firebase

                });

                */

            }).catch(error => {
                this.uploadComplete();
                console.error(error);
            });

            this.modalShow();// Mostra o modal do progressBar escondido.
        });
    }

    // Método para tarefas após o upload ser realizado
    uploadComplete(){

        this.modalShow(false); // Esconde o modal da progressBar
        this.inputFilesElement.value = ''; // Zera o campo para poder startar o change novamente.
        this.btnSendFileElement.disabled = false; // Habilita o botão.


    }

    // Pega a referência do Firebase
    getFirebaseReference(path){

        // Se não existir path, path recebe o valor do currentFolder(pasta principal)
        if (!path) path = this.currentFolder.join('/');

        return firebase.database().ref(path); // Retorna a referência do firebase para o documento(JSON ou Coleção) path 
    }

    // Método toggle para mostrar e esconder o modal do progressBar
    modalShow(show = true){
        // Se show for true = display.block, false = display.none
        this.snackModalElement.style.display = (show) ? 'block' : 'none';
    }

    // Método que utiliza o ajax para fazer a requisição
    // Parâmetros opcionais: method, formData, onprogress = função que vai calcular o tempo estimado de upload, onloadstart
    ajax(url, method = 'GET', formData = new FormData(), onprogress = function(){}, onloadstart = function(){}){

        return new Promise((resolve, reject) => { // Retorna uma promise com a requisição

            // faz o upload utilizando ajax
            let ajax = new XMLHttpRequest();
            ajax.open(method, url);
            ajax.onload = event => {

                try{
                    resolve(JSON.parse(ajax.responseText));
                } catch(e){
                    reject(e);
                }
            };

            ajax.onerror = event => {
                reject(event);
            };

            ajax.upload.onprogress = onprogress(); // Executa o onprogress dentro do upload para pegar o tempo estimado

            onloadstart();

            ajax.send(formData);// envia o arquivo

        });
    }

    uploadTask(files){
        let promises = [];

        // files é uma coleção, precisa converter para array
        [...files].forEach(file => { // faz um forEach para cada arquivo

            // Cria uma nova promise e guarda no array
            promises.push(new Promise((resolve, reject) => {

                // Cria uma referência no Firebase Storage com o nome do currentFolder e com um node com o nome do file.name
                let fileRef = firebase.storage().ref(this.currentFolder.join('/')).child(file.name);

                // Faz o upload .put() retorna um task(quem manipula o upload e retorna eventos)
                let task = fileRef.put(file);

                // Storage fica olhando por uma mudança de estado
                task.on('state_changed', snapshot => {
                    // Função de progresso - mostra o andamento do upload
                    // Chama a função upload progress
                    this.uploadProgress({
                        loaded: snapshot.bytesTransferred,
                        total: snapshot.totalBytes
                    }, file);
                    
                }, error => {
                    // Função caso de erro
                    reject(error);

                }, () => {
                    //  resolve = Função de sucesso

                    // getMetada tras todos os dados do arquivo - retorna uma promise
                    fileRef.getMetadata().then(metadata => {
                        resolve(metadata);
                    }).catch(error => {
                        reject(error);
                    });
                });
            }));

            /* CÓDIGO P/ UPLOAD DE ARQUIVO NO SERVIDOR WEB
            let formData = new FormData(); // tratando os arquivos
            formData.append('input-file', file); // colocando os arquivos no formData. O primeiro parâmetro é o nome do campo que o POST vai receber e o segundo é o arquivo

            // Chama a função que faz a requisição utilizando o AJAX e guarda a promise que o método retorna no array promises
            promises.push(this.ajax('/upload', 'POST', formData, () => {
                            this.uploadProgress(event, file) // Passa para o método o evento onde contém as informações de quantos bytes faltam para fazer o upload e o arquivo como segundo parâmetro.
                        }, () => {
                            this.startUploadTime = Date.now(); // Pega a hora em que foi iniciado o upload.
                    }));

                    */
        });

        return Promise.all(promises); // retorna uma promise para cada arquivo

    }

    // Método que faz o cálculo de tempo estimado do upload para a barra de progresso.
    uploadProgress(event, file){

        let timeSpent = Date.now() - this.startUploadTime; // Faz o cálculo do tempo gasto. Hora atual - hora em que foi iniciado o upload.
        let loaded = event.loaded; // quantidade carregada
        let total = event.total; // total a ser carregado

        let porcent = parseInt((loaded / total) * 100); // Faz a regra de três para obter a porcentagem e converte para inteiro

        let timeleft = ((100 - porcent) * timeSpent) / porcent; // Faz o cálculo do tempo restante. (Porcentagem atual * tempo gasto) divido pela porcentagem total.

        this.progressBarElement.style.width = `${porcent}%`; // Atualiza o width do elemento progressBar com a porcentagem

        this.namefileElement.innerHTML = file.name; // Atualiza o HTML com o nome do arquivo que está sendo feito o upload
        this.timeleftElement.innerHTML = this.formatTimeToHuman(timeleft); // Atualiza o HTML com o retorno da função formatTime que formata o tempo restante

        console.log(timeSpent, timeleft, porcent);

    }

    // Formata o tempo para segundos, minutos e horas.
    formatTimeToHuman(duration){

        let seconds = parseInt((duration / 1000) % 60); // Converte de milisegundos para segundos. O módulo 60 limita a váriavel para 60 segundos.
        let minutes = parseInt((duration / (1000 * 60)) % 60); // Converte de milisegundos para minuto. O módulo 60 limita para 60 minutos.
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24); // Converte de milisegundos para hora. O módulo 24 limita para 24 horas.

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }
        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        }
        if (seconds > 0) {
            return `${seconds} segundos`;
        }

        return '';

    }

    getFileIconView(file){
        switch(file.type){
            case 'folder': // Retorna o SVG para o icone de PASTA
                return `
                        <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                            <title>content-folder-large</title>
                            <g fill="none" fill-rule="evenodd">
                                <path d="M77.955 53h50.04A3.002 3.002 0 0 1 131 56.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 114.995V45.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#71B9F4"></path>
                                <path d="M77.955 52h50.04A3.002 3.002 0 0 1 131 55.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 113.995V44.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#92CEFF"></path>
                            </g>
                        </svg>`;
                break;
            case 'application/pdf': // Retorna o icone para PDF
                return `
                        <svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve">
                        <filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%">
                            <feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset>
                            <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1">
                            </feColorMatrix>
                        </filter>
                        <title>PDF</title>
                        <g>
                            <g>
                                <g filter="url(#mc-content-unknown-large-a)">
                                    <path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34
                                            C43,31.791,44.791,30,47,30z"></path>
                                </g>
                                <g>
                                    <path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47
                                            c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path>
                                </g>
                            </g>
                        </g>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#F15124" d="M102.482,91.479c-0.733-3.055-3.12-4.025-5.954-4.437
                                c-2.08-0.302-4.735,1.019-6.154-0.883c-2.167-2.905-4.015-6.144-5.428-9.482c-1.017-2.402,1.516-4.188,2.394-6.263
                                c1.943-4.595,0.738-7.984-3.519-9.021c-2.597-0.632-5.045-0.13-6.849,1.918c-2.266,2.574-1.215,5.258,0.095,7.878
                                c3.563,7.127-1.046,15.324-8.885,15.826c-3.794,0.243-6.93,1.297-7.183,5.84c0.494,3.255,1.988,5.797,5.14,6.825
                                c3.062,1,4.941-0.976,6.664-3.186c1.391-1.782,1.572-4.905,4.104-5.291c3.25-0.497,6.677-0.464,9.942-0.025
                                c2.361,0.318,2.556,3.209,3.774,4.9c2.97,4.122,6.014,5.029,9.126,2.415C101.895,96.694,103.179,94.38,102.482,91.479z
                                M67.667,94.885c-1.16-0.312-1.621-0.97-1.607-1.861c0.018-1.199,1.032-1.121,1.805-1.132c0.557-0.008,1.486-0.198,1.4,0.827
                                C69.173,93.804,68.363,94.401,67.667,94.885z M82.146,65.949c1.331,0.02,1.774,0.715,1.234,1.944
                                c-0.319,0.725-0.457,1.663-1.577,1.651c-1.03-0.498-1.314-1.528-1.409-2.456C80.276,65.923,81.341,65.938,82.146,65.949z
                                M81.955,86.183c-0.912,0.01-2.209,0.098-1.733-1.421c0.264-0.841,0.955-2.04,1.622-2.162c1.411-0.259,1.409,1.421,2.049,2.186
                                C84.057,86.456,82.837,86.174,81.955,86.183z M96.229,94.8c-1.14-0.082-1.692-1.111-1.785-2.033
                                c-0.131-1.296,1.072-0.867,1.753-0.876c0.796-0.011,1.668,0.118,1.588,1.293C97.394,93.857,97.226,94.871,96.229,94.8z"></path>
                    </svg>
                `;
                break;

            case 'audio/mp3':
            case 'audio/ogg':
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>content-audio-large</title>
                        <defs>
                            <rect id="mc-content-audio-large-b" x="30" y="43" width="100" height="74" rx="4"></rect>
                            <filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-audio-large-a">
                                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <g>
                                <use fill="#000" filter="url(#mc-content-audio-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use>
                                <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use>
                            </g>
                            <path d="M67 60c0-1.657 1.347-3 3-3 1.657 0 3 1.352 3 3v40c0 1.657-1.347 3-3 3-1.657 0-3-1.352-3-3V60zM57 78c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm40 0c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm-20-5.006A3 3 0 0 1 80 70c1.657 0 3 1.343 3 2.994v14.012A3 3 0 0 1 80 90c-1.657 0-3-1.343-3-2.994V72.994zM87 68c0-1.657 1.347-3 3-3 1.657 0 3 1.347 3 3v24c0 1.657-1.347 3-3 3-1.657 0-3-1.347-3-3V68z" fill="#637282"></path>
                        </g>
                    </svg>
                `;
                break;

            case 'video/mp4':
            case 'video/quicktime':
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>content-video-large</title>
                        <defs>
                            <rect id="mc-content-video-large-b" x="30" y="43" width="100" height="74" rx="4"></rect>
                            <filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-video-large-a">
                                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <g>
                                <use fill="#000" filter="url(#mc-content-video-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use>
                                <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use>
                            </g>
                            <path d="M69 67.991c0-1.1.808-1.587 1.794-1.094l24.412 12.206c.99.495.986 1.3 0 1.794L70.794 93.103c-.99.495-1.794-.003-1.794-1.094V67.99z" fill="#637282"></path>
                        </g>
                    </svg>
                `;
                break;
            case 'image/jpeg': // Retorna o icone para imagens.
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
                return `
                        <svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve">
                        <filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%">
                            <feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset>
                            <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1">
                            </feColorMatrix>
                        </filter>
                        <title>Imagem</title>
                        <g>
                            <g>
                                <g filter="url(#mc-content-unknown-large-a)">
                                    <path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34
                                            C43,31.791,44.791,30,47,30z"></path>
                                </g>
                                <g>
                                    <path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47
                                            c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path>
                                </g>
                            </g>
                        </g>
                        <g>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M81.148,62.638c8.086,0,16.173-0.001,24.259,0.001
                                    c1.792,0,2.3,0.503,2.301,2.28c0.001,11.414,0.001,22.829,0,34.243c0,1.775-0.53,2.32-2.289,2.32
                                    c-16.209,0.003-32.417,0.003-48.626,0c-1.775,0-2.317-0.542-2.318-2.306c-0.002-11.414-0.003-22.829,0-34.243
                                    c0-1.769,0.532-2.294,2.306-2.294C64.903,62.637,73.026,62.638,81.148,62.638z M81.115,97.911c7.337,0,14.673-0.016,22.009,0.021
                                    c0.856,0.005,1.045-0.238,1.042-1.062c-0.028-9.877-0.03-19.754,0.002-29.63c0.003-0.9-0.257-1.114-1.134-1.112
                                    c-14.637,0.027-29.273,0.025-43.91,0.003c-0.801-0.001-1.09,0.141-1.086,1.033c0.036,9.913,0.036,19.826,0,29.738
                                    c-0.003,0.878,0.268,1.03,1.069,1.027C66.443,97.898,73.779,97.911,81.115,97.911z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M77.737,85.036c3.505-2.455,7.213-4.083,11.161-5.165
                                    c4.144-1.135,8.364-1.504,12.651-1.116c0.64,0.058,0.835,0.257,0.831,0.902c-0.024,5.191-0.024,10.381,0.001,15.572
                                    c0.003,0.631-0.206,0.76-0.789,0.756c-3.688-0.024-7.375-0.009-11.062-0.018c-0.33-0.001-0.67,0.106-0.918-0.33
                                    c-2.487-4.379-6.362-7.275-10.562-9.819C78.656,85.579,78.257,85.345,77.737,85.036z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M87.313,95.973c-0.538,0-0.815,0-1.094,0
                                    c-8.477,0-16.953-0.012-25.43,0.021c-0.794,0.003-1.01-0.176-0.998-0.988c0.051-3.396,0.026-6.795,0.017-10.193
                                    c-0.001-0.497-0.042-0.847,0.693-0.839c6.389,0.065,12.483,1.296,18.093,4.476C81.915,90.33,84.829,92.695,87.313,95.973z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M74.188,76.557c0.01,2.266-1.932,4.223-4.221,4.255
                                    c-2.309,0.033-4.344-1.984-4.313-4.276c0.03-2.263,2.016-4.213,4.281-4.206C72.207,72.338,74.179,74.298,74.188,76.557z"></path>
                        </g>
                    </svg>
                `;
                break;
            default: // Retorna o icone para arquivo default
                return `
                        <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                            <title>1357054_617b.jpg</title>
                            <defs>
                                <rect id="mc-content-unknown-large-b" x="43" y="30" width="74" height="100" rx="4"></rect>
                                <filter x="-.7%" y="-.5%" width="101.4%" height="102%" filterUnits="objectBoundingBox" id="mc-content-unknown-large-a">
                                    <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                    <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                                </filter>
                            </defs>
                            <g fill="none" fill-rule="evenodd">
                                <g>
                                    <use fill="#000" filter="url(#mc-content-unknown-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use>
                                    <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use>
                                </g>
                            </g>
                        </svg>
                `;
        }
    }

    // Retorna o elemento HTML li.
    getFileView(file, key){

        let li = document.createElement('li'); // Cria a li
        li.dataset.key = key; // Adiciona um atributo HTML dataset no li com o nome de key, contendo a key(hash) gerado pelo Firebase.
        // File é um objeto, precisa converter para string para guardar no dataset
        li.dataset.file = JSON.stringify(file); // Adiciona um atributo HTML dataset no li com o nome de file, contendo as informações do arquivo.

        li.innerHTML = `${this.getFileIconView(file)}
                        <div class="name text-center">${file.name}</div>`;

        this.initEventsLi(li); // Inicia os eventos para o li
        return li;
    }

    // Lê os arquivos do DB
    readFiles(){

        this.lastFolder = this.currentFolder.join('/'); // Atribui ao lastFolder o valor da pasta atual

        this.getFirebaseReference().on('value', snapshot => { // O DB do Firebase fica esperando por um evento(value) e quando uma alteração ocorre, retorna um snapshot(foto)

            this.listFilesElement.innerHTML = ''; // Zera a lista UL

            snapshot.forEach(snapshotItem => { // Para cada item do snapshot
                let key = snapshotItem.key; // Pega a chave(hash) do item
                let data = snapshotItem.val(); // Pega os dados;

                // Verifica se o nó que está no data tem um tipo
                if(data.type){

                    this.listFilesElement.appendChild(this.getFileView(data, key)); // Adiciona um filho(no caso, li) ao elemento pai(no caso, ul) 
                }
                //console.log(key, data);
            });
        });

    }

    // Método que abre uma pasta
    openFolder(){

        // Se existe uma pasta anterior
        if(this.lastFolder) this.getFirebaseReference(this.lastFolder).off('value'); // Passa para o Firebase a ultima pasta e desliga o evento(.off('value')) do Firebase para que ele para de olhar para a pasta anterior

        this.renderNav(); // Atualiza o breadcrumbs
        this.readFiles(); // Acessa o DB e lê as informações
    }

    // Atualiza o breadcrumbs
    renderNav(){

        let nav = document.createElement('nav');
        let path = []; // Array para salvar o caminho de cada uma das pastas

        // Para cada pasta
        for(let i = 0; i < this.currentFolder.length; i++){

            let folderName = this.currentFolder[i]; // Pega o nome da pasta atual
            let span = document.createElement('span');

            path.push(folderName);

            // Se a posição i+1 for igual ao tamanho total do array, significa que eu estou na ultima posição, para pegar o nome da ultima pasta
            if((i + 1) === this.currentFolder.length){

                span.innerHTML = folderName; // Coloca o nome da pasta no span
            } else {

                span.className = 'breadcrumb-segment__wrapper'; // Adiciona uma classe no elemento span
                span.innerHTML = `
                            <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
                                <a href="#" data-path="${path.join('/')}" class="breadcrumb-segment">${folderName}</a>
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" class="mc-icon-template-stateless" style="top: 4px; position: relative;">
                                <title>arrow-right</title>
                                <path d="M10.414 7.05l4.95 4.95-4.95 4.95L9 15.534 12.536 12 9 8.464z" fill="#637282" fill-rule="evenodd"></path>
                            </svg>
                `;

            }

            // appendChild recebe apenas nós(nodes)
            nav.appendChild(span); // Adiciona um filho ao nav
        }
        
        this.navElement.innerHTML = nav.innerHTML; // Atribui ao nav do app o nav montado nesse método

        // Pega todas tags a dentro do nav e faz um forEach
        this.navElement.querySelectorAll('a').forEach(a => {

            // Adiciona um evento para cada tag a encontrada
            a.addEventListener('click', event => {
                event.preventDefault(); // Impede o comportamento padrão da tag a.(Utilizado aqui para não aparecer # na URL)

                this.currentFolder = a.dataset.path.split('/'); // Divide a string, colocando / e transforma em um array e guarda no currentFolder
                this.openFolder(); // Abre a pasta atual
            });
        });

    }

    // Inicia eventos para o li(cada item, arquivo, pasta etc)
    initEventsLi(li){

        li.addEventListener('dblclick', event => { // Adiciona evento de double click no li

            let file = JSON.parse(li.dataset.file); // Pega as informações de arquivo que estão no dataset do li

            switch (file.type) {
                case 'folder':
                    this.currentFolder.push(file.name); // Coloca no array currentFolder o nome da pasta
                    this.openFolder(); // Abre a pasta
                    break;
            
                default:
                    window.open(file.path); // abre o arquivo
            }
        });

        li.addEventListener('click', event => { // Evento de click no li

            if (event.shiftKey) {
                
                let firstLi = this.listFilesElement.querySelector('.selected'); // Pega o primeiro li com a classe selected
                // No primeiro click firstLi é null
                if (firstLi) { // Esse if acontece no segundo click.

                    let indexStart;
                    let indexEnd;
                    let lis = li.parentElement.childNodes;

                    // li.parentElement = acessa o elemento pai, no caso o ul. .childNodes = acessa todos os filhos desse pai
                    lis.forEach((element, index) => {

                        if(firstLi === element) indexStart = index; // Se o primeiro li clicado for igual ao li da iteração, atribui o index ao primeiro
                        if(li === element) indexEnd = index; // Se o segundo li clicado for igual ao li da iteração, atribui o index ao ultimo
                    });

                    let index = [indexStart, indexEnd].sort(); // Guarda os indexes em um array e ordena
                    
                    lis.forEach((element, i) => { // para cada li

                        // Se o i estiver no range dos li's que foram clicados faça
                        if(i >= index[0] && i <= index[1]){
                            element.classList.add('selected'); // adiciona a classe selected ao elemento
                        }
                    });

                    this.listFilesElement.dispatchEvent(this.onSelectionChange);// Avisa ao listFilesElement que houve uma mudança na seleção

                    return true; // Retorna para parar a execução e não executar o li.classList.toggle

                    
                }
            }

            if (!event.ctrlKey) { // Se a pessoa clicou no li e não estava segurando ctrl
                
                this.listFilesElement.querySelectorAll('li.selected').forEach(element => {// Pega todos os li's com a classe selected do ul e faz um forEach
                    element.classList.remove('selected'); // Remove a classe selected

                });
            }

            li.classList.toggle('selected'); // Adiciona a classe selected no CSS

            this.listFilesElement.dispatchEvent(this.onSelectionChange);// Avisa ao listFilesElement que houve uma mudança na seleção
        });
    }
}