import pafy
import vlc
import time


class Player:
    def __init__(self):
        self.Instance = vlc.Instance("--no-video prefer-insecure")
        self.player = self.Instance.media_player_new()
        self.songList = []
        self.songHistory = []
        self.Media = None
        self.paused = True
        self.lastLong = None
        self.currentSong = None
        self.volume = 50
        self.skipped = False
        self.playlistName = ""
        self.playlistAuthor = ""

    def add_song(self, song):
        print("song added")
        self.songList.append(song)
        self.songHistory.append(song)
        return True

    def play(self):
        if not self.songList:
            return
        if self.paused and self.currentSong and self.player.is_playing() == False and self.skipped == False:
            print("kontynuacja")
            self.player.play()
            self.paused = False
        else:
            print("pierwszy raz")
            self.paused = False
            self.currentSong = self.songList[0]
            video = pafy.new(self.currentSong['url'])
            best = video.getbest()
            playurl = best.url

            self.Media = self.Instance.media_new(playurl)
            self.player.set_media(self.Media)
            self.player.play()
            self.player.audio_set_delay(2000)
            self.player.audio_set_volume(self.volume)

        time.sleep(5)
        while self.player.is_playing():
            time.sleep(2)

        self.skipped = False
        time.sleep(1)

        if self.songList and self.paused == False and self.player.is_playing() == False:
            print("nastepna nuta")
            self.skip()

    def pause(self):
        self.player.pause()
        self.paused = True

    def skip(self):
        self.player.stop()
        self.paused = False
        self.skipped = True
        self.lastLong = self.currentSong
        self.songList.pop(0)
        if not self.songList:
            self.paused = True
            self.currentSong = None
        else:
            self.currentSong = self.songList[0]
        self.play()

    def set_volume(self, volume):
        self.volume = volume
        self.player.audio_set_volume(self.volume)

    # def check_player_state(self):
    #     if self.player.is_playing():
    #         return False
    #     if self.songList and self.Media and self.paused == False and self.skipped == False:
    #         self.skip()
    #         return True

    def get_player_info(self):
        info = {}
        info["currentSong"] = self.currentSong
        info["paused"] = self.paused
        info["lastSong"] = self.lastLong
        info["songList"] = self.songList
        info["volume"] = self.player.audio_get_volume()
        info["songHistory"] = self.songHistory
        info["playlistName"] = self.playlistName
        info["playlistAuthor"] = self.playlistAuthor

        return info

    def set_playlist_info(self, title, author):
        self.playlistName = title
        self.playlistAuthor = author

    def set_songList_from_playlist(self, songs):
        self.reset_player()
        self.pause()
        for song in songs:
            self.songList.append(song)
            self.songHistory.append(song)

    def reset_player(self):
        self.songList = []
        self.songHistory = []
        self.Media = None
        self.paused = True
        self.lastLong = None
        self.currentSong = None
        self.volume = 50
        self.skipped = False
        self.playlistName = ""
        self.playlistAuthor = ""
