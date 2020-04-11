var Templates = require('./Templates');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"

};
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

$(document).keyup(function(event) {
    if ($("#inputPhone").is(":focus") && event.key == "Enter") {
        checkPhone();
    }

    if ($("#inputName").is(":focus") && event.key == "Enter") {
        checkWord();
    }
});

$("#forward").click(function() {
    if (checkWord() && checkPhone()) {
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
function	initialize()	{
    //Тут починаємо працювати з картою
    var mapProp =	{
    center:	new	google.maps.LatLng(50.464379,30.519131),
    zoom:	11
    };
    var html_element =	document.getElementById("googleMap");
    var map	=	new	google.maps.Map(html_element,	 mapProp);
    //Карта створена і показана
    var point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
    position:	point,
    map: map,
    icon:"assets/images/map-icon.png"
    });
    google.maps.event.addListener(map,	
        'click',function(me){
        var coordinates	=	me.latLng;

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
 google.maps.event.addListener(map,	
    'click',function(me){
    var coordinates	=	me.latLng;
    geocodeLatLng(coordinates,	function(err,	adress){
    if(!err)	{
    //Дізналися адресу
    console.log(adress);
    }	else	{
    console.log("Немає адреси")
    }
    })
    });
    function	geocodeAddress(adress,	 callback)	{
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
        var coordinates	=	results[0].geometry.location;
        callback(null,	coordinates);
        }	else	{
        callback(new	Error("Can	not	find	the	adress"));
        }
        });
        }    
}
function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
    origin:	A_latlng,
    destination:	B_latlng,
    travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
    if	(	status	==	google.maps.DirectionsStatus.OK )	{
    varleg	=	response.routes[	0	].legs[	0	];
    callback(null,	{
    duration:	leg.duration
    });
    }	else	{
    callback(new	Error("Can'	not	find	direction"));
    }
    });
    } 
 
