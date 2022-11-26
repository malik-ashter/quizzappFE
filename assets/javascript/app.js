var iti;
function fetchQuizzTitles(){
    fetch(domainValue + '/api/titles')
        .then(res => {
            if(isOkResponse(res))
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

async function startQuizz(){
    let form = document.querySelector('#form');
    let data = new FormData(form);
    var languageName = data.get('quizzLanguage');
    selectedLanguage = languages.filter(lang => lang.name === languageName)[0];
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    const formValues = Object.fromEntries(data.entries());
    formValues.mobile = iti.getNumber(); // get full number eg +17024181234
    Object.keys(formValues).forEach(k => formValues[k] = formValues[k].trim());

    const response = await submitFormToApi(domainValue + '/api/submit-form', JSON.stringify(formValues))
        .then((res) => {
            if(isOkResponse(res)) {
                window.location.href = '/assets/html/quizz.html';
            } else {
                document.getElementById("submit-error").style.display= 'block';
            }
        })
        .catch((err)=> {
            document.getElementById("submit-error").style.display= 'block';
        });
}

async function submitFormToApi(url, reqBody) {
    const options = {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : reqBody
     };
    const response = await fetch(url , options);
    return response;
}

//validation
setInputFilter(document.getElementById("mobile"), function(value) {
    return /^\+?\d*$/.test(value); // Allow digits and '+' only, using a RegExp
}, "Only digits and '+' are allowed");

jQuery(function() {
    fetchQuizzTitles();

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