import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor(){

        // Chama o constructor do pai(ClassEvent)
        super();

        // Bool para saber se o mic está disponivel
        this._available = false;

        // Define o tipo do audio
        this._mimeType = 'audio/webm';

        // Acessa os dispositivos do usuário e pede permissão para utilizar o audio, retorna uma promise
        // APENAS ACESSA O MICROFONE, NÂO GRAVA O AUDIO
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {

            this._available = true; // Deixa o mic disponivel
            this._stream = stream;

            // Método gatinho que executa a função
            this.trigger('ready', this._stream);

            //let audio = new Audio();

            // createObjectUrl - cria arquivos no formato binário do tipo file ou blob
            // Cria um arquivo binário com o retorndo da promessa(stream) e guarda no source do elemento HTML audio
            //audio.src = URL.createObjectURL(stream);

            // Toca o audio
            ///audio.play();
            
        }).catch(error => {
            console.error(error);
        });


    }

    // Retorna se o mic está disponivel
    isAvailable(){

        return this._available;
    }

    // Método que interrompe o microphone
    stop(){

        // getTracks retorna um array
        this._stream.getTracks().forEach(track => {
           track.stop();
       });
   }

   // Método que inicia a gravação do audio
   startRecorder(){

    // Se o mic está disponivel
    if(this.isAvailable()){

        // Faz uso do MediaRecorder para gravar o audio, passando a stream(o que eu quero gravar) e tipo de audio(mimeType)
        this._mediaRecorder = new MediaRecorder(this._stream, {
            mimeType: this._mimeType
        });

        // Array onde será guardado os pedaços de gravação que o MediaRecorder retorna
        this._recordedChunks = [];

        // Adiciona o evento que vai escutar a gravação(o evento é do próprio MediaRecorder)
        this._mediaRecorder.addEventListener('dataavailable', event => {
            
            // Verifica se existe dados(gravação)
            if(event.data.size > 0) this._recordedChunks.push(event.data); // Guarda o pedaço da gravação no array

        });

        // Adiciona o evento para quando a gravação parar
        this._mediaRecorder.addEventListener('stop', event => {


            // Cria um binário, passando o array com os pedaços da gravação e o tipo do audio
            let blob = new Blob(this._recordedChunks, {
                type: this._mimeType
            });

            // Cria o nome do arquivo com a palavra rec + a hora atual e concatena com a extensão webm
            let filename = `rec${Date.now()}.webm`;

            // Cria o arquivo, passando o binário, nome do arquivo e outros parâmetros(tipo do arquivo e data da ultima modificação)
            let file = new File([blob], filename, {
                type: this._mimeType,
                lastModified: Date.now()
            });

            console.log(file);

            // Faz uso do reader para ler arquivo - PARA ESCUTAR O AUDIO EM TEMPO DE EXECUÇÃO
            //let reader = new FileReader();

            // Quando carrega o arquivo
            //reader.onload = event => {

                //console.log('Reader file', file);
                // Faz uma instância de audio com as informações do reader
                //let audio = new Audio(reader.result);

                // Toca o audio
                //audio.play();

            //};

            //reader.readAsDataURL(file);
        });

        // Inicia a gravação
        this._mediaRecorder.start();

        // Inicia o timer de gravação
        this.startTimer();


    }

   }

   // Método que para a gravação do audio
   stopRecorder(){

    // Se o mic está disponivel
    if(this.isAvailable()){
        
        // Método que para a gravação
        this._mediaRecorder.stop();
        
        // Para de ouvir o microfone
        this.stop();

        // Para o timer
        this.stopTimer();
    }

   }

   startTimer(){

    let start = Date.now(); // Pega o tempo inicial da gravação

    // Estipula um intervalo de tempo de 100 milisegundos(10 vezes por segundo). e guarda o cálculo da hora atual - a hora que começou a gravação
    this._recordMicrophoneInterval = setInterval(() => {

        
        // Método gatinho que chama o evento recordtimer, passando o timer correto
        this.trigger('recordtimer', (Date.now() - start));

    }, 100);
   }

   stopTimer(){

    // Limpa o intervalo em que ficou contando o tempo na gravação do audio
    clearInterval(this._recordMicrophoneInterval);
   }
}