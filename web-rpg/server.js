var app = require('express')();
// var cors = require('cors');
var server  = require('http').Server(app);
var io      = require('socket.io')(server, {
   cors: {
    origin: "http://my-web-projects",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
var fs = require('fs');

server.listen(777);


/* Объявление переменных, функций и объектов */

var rooms = [];
var mapSize = 2500;

function MyLog(_type, _text) {
    if (_type == "w") {
        fs.appendFile('log.log', _text, function (err) {
            if (err) throw err;
        });
    } else if (_type == "n") {
        fs.writeFile('log.log', _text, function (err) {
            if (err) throw err;
        });
    }
}

function generateID() {
    let result       = '';
    let words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let max_position = words.length - 1;
        for( i = 0; i <= 10; ++i ) {
            position = Math.floor ( Math.random() * max_position );
            result = result + words.substring(position, position + 1);
        }
    return result;
}

function escapeHtml(text) {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
  
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function setName(_name, _obj = null) {
    if (_obj != null) {
        if (_obj.name != _name) {
            _obj.name = escapeHtml(_name);
        }
    } else {
        return escapeHtml(_name);
    }
  }

  function setXYC(_xyc, _obj) {
    _obj.x = _xyc.x;
    _obj.y = _xyc.y;
    _obj.pos = {x: _xyc.x, y: _xyc.y, z: 0};
    _obj.gclass = _xyc.c;
  }

function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

//console.clear();
console.log("Server was started."); /* "\x1b[32m", */
MyLog("n", "Server was started.\n");


/* Update */

/* Когда игрок присоединился */
io.on('connection', function(socket) {

    var first_connect = true,
        player, 
        room_name, 
        room_limit = 3,
        clientSpawned = false;

    var player = new function() {
            this.name    = "Player";
            this.gclass  = null;
            this.id      = socket.client.id;
            this.room    = null;
            this.x       = random(20, mapSize);
            this.y       = random(20, mapSize);
            let _posx    = this.x, _posy = this.y;
            this.speed   = 4;
            this.health  = 10000;
            this.pos     = {x: _posx, y: _posy, z: 0};
            this.old_pos = {x: _posx, y: _posy, z: 0};
        };

    function online(_roomName = null) {
        let _room;

        if (_roomName == null || _roomName == undefined)
            _room = rooms.find(element => element.rname == room_name);
        else 
            _room = rooms.find(element => element.rname == _roomName);

        if (_room != undefined || _room != null) 
            return _room.players.length;
        else
            return 0;
    }

    function sendOnline() {
        io.in(room_name).emit('update_server', {set: "online", obj: `Room: ${player.room} | Online: [${online(player.room)}/${room_limit}]`});
    }

    function _playerForDraw(_obj = undefined) {
        let _pfd = {};
        if (_obj == undefined)
            Object.assign(_pfd, player);
        else
            Object.assign(_pfd, _obj);
        delete _pfd.room;
        delete _pfd.old_pos;
        return _pfd;
    };

    function mapGeneration() {
        let _trees = [];
        let trees_count = 25;
        let seed = random(1, 4);
        for (let i = 1; i <= trees_count; i++) {
            _trees.push({x: random(200, mapSize-200),  y: random(200, mapSize-200)});
        }
        return {t: _trees, m: seed};
    }

    function NewRoom(_obj) {
        room_name = generateID();
        let map = mapGeneration();
        rooms.push({rname: room_name, smap: map, players: [player]});
        socket.join(room_name);
        setName(_obj.name, player);
        player.room   = room_name;
        player.gclass = _obj._gclass;
        clientSpawned = true;
        MyLog("w", `\n${player.name} was connected to room |${room_name}| [${online(room_name)}/${room_limit}]\nPerson Class: ${player.gclass}`);
        // console.log(`\n${player.name} was connected to room |${room_name}| [${online()}/${room_limit}]`);
        // console.log(player);
        socket.emit('server spawned', {p: _playerForDraw(), t: map.t, m: map.m});
    }

    function connect(_obj) {
        if (rooms.length > 0) { let connected = false;
            for (let room in rooms) {
                if (online(rooms[room].rname) >= room_limit) continue;
                room_name     = rooms[room].rname;
                socket.join(room_name);
                rooms[room].players.push(player);
                setName(_obj.name, player);
                player.room   = room_name;
                player.gclass = _obj._gclass;
                connected     = true;
                MyLog("w", `\n${player.name} was connected to room |${room_name}| [${online(room_name)}/${room_limit}]`);
                let playersForDraw = [];
                console.debug(rooms[room].players);
                rooms[room].players.forEach(function(item, i, arr)
                {
                    if (item != player)
                        playersForDraw.push(_playerForDraw(item));
                });
                socket.emit('server spawned', {p: _playerForDraw(), t: rooms[room].smap.t, m: rooms[room].smap.m, players: playersForDraw});
                socket.to(room_name).emit('new player', _playerForDraw()); 
                // socket.to(room_name).emit('get players', socket.client.id);
                break;
            }
            if (!connected) NewRoom(_obj);
        } else {
            NewRoom(_obj);
        } first_connect = false; clientSpawned = true;
    }

    function respawn(_obj) {
        setName(_obj.name, player);
        setXYC({c: _obj._gclass, x: random(20, mapSize), y: random(20, mapSize)}, player);
        MyLog("w", `\n${player.name} was respawned: `); 
        socket.emit('server spawned', {p: _playerForDraw()});
        socket.to(room_name).emit('new player', _playerForDraw());  
    }


    /* Игрок хочет получить всех игроков в комнате */
    // socket.on('get players', function(_id) { if (!clientSpawned) return;
    //     // socket.broadcast.to(_id).emit('new player', _playerForDraw()); 
    //     socket.emit('sends new player', _playerForDraw()); 
    // }); /* get players */

    /* Игрок нажал кнопку начала игры */
    socket.on('client spawned', function(_spawned) { if (clientSpawned) return;
        if (first_connect) {
            connect(_spawned);
            sendOnline();
        } else {
            respawn(_spawned);
        }
    }); /* client spawned */


    /* Отправить новых пользователей игроку который первый раз заспавнился */
    socket.on('new player', function(_id) { 
        io.to(_id).emit('new player', _playerForDraw());  
    }); /* send new players */


    /* Обновление игровых данных */
    socket.on('update', function(_set) {
        if (!_set.set || !_set.obj) return;

        switch (_set.set) {
            case "pos": 
                if (_set.obj.x != null && _set.obj.x != undefined && _set.obj.y != null && _set.obj.y != undefined 
                                               && _set.obj.x > 0 && _set.obj.x < mapSize && _set.obj.y > 0 && _set.obj.y < mapSize) {
                            player.old_pos = player.pos;
                            player.pos     = {x: _set.obj.pos.x, y: _set.obj.pos.y}; 
                            player.x       = _set.obj.x-23; 
                            player.y       = _set.obj.y-23; 
                            MyLog("w", `${player.name}: x = ${Math.round(player.pos.x)} | y = ${Math.round(player.pos.y)}\n`);
                        }
                io.in(room_name).emit('update_server', {set: _set.set, obj: _playerForDraw()});   
            break;
            case "xy": 
                if (!_set.obj.x || !_set.obj.y) break;
                player.x = _set.obj.x; player.y = _set.obj.y;
                io.in(room_name).emit('update_server', {set: _set.set, obj: _playerForDraw()});   
            break;
            case "afk": 
                player.x = player.old_pos.x; player.y = player.old_pos.y; player.pos = {x: player.old_pos.x, y: player.old_pos.y}; _set.set = "pos";
                io.in(room_name).emit('update_server', {set: _set.set, obj: _playerForDraw()});   
            break;
            case "tp": 
                if (_set.obj.x != null && _set.obj.x != undefined && _set.obj.y != null && _set.obj.y != undefined 
                            && _set.obj.x > 0 && _set.obj.x < mapSize && _set.obj.y > 0 && _set.obj.y < mapSize) {
                    player.x = _set.obj.x; player.y = _set.obj.y; player.pos.x = _set.obj.x; player.pos.y = _set.obj.y;
                }
                io.in(room_name).emit('update_server', {set: _set.set, obj: _playerForDraw()});   
            break;
            case "cast":
                io.in(room_name).emit('update_server', {set: _set.set, obj: _set.obj});
            break;
            case "damage": 
                if (_set.obj.cast == 1)
                    _set.obj.damage = 2000;
                else
                    _set.obj.damage = 1000;
                io.in(room_name).emit('update_server', {set: _set.set, obj: _set.obj});
            break;
            case "die":
                clientSpawned = false;
                io.in(room_name).emit('update_server', {set: _set.set, obj: _set.obj});
            break;
        }
    }); /* update*/


    /* Когда игрок отключился */
    socket.on('disconnect', function(data) { if (player.room == null) return;

        socket.to(room_name).emit('player disconnected', player.id); 
        if (rooms[room_name].players.includes(player)) 
            rooms[room_name].players.splice(player, 1);
        sendOnline();
        socket.leave(room_name);
        _ro = online();
        if (_ro != 0)
            MyLog("w", `\n${player.name} was disconnected from the room |${room_name}| [${_ro}/${room_limit}]`);
            // console.log(`\n${player.name} was disconnected from the room |${room_name}| [${_ro}/${room_limit}]`);
        else {
            for (let room in rooms) {
                if (rooms[room].rname.includes(room_name)) rooms.splice(room, 1);
            }
            MyLog("w", `\n${player.name} was disconnected from the room |${room_name}| [0/${room_limit}] | Room was removed.`);
            // console.log(`\n${player.name} was disconnected from the room |${room_name}| [0/${room_limit}] | Room was removed.`);
        }

    });

}); /* connection */


/* Мусор/DeActiveCode */

/* app.use(express.static('scripts'));
app.get(`/`, function(req, res) {
    res.sendFile(__dirname + '/startgame.html');
}); */

/* function printObject(o) {
    var out = '';
    for (var p in o) {
      out += p + ': ' + o[p] + '\n';
    }
    console.log(out);
  } printObject(newRoom); */

/*
// отправка только отправителю-клиенту
socket.emit('message', "this is a test");

// отправка всем клиентам, включая отправителя
io.emit('message', "this is a test");

// отправка всем клиентам, кроме отправителя
socket.broadcast.emit('message', "this is a test");

// отправка всем клиентам в игровой комнате (канале), кроме отправителя
socket.broadcast.to('game').emit('message', 'nice game');

// отправка всем клиентам в игровой комнате (канале), включая отправителя
io.in('game').emit('message', 'cool game');

// отправка клиенту отправителя, только если он находится в игровой комнате (канале)
socket.to('game').emit('message', 'enjoy the game');

// отправка всем клиентам в пространстве имен 'myNamespace', включая отправителя
io.of('myNamespace').emit('message', 'gg');

// отправка на индивидуальный идентификатор сокета
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); 
*/