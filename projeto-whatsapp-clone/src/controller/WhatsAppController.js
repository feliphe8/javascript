
import {Format} from '../util/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from './../util/Firebase';
import {User} from './../model/User';
import {Chat} from './../model/Chat';
import {Message} from './../model/Message';

export class WhatsAppController {

    constructor(){

        this._firebase = new Firebase(); // Faz uso da classe Firebase, que conecta com o Firebase
        this.initAuth(); // Método que inicializa autenticação
        this.elementsPrototype(); // Adiciona métodos no prototype do Element
        this.loadElements(); // Pega todos os elementos HTML que possui id
        this.initEvents(); // Inicia os eventos
    }

    initAuth(){

        // Chama o método initAuth do Firebase - retorna uma resposta
        this._firebase.initAuth().then(response => {
            
            this._user = new User(response.user.email);

            // Cria um evento de mudança de dados no usuário
            this._user.on('datachange', data => {

                document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';

                // Mostra o nome no painel de editar perfil
                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                // Se o usuário tem foto
                if(data.photo) {

                    // Pega o elemento onde será colocado a foto no painel de editar perfil
                    let photo = this.el.imgPanelEditProfile;

                    // Coloca a foto no src da tag img no painel de editar perfil
                    photo.src = data.photo;

                    // Mostra a foto
                    photo.show();

                    // Esconde a foto default no painel de editar perfil
                    this.el.imgDefaultPanelEditProfile.hide();

                    let photoMainPanel = this.el.myPhoto.querySelector('img');
                    photoMainPanel.src = data.photo;
                    photoMainPanel.show();
                }

                // Inicializa a listagem de contatos
                this.initContacts();
            });

            // Guarda o nome que veio do Firebase na instância da classe Usuario
            this._user.name = response.user.displayName;

            // Guarda o email que veio do Firebase na instância da classe Usuario
            this._user.email = response.user.email;

            // Guarda a photo que veio do Firebase na instância da classe Usuario
            this._user.photo = response.user.photoURL;

            // Salva os dados no Firebase
            this._user.save().then(() => {

                // Mostra a aplicação em caso de sucesso
                this.el.appContent.css({display:'flex'});
            });


        }).catch(error => {
            console.error(error);
        });
    }

    initContacts() {

        this._user.on('contactschange', docs => {

            // Limpa o campo de contatos.
            this.el.contactsMessagesList.innerHTML = '';

            // Para cada documento de contato que vier
            docs.forEach(doc => {

                // Extrai os dados do documento
                let contact = doc.data();

                let div = document.createElement('div');
                div.className = 'contact-item';
        div.innerHTML = `
        <div class="dIyEr">
            <div class="_1WliW" style="height: 49px; width: 49px;">
                <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                <div class="_3ZW2E">
                    <span data-icon="default-user" class="">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                            <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                            <g fill="#FFF">
                                <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
        <div class="_3j7s9">
            <div class="_2FBdJ">
                <div class="_25Ooe">
                    <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                </div>
                <div class="_3Bxar">
                    <span class="_3T2VG">${contact.lastMessageTime}/span>
                </div>
            </div>
            <div class="_1AwDx">
                <div class="_itDl">
                    <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                    <span class="_2_LEW last-message">
                        <div class="_1VfKB">
                            <span data-icon="status-dblcheck" class="">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                    <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                </svg>
                            </span>
                        </div>
                        <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                        <div class="_3Bxar">
                            <span>
                                <div class="_15G96">
                                    <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                </div>
                        </span></div>
                        </span>
                </div>
            </div>
        </div>`;

            // Se existir imagem no contato
            if(contact.photo) {

                // Pega a tag img que está na div
                let img = div.querySelector('.photo');

                // Coloca a foto na tag img
                img.src = contact.photo;

                // Mostra a tag
                img.show();
            }

            // Evento de click na div onde está o contato
            div.on('click', event => {

                // Ativa o chat
                this.setActiveChat(contact);
                
            });

            // Coloca o contato na tela
            this.el.contactsMessagesList.appendChild(div);

            });
        });

        this._user.getContacts();
    }

