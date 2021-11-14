let questions;

function fetchQuestions(){
    fetch('https://quizzappmalik.herokuapp.com/api/questions/'+ selectedLanguage.shortName)
    .then(res => {
        if(res.status == 200)
            return res.json();
    }).then(loadedQuestions => {
        questions = loadedQuestions;
        applyLanguageStyles();
        startQuizz();
    });
}

function startQuizz(){
    setQuizzTitle();
    for(let i= 1;i<questions.length; i++){
        $('#quizz-container').append(`
            <div class="card">
                <h3 class="question">${questions[i].q}  <span dir="ltr">(${questions[i].points}&nbsp;points)</span></h3>
                ${appendChoices(questions[i])}
            </div>
        `);
    }
}

function setQuizzTitle(){
    console.log(questions[0].title);
    $('.quizz-title').html(questions[0].title);
}

function appendChoices(choices){
    let appendStr = '';
    for(let choice in choices){
        if (['a', 'b', 'c', 'd', 'e'].includes(choice)){
            appendStr = appendStr.concat(`
                <div class="choice-container">
                    <div class="choice-prefix">${choice.toUpperCase()}</div>
                    <div class="choice-text">${choices[choice]}</div>
                </div>
            `);
        }
    }
    return appendStr;
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
            if(['persian'].includes(selectedLanguage.name)){
                obj[s] = obj[s].replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
            } else if(['arabic', 'urdu'].includes(selectedLanguage.name)){
                obj[s] = obj[s].replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            }
        }
    }
}

jQuery(function() {
    selectedLanguage =  JSON.parse(localStorage.getItem('selectedLanguage'));
    fetchQuestions();
 });
