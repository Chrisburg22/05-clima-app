const axios = require('axios').default;

class Busquedas {
    
    historial = ['Tegucigalpa', 'Madrid', 'San José'];

    constructor(){
        //TODO: leer DB si existe
    }

    get paramsMapbox(){
        return{
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        }
    }

    async Ciudad( lugar = ''){

        try{
            //peticion http
            const instance = await axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
    
            const resp = await instance.get();
            console.log(resp.data);
            return [];
        } catch (err){

        }


        return [];

    }


}

module.exports = Busquedas;