var advancedSearchEl = document.getElementById("advanced-search-form");

//set selector value if a search has already been performed
var lastSearch = window.location.search.substring(3).split('%20');
document.querySelector('#lang').value = lastSearch[0];

advancedSearchEl.addEventListener('submit', advancedSearch);

function advancedSearch (event){
    event.preventDefault();
    window.location.replace(`./search/advanced?q=${document.querySelector('#lang').value? document.querySelector('#lang').value + '%20': ""}${document.querySelector('#advanced-searchbar').value}`);
}