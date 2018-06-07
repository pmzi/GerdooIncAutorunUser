const Model = require('./Model');

class Cat extends Model{

    /**
     * @constructor
     */

    constructor(){

        super();

        this.dbName = 'Cats';

        this.loadDatabase();

    }

    /**
     * 
     */

    getTitlesByDVDNumber(DVDNumber) {
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

}

module.exports = Cat;