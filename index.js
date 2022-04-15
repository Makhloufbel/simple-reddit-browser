import reddit from "./redditapi.js";

const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const loadMore = document.querySelector("[data-load]");

searchForm.addEventListener("submit", (e) => {
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  const searchLimit = document.getElementById("limit").value;
  //console.log(searchLimit);
  const searchTerm = searchInput.value;
  if (searchTerm == "") {
    showMessage("Please add a search term", "alert-danger");
  }
  document.title = `r/${searchTerm}`
  // Search Reddit
  rSearch(searchTerm, searchLimit, sortBy);

  e.preventDefault();
});
loadMore.addEventListener("click", (e) => load(e));

function rSearch(searchTerm, searchLimit, sortBy) {
  reddit.search(searchTerm, searchLimit, sortBy).then((results) => {
    let output = '<div class="card-columns">';
    //console.log(results);
    results.forEach((post) => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";

        var converter = new showdown.Converter();
        var md = post.selftext;
        let text = converter.makeHtml(md);
        //console.log(text)
      output += `
        <div class="card mb-2">
        <img class="card-img-top" src="${image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${text}</p>
          <a href="${post.url}" target="_blank
          " class="btn btn-primary card-btn">Read More</a>
          <hr>
          <span class="badge badge-secondary">Subreddit: ${
            post.subreddit
          }</span> 
          <span class="badge badge-dark">Score: ${post.score}</span>
        </div>
      </div>
        `;
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
    loadMore.classList.remove("hidden");
  });
}

function rLoadMore(searchTerm, searchLimit, sortBy) {
  reddit.LoadMore(searchTerm, searchLimit, sortBy).then((results) => {
    //console.log(results);
    let divs = [];
    results.forEach((post) => {
      // Check for image
      //console.log(post.selftext)
      let image = post.preview? post.preview.images[0].source.url: "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
        var converter = new showdown.Converter();
        var md = post.selftext;
        let text = converter.makeHtml(md);
      let output = '<img class="card-img-top" ';
      output += `
          src="${image}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${text}</p>
            <a href="${post.url}" target="_blank
            " class="btn btn-primary card-btn">Read More</a>
            <hr>
            <span class="badge badge-secondary ">Subreddit: ${
              post.subreddit
            }</span> 
            <span class="badge badge-dark">Score: ${post.score}</span>
          </div>
          `;
      let div = document.createElement("div");
      div.innerHTML = output;
      divs.push(div);
    });
    //console.log(divs);
    divs.forEach((div) => {
      div.className += "card mb-2";
      let isfound = [
        ...document.querySelectorAll("div.card-columns > div"),
      ].some((e) => {
        return e == div;
      });
      console.log(isfound);
      if (!isfound) document.querySelector("div.card-columns").appendChild(div);
    });
    // let div = document.createElement("div");
    // div.classList.add("card mb-2");
    // div.innerHTML= output;
  });
}

function load(e) {
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  const searchLimit = document.getElementById("limit").value;
  const searchTerm = searchInput.value;

  if (searchTerm == "") {
    showMessage("Please add a search term", "alert-danger");
  }

  // Search Reddit
  rLoadMore(searchTerm, searchLimit, sortBy);

  //if (e !== undefined) e.preventDefault();console.log(e);
}
const delay = 500; // anti-rebound for 500ms
let lastExecution = 0;

const infinity = function (e) {
  if (lastExecution + delay < Date.now()) {
    if (
      window.pageYOffset + window.innerHeight >
      document.body.offsetHeight - 3000
    ) {
      load();
      console.log("loaded");
    }
    lastExecution = Date.now();
  }
};

window.onscroll = infinity;

function showMessage(message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById("search-container");
  // Get form
  const search = document.getElementById("search");

  // Insert alert
  searchContainer.insertBefore(div, search);

  // Timeout after 3 sec
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
}

function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
