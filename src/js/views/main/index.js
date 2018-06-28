const {
    exec
} = require('child_process');
const {
    dialog
} = require('electron').remote;
const path = require('path');
const fs = require('fs');

const ncp = require('ncp').ncp;

class Index {

    constructor() {

        // check for music

        if (localStorage.getItem('music') == 0) {
            $('.musicButton>i').textContent = 'music_off'
            $('audio').pause();
        }

        this.initEvents();

    }

    /**
     * Static events related to the index.html
     */

    initEvents() {

        // for the switch between description and installation guide

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

        $$('.software-details__files-button>i,.software-details__crack-button>i').forEach(item => {
            item.onclick = function () {

                that.open(path.join(__dirname, '../../../', this.parentElement.getAttribute('data-target')));

            }
        })

        $('.software-details__install-button').onclick = function () {
            that.open(path.join(__dirname, '../../../', this.getAttribute('data-target')));
        };

        // for closing the card

        $$('.software-details__close,.software-wrapper__info-wrapper').forEach(item => {
            item.onclick = () => {

                // remove active software class

                this.showSpecialCard('about-gerdoo');

            };
        })

        // for showing the essentials

        $('.essentialsButton').onclick = () => {

            this.showSpecialCard('essentials');

        };

        $('.optionalTabButton').onclick = () => {

            this.showSpecialCard('optionalTab');

        };

        // for music

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

        // for install autorun button

        $('.autorunInstallButton').onclick = () => {

            this.installAutorun();

        };

        // for showing/hiding search ellipsis

        $('.sidebar__header-pro-search-elipsis-btn').onclick = ()=>{

            let target = $('.sidebar__header-pro-search-elipsis-content');

            if(target.classList.contains('sidebar__ellipsis--show')){
                target.classList.remove('sidebar__ellipsis--show');

                $('.sidebar__header-pro-search-elipsis-btn>i').classList.remove('rotate');

            }else{
                target.classList.add('sidebar__ellipsis--show');
                $('.sidebar__header-pro-search-elipsis-btn>i').classList.add('rotate');
            }

        };

    }

    showSpecialCard(cardClass) {
        this.hideAllCards().then(() => {

            $(`.${cardClass}`).classList.remove('none');

            $(`.${cardClass}`).classList.add('card-in');

        })
    }

    hideAllCards() {

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

    open(address) {
        exec(`start ${address}`, (err) => {
            console.log(err)
        });
    }

    toggleSoftwareContent() {

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

    installAutorun() {
        console.log(path.join(__dirname,'../../setup/setup.exe'))
        this.open(path.join(__dirname,'../../setup/setup.exe'))

    }

}

new Index();