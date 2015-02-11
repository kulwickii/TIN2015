var siofu = require("socketio-file-upload");
var path = require('path');
var app = require('express')()
    .use(siofu.router);
var http = require('http').Server(app);

var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(__dirname + '/'));

var express = require('express');
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + 'bower_components/jquerry'));

var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('a user connected');
    var sessionid = socket.id;
    console.log(sessionid);
    //images.0
    var fs = require('fs');
    fs.readFile('db.json', function(err, data) {
        if(err)
            throw err;
        var json = JSON.parse(data);
        var num = json['num'][0].num;
        var out = '';
        for(var i=0; i<num; i++)
        {
            if(json['files'][i] != null) {
                var ext = json['files'][i].ext;
                var height = json['files'][i].height;
                if(json['files'][i].del == 1) {
                    out += "<div style='position: absolute; left: " + json['files'][i].pos_x + "px; top: " + json['files'][i].pos_y
                        + "px' class='dragg'><div class='resiz' id='" + i + "'><div class='adn'>" + 'usuniety@@' + "</div></div></div>";
                }
                else if(json['files'][i].adn) {
                    out += "<div style='position: absolute; left: " + json['files'][i].pos_x + "px; top: " + json['files'][i].pos_y
                        + "px' class='dragg'><div class='resiz' id='" + i + "'><div class='adn'>" + json['files'][i].adn + "<div style='position: absolute; left: "
                        + (- 10) + "px; top: " + (- 10) + "px' class='del' id='del" + i + "'>Usuń</div></div></div></div>";
                }
                else {
                    out += "<div style='position: absolute; left: " + json['files'][i].pos_x + "px; top: " + json['files'][i].pos_y
                        + "px' class='dragg'><img class='resiz' id='" + i + "' height='" + height + "' src='uploads/" + i + ext + "' /><div style='position: absolute; left: "
                        + (- 10) + "px; top: " + (- 10) + "px' class='del' id='del" + i + "'>Usuń</div></div>";
                }
            }
            else {
                out += "<div class='dragg'></div>";
                
            }
        }
        setTimeout(function() {
            io.sockets.connected[socket.id].emit('images', out);
        }, 500);
    });
    //images.1
    
    //position.0
    socket.on('position', function(obj) {
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            if(err)
                throw err;
            var json = JSON.parse(data);
            
            for(var i=0; i<json['files'].length; i++)
            {
                if(json['files'][i] != null) {
                if(json['files'][i].id == obj.id - 1)
                {
                    json['files'][i].pos_x = obj.pos_x;
                    json['files'][i].pos_y = obj.pos_y;
                    json['files'][i].height = obj.height;
                }}
            }
            
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
        });
        
        io.emit('position set', obj);
    });
    //position.1
    
    //delete.0
    /*socket.on('delete to server', function(obj) {
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            var out = '';
            if(err)
                throw err;
            var json = JSON.parse(data);
            
            for(var i=0; i<json['files'].length; i++)
            {
                out += "<div style='position: absolute; left: " + (json['files'][i].pos_x - 10) + "px; top: " + (json['files'][i].pos_y - 10) + "px' class='del' id='del" + i + "'>Usuń</div>";
            }
            
            setTimeout(function() {
                console.log('server');console.log(sessionid);
                io.sockets.connected[socket.id].emit('delete to client', out);
            }, 500);
            
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
        });
        console.log('server');
    });*/
    //delete.1
    
    socket.on('adnotacja', function(adn) {
        //json.0
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            if(err)
                throw err;
            var json = JSON.parse(data);
            var obj = {
                "id": json['num'][0].num,
                "adn": adn,
                "pos_x": 0.0,
                "pos_y": 0.0,
                "del": 0
            };
            json["files"].push(obj);

            io.emit('images', "<div style='position: absolute' class='dragg'><div class='resiz' id='" + (json['num'][0].num) + "'><div class='adn'>" + adn + "<div style='position: absolute; left: "
                    + (- 10) + "px; top: " + (- 10) + "px' class='del' id='del" + json['num'][0].num + "'>Usuń</div></div></div></div>");

            json['num'][0].num++;
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
        });
        //json.1
    });
    
    var uploader = new siofu();
    uploader.dir = "uploads";
    uploader.listen(socket);
    //saved.0
    uploader.on("saved", function(event) {
        //console.log(event.file);
        var file_name = event.file.name;
        var path_ = 'uploads/' + file_name;
        var ext = path.extname(file_name);
        //json.0
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            if(err)
                throw err;
            var json = JSON.parse(data);
            var path2 = 'uploads/' + json['num'][0].num + ext;
            fs.renameSync(path_, path2);
            var obj = {
                "id": json['num'][0].num,
                "ext": ext,
                "pos_x": 0.0,
                "pos_y": 0.0,
                "height": 250,
                "del": 0
            };
            json["files"].push(obj);
            io.emit('images', "<div style='position: absolute' class='dragg'><img class='resiz' id='" + json['num'][0].num + "' height='" + 250 + "' src='" + path2 + "' /><div style='position: absolute; left: "
                    + (- 10) + "px; top: " + (- 10) + "px' class='del' id='del" + json['num'][0].num + "'>Usuń</div></div>");
            
            json['num'][0].num++;
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
        });
        //json.1
    });
    //saved.1
    
    //delete.0
    var fs = require('fs');
    fs.readFile('db.json', function(err, data) {
        var out = '';
        if(err)
            throw err;
        var json = JSON.parse(data);

        for(var i=0; i<json['files'].length; i++)
        {
            if(json['files'][i] != null) {
                if(json['files'][i].del == 1) {
                    out += "<div style='position: absolute; left: " + (json['files'][i].pos_x - 10) + "px; top: " + (json['files'][i].pos_y - 10) + "px' class='del' id='del" + i + "'>usuniety@@</div>";
                }
                else
                    out += "<div style='position: absolute; left: " + (json['files'][i].pos_x - 10) + "px; top: " + (json['files'][i].pos_y - 10) + "px' class='del' id='del" + i + "'>Usuń</div>";
            }
        }
        setTimeout(function() {
            //io.emit('delete to client', out);
            //io.sockets.connected[socket.id].emit('delete to client', out);
        }, 500);
    });
    
    socket.on('delete item', function(id) {
        var id2 = id.substr(3);
        
        //json.0
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            if(err)
                throw err;
            var json = JSON.parse(data);
            for(var i=0; i<json['files'].length; i++)
            {
                if(json['files'][i] != null) {
                if(id2 == json['files'][i].id) {
                    delete json['files'][i];
                    //for(var j=i; j<json['files'].length; j++) {
                        //json['files'][j] = json['files'][j+1];
                    //}
                }}
            }
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
            io.emit('delete hide', id2);
        });
        //json.1
    });
    //delete.1
});

app.get('/clear', function(req, res) {
        //json.0
        var fs = require('fs');
        fs.readFile('db.json', function(err, data) {
            if(err)
                throw err;
            var json = JSON.parse(data);
            for(var i=0; i<json['files'].length; i++)
            {
                if(json['files'][i] != null)
                    delete json['files'][i];
            }
            //save.0
            fs.writeFile('db.json', JSON.stringify(json, null, 1), function(err) {
                if(err)
                    throw err;
            });
            //save.1
        });
        //json.1
    res.end();
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});