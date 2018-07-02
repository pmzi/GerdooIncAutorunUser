const DVD = require('../../../models/DVD');
const Software = require('../../../models/Software');
const Cat = require('../../../models/Cat');
const OS = require('../../../models/OS');
const GeneralInfo = require('../../../models/GeneralInfo');

class DBLoader{

    /**
     * Loads all of the databases which are needed in main page
     */

    static loadAll(){
        
        window.dvd = new DVD();

        window.software = new Software();

        window.cat = new Cat();

        window.os = new OS();

        window.generalInfo = new GeneralInfo();

    }

}

DBLoader.loadAll();