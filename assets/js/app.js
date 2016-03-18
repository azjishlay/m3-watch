$(document).ready(function(){

$("#search").click(function search(){
	
	  var searchTerm = $("#searchterm").val();
    var searchTermCall = "q=" + searchTerm;

    var limit = $("#limit").val();

    var startYear = $("#startYear").val();
    var startYear = "1994";
    var startYearCall = "&begin_date=" + startYear + "0000";

    var endYear = "2016";
    //var endMonth = 03;
    var endYearCall = "&end_date=" + endYear + "0000";

    recent(searchTerm, startYear, endYear);

    if (startYear == "") {
      startYearCall = "";
    }

    if (endYear == "") {
      endYearCall = "";
    }

    if (limit == "") {
      limit = 5; // default
    }

    var key = "1f7c7f95b1c4310e875bb121e74ccb33:15:74629295";
    var keyCall = "&api-key=" + key;

    var urlBase = "http://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var urlFinal = urlBase + searchTermCall + startYearCall + endYearCall + keyCall;

    var result = {
      number: "",
      headline: "",
      byline: "",
      section: "",
      date: "",
      link: ""
    }
    
    var keyarr = [];
    
    function displayResult() {
      
      var div = $("<div class='well artwell'>");
      var keydiv = $("<div class='well artwell'>");

      var spanNumber = $('<span>');
      spanNumber.addClass('label label-primary');
      spanNumber.text(result.number);

      var header = $("<h3 class='nytext'>");
      header.text(result.headline);

      var contentByline = $("<p class='nytext'>");
      contentByline.text(result.byline);

      var contentSection = $("<p class='nytext'>");
      contentSection.text(result.section);

      var contentDate = $("<p class='nytext'>");
      contentDate.text(result.date);

      var contentLink = $("<p class='nytext'>");
      contentLink.text(result.link)

      div.append(spanNumber).append(header).append(contentByline).append(contentSection).append(contentDate).append(contentLink);

      $('#results').append(div);
      $('#recent').animate({opacity: 0.85});

    }

    function displayKey() {

      var contentKeyword = $("<h4 class='nytext'>");
      contentKeyword.text(keyarr.toString());

      $('#sidebar').animate({opacity: 0.85});
      $('#sidebar').append(contentKeyword);

    }

    function apiCall() {

      $.ajax({url: urlFinal, method: 'GET'}).done(function(response) {

        console.log(urlFinal);
        console.log(response);

        limit = 5; 
          for (var i = 0; i < limit; i++) {

            result.number = i + 1;
            console.log(result.number);

            result.headline = response.response.docs[i].headline.main;
            console.log(result.headline);

            result.byline = response.response.docs[i].byline.original;
            console.log(result.byline);

            result.section = response.response.docs[i].section_name;
            console.log("Section: " + result.section);

            result.date = response.response.docs[i].pub_date;
            console.log(result.date);

            result.link = response.response.docs[i].web_url;
            console.log(result.link);

            for (var j = 0; j < response.response.docs[i].keywords.length; j++) {
              
              result.keyword = response.response.docs[i].keywords[j].value;
              console.log(result.keyword);
              keyarr.push(result.keyword);
              console.log(keyarr);

            }
            displayResult();
          }
          displayKey();
      });
    }

    apiCall();
});

    var ARRR = new Firebase("group-finance.firebaseIO.com");

    function recent(var1, var2, var3){
    	ARRR.push({searchterm: var1, startYear: var2, endYear: var3})
    }

    ARRR.on("child_added", function(snapshot){

    	var newRow = snapshot.val();
    	var search = newRow.searchterm;
    	var start = newRow.startYear;
    	var end = newRow.endYear;

    	$("#searchTable").append("<tr class='clickable-row' ><td id='newSearch'>" + search + "</td><td>" + start + "</td><td>" + end + "</td></tr>")
    });

$(".clickable-row").click(function() {
	search();
});

$("#ClearButton").click(function(){
	$(".results").empty();  
});

})