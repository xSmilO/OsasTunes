const playlistList = document.querySelector(".search-section .playlist-list");

const playlistSearchResult = document.querySelector(
    ".playlist-search-section .search-result"
);
const playlistTemplate = document.querySelector(".playlist.template");
const playlistVideoTemplate = document.querySelector(".video.template");
const playlistsSection = document.querySelector(".playlists-section");
const searchResult = document.querySelector(".search-result");
const videoResultTemplate = document.querySelector(
    ".search-result .video.template"
);
const favoriteSection = document.querySelector(
    ".main-container .favorite-section"
);
const favoriteSongTemplate = document.querySelector(".favorite-song.template");
const favoriteSongsSection = document.querySelector(".favorite-section .songs");

const timeline = document.querySelector(
    ".player .player-timeline .progress-bar"
);

const editPlaylistSection = document.querySelector(".edit-playlist-section");
const editPlaylistSongsSection = document.querySelector(
    ".edit-playlist-section .playlist .songs"
);
const editPlaylistSong = document.querySelector(".song.template");

if (editPlaylistSection) {
    const closeBtn = editPlaylistSection.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        editPlaylistSection.classList.remove("show");
    });
}

if (favoriteSection) {
    const addPlaylistBtn = favoriteSection.querySelector(".add-playlist");
    addPlaylistBtn.addEventListener("click", () => {
        socket.emit("set_playlist_songs", result);
        socket.emit("set_playlist_info", {
            title: "Your favorite songs",
            author: "You",
            color: "#ffc745",
        });
    });
}

let selectedSong = null;

function addSongToQueue(elem) {
    const videoIndex = parseInt(elem.getAttribute("video-index"));
    // console.log(videoIndex);
    // console.log(result[videoIndex]);
    socket.emit("add_song", result[videoIndex]);
}

function addSongToFavorite(elem) {
    const videoIndex = parseInt(elem.getAttribute("video-index"));
    socket.emit("save_song", result[videoIndex]);
}

function removeSongFromFavorite(songId) {
    socket.emit("remove_favorite_song", songId);
}

function showPlaylistList(event, song) {
    selectedSong = song;
    playlistList.classList.toggle("hidden");
    const elementRect = event.target.getBoundingClientRect();
    const sectionRect = searchSection.getBoundingClientRect();
    playlistList.style.top = elementRect.top + "px";
    playlistList.style.left =
        elementRect.left - sectionRect.left - playlistList.offsetWidth + "px";
}

class Generate {
    static async searchResult(videos) {
        let index = 0;
        socket.emit("get_saved_playlists");
        for (const videoDetails of videos) {
            const newVideo = videoResultTemplate.cloneNode(true);
            newVideo.className = "video";

            const title = newVideo.querySelector(".description .title");
            title.innerText = videoDetails.title;

            const author = newVideo.querySelector(
                ".description .details .author"
            );
            author.innerText = videoDetails.author.name;

            const duration = newVideo.querySelector(
                ".description .details .duration"
            );
            duration.innerText = videoDetails.timestamp;

            const addVideo = newVideo.querySelector(".buttons .add");
            newVideo.setAttribute("video-index", index);
            addVideo.addEventListener("click", () => {
                addSongToQueue(newVideo);
            });

            const heart = newVideo.querySelector(".buttons .heart");
            if (favoriteSongs[videoDetails.videoId])
                heart.classList.add("favorite");

            heart.addEventListener("click", () => {
                addSongToFavorite(newVideo);
            });

            const addToPlaylist = newVideo.querySelector(".buttons .add-to");

            addToPlaylist.addEventListener("click", (e) => {
                showPlaylistList(e, videoDetails);
            });

            index++;
            searchResult.appendChild(newVideo);
        }

        return videos;
    }

    static async playlistsList(playlists) {
        // console.log("Playlistst");
        // console.log(playlists);
        playlistList.replaceChildren();
        // playlistList.classList.remove("hidden");
        for (let playlistKey of Object.keys(playlists)) {
            const div = document.createElement("div");
            const playlist = playlists[playlistKey];
            div.className = "playlist";
            div.setAttribute("playlist-id", playlistKey);
            div.innerText = playlist.title;
            playlistList.appendChild(div);
            div.addEventListener("click", () => {
                console.log("dodalem");
                console.log(selectedSong);
                console.log(playlistKey);
                socket.emit("add_song_to_playlist", {
                    song: selectedSong,
                    playlistId: playlistKey,
                });
            });
        }
    }

