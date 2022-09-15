const homeBtn = document.querySelector(".navigation .home");
const playlistBtn = document.querySelector(".navigation .playlist");
const navigationBtn = document.querySelector(".navigation-btn");
const navigation = document.querySelector(".navigation");

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
