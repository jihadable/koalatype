var out = console.log.bind(document)

// input the random words
import { words2, words3, words4, words5, words6, punctuations } from "./words.js"

const wordsWrapper = document.querySelector(".words-wrapper")
const lengthElement = document.querySelector(".length")

// counter = words counter
const counter = document.querySelector(".counter")

// line = caret
const line = document.querySelector(".line")

// i for word, j for letter
let i = 0
let j = 0

let length = 50
let punctuation = false
let numbers = false

let isFinish = false

function generateWords(){
    i = 0
    j = 0

    isFinish = false
    document.querySelector(".score-wrap").classList.remove("active")
    wordsWrapper.style.display = "flex"
    line.style.display = "block"

    updateLinePosition(16, 16)

    counter.innerText = `0/${length}`

    const wordsData = []

    lengthElement.querySelectorAll("div").forEach(child => {
        child.classList.remove("active")
    })

    document.querySelector(`.length-${length}`).classList.add("active")

    for (let i = 1; i <= length; i++){
        let random

        if (numbers){
            random = Math.floor(Math.random() * 6) + 2
        }
        else {
            random = Math.floor(Math.random() * 5) + 2
        }

        let newWords

        if (random == 2){
            newWords = [...words2]
        }
        else if (random == 3){
            newWords = [...words3]
        }
        else if (random == 4){
            newWords = [...words4]
        }
        else if (random == 5){
            newWords = [...words5]
        }
        else if (random == 6){
            newWords = [...words6]
        }
        else if (random == 7){
            random = `${Math.floor(Math.random() * 10000)}`

            wordsData.push([...random.split("")])

            continue
        }

        random = Math.floor(Math.random() * newWords.length)

        let data
        if (punctuation){
            let yes = Math.floor(Math.random() * 6) + 1

            if (yes == 1){
                let newRandomNumber = Math.floor(Math.random() * punctuations.length)

                if (punctuations[newRandomNumber].length > 1){
                    data = [
                        punctuations[newRandomNumber][0],
                        ...newWords[random].split(""),
                        punctuations[newRandomNumber][1]
                    ]
                }
                else {
                    data = [
                        ...newWords[random].split(""), 
                        punctuations[newRandomNumber][0]
                    ]
                }
            }

            else {
                data = [...newWords[random].split("")]
            }
        }
        else {
            data = [...newWords[random].split("")]
        }

        wordsData.push(data)
    }

    wordsWrapper.innerHTML = ""
    
    for (let i = 0; i < wordsData.length; i++){
        let word = "<word>"
        for (let j = 0; j < wordsData[i].length; j++){
            let letter = `<letter>${wordsData[i][j]}</letter>`
            word += letter
        }
        word += "</word>"
        
        wordsWrapper.innerHTML += word
    }
}

generateWords()

lengthElement.querySelectorAll("div").forEach(child => {
    child.addEventListener("click", () => {
        resetTimer()
        length = parseInt(child.innerText)
        generateWords()
    })
})

const punctuationBtn = document.querySelector(".punctuation")
const numbersBtn = document.querySelector(".numbers")

punctuationBtn.addEventListener("click", () => {
    resetTimer()
    punctuationBtn.classList.toggle("active")
    punctuation = !punctuation
    generateWords()
})

numbersBtn.addEventListener("click", () => {
    resetTimer()
    numbersBtn.classList.toggle("active")
    numbers = !numbers
    generateWords()
})

const reloadBtn = document.querySelector(".reload")

reloadBtn.addEventListener("click", () => {
    resetTimer()
    generateWords()
})

function resetTimer(){
    timeIsRunning = false
    clearInterval(myInterval)
    time.innerText = "00:00"
}

