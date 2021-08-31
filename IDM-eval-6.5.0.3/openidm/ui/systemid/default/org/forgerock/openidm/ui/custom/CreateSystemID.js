define("org/forgerock/openidm/ui/custom/CreateSystemID", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractView",
    "org/forgerock/commons/ui/common/main/ValidatorsManager",
    "org/forgerock/openidm/ui/custom/TAIProxyManager",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/util/UIUtils"

], function ($, _, AbstractView, validators, TAIProxyManager) {
    console.log("inside systemidFolders CreateSystemIDJS1 ")
    var CreateSystemID = AbstractView.extend({


        template: "templates/systemID/createSystemIDTemplate.html",
        baseTemplate: "templates/common/MediumBaseTemplate.html",
        partials: [
            "partials/form/_basicInput.html",
            "partials/form/_basicSelect.html"
        ],
        events: {
            "change #input-realm": "displayRealmPartial",
            "change #input-tssType": "displayMainframePartial",
            "change #input-racfType": "displayRACFPartial",
            "change #input-ad_account_type": "displayRACFGroupPartial",
            "change #input-Type": function (e) {
                this.displayOwnerField(e);
                this.validategMSAName(e);
            },
            "onValidate": "onValidate",
            "customValidate": "customValidate"
        },
        initialize: function () {
            console.log("the simple el::" + this.el);
            console.log("the dollar el::" + this.$el);
            console.log("inside constructor initialize1");
            console.log("here12");
        },
        model: {},
        data: {},
        options: {
            cache: false,
            Orgin: "http://esfmylabfridm.mydmn.com:8080",

            type: 'GET',
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            url: 'https://jsonplaceholder.typicode.com/users1',
            crossDomain: true,
            headers: {
                // accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            }
            ,                       
            success:function(data,status,jqXhr){
                // console.log(data)
                // console.log("--------end of data---")
                // console.log(status)
                // console.log("-------end of status----")
                // console.log(jqXhr)
                // console.log("---end of jqxhr--------")
            },
            error: function (jqXhr, textStatus, errorMessage) { // error callback 
               //console.log('Error: ' + errorMessage);
               console.log('jqXhr: ' + JSON.stringify(jqXhr));
              // console.log('textStatus: ' + textStatus);
            }
        },
        render: function (args, callback) {


            // console.log("inside render2....."+_.bind(function(){
            //     console.log("coming here...1"+this);
            //     validators.bindValidators(this.$el,null,function(){
            //         console.log("coming here...2"+this);
            //         this.$("#divButtons").hide();
            //     }, this);
            // }, this));

            console.log("comming here 1.....calling ajax");
            var taiQueryPromise;
            taiQueryPromise=TAIProxyManager.taiQuery('sharath','test')
            .then(taiQueryPromise).then(function(data){
                console.log("$$$$$$$$$ data1 ==="+JSON.stringify(data));
            },function(jqXhr){
                console.log("$$$$$$$$$ jqXhr1==="+JSON.stringify(jqXhr));
            });
            
        

            console.log("==========================================");

            console.log("^^^^out value is ="+taiQueryPromise);
           // console.log("printing ajax output" + JSON.stringify(this.test(this.options)));
          var output2= JSON.stringify(this.ajaxYsb(this.options));
          console.log("comming here 2.1.....calling ajax");

        //  output2.success=function (data){
        //     console.log("comming here 3.....calling ajax");
        //      console.log(data)
        //  }
        //  output2.error=function (jqXhr, textStatus, errorMessage){
        //     console.log("comming here 4.....calling ajax");
        //     console.log('jqXhr: ' + JSON.stringify(jqXhr));
        //  }

        console.log("--------------")
        this.deferedTest().done(function(){
            console.log("inside deffereed print3");
        })
            this.parentRender(_.bind(function () {
                console.log("coming here parent render...1" + this);
                validators.bindValidators(this.$el, null, function () {
                    console.log("coming here parent render...2" + this);
                    this.$("#divButtons").hide();
                }, this);
            }, this));


        },
        customValidate: function (container, input, msg, validatorType) {
            console.log("inside cusotmValidate");

        },
        displayRealmPartial: function (e) {
            console.log("inside displayRealmPartial");

        },
        ajaxYsb: function (options) {
            console.log("inside testfunc1");
            $.ajax(options).done(function (response){
                console.log(response)
            })
            console.log("inside testfunc2");
            return $.ajax(options);
        },
        deferedTest:function(){
            console.log("inside deffereed print1");
            var dfd =$.Deferred();  //creating varaible this also can be written as ar dfd =new $.Deferred();  
            console.log("inside deffereed print2"+dfd);
            dfd.resolve();
            return dfd;
        }

    });
    //not working this print console.log("return new HelloWorldView() value :"+ new HelloWorldView().)
    return new CreateSystemID();
});