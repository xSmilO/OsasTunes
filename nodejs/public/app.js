const socket = io();

const stopSocketBtn = document.querySelector(".stop_socket");
stopSocketBtn.addEventListener("click", (e) => {
    socket.emit("stop_socket");
});

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

const volumeBtn = document.querySelector(".player-controller .options .volume");
const volumeSlider = document.querySelector(
    ".player-controller .options .volume .volume-slider"
);

let result = [];
let savedPlaylists = [];

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
    });

    volumeSlider.addEventListener("input", () => {
        socket.emit("change_volume", parseInt(volumeSlider.value));
    });
} catch (e) {}

try {
    searchPlaylistForm.addEventListener("submit", (e) => {
        e.preventDefault();
        socket.emit("search_playlist", searchPlaylistInput.value);

        searchPlaylistInput.value = "";
    });
} catch (e) {}

function addVideoToQueue(event) {
    const videoIndex = parseInt(event.target.getAttribute("video-index"));
    console.log(videoIndex);
    socket.emit("add_song", result[videoIndex]);
}

function updatePage(info) {
    console.log(info);

    try {
        if (!playBtn) return;

        playBtn = document.querySelector(
            ".player-controller .main-controllers .play"
        );
        paused = info.paused;

        if (paused) {
            playBtn.className = "fa-solid fa-play play";
        } else playBtn.className = "fa-solid fa-pause play";
    } catch (e) {
        console.error(e);
    }
}

socket.on("search_result", (data) => {
    searchResult.replaceChildren();
    currentPlaylist = {};
    if (searchForm) {
        createSearchResult(data);
        Generate.searchResult(result, data);
    }
});

socket.on("search_playlist_result", (data) => {
    currentPlaylist = data;
    Generate.playlistResult(currentPlaylist);
});

socket.on("update_page", (info) => {
    // console.log(info);
    console.log(`przed: ${paused}`);

    if (playBtn)
        Generate.updatePage(info, playBtn, paused).then(
            (newState) => (paused = newState)
        );

    console.log(`po: ${paused}`);

    Generate.listForQueue(
        info.songHistory,
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

socket.on("get_saved_playlists", (playlists) => {
    Generate.savedPlaylists(savedPlaylists, playlists);
});

socket.on("playlist_saved", () => {
    Animate.playlistSaved();
});

socket.on("playlist_added_to_queue", () => {
    Animate.playlistAdded();
});

setInterval(() => {
    socket.emit("update_page");
}, 1000);
