const charEn = "QWERTYUIOPASDFGHJKLZXCVBNM";
const charDe = "QWERTZUIOPÜßASDFGHJKLÖÄYXCVBNM";

let focus = [1,1];
let solution;
let selectedLang = "en";
let selectedAmount = 5;
let columns = 6;
let filteredList;
let isValid;

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
    resetKey.classList.add("hide");
    resultText.classList.add("hide");
}
const getSolution = (lang, amount) => {
    fetch(`./wordlists/solutions-${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
        let regex;
        switch(selectedLang){
            case "de":
                regex = /^[a-zA-ZäöüÄÖÜß]+$/;
                break;
            default:
                regex = /^[a-zA-Z]+$/;
        };
        filteredList = data.filter((word) => word.length === amount && regex.test(word));
        filteredList = filteredList.map((item) => item.toLowerCase());

        let randomIndex = Math.round(Math.random() * (filteredList.length - 1));
        solution = filteredList[randomIndex];
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
    removeFocus();
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
        placeholderContainer.innerHTML += `
        <div id="row${i}" class="row-container"></div>
        `;
    }
    const rowContainers = document.querySelectorAll("div.row-container");
    rowContainers.forEach((container) => {
        container.innerHTML += `
            <div id="arrow-left-${container.id}" class="arrow-selector left hide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/></svg>
            </div>
        `;
        for(let j = 1; j <= amount; j++){
            container.innerHTML += `<div class="placeholder" id="placeholder-${container.id}-place${j}"></div>`;
        }
        container.innerHTML += `
            <div id="arrow-right-${container.id}" class="arrow-selector right hide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/></svg>
            </div>
        `;
    })
    selectedAmount = amount;
    placeholderContainer.classList.remove("hide");
    initArrows();
    setFocus();
}
const initArrows = () => {
    const arrows = document.querySelectorAll(".arrow-selector");
    arrows.forEach((arrow) => {
        if(arrow.classList.contains("left")){
            arrow.addEventListener("click", () => moveFocus("left"));
        }else{
            arrow.addEventListener("click", () => moveFocus("right"));
        }
    })
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

const setFocus = () => {
    const currentRow = document.getElementById(`row${focus[0]}`);
    const currentPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    const leftArrow = document.getElementById(`arrow-left-row${focus[0]}`);
    const rightArrow = document.getElementById(`arrow-right-row${focus[0]}`);
    rightArrow.classList.remove("hide");
    leftArrow.classList.remove("hide");
    currentPlace.classList.add("focus");
    currentRow.classList.add("focus");
}

const removeFocus = () => {
    const currentRow = document.getElementById(`row${focus[0]}`);
    const currentPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    const leftArrow = document.getElementById(`arrow-left-row${focus[0]}`);
    const rightArrow = document.getElementById(`arrow-right-row${focus[0]}`);
    rightArrow.classList.add("hide");
    leftArrow.classList.add("hide");
    currentPlace.classList.remove("focus");
    currentRow.classList.remove("focus")
}

const moveFocus = (dir) => {
    removeFocus();
    switch(dir){
        case "left":
           if(focus[1] > 1){               
                focus[1]--;
            } else {
                focus[1] = selectedAmount;
            }
            break;
        case "right":
            if(focus[1] < selectedAmount){  
                focus[1]++;
            } else {
                focus[1] = 1;
            }
            break;
        default:
            return;
    }
    setFocus();
}

const addLetter = (letter) => {
    const currentPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
    if(currentPlace.textContent){
        currentPlace.textContent = letter;
        return;
    } else {
        currentPlace.textContent = letter;
        removeFocus();
        let nextPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
        let tempFocus = focus[1];
        while(nextPlace.textContent){
            if(focus[1] < selectedAmount){
                focus[1]++;
                nextPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
            } else if(focus[1] === selectedAmount){
                focus[1] = 1;
                nextPlace = document.getElementById(`placeholder-row${focus[0]}-place${focus[1]}`);
            } else {
                break;
            }
            if(focus[1] === tempFocus){
                break;
            }
        }
        setFocus();
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
    removeFocus();
    if(focus[1] > 1 && !currentPlace.textContent){
        focus[1]--;
    }
    setFocus();
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
            isValid = true;
        } else {
            isValid = false;
        }
    })
}
async function testEntry() {
    const currentRow = document.querySelectorAll(`#row${focus[0]} > .placeholder`);
    const answer = solution.split("");
    const userAnswer = [];
    // Check every Box for Input
    currentRow.forEach((box) => {
        if(!box.textContent){
            isValid = false;
            return;
        } else {
            isValid = true;
        }
        userAnswer.push(box.textContent.toLowerCase());
    });
    if(!isValid){
        warning();
        return;
    }
    await isValidWord(userAnswer.join(""));

    if(!isValid){
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
            if(!currentRow[index].classList.contains("success")){
                const valIndex = answer.indexOf(value);
                answer[valIndex] = "";
                currentRow[index].classList.add("hit");
                document.getElementById(value).classList.add("hit");
            } 
        } else if(!currentRow[index].classList.contains("success")){
            currentRow[index].classList.add("wrong");
            document.getElementById(value).classList.add("wrong");
        }
    })
    for(let i = 0; i < selectedAmount; i++){
        setTimeout(() => {
            currentRow[i].animate({
                transform: ["rotateX(0deg)", "rotateX(90deg)", "rotateX(-90deg)", "rotateX(0deg)"],
                offset: [0, 0.5, 0.5],
                easing: ["ease-in", "linear", "linear", "ease-out"],
            }, 1000);   
            setTimeout(() => currentRow[i].classList.add("reveal"), 500);
        }, 100 * i);
    }



   /*  currentRow.forEach((box) => {
        box.animate({
            transform: ["rotateX(0deg)", "rotateX(90deg)", "rotateX(-90deg)", "rotateX(0deg)"],
            offset: [0, 0.5, 0.5],
            easing: ["ease-in", "linear", "linear", "ease-out"],
        }, 1000);   
        setTimeout(() => box.classList.add("reveal"), 500); 
        
    })*/
    if(count === selectedAmount){
        successScreen();
        removeFocus();
        return;
    } else {
        if(focus[0] === columns){
            lostScreen();
            removeFocus();
            return;
        }
        removeFocus();
        focus[0]++;
        focus[1] = 1;
        setFocus();
        return;
        
    }
   
}
const successScreen = () => {
    keyboard.classList.add("hide");
    resetContainer.classList.remove("hide");
    resetKey.classList.add("success");
    resultText.classList.add("success");
    switch(selectedLang){
        case "de":
             resultText.innerHTML = `
            <span class="de">Gewonnen!</span>
            `;
            break;
        default:
            resultText.innerHTML = `
            <span class="en">You won!</span>
            `;
    }
    
}
const keyInput = (e) => {
    if(!keyboard.classList.contains("hide")){
        let regex;
        switch(selectedLang){
            case "de":
                regex = /^[a-zA-ZäöüÄÖÜß]$/;
                break;
            default:
                regex = /^[a-zA-Z]$/;
        }  
        if(regex.test(e.key)){
            e.key === "ss" ? addLetter("ß") : addLetter(e.key.toUpperCase());
            return;
        }
        switch(e.key){
            case "Enter":
                testEntry();
                break;
            case "Backspace":
                removeLetter();
                break;
            case "ArrowLeft":
                removeFocus();
                moveFocus("left");
                setFocus();
                break;
            case "ArrowRight":
                removeFocus();
                moveFocus("right");
                setFocus();
                break;
            default:
                return;
        }
    }; 
}
const lostScreen = () => {
    keyboard.classList.add("hide");
    resetContainer.classList.remove("hide");
    resultText.classList.add("lost");
    resetKey.classList.add("lost");
    switch(selectedLang){
        case "de":
            resultText.innerHTML = `
            <span class="de">Verloren! Lösung: ${solution.toUpperCase()}</span>
            `;
            break;
        default:
            resultText.innerHTML = `
            <span class="en">You lost! Result: ${solution.toUpperCase()}</span>
            `;
    }
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
    focus = [1, 1];
    renderPlaceholders(selectedAmount);
    initKeyboard(selectedLang);
    solution = getSolution(selectedLang, selectedAmount);
    const keys = document.querySelectorAll(".key");
    const deleteKey = document.getElementById("back-key");
    const enterKey = document.getElementById("enter-key");

    keys.forEach((letter) => {
        letter.addEventListener("click", () => addLetter(letter.textContent));
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
document.addEventListener("keydown", (e) => keyInput(e));
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
