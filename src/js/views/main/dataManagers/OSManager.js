const OS = require('../../../models/OS');

// Instantiation

const os = new OS();

// OSManager class handles events and datas related to the OSes

class OSManager{

    /**
     * Loads the OSes in the proper elements
     * @returns {Promise}
     */
    
    static load(){

        return new Promise(async(resolve, reject)=>{

            let oses = await os.fetchAll("_id",1);

            for(let singleOs of oses){

                $('.osList').append(`<option value='${singleOs._id}'>${singleOs.name}</option>`);

            }

            resolve();

        })

    }

}

// Let's load the OSes

OSManager.load();