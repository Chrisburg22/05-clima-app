require('dotenv').config()

const { pausa } = require("./helpers/inquirer");
const { menuInquirer } = require("./helpers/inquirer");
const { leerInput } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

//console.log(process.env);
const main = async() => {

    const busquedas =  new Busquedas();
    let opt = ' ';

    do{
        opt = await menuInquirer();
        switch( opt ){
            //Mostrar Mensaje
            case 1:
                const lugar = await leerInput("Ciudad: ");
                await busquedas.Ciudad(lugar);
                await pausa();
            //Buscar los lugareas
            
            //Seleccionar el lugar
            
            //Clima
            
                //Mostrar los resultados 
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', );
                console.log('Lat:', );
                console.log('Lng:', );
                console.log('Temperatura:', );
                console.log('Mínima:', );
                console.log('Máxinma:', );
                break;
        }
    }while(opt!== 0);

}

main();