const Model = require('./Model');

// The Cat model

class Cat extends Model{

    /**
     * @constructor loads the DB
     */

    constructor(){

        super();

        this.dbName = 'Cats';

        this.loadDatabase();

    }

    /**
     * Gets cats which are inside the given DVDNumber
     * @param {Number} DVDNumber - The number of the DVD
     * @returns {Promise} 
     */

    getCatsByDVDNumber(DVDNumber) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.find({
                DVDNumber
            }).sort({
                title: 1
            }).exec((err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Searches the categories for any matches of the string given
     * @param {String} string - The string which is used to find matches
     * @returns {Promise}
     */

    findClosest(string){
        return new Promise((resolve, reject) => {

            this.db.find({
                $or:[
                    {
                        title: new RegExp(string,'i')
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        }
                    }
                ]
            }, {tags: -1} , (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    };

}

module.exports = Cat;