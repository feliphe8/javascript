function calc(x, y, operator){
    // Eval = evaluate = executa a operação abaixo. Sem o eval iria retorna a string x + y
    return eval(`${x} ${operator} ${y}`);
}

let resultado = calc(10,2, "*");
console.log(resultado);

// Função anônima
(function(x, y, operador){
    return eval(`${x} ${operador} ${y}`);
})

// Arrow function
let calculo = (x, y, operador) => {return eval(`${x} ${operador} ${y}`);}
console.log(calculo(5, 2, "+"));