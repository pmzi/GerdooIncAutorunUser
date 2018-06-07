const Model = require('./Model');

class GeneralInfo extends Model{

    /**
     * @constructor
     */

    constructor(){

        this.dbName = 'GeneralInfo';

        this.loadDatabase();

    }

}

module.exports = GeneralInfo;