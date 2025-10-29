let triviaBtn = document.querySelector("#js-new-quote").addEventListener('click', newTrivia);
let answerBtn = document.querySelector("#js-tweet").addEventListener('click', newAnswer);

let current = {
    question: "",
    answer: "",
};

const endpoint = "https://api.thecatapi.com/v1/images/search?api_key=live_TKl9etz6ZcG5sXeom7hM449t0PUvxCh3qhAU1zHCazZuece3TZbSchxJoSbS4Uea";
const catFactEndpoint = "https://catfact.ninja/fact";

async function newTrivia() {
    console.log("Fetching a cat...");

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const catUrl = data[0].url;

        displayTrivia(catUrl);

    } catch (err) {
        console.log(err);
        alert('Failed to get new cat :(');
    }
}

function displayTrivia(catUrl) {
    const questionText = document.querySelector('#js-quote-text');
    const answerText = document.querySelector("#js-answer-text");

    answerText.textContent = "";

    questionText.innerHTML = "";

    const img = document.createElement("img");
    img.src = catUrl;
    img.alt = "A random cat";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";

    questionText.appendChild(img);
}

async function newAnswer() {
    console.log("Fetching a cat fact...");
    
    try {
        const response = await fetch(catFactEndpoint);
        const data = await response.json();

        if (!response.ok) {
            throw Error(response.statusText);
        }

        current.answer = data.fact;
        
        const answerText = document.querySelector("#js-answer-text");
        answerText.textContent = current.answer;
        
    } catch (err) {
        console.log(err);
        alert('Failed to get cat fact :(');
    }
}

newTrivia();