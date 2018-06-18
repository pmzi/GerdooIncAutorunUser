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

    isProper(cat, toSearch){

        let regexp = new RegExp(toSearch, 'i');

        if(regexp.test(cat.tags)){
            return true;
        }else if(regexp.test(cat.title)){
            return true;
        }
        
        return false;

    };

}

module.exports = Cat;