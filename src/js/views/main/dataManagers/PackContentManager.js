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

                $('.list-wrapper').append(`<div data-dvd-number='${singleDVD.number}' class="list-wrapper__item-dvd"><div class="list-wrapper__item-content" data-toggleable>
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

                        currCatElem.append(`<div data-soft-id='${singleSoftware._id}' class="list-wrapper__item-software">
                        <div class="list-wrapper__item-content">
                          <i></i>
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

    /**
     * Shows software
     */

    showSoftware(id){

        return new Promise((resolve, reject)=>{

            

        });

    }

}

new PackContentManager();