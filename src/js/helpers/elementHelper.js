window.$ = (selector)=>{
    return document.querySelector(selector);
};

window.$$ = (selector)=>{
    return document.querySelectorAll(selector);
};

Element.prototype.empty = function(){
    this.innerHTML = "";
}

Element.prototype.append = function(html){
    this.innerHTML += html;
}

Element.prototype.trigger = function(eventName){
    this.dispatchEvent(new Event(eventName));
}