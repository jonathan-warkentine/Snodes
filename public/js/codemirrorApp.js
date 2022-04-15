const codeareaEl = document.getElementById("codearea"); //actual textarea element codemirror builds on

var myCodeMirror = CodeMirror.fromTextArea(codeareaEl, {
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: "javascript",
    highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
});



const submitBtn = document.getElementById("snodeSubmit");
submitBtn.addEventListener('click', submitSnode);

function submitSnode(event){
    event.preventDefault();
    myCodeMirror.save(); //allows us to access the .value for the origin textarea element of the codemirror
    
    const description = document.getElementById('description').value;
    const content = codeareaEl.value;
    let tags = document.getElementById('tags').value;
    tags = tags.replaceAll(',', '');

    if (description && content && tags) {
        const snode = {
            description,
            content,
            tags
        };

        fetch('api/codesnip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(snode)
        })
        .then(result => result.status == 200? submitStatus(true): submitStatus(false));
    }
    else {
        $('#inputs').append('<h4 class="text-danger text-center m-5 p-2">Check Your Input and Try Again</h4>')
    }
    

    
}

function submitStatus(success){
    $('#draft').empty(); //clears the page of drafting tools
    if (success){
        $('#draft').addClass('text-center');
        $('#draft').append('<h2 class="text-success text-center">Snode Successfully Submitted!</h2>')
    }
}