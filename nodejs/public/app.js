const socket = io();

const stopSocketBtn = document.querySelector(".stop_socket");
stopSocketBtn.addEventListener("click", (e) => {
    socket.emit("stop_socket");
});

const searchSection = document.querySelector(".search-section");
const searchForm = document.querySelector(".search-section .search");
const searchInput = document.querySelector(".search-section .search input");
const searchPlaylistForm = document.querySelector(
    ".playlist-search-section .search"
);
const searchPlaylistInput = document.querySelector(
    ".playlist-search-section .search input"
);

let currentPlaylist = {};
const playlistColors = ["#7189BF", "#DF7599", "#FFC785", "#72D6C9"];

// player controllers
let playBtn = document.querySelector(
    ".player-controller .main-controllers .play"
);

const skipBtn = document.querySelector(
    ".player-controller .main-controllers .skip"
);
const previousSongBtn = document.querySelector(
    ".player-controller .main-controllers .back"
);

const volumeBtn = document.querySelector(".player-controller .options .volume");
const volumeSlider = document.querySelector(
    ".player-controller .options .volume .volume-slider"
);

const moreOptionsBtn = document.querySelector(
    ".player-controller .options .more-options"
);
const loopBtn = document.querySelector(
    ".player-controller .options .more-options .container .loop"
);
const shuffleBtn = document.querySelector(
    ".player-controller .options .more-options .container .shuffle"
);

let result = [];
let savedPlaylists = [];
let favoriteSongs = [];

let paused = true;

try {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        socket.emit("search", searchInput.value);
        searchInput.value = "";
    });
} catch (e) {}

try {
    playBtn.addEventListener("click", () => {
        if (paused) {
            socket.emit("play");
        } else socket.emit("pause");
    });

    skipBtn.addEventListener("click", () => {
        socket.emit("skip");
    });

    volumeBtn.addEventListener("click", () => {
        volumeBtn.classList.toggle("active");
        moreOptionsBtn.classList.remove("show");
    });

    volumeSlider.addEventListener("input", () => {
        socket.emit("change_volume", parseInt(volumeSlider.value));
    });

    previousSongBtn.addEventListener("click", () => {
        socket.emit("previous_song");
    });

    moreOptionsBtn.addEventListener("click", () => {
        volumeBtn.classList.remove("active");
        moreOptionsBtn.classList.toggle("show");
    });

    loopBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        socket.emit("change_looped");
    });

    shuffleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        socket.emit("change_shuffle");
    });
} catch (e) {}

try {
    searchPlaylistForm.addEventListener("submit", (e) => {
        e.preventDefault();
        socket.emit("search_playlist", searchPlaylistInput.value);

        searchPlaylistInput.value = "";
    });
} catch (e) {}

socket.on("search_result", (data) => {
    searchResult.replaceChildren();
    currentPlaylist = {};
    if (searchForm) {
        Generate.searchResult(data).then((res) => (result = res));
    }
});

socket.on("search_playlist_result", (data) => {
    currentPlaylist = data;
    Generate.playlistResult(currentPlaylist).then((songs) => {
        result = songs;
    });
});

socket.on("update_page", (info) => {
    // console.log(info);
    if (playBtn)
        Generate.updatePage(info, playBtn, paused).then(
            (newState) => (paused = newState)
        );

    Generate.listForQueue(
        info.songList,
        info.currentSong,
        info.playlistName,
        info.playlistAuthor,
        info.color
    );

    Generate.updateCurrentSong(info.currentSong);
    if (volumeSlider) volumeSlider.value = info.volume;
});

socket.on("song_added", () => {
    Animate.songAdded();
});

if (playlistsSection) {
    socket.emit("get_saved_playlists");
}

socket.emit("get_favorite_songs");

socket.on("get_saved_playlists", (playlists) => {
    if (playlistsSection) {
        Generate.savedPlaylists(savedPlaylists, playlists);
    }

    if (searchSection) {
        Generate.playlistsList(playlists);
    }
});

socket.on("playlist_saved", () => {
    Animate.playlistSaved();
});

socket.on("playlist_added_to_queue", () => {
    Animate.playlistAdded();
});

socket.on("get_favorite_songs", (songs) => {
    favoriteSongs = songs;

    if (favoriteSection) {
        Generate.favoriteSongs(songs).then((songs) => {
            result = songs;
        });
    }
});

socket.on("sending_player_timeline", (currentTime) => {
    Generate.updateTimeline(currentTime);
});

socket.on("refresh_edited_playlist", (playlist) => {
    Generate.updateEditPlaylistSection(playlist);
});

setInterval(() => {
    socket.emit("update_page");
}, 1000);

setInterval(() => {
    socket.emit("get_player_timeline");
}, 500);
