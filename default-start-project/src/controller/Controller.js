class Controller {

    constructor(){

        this.elementsPrototype();
        this.loadElements(); // Pega todos os elementos HTML que possui id
    }

    loadElements(){

        this.el = {}; // Os elementos serão colocados nesse objeto.

        // Pega todos os elementos que possuem id e faz um forEach pegando cada elemento
        document.querySelectorAll('[id]').forEach(element => {

            // Atribui ao this.el o elemento HTML com o seu id convertido de btn-send para CamelCase(btnSend)
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }

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
    }
}