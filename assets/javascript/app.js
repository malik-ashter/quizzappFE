let selectedLanguage;

var iti;
function fetchQuizzTitles(){
    fetch(domainValue + '/api/titles')
        .then(res => {
            if(isOkResponse(res))
                return res.json();
        })
        .then(loadedTitles => {
            $('.quizz-title-main').html(loadedTitles.titleEnglish);
        })
        .catch(err=>console.error(err));
}

function initializeForm(){
    loadLanguages();
}

function loadLanguages() {
    const languageMenu = document.getElementById('quizzLanguage');
    languageMenu.options.add(new Option("", "", false));
    languages.forEach((lang)=> {
        languageMenu.add(new Option(lang.name, lang.name, lang.selected));
        if(lang.selected) {
            languageMenu.value = lang.name;
        }
    });
    
}

async function startQuizz(){
    document.getElementById("submit-error").style.display= 'none';
    let form = document.querySelector('#form');
    let data = new FormData(form);
    var languageName = data.get('quizzLanguage');
    selectedLanguage = languages.filter(lang => lang.name === languageName)[0];
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    const formValues = Object.fromEntries(data.entries());
    formValues.mobile = iti.getNumber(); // get full number eg +17024181234
    Object.keys(formValues).forEach(k => formValues[k] = formValues[k].trim());

    const response = await postToApi(domainValue + '/api/submit-form', JSON.stringify(formValues))
        .then((res) => {
            if(isOkResponse(res)) {
                return res.json();
            } else {
                document.getElementById("submit-error").style.display= 'block';
            }
        })
        .then((data) => {
            localStorage.setItem('userID', JSON.stringify(data.userID));
            window.location.href = '/assets/html/quizz.html';
        })
        .catch((err)=> {
            const errorElem = document.getElementById("submit-error");
            errorElem.innerHTML = err;
            errorElem.style.display= 'block';
        });
}

//validation
setInputFilter(document.getElementById("mobile"), function(value) {
    return /^\+?\d*$/.test(value); // Allow digits and '+' only, using a RegExp
}, "Only digits and '+' are allowed");

jQuery(function() {
    fetchQuizzTitles();
    initializeForm();
    iti = intlTelInput(document.getElementById('mobile') ,{
        utilsScript : 'build/js/utils.js'
    });
    iti.setCountry("pk");

    $("#submitBtn").on("click", () => {
        if($("#form")[0].checkValidity()) {
            startQuizz();
        } else {
            $("#form")[0].reportValidity();
        }
    });
 });