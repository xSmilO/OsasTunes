import socketio
import time
from Player import Player

sio = socketio.Client()

sio.connect("http://localhost:3001")

player = Player()
looped = True


@sio.on("connected")
def connect():
    print("I'm connected!")


@sio.event
def connect_error(data):
    print("The connection failed!")


@sio.event
def disconnect():
    print("I'm disconnected!")
    looped = False


@sio.on("stop_socket")
def stop_socket():
    sio.disconnect()


@sio.on("reset_python")
def reset():
    player.player.stop()
    player = Player()


@sio.on("add_song_python")
def add_song(song):
    if player.add_song(song):
        sio.emit("song_added")


@sio.on("play_python")
def play_song():
    player.play()


@sio.on("pause_python")
def pause_song():
    player.pause()


@sio.on("skip_python")
def skip_song():
    player.skip()
    time.sleep(1)
    sio.emit("sending_player_info", player.get_player_info())


@sio.on("change_volume_python")
def skip_song(volume):
    player.set_volume(volume)


@sio.on("set_playlist_info_python")
def set_playlist(info):
    # print(playlist)]
    player.set_playlist_info(info['title'], info['author'])


@sio.on("set_playlist_songs_python")
def set_playlist_songs(songs):
    player.set_songList_from_playlist(songs)


@sio.on("get_player_info_python")
def get_player_info():
    sio.emit("sending_player_info", player.get_player_info())


while looped:
    time.sleep(5)
    sio.emit("sending_player_info", player.get_player_info())
