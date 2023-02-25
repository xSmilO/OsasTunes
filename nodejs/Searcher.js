const yts = require("yt-search");
const scdl = require("soundcloud-downloader").default;

class Searcher {
    static async searchSoundCloudTracks(options) {
        const res = await scdl.search({
            query: options.value,
            limit: 30,
            resourceType: "tracks",
        });

        const tracks = [];

        // console.log(res);

        for (let i = 0; i < res.collection.length; i++) {
            let track = {};
            track.title = res.collection[i].title;
            track.author = {};
            track.author.name = res.collection[i].user.username;

            let duration = res.collection[i].full_duration;
            let minutes = Math.floor(duration / 60000);
            let seconds = ((duration % 60000) / 1000).toFixed(0);

            if (seconds < 10) seconds = "0" + seconds;
            track.timestamp = minutes + ":" + seconds;
            // track.soundcloud = true;

            track.url = res.collection[i].permalink_url;
            track.videoId = res.collection[i].id;

            tracks.push(track);
        }

        // console.log(tracks);
        return tracks;
    }

    static async search(options) {
        if (options.soundcloud) {
            return Searcher.searchSoundCloudTracks(options);
        } else {
            const result = await yts(options.value);
            const videos = result.videos.slice(0, 20);
            return videos;
        }
    }

    static async searchSoundCloudSet(url) {
        const setInfo = await scdl.getSetInfo(url);
        // console.log(setInfo);
        const playlist = {};
        playlist.author = {};

        playlist.title = setInfo.title;
        playlist.author.name = setInfo.user.username;

        playlist.videos = [];

        for (let trackInfo of setInfo.tracks) {
            let track = {};
            track.title = trackInfo.title;
            track.author = {};
            track.author.name = trackInfo.user.username;

            let duration = trackInfo.full_duration;
            let minutes = Math.floor(duration / 60000);
            let seconds = ((duration % 60000) / 1000).toFixed(0);

            track.duration = {};
            if (seconds < 10) seconds = "0" + seconds;
            track.duration.timestamp = minutes + ":" + seconds;
            // track.soundcloud = true;

            track.url = trackInfo.permalink_url;
            track.videoId = trackInfo.id;
            track.soundcloud = true;

            playlist.videos.push(track);
        }

        return playlist;
    }

    static async searchPlaylist(options) {
        // PLukDUAiQ_itZecSBneSADOsjgf4BPGA8Y

        // RDiD3rOICCfS8
        try {
            if (options.soundcloud)
                return Searcher.searchSoundCloudSet(options.value);
            const result = await yts({ listId: options.value });
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = Searcher;
