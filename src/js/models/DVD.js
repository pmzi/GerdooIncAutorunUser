const Model = require('./Model');

class DVD extends Model{

    /**
     * @constructor
     */

    constructor(){

        super();

        this.dbName = 'DVDs';

        this.loadDatabase();

    }

}

module.exports = DVD;