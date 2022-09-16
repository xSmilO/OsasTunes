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

class Generate {
    static async searchResult(result, videos) {
        let index = 0;
        result = videos;

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
            addVideo.setAttribute("video-index", index);
            addVideo.addEventListener("click", (e) => {
                addVideoToQueue(e);
            });

            index++;
            searchResult.appendChild(newVideo);
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

        for (const videoDetails of playlist.videos) {
            const newVideo = playlistVideoTemplate.cloneNode(true);
            newVideo.classList.remove("template");
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

            playlistVideoContainer.append(newVideo);
        }

        resultPlaylist.appendChild(playlistVideoContainer);

        const addPlaylistBtn = resultPlaylist.querySelector(".add-playlist");

        addPlaylistBtn.addEventListener("click", () => {
            socket.emit("save_playlist", playlist);
        });
    }

    static async savedPlaylists(savedPlaylists, playlists) {
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

                socket.emit("set_playlist_songs", selectedPlaylist.videos);
                socket.emit("set_playlist_info", {
                    title: selectedPlaylist.title,
                    author: selectedPlaylist.author.name,
                    color: selectedPlaylist.color,
                });
            });

            selectedPlaylist.addEventListener("touchstart", (e) => {
                newPlaylist.classList.add("selected");
            });

            selectedPlaylist.addEventListener("touchend", (e) => {
                newPlaylist.classList.remove("selected");
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
            console.error(e);
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

    static async updatePage(info, playBtn, paused) {
        console.log(info);

        try {
            playBtn = document.querySelector(
                ".player-controller .main-controllers .play"
            );
            paused = info.paused;

            if (paused) {
                playBtn.className = "fa-solid fa-play play";
            } else playBtn.className = "fa-solid fa-pause play";

            return paused;
        } catch (e) {
            console.error(e);
        }
    }
}
