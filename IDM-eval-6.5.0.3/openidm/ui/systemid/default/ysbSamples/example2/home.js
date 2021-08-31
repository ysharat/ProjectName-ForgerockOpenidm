define(['jquery','underscore','handlebars'], function($,underscore,handlebars) {
    $('#foo').text('[changed by jquery]');
    var Methods ={
        doSomething: function(test){
           // alert("i just did something"+test)
           console.log("coming here");
            
        },
        test:'here one1',
        test1: function(){
            console.log("here12");  
            $.ajax({
                cache: false,
                Orgin:"http://esfmylabfridm.mydmn.com:8080",

                type: 'GET',
                mode: "cors",
                xhrFields: {
                    withCredentials: true
                },
                url: '/openidm/system?_action=test',
                crossDomain: true,   
                headers: {
                    // accept: "application/json",
                    "Access-Control-Allow-Origin":"*"
                } ,           
                success:function(data){
                console.log(data)
                }
            
              });
        } 
    };
   


    return Methods;
});

