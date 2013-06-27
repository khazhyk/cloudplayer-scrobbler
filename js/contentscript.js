/**
 * contentscripts.js
 * Parses player page and transmit song information to background page
 * Copyright (c) 2011 Alexey Savartsov, <asavartsov@gmail.com>, Brad Lambeth <brad@lambeth.us>
 * Licensed under the MIT license
 */

/**
 * Player class
 *
 * Cloud Player page parser
 */
function Player(parser) {	
    this.has_song = parser._get_has_song();
    this.is_playing = parser._get_is_playing();
    this.song = {
        position: parser._get_song_position(),
        time: parser._get_song_time(),
        title: parser._get_song_title(),
        artist: parser._get_song_artist(),
        album: parser._get_song_album(),
        cover: parser._get_song_cover()
    };
}

/**
 * Constructor for parser class
 * Executes scripts to fetch now playing info from cloudplayer
 * @returns {GoogleMusicParser}
 */
GoogleMusicParser = function() {

};

/**
 * Check whether a song loaded into player widget
 *
 * @return true if some song is loaded, otherwise false
 */
GoogleMusicParser.prototype._get_has_song = function() {
    return $("#playerSongInfo div").hasClass("now-playing-menu-wrapper");
};

/**
 * Checks whether song is playing or paused
 *
 * @return true if song is playing, false if song is paused
 */
GoogleMusicParser.prototype._get_is_playing = function() {
    return is_playing();
};

function is_playing() {
    return $(".player-middle button[data-id='play-pause']").hasClass("playing");
}
/**
 * Get current song playing position
 *
 * @return Playing position in seconds
 */
GoogleMusicParser.prototype._get_song_position = function() {
    var _time = $("#time_container_current").text();
    _time = $.trim(_time).split(':');
    if(_time.length == 2) 
    {
        return (parseInt(_time[0]) * 60 + parseInt(_time[1]));
    }
    else if (_time.length == 3) 
    {
        return (parseInt(_time[0]) * 3600 + parseInt(_time[1]) * 60 + parseInt(_time[2]));
    }
    return null;
};

/**
 * Get current song length
 *
 * @return Song length in seconds
 */
GoogleMusicParser.prototype._get_song_time = function() {
    var _time = $("#time_container_duration").text();
    _time = $.trim(_time).split(':');
    if(_time.length == 2) {
        return (parseInt(_time[0]) * 60 + parseInt(_time[1]));
    } 
    else if (_time.length == 3) 
    {
        return (parseInt(_time[0]) * 3600 + parseInt(_time[1]) * 60 + parseInt(_time[2]));
    }
    return null;
};

/**
 * Get current song title
 *
 * @return Song title
 */
GoogleMusicParser.prototype._get_song_title = function() {
    // the text inside the div located inside element with id="playerSongTitle"
    return $("#playerSongTitle").text();
};

/**
 * Get current song artist
 *
 * @return Song artist
 */
GoogleMusicParser.prototype._get_song_artist = function() {
    return $("#player-artist").text();
};

/**
 * Get current song artwork
 *
 * @return Image URL or default artwork
 */
GoogleMusicParser.prototype._get_song_cover = function() {
    var albumImg = $("#playingAlbumArt").attr("src");
    if (albumImg)
        return ("http:" + albumImg);
    return null;
};

/**
 * Get current song album name
 *
 * @return Album name or null
 */
GoogleMusicParser.prototype._get_song_album = function() {
    return $("#playerSongInfo .player-artist-album-wrapper .player-album").text();
};

var port = chrome.extension.connect({name: "cloudplayer"});

window.setInterval(function() {
    port.postMessage(new Player(new GoogleMusicParser()));
}, 
5000);	


chrome.extension.onMessage.addListener(toggle_play);
chrome.extension.onMessage.addListener(next_song);

function toggle_play(request, sndr, callback) {
    if (request.cmd == "toggle_play") {
        $(".player-middle button[data-id='play-pause']").click();
        port.postMessage(new Player(new GoogleMusicParser()));
        callback(is_playing());
    }
}

function next_song(request, sndr, callback) {
    if (request.cmd == "next_song") {
        $(".player-middle button[data-id='forward']").click();
        port.postMessage(new Player(new GoogleMusicParser()));
        callback(new Player(new GoogleMusicParser()));
    }
}
