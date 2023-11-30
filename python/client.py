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
        player.set_playlist_info("Your creation", "YOU")


@sio.on("play_python")
def play_song():
    player.play()


@sio.on("pause_python")
def pause_song():
    player.pause()


@sio.on("skip_python")
def skip_song():
    player.skip()
    sio.emit("sending_player_info", player.get_player_info())


@sio.on("change_volume_python")
def skip_song(volume):
    player.set_volume(volume)


@sio.on("set_playlist_info_python")
def set_playlist(info):
    # print(playlist)]
    player.set_playlist_info(info['title'], info['author'], info['color'], info['listId'])


@sio.on("set_playlist_songs_python")
def set_playlist_songs(songs):
    if player.set_songList_from_playlist(songs):
        sio.emit("playlist_added_to_queue")


@sio.on("get_player_info_python")
def get_player_info():
    sio.emit("sending_player_info", player.get_player_info())


@sio.on("previous_song_python")
def previous_song():
    player.previous_song()


@sio.on("change_looped_python")
def change_looped():
    player.change_looped()


@sio.on("change_shuffle_python")
def change_shuffle():
    player.change_shuffle()


@sio.on("get_player_timeline_python")
def get_player_timeline():
    sio.emit("sending_player_timeline", player.get_player_timeline())


@sio.on("reset_player_python")
def reset_player():
    player.pause()
    player.reset_player()


@sio.on("set_song_index_python")
def set_song_index(index):
    player.set_song_index(index)


while (True):
    time.sleep(1)
    player.check_status()
