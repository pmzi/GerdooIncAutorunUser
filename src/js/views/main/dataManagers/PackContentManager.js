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
    constructor() {

        // loads all the dvds, cats and softwares into the menu

        window.currentDVD = 3;

        this.initStaticEvents();
        
        this.load().then(() => {

            

            

        })

    }

    async load() {

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


            }

            // We are finished;)

            $('.list-wrapper').trigger('reload');

            this.initSoftwareEvents();
            console.timeEnd("end");
            resolve();

        });

    }

    async search(toSearch, OS = null) {

        return new Promise(async (resolve, reject) => {

            console.time('search');

            // let's search in category

            let DVDs = await dvd.fetchAll("number", 1);

            let cats = await cat.findClosest(toSearch);

            let catIDs = cats.map(cat=>cat._id);

            let softwares = await software.findClosest(toSearch, catIDs);

            let searchWrapper = $('.list-wrapper.list-wrapper--search');

            searchWrapper.empty();

            for(let singleDVD of DVDs){
                
                let insideCats = cats.filter(cat=>cat.DVDNumber == singleDVD.number);

                let insideSoftwares = softwares.filter(software=>software.DVDNumber == singleDVD.number);

                if(insideCats.length == 0 && insideSoftwares.length == 0){
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

                for(let singleCat of insideCats){

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

                    let insideCatSoftwares = await software.getSoftwaresByCat(singleCat._id);

                    for (let singleSoftware of insideCatSoftwares) {
                        // let's add software's element

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

                }

                // let's show the single software ones

                let usedCatIDs = [];

                for(let singleSoftware of insideSoftwares){

                    let currCatElem;

                    if(usedCatIDs.includes(singleSoftware.cat)){
                        currCatElem = $(`.list-wrapper.list-wrapper--search .list-wrapper__item-cat[data-cat-id='${software.cat}']>.list-wrapper-item-software-cont`);
                    }else{

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

            }

            $('.list-wrapper').trigger('reload');

            this.initSoftwareEvents();

            console.timeEnd('search');

            resolve();
            
        });

    }

    initSoftwareEvents() {

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
                    setTimeout(()=>{
                        item.nextElementSibling.style.height = '0px';
                    },0);

                    // Close inside opening items

                    if(item.nextElementSibling.querySelector('.active>[data-toggleable]')){
                        item.nextElementSibling.querySelectorAll('.active>[data-toggleable]').forEach((itemToCLose)=>{
                            itemToCLose.click()
                        })
                    }
                    this.parentElement.classList.remove('active');
                }

            }
        }


    }

    initStaticEvents(){
        // for the search box

        let searchInterval;

        $('.sidebar__header-searchbox-wrapper>.input__box').oninput = (e)=>{

            if(searchInterval){
                clearInterval(searchInterval);
            }

            let toSearch = $('.sidebar__header-searchbox-wrapper>.input__box').value;

            toSearch = toSearch.trim();

            if(toSearch === ''){
                this.hideSearchDialog();
                clearInterval(searchInterval)
                return;
            }
            
            if($('.list-wrapper--search').classList.contains('none')){
                this.showSearchDialog();
            }
            
            searchInterval = setInterval(()=>{

                clearInterval(searchInterval)
                
                this.search(toSearch);

            }, 1000);

        };
    }

    /**
     * Shows software
     */

    showSoftware(id){

        return new Promise((resolve, reject)=>{

            

        });

    }

    showSearchDialog(){
        $('.list-wrapper:not(.list-wrapper--search)').classList.add('none');
        $('.list-wrapper--search').classList.remove('none');
    }

    hideSearchDialog(){
        let searchDialog = $('.list-wrapper--search');
        searchDialog.empty();
        searchDialog.classList.add('none');
        $('.list-wrapper:not(.list-wrapper--search)').classList.remove('none');
    }

}

new PackContentManager();