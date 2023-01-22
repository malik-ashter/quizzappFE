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
        domain : "https://web-production-4a9f.up.railway.app"
    },
    cyclic : {
        domain : "https://zany-pear-chimpanzee-sari.cyclic.app"
    }
}
var domainValue = devEnvironments.cyclic.domain;

const okResponseCodes = [200, 201, 202, 203, 204, 205, 206];