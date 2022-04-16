async function del(btn, snodeid){

    if (confirm('Are You Sure You Want to Delete This Snode?')) {
        fetch(`/api/codesnip/${snodeid}`, {
            method: 'DELETE'
        })
        .then(res => {
            console.log(res.text());
            btn.closest(".snode").remove()
        });
    }
}