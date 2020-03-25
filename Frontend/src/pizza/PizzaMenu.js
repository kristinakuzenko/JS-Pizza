/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var Pizza_Filter = require('../Pizza_Filter');
//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $pizza_filter = $("#pizza_filter");


function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({ pizza: pizza });

        var $node = $(html_code);

        $node.find("#buy-big").click(function() {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find("#buy-small").click(function() {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function showPizzaFilter(list) {
    $pizza_filter.html("");

    function showOneFilter(pf1) {
        var html_code = Templates.PizzaType({ pizza_type: pf1 });
        var $node = $(html_code);
        if (pf1.id == 1) {
            $node.find("#ptype").addClass("active")
        }
        $node.find("#ptype").click(function() {
            $(".top-menu-button").removeClass("active");
            $node.find("#ptype").addClass("active");
            filterPizza(pf1);
        });
        $pizza_filter.append($node);
    }

    list.forEach(showOneFilter);
}

function filterPizza(filter) {
    if (filter.id == 1) {
        showPizzaList(Pizza_List)
    } else {
        //Масив куди потраплять піци які треба показати
        var pizza_shown = [];

        Pizza_List.forEach(function(pizza) {
            if (pizza.filter.includes(filter.id)) {
                pizza_shown.push(pizza);
            }
            //Якщо піка відповідає фільтру
            //pizza_shown.push(pizza);

            //TODO: зробити фільтри
        });

        //Показати відфільтровані піци
        showPizzaList(pizza_shown);
    }
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaFilter(Pizza_Filter),
        showPizzaList(Pizza_List)
}
$("#enter").click(function() {

});
exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;