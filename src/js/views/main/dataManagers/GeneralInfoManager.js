const GeneralInfo = require('../../../models/GeneralInfo');

// Instantiation

const generalInfo = new GeneralInfo();

// GeneralInfoManager class handles events and datas related to the GeneralInfo

class GeneralInfoManager{

    /**
     * Loads the GeneralInfos into proper elements
     * @returns {Promise}
     */

    static load(){
        return new Promise(async (resolve, reject) => {

            let generalContents = (await generalInfo.fetchAll("_id", 1))[0];

            // Loading the aboutUs

            $('.about-gerdoo__content').innerHTML = generalContents.aboutUs;

            // Loading the essentials

            $('.essentials .page__content').innerHTML = generalContents.essentials;

            // Loading optional tab

            $('.optionalTabButton').textContent = generalContents.tabTitle;

            $('.optionalTabButton').classList.remove('hidden');

            $('.optionalTab .page__title').innerHTML = generalContents.tabTitle;

            $('.optionalTab .page__content').innerHTML = generalContents.tabContent;

            resolve();

        });
    }

}

// Let's laod the GeneralInfos

GeneralInfoManager.load();