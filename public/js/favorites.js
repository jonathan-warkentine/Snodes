//on page load, toggle favorites as appropriate
favIcons = document.querySelectorAll('i');
favIcons.forEach(favIcon => favStatus(favIcon));

function favStatus(element){
  if (JSON.parse(element.getAttribute("isFav"))) {
    element.classList.remove('fa-heart-o');
  }
  else {
    element.classList.add('fa-heart-o');
  }
}

function favorite(element) {
    //post call that should redirect if not logged in
    fetch(`/api/users/favorite/${element.getAttribute('snodeid')}`, {
      method: 'PUT'
    });

    if (JSON.parse(element.getAttribute('isFav'))){
      element.nextElementSibling.textContent = Number(element.nextElementSibling.textContent)-1; // increment fav coutner
      element.setAttribute('isFav', 'false');
    }
    else {
      element.nextElementSibling.textContent = Number(element.nextElementSibling.textContent)+1; // increment fav coutner
      element.setAttribute('isFav', 'true');
    }

    favStatus(element);
  }