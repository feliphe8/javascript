//import { resolve } from "url";

// Faz uso do PdfJs Lib
const pdfjsLib = require('pdfjs-dist');

// Faz uso da API Path para não ter problema com caminho
const path = require('path');

// Define o caminho do Worker[worker roda fora da nossa aplicação, para processos que podem demorar muito] (a pasta dist só existe em tempo de execução)
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');



export class DocumentPreviewController {

    constructor(file){

        this._file = file;

    }

    // Método que retorna uma promise com o preview do arquivo
    getPreviewData(){

        return new Promise((resolve, reject) => {

            // Faz usso do FileReader
            let reader = new FileReader();

            // Faz um switch para saber o tipo de arquivo
            switch(this._file.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    // Caso dê tudo certo, executa o onload
                    reader.onload = event => {

                        // Em caso de sucesso passa o resultado do reader.result
                        resolve({
                            src: reader.result,
                            info: this._file.name
                        });
                    };

                    // Caso dê errado, executa o onerror
                    reader.onerror = event => {

                        reject(event);
                    };

                    // Lê o arquivo como dados de url
                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':

                    // Carrega o reader
                    reader.onload = event => {

                        // getDocument() retorna uma promise - é preciso passar um Array de 8 bits como parâmetro
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

                            // Pega a primeira pagina do pdf - retorna uma promise
                            pdf.getPage(1).then(page => {

                                // Pega o viewport(espaço de visualização) da pagina. O 1 no parâmetro é scale(zoom)
                                let viewport = page.getViewport(1);

                                //  Cria o canvas onde será colocado o preview
                                let canvas = document.createElement('canvas');
                                // Define o contexto do canvas
                                let canvasContext = canvas.getContext('2d');

                                // Define a altura e largura do canvas para a altura e largura do viewport
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                // Gera o preview, passando o contexto do canvas e o viewport. Retorna uma promise
                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(() => {

                                    // Verifica se tem mais de uma página para adicionar o s em paginaS
                                    let s = (pdf.numPages > 1) ? 's' : '';

                                    // Retorna as informações do arquivo que estão no canvas e o número de páginas que veio do pdf
                                    resolve({
                                        src: canvas.toDataURL('image/png'), // Exporta o canvas como png
                                        info: `${pdf.numPages} página${s}`
                                    });

                                }).catch(error => {
                                    reject(error);
                                });


                            }).catch(error => {
                                resolve(error);
                            });

                        }).catch(error => {

                            reject(error);
                        });
                    };

                    // Transforma em ArrayBuffer
                    reader.readAsArrayBuffer(this._file);

                    break;

                default:
                    reject();
            }
        });
    }
}