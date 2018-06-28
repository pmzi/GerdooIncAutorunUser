const OS = require('../../../models/OS');

// Instantiation

const os = new OS();

//

class OSManager{
    
    constructor(){

        this.load();

    }
    
    load(){

        return new Promise(async(resolve, reject)=>{

            let oses = await os.fetchAll("_id",1);

            for(let singleOs of oses){

                $('.osList').append(`<option value='${singleOs._id}'>${singleOs.name}</option>`);

            }

            resolve();

        })

    }

}

new OSManager();