// backbone model
var Blog = Backbone.Model.extend({
    defaults: {
        author : '',
        tilte: '',
        url: ''
    }
})

//backbone collection
var Blogs= Backbone.Collection.extend({

});

//instantiate two blogs
var blog1 = new Blog({
    author: 'Michale';
    title: 'Michale\'s Blog',
    url: 'http://michalesblog.com';
})

var blog2 = new Blog({
    author: 'John';
    title: 'John\'s Blog',
    url: 'http://michalesblog.com';
});

//instation a collection
var blogs=new Blog([blog1, blog2]);

//Backbone view for one blog
var BlogView =Backbone.View.extend({
model = new Blog(),
tagname: 'tr',
initialize: function(){
    
}
});
//Backbone view for all  blog
var BlogViews =Backbone.View.extend({

});