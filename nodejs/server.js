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

    socket.on("add_song", (song) => {
        socket.broadcast.emit("add_song_python", song);
        socket.broadcast.emit("get_player_info_python");
        // console.log("kurwa 1");
    });

    socket.on("play", () => {
        socket.broadcast.emit("play_python");
        socket.broadcast.emit("get_player_info_python");
        // console.log("kurwa 2");
    });

    socket.on("pause", () => {
        socket.broadcast.emit("pause_python");
        socket.broadcast.emit("get_player_info_python");
        // console.log("kurwa 3");
    });

    socket.on("skip", () => {
        console.log("skipuj");
        socket.broadcast.emit("skip_python");
        socket.broadcast.emit("get_player_info_python");
        // console.log("kurwa 4");
    });

    socket.on("change_volume", (volume) => {
        socket.broadcast.emit("change_volume_python", volume);
        // console.log("kurwa 5");
    });

    socket.on("sending_player_info", (info) => {
        socket.broadcast.emit("update_page", info);
        // console.log("kurwa 6");
    });
    socket.on("song_added", () => {
        socket.broadcast.emit("song_added");
        // console.log("kurwa 7");
    });

    socket.on("search_playlist", (key) => {
        Searcher.searchPlaylist(key).then((data) => {
            socket.emit("search_playlist_result", data);
        });
    });

    socket.on("save_playlist", (playlist) => {
        Save.savePlaylist(playlist);
    });

    socket.on("get_saved_playlists", () => {
        Save.getPlaylists().then((playlists) => {
            console.log(Object.keys(playlists));
            socket.emit("get_saved_playlists", playlists);
        });
    });

    socket.on("set_playlist_info", (info) => {
        socket.broadcast.emit("set_playlist_info_python", {
            title: info.title,
            author: info.author,
        });
    });

    socket.on("set_playlist_songs", (songs) => {
        socket.broadcast.emit("set_playlist_songs_python", songs);
    });

    socket.on("connect_error", () => {
        // console.log("kurwa 8");
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});
