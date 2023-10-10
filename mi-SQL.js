const fs = require('fs');
var errorMessage = [];
const logFileName = './error.log';
const formatDate = {
    day:    'numeric',
    month:  'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
};

//Funcion que verifica la cadena entrante solo tiene letras
function isOnlyLetters(str) {
    return /^[A-Za-z\s]*$/.test(str);
}

//Funcion que verfica que numero de entrada si es un mumero
function isDigit(num){
    return /^[+-]?\d+(\.\d+)?$/.test(num);
}

//Funcion que verifica que los valores del arreglo no esten vacios, retorna un true o false
function isEmpyQuery(query){
    for (let i = 0; i < query.length; i++){
        if(query[i].length == 0){
            //console.log(query[i]);
            return true;
        }
    }
    return false;
}

//Funcion que verfica que sea un correo electronico
function isEmail(str) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
}


//Funcion que verifica los tipos, retorna un arreglo con los mesajes de error 
function vertifyType(query, top, indexRecord){
    var error = []
    query.forEach(function (queryData, index) {
        switch (index) {
            case 0:
            case 2:
            case 3:
                if(!isOnlyLetters(queryData)){
                    error.push(`${(new Date(Date.now()).toLocaleString(undefined, formatDate))} - el campo ${top[index]} no tiene el formato valido en el registro ${indexRecord}\n`);
                }
                break;
            case 6:
                if(!isEmail(query)){
                    error.push(`${(new Date(Date.now()).toLocaleString(undefined, formatDate))} - el campo ${top[index]} no tiene el formato valido en el registro ${indexRecord}\n`);
                }
                break;
            default:
                if(!isDigit(query)){
                    error.push(`${(new Date(Date.now()).toLocaleString(undefined, formatDate))} - el campo ${top[index]} no tiene el formato valido en el registro ${indexRecord}\n`);
                }
                break;
        }
    });
    //console.log(error);
    return error;
}

fs.readFile('database.txt','utf8',(err,data) => {
    if (err) {
        console.error(err);
        return;
    }   
    var cadena_split = data.split('\n');
    const top = cadena_split[0].split(','); 
    if (!fs.existsSync(logFileName)) {
        console.log('file exists');
        fs.openSync(logFileName, 'w');
    } 
    console.log(top);
    for (let i = 1; i < cadena_split.length; i++) {
       // console.log(`Reglones ${i}: ${cadena_split[i]}`);
        var query = cadena_split[i].split(',');
        if (top.length != query.length || query.length == 0) {
            console.log("Datos incorrectos o incompletos");
            errorMessage =`${(new Date(Date.now()).toLocaleString(undefined, formatDate))} - Datos incorrectos o incompletos en el registro ${i}\n`;
            fs.appendFile(logFileName,errorMessage, function (err) {
                if (err) throw err;
                console.log('Se han salvado correctamente en el log!');
            });
            continue;
        }
        //verfica continen elementos vacios
        if(isEmpyQuery(query)){
            console.log("Existen elementos vacios en el registro");
            errorMessage =`${(new Date(Date.now()).toLocaleString(undefined, formatDate))} - existen elementos vacios en el registro ${i}\n`;
            fs.appendFile(logFileName,errorMessage, function (err) {
                if (err) throw err;
                console.log('Se han salvado correctamente en el log!');
            });
            continue;
        }

        //Se verifican los tipos si son correctos
        errorMessage = vertifyType(query,top, i);
        if (errorMessage.length != 0) {
            console.log("Error Message");
            errorMessage.forEach(message => {
                fs.appendFile(logFileName,message, function (err) {
                    if (err) throw err;
                    console.log('Se han salvado correctamente en el log!');
                });
            });
            
        }
        query.forEach(function (queryData, index) {
            console.log(`${top[index]} = ${queryData}`);
        });
    }
});
console.log("END");