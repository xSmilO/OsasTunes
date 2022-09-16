const { query } = require("express");
const yts = require("yt-search");

class Searcher {
    static async search(key) {
        const result = await yts(key);
        const videos = result.videos.slice(0, 20);
        console.log("zrobiłem");
        return videos;
    }

    static async searchPlaylist(key) {
        // PLukDUAiQ_itZecSBneSADOsjgf4BPGA8Y
        try {
            const result = await yts({ listId: key });
            return result;
        } catch (e) {}
    }
}

module.exports = Searcher;
