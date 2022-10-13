require('dotenv').config()

const { pausa, listadoLugares } = require("./helpers/inquirer");
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
            case 1:
                //Mostrar Mensaje
                const lugar = await leerInput("Ciudad: ");
                
                //Buscar los lugareas
                const lugares = await busquedas.Ciudad(lugar);
                
                //Imprimir liste de lugares y obtene el id del lugar seleccionado
                const id = await listadoLugares(lugares);
                if(id==='0') continue;
                
                //Crear un objeto buscando en el arreglo de objetos la considencia de id con el obtenido en la linea 23
                const lugarSeleccionado = lugares.find( l => l.id === id);

                //Guardando la DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                //Clima
                //const clima = await busquedas.climaLugar(idSeleccionado.lat,idSeleccionado.lng);
                const clima = await busquedas.climaLugarProfesor(lugarSeleccionado.lat,lugarSeleccionado.lng);
                
                //Mostrar los resultados 
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Desc: ', clima.desc.yellow);
                console.log('Temp:', clima.temp);
                console.log('Mín:', clima.min);
                console.log('Máx:', clima.max);
                await pausa();
                break;
            case 2:
                //busquedas.historial.forEach
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i+1}`.green;
                    console.log(`${idx} ${lugar}`);
                });
                await pausa();
                break;
        }
    }while(opt!== 0);

}

main();