const DVD = require('../../../models/DVD');
const Software = require('../../../models/Software');
const Cat = require('../../../models/Cat');

//

const cat = new Cat();
const software = new Software();
const dvd = new DVD();

//

const path = require('path');

const fs = require('fs');

class PackContentManager {

    static async load() {

        return new Promise(async (resolve, reject) => {
            console.time("end");
            // let's empty the menu

            $('.list-wrapper').empty();

            let DVDs = await dvd.fetchAll('number', 1);

            for (let singleDVD of DVDs) {

                // let's add DVD's element

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

                let currDVDElem = $(`.list-wrapper > .list-wrapper__item-dvd[data-dvd-number='${singleDVD.number}'] .item-wrapper__item-cat-cont-2`);

                let cats = await cat.getCatsByDVDNumber(singleDVD.number);

                for (let singleCat of cats) {
                    // let's add cat's element
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

                    let currCatElem = $(`.list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                    let softwares = await software.getSoftwaresByCat(singleCat._id);

                    for (let singleSoftware of softwares) {
                        // let's add software's element

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

            // We are finished;)

            $('.list-wrapper').trigger('reload');

            this.initSoftwareEvents();
            console.timeEnd("end");
            resolve();

        });

    }

    static async search(toSearch, OS = null) {

        return new Promise(async (resolve, reject) => {

            console.time('search');

            // let's search in category

            let DVDs = await dvd.fetchAll("number", 1);

            let cats = await cat.findClosest(toSearch, OS);

            let catIDs = cats.map(cat => cat._id);

            let softwares = await software.findClosest(toSearch, catIDs, OS);

            let searchWrapper = $('.list-wrapper.list-wrapper--search');

            searchWrapper.empty();

            for (let singleDVD of DVDs) {

                let insideCats = cats.filter(cat => cat.DVDNumber == singleDVD.number);

                let insideSoftwares = softwares.filter(software => software.DVDNumber == singleDVD.number);

                if (insideCats.length == 0 && insideSoftwares.length == 0) {
                    continue;
                }

                // appending the dvd item

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

                let currDVDElem = $(`.list-wrapper.list-wrapper--search > .list-wrapper__item-dvd[data-dvd-number='${singleDVD.number}'] .item-wrapper__item-cat-cont-2`);

                for (let singleCat of insideCats) {

                    let insideCatSoftwares = await software.getSoftwaresByCat(singleCat._id);

                    if (OS) {
                        insideCatSoftwares = await insideCatSoftwares.filter(soft => soft.oses.includes(OS));
                    }

                    if (insideCatSoftwares.length == 0) {
                        continue;
                    }

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

                    let currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                    for (let singleSoftware of insideCatSoftwares) {

                        // let's add software's element

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

                // let's show the single software ones

                let usedCatIDs = [];

                for (let singleSoftware of insideSoftwares) {

                    let currCatElem;

                    if (usedCatIDs.includes(singleSoftware.cat)) {
                        currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleSoftware.cat}']>.list-wrapper-item-software-cont`);
                    } else {
                        let singleCat = await cat.getById(singleSoftware.cat)

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
                        currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${singleCat._id}']>.list-wrapper-item-software-cont`);

                        usedCatIDs.push(singleSoftware.cat);

                    }

                    let verifiedLogo = singleSoftware.isRecommended ? '<i></i>' : '';

                    currCatElem.append(`<div data-soft-id='${singleSoftware._id}' class="list-wrapper__item-software">
                        <div class="list-wrapper__item-content">
                        ${verifiedLogo}
                        <span>
                            ${singleSoftware.title}
                        </span>
                        </div>
                        </div>`);

                }

                // remove the dvd if it is empty
                if (currDVDElem.querySelector('.list-wrapper__item-cat') == null) {
                    $(`.list-wrapper.list-wrapper--search [data-dvd-number='${singleDVD.number}']`).parentNode.removeChild($(`.list-wrapper.list-wrapper--search [data-dvd-number='${singleDVD.number}']`));
                }

            }

            $('.list-wrapper').trigger('reload');

            this.initSoftwareEvents();

            console.timeEnd('search');

            resolve();

        });

    }

    static initSoftwareEvents() {

        // For toggling system

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

        // for showing software

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

                that.hideAllCards().then(async () => {

                    // showing the soft

                    that.showSoftware(softID).then(() => {

                        if ($('.software-details__desc-button>i:last-of-type').classList.contains('active')) {
                            $('.software-details__desc-button').dispatchEvent(new Event('needsToggle'))
                        }

                        $('.software-details__content-wrapper').style.height = $('.software-details__description').scrollHeight + 'px';

                        $('.software-details').classList.remove('none');
                        $('.software-details').classList.add('card-in');

                    })
                })

            }

        }


    }

    static initStaticEvents() {
        // for the search box

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

                this.search(toSearch, os);

            }, 1000);

        };

        // for os select

        $('.osList').onchange = () => {

            let toSearch = $('.sidebar__header-searchbox-wrapper>.input__box').value.trim();

            if (toSearch !== '') {

                let selectedOsValue = $('.osList').options[$('.osList').selectedIndex].value;

                if (selectedOsValue == 1) {
                    selectedOsValue = null;
                }

                this.search(toSearch, selectedOsValue);

            }
        };

    }

    static showSpecialCard(cardClass) {
        this.hideAllCards().then(() => {

            $(`.${cardClass}`).classList.remove('none');

            $(`.${cardClass}`).classList.add('card-in');

        })
    }

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
     * Shows software
     */

    static showSoftware(softID) {

        return new Promise(async (resolve, reject) => {

            let softInfo = await software.getById(softID);

            $('.software-details__header').style.backgroundImage = `url('${softInfo.image}')`;

            $('.software-details__title').innerHTML = softInfo.title + ` ${softInfo.version}`;

            $('.software-details__OSes').innerHTML = 'OSes: ' + softInfo.oses.join(', ');

            let programAddress;

            if (softInfo.programAddress) {
                programAddress = softInfo.programAddress;
            } else {
                programAddress = (await cat.getById(softInfo.cat)).title + '/' + softInfo.title;
            }

            $('.software-details__files-button').setAttribute('data-target', programAddress);

            if (softInfo.crack) {
                $('.software-details__crack-button').classList.remove('none');
                $('.software-details__crack-button').setAttribute('data-target', programAddress + '/' + softInfo.crack);
            } else {
                $('.software-details__crack-button').classList.add('none');
            }

            $('.software-details__install-button').setAttribute('data-target', programAddress + '/' + softInfo.setup);

            // for video

            if (softInfo.video) {
                $('.software-details__installation-video-wrapper').classList.remove('none');
                $('.software-details__installation-video-wrapper>video').setAttribute('src', programAddress + '/' + softInfo.video)
            } else {
                $('.software-details__installation-video-wrapper').classList.add('none');
            }

            // for isRecommended

            if (softInfo.isRecommended) {
                $('.software-details__suggested-icon').classList.remove('invisible');
            } else {
                $('.software-details__suggested-icon').classList.add('invisible');
            }

            $('.software-details__installation-guide-content').innerHTML = softInfo.faGuide;

            $('.software-details__description').innerHTML = softInfo.faDesc;

            resolve();

        });

    }

    static showSearchDialog() {
        $('.list-wrapper:not(.list-wrapper--search)').classList.add('none');
        $('.list-wrapper--search').classList.remove('none');
    }

    static hideSearchDialog() {
        let searchDialog = $('.list-wrapper--search');
        searchDialog.empty();
        searchDialog.classList.add('none');
        $('.list-wrapper:not(.list-wrapper--search)').classList.remove('none');
    }

    static observeForDVDChange() {

        setInterval(() => {

            if (this.getCurrentDVD() != window.currentDVD) {
                this.changeDVD();
            }

        }, 5000)

    }

    static getCurrentDVD() {
        let autorunFilePath = path.join(__dirname, '../../../../../../', 'autorun.ini');
        if (fs.existsSync(autorunFilePath)) {

            return parseInt(fs.readFileSync(autorunFilePath, 'utf8'));


        } else {

            // file doesn't exists, probably dvd is out!

            return window.currentDVD;
        }
    }

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

    static setCurrentDVD() {

        // let's catch the current dvd number

        window.currentDVD = this.getCurrentDVD();

        // let's change the dvd number text

        $('.header__disk-number-wrapper').textContent = `Disk ${window.currentDVD}`;

    }

}

PackContentManager.setCurrentDVD();

// after page loads

document.addEventListener('DOMContentLoaded', () => {

    // let's show it with animation

    $('.header__disk-number-wrapper').classList.add('come-out');

});

PackContentManager.initStaticEvents();

// loads the softwares

PackContentManager.load();

PackContentManager.observeForDVDChange();