// typing
document.addEventListener("keydown", (e) => {
    let key = e.key
    
    let alphabet = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 
        ",", ".", "!", ":", "?", ";", "(", ")", "'", '"',
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ]

    let word, batasJ, letter

    if (i < length){
        word = Array.from(Array.from(wordsWrapper.children)[i].children)
        batasJ = word.length - 1
    
        // letter
        letter = word[j]
    }

    if (alphabet.includes(key) && !isFinish){

        if (!timeIsRunning){
            timer()
        }

        // out of words
        if (i >= length){

            word = Array.from(Array.from(wordsWrapper.children)[i - 1].children)
            batasJ = word.length - 1
        
            letter = word[batasJ]
        }

        // add extra
        if (j == 0 && i != 0 && line.offsetLeft != letter.parentElement.offsetLeft){

            if (i >= length){
                let letterParentElement = letter.parentElement

                letter.parentElement.innerHTML += `<letter class="extra">${key}</letter>`
                letter = letterParentElement.lastElementChild
            }
            else {
                letter.parentElement.previousElementSibling.innerHTML += `<letter class="extra">${key}</letter>`
                letter = letter.parentElement.previousElementSibling.lastElementChild
            }

            updateLinePosition(letter.offsetLeft + letter.parentElement.offsetLeft + letter.offsetWidth, letter.parentElement.offsetTop)            

            return
        }

        // correct letter
        if (letter.innerText == key){
            letter.classList.add("correct")
            letter.classList.remove("incorrect")
        }

        // incorrect letter
        else {
            letter.classList.add("incorrect")
            letter.classList.remove("correct")
        }
        
        // update i and j
        if (j == batasJ){
            j = 0
            i++
        }
        else {
            j++
        }

        // update line's position
        updateLinePosition(letter.offsetLeft + letter.parentElement.offsetLeft + letter.offsetWidth, letter.parentElement.offsetTop)

        // update counter
        counter.innerText = `${checkWords()}/${length}`

        if (checkWords() == length){
            isFinish = true
            setTimeout(() => {
                finish()
            }, 300);
        }
    }
    
    // space
    else if (key == " " && j == 0 && i < length){
        updateLinePosition(letter.parentElement.offsetLeft, letter.parentElement.offsetTop)
    }
    
    // backspace
    else if (key == "Backspace" && i + j != 0){
        
        if (j == 0){

            // out of words
            if (i >= length){
                word = Array.from(Array.from(wordsWrapper.children)[i - 1].children)
                batasJ = word.length - 1
                j = batasJ

                letter = word[j]
            }

            if (line.offsetLeft == letter.parentElement.offsetLeft){
                updateLinePosition(letter.parentElement.previousElementSibling.offsetLeft + letter.parentElement.previousElementSibling.offsetWidth, letter.parentElement.previousElementSibling.offsetTop)
                
                return
            } 
            else {
                i--
                word = Array.from(Array.from(wordsWrapper.children)[i].children)
                batasJ = word.length - 1
                j = batasJ
            }
        }
        else {
            j--
        }
        
        letter = word[j]
        letter.classList.remove("correct", "incorrect")
        
        let newLetter = letter.previousElementSibling
        
        if (letter.classList.contains("extra")){
            letter.parentElement.removeChild(letter)
            i++
            j = 0
            
            updateLinePosition(newLetter.offsetLeft + newLetter.parentElement.offsetLeft + newLetter.offsetWidth, newLetter.parentElement.offsetTop)
        }
        else {
            updateLinePosition(letter.offsetLeft + letter.parentElement.offsetLeft, letter.parentElement.offsetTop)
        }

        // update counter
        counter.innerText = `${checkWords()}/${length}`
    }
})

// uodate line's position
function updateLinePosition(x, y){
    line.style.left = `${x}px`
    line.style.top = `${y}px`
}

function checkWords(){
    const words = document.querySelectorAll("word")
    
    let validWords = 0

    for (let i = 0; i < words.length; i++){
        let word = words[i]

        let validLetter = false
        for (let j = 0; j < word.childNodes.length; j++){
            if (word.childNodes[j].classList.contains("incorrect") || word.childNodes[j].classList.contains("extra") || word.childNodes[j].classList.length == 0){
                validLetter = false
                break
            }
            else if (word.childNodes[j].classList.contains("correct")){
                validLetter = true
            }
        }

        if (validLetter){
            validWords++
        }
    }

    return validWords
}

// timer
const time = document.querySelector(".timer")
let myInterval;
let timeIsRunning = false

function timer(){
    timeIsRunning = true
    let sec = 1
    let min = 0

    time.innerText = ""

    time.innerText = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`

    myInterval = setInterval(() => {
        sec++
        
        if (sec == 60){
            sec = 0;
            min++;
        }

        time.innerText = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
    }, 1000);
}

// finish
const scoreWrap = document.querySelector(".score-wrap")

function finish(){
    clearInterval(myInterval)
    
    line.style.display = "none"
    wordsWrapper.style.display = "none"
    scoreWrap.classList.add("active")

    let min = parseInt(time.innerText.split(":")[0])
    let sec = parseInt(time.innerText.split(":")[1]) + min * 60

    scoreWrap.querySelector(".score").innerText = `${Math.ceil(length / sec)} words/sec`

    isFinish = true
}