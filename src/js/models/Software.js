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

    findClosest(string, catIDs, OS = null){
        return new Promise((resolve, reject) => {

            let query = {
                $or:[
                    {
                        title: new RegExp(string,'i')
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        }
                    },
                    {
                        faDesc: {
                            $regex: new RegExp(string,'i')
                        }
                    },
                    {
                        enDesc: {
                            $regex: new RegExp(string,'i')
                        }
                    }
                ],
                cat:{
                    $nin: catIDs
                }
            }

            if(OS !== null){
                query.push({
                    oses:{
                        $regex: new RegExp(OS,'i')
                    }
                })
            }

            this.db.find(query, (err, result) => {
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