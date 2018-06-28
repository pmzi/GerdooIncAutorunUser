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