function fetchQuizzTitles(){
    fetch(domainValue + '/api/titles')
        .then(res => {
            if(res.status == 200)
                return res.json();
        })
        .then(loadedTitles => {
            titles = loadedTitles;
            setHtmlProps();
        })
        .catch(err=>console.error(err));
}

function setHtmlProps(){
    $('.quizz-title-main').html(titles.titleEnglish);
}

async function startQuizz(form){
    var languageName = $('#quizz-language').val();
    selectedLanguage = languages.filter(lang => lang.name === languageName)[0];
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    form.action = '/assets/html/quizz.html';
    console.log('form submitted');

    const response = await fetch(domainValue + '/api/submit-form' , {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : ''
     })
     .then(res => {
        if(isOkResponse(res)) {
            window.location.assign('/assets/html/quizz.html');
            return res.json();
        }
    })
     .then(data => {console.log(data);
     }).catch(err=>console.log(err));
}

//validation
setInputFilter(document.getElementById("mobile"), function(value) {
    return /^\d*\+?\d*$/.test(value); // Allow digits and '+' only, using a RegExp
}, "Only digits and '+' are allowed");

jQuery(function() {
    fetchQuizzTitles();
 });