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

const playlistSearchResult = document.querySelector(
    ".playlist-search-section .search-result"
);
const playlistTemplate = document.querySelector(".playlist.template");
const playlistVideoTemplate = document.querySelector(".video.template");

let currentPlaylist = {};

const playlistsSection = document.querySelector(".playlists-section");

const searchResult = document.querySelector(".search-result");
const videoResultTemplate = document.querySelector(
    ".search-result .video.template"
);

const songAddedNotification = document.querySelector(
    ".search-section .song-added"
);

const playlistColors = ["#7189BF", "#DF7599", "#FFC785", "#72D6C9"];

// player controllers

const playBtn = document.querySelector(
    ".player-controller .main-controllers .play"
);

const skipBtn = document.querySelector(
    ".player-controller .main-controllers .skip"
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

function createSearchResult(videos) {
    let index = 0;
    result = videos;

    for (const videoDetails of videos) {
        const newVideo = videoResultTemplate.cloneNode(true);
        newVideo.className = "video";

        const title = newVideo.querySelector(".description .title");
        title.innerText = videoDetails.title;

        const author = newVideo.querySelector(".description .details .author");
        author.innerText = videoDetails.author.name;

        const duration = newVideo.querySelector(
            ".description .details .duration"
        );
        duration.innerText = videoDetails.timestamp;

        const addVideo = newVideo.querySelector(".buttons .add");
        addVideo.setAttribute("video-index", index);
        addVideo.addEventListener("click", (e) => {
            addVideoToQueue(e);
        });

        index++;
        searchResult.appendChild(newVideo);
    }
}

function generateListForQueue(songList, currentSong) {
    try {
        const playlistSongs = document.querySelector(
            ".player-section .playlist-songs"
        );
        playlistSongs.replaceChildren();

        const playlistSongTemplate = document.querySelector(" .song.template");

        for (const songDetails of songList) {
            const song = playlistSongTemplate.cloneNode(true);
            song.className = "song";

            if (currentSong && songDetails.videoId == currentSong?.videoId)
                song.classList.add("current");

            const title = song.querySelector(".description .title p");
            title.innerText = songDetails.title;

            const author = song.querySelector(".details .author");
            author.innerText = songDetails.author.name;

            const duration = song.querySelector(".details .duration");
            duration.innerText = songDetails.timestamp;

            playlistSongs.appendChild(song);
        }
    } catch (e) {
        return;
    }
}

function updateCurrentSong(song) {
    try {
        const currentSong = document.querySelector(
            ".player-controller .currentSong"
        );

        const title = currentSong.querySelector(".title");
        const author = currentSong.querySelector(".author");
        if (!song) {
            title.innerText = "...";
            author.innerText = "...";
            return;
        }

        title.innerText = song.title;
        author.innerText = song.author.name;
    } catch (e) {
        return;
    }
}

function updatePage(info) {
    console.log(info);

    try {
        const playBtn = document.querySelector(
            ".player-controller .main-controllers .play"
        );
        paused = info.paused;

        console.log(paused);

        if (paused) {
            playBtn.className = "fa-solid fa-play play";
        } else playBtn.className = "fa-solid fa-pause play";
    } catch (e) {}
}

function generatePlaylistResult(playlist) {
    playlistSearchResult.replaceChildren();

    const resultPlaylist = playlistTemplate.cloneNode(true);
    resultPlaylist.classList.remove("template");

    const playlistTitle = resultPlaylist.querySelector(".details .title");
    playlistTitle.innerText = playlist.title;
    const playlistAuthor = resultPlaylist.querySelector(".details .author");
    playlistAuthor.innerText = playlist.author.name;

    playlistSearchResult.appendChild(resultPlaylist);
    const playlistVideoContainer = document.querySelector(
        ".playlist-search-section .search-result .playlist .songs"
    );

    playlist.color =
        playlistColors[Math.floor(Math.random() * playlistColors.length)];

    const logo = resultPlaylist.querySelector(".playlist-logo");
    logo.style.backgroundColor = playlist.color;

    for (const videoDetails of playlist.videos) {
        const newVideo = playlistVideoTemplate.cloneNode(true);
        newVideo.classList.remove("template");
        videoDetails.timestamp = videoDetails.duration.timestamp;
        videoDetails.url =
            "https://www.youtube.com/watch?v=" + videoDetails.videoId;

        const title = newVideo.querySelector(".description .title");
        title.innerText = videoDetails.title;

        const author = newVideo.querySelector(".description .details .author");
        author.innerText = videoDetails.author.name;

        const duration = newVideo.querySelector(
            ".description .details .duration"
        );
        duration.innerText = videoDetails.timestamp;

        playlistVideoContainer.append(newVideo);
    }

    resultPlaylist.appendChild(playlistVideoContainer);

    const addPlaylistBtn = resultPlaylist.querySelector(".add-playlist");

    addPlaylistBtn.addEventListener("click", () => {
        socket.emit("save_playlist", playlist);
    });
}

function generateSavedPlaylist(playlists) {
    const playlistTemplate = document.querySelector(".playlist.template");

    let i = 0;
    savedPlaylists = [];

    for (const key in playlists) {
        const newPlaylist = playlistTemplate.cloneNode(true);
        newPlaylist.classList.remove("template");
        const playlistDetails = playlists[key];

        savedPlaylists.push(playlistDetails);

        newPlaylist.setAttribute("index", i);

        const logo = newPlaylist.querySelector(".logo");
        logo.style.backgroundColor = playlistDetails.color;

        const title = newPlaylist.querySelector(".details .title");
        title.innerText = playlistDetails.title;

        const author = newPlaylist.querySelector(".details .author");
        author.innerText = playlistDetails.author.name;

        playlistsSection.appendChild(newPlaylist);

        const selectedPlaylist = logo.querySelector(".selected-playlist");

        selectedPlaylist.addEventListener("mouseenter", (e) => {
            newPlaylist.classList.add("selected");
        });

        selectedPlaylist.addEventListener("mouseout", (e) => {
            newPlaylist.classList.remove("selected");
        });

        selectedPlaylist.addEventListener("click", (e) => {
            const selectedPlaylist =
                savedPlaylists[parseInt(newPlaylist.getAttribute("index"))];

            socket.emit("set_playlist_info", {
                title: selectedPlaylist.title,
                author: selectedPlaylist.author.name,
            });

            socket.emit("set_playlist_songs", selectedPlaylist.videos);
        });

        selectedPlaylist.addEventListener("touchstart", (e) => {
            newPlaylist.classList.add("selected");
        });

        selectedPlaylist.addEventListener("touchend", (e) => {
            newPlaylist.classList.remove("selected");
        });

        i++;
    }
    console.log(playlists);
}

socket.on("search_result", (data) => {
    searchResult.replaceChildren();
    currentPlaylist = {};
    if (searchForm) {
        createSearchResult(data);
    }
});

socket.on("search_playlist_result", (data) => {
    currentPlaylist = data;
    generatePlaylistResult(currentPlaylist);
});

socket.on("update_page", (info) => {
    // console.log(info);
    updatePage(info);
    generateListForQueue(info.songHistory, info.currentSong);
    updateCurrentSong(info.currentSong);
});

function songAddedNotificationShow() {
    songAddedNotification.removeEventListener(
        "transitionend",
        songAddedNotification
    );
    setTimeout(() => {
        songAddedNotification.classList.remove("show");
    }, 500);
}

socket.on("song_added", () => {
    songAddedNotification.classList.add("show");

    songAddedNotification.addEventListener(
        "transitionend",
        songAddedNotificationShow
    );
});

if (playlistsSection) {
    console.log("wyslam");
    socket.emit("get_saved_playlists");
}

socket.on("get_saved_playlists", (playlists) => {
    generateSavedPlaylist(playlists);
});
