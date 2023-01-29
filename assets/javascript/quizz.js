let selectedLanguage;
let userID;
let quizzID;

let questions;
let allChoices;
let showAnswers = false;
let acceptAnswers = true;

let submitBtn;
let viewScoreBtn;
let submitSucces;
let errorElem;

function fetchQuestions(){
    fetch(domainValue + '/api/quizz/questions/'+ selectedLanguage.shortName)
    .then(res => {
        if(isOkResponse(res))
            return res.json();
    }).then(loadedQuestions => {
        questions = loadedQuestions;
        if(questions[0].showAnswers.trim().toLowerCase() == 'yes') {
            showAnswers = true;
        }
        questions.forEach(parseRTLStrings);
        loadQuizz();
        applyLanguageStyles();
    }).catch(err=>console.log(err));
}

function loadQuizz(){
    $('.quizz-title').html(questions[0].title);
    for(let i= 1;i<questions.length; i++){
        $('#quizz-container').append(`
            <div id=question${i} class="question-container" data-points="${questions[i].points}">
                <p class="question">${questions[i].question} <span dir="ltr">(${questions[i].points} points)</span></p>
                ${appendChoices(questions[i])}
            </div>
        `);
    }
    applyStyle();
}

function appendChoices(choices){
    let appendStr = '';
    let answer = choices.answer;
    for(let choice in choices){
        if (['a', 'b', 'c', 'd', 'e'].includes(choice)){
            appendStr = appendStr.concat(`
                <div class="choice-container" data-option="${choice.toLowerCase()}">
                    <p class="choice-prefix">${choice.toUpperCase()}</p>
                    <p class="choice-text">${choices[choice]}</p>${getCheck()}${getCross()}
                </div>
            `);
        }
    }
    return appendStr;
}

function getCheck() {
    return `<span class="checkmark ${selectedLanguage.rtl ? 'mark_rtl' : 'mark_ltr'}" style="display:none">
        <div class="checkmark_circle"></div>
        <div class="checkmark_stem"></div>
        <div class="checkmark_kick"></div>
    </span>`;
}

function getCross() {
    return `<span class="crossmark ${selectedLanguage.rtl ? 'mark_rtl' : 'mark_ltr'}" style="display:none">
        <div class="crossmark_circle"></div>
        <div class="crossmark_stem"></div>
        <div class="crossmark_kick"></div>
    </span>`;
}

function applyLanguageStyles(){
    if(selectedLanguage.rtl){
        setDirRtl();
        setUrdu();
    }
}

function parseRTLStrings(obj){
    for(let s in obj){
        if('q' !== s){
            obj[s] = '&rlm;' + obj[s];
        }
        if('points' !== s){
            if(['persian'].includes(selectedLanguage.name.toLowerCase())){
                obj[s] = obj[s].replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
            } else if(['arabic', 'urdu'].includes(selectedLanguage.name.toLowerCase())){
                obj[s] = obj[s].replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            }
        }
    }
}

function applyStyle() {
    allChoices = Array.from(document.getElementsByClassName("choice-container"));
    allChoices.forEach(choice => {
        choice.addEventListener('click', e => {
            if(acceptAnswers) {
                styleSelectChoice(choice);
            }
        });
    });
}

function styleSelectChoice(element) {
    let selected = $(element).hasClass('choice-selected');
    let choices = Array.from(document.getElementById($(element).parent().attr('id')).getElementsByClassName('choice-container'));
    choices.forEach(choice => $(choice).removeClass('choice-selected'));
    selected ? $(element).removeClass('choice-selected') : $(element).addClass('choice-selected');
}

async function submitQuiz() {
    errorElem.hide();
    try {
        getSelectedAnswers();
    } catch(e) {
        handleError(e);
        return;
    }
    submitBtn.hide();
    if(showAnswers) {
        viewScoreBtn.style.display = 'block';
        submitSucces.style.display= 'block';
        submitSucces.innerHTML = "<bdi>Quizz submitted successfully. Join official whatsapp group of Imam Ali Shrine to "
        + "get quizz results, certificates and other information.</bdi>";
        acceptAnswers = false;
    } else {
        saveAnswers();
    }
    $('#suggestions-container').hide();
 }

 async function saveAnswers() {
    const answerData = {};
    answerData.userID = userID;
    answerData.quizzID = quizzID;
    answerData.language = selectedLanguage.shortName;
    try {
        answerData.answers = getSelectedAnswers();
    } catch(e) {
        handleError(e);
        return;
    }
    await postToApi(domainValue + '/api/quizz/submit', JSON.stringify(answerData))
    .then((res) => {
        if(isOkResponse(res)) {
            userID = null;
            window.location.assign('/assets/html/submitted.html');
        } else {
            errorElem.show();
        }
    })
    .catch((err)=> {
        handleError(err);
    });
 }
 
 function getSelectedAnswers() {
    let selectedAns = [];
    for(let i= 1;i<questions.length; i++){
        let answered = false;
        $('#question' + i).find('.choice-container')
        .each(function() {
            if($(this).hasClass('choice-selected')) {
                selectedAns.push({question : i, answer : $(this).attr('data-option')});
                answered = true;
            }
        });
        if(!answered) {
            throw new Error(messages.ASNWER_ALL); 
        }
    }
    return selectedAns;
}

function showCorrectAnswers() {
    let score = 0;
    let points;
    for(let i= 1;i<questions.length; i++){
        const ans = questions[i].answer.replace('&rlm;','');
        var option = '';
        points = $('#question'+i).data('points');
        $('#question'+i).find('.choice-container')
        .each(function() {
            $(this).find('.checkmark').hide();
            $(this).find('.crossmark').hide();
            option = $(this).attr('data-option');
            if($(this).hasClass('choice-selected')) {
                if(ans == option) { //answered correctly
                    var pointsNum =  parseInt(points.replace(/\D/g, ''));
                    score += pointsNum;
                    $(this).addClass('choice-correct');
                    $(this).find('.checkmark').show();
                } else { //answered wront
                    $(this).find('.crossmark').show();
                    $(this).addClass('choice-wrong');
                }
            } else {
                if(ans == option) { //correct answer not selected
                    $(this).addClass('choice-correct');
                    const node = document.createElement("span");
                    const textnode = document.createTextNode("Correct Answer");
                    node.appendChild(textnode);
                    $(this).before(node);
                }
            }
        });
    }
    $(viewScoreBtn).hide();
    showContainerWithMsg('score', `Your score is ${score}. You can check the correct answers below.`);
    document.getElementById("score").scrollIntoView();
}

function handleError(err) {
    showMsg('submit-error', err);
}

jQuery(function() {
    errorElem = $('#submit-error');
    submitBtn = $('#submit-quizz');
    selectedLanguage =  JSON.parse(localStorage.getItem('selectedLanguage'));
    quizzId =  JSON.parse(localStorage.getItem('quizzId'));
    userID =  JSON.parse(localStorage.getItem('userID'));
    if(!userID) {
        submitBtn.hide();
        $('#suggestions-container').hide();
        handleError('User not found. Please go back to the first page and fill the form.');
        return;
    }
    fetchQuestions();
    submitBtn.on("click", submitQuiz);
    if(!acceptAnswers) {
    submitBtn.hide();
    }
    viewScoreBtn = document.getElementById("view-score");
    viewScoreBtn.addEventListener("click", showCorrectAnswers);
    submitSucces = document.getElementById("submit-success");
});
