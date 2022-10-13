const fs = require('fs');

const axios = require('axios').default;

class Busquedas {
    
    historial = [];
    dbPath = './db/databases.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        })
    }

    get paramsMapbox(){
        return{
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY,//process.env nos permite acceder a las variables de entorno de la aplicacion
            'limit': 5
        }
    }

    get paramsWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async Ciudad( lugar = ''){

        try{
            //peticion http
            const instance = await axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            //Retorna la informacino obtenida en la peticion http y la guarda en una constante
            const resp = await instance.get();
            //Se retorna un Array nuevo con el metodo map, que recorre el Array features que se obtine de la data obtenida de la peticion http
            return resp.data.features.map( lugar => ({
                id: lugar.id,            //Id unico de cada cuidad encontrada el la peticion API
                nombre: lugar.place_name,//Nombre de la ciudad encontrada
                lng: lugar.center[0],    //Longitud de la cidad
                lat: lugar.center[1]     //LAtitud de la mismo
            }));
        } catch (err){
            return [];
        }
    }

    async climaLugar( lat, lon){
        
        const paramsOpenWeather = {
            'lang': 'es',
            'lat': `${lat}`,
            'lon': `${lon}`,
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric'
        }; 

        try{
            
            const instance = await axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: paramsOpenWeather
            });

            const resp = await instance.get();
            const wheatherData = resp.data.weather.pop();
            const {temp, temp_min, temp_max} = resp.data.main;

            return {
                'desc': wheatherData.description,
                'min': temp_min,
                'max': temp_max,
                'tem': temp
            };

        } catch(err){
            console.log(err);
        }
    }

    async climaLugarProfesor(lat, lon){

        try{
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            })

            const resp = await instance.get();
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_min,
                temp: main.temp
            }
        } catch(err) {
            console.log(err);
        }
    }

    agregarHistorial( lugar = '' ){
        //TODO: prevenir duplicados
        if( this.historial.includes( lugar.toLocaleLowerCase()) ){
            return;
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //GUARDAR EN BASE DE DATOS
        this.guardarDB();

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payload))
    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)){
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);

        this.historial = data.historial;
    }

}

module.exports = Busquedas;