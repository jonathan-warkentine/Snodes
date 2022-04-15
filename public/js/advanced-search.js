var advancedSearchEl = document.getElementById("advanced-search-form");

advancedSearchEl.addEventListener('submit', advancedSearch);

function advancedSearch (event){
    event.preventDefault();
    window.location.replace(`./search?q=${document.querySelector('#lang').value? document.querySelector('#lang').value + '%20': ""}${document.querySelector('#advanced-searchbar').value}`);
}