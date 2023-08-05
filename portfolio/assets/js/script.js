const header = document.querySelector('header');
const sidebar = document.querySelector('.sidebar');
const sidebarButton = document.querySelector('.sidebar-button > a > p');
const footer = document.querySelector('footer');

function getTransitionEndEventName() {
    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
     }

    for(let transition in transitions) {
        if(sidebar.style[transition] != undefined) {
            return transitions[transition];
        } 
    }
}
let transitionEndEventName = getTransitionEndEventName();

function navbar () {
    if (sidebarButton.innerHTML === "COLLAPSE") {
        sidebar.style.position = "fixed";
        sidebarButton.innerHTML = "HOME";
        sidebar.style.transform = "translateX(-100%)";
        header.style.paddingLeft = "5em";
    } else {
        sidebar.style.transform = "translateX(0%)";
        
        function onTransitionEnd(){
            header.style.paddingLeft = "23em";
            sidebar.style.position = "sticky";
            sidebarButton.innerHTML = "COLLAPSE";
            sidebar.removeEventListener(transitionEndEventName, onTransitionEnd);
        }

        sidebar.addEventListener(transitionEndEventName, onTransitionEnd);
    }
} 