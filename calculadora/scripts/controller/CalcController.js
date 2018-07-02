class CalcController {

    constructor(){


        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcElement = document.querySelector("#display"); // Pega o elemento HTML pelo seletor CSS
        this._dateElement = document.querySelector("#data");
        this._timeElement = document.querySelector("#hora");// com o _ no começo siginifica = private; 
        this._currentDate; // atributo privado
        this.initialize(); // executa o método initialize() ao instanciar o objeto
        this.initButtonEvents();
        this.initKeyboard();

        // BOM - Browser Object Model = Janela
        // DOM - Document Object Model = Documento
        // Cada elemento HTML vira Objeto da coleção HTMLDocument
    }

    copyToClipboard(){
        let input = document.createElement('input'); // Cria um input
        input.value = this.displayCalc;
        document.body.appendChild(input); // Coloca o input no body

        input.select();

        document.execCommand("Copy"); // Executa no sistema operacional, faz a copia

        input.remove(); // Remove o elemento
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text'); // Tipo de informção que eu estou trazendo
            this.displayCalc = parseFloat(text);

        });
    }

    initialize(){
        
        this.setDisplayDateTime();
        // Executa a cada 1s = 1000 milisegundos
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000); // Função executada em um intervalo de tempo - o tempo é marcado em milisegundos

        //setTimeout(() => {
            //clearInterval(interval); // Para o setInterval após 10 segundos
        //}, 10000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        // Adicionando o evento Double Click para habilidar o Audio
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff; // Se audio for true retorna false, senão true
    }

    playAudio(){

        if (this._audioOnOff) {

            this._audio.currentTime = 0; // Reseta o audio para sempre tocar do inicio.
            this._audio.play();
        }
    }

    // Eventos de Teclado
    initKeyboard(){
        document.addEventListener('keyup', e => {

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();  // Se o CTRL foi segurado
                    break;
            }
        });
    }

    // Adicionando multiplos eventos a um elemento, executando a mesma função
    addEventListenerAll(element, events, func){
        // Splita os eventos passado no parâmetro em um array, e percorre cada evento adicionando o mesmo ao elemento junto com a função a ser executada.
        // O false é por causa do SVG no HTML
        events.split(' ').forEach(event => {
            element.addEventListener(event, func, false);
        });

    }
    // Tecla AC da calculadora
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    // Tecla CE da calculadora
    clearEntry(){
        this._operation.pop(); // Remove o ultimo elemento adicionado no array
        this.setLastNumberToDisplay();
    }

    // Retorna a ultima operação adicionado no array
    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    // Troca o operador no array.
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
        return (['+', '-', '*','%', '/'].indexOf(value) > -1);// busca o valor passado no parâmetro dentro do array
            // Retorna true se for um OPERADOR
    }

    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult(){

        try{
            return eval(this._operation.join("")); // join("") é o oposto do split, junta a operação 10 + 90 em uma string e o eval calcula essa string retornando 100 em string

        }catch(e){
            setTimeout(() =>{
                this.setError();
            }, 1);
        }
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            
            last = this._operation.pop(); // Retira o ultimo operador do array. Ex: 10 + 90 *, ele retira o * e fica 10 + 90
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false); // Passando false pega o número
        }

        let result = this.getResult();

        if (last == '%') {
           result /= 100;
           this._operation = [result];
        } else {

        this._operation = [result]; // Gera um novo array, colocando o resultado na primeira posição e o operador na ultima. Ex: 100 *
        if(last) this._operation.push(last); // Adiciona se existir
        }

        this.setLastNumberToDisplay(); // Atualiza o display com o novo valor
    }

    getLastItem(isOperator = true){
        let lastItem;
        for(let i = this._operation.length - 1; i >= 0; i--){ // Percorre o array de trás para frente

            if(this.isOperator(this._operation[i]) == isOperator){ // Se não for um operador
                lastItem = this._operation[i]; // Encontrou um número
                break;
            }

        }

        if (!lastItem) { // Se não encontrar lastItem
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false); // passa false pq eu quero um número

        if(!lastNumber) lastNumber = 0; // Se não existe

        this.displayCalc = lastNumber; // Coloca na tela
    }

    addOperation(value){

        console.log('Console dentro da função addOperation(): ', value, isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())) { // isNaN = is not a number - retorna true se o valor passado NÃO for um número
            // Operador ou alguma função da calculadora
            if (this.isOperator(value)) {
                // Trocar operador
                this.setLastOperation(value); // Troca o ultimo operador no array pelo value que é outro operador
            }else {
                // Na primeira vez, quando o array estiver vazio cai aqui
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                // Number
                let newValue = this.getLastOperation().toString() + value.toString(); // Pega o ultimo valor digitado e converte para string para poder concatenar.Ex: 10 + 2 = 102
                this.setLastOperation(newValue); // adiciona um valor a operação no array operation
                // atualizar display
                this.setLastNumberToDisplay();
            }
        }
        
    }

    setError(){
        this.displayCalc = "Error";
    }

    addDot(){
        let lastOperation = this.getLastOperation();


        // Se existe lastOperation do tipo string E se já existe um ponto na operação.
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) { // Se for um operador ou undefined
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.'); // Concatena o numero com o ponto 2.
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){


        this.playAudio(); // Toca o audio toda vez q aperta um botão

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // Traz todos os elementos que dão match com os seletores passados no parâmetro
        // o querySelector() traz apenas o primeiro

        // Adiciona o event listener para cada botão que ele encontrar
        buttons.forEach((btn, index) => {
            // Evento para quando o usuario clica nas teclas da calculadora
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", ""); // Pega o nome da classe btn-9, retira o btn- e fica apenas 9
                this.execBtn(textBtn);
            });

            // Mudando o cursor para mãozinha
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        })
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: "2-digit", month: "long", year: "numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeElement.innerHTML;
    }

    set displayTime(value){
        this._timeElement.innerHTML = value;
    }

    get displayDate(){
        return this._dateElement.innerHTML;
    }

    set displayDate(value){
        this._dateElement.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcElement.innerHTML;
    }

    set displayCalc(value){

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcElement.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._dataAtual = value;
    }
}