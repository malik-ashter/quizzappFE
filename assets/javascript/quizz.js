let selectedLanguage;
let userID;

let questions;
let allChoices;
let showAnswers = false;
let acceptAnswers = true;

let submitBtn;
let viewScoreBtn;
let submitSucces;

function fetchQuestions(){
    fetch(domainValue + '/api/questions/'+ selectedLanguage.shortName)
    .then(res => {
        if(isOkResponse(res))
            return res.json();
    }).then(loadedQuestions => {
        questions = loadedQuestions;
        if(questions[0].showAnswers.trim().toLowerCase == 'yes') {
            showAnswers = true;
        }
        applyLanguageStyles();
        loadQuizz();
    }).catch(err=>console.log(err));
}

function loadQuizz(){
    $('.quizz-title').html(questions[0].title);
    for(let i= 1;i<questions.length; i++){
        $('#quizz-container').append(`
            <div id=question${i} class="card">
                <p class="question">${questions[i].question}  <span dir="ltr">(${questions[i].points}&nbsp;points)</span></p>
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
        questions.forEach(parseRTLStrings);
        setDirRtl();
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
    document.getElementById("submit-error").style.display= 'none';
    try {
        getSelectedAnswers();
    } catch(e) {
        handleError(e);
        return;
    }
    submitBtn.style.display= 'none';
    if(showAnswers) {
        viewScoreBtn.style.display = 'block';
        submitSucces.style.display= 'block';
        submitSucces.innerHTML = "<bdi>Quizz submitted successfully. Join official whatsapp group of Imam Ali Shrine to "
        + "get quizz results, certificates and other information.</bdi>";
        acceptAnswers = false;
    } else {
        saveAnswers();
    }
 }

 async function saveAnswers() {
    const selectedAns = {};
    selectedAns.userID = userID;
    try {
        selectedAns.answers = getSelectedAnswers();
    } catch(e) {
        handleError(e);
        return;
    }
    await postToApi(domainValue + '/api/submit-quizz', JSON.stringify(selectedAns))
    .then((res) => {
        if(isOkResponse(res)) {
            window.location.assign('/assets/html/submitted.html');
        } else {
            document.getElementById("submit-error").style.display= 'block';
        }
    })
    .catch((err)=> {
        document.getElementById("submit-error").style.display= 'block';
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
            throw new Error('Please answer all the questions!'); 
        }
    }
    return selectedAns;
}

function showCorrectAnswers() {
    for(let i= 1;i<questions.length; i++){
        const ans = questions[i].answer.replace('&rlm;','');
        var option = '';
        $('#question' + i).find('.choice-container')
        .each(function() {
            $(this).find('.checkmark').hide();
            $(this).find('.crossmark').hide();
            option = $(this).attr('data-option');
            if($(this).hasClass('choice-selected')) {
                if(ans == option) {
                    $(this).addClass('choice-correct');
                    $(this).find('.checkmark').show();
                } else {
                    $(this).find('.crossmark').show();
                    $(this).addClass('choice-wrong');
                }
            } else {
                if(ans == option) {
                    $(this).addClass('choice-correct');
                    const node = document.createElement("span");
                    const textnode = document.createTextNode("Correct Answer");
                    node.appendChild(textnode);
                    $(this).before(node);
                }
            }
        });
    }
}

function handleError(err) {
    let errorElem = document.getElementById("submit-error");
    errorElem.innerHTML = err;
    errorElem.style.display= 'block';
}

 jQuery(function() {
     selectedLanguage =  JSON.parse(localStorage.getItem('selectedLanguage'));
     userID =  JSON.parse(localStorage.getItem('userID'));
     fetchQuestions();
     submitBtn = document.getElementById("submit-quizz");
     submitBtn.addEventListener("click", submitQuiz);
     if(!acceptAnswers) {
        submitBtn.style.display = none;
     }
     viewScoreBtn = document.getElementById("view-score");
     viewScoreBtn.addEventListener("click", showCorrectAnswers);
     submitSucces = document.getElementById("submit-success");
  });
