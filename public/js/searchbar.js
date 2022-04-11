var searchFormEl = document.getElementById("search-form");

searchFormEl.addEventListener('submit', search);

function search (event){
    event.preventDefault();
    window.location.replace(`./search?${searchbar.value}`);
}