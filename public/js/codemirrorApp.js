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

function submitSnode(){
    myCodeMirror.save();
    //fetch post contents of the codeareaEl.value
}