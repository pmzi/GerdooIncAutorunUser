const Model = require('./Model');

class Software extends Model{

    /**
     * @constructor
     */

    constructor(){

        super();

        this.dbName = 'Softwares';

        this.loadDatabase();

    }

    getSoftwaresByCat(id) {
        return new Promise((resolve, reject) => {

            this.db.find({
                cat: id
            }).sort({
                title: 1
            }).exec((err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });

        })
    }

    findClosest(string, catId, DVDNumber){
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {

            this.db.find({
                $or:[
                    {
                        title: new RegExp(string,'i'),
                        DVDNumber,
                        cat: catId
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        },
                        DVDNumber,
                        cat: catId
                    }
                ]
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    };

}

module.exports = Software;