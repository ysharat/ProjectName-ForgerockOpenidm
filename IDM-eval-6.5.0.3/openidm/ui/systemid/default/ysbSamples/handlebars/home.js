define(['jquery'], function($) {
    $('#foo').text('[changed by jquery]');
    var Methods ={
        doSomething: function(test){
            alert("i just did something"+test)
        },
        test:'here one'
    };
    return Methods;
});

