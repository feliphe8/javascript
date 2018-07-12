class Fetch {

    static get(url, params = {}){

        return Fetch.request('GET', url, params); // chama o método request nessa classe e retorna
    }

    static delete(url, params = {}){

        return Fetch.request('DELETE', url, params); // chama o método request nessa classe e retorna
    }

    static put(url, params = {}){

        return Fetch.request('PUT', url, params); // chama o método request nessa classe e retorna
    }

    static post(url, params = {}){

        return Fetch.request('POST', url, params); // chama o método request nessa classe e retorna
    }

    static request(method, url, params = {}) {

        return new Promise((resolve, reject) => {

            let request;

            // faz o switch de acordo com o método que foi pedido
            switch (method.toLowerCase()) {
                case 'get':
                    request = url;
                    break;
            
                default: // Monta a requisição para os métodos POST, PUT e DELETE
                    request = new Request(url, {
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({'Content-Type' : 'application/json'})
                    });
                    break;
            }

           fetch(request).then(response => {// Retorna uma promise
                response.json().then(json => {// o json traz outra promise

                    resolve(json);
                }).catch(e => { // erro do json
                    reject(e);
                });

           }).catch(e => { // erro do fetch
            reject(e);
        });

        });
    }
}