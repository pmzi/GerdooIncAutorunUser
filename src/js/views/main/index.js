class Index{

    constructor(){

        this.initEvents();

    }

    /**
     * Static events related to the index.html
     */

    initEvents(){

        // for the switch between description and installation guide
        
        $('.software-details__desc-button').onclick = ()=>{

            this.toggleSoftwareContent();

        }

    }

    toggleSoftwareContent(){

        // for toggling the button

        let notActiveI = $('.software-details__desc-button>i:not(.active)')

        let activeI = $('.software-details__desc-button>i.active');

        activeI.nextElementSibling.style.opacity = 0;

        setTimeout(()=>{

            activeI.nextElementSibling.style.display = 'none';

            notActiveI.nextElementSibling.style.display = 'block';

            setTimeout(()=>{

                notActiveI.classList.add('active');

                activeI.classList.remove('active');

                setTimeout(()=>{
                    
                    notActiveI.nextElementSibling.style.opacity = 1;
                },300)

            },10)

        },300)

        let descriptionWrapper = $('.software-details__description');

        let IGWrapper = $('.software-details__installation-guide');

        // for toggling the content

        if(descriptionWrapper.classList.contains('active')){

            $('.software-details__content-wrapper').style.height = IGWrapper.scrollHeight + 'px';

            descriptionWrapper.classList.remove('active');
            IGWrapper.classList.add('active');
        }else{

            $('.software-details__content-wrapper').style.height = descriptionWrapper.scrollHeight + 'px';

            descriptionWrapper.classList.add('active');
            IGWrapper.classList.remove('active');
        }
        

    }

}

new Index();