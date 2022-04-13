var codeareaEl = document.getElementById("codearea");

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
    myCodeMirror.save();
    const snode = {
        description: document.getElementById('description').value,
        content: codeareaEl.value,
        tags: document.getElementById('tags').value
    };

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(snode)
    });
}