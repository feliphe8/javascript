let carros = ["palio 98", "toro", "uno", 10, true, new Date(), function(){}];
console.log(carros);
console.log(carros.length);
console.log(carros[0]);
console.log(carros[5].getFullYear);
console.log(carros[6]()); // invocando a função

carros.forEach(function(value, index){
    console.log(index, value);
});