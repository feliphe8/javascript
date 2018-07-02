// Window é a janela, toda a aplicação
window.addEventListener('focus', event => {
    console.log("focus");
});

// Document é o site, página
document.addEventListener('click', event => {
    console.log("click");
});