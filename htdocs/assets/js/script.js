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
        playlistId: 'PL5V6jEpgjar87uPuGiz18LGmWAHs6RMJH', // 再生リストID
        maxResults: 30, // デフォルトは5件
        key: 'AIzaSyBmMNSFmsKQTMUMlN1qxXHlQjBlOPINuDs'
    };

    app.Vue.data.playerState = false;

    // var classObj = {
    //     is_playing:false,
    // }
    //
    // app.Vue.data.class = classObj;




    app.Music.methods = {},
    app.Music._songs = [],
    app.Music.player = {},
    app.Music.autoplay = !0,
    app.Music.sortby = "videoId",
    app.Music.filterby = "all",
    app.Music.nowplaying = {
            videoId: null,
            state: "stop"
        },

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
        //console.log(this.youtubeData)
    }


    app.Vue.methods.onClickPlay = function (e) {

        // console.log(e.currentTarget.getAttribute("videoId"))

        console.log(app.Music.nowplaying)

        if (e.currentTarget.getAttribute("videoId") === app.Music.nowplaying.videoId){
            switch (app.Music.nowplaying.state) {
                case "play":
                    app.Music.methods.pause();
                    break;
                case "pause":
                    // app.Music.methods.reStart()
            }
        }else{
            app.Music.methods.start(e)
        }

    }


    app.Music.methods.start = function (e) {
        app.Music.methods.setNowplaying(e.currentTarget.getAttribute("videoId"), "play")
        app.Music.methods.createYoutube(e.currentTarget.getAttribute("videoId"))
    }

    app.Music.methods.setNowplaying = function(videoID, state) {
        app.Music.nowplaying.videoId = videoID,
        app.Music.nowplaying.state = state;
        document.getElementById("js-frame").setAttribute("state", state)
    }


    app.Music.methods.createYoutube = function (videoId) {

        if ("" !== videoId) {
            document.getElementById("js-frame").innerHTML = "",
            "object" === typeof app.Music.player && "destroy" in app.Music.player && app.Music.player.destroy(), app.Music.player = {};

            var playerParams = {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    playsinline: 1
                },
                events: {
                    onReady: app.Music.methods.onYoutubeReady,
                    // onStateChange: e.Music.methods.onYoutubeStateChange,
                    // onError: e.Music.methods.onYoutubeError
                }
            };
            app.Music.player = new YT.Player("js-frame", playerParams)
        } else {
            app.Music.methods.stop()
        }
    }

    app.Music.methods.onYoutubeReady = function(e) {
        console.log("onYoutubeReady(): " + e.target.getVideoData().video_id),
        e.target.playVideo()
    }




    new Vue(app.Vue)
    new Vue(app.Music)


}(jQuery);