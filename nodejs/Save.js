const fs = require("fs");

const savePlaylistsPath = "./saved_playlists.json";

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
                if (err) {
                    console.error(err);
                }
            });
        });
    }

    static async getPlaylists() {
        return new Promise((res, rej) => {
            const data = fs.readFileSync(savePlaylistsPath, "utf-8");
            res(JSON.parse(data));
        });
    }
}

module.exports = Save;
