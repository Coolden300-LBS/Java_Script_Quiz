// Correct option is always the first one, script just shuffles the order
const QUIZ_QUESTIONS = [
    {
        question: "What is this meme called?",
        options: ["Wojak", "Sojak", "Simple Man", "Dud"]
    },
    {
        question: "What is this meme called?",
        options: ["Soyjak", "Nerd", "Reddit mod", "Sojak"]
    },
    {
        question: "What does this meme say?",
        options: ["Nothing ever happens", "It is about nothing time", "Time for nothing", "No time for a thing"]
    },
    {
        question: "Who is this?",
        options: ["Doge", "Milkshake", "Smoothie", "Mr. Trickshot"]
    },
    {
        question: `Who is the author of the famous YouTube video called "Kitty City"?`,
        options: ["Cyriak", "Terry Gilliam", "Beeple", "atticusbird182"]
    },
    {
        question: `What are memes like this one called?`,
        options: ["Dank memes", "Hype memes", "Cracked memes", "FSP memes"]
    },
    {
        question: `What is the "golden" version of Minecraft modding in history?`,
        options: ["1.12.2", "1.14.4", "1.8.8", "1.16.2"]
    },
    {
        question: `Who is this?`,
        options: ["Quandale Dingle", "Ohio Final Boss", "Quagmire", "Fr3akyMan2001"]
    },
    {
        question: `What was this app called?`,
        options: ["Skype", "S-call", "Slipe", "Sky-Call"]
    },
]

function shuffleArray(array){
    let shuffledArray = [...array] // we copy the array instead of using original because
    // it would work over original one instead
    for (let i = shuffledArray.length - 1; i > 0; i--){
        const randomIndex = Math.floor(Math.random() * (i + 1)); // this thing errored because it added line below to the random index
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]] // in this case we do need a semi-colon
    }
    return shuffledArray
}

const PANELS = ["start", "question", "results"];

let nickname, shuffled_quiz, currentQuestion, score
let leaderboard = []



function OpenPanel(panel_name){
    panel_name = panel_name + "-panel"

    PANELS.forEach((name, index) => {
        const htmlComponent = document.getElementById(name+"-panel")
        if (htmlComponent === null) return
        if (htmlComponent.id === panel_name) htmlComponent.style.display = "block"
        else htmlComponent.style.display = "none"
    })
}

function PlaySound(sound_name){
    const sound = new Audio(`Assets/Sounds/${sound_name}.mp3`)
    sound.play()
}

function ShakeObject(html_object){
    html_object.style.animation = "none"
    void html_object.offsetWidth;  
    /*  the browser is what handles styles and animations, and
        it takes a slight delay until it can understand that
        changes have occured, so when I instantly apply none
        and then shake right after, for browser it looks like
        shake, so it doesn't see the need in animating the
        object again
    */
    html_object.style.animation = "shake 0.2s"
}

function ShuffleQuiz(){
    
    const shuffled_options_plus_image_id = QUIZ_QUESTIONS.map((questionContent, index) => { 
        // .map is like .forEach, except it runs a function for each element which awaits a return, and then 
        // it replaces current position parameter with return. Then we shuffle options, write down correct one
        // and put everything together with image id on top
        const correctAnswer = questionContent.options[0]
        return {
            question: questionContent.question,
            options: shuffleArray(questionContent.options),
            correct_option: correctAnswer,
            image_id: index+1 // without +1 it lagged pictures behind by 1, whoops
        }
    })
    
    const shuffled_questions = shuffleArray(shuffled_options_plus_image_id) // and we also shuffle questions
    // so we got totally shuffled array
    return shuffled_questions
}



let initPlaceholderText = null;
function TryToStartQuiz(){
    const input = document.getElementById("nickname-input")
    nickname = input.value.trim()
    if (!nickname){
        ShakeObject(input)
        PlaySound("invalid_name")
        
        if (!initPlaceholderText) initPlaceholderText = input.placeholder
        input.placeholder = "You forgot to write a nickname!"

        setTimeout(() => {
            input.placeholder = initPlaceholderText
        }, 2000)
    }
    else {
        input.value = ""
        score = 0
        currentQuestion = 1
        shuffled_quiz = ShuffleQuiz()
        console.log(shuffled_quiz);
        
        LoadNextQuestion()
        OpenPanel("question")
    }
}

function LoadNextQuestion(){
    if (currentQuestion > shuffled_quiz.length) {
        ShowResults()
        return
    }

    const currQuestionData = shuffled_quiz[currentQuestion-1]

    document.getElementById("header-text").textContent = `${currentQuestion.toString()}/${shuffled_quiz.length.toString()}`
    document.getElementById("question-image").src = `Assets/Images/image${currQuestionData.image_id}.png`
    document.getElementById("question-text").textContent = currQuestionData.question

    let buttonsHtml = `
    <style>
        .option-button:hover {scale: 1.15;}
    </style>
    `
    currQuestionData.options.forEach((option) => {
        buttonsHtml += `
            <button class="option-button" onClick="CheckCorrectAnswer('${option}')">${option}</button>
        `
    })
    document.getElementById("question-options").innerHTML = buttonsHtml
}

function CheckCorrectAnswer(selectedOption){
    const currQuestionData = shuffled_quiz[currentQuestion-1]

    const buttons = document.querySelectorAll(".option-button")
    const correct = selectedOption === currQuestionData.correct_option

    PlaySound(correct ? "correct" : "incorrect")
    buttons.forEach((button) => {
        if (button.textContent === selectedOption){
            button.style.backgroundColor = correct ? "green" : "red"
            button.style.color = "white"
        }
        if (button.textContent === currQuestionData.correct_option && !correct){
            button.style.backgroundColor = "green"
            button.style.color = "white"
        }
    })

    if(correct) score++;
    currentQuestion++

    setTimeout(() => {
        LoadNextQuestion()
    }, 2000)
}

function ShowResults(){
    leaderboard.push({nickname: nickname, score: score})
    leaderboard.sort((a, b) => b.score - a.score)

    document.getElementById("score").textContent = `You've scored ${score} points out of ${shuffled_quiz.length}!!!!`
    
    let subt
    if (score === 0){
        subt = `It would be more likely to get at least 1 score if you really didn't know anyhting 
        so, you deliberately chose all incorrect options! You are The True Unc!`
    }
    else if (score <= QUIZ_QUESTIONS.length / 2){
        subt = `Yea nice try, but you've got some milk on your lips, kiddo. Tsk, tsk, tsk.`
    }
    else if (score < QUIZ_QUESTIONS.length){
        subt = `Old but not enough, Junior!`
    }
    else {
        subt = `You are an unc, indeed! Congratulations!`
    }

    document.getElementById("unc-status").textContent = subt

    let leaderboardHtml = ""
    leaderboard.forEach((data, id) => {
        leaderboardHtml += `
        <li>${data.nickname} - ${data.score}</li>`
    })
    document.getElementById("leaderboard").innerHTML = leaderboardHtml

    OpenPanel("results")
}



OpenPanel("start")