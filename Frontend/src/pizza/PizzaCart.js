/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"

};
//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    var inCart = Cart.find(function(item) {
        return (item.pizza === pizza && item.size === size);
    });

    if (inCart) {
        inCart.quantity++;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1

        });
    }
    updateCart();
}

function removeFromCart(cart_item) {
    Cart.splice(Cart.indexOf(cart_item), 1);
    var n = parseInt($("#pizza_qty").text(), 10);

    updateCart();
}

function initialiseCart() {
    $("#clear").click(function() {
        clearCart();
    });
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    if (window.localStorage.getItem('cartArray'))
        Cart = JSON.parse(window.localStorage.getItem('cartArray'));
    else
        Cart = [];

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function clearCart() {
    Cart.length = 0;
    updateCart();

}


function updateCart() {
    window.localStorage.setItem('cartArray', JSON.stringify(Cart));
    $cart.html("");
    var qty = 0;
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find("#plus").click(function() {

            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            qty++;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find("#cross").click(function() {
            removeFromCart(cart_item);
            updateCart();
        });
        $node.find("#minus").click(function() {
            cart_item.quantity--;
            var n = parseInt($("#pizza_qty").text(), 10);
            if (cart_item.quantity < 1)
                removeFromCart(cart_item);


            updateCart();
        });
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

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;