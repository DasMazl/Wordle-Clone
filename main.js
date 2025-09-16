const charEn = "QWERTYUIOPASDFGHJKLZXCVBNM";
const charDe = "QWERTZUIOPÜßASDFGHJKLÖÄYXCVBNM";

let focus = [1,1];
let solution;
let selectedLang = "en";
let selectedAmount = 5;
let columns = 6;
let filteredList;
let valid;

const keyboard = document.getElementById("keyboard");
const keyboardRowOne = document.getElementById("keyboard-row1");
const keyboardRowTwo = document.getElementById("keyboard-row2");
const keyboardRowThree = document.getElementById("keyboard-row3");

const placeholderContainer = document.getElementById("placeholder-container");
const resetContainer = document.getElementById("reset-container");

const resetKey = document.getElementById("reset-button");
const resultText = document.getElementById("result-text");

const startMenu = document.getElementById("game-menu");
const lengthSetting = document.getElementById("length-setting");
const showcaseLength = document.getElementById("show-length");
lengthSetting.value = 5;
const playButton = document.getElementById("play-button");
const resumeButton = document.getElementById("resume-button");

const backToSettings = () => {
    keyboard.classList.add("hide");
    placeholderContainer.classList.add("hide");
    startMenu.classList.remove("hide");
    resumeButton.classList.remove("hide");
    menuButton.classList.add("hide");
}
const getSolution = (lang, amount) => {
    fetch(`./wordlists/solutions-${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
        const regex = /^[a-zA-ZäöüÄÖÜß]+$/;
        filteredList = data.filter((word) => word.length === amount && regex.test(word));
        filteredList = filteredList.map((item) => item.toLowerCase());

        console.log(filteredList);
        let randomIndex = Math.round(Math.random() * (filteredList.length - 1));
        solution = filteredList[randomIndex];
        solution = "blast";
    })
}
const resetAll = () => {
    const allBoxes = document.querySelectorAll(".placeholder");
    const allKeys = document.querySelectorAll(".key");
    allBoxes.forEach((box) => {
        box.textContent = "";
        box.classList.remove("success");
        box.classList.remove("hit");
        box.classList.remove("wrong");
    });
    allKeys.forEach((key) => {
        key.classList.remove("success");
        key.classList.remove("hit");
        key.classList.remove("wrong");
    })
    focus = [1, 1];
    solution = getSolution(selectedLang, selectedAmount);
    keyboard.classList.remove("hide");
    resetContainer.classList.add("hide");
    resetKey.classList.remove("success");
    resetKey.classList.remove("lost");
    resultText.classList.remove("success");
    resultText.classList.remove("lost");
    resultText.textContent = "";
}
const renderPlaceholders = (amount) => {
    for(let i = 1; i <= columns; i++){
        placeholderContainer.innerHTML += `<div id="row${i}" class="row-container">`;
    }
    const rowContainers = document.querySelectorAll("div.row-container");
    rowContainers.forEach((container) => {
        for(let j = 1; j <= amount; j++){
            container.innerHTML += `<div class="placeholder" id="placeholder-${container.id}-place${j}"></div>`;
        }
    })
    selectedAmount = amount;
    placeholderContainer.classList.remove("hide");
}
const initKeyboard = (lang) => {
    keyboardRowThree.innerHTML += `
        <div class="enter" id="enter-key">Enter</div>
    `;
    switch(lang){
        case "en":
            for(let i = 0; i < charEn.length; i++){
                i < 10 ? keyboardRowOne.innerHTML +=`
                    <div class="key" id="${charEn.charAt(i).toLowerCase()}">${charEn.charAt(i)}</div>
                    `
                : i < 19 ? keyboardRowTwo.innerHTML +=`
                    <div class="key" id="${charEn.charAt(i).toLowerCase()}">${charEn.charAt(i)}</div>
                    `
                : keyboardRowThree.innerHTML +=`
                    <div class="key" id="${charEn.charAt(i).toLowerCase()}">${charEn.charAt(i)}</div>
                    `;
            }
            break;
        case "de":
            for(let i = 0; i < charDe.length; i++){
                i < 12 ? keyboardRowOne.innerHTML +=`
                    <div class="key" id="${charDe.charAt(i).toLowerCase()}">${charDe.charAt(i)}</div>
                    `
                : i < 23 ? keyboardRowTwo.innerHTML +=`
                    <div class="key" id="${charDe.charAt(i).toLowerCase()}">${charDe.charAt(i)}</div>
                    `
                : keyboardRowThree.innerHTML +=`
                    <div class="key" id="${charDe.charAt(i).toLowerCase()}">${charDe.charAt(i)}</div>
                    `;
            }
            break;
    }
    keyboardRowThree.innerHTML += `
        <div class="back" id="back-key">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 192C576 156.7 547.3 128 512 128L205.3 128C188.3 128 172 134.7 160 146.7L9.4 297.4C3.4 303.4 0 311.5 0 320C0 328.5 3.4 336.6 9.4 342.6L160 493.3C172 505.3 188.3 512 205.3 512L512 512C547.3 512 576 483.3 576 448L576 192zM284.1 252.1C293.5 242.7 308.7 242.7 318 252.1L351.9 286L385.8 252.1C395.2 242.7 410.4 242.7 419.7 252.1C429 261.5 429.1 276.7 419.7 286L385.8 319.9L419.7 353.8C429.1 363.2 429.1 378.4 419.7 387.7C410.3 397 395.1 397.1 385.8 387.7L351.9 353.8L318 387.7C308.6 397.1 293.4 397.1 284.1 387.7C274.8 378.3 274.7 363.1 284.1 353.8L318 319.9L284.1 286C274.7 276.6 274.7 261.4 284.1 252.1z"/></svg>
        </div>
    `;
    keyboard.classList.remove("hide");
}
const addLetter = (letter) => {
    const currentRow = document.getElementById(`row${focus[0]}`);
    const currentPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    if(focus[1] === selectedAmount){
        currentPlace.textContent ? warning() : currentPlace.textContent = letter;
    } else {
        currentPlace.textContent = letter;
        focus[1]++;
    }
}
const warning = () => {
    const currentRow = document.querySelectorAll(`#row${focus[0]} > .placeholder`);
    currentRow.forEach((box) => {
        box.classList.add("warning");
        setTimeout(() => box.classList.remove("warning"), 400);
    })
}
const removeLetter = () => {
    const currentPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    if(focus[1] > 1 && !currentPlace.textContent){
        focus[1]--;
    }
    const previousPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    previousPlace.textContent = "";
}
async function isValidWord(word){
    await fetch(`./wordlists/valid-${selectedLang}.json`)
    .then((res) => res.json())
    .then((data) => {
        let validList = data.filter((word) => word.length === selectedAmount);
        validList = validList.map((item) => item.toLowerCase());
        if(validList.includes(word)){
            valid = true;
        } else {
               valid = false;
        }
    })
}
async function testEntry() {
    valid = true;
    const currentRow = document.querySelectorAll(`#row${focus[0]} > .placeholder`);
    const answer = solution.split("");
    const userAnswer = [];
    // Check every Box for Input
    currentRow.forEach((box) => {
        if(!box.textContent){
            valid = false;
            return;
        }
        userAnswer.push(box.textContent.toLowerCase());
    });
    if(!valid){
        return;
    }
    await isValidWord(userAnswer.join(""));
    if(!valid){
        warning();
        return;
    }

    let count = 0;

    userAnswer.forEach((value, index) => {
        if(answer.includes(value)){
            if(value === answer[index]){
                currentRow[index].classList.add("success");
                document.getElementById(value).classList.add("success");
                count++;
                answer[index] = "";
            }
        }
    })
    userAnswer.forEach((value, index) => {
        if(answer.includes(value)){
            if(value !== answer[index]){
                answer[index] = "";
                currentRow[index].classList.add("hit");
                document.getElementById(value).classList.add("hit");
            }
        } else {
            currentRow[index].classList.add("wrong");
            document.getElementById(value).classList.add("wrong");
        }
    })
    if(count === selectedAmount){
        successScreen();
        return;
    } else {
        if(focus[0] === columns){
            lostScreen();
            return;
        }
        focus[0]++;
        focus[1] = 1;
        return;
        
    }
}
const successScreen = () => {

    console.log("Success!");
    keyboard.classList.add("hide");
    resetContainer.classList.remove("hide");
    resetKey.classList.add("success");
    resultText.classList.add("success");
    resultText.innerHTML = `
    <span class="en">You won!</span><span class="de hide">Gewonnen!</span>
    `;
}
const lostScreen = () => {
    console.log("lost");
    keyboard.classList.add("hide");
    resetContainer.classList.remove("hide");
    resultText.classList.add("lost");
    resetKey.classList.add("lost");
    resultText.innerHTML = `
    <span class="en">You lost! Result: ${solution.toUpperCase()}</span><span class="de hide">Verloren! Lösung: ${solution.toUpperCase()}</span>
    `;
}
lengthSetting.addEventListener("input", () => {
    showcaseLength.textContent = lengthSetting.value;
    selectedAmount = Number(lengthSetting.value);
    selectedAmount < 5 ? columns = 5 
    : selectedAmount < 8 ? columns = selectedAmount + 1
    : columns = 8;
})
playButton.addEventListener("click", () => {
    placeholderContainer.innerHTML = "";
    keyboardRowOne.innerHTML = "";
    keyboardRowTwo.innerHTML = "";
    keyboardRowThree.innerHTML = "";
    startMenu.classList.add("hide");
    menuButton.classList.remove("hide");
    renderPlaceholders(selectedAmount);
    initKeyboard(selectedLang);
    focus = [1, 1];
    solution = getSolution(selectedLang, selectedAmount);
    const keys = document.querySelectorAll(".key");
    const deleteKey = document.getElementById("back-key");
    const enterKey = document.getElementById("enter-key");

    keys.forEach((key) => {
        key.addEventListener("click", () => addLetter(key.textContent));
    });
    deleteKey.addEventListener("click", removeLetter);
    enterKey.addEventListener("click", testEntry);
    resetKey.addEventListener("click", resetAll);
})
resumeButton.addEventListener("click", () => {
    keyboard.classList.remove("hide");
    placeholderContainer.classList.remove("hide");
    startMenu.classList.add("hide");
    resumeButton.classList.add("hide");
    menuButton.classList.remove("hide");
})

const menuButton = document.getElementById("back-to-menu");

menuButton.addEventListener("click", () => {
    backToSettings();
})

const textDe = document.querySelectorAll("span.de");
const textEn = document.querySelectorAll("span.en");
const deButton = document.getElementById("language-german");
const enButton = document.getElementById("language-english");

deButton.addEventListener("click", () => {
    enButton.classList.remove("selected");
    deButton.classList.add("selected");
    textDe.forEach((text) => text.classList.remove("hide"));
    textEn.forEach((text) => text.classList.add("hide"));
    selectedLang = "de";
})

enButton.addEventListener("click", () => {
    enButton.classList.add("selected");
    deButton.classList.remove("selected");
    textDe.forEach((text) => text.classList.add("hide"));
    textEn.forEach((text) => text.classList.remove("hide"));
    selectedLang = "en";
})