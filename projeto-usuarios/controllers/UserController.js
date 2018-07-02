class UserController {

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId); // Pega o formulario utilizando o ID passado como parâmetro na instância de UserController
        this.tableEl = document.getElementById(tableId); // Pega a tabela onde sera inserido o novo usuario no HTML

        this.onSubmit(); // Chama o evento submit
        this.onEdit(); // Chama o evento
    }

    // Evento disparado ao clicar no botão cancelar no formulário de edit user
    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
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

            let values = this.getValues();

            if(!values) return false; // Cai aqui quando o getValues retornar false

            this.getPhoto().then((content) => { // Executa a primeira função qnd der certo, qnd der errado executa a segunda
                values.photo = content;
                this.addLine(values); // Passa o usuario para criar os elementos no HTML

                this.formEl.reset(); // Limpa o formulário

                btn.disabled = false; // Habilita o botão novamente após a criação do usuário

            },(e) => {
                console.error(e);
            });
        
        });
    }

    // Tratamento da imagem
    getPhoto(){

        return new Promise((resolve, reject) => { // Quando der certo , executa o resolve. Quando der errado, executa o reject

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => { // Filtra o array buscando pelo campo photo, e retorna um novo array soh com os dados filtrados
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
    getValues(){

        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(function(field, index){ // percorre todos os campos(elementos) do formulario e coloca no objeto JSON user // [...] usar operador spread qnd for percorrer objetos HTML utilizando forEach

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


    // Adiciona um usuario no HTML
     addLine(dataUser) {
        //console.log("addLine()", dataUser);
        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser); // Transforma o objeto dataUser em string (Serialização), utilizando a api DataSet

        tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin ? 'Sim' : 'Não')}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                    `;

        tr.querySelector(".btn-edit").addEventListener("click", e => { // Evento disparado ao clicar no botão EDITAR
            let user = JSON.parse(tr.dataset.user);
            this.showPanelUpdate();
        });

        this.tableEl.appendChild(tr);
        this.updateCount(); // Atualiza o número de usuários

                //document.getElementById('table-users').appendChild(tr); // colocando o tr dentro da tabela na tag tbody
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