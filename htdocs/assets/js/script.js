!function () {

    var app = {
        Vue: {},
        Music: {}
    }

    app.Vue.el = "#js-vue";
    app.Vue.methods = {},
    app.Vue.watch = {},
    app.Vue.created,
    app.Vue.mounted,
    app.Vue.computed,
    app.Vue.data = {},
    app.Vue.data.apiKey = 'AIzaSyBUcEheCdUocO0H9hC-G6usm5VkkgP7EhM'
    app.Vue.data.initialYoutubeDataCopy= [],
    app.Vue.data.youtubeData = [];
    app.Vue.data.shuffledYoutubeData = [];
    app.Vue.data.youtubeDataApiParam = {
        part: 'snippet',
        playlistId: '', // 再生リストID
        maxResults: 40, // デフォルトは5件
        key: "AIzaSyBUcEheCdUocO0H9hC-G6usm5VkkgP7EhM"
    };

    //https://developers.google.com/youtube/v3/docs/videos/list
    app.Vue.data.movieRequest = 'https://www.googleapis.com/youtube/v3/videos'

    app.Vue.data.playerState = false;
    app.Vue.data.activateState = false;
    app.Vue.data.youtubeDataTransferResultTxt = '';
    app.Vue.data.sidebarStatus = true;
    app.Vue.data.songsBarStatus = true;


    app.Music.methods = {},
    app.Music._songs = [],
    app.Music.player = {},
    app.Music.autoplay = true,
    app.Music.sortby = "videoId",
    app.Music.filterby = "all",
    app.Music.nowplaying = {
            videoId: null,
            nextVideoId: null,
            state: "stop"
        },


    app.Vue.methods.getYoutubeData = function () {
        return axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {params: this.youtubeDataApiParam})
    }

    app.Vue.methods.getYoutubeData_snippets = function (response) {
        //youtube再生リストIDが再度入力された時にyoutubeDataをリセット
        this.youtubeData = []
        for (var i = 0; i < response.data.items.length; i++) {
            this.youtubeData.push(response.data.items[i].snippet);
        }
    }

    app.Vue.created = async function () {
        //console.log(this.playerState)
        // console.log(app.Music.nowplaying.state)
    }

    app.Vue.mounted = function(){
        //playlistIDのcookieが存在したらそのまま再生画面へ
        if(this.$cookies.get("playlistId")){
            this.youtubeDataApiParam.playlistId = this.$cookies.get("playlistId")
            this.onClickSubmit()   
        }
        // this.initialYoutubeData = this.youtubeData;
    }

    app.Vue.watch = function(){
        
        
    }

    app.Vue.methods.doInput = function(event){
        this.youtubeDataApiParam = event.target.value;
    }

    app.Vue.methods.onClickSubmit = async function(e){
        this.$cookies.set("playlistId",this.youtubeDataApiParam.playlistId,60 * 60 * 12);

        var response = await this.getYoutubeData();
        if(response === undefined){
            this.youtubeDataTransferResultTxt = "再生リストIDが存在しません。"
        }else{
            this.activateState = !this.activateState;
            this.getYoutubeData_snippets(response)
        }

        this.addYoutubeDataStatistics()

        // this.initialYoutubeData = this.youtubeData
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

    app.Vue.methods.onClickPauseMainPlayer = function(e){
        switch (app.Music.nowplaying.state) {
            case "play":
                app.Music.methods.pause();
                break;
            case "pause":
                app.Music.methods.reStart()
        }
    }


    app.Vue.methods.onClickSidebarToggleBtn = function(e){
        this.sidebarStatus = !this.sidebarStatus
    }

    app.Vue.methods.onClickSongsBarToggleBtn = function(e){
        this.songsBarStatus = !this.songsBarStatus
    }

    app.Vue.methods.onClickInitDisplay = function(e){


        // console.log(this.initialYoutubeDataCopy);
        this.youtubeData = Vue.util.extend(this.initialYoutubeDataCopy)
        this.initialYoutubeDataCopy = Vue.util.extend([], this.initialYoutubeDataCopy)

        //配列をディレクティブのまま初期化
        // this.youtubeData.splice(-this.youtubeData.length);

        //ディープコピーしたthis.initialYoutubeDataCopyをセットしようとしたけど、
        //その値はディレクティブにならないから他の配列操作が反映されなくなる。。
        // this.youtubeData = this.initialYoutubeDataCopy;
        // this.youtubeData.forEach(function (obj,index) {
        //     Vue.set(obj,index,initialData[index])
        // })

    }

    app.Vue.methods.onClickRemovePlaylistId = function(e){
        this.youtubeDataApiParam.playlistId = ""
        this.$cookies.remove("playlistId")
        this.activateState = false;
    }

    app.Vue.methods.onClickAscendViewCount =function(e){
        this.ObjectArraySort(this.youtubeData, 'viewCount', 'asc', function(newData){
            this.youtubeData = newData
        });
    }

    app.Vue.methods.onClickDescendViewCount =function(e){
        this.ObjectArraySort(this.youtubeData, 'viewCount', '', function(newData){
            this.youtubeData = newData
        });
    }

    app.Vue.methods.ObjectArraySort=function(data,key,order,fn){
        //デフォは降順(DESC)
        var num_a = -1;
        var num_b = 1;

        if(order === 'asc'){//指定があれば昇順(ASC)
            num_a = 1;
            num_b = -1;
        }

        data = data.sort(function(a, b){
            var x = a[key];
            var y = b[key];
            if (x > y) return num_a;
            if (x < y) return num_b;
            return 0;
        });
        fn(data); // ソート後の配列を返す
    }

    app.Vue.methods.onClickReverseYoutubeData = function(e){
    this.youtubeData.reverse();
    }

    app.Vue.methods.onClickShuffleYoutubeData =function(e){
        var shuffledData = this.shuffleYoutubeData(this.youtubeData);

        this.youtubeData.forEach(function (obj,index) {
                Vue.set(obj,index,shuffledData[index]);
        })

    }

    app.Vue.methods.shuffleYoutubeData = function(array){
        for (let i = array.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1))
            let tmp = array[i]
            array[i] = array[r]
            array[r] = tmp
        }
        return array
    }

    app.Vue.methods.onClickDescendPublishedDate = function(e){
        this.youtubeData.sort(function(a,b) {
            return (a.publishedAt < b.publishedAt ? 1 : -1);
        });
    }

    app.Vue.methods.addYoutubeDataStatistics = async function(){

        //このメソッドの中でthis,youtubeDateの使うため
        var response = await this.getYoutubeData();
        this.getYoutubeData_snippets(response)

        for (var i = 0; i < this.youtubeData.length; i++) {
            var thisVideId = this.youtubeData[i].resourceId.videoId
            var movieRequestStatistics = this.movieRequest + '?part=statistics&id=' + thisVideId + '&fields=items%2Fstatistics&key=' + this.apiKey
            var movieRequestSnippet = this.movieRequest + '?part=snippet&id=' + thisVideId + '&fields=items%2Fsnippet&key=' + this.apiKey
            var responseStatistics = await this.getMovieStatics(movieRequestStatistics)
            var responseSnippet = await this.getMovieStatics(movieRequestSnippet)
            var viewCount = responseStatistics.data.items[0].statistics.viewCount
            var likeCount = responseStatistics.data.items[0].statistics.likeCount
            var publishedAt = responseSnippet.data.items[0].snippet.publishedAt
            var formattedDate = this.getFormattedDate(publishedAt)
            Vue.set(this.youtubeData[i],"viewCount", Number(viewCount))
            Vue.set(this.youtubeData[i],"likeCount", Number(likeCount))
            Vue.set(this.youtubeData[i],"publishedAt",String(formattedDate))
            //一番初めにロードしたthis.youtubeDataの配列objectをディープコピーする
            // if(this.youtubeData.length -1 === i)  this.initialYoutubeDataCopy = JSON.parse(JSON.stringify(this.youtubeData));
            if(this.youtubeData.length -1 === i)  this.initialYoutubeDataCopy = Vue.util.extend([], this.youtubeData);
        }
    }

    app.Vue.methods.getMovieStatics = function(request){
        return axios(request,function (response) {})
    }

    app.Vue.methods.getFormattedDate = function(Iso8601){
        var date = new Date(Iso8601)
        date = formatDate(date, 'yyyy/MM/dd')
        //https://zukucode.com/2017/04/javascript-date-format.html
        function formatDate (date, format) {
            format = format.replace(/yyyy/g, date.getFullYear());
            format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
            format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
            format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
            format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
            format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
            format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
            return format;
        };

        return date
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
                    // onError: app.Music.methods.onYoutubeError
                }
            };
            app.Music.player = new YT.Player("js-frame", playerParams)
        } else {
            app.Music.methods.stop()
        }
    }

    app.Music.methods.onYoutubeReady = function(e) {
        // console.log("onYoutubeReady(): " + e.target.getVideoData().video_id),
        e.target.playVideo()
    }

    app.Music.methods.onYoutubeStateChange = function(player) {
        /**
         * playerStatus
         -1 – 未開始
         0 – 終了
         1 – 再生中
         2 – 一時停止
         3 – バッファリング中
         5 – 頭出し済み
         */
        var playerStatus = app.Music.player.getPlayerState()
        //console.log(playerStatus);
        if(playerStatus===1){
            app.Vue.data.sidebarStatus  = true;
        }

        //youtubeが状態変化した時にVueのインスタンスにもplayerの状態を持たす
        var is_playing = app.Music.nowplaying.state==="play" ? true: false;
        if(is_playing){
            app.Vue.data.playerState = true
        }else{
            app.Vue.data.playerState = false
        }
        //youtubeが状態変化したらvue インスタンスが持つyoutubeDataの各オブジェクトにリアクティブなデータをセットする
        app.Vue.data.youtubeData.forEach(function (obj) {
            if(obj.resourceId.videoId === app.Music.nowplaying.videoId){
                Vue.set(obj,'playingState',app.Music.nowplaying.state);
            }else{
                Vue.set(obj,'playingState',"stop");
            }
        })


        //動画終了したら次の動画を再生する
        if(playerStatus === 0){
            var youtubeData = app.Vue.data.youtubeData
            var nextVideoId
            var count = 0
            for(var i in youtubeData) {
                if(youtubeData[i].resourceId.videoId === app.Music.nowplaying.videoId){
                    // console.log(youtubeData[count + 1].resourceId.videoId);
                    //ここなぜかi+1だとundefinedになる
                    nextVideoId = youtubeData[count + 1].resourceId.videoId
                }
                count++
            }
            app.Music.nowplaying.nextVideoId = nextVideoId
            app.Music.methods.createYoutube(nextVideoId)
            app.Music.methods.setNowplaying(nextVideoId, "play")
            app.Music.player.playVideo()
        }
    }
    
    

    new Vue(app.Vue)


}();