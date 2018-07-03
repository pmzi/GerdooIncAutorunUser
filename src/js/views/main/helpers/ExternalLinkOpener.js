
const {shell} = require('electron');

// Opens links on external brwoser

class ExternalLinkOpener{

    /**
     * Listens on a tags which have data-external attribute
     */

    static initEvents(){

        let that = this;

        $$('[data-external]').forEach(item=>{
            item.onclick = function(e){
                e.preventDefault();

                let link = this.getAttribute('href');

                that.open(link)

            }
        });

    }

    /**
     * Opens a link on external brwoser
     * @param {String} link - The link which should be opened
     */

    static open(link){
        
        shell.openExternal(link)

    }

}

// Let's listen on events

ExternalLinkOpener.initEvents();