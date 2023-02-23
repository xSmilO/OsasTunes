const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    pingTimeout: 60000,
});
const Searcher = require("./Searcher.js");
const Save = require("./Save.js");

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.emit("connected");
    socket.broadcast.emit("get_player_info_python");

    socket.on("stop_socket", () => {
        socket.broadcast.emit("stop_socket");
        socket.broadcast.emit("reset_python");
    });

    socket.on("search", (key) => {
        if (key == "") return;
        Searcher.search(key).then((res) => {
            io.emit("search_result", res);
        });
    });

    socket.on("update_page", () => {
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("add_song", (song) => {
        socket.broadcast.emit("add_song_python", song);
        socket.broadcast.emit("get_player_info_python");
        socket.broadcast.emit("set_playlist_info_python", {
            title: "Your creation",
            author: "YOU",
            color: "#9adcff",
        });
    });

    socket.on("play", () => {
        socket.broadcast.emit("play_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("pause", () => {
        socket.broadcast.emit("pause_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("skip", () => {
        console.log("skipuj");
        socket.broadcast.emit("skip_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("change_volume", (volume) => {
        socket.broadcast.emit("change_volume_python", volume);
    });

    socket.on("sending_player_info", (info) => {
        socket.broadcast.emit("update_page", info);
    });
    socket.on("song_added", () => {
        socket.broadcast.emit("song_added");
    });

    socket.on("search_playlist", (key) => {
        Searcher.searchPlaylist(key).then((data) => {
            socket.emit("search_playlist_result", data);
        });
    });

    socket.on("save_playlist", (playlist) => {
        Save.savePlaylist(playlist);
        socket.emit("playlist_saved");
    });

    socket.on("add_song_to_playlist", (data) => {
        Save.add_song_to_playlist(data).then(() => {
            socket.emit("song_added");
        });
    });

    socket.on("get_saved_playlists", () => {
        Save.getPlaylists().then((playlists) => {
            socket.emit("get_saved_playlists", playlists);
        });
    });

    socket.on("get_favorite_songs", () => {
        Save.getFavoriteSongs().then((songs) => {
            socket.emit("get_favorite_songs", songs);
        });
    });

    socket.on("remove_favorite_song", (songId) => {
        Save.removeFavoriteSong(songId).then(() => {
            console.log("skonczylem");
            Save.getFavoriteSongs().then((songs) => {
                console.log("wysylam");
                socket.emit("get_favorite_songs", songs);
            });
        });
    });

    socket.on("set_playlist_info", (info) => {
        socket.broadcast.emit("set_playlist_info_python", {
            title: info.title,
            author: info.author,
            color: info.color,
        });
    });

    socket.on("set_playlist_songs", (songs) => {
        socket.broadcast.emit("set_playlist_songs_python", songs);
    });

    socket.on("playlist_added_to_queue", () => {
        socket.broadcast.emit("playlist_added_to_queue");
    });

    socket.on("save_song", (song) => {
        Save.saveFavoriteSong(song);
    });

    socket.on("previous_song", () => {
        socket.broadcast.emit("previous_song_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("change_looped", () => {
        socket.broadcast.emit("change_looped_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("change_shuffle", () => {
        socket.broadcast.emit("change_shuffle_python");
        socket.broadcast.emit("get_player_info_python");
    });

    socket.on("get_player_timeline", () => {
        socket.broadcast.emit("get_player_timeline_python");
    });

    socket.on("sending_player_timeline", (info) => {
        socket.broadcast.emit("sending_player_timeline", info);
    });

    socket.on("reset_player", () => {
        socket.broadcast.emit("reset_player_python");
    });

    socket.on("set_song_index", (index) => {
        socket.broadcast.emit("set_song_index_python", index);
    });

    socket.on("remove_song_from_playlist", (data) => {
        Save.removeSongFromPlaylist(data).then((playlist) => {
            socket.emit("refresh_edited_playlist", playlist);
        });
    });

    socket.on("remove_playlist", (playlist) => {
        Save.removePlaylist(playlist).then((data) => {
            socket.emit("get_saved_playlists", data);
        });
    });

    socket.on("change_playlist_name", (data) => {
        Save.change_playlist_name(data).then((res) => {
            socket.emit("get_saved_playlists", res);
        });
    });

    socket.on("change_playlist_author", (data) => {
        Save.change_playlist_author(data).then((res) => {
            socket.emit("get_saved_playlists", res);
        });
    });

    socket.on("connect_error", () => {
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});
