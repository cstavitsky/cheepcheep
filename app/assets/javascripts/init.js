$(document).ready(function() {

  $("#search-button").on("submit", function(event) {
    event.preventDefault();

    var twitterHandle = $("#search-bar").val();
    var tweets = new TweetsCollection();
    var input = {handle: twitterHandle};

    tweets.fetch({ data: $.param(input) });

    // $.ajax({
    //   method: "GET",
    //   url: "/tweets",
    //   data: input
    // })
    // .done(function(response) {
    //   response.forEach(function(tweet) {
    //     var jstweet = new Tweet(tweet);
    //     tweets.add(jstweet)
    //   })
    // })
  });

});
