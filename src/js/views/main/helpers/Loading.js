// Loading class handles show and hide loading

class Loading{

    /**
     * Shows the loading
     */

    static show(){
        $('#wrapper').classList.add('blur');
        $('.loading').classList.remove('loading--hidden');
    }

    /**
     * Hides the loading
     */

    static hide(){
        $('#wrapper').classList.remove('blur');
        $('.loading').classList.add('loading--hidden');
    }

}