let auther;
export default {
  search: function (searchTerm, searchLimit, sortBy) {
      console.log(
        `http://www.reddit.com/r/${searchTerm}/${sortBy}/.json?limit=${searchLimit}`
      );
      return fetch(
        `http://www.reddit.com/r/${searchTerm}/${sortBy}/.json?limit=${searchLimit}`
      )
        .then((res) => res.json())
        .then((data) => {
          auther = data.data.after;
          return data.data.children.map((data) => data.data);
        })
        .catch((err) => console.log(err));
    
  },
  LoadMore: function(searchTerm, searchLimit, sortBy){
    console.log(
      `http://www.reddit.com/r/${searchTerm}/${sortBy}/.json?limit=${searchLimit}&after=${auther}`
    );
    return fetch(
      `http://www.reddit.com/r/${searchTerm}/${sortBy}/.json?limit=${searchLimit}&after=${auther}`
    )
      .then((res) => res.json())
      .then((data) => {
        auther = data.data.after;
        return data.data.children.map((data) => data.data);
      });

  }
};
