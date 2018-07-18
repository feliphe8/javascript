
import {Format} from './../util/Format';
import {CameraController} from './CameraController';

export class WhatsAppController {

    constructor(){

        this.elementsPrototype(); // Adiciona métodos no prototype do Element
        this.loadElements(); // Pega todos os elementos HTML que possui id
        this.initEvents(); // Inicia os eventos
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
            // innerHTML porque é uma div com contenteditable = true
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        // Adiciona um evento de quando o formulário for enviado no form de Adicionar Contato
        this.el.formPanelAddContact.on('submit', event => {

            event.preventDefault();// Cancela o comportamento padrão do form

            // Faz uso da API FormData, passando o formulário Adicionar Contato
            let formData = new FormData(this.el.formPanelAddContact);

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

            // Inicia o timer do microfone quando o menu de gravação é aberto
            this.startRecordMicrophoneTime();
        });

        // Adiciona o evento de click no icone de cancelar o microfone no menu de gravação de audio
        this.el.btnCancelMicrophone.on('click', event => {

            this.closeRecordMicrophone();
        });

        // Adiciona o evento de click no icone de finalizar a gravação de audio
        this.el.btnFinishMicrophone.on('click', event => {

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

            console.log(this.el.inputText.innerHTML);
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

    startRecordMicrophoneTime(){

        let start = Date.now(); // Pega o tempo inicial da gravação

        // Estipula um intervalo de tempo de 100 milisegundos(10 vezes por segundo). e guarda o cálculo da hora atual - a hora que começou a gravação
        this._recordMicrophoneInterval = setInterval(() => {

            this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);
        }, 100);
    }

    // Método que esconde o menu de gravação de audio e habilita o botão de microfone novamente
    closeRecordMicrophone(){

         // Mostra o menu de gravação de audio
         this.el.recordMicrophone.hide();

         // Esconde o botão de microfone
         this.el.btnSendMicrophone.show();

         // Limpa o intervalo em que ficou contando o tempo na gravação do audio
         clearInterval(this._recordMicrophoneInterval);
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