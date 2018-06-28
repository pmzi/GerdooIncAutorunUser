const Model = require('./Model');

class OS extends Model{

    /**
     * @constructor
     */

    constructor(){

        super();

        this.dbName = 'OSes';

        this.loadDatabase();

    }

}

module.exports = OS;