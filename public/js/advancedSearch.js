var advancedSearchEl = document.getElementById("search-form");

advancedSearchEl.addEventListener('submit', advancedSearch);

function advancedSearch (event){
    event.preventDefault();
    window.location.replace(`./search?q=${searchbar.value}`);
    //if search gets more complicated, can replace with a fetch call
}