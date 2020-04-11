var Templates = require('./Templates');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"

};
var map;
var point;
var directionsDisplay;
var newMarker;
var api = require('./API');
//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
//HTML едемент куди будуть додаватися піци
var $cart = $("#cart2");
initialiseCart();
google.maps.event.addDomListener(window,	 'load',	initialize);
function initialiseCart() {
    if (window.localStorage.getItem('cartArray'))
        Cart = JSON.parse(window.localStorage.getItem('cartArray'));
    else
        Cart = [];

    updateCart();
}

function updateCart() {
    window.localStorage.setItem('cartArray', JSON.stringify(Cart));
    $cart.html("");
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCartOrder_OneItem(cart_item);
        var $node = $(html_code);

        $cart.append($node);
    }

    function orderSum() {
        var orderSum = 0;
        Cart.forEach(function(pizza) {
            orderSum += pizza.pizza[pizza.size].price * pizza.quantity;
        });
        return orderSum;
    }


    Cart.forEach(showOnePizzaInCart);
    $("#money").text(orderSum());
    $('#pizza_qty').text(Cart.length);
}

function checkPhone() {

    if ((!/^[+]?(38)?([0-9]{10})$/.test($("#inputPhone").val()) && (!/^0?([0-9]{9})$/.test($("#inputPhone").val())))) {
        $(".phone-group").removeClass("has-success").addClass("has-error");
        $(".phone-group").find(".help-block").css("display", "inline-block");
        return false;
    } else {
        $(".phone-group").removeClass("has-error").addClass("has-success");
        $(".phone-group").find(".help-block").css("display", "none");
        return true;
    }
}

function checkWord() {
    if (!/^[A-Za-z-А-Яа-я]+$/.test($("#inputName").val())) {

        $(".name-group").removeClass("has-success").addClass("has-error");
        $(".name-group").find(".help-block").css("display", "inline-block");
        return false;
    } else {
        $(".name-group").removeClass("has-error").addClass("has-success");
        $(".name-group").find(".help-block").css("display", "none");
        return true;
    }
}
function checkAddress(){
    geocodeAddress($("#inputAddress").val(), function(err, data1){
        if(!err){
            if(newMarker)newMarker.setMap(null);
            newMarker	=	new	google.maps.Marker({
                position: data1,
                map: map,
                icon:"assets/images/home-icon.png"
            });
            calculateRoute(point, data1, function(err, data){
                if(!err){
                    $("#time").text(data.duration);
                }
                else console.log(err);
            })
            $(".address-group").removeClass("has-error").addClass("has-success");
            $(".address-group").find(".help-block").css("display", "none");
            $("#address").text($("#inputAddress").val());
            return true;
        }
        else{
            $(".address-group").removeClass("has-success").addClass("has-error");
            $(".address-group").find(".help-block").css("display", "inline-block");
            return false;
        }
    });
}
$(document).keyup(function(event) {
    if ($("#inputPhone").is(":focus") && event.key == "Enter") {
        checkPhone();
    }

    if ($("#inputName").is(":focus") && event.key == "Enter") {
        checkWord();
    }
    if ($("#inputAddress").is(":focus") && event.key == "Enter") {
        checkAddress();
    }
});

$("#forward").click(function() {
    if (checkWord() && checkPhone()&&checkAddress()) {
        api.createOrder({

            name: $("#inputName").val(),
            phone: $("#inputPhone").val(),
            address: $("#inputAddress").val(),
            order: Cart

        }, function(err, data) {
            if (err) {}
        });

    }
});
function initialize()	{
    directionsDisplay = new google.maps.DirectionsRenderer();
    //Тут починаємо працювати з картою
    var mapProp =	{
    center:	new	google.maps.LatLng(50.464379,30.519131),
    zoom:	11
    };
var html_element =	document.getElementById("googleMap");
map	=new google.maps.Map(html_element,	 mapProp);
    //Карта створена і показана
    directionsDisplay.setMap(map);
point	=	new	google.maps.LatLng(50.464379,30.519131);
var marker	=	new	google.maps.Marker({
position:	point,
map: map,
icon:"assets/images/map-icon.png"
});

function	geocodeLatLng(latlng,	 callback){
        //Модуль за роботу з адресою
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
        var adress =	results[1].formatted_address;
        callback(null,	adress);
        }	else	{
        callback(new	Error("Can't	find	adress"));
        }
        });
 }
google.maps.event.addListener(map,'click',function(me){
    var coordinates	=	me.latLng;
    geocodeLatLng(coordinates,	function(err,	adress){
    if(!err)	{
        $("#inputAddress").val(adress);
        $("#address").text(adress);
        if(newMarker)newMarker.setMap(null);
                newMarker	=	new	google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon:"assets/images/home-icon.png"
                });
                calculateRoute(point, coordinates, function(err, data){
                    if(!err){
                        $("#time").text(data.duration);
                    }
                    else console.log(err);
                })
    }	else	{
    console.log(err)
    }
    })
});  
}
function geocodeAddress(address, callback)	{
    var geocoder=new	google.maps.Geocoder();
    geocoder.geocode({'address':address},function(results,	status)	{
    if(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
    var coordinates	=results[0].geometry.location;
    callback(null,	coordinates);
    }else{
    callback(new	Error("Can	not	find	the	adress"));
    }
  });
}
function calculateRoute(A_latlng,	 B_latlng,	callback) {
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    }, function(response,	status)	{
        if	(status	==	google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions({
                suppressMarkers: true,
                preserveViewport: true
              });
            var leg	=	response.routes[0].legs[0];
            callback(null,	{
                route: response,
                duration:	leg.duration.text
            });
        }	else	{
            callback(new	Error("Can't find direction"));
        }
    });
}

 
