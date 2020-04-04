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