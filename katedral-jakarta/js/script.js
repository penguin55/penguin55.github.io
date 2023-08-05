let bible = document.querySelector(".injil-of-the-day");
let quoteBible = document.querySelector(".injil-of-the-day > p");
let biblePage = document.querySelector(".injil-of-the-day > span");

const quotes = 
["\"Kasihilah Tuhan, Allahmu, dengan segenap hatimu dan dengan segenap jiwamu dan dengan segenap akal budimu.\" ",
"\"Kasihilah sesamamu manusia seperti dirimu sendiri.\"",
"\"Tidak ada kasih yang lebih besar dari pada kasih seseorang yang memberikan nyawanya untuk sahabat-sahabatnya.\"",
"\"Kasih itu sabar, kasih itu murah hati, ia tidak cemburu, kasih itu tidak memegahkan diri, tidak sombong.\"",
"\"Dan yang terutama ialah kasih, karena kasih itu adalah pengikat yang menyatukan dan menyempurnakan segala sesuatu.\"",
"\"Kasihilah musuhmu dan berbuatlah baik kepada orang yang membenci kamu.\"",
"\"Janganlah membayar sesuatu dengan kejahatan akan kejahatan, berusahalah berbuat baik di hadapan semua orang.\"",
"\"Kasihilah orang-orang yang mendiami negeri ini, seperti kamu mengasihi dirimu sendiri.\"",
"\"Barangsiapa tidak mengasihi, ia tidak mengenal Allah, sebab Allah adalah kasih.\"",
"\"Cinta itu tidak pernah berakhir. Tetapi nubuat-nubuat akan berakhir, bahasa roh akan reda, dan pengetahuan akan berakhir.\""];
const bibles = 
["Matius 22:37",
"Matius 22:39",
"Yohanes 15:13",
"1 Korintus 13:4",
"Kolose 3:14",
"Lukas 6:27",
"Roma 12:17",
"Markus 12:31",
"1 Yohanes 4:8",
"1 Korintus 13:8"];

function getTransitionEndEventName() {
    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
     }

    for(let transition in transitions) {
        if(bible.style[transition] != undefined) {
            return transitions[transition];
        } 
    }
}
let transitionEndEventName = getTransitionEndEventName();

let changeTime = 4000;
let currentIndex = 0;
let opacity = 1;

function animateBible(){
    if (opacity == 1) {
        setTimeout(()=> {
            opacity = 0;
            bible.style.opacity = opacity;
        }, changeTime);
        
    } else {
        currentIndex++;
        if (currentIndex >= quotes.length) currentIndex = 0;
        quoteBible.innerHTML = quotes[currentIndex];
        biblePage.innerHTML = bibles[currentIndex];
        opacity = 1;
        bible.style.opacity = opacity;
    }
}

bible.addEventListener(transitionEndEventName, animateBible);
animateBible();