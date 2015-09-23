$(document).ready(function() {
  var keywords = []
  var tweet = ""
  var first_visit = true


  $("#keyword-search-container").hide();

  var tweets = new TweetsCollection();
  var tweetsView = new TweetsView({ collection: tweets });

  var emptyContainers = function() {
    $('#target-container').find('*').not('.type-text-left').remove();
    $('#primary-container').find('*').not('.type-text-right').remove();
    $('#secondary-container').find('*').not('.type-text-left').remove();
    $('#tertiary-container').find('*').not('.type-text-right').remove();
  };

  $("#keyword-search-container").hide();

  $("form").on("submit", function(event) {
    event.preventDefault();

    $("#pointer-arrow").fadeOut("slow");
    $("#one-degree-drawing-container").fadeOut("slow");
    emptyContainers();

    $("#tweets-container").empty();
    $("#welcome-container").fadeOut("slow");
    $("#top-container").animate({ height: "250" }, 2500);

    var twitterHandle = $("#search-bar").val();

    tweets.fetch({
      reset: true,
      data: $.param({ handle: twitterHandle })
    });
    $("#search-results-container").empty();
    if (first_visit === true) {
      var searchExplanation = "<h1>what does brumbiki do for me?</h1><h3>1. it helps you become a connector</h3><p>Go ahead and click the centered button above to view some important connections with your contact. You'll find new people, plus maybe some you already know, to follow or include in a conversation with your contact!</p><h3>2. it finds new content to send your contact</h3><p>On the left is a list of recent links your contact has posted on Twitter. Links are a great way to tell what s/he cares about.</p><p>Click on a few  <input class='keyword' type='button' value='red keywords'> and relevant search results will appear for a given tweet. You can tweet these links straight to your contact or reply to their original tweet. Try stacking keywords to perform a targeted search and you'll get the most from this!</p>"
      $("#search-results-container").append(searchExplanation)
    } else {
      // do nothing
    }
    first_visit = false;
  });

 function toggleKeyword(keywordButton) {
  if($(keywordButton).closest(".tweet")[0] != tweet[0]){
      keywords = []
      $(".keyword").removeClass("active-keyword")
      $("#keyword-container").empty();
    }
  };

  function removeKeyword(keywordButton) {
    tweet = $(keywordButton).closest(".tweet")
      var value = $(keywordButton).val();
      if(keywords.indexOf(value) > -1){
        var index = keywords.indexOf(value);
        keywords.splice(index, 1)
        $(keywordButton).removeClass("active-keyword")
        if(keywords.length === 0 || keywords.first === ""){
        $("#search-results-container").empty();
      }
      } else {
        $(keywordButton).addClass("active-keyword");
        keywords.push(value);
      }
    };

  $("#tweets-container").on("click", ".keyword", function(event){
      event.preventDefault();
    var twitterHandle = $("#search-bar").val();
    toggleKeyword(this)
    removeKeyword(this)
    var query = keywords.join(' ')
    var results = new SearchResultsCollection();
    var resultsCollectionView = new SearchResultsView({ collection: results});
    if (query.length > 0){
      results.fetch({
          reset: true,
          data: $.param({ query: query, handle: twitterHandle })
      });
    };
  });

  $("#tweets-container").on("click", ".keyword", function(event){
    event.preventDefault();

    var text = $(this).val()
    if($(this).hasClass("active-keyword")){
    var text = $(this).val()
    $("#keyword-container").append("<input class='keyword-tracker' type='submit' value="+ text +">")
    }
    else{
      $('.keyword-tracker').filter(function() {
        return $(this).val() === text;
      }).css("display", "none");
    }
  });

  $("body").on("click", ".keyword-tracker", function(event){
      event.preventDefault();
      var twitterHandle = $("#search-bar").val();
      $(this).remove();
      var text = $(this).val()
      $('.keyword').filter(function() {
        return $(this).val() === text;
      }).removeClass("active-keyword");
      removeKeyword(this)
      var query = keywords.join(' ')
      var results = new SearchResultsCollection();
      var resultsCollectionView = new SearchResultsView({ collection: results});
      if (query.length > 0){
      results.fetch({
          reset: true,
          data: $.param({ query: query, handle: twitterHandle })
      });
    };
  });

  $("#one-degree-button").on("click", function(event) {
    event.preventDefault();

    $("#one-degree-button-container").fadeOut("slow");
    $("#top-container").animate({ height: "500" }, 1000);

    var twitterUsers = new TwitterUsersCollection();
    var twitterUsersView = new TwitterUsersView({ collection: twitterUsers });

    twitterUsers.fetch({
      reset: true
    });
  })

  $("#tweets-container").delegate(".keyword", "mouseover", function(event) {
    event.preventDefault();
    $(this).toggleClass("active-keyword-lite", 300);
  }).delegate(".keyword", "mouseout", function(){
    $(this).toggleClass("active-keyword-lite", 300);
  });

  $("#minimize-button").on("click", function(event) {
    event.preventDefault();

    $("#one-degree-drawing-container").hide();
    emptyContainers();

    $("#top-container").animate({ height: "250" }, 2500);
    $("#one-degree-button-container").fadeIn("slow")
  });

  // $("#tertiary-container").on("mouseenter", ".twitter-user", function(event){
  //   event.preventDefault();
  //   $(this).find("#twitter-user-description").css("display", "inline-block")
  // })
  //
  // $("#tertiary-container").on("mouseleave", ".twitter-user", function(event){
  //   event.preventDefault();
  //   $(this).find("#twitter-user-description").css("display", "none")
  // })
  //
  //  $("#tertiary-container").on("click", ".profile-circles", function(event){
  //   event.preventDefault()
  //   $(".twitter-user").draggable();
  // })

});
