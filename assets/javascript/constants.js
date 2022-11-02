const languages = [{name: 'urdu',
                shortName: 'ur',
                rtl: true},
                {name: 'english',
                shortName: 'en',
                rtl: false}];

let selectedLanguage;
let titles;
const devEnvironments = {
    local : {
        domain : "http://localhost:3000"
    },
    prod : {
        domain : "https://quizzappmalik.herokuapp.com"
    }
}
var domainValue = devEnvironments.local.domain;

const okResponseCodes = [200, 201, 202, 203, 204, 205, 206];