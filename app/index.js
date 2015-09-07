!function(config) {
  'use strict';
  $.support.cors = true;

  var constant = {};
  var gui = {
    "grid" : $('.grid'),
    "main" : $('#main')
  }

  var Utils = {
    getGeoLocation: function() {
      function showPosition(position) {
        /*var location = {
          "lat" : position.coords.latitude,
          "lng" : position.coords.longitude
        }*/
        constant.lat=position.coords.latitude;
        constant.lng=position.coords.longitude;
        console.log("Constant = "+JSON.stringify(constant));
        // DOT IT IN A PROPER WAY!
        Controller();
      }
      navigator.geolocation.getCurrentPosition(showPosition);
    },
    initGrid: function() {
      var $grid = gui.grid.masonry({
        // options...
      });
      gui.grid.masonry('layout');
      console.log("Grid edited");
    },
    getAcessToken: function() {
      var hash = window.location.hash.substring(1);
      var hashArray = hash.split("=");
      var accessToken = hashArray[1];
      //var accessToken = "1440552386.962b453.44bd0e0e7e9241319476d6ac5a324317";
      if(!accessToken) {
        window.location = "https://instagram.com/oauth/authorize/?client_id="+
          config.clientId+
          "&redirect_uri="+
          config.redirectUrl+
          "&response_type=token";
      } else {
        //alert(accessToken);
        return accessToken;
      }
    }
  }

  var Controller = function(){
    var accessToken = Utils.getAcessToken();
    var json = {
      "lat"         : constant.lat,
      "lng"         : constant.lng,
      "access_token": accessToken
    };
    $.ajax({
      url     : "https://api.instagram.com/v1/locations/search",
      data    : json,
      success : function( data ) {
        //console.log(data.data);
        $.each(data.data, function(index, value) {
          SearchMediaByLocationId(value.id);
        });
    	},
      dataType: "jsonp"
    });
  }

  var SearchMediaByLocationId = function(locationId) {
    var accessToken = Utils.getAcessToken();
    console.log("Search Media for" + locationId);
    var json = {
      "access_token": accessToken
    };
    $.ajax({
      url     :
        "https://api.instagram.com/v1/locations/"+
        locationId+
        "/media/recent",
      data    : json,
      success : function( data ) {
        //console.log(data.data);
        $.each(data.data, function(index, value) {
          PostPictureOnTheThiverWall(value);
        });
    	},
      dataType: "jsonp"
    });
  }

  var PostPictureOnTheThiverWall = function(picture) {
    console.log(picture);
    var div = $("<div>", {class: "grid-item"});
    var img = $('<img alt="'+picture.caption.text+'">');
    img.attr('src', picture.images.low_resolution.url);
    img.appendTo(div);
    div.appendTo(gui.main);
  }

  Utils.getGeoLocation();
  //Utils.init();
  setTimeout(function() { Utils.initGrid(); }, 3000);

}(config);
