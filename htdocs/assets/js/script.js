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
    app.Vue.computed,
    app.Vue.watch ={},
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
    app.Vue.data.perPlayerState = false;


    app.Music.methods = {},
    app.Music._songs = [],
    app.Music.player = {},
    app.Music.autoplay = true,
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

        console.log(this.playerState)
        console.log(app.Music.nowplaying.state)

        var response = await this.getYoutubeData();
        this.getYoutubeData_snippets(response)
    }

    app.Vue.mounted= function(){

    }

    app.Vue.methods.onClickPlay = function (e) {
        // console.log(e.currentTarget.getAttribute("videoId"))

        if (e.currentTarget.getAttribute("videoId") === app.Music.nowplaying.videoId){
            switch (app.Music.nowplaying.state) {
                case "play":
                    app.Music.methods.pause();
                    break;
                case "pause":
                    app.Music.methods.reStart()
            }
        }else{
            app.Music.methods.start(e)
        }

    }


    app.Music.methods.start = function (e) {
        app.Music.methods.setNowplaying(e.currentTarget.getAttribute("videoId"), "play")
        app.Music.methods.createYoutube(e.currentTarget.getAttribute("videoId"))
    }

    app.Music.methods.pause = function() {
        app.Music.player.pauseVideo()
        app.Music.methods.setNowplaying(app.Music.nowplaying.videoId, "pause")
    }

    app.Music.methods.reStart = function() {
        app.Music.player.playVideo()
        app.Music.methods.setNowplaying(app.Music.nowplaying.videoId, "play")
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
                    onStateChange: app.Music.methods.onYoutubeStateChange,
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

    app.Music.methods.onYoutubeStateChange = function(t) {

        //youtubeが状態変化した時にVueのインスタンスにもplayerの状態を持たす
        var is_playing = app.Music.nowplaying.state==="play" ? true: false;
        if(is_playing){
            app.Vue.data.playerState = true
        }else{
            app.Vue.data.playerState = false
        }
        //youtubeが状態変化したらvue インスタンスが持つyoutubeDataにリアクティブなデータをセットする
        app.Vue.data.youtubeData.forEach(function (obj) {
            if(obj.resourceId.videoId === app.Music.nowplaying.videoId){
                Vue.set(obj,'playingState',app.Music.nowplaying.state);
            }else{
                Vue.set(obj,'playingState',"stop");
            }
        })
        console.log(app.Vue.data.youtubeData)

        // if (0 == t.data) {
        //     var s, o = app.Vue.data.youtubeData.map(function(t) {
        //         return t.resourceId.videoId === app.Music.nowplaying.videoId;
        //     });
        //     //動画終了した時次の動画
        //     -1 != o.indexOf(!0) && (s = app.Vue.data.youtubeData[o.indexOf(!0) + 1]), app.Music.autoplay && void 0 != s && "" != s.videoId ? (app.Music.methods.createYoutube(s.videoId),
        //     app.Music.methods.setNowplaying(s.videoId, "play")) : app.Music.methods.stop()
        // }

    }


    new Vue(app.Vue)


}(jQuery);