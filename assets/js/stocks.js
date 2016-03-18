$(document).ready(function(){

  // Declare object to contain stock info
  var stockInfo = {
    input: "",
    name: "",
    symbol: "",
    exchange: "",
    timestamp: "",
    price: "",
    change: "",
    changePercent: ""
  };


  $('#find').click(function() {

    $('.callStatus').text("");
    $('.stockInfo').children('div').html("");

    // Get user string input
    stockInfo.input = $('#inputName').val().trim();

    // Clear input
    $('input').val("");
    $('.callStatus').text(" ");

    // Start API call
    getSymbol();
    
  });
  
  function getSymbol() {

    $.ajax({
      url: "http://d.yimg.com/aq/autoc?query=" + stockInfo.input + "&region=US&lang=en-US", 

      // url: "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" + stockInfo.input, // why no work???

      method: 'GET',
      dataType : 'jsonp',
      crossdomain:true
    }).done(function(data) {

      console.log(data);

      if (data.ResultSet.Result.length <= 0) {
        console.log("fail, no company");
        $('.callStatus').text("No matches found for " + stockInfo.input + ".");

        displayInfo();

      } else {

        // Get and set values
        stockInfo.name = data.ResultSet.Result[0].name;
        stockInfo.symbol = data.ResultSet.Result[0].symbol;
        stockInfo.exchange = data.ResultSet.Result[0].exchDisp;

        // ignore: this is for the markit url
        // stockInfo.name = data[0].Name;
        // stockInfo.symbol = data[0].Symbol;
        // stockInfo.exchange = data[0].Exchange;

        // Use stock symbol to search for price
        getPrice();
      }
    });

  };

  function getPrice() {

    $.ajax({
      url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + stockInfo.symbol, 
      method: 'GET',
      dataType : 'jsonp',
      crossdomain: true,
    }).done(function(data) {

      console.log(data);

      if (data.Status !== "SUCCESS") {

        console.log("fail, no symbol");
        $('.callStatus').text("No matches found for " + stockInfo.input + ".");

      } else {

        // Format timestamp
        var time = moment(new Date(data.Timestamp));
        var userTimezone = moment.tz.guess();
        var convertedTime = moment.tz(time, userTimezone).format("MMM DD hh:mm z");
        
        // Format price change
        var price = (data.LastPrice).toFixed(2);
        var change = (data.Change).toFixed(2);
        var changePercent = (data.ChangePercent).toFixed(2);

        if (change < 0) {

          var arrowDn = $('<span>').html('<i class="material-icons">arrow_downward</i>');
          $('.stockChange').prepend(arrowDn);

          $('.stockChange').css('color','red');

        } else {

          var arrowUp = $('<span>').html('<i class="material-icons">arrow_upward</i>');
          $('.stockChange').prepend(arrowUp);

          $('.stockChange').css('color','green');

        }

        if (changePercent < 0) {
          $('.stockChangePercent').css('color','red');
        } else {
          $('.stockChangePercent').css('color','green');
        }

        // Reset variables
        stockInfo.timestamp = convertedTime;
        stockInfo.price = price;
        stockInfo.change = change;
        stockInfo.changePercent = changePercent;

        // Display to divs
        displayInfo();
      }
    });
  };

  function displayInfo() {
    $('.stockName').text(stockInfo.name);
    $('.stockSymbol').text(stockInfo.symbol);
    $('.stockExchange').text(stockInfo.exchange);
    $('.stockTimestamp').text(stockInfo.timestamp);
    $('.stockPrice').text(stockInfo.price);

    $('.stockChange').append(stockInfo.change);
    $('.stockChangePercent').append(stockInfo.changePercent);
  };

}); // ready wrap end