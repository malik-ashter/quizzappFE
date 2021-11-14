function setSessionItem(name, value) {
    var mySession;
    try {
        mySession = JSON.parse(localStorage.getItem('mySession'));
    } catch (e) {
        console.log(e);
        mySession = {};
    }

    mySession[name] = value;

    mySession = JSON.stringify(mySession);

    localStorage.setItem('mySession', mySession);
}

function getSessionItem(name) {
    var mySession = localStroage.getItem('mySession');
    if (mySession) {
        try {
            mySession = JSON.stringify(mySession);
            return mySession[name];
        } catch (e) {
            console.log(e);
        }
    }
}

function restoreSession(data) {
    for (var x in data) {
        //use saved data to set values as needed
        console.log(x, data[x]);
    }
}



window.addEventListener('load', function(e) {
    var mySession = localStorage.getItem('mySession');
    if (mySession) {
        try {
            mySession = JSON.parse(localStorage.getItem('mySession'));
        } catch (e) {
            console.log(e);
            mySession = {};
        }
        restoreSession(mySession);
    } else {
        localStorage.setItem('mySession', '{}');
    }

    setSessionItem('foo', Date.now()); //should change each time

    if (!mySession.bar) {
        setSessionItem('bar', Date.now()); //should not change on refresh
    }
}, false);