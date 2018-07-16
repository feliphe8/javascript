class WhatsAppController {

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
            console.log('Photo');
        });

        // Adiciona o evento de click no botão de camera no menu de anexar
        this.el.btnAttachCamera.on('click', event => {
            console.log('Camera');
        });

        // Adiciona o evento de click no botão de anexar documento no menu de anexar
        this.el.btnAttachDocument.on('click', event => {
            console.log('Document');
        });

        // Adiciona o evento de click no botão de anexar contato no menu de anexar
        this.el.btnAttachContact.on('click', event => {
            console.log('Contact');
        });
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