//TYPING FUNCTION
const typingSpeed = 50;
const backTypingSpeed = 35;
const holdTime = 1500;

const options = {
    attributes: true
}

function afiTyping(quoteBody, typeHead, quotes){
    let quote;
    let currentIndexQuote = 0;
    let currentChar = 0;

    function animateOpacityTypeHead(){
        let currentOpacity = typeHead.style.opacity;
        if (currentOpacity == 0) typeHead.style.opacity = 1;
        else typeHead.style.opacity = 0;
    }
    
    function callback(mutationList, observer) {
        mutationList.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('type-loop')){
                    typeHead.removeEventListener(transitionEndEventName, animateOpacityTypeHead);
                    typeHead.style.opacity = 1;
                } else {
                    typeHead.addEventListener(transitionEndEventName, animateOpacityTypeHead);
                    animateOpacityTypeHead();
                }
            }
        })
    }
    const observer = new MutationObserver(callback);
    observer.observe(quoteBody, options);

    function typing(){
        quote = quotes[currentIndexQuote];
        if (currentChar < quote.length) {
            quoteBody.innerHTML += quote.charAt(currentChar);
            currentChar++;
            if (!quoteBody.classList.contains('type-loop')) {
                quoteBody.classList.add('type-loop');
            }
            setTimeout(typing, typingSpeed);
        } else {
            quoteBody.classList.remove('type-loop');
            setTimeout(backTyping, holdTime);
        }
    }

    function backTyping(){
        quote = quoteBody.innerHTML;
        if (quote.length > 0) {
            quoteBody.innerHTML = quote.slice(0, -1);
            if (!quoteBody.classList.contains('type-loop')) {
                quoteBody.classList.add('type-loop');
            }
            setTimeout(backTyping, backTypingSpeed);
        } else {
            currentIndexQuote++;
            if (currentIndexQuote >= quotes.length) currentIndexQuote = 0;
            currentChar = 0;
            typing();
        }
    }
    typing();
}

const quotes = [ "Want to make a world with 0 and 1.",
    "Always trying to show my best perfomance.",
    "Having some fun with this website more often.",
    "Want to know me?",
    "Hi, I'm Ari.",
    "Need a help? Contact me soon!",
    "Miaw!",
    "Fika is my bae." ];
const roles = ["Game Programmer",
    "Frontend Developer",
    "Java Programmer",
    "C# Programmer"];

afiTyping (document.querySelector(".quote"), document.querySelector(".typing"), quotes);
afiTyping (document.querySelector(".my-role"), document.querySelector(".typing-role"), roles);