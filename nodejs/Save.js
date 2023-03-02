const fs = require("fs");

const savePlaylistsPath = __dirname + "/saved_playlists.json";
const favoriteSongsPath = __dirname + "/favorite_songs.json";

//PLukDUAiQ_itZecSBneSADOsjgf4BPGA8Y
class Save {
    static async savePlaylist(playlist) {
        fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
            if (err) return console.error(err);

            const savePlaylistJSON = JSON.parse(jsonString);
            const listId = playlist.listId;

            savePlaylistJSON[listId] = playlist;
            const JsonStringify = JSON.stringify(savePlaylistJSON);

            fs.writeFile(savePlaylistsPath, JsonStringify, (err) => {
                if (err) console.error(err);
            });
        });
    }

    static async saveFavoriteSong(song) {
        fs.readFile(favoriteSongsPath, "utf-8", (err, jsonString) => {
            if (err) return console.error(err);

            const saveSongJSON = JSON.parse(jsonString);
            const songId = song.videoId;

            saveSongJSON[songId] = song;

            const JsonStringify = JSON.stringify(saveSongJSON);

            fs.writeFile(favoriteSongsPath, JsonStringify, (err) => {
                if (err) return console.error(err);
            });
        });
    }

    static async getPlaylists() {
        return new Promise((res, rej) => {
            const data = fs.readFileSync(savePlaylistsPath, "utf-8");
            res(JSON.parse(data));
        });
    }

    static async getFavoriteSongs() {
        return new Promise((res, rej) => {
            const data = fs.readFileSync(favoriteSongsPath, "utf-8");
            res(JSON.parse(data));
        });
    }

    static async removeFavoriteSong(songId) {
        return new Promise((res, rej) => {
            fs.readFile(favoriteSongsPath, "utf-8", (err, jsonString) => {
                if (err) return console.error(err);

                const saveSongJSON = JSON.parse(jsonString);

                // saveSongJSON[songId] = song;
                delete saveSongJSON[songId];

                const JsonStringify = JSON.stringify(saveSongJSON);
                fs.writeFileSync(favoriteSongsPath, JsonStringify);

                res();
            });
        });
    }

    static async removeSongFromPlaylist(data) {
        return new Promise((res, rej) => {
            fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
                if (err) return console.error(err);

                let savePlaylistsJSON = JSON.parse(jsonString);

                let playlist = savePlaylistsJSON[data.playlist.listId];
                playlist.videos.splice(data.song_index, 1);
                savePlaylistsJSON[data.playlist.listId] = playlist;

                const JsonStringify = JSON.stringify(savePlaylistsJSON);
                fs.writeFileSync(savePlaylistsPath, JsonStringify);

                res(savePlaylistsJSON[data.playlist.listId]);
            });
        });
    }

    static async removePlaylist(playlist) {
        return new Promise((res, rej) => {
            fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
                if (err) return console.error(err);

                const savePlaylistsJSON = JSON.parse(jsonString);

                // saveSongJSON[songId] = song;
                delete savePlaylistsJSON[playlist.listId];

                const JsonStringify = JSON.stringify(savePlaylistsJSON);
                fs.writeFileSync(savePlaylistsPath, JsonStringify);

                res(savePlaylistsJSON);
            });
        });
    }

    static async change_playlist_name(data) {
        return new Promise((res, rej) => {
            fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
                if (err) return console.error(err);

                const savePlaylistsJSON = JSON.parse(jsonString);

                // saveSongJSON[songId] = song;
                savePlaylistsJSON[data.playlist.listId].title = data.value;

                const JsonStringify = JSON.stringify(savePlaylistsJSON);
                fs.writeFileSync(savePlaylistsPath, JsonStringify);

                res(savePlaylistsJSON);
            });
        });
    }

    static async change_playlist_author(data) {
        // console.log(data);
        return new Promise((res, rej) => {
            fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
                if (err) return console.error(err);

                const savePlaylistsJSON = JSON.parse(jsonString);

                // saveSongJSON[songId] = song;
                savePlaylistsJSON[data.playlist.listId].author.name =
                    data.value;

                const JsonStringify = JSON.stringify(savePlaylistsJSON);
                fs.writeFileSync(savePlaylistsPath, JsonStringify);

                res(savePlaylistsJSON);
            });
        });
    }

    static async add_song_to_playlist(data) {
        return new Promise((res, rej) => {
            fs.readFile(savePlaylistsPath, "utf-8", (err, jsonString) => {
                const playlistsJSON = JSON.parse(jsonString);

                playlistsJSON[data.playlistId].videos.push(data.song);
                const JsonStringify = JSON.stringify(playlistsJSON);
                fs.writeFileSync(savePlaylistsPath, JsonStringify);
                res();
            });
        });
    }
}

module.exports = Save;
