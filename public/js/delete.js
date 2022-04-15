async function del(btn, snodeid){
    fetch(`/api/codesnip/${snodeid}`, {
        method: 'DELETE'
    })
    .then(res => {
        console.log(res.text());
        btn.closest(".snode").remove()
    });
}