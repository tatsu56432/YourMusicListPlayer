var app = new Vue({
   el:'#app',
   data : {
       message :'Hello vue.js!!',
       //count:9,
       list : ["list1","list2","list555"],
       show:true
    },
    methods :{
        handleClick:function (event) {
           alert(event.target);
       }
    }
});


console.log(app.list);