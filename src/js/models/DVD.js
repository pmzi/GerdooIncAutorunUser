const Model = require('./Model');

// The DVD model

class DVD extends Model{

    /**
     * @constructor loads the DB
     */

    constructor(){

        super();

        this.dbName = 'DVDs';

        this.loadDatabase();

    }

}

module.exports = DVD;