class Loading{

    static show(){
        $('#wrapper').classList.add('blur');
        $('.loading').classList.remove('loading--hidden');
    }

    static hide(){
        $('#wrapper').classList.remove('blur');
        $('.loading').classList.add('loading--hidden');
    }

}