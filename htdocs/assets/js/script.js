!function () {


    var app = {
        Vue: {},
        Music: {}
    }

    app.Vue.el = "#js-vue";
    app.Vue.methods = {},
    app.Vue.watch = {},
    app.Vue.data = {},
    app.Vue.data.items = [];

    // app.music.methods = {},
    // app.music._songs = [],
    // app.music.player = {};

    app.Vue.methods.getYoutubeData = function () {
        axios.get('https://www.bbmedia.co.jp/wp-json/wp/v2/works_api')
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    }






}();