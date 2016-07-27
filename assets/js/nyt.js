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
    // console.log(response);

    var limit = 5; 

    for (var i = 0; i < limit; i++) {

      // check to see if article data exists in the response object
      var entireArticle = response.response.docs[i];
      if(entireArticle == null || entireArticle == undefined){
        article = {
          headline: "",
          byline: "",
          preview: "",
          date: "",
          link: ""
        };
      }else{

        // headline and byline checks to see if content exists in the object
        var headlineCheck = response.response.docs[i].headline;
        // console.log(headlineCheck);

        var bylineCheck = response.response.docs[i].byline;
        // console.log(bylineCheck);

        if(headlineCheck == null){
          article.headline = "";
        }else{
          article.headline = response.response.docs[i].headline.main;
          // console.log(article.headline);
        }
        
        if(bylineCheck == null){
          article.byline = "";
        }else{
          article.byline = response.response.docs[i].byline.original;
          // console.log(article.byline);
        }
        
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
      }

    };
    // Append keywords to div
    // console.log(keyUniqueArr);
    displayKeywords();
  });
  $(".bro").empty();
  firebase();
};

function displayArticles() {
  var div = $('<div>').addClass('card article-card');
  var divinside = $('<div>').addClass('card-content');
  var divaction = $('<div>').addClass('card-action');

  var contentHeadline = $('<span>').addClass('card-title');
  contentHeadline.text(article.headline);

  var contentByline = $('<p>').addClass('article-byline');
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
  $('.article-card').animate({opacity: 0.95}, 500);
  $('.page-footer').animate({opacity: 1.0}, 500);

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