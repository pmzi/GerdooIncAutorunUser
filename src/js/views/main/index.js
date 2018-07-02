// Electrn's utilities

const {
    exec
} = require('child_process');
const {
    dialog
} = require('electron').remote;

// NodeJS built-in utilites

const path = require('path');

const fs = require('fs');

// ncp package for copying directory and it's contents into a destionation

const ncp = require('ncp').ncp;

// Index class handles events and functionality of the index page

class Index {

    /**
     * Inits static events related to the index.html
     */

    static initEvents() {

        // Event for the switch between description and installation guide

        $('.software-details__desc-button').onclick = () => {

            this.toggleSoftwareContent();

        }

        $('.software-details__desc-button').addEventListener('needsToggle', () => {
            this.toggleSoftwareContent();
        })

        $$('.software-wrapper__info-wrapper>div').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation()
            }
        })

        let that = this;

        // Event for crack and files button

        $$('.software-details__files-button>i,.software-details__crack-button>i').forEach(item => {
            item.onclick = function () {

                let DVDNumber = $('.software-details').getAttribute('data-DVDNumber');

                if (that.checkDVDNumber(DVDNumber)) {

                    that.open(path.join(__dirname, '../../../', this.parentElement.getAttribute('data-target')));

                } else {

                    Snackbar.show({
                        text: `دی وی دی شماره ${DVDNumber} را وارد نمایید.`,
                        showAction: false,
                        pos: 'top-right'
                    });

                }

            }
        })

        // Event for install software button

        $('.software-details__install-button').onclick = function () {
            let DVDNumber = $('.software-details').getAttribute('data-DVDNumber');

            if (that.checkDVDNumber(DVDNumber)) {

                that.open(path.join(__dirname, '../../../', this.getAttribute('data-target')));

            } else {

                Snackbar.show({
                    text: `دی وی دی شماره ${DVDNumber} را وارد نمایید.`,
                    showAction: false,
                    pos: 'top-right'
                });

            }
        };

        // Event for closing the card

        $$('.software-details__close,.software-wrapper__info-wrapper').forEach(item => {
            item.onclick = () => {

                // Let's remove active software class

                this.showSpecialCard('about-gerdoo');

            };
        })

        // Event for showing the essentials

        $('.essentialsButton').onclick = () => {

            this.showSpecialCard('essentials');

        };

        $('.optionalTabButton').onclick = () => {

            this.showSpecialCard('optionalTab');

        };

        // Event for music off/on

        $('.musicButton').onclick = () => {

            let audio = $('audio');

            if (audio.paused) {

                $('.musicButton>i').textContent = 'music_note';

                localStorage.setItem('music', '1')

                audio.play();
            } else {

                $('.musicButton>i').textContent = 'music_off';

                localStorage.setItem('music', '0')

                audio.pause();
            }
        };

        // Event for install autorun button

        $('.autorunInstallButton').onclick = () => {

            this.installAutorun();

        };

        // Event for showing/hiding search ellipsis

        $('.sidebar__header-pro-search-elipsis-btn').onclick = () => {

            let target = $('.sidebar__header-pro-search-elipsis-content');

            if (target.classList.contains('sidebar__ellipsis--show')) {

                $('.osList>option:first-of-type').setAttribute('selected', 'selected');

                $('.osList').trigger('toggledUp');

                target.classList.remove('sidebar__ellipsis--show');

                $('.sidebar__header-pro-search-elipsis-btn>i').classList.remove('rotate');

            } else {

                $('.osList>option:first-of-type').removeAttribute('selected');

                target.classList.add('sidebar__ellipsis--show');
                $('.sidebar__header-pro-search-elipsis-btn>i').classList.add('rotate');
            }

        };

    }

    /**
     * Shows a special card
     * @param {String} cardClass - The class of the card which is going to be shawn
     */

    static showSpecialCard(cardClass) {
        this.hideAllCards().then(() => {

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

            if ($('.list-wrapper__item-software.active')) {
                $('.list-wrapper__item-software.active').classList.remove('active')
            }

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
     * Opens a specific address
     * @param {String} address - The address of the file/folder which should be opened
     */

    static open(address) {
        exec(`start ${address}`, (err) => {
            console.log(err)
        });
    }

    /**
     * Toggles between software description and installation guide
     */

    static toggleSoftwareContent() {

        // for toggling the button

        let notActiveI = $('.software-details__desc-button>i:not(.active)')

        let activeI = $('.software-details__desc-button>i.active');

        activeI.nextElementSibling.style.opacity = 0;

        setTimeout(() => {

            activeI.nextElementSibling.style.display = 'none';

            notActiveI.nextElementSibling.style.display = 'block';

            setTimeout(() => {

                notActiveI.classList.add('active');

                activeI.classList.remove('active');

                setTimeout(() => {

                    notActiveI.nextElementSibling.style.opacity = 1;
                }, 300)

            }, 10)

        }, 300)

        let descriptionWrapper = $('.software-details__description');

        let IGWrapper = $('.software-details__installation-guide');

        // for toggling the content

        if (descriptionWrapper.classList.contains('active')) {

            $('.software-details__content-wrapper').style.height = IGWrapper.scrollHeight + 'px';

            descriptionWrapper.classList.remove('active');
            IGWrapper.classList.add('active');
        } else {

            $('.software-details__content-wrapper').style.height = descriptionWrapper.scrollHeight + 'px';

            descriptionWrapper.classList.add('active');
            IGWrapper.classList.remove('active');
        }


    }

    /**
     * Opens the setup of the autorun
     */

    static installAutorun() {

        this.open(path.join(__dirname, '../../setup/setup.exe'))

    }

    static checkDVDNumber(DVDNumber){
        if(window.DVDNumber == DVDNumber && window.DVDAvailable){
            return true
        }else{
            return false;
        }
    }

}

// Checks whether music was turned off last time or not

if (localStorage.getItem('music') == 0) {

    // It has been turned off

    // Let's now turn it off

    $('.musicButton>i').textContent = 'music_off';

    $('audio').pause();

}

// Let's initiate the events of the page

Index.initEvents();