    static async playlistResult(playlist) {
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

        let index = 0;

        for (const videoDetails of playlist.videos) {
            const newVideo = playlistVideoTemplate.cloneNode(true);
            newVideo.classList.remove("template");
            newVideo.setAttribute("video-index", index);

            videoDetails.timestamp = videoDetails.duration.timestamp;
            videoDetails.url =
                "https://www.youtube.com/watch?v=" + videoDetails.videoId;

            const title = newVideo.querySelector(".description .title");
            title.innerText = videoDetails.title;

            const author = newVideo.querySelector(
                ".description .details .author"
            );
            author.innerText = videoDetails.author.name;

            const duration = newVideo.querySelector(
                ".description .details .duration"
            );
            duration.innerText = videoDetails.timestamp;

            const addVideo = newVideo.querySelector(".buttons .add");
            addVideo.addEventListener("click", () => {
                addSongToQueue(newVideo);
            });

            playlistVideoContainer.append(newVideo);
            index++;
        }

        resultPlaylist.appendChild(playlistVideoContainer);

        const addPlaylistBtn = resultPlaylist.querySelector(".add-playlist");

        addPlaylistBtn.addEventListener("click", () => {
            socket.emit("save_playlist", playlist);
        });

        return playlist.videos;
    }

    static async savedPlaylists(savedPlaylists, playlists) {
        const playlistTemplate = document.querySelector(".playlist.template");
        playlistsSection.replaceChildren();
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

            selectedPlaylist.addEventListener("click", (e) => {
                newPlaylist.classList.toggle("selected");
            });

            const addBtn = selectedPlaylist.querySelector(".add");
            const editBtn = selectedPlaylist.querySelector(".edit");
            const removeBtn = selectedPlaylist.querySelector(".remove");

            removeBtn.addEventListener("transitionend", (e) => {
                console.log("transistion end ");
                selectedPlaylist.classList.toggle("hide");

                if (selectedPlaylist.classList.contains("hide")) {
                    addBtn.style.pointerEvents = "all";
                    editBtn.style.pointerEvents = "all";
                    removeBtn.style.pointerEvents = "all";
                } else {
                    addBtn.style.pointerEvents = "none";
                    editBtn.style.pointerEvents = "none";
                    removeBtn.style.pointerEvents = "none";
                }
            });

            removeBtn.addEventListener("transitioncancel", (e) => {
                // console.log("cancelujesz ja co jest");
                setTimeout(() => {
                    if (selectedPlaylist.classList.contains("hide")) {
                        // console.log("nie posicaida");
                        selectedPlaylist.classList.remove("hide");
                        addBtn.style.pointerEvents = "all";
                        editBtn.style.pointerEvents = "all";
                        removeBtn.style.pointerEvents = "all";
                    } else {
                        selectedPlaylist.classList.add("hide");
                        addBtn.style.pointerEvents = "none";
                        editBtn.style.pointerEvents = "none";
                        removeBtn.style.pointerEvents = "none";
                    }
                }, 200);
            });

            addBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                const selectedPlaylist =
                    savedPlaylists[parseInt(newPlaylist.getAttribute("index"))];

                socket.emit("set_playlist_songs", selectedPlaylist.videos);
                socket.emit("set_playlist_info", {
                    title: selectedPlaylist.title,
                    author: selectedPlaylist.author.name,
                    color: selectedPlaylist.color,
                });
            });

            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const selectedPlaylist =
                    savedPlaylists[parseInt(newPlaylist.getAttribute("index"))];
                editPlaylistSection.classList.add("show");
                newPlaylist.classList.remove("selected");

                Generate.updateEditPlaylistSection(selectedPlaylist);
            });

            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const selectedPlaylist =
                    savedPlaylists[parseInt(newPlaylist.getAttribute("index"))];

                socket.emit("remove_playlist", selectedPlaylist);
            });

            i++;
        }
    }

    static async listForQueue(
        songList,
        currentSong,
        playlistName,
        playlistAuthor,
        playlistColor
    ) {
        try {
            const playlistSongs = document.querySelector(
                ".player-section .playlist-songs"
            );
            if (!playlistSongs) return;

            playlistSongs.replaceChildren();

            const playlistDetails = document.querySelector(
                ".player-section .playlist"
            );
            const logo = playlistDetails.querySelector(".logo");
            logo.style.backgroundColor = playlistColor;

            const title = playlistDetails.querySelector(".title");
            title.innerText = playlistName;

            const author = playlistDetails.querySelector(".author");
            author.innerText = playlistAuthor;

            const playlistSongTemplate =
                document.querySelector(" .song.template");
            let index = 0;
            for (const songDetails of songList) {
                if (!songDetails) continue;
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

                song.setAttribute("index", index);

                title.addEventListener("click", (e) => {
                    socket.emit(
                        "set_song_index",
                        parseInt(song.getAttribute("index"))
                    );
                });
                index++;
            }
        } catch (e) {
            // console.error(e);
            return;
        }
    }

    static async updateCurrentSong(song) {
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

    static async favoriteSongs(songs) {
        favoriteSongsSection.replaceChildren();
        let index = 0;

        const songsArr = [];

        for (const songId in songs) {
            const newVideo = favoriteSongTemplate.cloneNode(true);
            newVideo.classList.remove("template");
            const songDetails = songs[songId];
            songsArr.push(songDetails);

            const title = newVideo.querySelector(".description .title");
            title.innerText = songDetails.title;

            const author = newVideo.querySelector(
                ".description .details .author"
            );
            author.innerText = songDetails.author.name;

            const duration = newVideo.querySelector(
                ".description .details .duration"
            );
            duration.innerText = songDetails.timestamp;

            const addVideo = newVideo.querySelector(".buttons .add");
            newVideo.setAttribute("video-index", index);
            addVideo.addEventListener("click", () => {
                addSongToQueue(newVideo);
            });

            const heart = newVideo.querySelector(".buttons .heart");
            heart.classList.add("favorite");
            heart.addEventListener("click", () => {
                removeSongFromFavorite(songDetails.videoId);
                // addSongToFavorite(newVideo);
            });

            index++;
            favoriteSongsSection.appendChild(newVideo);
        }

        return songsArr;
    }

    static async updatePage(info, playBtn, paused) {
        // console.log(info);

        try {
            playBtn = document.querySelector(
                ".player-controller .main-controllers .play"
            );
            paused = info.paused;
            if (paused) {
                playBtn.className = "fa-solid fa-play play";
            } else playBtn.className = "fa-solid fa-pause play";

            if (info.looped) loopBtn.classList.add("active");
            else loopBtn.classList.remove("active");

            if (info.shuffle) shuffleBtn.classList.add("active");
            else shuffleBtn.classList.remove("active");
            return paused;
        } catch (e) {
            console.error(e);
        }
    }

    static async updateTimeline(currentTime) {
        if (timeline)
            timeline.style.transform = `translateX(-${
                100 - currentTime * 100
            }%)`;
    }

    static async updateEditPlaylistSection(playlist) {
        console.log(playlist);
        editPlaylistSongsSection.replaceChildren();
        const playlistTitle =
            editPlaylistSection.querySelector(".details .title");
        playlistTitle.value = playlist.title;

        const playlistAuthor =
            editPlaylistSection.querySelector(".details .author");
        playlistAuthor.value = playlist.author.name;

        let i = 0;
        result = playlist.videos;
        console.log(playlist);

        for (const song of playlist.videos) {
            const newSong = editPlaylistSong.cloneNode(true);
            newSong.classList.remove("template");
            newSong.setAttribute("video-index", i);

            const title = newSong.querySelector(".description .title");
            title.innerText = song.title;

            const author = newSong.querySelector(
                ".description .details .author"
            );
            author.innerText = song.author.name;

            const duration = newSong.querySelector(
                ".description .details .duration"
            );
            duration.innerText = song.timestamp;

            const addBtn = newSong.querySelector(".buttons .add");
            addBtn.addEventListener("click", () => {
                addSongToQueue(newSong);
                Animate.songAdded();
            });

            const removeBtn = newSong.querySelector(".buttons .remove");
            removeBtn.addEventListener("click", () => {
                socket.emit("remove_song_from_playlist", {
                    song_index: parseInt(newSong.getAttribute("video-index")),
                    playlist: playlist,
                });
            });
            i++;
            editPlaylistSongsSection.appendChild(newSong);
        }

        const titleInput = editPlaylistSection.querySelector(
            ".playlist .details form .title"
        );
        const authorInput = editPlaylistSection.querySelector(
            ".playlist .details form .author"
        );

        titleInput.addEventListener("focusout", (e) => {
            if (titleInput.value) {
                console.log(titleInput.value);
                console.log(playlist);
                socket.emit("change_playlist_name", {
                    playlist: playlist,
                    value: titleInput.value,
                });
            }
        });

        authorInput.addEventListener("focusout", (e) => {
            console.log(authorInput.value);
            if (authorInput.value) {
                socket.emit("change_playlist_author", {
                    playlist: playlist,
                    value: authorInput.value,
                });
            }
        });
    }
}
