var article = {
  headline: "",
  byline: "",
  preview: "",
  date: "",
  link: ""
};

var keyArr = [];
var keyUniqueArr = [];

function getArticles() {

  var searchTerm = stockInfo.name;
  var searchTermCall = "q=" + searchTerm;

  // recent(searchTerm, startYear, endYear);

  var sortCall = "&sort=newest";
  var keyCall = "&api-key=1f7c7f95b1c4310e875bb121e74ccb33:15:74629295";

  var urlBase = "http://api.nytimes.com/svc/search/v2/articlesearch.json?";
  var urlFinal = urlBase + searchTermCall + sortCall + keyCall;

  // Clear keyword arrays
  keyArr = [];
  keyUniqueArr = [];
  
  $.ajax({url: urlFinal, method: 'GET'}).done(function(response) {

    // console.log(urlFinal);
    console.log(response);

    var limit = 5; 

    for (var i = 0; i < limit; i++) {

      article.headline = response.response.docs[i].headline.main;
      // console.log(article.headline);

      var bylineCheck = response.response.docs[i].byline;
      // console.log(bylineCheck);
      
      if(bylineCheck == null){
        article.byline="";
      }else if(bylineCheck !== null){
        article.byline = response.response.docs[i].byline.original;
      }
      
      //console.log(article.byline);

      article.preview = response.response.docs[i].snippet;
      // console.log("preview: " + article.preview);

      article.datebef = response.response.docs[i].pub_date;
      article.date = moment(article.datebef).format('MMMM D, YYYY');
      // console.log(article.date);

      article.link = response.response.docs[i].web_url;
      // console.log(article.link);

      // Compiling keywords
      for (var j = 0; j < response.response.docs[i].keywords.length; j++) {

        var keyword = response.response.docs[i].keywords[j].value;
        // console.log(keyword);

        keyArr.push(keyword);

        // Check if existing keyword
        $.each(keyArr, function(i, el) {
          if ($.inArray(el, keyUniqueArr) === -1) {
            keyUniqueArr.push(el);
          }
        });
      };
      // Append articles to div  
      displayArticles();
    };
    // Append keywords to div
    console.log(keyUniqueArr);
    displayKeywords();
  });
};

// var ARRR = new Firebase("group-finance.firebaseIO.com");

// function recent(var1, var2, var3){
// 	ARRR.push({searchterm: var1, startYear: var2, endYear: var3})
// }

//   var recentcard = $("<div class='card article-card z-depth-3'>");
//   var recenttitle = $("<span class='card-title keytitle'> Recent Searches </span>");
//   var recentinside = $("<div class='card-content black-text rectext'>");
//   recentinside.append(recenttitle);

// ARRR.on("child_added", function(snapshot){
// function test() {
//   alert("Yoo");
// }
// 	var info = snapshot.val();
// 	var search = "<a href='javascript:void(0)' onclick='test()'>" + info.searchterm + "</a>";

//   recentinside.append("<br>" + search);
//   recentcard.append(recentinside);
//   $("#recent").append(recentcard);
// });

// $(".clickable-row").click(function() {
// 	search();
// });

// $("#ClearButton").click(function(){
// 	$(".results").empty();  
// });


function displayArticles() {
  var div = $('<div>').addClass('card article-card');
  var divinside = $('<div>').addClass('card-content');
  var divaction = $('<div>').addClass('card-action');

  var contentHeadline = $('<span>').addClass('card-title');
  contentHeadline.text(article.headline);

  var contentByline = $('<p>').addClass('article-author');
  contentByline.text(article.byline);

  var contentSection = $('<p>').addClass('article-text');
  contentSection.text(article.preview);

  var contentDate = $('<p>').attr('id','article-date');
  contentDate.text(article.date);

  var contentLink = $("<a href = " + article.link + " + " + "target='_blank'>Read More</a>");

  div.append(divinside).append(divaction);
  divinside
    .append(contentDate)
    .append(contentHeadline)
    .append(contentByline)
    .append(contentSection)
    ;
  divaction.append(contentLink);

  $('#articles').append(div);
};

function displayKeywords() {
  var limit = 6;
  for (i = 0; i < keyUniqueArr.length; i++) {
    if (i < limit) {
      var keywordTag = $('<div>').addClass('chip truncate');
      keywordTag.text(keyUniqueArr[i].toString());
      $('#keywords').append(keywordTag);
    };
  };
};