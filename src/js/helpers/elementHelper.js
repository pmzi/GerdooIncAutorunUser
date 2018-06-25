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
        var div = document.createElement('div');
        div.innerHTML = html;
        while (div.children.length > 0) {
          this.appendChild(div.children[0]);
        }
}

Element.prototype.trigger = function(eventName){
    this.dispatchEvent(new Event(eventName));
}