let questions;
let allChoices;

function fetchQuestions(){
    fetch(domainValue + '/api/questions/'+ selectedLanguage.shortName)
    .then(res => {
        if(isOkResponse(res))
            return res.json();
    }).then(loadedQuestions => {
        questions = loadedQuestions;
        loadQuizz();
    }).catch(err=>console.log(err));
}

function loadQuizz(){
    $('.quizz-title').html(questions[0].title);
    for(let i= 1;i<questions.length; i++){
        $('#quizz-container').append(`
            <div id=question${i} class="card">
                <p class="question">${questions[i].q}  <span dir="ltr">(${questions[i].points}&nbsp;points)</span></p>
                ${appendChoices(questions[i])}
            </div>
        `);
    }
    applyStyle();
}

function appendChoices(choices){
    let appendStr = '';
    for(let choice in choices){
        if (['a', 'b', 'c', 'd', 'e'].includes(choice)){
            appendStr = appendStr.concat(`
                <div class="choice-container">
                    <p class="choice-prefix">${choice.toUpperCase()}</p>
                    <p class="choice-text">${choices[choice]}</p>
                </div>
            `);
        }
    }
    return appendStr;
}

function applyLanguageStyles(){
    if(selectedLanguage.name == 'urdu'){
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
            if(['persian'].includes(selectedLanguage.name)){
                obj[s] = obj[s].replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
            } else if(['arabic', 'urdu'].includes(selectedLanguage.name)){
                obj[s] = obj[s].replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            }
        }
    }
}

function applyStyle() {
    applyLanguageStyles();
    allChoices = Array.from(document.getElementsByClassName("choice-container"));
    allChoices.forEach(choice => {
        choice.addEventListener('click', e => {
            styleSelectChoice(choice);
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
    const response = await fetch(domainValue + '/api/submit-quizz' , {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : ''
     })
     .then(res => {
        if(isOkResponse(res)) {
            window.location.assign('/assets/html/submitted.html');
            return res.json();
        } else {
            document.getElementById("submit-error").style.display= 'block';
        }
    })
     .then(data => {console.log(data);
     }).catch(err=> {
        console.log(err);
        document.getElementById("submit-error").style.display= 'block';
    });
 }

 jQuery(function() {
     selectedLanguage =  JSON.parse(localStorage.getItem('selectedLanguage'));
     fetchQuestions();
     const submitBtn = document.getElementById("submit-quizz");
     submitBtn.addEventListener("click", submitQuiz);
  });
