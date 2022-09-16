const homeBtn = document.querySelector(".navigation .home");
const playlistBtn = document.querySelector(".navigation .playlist");
const navigationBtn = document.querySelector(".navigation-btn");
const navigation = document.querySelector(".navigation");
const playlistSavedNotification = document.querySelector(
    ".playlist-search-section .playlist-saved"
);
const playlistAddedNotification = document.querySelector(
    ".main-container .playlist-added"
);
const songAddedNotification = document.querySelector(
    ".search-section .song-added"
);

playlistBtn.addEventListener("click", () => {
    playlistBtn.classList.toggle("active");
});

homeBtn.addEventListener("click", () => {
    homeBtn.classList.toggle("active");
});

navigationBtn.addEventListener("click", () => {
    navigationBtn.classList.remove("hide");
    if (navigationBtn.classList[3]) {
        navigationBtn.classList.add("hide");
    }

    navigationBtn.classList.toggle("show");
    navigation.classList.toggle("show");
});

class Animate {
    static async playlistAddedShow() {
        playlistAddedNotification.removeEventListener(
            "transitionend",
            Animate.playlistAddedShow
        );

        setTimeout(() => {
            playlistAddedNotification.classList.remove("show");
        }, 500);
    }

    static async playlistSavedShow() {
        playlistSavedNotification.removeEventListener(
            "transitionend",
            Animate.playlistSavedShow
        );

        setTimeout(() => {
            playlistSavedNotification.classList.remove("show");
        }, 500);
    }

    static async songAddedShow() {
        songAddedNotification.removeEventListener(
            "transitionend",
            Animate.songAddedShow
        );
        setTimeout(() => {
            songAddedNotification.classList.remove("show");
        }, 500);
    }

    static async playlistAdded() {
        if (!playlistAddedNotification) return;

        playlistAddedNotification.classList.add("show");

        playlistAddedNotification.addEventListener(
            "transitionend",
            Animate.playlistAddedShow()
        );
    }

    static async playlistSaved() {
        if (!playlistSavedNotification) return;

        playlistSavedNotification.classList.add("show");

        playlistSavedNotification.addEventListener(
            "transitionend",
            Animate.playlistSavedShow
        );
    }

    static async songAdded() {
        console.log("kurwa");
        if (!songAddedNotification) return;
        songAddedNotification.classList.add("show");

        songAddedNotification.addEventListener(
            "transitionend",
            Animate.songAddedShow
        );
    }
}
