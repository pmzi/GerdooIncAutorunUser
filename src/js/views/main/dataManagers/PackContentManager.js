const cat = window.cat;

const software = window.software;

const dvd = window.dvd;

// NodeJS built-in modules

const path = require('path');

const fs = require('fs');

// Some configs

const config = require('../../../../config/config');

const drivelist = require('drivelist');

// PackContentManager class handles events and datas which are realted to the packContent(DVDs, Cats and softwares)

class PackContentManager {

    /**
     * Loads all of the DVDs, cats and softwares into the menu
     * @returns {Promise}
     */

    static async load() {

        return new Promise(async (resolve, reject) => {

            // Let's empty the menu

            $('.list-wrapper').empty();

            // Let's get all of the DVDs

            let DVDs = await dvd.fetchAll('number', 1);

            for (let singleDVD of DVDs) {

                // let's append DVD's element

                let isCurrent = window.currentDVD == singleDVD.number ? 'current' : '';

                $('.list-wrapper').append(`<div data-dvd-number='${singleDVD.number}' class="list-wrapper__item-dvd ${isCurrent}"><div class="list-wrapper__item-content" data-toggleable>
                        <i class="material-icons">
                        add
                        </i>
                        <i class="material-icons">
                        remove
                        </i>
                        <i class="material-icons">
                        adjust
                        </i>
                        <span>
                        Disk ${singleDVD.number}
                        </span>
                        <span>
                            دیسک فعلی
                        </span>
                    </div><div class="item-wrapper__item-cat-cont-1">
                    <div class="item-wrapper__item-cat-cont-2">
                
                </div></div></div>`);

                // Let's get the current element

                let currDVDElem = $(`.list-wrapper > .list-wrapper__item-dvd[data-dvd-number='${singleDVD.number}'] .item-wrapper__item-cat-cont-2`);

                // Let's get the cats of the current DVD

                let cats = await cat.getCatsByDVDNumber(singleDVD.number);

                // Let's append each cat's element

                for (let singleCat of cats) {

                    // let's append cat's element

                    currDVDElem.append(`<div data-cat-id='${singleCat._id}' class="list-wrapper__item-cat">
                        <div class="list-wrapper__item-content" data-toggleable>
                        <i class="material-icons">
                            add
                        </i>
                        <i class="material-icons">
                            remove
                        </i>
                        <span>
                            ${singleCat.title}
                        </span>
                        </div>
                        <div class='list-wrapper-item-software-cont'>
                        </div>
                    </div>`);

                    // Let's get the element of the current cat

                    let currCatElem = $(`.list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                    // Let's get softwares of current cat

                    let softwares = await software.getSoftwaresByCat(singleCat._id);

                    // Let's append softwares

                    for (let singleSoftware of softwares) {

                        // let's append software's element

                        let verifiedLogo = singleSoftware.isRecommended ? '<i></i>' : '';

                        currCatElem.append(`<div title='${singleSoftware.title}' data-soft-id='${singleSoftware._id}' class="list-wrapper__item-software">
                            <div class="list-wrapper__item-content">
                            ${verifiedLogo}
                            <span>
                                ${singleSoftware.title}
                            </span>
                            </div>
                        </div>`);

                    }

                }


            }

            // Let's inform thers that the appending oporation is done

            $('.list-wrapper').trigger('reload');

            // Let's reinit the software events so that newly added elements will be toggleable

            this.initSoftwareEvents();

            // We are done

            resolve();


        });

    }

    static searchForRootPath() {

        const drives = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

        for(let drive of drives){

            if(fs.existsSync(drive+':')){
                
                if(fs.existsSync(
                    path.join(drive+':','autorun.ini')
                )){
                    console.log(drive)
                    config.rootPath = drive+':';
                }

            }

        }

    }

    /**
     * Searches the softwares
     * @param {String} toSearch - The string we are going to search with
     * @param {String} OS - The OS id to filter softwares
     * @returns {Promise}
     */

    static async search(toSearch, OS = null) {

        return new Promise(async (resolve, reject) => {

            // let's search in category

            let DVDs = await dvd.fetchAll("number", 1);

            // Let's get the matching cats

            let cats = await cat.findClosest(toSearch, OS);

            // Let's get catIDs

            let catIDs = cats.map(cat => cat._id);

            // Let's get the matching softwares

            let softwares = await software.findClosest(toSearch, catIDs, OS);

            // Let's get the searchWrapper element

            let searchWrapper = $('.list-wrapper.list-wrapper--search');

            // Let's make the searchWrapper empty

            searchWrapper.empty();

            // Let's go by each DVD and append search result

            for (let singleDVD of DVDs) {

                // Let's get the cats which are inside this DVD

                let insideCats = cats.filter(cat => cat.DVDNumber == singleDVD.number);

                // Let's get the softwares which are inside this DVD

                let insideSoftwares = softwares.filter(software => software.DVDNumber == singleDVD.number);

                // Check if there is no cat or software inside this DVD then go to next one

                if (insideCats.length == 0 && insideSoftwares.length == 0) {
                    continue;
                }

                // If any os specified

                let shouldContinue = true;

                if (OS !== null) {

                    // Let's check whether each cat has any software that supports specified OS or not

                    shouldContinue = false;

                    for (let singleCat of insideCats) {
                        if ((await software.countCatSoftwaresByOS(singleCat._id, OS)) !== 0) {
                            // There is
                            shouldContinue = true;
                            break;
                        }
                    }

                    if (!shouldContinue && insideSoftwares.length == 0) {
                        // If there isn't any softwares that supports specified OS then contirnue
                        continue;
                    }

                }

                // Let's append the DVD item

                let isCurrent = window.currentDVD == singleDVD.number ? 'current' : '';

                searchWrapper.append(`<div data-dvd-number='${singleDVD.number}' class="list-wrapper__item-dvd ${isCurrent}"><div class="list-wrapper__item-content" data-toggleable>
                    <i class="material-icons">
                    add
                    </i>
                    <i class="material-icons">
                    remove
                    </i>
                    <i class="material-icons">
                    adjust
                    </i>
                    <span>
                    Disk ${singleDVD.number}
                    </span>
                    <span>
                        دیسک فعلی
                    </span>
                </div><div class="item-wrapper__item-cat-cont-1">
                <div class="item-wrapper__item-cat-cont-2">
                    
                </div></div></div>`);

                // Let's get the current DVD

                let currDVDElem = $(`.list-wrapper.list-wrapper--search > .list-wrapper__item-dvd[data-dvd-number='${singleDVD.number}'] .item-wrapper__item-cat-cont-2`);

                // Let's show the result of matching cats

                // Let's append softwares of each cat of this DVD

                if (shouldContinue) {
                    for (let singleCat of insideCats) {

                        // Let's get the softwares which are inside this cat

                        let insideCatSoftwares = await software.getSoftwaresByCat(singleCat._id);

                        if (OS !== null) {
                            insideCatSoftwares = insideCatSoftwares.filter(soft => soft.oses.includes(OS))
                        }

                        // Let's append the cat element

                        currDVDElem.append(`<div data-cat-id='${singleCat._id}' class="list-wrapper__item-cat">
                            <div class="list-wrapper__item-content" data-toggleable>
                            <i class="material-icons">
                                add
                            </i>
                            <i class="material-icons">
                                remove
                            </i>
                            <span>
                                ${singleCat.title}
                            </span>
                            </div>
                            <div class='list-wrapper-item-software-cont'>
                            </div>
                        </div>`);

                        // Let's get the current cat element

                        let currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                        // Let's append each software of this cat

                        for (let singleSoftware of insideCatSoftwares) {

                            // This happens when another search starts at the same time

                            if (currCatElem === null) {
                                reject();
                                return;
                            }

                            // let's append software's element

                            let verifiedLogo = singleSoftware.isRecommended ? '<i></i>' : '';

                            currCatElem.append(`<div title='${singleSoftware.title}' data-soft-id='${singleSoftware._id}' class="list-wrapper__item-software">
                            <div class="list-wrapper__item-content">
                              ${verifiedLogo}
                              <span>
                                ${singleSoftware.title}
                              </span>
                            </div>
                          </div>`);

                        }

                    }
                }

                // Let's show the result of matching softwares

                // An array of appended categories so that we won't append them again

                let usedCatIDs = [];

                for (let singleSoftware of insideSoftwares) {

                    let currCatElem;

                    // Check whether cat of this software is already appended or not

                    if (usedCatIDs.includes(singleSoftware.cat)) {

                        // Yep! Let's select it

                        currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleSoftware.cat}']>.list-wrapper-item-software-cont`);

                    } else {

                        // Let's get the information of the category o fthe current software

                        let singleCat = await cat.getById(singleSoftware.cat);

                        // Let's append the category

                        currDVDElem.append(`<div data-cat-id='${singleCat._id}' class="list-wrapper__item-cat">
                            <div class="list-wrapper__item-content" data-toggleable>
                            <i class="material-icons">
                                add
                            </i>
                            <i class="material-icons">
                                remove
                            </i>
                            <span>
                                ${singleCat.title}
                            </span>
                            </div>
                            <div class='list-wrapper-item-software-cont'>
                            </div>
                        </div>`);

                        // Let's select the category

                        currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                        // Let's add this category to the array so that we now that this exists

                        usedCatIDs.push(singleSoftware.cat);

                    }

                    // Let's append the software

                    let verifiedLogo = singleSoftware.isRecommended ? '<i></i>' : '';

                    // This happens when another search starts at the same time

                    if (currCatElem === null) {
                        reject();
                        return;
                    }

                    currCatElem.append(`<div data-soft-id='${singleSoftware._id}' class="list-wrapper__item-software">
                        <div class="list-wrapper__item-content">
                        ${verifiedLogo}
                        <span>
                            ${singleSoftware.title}
                        </span>
                        </div>
                        </div>`);

                }

            }

            // Let's inform thers that the appending oporation is done

            $('.list-wrapper').trigger('reload');

            // Let's reinit the software events so that newly added elements will be toggleable

            this.initSoftwareEvents();

            // We are done

            resolve();

        });

    }

    /**
     * Inits toggling system and show system system events
     */

    static initSoftwareEvents() {

        // Event for toggling system

        let toggleables = $$('[data-toggleable]');

        for (let item of toggleables) {

            item.onclick = function (e) {

                e.stopPropagation();

                if (!this.parentElement.classList.contains('active')) {

                    item.nextElementSibling.style.height = item.nextElementSibling.scrollHeight + 'px';

                    this.parentElement.classList.add('active');

                    setTimeout(() => {

                        item.nextElementSibling.style.overflow = 'visible';

                        item.nextElementSibling.style.height = 'auto';

                    }, 300)

                } else {

                    item.nextElementSibling.style.overflow = 'hidden';

                    item.nextElementSibling.style.height = item.nextElementSibling.scrollHeight + 'px';

                    setTimeout(() => {

                        item.nextElementSibling.style.height = '0px';

                    }, 50);

                    // Close inside opening items

                    if (item.nextElementSibling.querySelector('.active>[data-toggleable]')) {

                        item.nextElementSibling.querySelectorAll('.active>[data-toggleable]').forEach((itemToCLose) => {

                            itemToCLose.click()

                        })
                    }

                    this.parentElement.classList.remove('active');

                }

            }
        }

        // Event for showing software

        let that = this;

        let softwareElements = $$('.list-wrapper__item-software');

        for (let singleSoftwareElement of softwareElements) {

            singleSoftwareElement.onclick = async function () {

                let softID = this.getAttribute('data-soft-id');

                let currentlyActiveSoft = null;

                if (currentlyActiveSoft = $('.list-wrapper__item-software.active')) {

                    currentlyActiveSoft.classList.remove('active')

                };

                this.classList.add('active');

                // Let's hide all cards

                that.hideAllCards().then(async () => {

                    // Let's show the software

                    that.showSoftware(softID).then(() => {

                        if ($('.software-details__desc-button>i:last-of-type').classList.contains('active')) {
                            $('.software-details__desc-button').dispatchEvent(new Event('needsToggle'))
                        }

                        $('.software-details').classList.remove('none');

                        $('.software-details__content-wrapper').style.height = $('.software-details__description').scrollHeight + 'px';

                        $('.software-details').classList.add('card-in');

                    })
                })

            }

        }


    }

    /**
     * Inits static events which are related to the software menu
     */

    static initStaticEvents() {

        // Event for the search box

        let searchInterval;

        $('.sidebar__header-searchbox-wrapper>.input__box').oninput = (e) => {

            if (searchInterval) {
                clearInterval(searchInterval);
            }

            let toSearch = $('.sidebar__header-searchbox-wrapper>.input__box').value;

            toSearch = toSearch.trim();

            if (toSearch === '') {
                this.hideSearchDialog();
                clearInterval(searchInterval)
                return;
            }

            if ($('.list-wrapper--search').classList.contains('none')) {
                this.showSearchDialog();
            }

            searchInterval = setInterval(() => {

                clearInterval(searchInterval)

                let os;

                let selectedOsValue = $('.osList').options[$('.osList').selectedIndex].value;

                if (selectedOsValue == 1) {
                    os = null;
                } else {
                    os = selectedOsValue;
                }

                this.search(toSearch, os).catch(() => {

                })

            }, 1000);

        };

        // Event for OS select box

        $('.osList').on('change toggledUp', () => {

            let toSearch = $('.sidebar__header-searchbox-wrapper>.input__box').value.trim();

            if (toSearch !== '') {

                let selectedOsValue = $('.osList').options[$('.osList').selectedIndex].value;

                if (selectedOsValue == 1) {

                    selectedOsValue = null;

                }

                this.search(toSearch, selectedOsValue).catch(() => {

                })

            }
        });

    }

    /**
     * Shows a special card
     * @param {String} cardClass - The class of the card which is going to be shawn
     */

    static showSpecialCard(cardClass) {

        // Let's hide all of the other cards

        this.hideAllCards().then(() => {

            // Let's show the specific card

            $(`.${cardClass}`).classList.remove('none');

            $(`.${cardClass}`).classList.add('card-in');

        })

    }

    /**
     * Hides all of the cards
     * @returns {Promise}
     */

    static hideAllCards() {

        return new Promise((resolve, reject) => {

            let cards = $$('.software-wrapper__info-wrapper>div');

            for (let card of cards) {
                card.classList.add('card-out');
                card.classList.remove('card-in');
            }

            setTimeout(() => {
                for (let card of cards) {
                    card.classList.add('none');
                }
                resolve();
            }, 1000)

        })

    }

    /**
     * Shows a software
     * @param {String} softID - The ID of the software which is going to be shawn
     * @returns {Promise}
     */

    static showSoftware(softID) {

        return new Promise(async (resolve, reject) => {

            // Let's get the details of the software

            let softInfo = await software.getById(softID);

            // Let's set the details

            // Let's set the DVDNumber on the parent element

            $('.software-details').setAttribute('data-DVDNumber', softInfo.DVDNumber);

            // Let's set the BG

            let gradient = window.getComputedStyle($('.software-details__header'), null).getPropertyValue('background-image');

            $('.software-details__header').style.backgroundImage = `${gradient}, url('${softInfo.image}')`;
            console.log($('.software-details__header').style.backgroundImage, `${gradient}, url('${softInfo.image}')`)
            // Let's set the title

            $('.software-details__title').innerHTML = softInfo.title + ` ${softInfo.version}`;

            // Let's set the OSes

            let OSes = [];

            for (let OSID of softInfo.oses) {

                OSes.push((await os.getById(OSID)).name);

            }

            $('.software-details__OSes').innerHTML = 'OS: ' + OSes.join(', ');

            // Let's set the programAddress

            let programAddress;

            if (softInfo.programAddress) {
                programAddress = softInfo.programAddress;
            } else {
                programAddress = (await cat.getById(softInfo.cat)).title + '/' + softInfo.title;
            }

            $('.software-details__files-button').setAttribute('data-target', programAddress);

            // Let's set the crack address

            if (softInfo.crack) {
                $('.software-details__crack-button').classList.remove('none');
                $('.software-details__crack-button').setAttribute('data-target', programAddress + '/' + softInfo.crack);
            } else {
                $('.software-details__crack-button').classList.add('none');
            }

            // Let's set the setup address

            $('.software-details__install-button').setAttribute('data-target', programAddress + '/' + softInfo.setup);

            // Let's set the video address

            if (softInfo.video) {
                $('.software-details__installation-video-wrapper').classList.remove('none');
                $('.software-details__installation-video-wrapper>video').setAttribute('src', config.rootPath + programAddress + '/' + softInfo.video)
            } else {
                $('.software-details__installation-video-wrapper').classList.add('none');
            }

            // For isRecommended

            if (softInfo.isRecommended) {
                $('.software-details__suggested-icon').classList.remove('invisible');
            } else {
                $('.software-details__suggested-icon').classList.add('invisible');
            }

            // Let's set the farsi guide

            $('.software-details__installation-guide-content').innerHTML = softInfo.faGuide;

            // Let's set the farsi description

            $('.software-details__description').innerHTML = softInfo.faDesc;

            // We are done :-)

            resolve();

        });

    }

    /**
     * Shows search result section
     */

    static showSearchDialog() {

        $('.list-wrapper:not(.list-wrapper--search)').classList.add('none');

        $('.list-wrapper--search').classList.remove('none');

    }

    /**
     * Hides search result section 
     */

    static hideSearchDialog() {

        let searchDialog = $('.list-wrapper--search');

        searchDialog.empty();

        searchDialog.classList.add('none');

        $('.list-wrapper:not(.list-wrapper--search)').classList.remove('none');

    }

    /**
     * Observes for DVD number change
     */

    static observeForDVDChange() {

        // Let's check the DVD number each 5 seconds

        setInterval(() => {

            // If DVD changed....

            if (this.getCurrentDVD() != window.currentDVD) {

                // Let's change the DVD inside application

                this.changeDVD();

            }

        }, 5000)

    }

    /**
     * Gets current DVD number
     */

    static getCurrentDVD() {

        // Let's find the path of the autorun.ini

        let autorunFilePath = path.join(config.rootPath, 'autorun.ini');

        // Check for existance

        if (fs.existsSync(autorunFilePath)) {

            // DVD is available

            window.DVDAvailable = true;

            // Let's read the autorun.ini

            return parseInt(fs.readFileSync(autorunFilePath, 'utf8'));


        } else {

            // File doesn't exists, probably dvd is out!

            window.DVDAvailable = false;

            return window.currentDVD ? window.currentDVD : 1;
        }
    }

    /**
     * Changes current DVD number on the software menu
     */

    static changeDVD() {

        $('.header__disk-number-wrapper').classList.remove('come-out');

        this.setCurrentDVD();

        setTimeout(() => {
            $('.header__disk-number-wrapper').classList.add('come-out');
        }, 1000)

        // Let's change the current dvd in software aside

        $$('.list-wrapper__item-dvd.current').forEach(item => {
            item.classList.remove('current');
        })

        $$(`.list-wrapper__item-dvd[data-dvd-number='${window.currentDVD}']`).forEach(item => {
            item.classList.add('current');
        })

    }

    /**
     * Sets the current DVD number on the header and window variable
     */

    static setCurrentDVD() {

        // let's catch the current DVD number

        window.currentDVD = this.getCurrentDVD();

        // let's change the DVD number text

        $('.header__disk-number-wrapper').textContent = `Disk ${window.currentDVD}`;

    }

    /**
     * hides the install autorun button
     */

    static hideInstallAutorun(){
        $('.autorunInstallButton').classList.add('none');
    }

}

if(config.isIntalled){
    PackContentManager.searchForRootPath();
    PackContentManager.hideInstallAutorun();
}

PackContentManager.setCurrentDVD();

// after page loads

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {

        // let's show it with animation

        $('.header__disk-number-wrapper').classList.add('come-out');

    }, 1000)

});

PackContentManager.initStaticEvents();

// loads the softwares

PackContentManager.load();

PackContentManager.observeForDVDChange();