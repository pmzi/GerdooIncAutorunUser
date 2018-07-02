const os = window.os;

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

    /**
     * Gets an OS by it's id
     * @param {String} id - The id of the OS
     * @returns {Promise}
     */

    static getById(id){
        return new Promise(async (resolve, reject)=>{

            let foundOS = os.getById(id);

            resolve(foundOS)

        })
    }

}

// Let's load the OSes

OSManager.load();