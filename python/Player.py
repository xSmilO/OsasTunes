import pafy
import vlc
import time
from random import randint


class Player:
    def __init__(self):
        self.Instance = vlc.Instance(["--no-video", "prefer-insecure"])
        self.player = self.Instance.media_player_new()
        self.songList = []
        # self.songHistory = []
        self.Media = None
        self.paused = True
        self.currentSong = None
        self.volume = 30
        self.skipped = False
        self.playlistName = ""
        self.playlistAuthor = ""
        self.color = "#9adcff"
        self.wait_time = 0
        self.song_index = 0
        self.looped = False
        self.shuffle = False

    def add_song(self, song):
        print("song added")
        self.songList.append(song)
        # self.songHistory.append(song)
        return True

    def play(self):
        if self.song_index >= len(self.songList):
            self.reset_player()
            return
        if self.paused and self.currentSong and self.player.is_playing() == False and self.skipped == False:
            print("kontynuacja")
            self.player.play()
            self.paused = False
        else:
            try:
                self.wait_time = 0
                print("pierwszy raz")
                self.paused = False
                self.currentSong = self.songList[self.song_index]
                video = pafy.new(self.currentSong['url'])
                best = video.getbest()
                playurl = best.url

                self.Media = self.Instance.media_new(playurl)
                self.player.set_media(self.Media)
                self.player.play()
                self.player.audio_set_delay(2000)
                self.player.audio_set_volume(self.volume)
            except err:
                print("ERROR: ", err)
                self.skip()
        while self.wait_time < 5 or self.player.is_playing():
            self.wait_time += 1
            time.sleep(2)

        self.skipped = False

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
        if self.looped == False:
            self.song_index += 1
        if self.shuffle:
            self.song_index = randint(0, len(self.songList) - 1)
        if self.song_index >= len(self.songList):
            self.paused = True
            self.currentSong = None
        else:
            self.currentSong = self.songList[self.song_index]
        self.play()

    def previous_song(self):
        if self.song_index <= 0:
            return
        self.player.stop()
        self.paused = False
        self.skipped = True
        self.song_index -= 1
        self.currentSong = self.songList[self.song_index]
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
        info["songList"] = self.songList
        info["volume"] = self.player.audio_get_volume()
        info["playlistName"] = self.playlistName
        info["playlistAuthor"] = self.playlistAuthor
        info["color"] = self.color
        info["looped"] = self.looped
        info["shuffle"] = self.shuffle

        return info

    def set_playlist_info(self, title, author, color="#fd7014"):
        self.playlistName = title
        self.playlistAuthor = author
        self.color = color

    def set_songList_from_playlist(self, songs):
        self.reset_player()
        self.pause()
        for song in songs:
            self.songList.append(song)

        return True

    def change_looped(self):
        self.shuffle = False
        self.looped = ~ self.looped

    def change_shuffle(self):
        self.looped = False
        self.shuffle = ~ self.shuffle

    def get_player_timeline(self):
        # timeline = {}
        # timeline["current_position"] = self.player.get_time()
        # timeline["track_length"] = self.player.get_length()
        return self.player.get_position()

    def reset_player(self):
        self.songList = []
        self.Media = None
        self.paused = True
        self.currentSong = None
        self.skipped = False
        self.playlistName = ""
        self.playlistAuthor = ""
        self.song_index = 0
        self.looped = False
        self.shuffle = False
