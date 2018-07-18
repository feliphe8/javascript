export class CameraController {

    constructor(videoEl){

        this._videoEl = videoEl;

        // Acessa os dispositivos do usuário e pede permissão para utilizar o video, retorna uma promise
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {


            this._stream = stream;

            // createObjectUrl - cria arquivos no formato binário do tipo file ou blob
            // Cria um arquivo binário com o retorndo da promessa(stream) e guarda no source do elemento HTML video
            this._videoEl.src = URL.createObjectURL(stream);

            // Toca o video
            this._videoEl.play();
        }).catch(error => {
            console.error(error);
        });

    }

    // Método que interrompe a camera
    stop(){

         // getTracks retorna um array
         this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Método que tira foto
    takePicture(mimeType = 'image/png'){
        
        // Cria o canvas onde será desenhado a imagem
        let canvas = document.createElement('canvas');

        // Define a altura e largura do canvas para a altura e largura do video
        canvas.setAttribute('height', this._videoEl.videoHeight);
        canvas.setAttribute('width', this._videoEl.videoWidth);

        // Define o contexto do canvas 2d ou 3d
        let context = canvas.getContext('2d');

        // Desenha na tela o video, começando em x = 0 e y = 0, com a altura e largura do video
        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

        // Retorna o canvas em base64
        return canvas.toDataURL(mimeType);

    }
}