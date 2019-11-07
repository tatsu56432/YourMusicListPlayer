!function () {


    var app = {
        Vue: {},
        Music: {}
    }


    app.Vue.el = "#js-vue";
    app.Vue.methods = {},
    app.Vue.watch = {},
    app.Vue.computed,
    app.Vue.mounted,

    app.Vue.data = {},
    app.Vue.data.items = [];
    app.Vue.data.youtubeData = [];
    app.Vue.data.youtubeDataApiParam = {
        part: 'snippet',
        playlistId: 'PLlVlyGVtvuVnJ_wdbrb_PUKtndQqzU4me', // 再生リストID
        maxResults: 30, // デフォルトは5件
        key: 'AIzaSyBmMNSFmsKQTMUMlN1qxXHlQjBlOPINuDs'
    }

    // app.music.methods = {},
    // app.music._songs = [],
    // app.music.player = {};

    app.Vue.methods.getYoutubeData = function () {
        axios.get('https://www.googleapis.com/youtube/v3/playlistItems',{params: this.youtubeDataApiParam})
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    app.Vue.mounted = function () {
        this.getYoutubeData();
    }





    new Vue(app.Vue)




}();