    // Método responsável por ativar o painel de chat do contato
    setActiveChat(contact){

        // Verifica se existe um contato ativo
        if (this._contactActive) {
            
            // Zera o onSnapshot caso exista um contato ativo, para ele parar de ouvir o chat
            Message.getRef(this._contactActive.chatId).onSnapshot(() => {});
        }

        // Guarda o contato ativo
        this._contactActive = contact;


        // Mostra o nome do contato no painel de conversa
        this.el.activeName.innerHTML = contact.name;

        // Mostra o status do contato no painel de conversa
        this.el.activeStatus.innerHTML = contact.status;

        // Se o contato tiver foto
        if(contact.photo) {
            let img = this.el.activePhoto;
            img.src = contact.photo;
            img.show();
        }

        // Esconde a home
        this.el.home.hide();

        // Mostra o main(painel de conversa)
        this.el.main.css({display: 'flex'});

        // Pega a referência do chat com as mensagens, retorna ordenado pelo timeStamp, e fica olhando o tempo todo(RealTime onSnapshot)
        Message.getRef(this._contactActive.chatId).orderBy('timeStamp').onSnapshot(docs => {

            // Limpa o painel de mensagens
            this.el.panelMessagesContainer.innerHTML = '';

            // Para cada documento que ele retornar
            docs.forEach(doc => {

                // Pega os dados do documento
                let data = doc.data();

                // Guarda o id
                data.id = doc.id;

                // Se não existir uma mensagem com o id igual
                // Verificação para enviar apenas se a mensagem já não foi enviado, pra não ficar carregando todas as mensagens toda vez que enviar uma nova mensagem
                if (!this.el.panelMessagesContainer.querySelector('#' + data.id)) {

                    // Instãncia a classe message
                    let message = new Message();

                    // Carrega o objeto com os dados que vieram do JSON
                    message.fromJSON(data);

                    // Verifica se é minha mensagem
                    let me = (data.from === this._user.email );

                    // Método que verifica o tipo da mensagem, retorna um elemento HTML
                    let view = message.getViewElement(me);

                    // Coloca o elemento HTML no painel
                    this.el.panelMessagesContainer.appendChild(view);
                }

            });
        });


    }

