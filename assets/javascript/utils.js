function setDirRtl(){
    if(selectedLanguage.rtl){
        // document.querySelector('html').setAttribute('dir','rtl');
        
        for(let i= 1;i<questions.length; i++){
          $('#question' + i).attr('dir','rtl');
          $('#question' + i).find('.choice-container')
          .each(function() {
              $(this).attr('dir','rtl');
              $(this).addClass('selected');
          });
      }
    }
}

function isOkResponse(res){
    if(okResponseCodes.indexOf(res.status) > -1) {
        return true;
    }
    return false;
}

async function postToApi(url, reqBody) {
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

// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
      textbox.addEventListener(event, function(e) {
        if (inputFilter(this.value)) {
          // Accepted value
          if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
            this.classList.remove("input-error");
            this.setCustomValidity("");
          }
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          // Rejected value - restore the previous one
          this.classList.add("input-error");
          this.setCustomValidity(errMsg);
          this.reportValidity();
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          // Rejected value - nothing to restore
          this.value = "";
        }
      });
    });
  }