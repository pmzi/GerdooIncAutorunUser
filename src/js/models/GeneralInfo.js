const Model = require('./Model');

class GeneralInfo extends Model{

    /**
     * @constructor
     */

    constructor(){

        super();

        this.dbName = 'GeneralInfo';

        this.loadDatabase();

    }

}

module.exports = GeneralInfo;