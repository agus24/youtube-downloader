var fs = require('fs');
var youtubedl = require('youtube-dl');

var format = "";
var argv = process.argv.slice(2);
if(argv[0] == "audio") {
  format = "bestaudio";
}
else if(argv[0] == "video") {
  format = "mp4";
}

var urls = argv[1];
var dir = "/usr/local/var/www/htdocs/music/music/";
if(argv[2] != undefined) {
  dir = "music/"+argv[2]+"/";
}
var dir = checkDir(dir);

playlist(urls);
function playlist(url) {
    'use strict';
    var video = youtubedl(url,
      [
        "-f "+format
        // "-h"
      ],
      { cwd: __dirname });

    var size = 0;
    video.on('info', function(info) {
      console.log('Download started');
      console.log('filename: ' + info._filename);
      console.log('size: ' + info.size);
        video.pipe(fs.createWriteStream(dir+info.filename, { flags: 'a' }));
        size = info.size;
    });

    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
          var percent = (pos / size * 100).toFixed(2);
          process.stdout.cursorTo(0);
          process.stdout.clearLine(1);
          process.stdout.write(percent + '%(' + pos + "/"+size+")");
        }
    });

    video.on('next', playlist)
}

function checkDir(directory) {
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }
  return directory;
}
