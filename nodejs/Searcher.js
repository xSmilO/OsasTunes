const { query } = require("express");
const yts = require("yt-search");

class Searcher {
    static async search(key) {
        const result = await yts(key);
        const videos = result.videos.slice(0, 20);
        return videos;
    }

    static async searchPlaylist(key) {
        // PLukDUAiQ_itZecSBneSADOsjgf4BPGA8Y

        // RDiD3rOICCfS8
        try {
            const result = await yts({ listId: key });
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = Searcher;
