const Model = require('./Model');

// The GeneralInfo model

class GeneralInfo extends Model{

    /**
     * @constructor loads the DB
     */

    constructor(){

        super();

        this.dbName = 'GeneralInfo';

        this.loadDatabase();

    }

    /**
     * Gets the spicific record
     * @param {String} title
     * @returns {Promise}
     */

     getSpecific(title){
        return new Promise((resolve, reject)=>{

            let returnLimit = {};
            returnLimit[title] = 1;

            this.db.findOne({},returnLimit,(error, result)=>{
                if(error === null){
                    resolve(result);
                }else{
                    reject(error);
                }
            })

        });
     }

}

module.exports = GeneralInfo;