!function ($) {

    var app = {
        Vue: {},
        Music: {}
    }

    app.Vue.el = "#js-vue";
    app.Vue.methods = {},
        app.Vue.watch = {},
        app.Vue.computed,
        app.Vue.created,
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
        return axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {params: this.youtubeDataApiParam})
    }

    app.Vue.methods.getYoutubeData_snippets = function (response) {
        for (var i = 0; i < response.data.items.length; i++) {
            this.youtubeData.push(response.data.items[i].snippet);
        }
    }

    app.Vue.created = async function () {

    }

    app.Vue.mounted = async function () {
        var response = await this.getYoutubeData();
        this.getYoutubeData_snippets(response)


    }

    new Vue(app.Vue)


}(jQuery);