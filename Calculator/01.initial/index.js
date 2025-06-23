var numero1 = document.getElementById("numero1");
var numero2 = document.getElementById("numero2");
var Result = document.getElementById("resultado");
var Operation = document.getElementById("operation");
var Calcular = document.getElementById("calcular");

Calcular.addEventListener("click", function() {
    console.log(numero1.value);
    console.log(numero2.value);
    console.log(operation.value);
    if(numero1.value == "" || numero2.value == "") {
        alert ("Por favor, ingrese ambos números");
        return;
    }


    var num1 = parseFloat(numero1.value);
    var num2 = parseFloat(numero2.value);
    
    if (isNaN(num1) || isNaN(num2)){
        alert("Por favor, ingresa numeros validos.");
        return;
    }

    if (Operation.value== "+") {
        Result.value = num1 + num2;
    } else if (Operation.value=="-") {
        Result.value = num1 - num2;
    } else if (Operation.value== "*") {
        Result.value = num1 * num2;
    } else if (Operation.value== "/") {
        if (num2 == 0){
            alert("no se puede dividir")
            return;
        }
        Result.value = num1 / num2;
    } else if (Operation.value== "%") {
        Result.value = num1 % num2;
    }

})
