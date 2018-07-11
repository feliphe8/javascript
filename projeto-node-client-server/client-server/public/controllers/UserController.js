class UserController {

    constructor(formIdCreate, formIdUpdate ,tableId){
        this.formEl = document.getElementById(formIdCreate); // Pega o formulario utilizando o ID passado como parâmetro na instância de UserController
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId); // Pega a tabela onde sera inserido o novo usuario no HTML

        this.onSubmit(); // Chama o evento submit
        this.onEdit(); // Chama o evento
        this.selectAll();
    }

    // Evento disparado ao clicar no botão cancelar no formulário de edit user
    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
        });

        // Salvando os dados editados
        this.formUpdateEl.addEventListener("submit", (event) => { // Adiciona o evento submit ao form de editar

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type = submit]"); // Pega o botão de salvar do form
            btn.disabled = true; // Desabilita o botão para processamento

            let values = this.getValues(this.formUpdateEl); // Percorre todos os elementos do form update e retorna um User
            console.log(values);

            let index = this.formUpdateEl.dataset.trIndex; // Adiciona cada tr a um index e guarda em index

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            // values substitui userOld, que por sua vez substitui o objeto vazio, criando um novo
            let result = Object.assign({}, userOld, values); // Object.assign copia os valores de atributos de um objeto - cria um objeto destino, retornando este objeto.


            this.getPhoto(this.formUpdateEl).then((content) => { // Executa a primeira função qnd der certo, qnd der errado executa a segunda
                
                // Se o value do campo foto não existir no form de editar, então ele insere o value photo do userOld
                if (!values.photo) {
                    result._photo = userOld._photo;
                } else {
                    result._photo = content;
                }

                let user = new User();
                user.loadFromJSON(result); // Carrega os dados JSON dentro do objeto user

                user.save(); // Salva no localStorage

                this.getTr(user, tr);

                this.updateCount(); // Atualiza as estatísticas

                this.formUpdateEl.reset(); // Limpa o formulário de edição

                btn.disabled = false; // Habilita o botão novamente após a criação do usuário

                this.showPanelCreate(); // Mostra o form de create

            },(e) => {
                console.error(e);
            });




        });
    }

    // No evento de enviar o formulário
    onSubmit(){

        //let _this = this; // Guarda o this do escopo atual(Toda a classe) ---- Necessario apenas se for utilizar a palavra reservada function, não precisa quando usar Arrow function

        this.formEl.addEventListener("submit", (event) => {

            event.preventDefault(); // Cancela o comportamento padrão do elemento/evento. Nesse caso o formulário
            // Se usar apenas this aqui dentro, ele se referência apenas a função ---  Apenas se for utilizar a palavra reservada function, não precisa quando usar Arrow function

            let btn = this.formEl.querySelector("[type = submit]");
            btn.disabled = true; // desabilita o botão após o envio para o processamento

            let values = this.getValues(this.formEl);

            if(!values) return false; // Cai aqui quando o getValues retornar false

            this.getPhoto(this.formEl).then((content) => { // Executa a primeira função qnd der certo, qnd der errado executa a segunda
                values.photo = content;
                values.save(); // Salva no localStorage
                this.addLine(values); // Passa o usuario para criar os elementos no HTML

                this.formEl.reset(); // Limpa o formulário

                btn.disabled = false; // Habilita o botão novamente após a criação do usuário

            },(e) => {
                console.error(e);
            });
        
        });
    }

    // Tratamento da imagem
    getPhoto(formEl){

        return new Promise((resolve, reject) => { // Quando der certo , executa o resolve. Quando der errado, executa o reject

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => { // Filtra o array buscando pelo campo photo, e retorna um novo array soh com os dados filtrados
                if (item.name === 'photo'){
                    return item;
                }
            });

            let file = elements[0].files[0]; // pega o arquivo

            fileReader.onload = () => {

                resolve(fileReader.result); // função de callback para retornar para o getPhoto()

            };

            fileReader.onerror = (e) => {
                reject(e); // Quando der errado cai aqui e retorna o erro
            };

            if(file){
                fileReader.readAsDataURL(file); // Lê o arquivo
            } else {
                //reject(); // Quando nenhum arquivo é enviado, cai aqui // reject torna o envio da foto obrigatório
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    
    }


    // Percorre todos os elementos do formulário e retorna um objeto User
    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){ // percorre todos os campos(elementos) do formulario e coloca no objeto JSON user // [...] usar operador spread qnd for percorrer objetos HTML utilizando forEach

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) { // verifica se o campo existe e se não está vazio
                
                field.parentElement.classList.add('has-error'); // Acessa a classe pai do campo e adiciona a classe has-error. classList é uma coleção
                isValid = false;
            }

            if (field.name == "gender") {
        
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin"){
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        
        });
    
        if (!isValid) { // Para a execução se isValid for false
            return false;
        }
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    // Carrega todas os dados que estão na sessão
    selectAll(){

        HttpRequest.get('/users').then(data => {

            data.users.forEach(dataUser => {

                let user = new User();
    
                user.loadFromJSON(dataUser);
    
                this.addLine(user); // Adiciona uma nova linha para cada usuário que estiver no array
            });

        });// HttpRequest.get() retorna uma promise(callback)

    }

    // Adiciona um usuario no HTML
     addLine(dataUser) {
        //console.log("addLine()", dataUser);

        let tr = this.getTr(dataUser); // Guarda o retorno de getTr() na variavel tr

        this.tableEl.appendChild(tr); // Adiciona uma nova tr na tabela

        this.updateCount(); // Atualiza o número de usuários

                //document.getElementById('table-users').appendChild(tr); // colocando o tr dentro da tabela na tag tbody
    }

    // Método para criar a tr - O parâmetro tr é opcional, será usado apenas na hora de editar um tr existente
    getTr(dataUser, tr = null){

        if(tr === null) tr = document.createElement("tr"); // Verifica se tr é nulo, se for cria um

        tr.dataset.user = JSON.stringify(dataUser); // Transforma o objeto dataUser em string (Serialização), utilizando a api DataSet

        tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin ? 'Sim' : 'Não')}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                    </td>
                    `;

        this.addEventsTr(tr); // Adiciona os eventos na tr
        return tr;
    }

    // Adiciona eventos a TR update
    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if (confirm("Deseja realmente excluir este usuário?")) { // Abre uma janela de confirmação
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user)); // Carrega o user com informações que vem do JSON
                user.remove();
                tr.remove(); // Remove um item do array
                this.updateCount();
            }
        });


        tr.querySelector(".btn-edit").addEventListener("click", e => { // Evento disparado ao clicar no botão EDITAR
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; // Adiciona cada tr a um index

            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") +"]"); // Percorre o form a partir do atributo name.
                // O name vem do json, substitui o _ que vem no começo por nada

                if (field) { // Verifica se o campo existe

                    switch (field.type) {
                        case 'file': // Verifica se é um campo do tipo file, se for true, ignora tudo e vai pra proxima iteração
                            continue;

                        case 'radio': // Localiza o input do tipo radio com name gender e traz o seu value, no caso M ou F
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") +"][value=" + json[name] +"]");
                            field.checked = true;
                            break;

                        case 'checkbox':
                            field.checked = json[name]; // Traz o valor do objeto pro checked, no caso true ou false.
                            break;

                        default:
                            field.value = json[name]; 
                    }
                      
                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;
            this.showPanelUpdate();
        });
    }

    // Mostrar form de criar usuario
    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"; // Habilita o formulário de criação de usuário
        document.querySelector("#box-user-update").style.display = "none"; // Esconde o formulário de update de usuário
    }

    // Mostrar form de update de usuario
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none"; // Esconde o formulário de criação de usuário
        document.querySelector("#box-user-update").style.display = "block"; // Habilita o formulário de update de usuário
    }

    // Atualiza o número de usuários e admin
    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach( tr => { // Percorre cada elemento filho / Percorre cada elemento tr dentro do forEach()

            numberUsers++;
            let user = JSON.parse(tr.dataset.user); // Passa de string para objeto
            if(user._admin) numberAdmin++; // Tem q chamar direto da propriedade no if por causa da conversão do JSON

        });

        // Atualiza o HTML com os números de usuário e admin
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }




}