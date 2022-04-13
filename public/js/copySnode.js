
function clickcopy(div){
    navigator.clipboard.writeText(div.querySelector("pre").textContent);
    div.querySelector('button').textContent = '📋 Copied!'
}