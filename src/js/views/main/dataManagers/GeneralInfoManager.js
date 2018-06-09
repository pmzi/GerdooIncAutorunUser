const GeneralInfo = require('../../../models/GeneralInfo');

// Instantiation

const generalInfo = new GeneralInfo();

//

class GeneralInfoManager{
    
    constructor(){

        this.info = null;

        this.load().then(()=>{
            
            // init events

        })

    }

    load(){

        return new Promise(async(resolve, reject)=>{

            let info = await generalInfo.fetchAll('_id', 1);

            this.info = info;

            resolve();

        });

    }

    /**
     * Initialize static events
     */

    initStaticEvents(){

        //

    }

}

new GeneralInfoManager();