var app = new Vue({
   el:'#app',
   data : {
       message :'Hello vue.js!!',
       list : ["list1","list2","list555"]
    },
    methods :{
        handleClick:function (event) {
           alert(event.target);
       }
    }
});


console.log(app.list);