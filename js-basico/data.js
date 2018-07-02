let now = Date.now(); // retorna timestamp em milisegundos = quantidade de segundos desde 1/1/1970
let agora = new Date();
console.log(agora.getDate());
console.log(agora.getFullYear());
console.log(agora.getMonth()); // array, começa em 0
console.log(agora.toLocaleDateString("pt-BR")); // formata no padrão passado no argumento