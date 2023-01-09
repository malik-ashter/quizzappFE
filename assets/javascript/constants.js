const languages = [{
    name: 'Urdu',
    shortName: 'ur',
    rtl: true,
    selected: false
},
{
    name: 'English',
    shortName: 'en',
    rtl: false,
    selected: true
},
{
    name: 'Arabic',
    shortName: 'ar',
    rtl: true,
    selected: false
},
{
    name: 'Persian',
    shortName: 'pr',
    rtl: true,
    selected: false
}];

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