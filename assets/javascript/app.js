let selectedLanguage;
let quizzID;
let submitBtn;

var iti;
function fetchQuizzTitles(){
    fetch(domainValue + '/api/quizz/data')
        .then(res => {
            if(isOkResponse(res))
                return res.json();
        })
        .then(quizzData => {
            $('.quizz-title-main').html(quizzData.title);
            quizzID = quizzData.quizzID;
            localStorage.setItem('quizzID', JSON.stringify(quizzID));
        })
        .catch(err=>console.error(err));
}

function initializeForm(){
    loadLanguages();
    submitBtn = $('#submitBtn');
        //phone number
        iti = intlTelInput(document.getElementById('mobile') ,{
            utilsScript : 'build/js/utils.js'
        });
        iti.setCountry("pk");
    
        //submit button
        submitBtn.on("click", () => {
            if($("#form")[0].checkValidity()) {
                submitForm();
            } else {
                $("#form")[0].reportValidity();
            }
        });
    
        //inof text
        $('#info-text').html('بسم اللہ الرحمن الرحیم '
        + 'مختلف کوئز، ہفتہ وار مفید ٹیسٹ، کلام اہل بیت(علہیم السلام) پر مشتمل احادیث، مبتلا بہ جدید ترین فقہی'
        + 'مسائل اور فقہی سوالات کے جوابات کے لیے حرم امام علی علیہ السلام کے آفیشل واٹساپ گروپ کو جوائن کریں اور'
        + 'اپنی دینی معلومات میں روزانہ اضافہ کریں۔'
        + '<a href="https://chat.whatsapp.com/E33rIDAvZluJCMQAYzSAmb">Join Whatsapp Group</a>');
        $('#info-text').attr('dir','rtl');
        $('#info-text').addClass('urdu');
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

async function submitForm(){
    document.getElementById("submit-error").style.display= 'none';
    let form = document.querySelector('#form');
    let data = new FormData(form);
    var languageName = data.get('quizzLanguage');
    selectedLanguage = languages.filter(lang => lang.name === languageName)[0];
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    const formValues = Object.fromEntries(data.entries());
    formValues.mobile = iti.getNumber(); // get full number eg +17024181234
    Object.keys(formValues).forEach(k => formValues[k] = formValues[k].trim());
    
    startLoading();
    const response = await postToApi(domainValue + '/api/user/insert', JSON.stringify(formValues))
        .then((res) => {
            if(isOkResponse(res)) {
                return res.json();
            } else {
                document.getElementById("submit-error").style.display= 'block';
            }
        })
        .then((data) => {
            if(data) {
                localStorage.setItem('userID', JSON.stringify(data.userID));
                window.location.href = '/assets/html/quizz.html';
            }
        })
        .catch((err)=> {
            const errorElem = document.getElementById("submit-error");
            errorElem.innerHTML = err;
            errorElem.style.display= 'block';
        });
        
    endLoading();
}

//validation
setInputFilter(document.getElementById("mobile"), function(value) {
    return /^\+?\d*$/.test(value); // Allow digits and '+' only, using a RegExp
}, "Only digits and '+' are allowed");

jQuery(function() {
    fetchQuizzTitles();
    initializeForm();
 });