    loadElements(){

        this.el = {}; // Os elementos serão colocados nesse objeto.

        // Pega todos os elementos que possuem id e faz um forEach pegando cada elemento
        document.querySelectorAll('[id]').forEach(element => {

            // Atribui ao this.el o elemento HTML com o seu id convertido de btn-send para CamelCase(btnSend)
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }

    // Para descobrir a classe que o elemento HTML herda:
    // Ir no console e colocar dir(elemento), para mostrar o elemento como objeto e olhar no _proto_
    //Ex: dir(app.el.formPanelAddContact)
    elementsPrototype(){

        // Acessa o prototype da classe Element(Pai de todos os elementos) e cria um atributo hide, onde será atribuido uma function para fechar o escopo(Não usar arrow function aqui)
        Element.prototype.hide = function() {
            // O Elemento que invocar o hide terá o display alterado para none.
            this.style.display = 'none';
            return this;
        };

        Element.prototype.show = function() {
            // O Elemento que invocar o hide terá o display alterado para block.
            this.style.display = 'block';
            return this; // Retorna o próprio elemento que invocou para que um próximo método possa ser executado em sequência. Ex: app.el.app.show().addClass(classe)
        };

        Element.prototype.toggle = function() {
            // Se o elemento estiver oculto, então mostre, se estiver mostrando, então esconde.
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        };

        // Função para atribuir multiplos eventos. Recebe os eventos e a função que ele tem que executar
        Element.prototype.on = function(events, func) {
            
            // Splita toda vez que ele encontrar um espaço(click dblclick drag), vira um array e faz forEach.
            events.split(' ').forEach(event => {
                // Adiciona todos os eventos que vieram em events e executa a função necessária no elemento que invocou o método .on()
                this.addEventListener(event, func);
            });
            return this;
        };

        // Método para alterar o css de um elemento.
        // O parâmetro styles é um JSON com as propriedades css que serão colocados no elemento
        Element.prototype.css = function(styles){
            // Para cada name em styles
            for(let name in styles){
                // Atribui ao elemento que invocou o método a propriedade e seu valor passados no parâmetro.
                this.style[name] = styles[name];
            }
            return this;
        };

        // Método que adiciona uma classe ao elemento que invocou esse método.
        Element.prototype.addClass = function(name) {
            this.classList.add(name);
            return this;
        };

        // Método que remove uma classe do elemento que invocou esse método.
        Element.prototype.removeClass = function(name) {
            this.classList.remove(name);
            return this;
        };

        // Método que verifica se o elemento têm a classe
        Element.prototype.toggleClass = function(name) {
            // Se o elemento que invocou o método tiver a classe, ele vai remover a classe, senão ele adiciona a classe.
            this.classList.toggle(name);
            return this;
        };

        // Verifica se o elemento têm uma classe. Retorna true or false.
        Element.prototype.hasClass = function(name) {
            return this.classList.contains(name);
        };

        // Quando um elemento de formulário for invocado. HTMLFormElement é a classe mãe do Form no HTML
        // Retorna uma instância do FormData com o formulário que invocou esse método.
        HTMLFormElement.prototype.getForm = function(){

            // Retorna uma instância do FormData com o formulário que invocou esse método.
            return new FormData(this);
        };

        // Método que vai converter as informações de um FormData para JSON
        HTMLFormElement.prototype.toJSON = function(){

            let json = {}; // Declaração do objeto json
            // O form que está sendo chamado invoca o método getForm que retorna o form como um objeto FormData()
            this.getForm().forEach((value, key) => { // Percorre o FormData no forEach

                // Guarda no json a chave e o seu valor
                json[key] = value;
            });
            // Retorna o json
            return json;
        };
    }

    initEvents(){

        // Adiciona o evento de click ao clicar na foto.
        this.el.myPhoto.on('click', (event) => {

            this.closeAllLeftPanel(); // Fecha qualquer painel existente
            // Abre o painel de editar perfil.
            this.el.panelEditProfile.show();

            // SetTimeout para corrigir o bug do transition no CSS. 0.3 no css = 300 milisegundos
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open'); // Adiciona a classe open no elemento
            }, 300);
        });

        // Adiciona o evento de click ao clicar no icone de nova conversa
        this.el.btnNewContact.on('click', (event) => {
            
            this.closeAllLeftPanel();// Fecha qualquer painel existente

            // Abre o painel de adicionar contato
            this.el.panelAddContact.show();

            // SetTimeout para corrigir o bug do transition no CSS. 0.3 no css = 300 milisegundos
            setTimeout(() => {
                this.el.panelAddContact.addClass('open'); // Adiciona a classe open no elemento
            }, 300);
        });

        // Adiciona o evento de click na setinha do painel de editar perfil.
        this.el.btnClosePanelEditProfile.on('click', event => {

            // Fecha o painel de editar perfil.
            this.el.panelEditProfile.removeClass('open'); // Remove a classe open do elemento
        });

        // Adiciona o evento de click na setinha do painel de adicionar contato.
        this.el.btnClosePanelAddContact.on('click', event => {

            // Fecha o painel de editar perfil.
            this.el.panelAddContact.removeClass('open'); // Remove a classe open do elemento            
        });

        // Adiciona o evento de click na foto no form de editar perfil
        this.el.photoContainerEditProfile.on('click', event => {

            // Adiciona(força) o click do input para escolher o arquivo(foto)
            this.el.inputProfilePhoto.click();

        });

        // Adiciona o evento de preencher(keypress - quando estiverem digitando) na div que está o campo nome
        this.el.inputNamePanelEditProfile.on('keypress', event => {

            // Verifica se o usuário apertou enter
            if(event.key === 'Enter'){
                event.preventDefault(); // Cancela o comportamento padrão
                this.el.btnSavePanelEditProfile.click(); // Força o click no botão de salvar(checkzinho no campo nome)
            }
        });

        // Adiciona o evento de click no checkzinho no campo nome do form Editar Perfil
        this.el.btnSavePanelEditProfile.on('click', event => {

            // Desabilita o botão
            this.el.btnSavePanelEditProfile.disabled = true;

            // innerHTML porque é uma div com contenteditable = true
            // guarda o nome na instância do user
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;

            // Salva no Firebase
            this._user.save().then( () => {

                // Habilita o botão caso o usuário tenha sido salvo com sucesso no Firebase
                this.el.btnSavePanelEditProfile.disabled = false;
            });

        });

        // Adiciona um evento de quando o formulário for enviado no form de Adicionar Contato
        this.el.formPanelAddContact.on('submit', event => {

            event.preventDefault();// Cancela o comportamento padrão do form

            // Faz uso da API FormData, passando o formulário Adicionar Contato
            let formData = new FormData(this.el.formPanelAddContact);

            // Pega o email do contato(usuário) que vai ser adicionado
            let contact = new User(formData.get('email'));

            // Cria o evento de mudança de dados
            contact.on('datachange', data => {

                // Se o usuário for encontrado
                if(data.name) {

                    // Cria a conversa se não existir, se existir traz o ID
                    Chat.createIfNotExists(this._user.email, contact.email).then(chat => {

                        // Guarda o ID do chat no contato(VC)
                        contact.chatId = chat.id;

                        // Guarda o ID do chat no seu usuário(EU)
                        this._user.chatId = chat.id;

                        // Adiciona no contato(VC) o SEU USUÁRIO(EU)
                        contact.addContact(this._user);

                        // Adiciona o contato
                        this._user.addContact(contact).then( () => {

                        // Força o click para fechar o painel
                        this.el.btnClosePanelAddContact.click();
                        console.info('Contato adicionado.');

                        });
                    });
                    
                } else {
                    console.error('Usuário não foi encontrado');
                }
            });

        });

        // Faz um forEach nos contatos. Busca na div contactsMessagesList todos os elementos com a classe contact-item
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

            // Adiciona o evento de click em cada contato encontrado.
            item.on('click', event => {

                this.el.home.hide(); // Esconde a tela home
                // Mostra a tela de conversa com o contato, invocando o método css criado no prototype para mudar o display para flex
                this.el.main.css({
                    display: 'flex'
                });
            })
        });

        // Adiciona o evento de click no icone de anexar(clipszinho na conversa)
        this.el.btnAttach.on('click', event => {

            // Para a propagação do evento.(Não deixa ele executar o evento para elementos ancestrais)
            // Sem ele, o menu não iria abrir, pois seria adicionado o evento de click no document que remove o evento de click, removendo o click do menu e bugando
            event.stopPropagation();

            // Abre o menu de anexar adicionando a classe open no CSS
            this.el.menuAttach.addClass('open');

            // Adiciona o evento de click no documento para quando clicar fora do menu ou clicar em um item ele fechar o menu
            // É preciso dar um nome para a função passada no evento porque depois será necessário remove-la do documento
            // .bind(this) manipula o escopo, sem ele, daria um erro e o escopo seria o #document, adicionando o bind(this) o escopo continua sendo o controller
            document.addEventListener('click', this.closeMenuAttach.bind(this));
        });

        // Adiciona o evento de click no botão de anexar foto no menu de anexar
        this.el.btnAttachPhoto.on('click', event => {
            
            // Força o click no input
            this.el.inputPhoto.click();
        });

        // Adiciona o evento que espera uma mudança no inputPhoto
        this.el.inputPhoto.on('change', event => {

            console.log(this.el.inputPhoto.files);
            // [... coleção] = spread transforma uma coleção para array para utilizar o forEach
            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            });
        });

        // Adiciona o evento de click no botão de camera no menu de anexar
        this.el.btnAttachCamera.on('click', event => {
            
            // Esconde o painel de conversa
            this.closeAllMainPanel();
            // Adiciona a classe que abre o painel da camera
            this.el.panelCamera.addClass('open');

            // Corrige o layout do painel da camera
            this.el.panelCamera.css({
                'height': 'calc(100% - 120px)'
            });

            // Cria uma instância da camera, passando como parâmetro no construtor o elemento HTML video onde será renderizado em tempo real o que a camera está vendo
            this._camera = new CameraController(this.el.videoCamera);
        });

        // Adiciona o evento de click no xzinho que fecha o painel da camera
        this.el.btnClosePanelCamera.on('click', event => {

            // Esconde o painel da camera removendo a classe open
            this.closeAllMainPanel();

            // Mostra o painel da conversa
            this.el.panelMessagesContainer.show();

            // Para a camera
            this._camera.stop();

        });

        // Adiciona o evento de click no botão de tirar foto
        this.el.btnTakePicture.on('click', event => {
            
            // Chama o método que tira foto
            let dataUrl = this._camera.takePicture();

            // Guarda o retorno do takePicture(dataUrl - canvas em base64) no source da tag img
            this.el.pictureCamera.src = dataUrl;

            // Mostra a img que estava escondido
            this.el.pictureCamera.show();

            // Esconde o video
            this.el.videoCamera.hide();

            // Mostra  o botão de tirar outra foto
            this.el.btnReshootPanelCamera.show();

            // Oculta o botão de tirar foto pois nesse momento a foto já foi tirada
            this.el.containerTakePicture.hide();

            // Mostra o botão de enviar a foto
            this.el.containerSendPicture.show();
        });

        // Adiciona o evento de click no botão de tirar foto novamente no painel da camera
        this.el.btnReshootPanelCamera.on('click', event => {

            // Esconde a img
            this.el.pictureCamera.hide();

            // Mostra o video
            this.el.videoCamera.show();

            // Esconde  o botão de tirar outra foto
            this.el.btnReshootPanelCamera.hide();

            // Mostra o botão de tirar foto
            this.el.containerTakePicture.show();

            // Esconde o botão de enviar a foto
            this.el.containerSendPicture.hide();
        });

        // Adiciona o evento de click no botão de enviar a foto
        this.el.btnSendPicture.on('click', event => {

            console.log(this.el.pictureCamera.src);
        });

        // Adiciona o evento de click no botão de anexar documento no menu de anexar
        this.el.btnAttachDocument.on('click', event => {
            
            // Esconde o painel de conversa
            this.closeAllMainPanel();

             // Adiciona a classe que abre o painel do document preview
            this.el.panelDocumentPreview.addClass('open');

            // Corrige o layout do painel do document preview
            this.el.panelDocumentPreview.css({
                'height': 'calc(100% - 120px)'
            });

            // Força o click no input para abrir o dialogo para escolher o arquivo a ser enviado
            this.el.inputDocument.click();
        });

        // Adiciona o evento change(evento que espera uma mudança) no inputDocument
        this.el.inputDocument.on('change', event => {

            // Verifica se algum arquivo foi enviado
            if (this.el.inputDocument.files.length) {

                // Corrige o layout do painel do document preview
                this.el.panelDocumentPreview.css({
                    'height': '1%'
                });

                // Pega o primeiro arquivo
                let file = this.el.inputDocument.files[0];

                // Cria uma instância do DocumentPreview passando o arquivo como parâmetro
                this._documentPreviewController = new DocumentPreviewController(file);

                // Executa o método que retorna uma promise com o preview do arquivo
                this._documentPreviewController.getPreviewData().then(result => {


                    // Guarda o retorno do getPreviewData() na tag img quando o retorno for imagem
                    this.el.imgPanelDocumentPreview.src = result.src;

                    // Guarda o nome do arquivo que veio na promise no HTML
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;

                    // Mostra o painel onde será mostrado o preview do arquivo quando for IMAGEM
                    this.el.imagePanelDocumentPreview.show();

                    // Esconde o painel que mostra o preview do arquivo
                    this.el.filePanelDocumentPreview.hide();

                    // Corrige o layout do painel do document preview
                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });

                }).catch(error => {

                    // Corrige o layout do painel do document preview
                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });
                    
                    // Caso não seja uma imagem ou PDF, cai aqui
                    switch(file.type){
                        // Caso o arquivo seja excel
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            // Altera a classe do icone para mostrar o icone Excel
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;

                        // Caso seja powerpoint
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            // Altera a classe do icone para mostrar o icone PowerPoint
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        // Caso seja documento Word
                        case 'application/vnd.msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            // Altera a classe do icone para mostrar o icone documento Word
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                        default:
                            // Altera a classe do icone para mostrar o icone genérico
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;
                    }

                    // Coloca o nome do arquivo no HTML
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;

                    // Esconde o painel onde será mostrado o preview do arquivo quando for IMAGEM
                    this.el.imagePanelDocumentPreview.hide();

                    // Mostra o painel que mostra o preview do arquivo
                    this.el.filePanelDocumentPreview.show();
                });
            }
        });

        // Adiciona o evento de click no icone de fechar o painel de document preview
        this.el.btnClosePanelDocumentPreview.on('click', event => {

            // Esconde o painel da camera removendo a classe open
            this.closeAllMainPanel();

            // Mostra o painel da conversa
            this.el.panelMessagesContainer.show();
        });

        // Adiciona o evento de click no icone que envia o documento no painel de document preview
        this.el.btnSendDocument.on('click', event => {

            console.log('send document');
        });

        // Adiciona o evento de click no botão de anexar contato no menu de anexar
        this.el.btnAttachContact.on('click', event => {
            // Mostra o modal de contatos
            this.el.modalContacts.show();
        });

        // Adiciona o evento de click no icone de fechar o modal de contatos
        this.el.btnCloseModalContacts.on('click', event => {
            // Esconde o modal de contatos
            this.el.modalContacts.hide();
        });

        // Adiciona o evento de click no icone do microfone
        this.el.btnSendMicrophone.on('click', event => {

            // Mostra o menu de gravação de audio
            this.el.recordMicrophone.show();

            // Esconde o botão de microfone
            this.el.btnSendMicrophone.hide();

            // Faz instância do MicrophoneController
            this._microphoneController = new MicrophoneController();


            // Adiciona o evento ready para saber quando o mic estiver disponivel, começar a gravar
            this._microphoneController.on('ready', audio => {

                console.log('Ready Event');

                // Inicia a gravação
                this._microphoneController.startRecorder();

            });

            this._microphoneController.on('recordtimer', timer => {

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

        // Adiciona o evento de click no icone de cancelar o microfone no menu de gravação de audio
        this.el.btnCancelMicrophone.on('click', event => {

            // Para a gravação do microfone
            this._microphoneController.stopRecorder();

            // Fecha o menu de microphone
            this.closeRecordMicrophone();
        });

        // Adiciona o evento de click no icone de finalizar a gravação de audio
        this.el.btnFinishMicrophone.on('click', event => {

             // Para a gravação do microfone
             this._microphoneController.stopRecorder();

            this.closeRecordMicrophone();
        });

        // Adiciona o evento de keyup(se o usuário está digitando) no input de enviar mensagem na conversa
        this.el.inputText.on('keyup', event => {

            // Se tiver conteúdo na div de enviar mensagem
            if(this.el.inputText.innerHTML.length){

                // Esconde o placeholder
                this.el.inputPlaceholder.hide();
                
                // Esconde o botão do microfone
                this.el.btnSendMicrophone.hide();

                // Mostra o botão de enviar mensagem
                this.el.btnSend.show();
            } else {

                // Mostra o placeholder
                this.el.inputPlaceholder.show();    
                
                 // Mostra o botão do microfone
                 this.el.btnSendMicrophone.show();

                 // Esconde o botão de enviar mensagem
                 this.el.btnSend.hide();

            }
        });

        // Adiciona o evento keypress(a tecla está sendo pressionada - para saber qual tecla o usuário pressionou) no inputText da conversa
        this.el.inputText.on('keypress', event => {

            // Se o usuário apertou Enter sem estar pressionando o CTRL
            if(event.key === 'Enter' && !event.ctrlKey){

                event.preventDefault(); // Cancela o comportamento padrão da tecla enter

                this.el.btnSend.click(); // Força o click no botão enviar
            }
        })

        // Adiciona o evento de click no botão de enviar mensagem
        this.el.btnSend.on('click', event => {

            // Envia a mensagem, passando o id do chat ativo e a mensagem
            Message.send(this._contactActive.chatId, this._user.email, 'text', this.el.inputText.innerHTML);

            // Limpa o campo de mensagem
            this.el.inputText.innerHTML = '';

            // Fecha o painel de emojis caso ele esteja aberto
            this.el.panelEmojis.removeClass('open');
        });

        // Adiciona o evento de click no icone dos emojis
        this.el.btnEmojis.on('click', event => {

            // Abre o painel dos emojis quando clica no icone e fecha se clicar denovo
            this.el.panelEmojis.toggleClass('open');

        });

        // Pega cada emoji do painel de emojis e faz um forEach
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

            // Adiciona o evento de click para cada emoji
            emoji.on('click', event => {

                console.log(emoji.dataset.unicode);

                // Clona o node do emoji
                let img = this.el.imgEmojiDefault.cloneNode();

                // Atribui ao emoji clonado o mesmo css do emoji
                img.style.cssText = emoji.style.cssText;

                // Copia o unicode do emoji para o clone
                img.dataset.unicode = emoji.dataset.unicode;

                // Guarda o unicode no alt da img
                img.alt = emoji.dataset.unicode;

                // Faz um forEach percorrendo as classes css do emoji
                emoji.classList.forEach( name => {

                    // Atribui ao clone as classes css do emoji
                    img.classList.add(name);
                });

                // Pega o cursor(do teclado) da janela
                let cursor = window.getSelection();

                // cursor.focusNode = para saber se o cursor está definido, pegar o node no qual o cursor está focado
                // Se não estiver focado em lugar nenhum ou o id do node onde o cursor está focado não for igual ao input-text(id do campo de texto)
                if(!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
                    // Força o foco no campo de texto
                    this.el.inputText.focus();

                    // Pega o cursor dentro do campo de texto
                    cursor = window.getSelection();
                }

                // Cria um range(intervalo)
                let range = document.createRange();

                // Pega a posição do cursor
                range = cursor.getRangeAt(0);

                // Apaga os caracteres que estão selecionados
                range.deleteContents();

                // Cria um fragmento(utilizado para fazer uma alteração em uma sentença, interferir no meio de uma expressão)
                let frag = document.createDocumentFragment();

                // Guarda o emoji clonado no fragmento
                frag.appendChild(img);

                // Insere o fragmento com o emoji clonado no range selecionado
                range.insertNode(frag);

                // Coloca o cursor após a img(emoji)
                range.setStartAfter(img);

                // Força o evento de keyup no campo de texto para sumir com o placeholder quando colocar o emoji
                this.el.inputText.dispatchEvent(new Event('keyup'));

            });
        });

    }

    // Método que esconde o menu de gravação de audio e habilita o botão de microfone novamente
    closeRecordMicrophone(){

         // Mostra o menu de gravação de audio
         this.el.recordMicrophone.hide();

         // Esconde o botão de microfone
         this.el.btnSendMicrophone.show();
    }

    // Método que fecha todos os paineis principais
    closeAllMainPanel(){

        // Esconde o painel de conversa
        this.el.panelMessagesContainer.hide();

        this.el.panelCamera.removeClass('open');
        this.el.panelDocumentPreview.removeClass('open');
    }

    // Método que fecha o menu de anexar
    closeMenuAttach(event){

        // Remove o evento do documento
        document.removeEventListener('click', this.closeMenuAttach);

        // Fecha o menu(remove a classe open do menu)
        this.el.menuAttach.removeClass('open');
    }

    // Fecha todos os paineis do lado esquerdo
    closeAllLeftPanel(){

        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();

    }
}