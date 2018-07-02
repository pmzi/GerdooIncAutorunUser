const GeneralInfo = require('../../../models/GeneralInfo');

// Instantiation

const generalInfo = new GeneralInfo();

//

class GeneralInfoManager{

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

GeneralInfoManager.load();