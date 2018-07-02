const Model = require('./Model');

// The OS model

class OS extends Model{

    /**
     * @constructor loads the DB
     */

    constructor(){

        super();

        this.dbName = 'OSes';

        this.loadDatabase();

    }

}

module.exports = OS;