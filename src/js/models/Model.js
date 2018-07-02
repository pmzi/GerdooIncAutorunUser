const Datastore = require('nedb');

class Model {

    /**
     * @constructor
     */

    constructor(){

        this.loaded = false;

    }

    /**
     * Loads the DB
     */

    loadDatabase() {

        // let's load the db

        this.db = new Datastore({
            filename: `${__dirname}/../../db/${this.dbName}.db`
        });

        this.db.loadDatabase(()=>{
            this.loaded = true;
            this.afterLoaded()
        });

    }

    /**
     * Fetches all
     * @returns {Promise} - Returnes data in resolve of the Promise
     */

    fetchAll(sortProperty = "_id", sortType = 1) {
        let order = {};

        order[sortProperty] = sortType;
        
        return new Promise((resolve, reject) => {
            this.db.find({}).sort(order).exec((err,result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            })
        })

    }

    /**
     * Deletes a record by it's ID
     * @param {String} id - The id of the record
     * @returns {Promise}
     */

    deleteById(id) {
        return new Promise((resolve, reject)=>{
            this.db.remove({_id:id},(err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err);
                }
            })
        })
    }

    /**
     * Gets the record by it's ID
     * @param {String} id- The id of the record
     * @return {Promise} - Returnes data in resolve of the Promise
     */

    getById(id) {
        return new Promise((resolve, reject)=>{
            this.db.findOne({_id:id},(err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            })
        })
    }

    /**
     * This functions executes after DB is loaded 
     */

     afterLoaded(){

     }
}

module.exports = Model;