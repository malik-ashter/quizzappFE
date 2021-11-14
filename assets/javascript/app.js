const languages = [{name: 'urdu',
                shortName: 'ur',
                rtl: true},
                {name: 'english',
                shortName: 'en',
                rtl: false}];

let selectedLanguage;
let titles;

function setDirRtl(){
    if(selectedLanguage.rtl){
        document.querySelector('html').setAttribute('dir','rtl');
    }
}

function fetchQuizzTitles(){
    fetch('https://quizzappmalik.herokuapp.com/api/titles')
        .then(res => {
            if(res.status == 200)
                return res.json();
        }).then(loadedTitles => {
            titles = loadedTitles;
            setHtmlProps();
        });
}

function setHtmlProps(){
    console.log(titles.titleEnglish);
    $('.quizz-title-main').html(titles.titleEnglish);
}

function startQuizz(form){
    var languageName = $('#quizz-language').val();
    selectedLanguage = languages.filter(lang => lang.name === languageName)[0];
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    form.action = '/assets/html/quizz.html';
    console.log('form submitted');
}

jQuery(function() {
    fetchQuizzTitles();
 });