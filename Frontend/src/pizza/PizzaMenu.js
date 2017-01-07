/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-button-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-button-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if (filter=='all' || !filter) {
        showPizzaList(Pizza_List);
        $('.pizzas-displayed').text(Pizza_List.length);
        return;
    }

    Pizza_List.forEach(function(pizza){
        if (pizza.content[filter] || pizza.type == filter) {
            pizza_shown.push(pizza);
        }
    });

    $('.pizzas-displayed').text(pizza_shown.length);

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

$('#filter-all').click(function() {
    makeActive('#filter-all');
    filterPizza('all');
    $(this).addClass('active');
});

$('#filter-meat').click(function() {
    makeActive('#filter-meat');
    filterPizza('meat');
    $(this).addClass('active');
});

$('#filter-pineapple').click(function() {
    makeActive('#filter-pineapple');
    filterPizza('pineapple');
    $(this).addClass('active');
});

$('#filter-mushrooms').click(function() {
    makeActive('#filter-mushrooms');
    filterPizza('mushroom');
    $(this).addClass('active');
});

$('#filter-seafood').click(function() {
    makeActive('#filter-seafood');
    filterPizza('ocean');
    $(this).addClass('active');
});

$('#filter-vega').click(function() {
    makeActive('#filter-vega');
    filterPizza('Вега піца');
    $(this).addClass('active');
});

function makeActive() {
    $('.all-pizza-types-wrapper').find('.active').removeClass('active');
}



function initialiseMenu() {
    //Показуємо усі піци
    filterPizza('all');
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;