class HttpRequest {

    static get(url, params = {}){

        return HttpRequest.request('GET', url, params); // chama o método request nessa classe e retorna
    }

    static delete(url, params = {}){

        return HttpRequest.request('DELETE', url, params); // chama o método request nessa classe e retorna
    }

    static put(url, params = {}){

        return HttpRequest.request('PUT', url, params); // chama o método request nessa classe e retorna
    }

    static post(url, params = {}){

        return HttpRequest.request('POST', url, params); // chama o método request nessa classe e retorna
    }

    static request(method, url, params = {}) {

        return new Promise((resolve, reject) => {

            let ajax = new XMLHttpRequest();
            ajax.open(method.toUpperCase(), url);

            ajax.onerror = event => {

                reject(e);
            }

            ajax.onload = event => {

                let obj = {};

                try{
                    obj = JSON.parse(ajax.responseText);
                } catch(e){
                    reject(e);
                    console.error(e);
                }

                resolve(obj); // No caso de sucesso, passa o obj para o método que está esperando essa promise, no caso no selectAll em UserController
        };

        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(JSON.stringify(params));

        });
    }
}