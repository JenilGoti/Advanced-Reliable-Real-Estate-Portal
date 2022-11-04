const search = document.querySelector('.search')
const btn = document.querySelector('.btn')
const input = document.querySelector('.input')
const appTitle = document.querySelector('.main-title');
const searchBar = document.getElementById("search-bar");
const host = location.protocol + '//' + location.host;
const searchContent = document.querySelector('.search-content');

btn.addEventListener('click', () => {
    isDisplay = input.style.display == "none" || input.style.display == "";
    if (isDisplay) {
        input.style.animation = "scale-display .3s";
        input.style.display = "flex"
        searchContent.style.animation = "showSearches .3s";
        searchContent.style.display = "flex";
    } else {
        input.style.display = "none";
        searchContent.style.display = "none";
    }
    search.classList.toggle('active')
    input.focus()
    if (isDisplay) {
        btn.innerHTML = '<span class="material-symbols-outlined">close</span>'
    } else {
        btn.innerHTML = '<span class="material-symbols-outlined">search</span>'
    }
    if (screen.availWidth < 593) {
        isDisplay ? appTitle.style.display = "none" : appTitle.style.display = "flex"
    }
})
const searchHendler = (value) => {
    console.log(searchBar.value);
    fetch(host + '/property/search/' + searchBar.value, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            console.log(result.search);
            searchContent.innerHTML = "";
            if (result.statusCode == 200) {
                result.search.forEach(search => {
                    const searchText = search.searchText;
                    const searches = document.createElement("a");
                    searches.href = host + '/property/' + search._id;
                    searches.appendChild(document.createTextNode(searchText));
                    searchContent.appendChild(searches);
                });
            }
        })
        .catch(err => {
            searchContent.innerHTML = "";
            console.log(err);
        })
}
searchBar.addEventListener("input", searchHendler);