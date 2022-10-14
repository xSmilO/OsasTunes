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
}

module.exports = Save;
