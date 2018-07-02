const Model = require('./Model');

// the Software model

class Software extends Model {

    /**
     * @constructor loads the DB
     */

    constructor() {

        super();

        this.dbName = 'Softwares';

        this.loadDatabase();

    }

    /**
     * Gets softwares which are in the given category
     * @param {String} id - The id of the category
     * @returns {Promise}
     */

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

    /**
     * Searches the softwares for any matches of the string given
     * @param {String} string - The string which is used to find matches
     * @param {Array} catIDs - The catIDs to exclude and not search in them
     * @param {String} os - The id of the OS to filter the softwares
     * @returns {Promise}
     */

    findClosest(string, catIDs, OS = null) {
        return new Promise((resolve, reject) => {

            let query = {
                $or: [{
                        title: new RegExp(string, 'i')
                    },
                    {
                        tags: {
                            $regex: new RegExp(string, 'i')
                        }
                    },
                    {
                        faDesc: {
                            $regex: new RegExp(string, 'i')
                        }
                    },
                    {
                        enDesc: {
                            $regex: new RegExp(string, 'i')
                        }
                    }
                ],
                cat: {
                    $nin: catIDs
                }
            }

            if (OS !== null) {
                query.oses = {
                    $regex: new RegExp(OS)
                }
            }

            console.log(query)

            this.db.find(query, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    };

    /**
     * Counts softwares with the cat and OS given
     * @param {String} cat - The cat id
     * @param {String} OS - The OS id
     * @returns {Promise}
     */

    countCatSoftwaresByOS(cat, OS) {
        return new Promise((resolve, reject)=>{
            this.db.count({
                cat,
                oses: {
                    $regex: new RegExp(OS)
                }
            },(err, result)=>{

                if(err === null){

                    resolve(result);

                }

                reject(err);
                
            })
        })
    }

}

module.exports = Software;