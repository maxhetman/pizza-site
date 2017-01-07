/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../storage/storage');

var saved_orders = Storage.get('cart');


//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var Cart;
if (saved_orders) {
    Cart = saved_orders;
} else { 
    Cart = [];
}

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

$('.button-order').click(function() {
    window.location.href = '/order.html'
})
function addToCart(pizza, size) {
    var existed = false;
    //Додавання однієї піци в кошик покупок
    $.each(Cart, function(i){
        if(Cart[i].pizza.title === pizza.title && Cart[i].size === size) {
            Cart[i].quantity+=1;
            existed = true;
            return false;
        }
    });    
    if (!existed) {
    Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

$('.clear-order-label').click(function() {
    Cart = [];
    updateCart();
})

function removeFromCart(cart_item) {
    $.each(Cart, function(i){
        if(Cart[i].pizza.title === cart_item.pizza.title && Cart[i].size === cart_item.size) {
            Cart.splice(i,1);
            return false;
        }
    });
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function computeSum() {
    var result = 0;
    var current;
    for(var i = 0; i < Cart.length; i++) {
        current = Cart[i];
        result+= current.pizza[current.size].price*current.quantity;
    }
    return result;
}
function updateOrderState() {
    var pizzaAmount = Cart.length;
    if (pizzaAmount) {
        $('.no-order-text').hide();
        $('.order-sum').text('Сума замовлення - ' + computeSum() + ' грн');
        $('#number_of_pizza').text(pizzaAmount);
        $('.button-order').prop('disabled', false);
    } else {
        var no_order_text = '<div class="no-order-text">Пусто в холодильнику?<br/ >Замовте піцу!</div>';
        $('.order-sum').text('');
        $('#cart').html(no_order_text);
        $('#number_of_pizza').text(0);
        $('.button-order').prop('disabled', true);
    }
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.set('cart', Cart);
    //Очищаємо старі піци в кошику
    $cart.html("");

    updateOrderState();
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem({cart_item: cart_item});

        var $node = $(html_code);

        $node.find(".btn-plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".btn-minus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            if (cart_item.quantity == 0) {
                removeFromCart(cart_item);
            }
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;