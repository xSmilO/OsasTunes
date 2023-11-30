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
            track.videoId = `${res.collection[i].id}`;
            track.duration = {};
            track.duration.seconds = Math.round(duration / 1000);
            track.duration.timestamp = track.timestamp;

            tracks.push(track);
        }

        return tracks;
    }

    static async search(options) {
        if (options.soundcloud) {
            return Searcher.searchSoundCloudTracks(options);
        } else {
            const result = await yts(options.value);
            const videos = result.videos.slice(0, 20);
            const songs = [];

            for (const video of videos) {
                let song = {};
                song.videoId = video.videoId;
                song.url = video.url;
                song.author = {};
                song.author.name = video.author.name;
                song.timestamp = video.timestamp;
                song.duration = {};
                song.duration.seconds = video.duration.seconds;
                song.duration.timestamp = video.duration.timestamp;
                song.title = video.title;
                songs.push(song);
            }

            return songs;
        }
    }

    static async searchSoundCloudSet(url) {
        try {
            const setInfo = await scdl.getSetInfo(url);
            // console.log(setInfo);
            const playlist = {};
            playlist.author = {};

            playlist.title = setInfo.title;
            playlist.author.name = setInfo.user.username;
            playlist.listId = setInfo.id;
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
                track.duration.seconds = Math.round(duration / 1000);
                // track.soundcloud = true;

                track.url = trackInfo.permalink_url;
                track.videoId = `${trackInfo.id}`;
                // track.soundcloud = true;

                playlist.videos.push(track);
            }

            return playlist;
        } catch (e) {
            console.error("soundcloud error");
        }
    }

    static async searchPlaylist(options) {
        // PLukDUAiQ_itZecSBneSADOsjgf4BPGA8Y

        // RDiD3rOICCfS8
        try {
            if (options.soundcloud)
                return Searcher.searchSoundCloudSet(options.value);
            const result = await yts({ listId: options.value });
            const songs = [];
            for (const video of result.videos) {
                let song = {};
                song.videoId = video.videoId;
                song.url = `https://www.youtube.com/watch?v=${video.videoId}`;
                song.author = {};
                song.author.name = video.author.name;
                song.timestamp = video.duration.timestamp;
                song.duration = {};
                song.duration.seconds = video.duration.seconds;
                song.duration.timestamp = video.duration.timestamp;
                song.title = video.title;
                songs.push(song);
            }

            result.videos = songs;

            return result;
        } catch (e) {
            console.log(res);
        }
    }
}

module.exports = Searcher;
