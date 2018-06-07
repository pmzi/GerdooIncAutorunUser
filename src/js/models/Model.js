const Datastore = require('nedb');

class Model {

    loadDatabase() {

        // let's load the db
        this.db = new Datastore({
            filename: `${__dirname}/../../db/${this.dbName}.db`
        });

        this.db.loadDatabase();

    }

    /**
     * Fetches all the DVDs
     * @returns {Promise} - Returnes data in resolve of the Promise
     */

    fetchAll(sortProperty, sortType) {
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
     * @param {ObjectID} id - The id of the record
     * @return {Promise}
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
     * @param {ObjectID} id- The id of the record
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
}

module.exports = Model;