/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var crypto	=	require('crypto');
var LIQPAY_PUBLIC_KEY='i35861453470';
var LIQPAY_PRIVATE_KEY='rs8xoI12vLkvozN2IaXqBKADS1WgCTeSYP1JYXfe';

function base64(str){
    return new Buffer(str).toString('base64');
}

function sha1(string){
    var sha1=crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", JSON.stringify(order_info));
    var description=
        "Замовлення піци: "+order_info.name+"\n" +
        "Адреса доставки: "+order_info.address+"\n" +
        "Телефон: "+order_info.phone+"\n" +
        "Замовлення:\n"+order_info.pizza ;
        var order	=	{
            version:	3,
            public_key:	LIQPAY_PUBLIC_KEY,
            action:	"pay",
            amount:	order_info.cost,
            currency:	"UAH",
            description:description,
            order_id:	Math.random(),
            //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
            sandbox:	1
            };
    var data=base64(JSON.stringify(order));      
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    res.send({
        status: true,
        data:data,
        signature:signature
    });
};