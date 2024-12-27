
    e.brush.drawLineA({
        x1 : player.x + 30, y1 : player.y + 30, 
        x2 : _pp.x + 30, y2 : _pp.y + 30, 
        strokeColor : "red",
        alpha: 0.5
    });
    
    let mpos = m.getPosition(); 

    // вариант 1 | Движение obj за курсором мышки
    if (player.getDistance(mpos) > 3) {
        player.moveToC(mpos, 3, 3);
    }


    // вариант 2 | Движение obj за курсором мышки + поворачиватцо к ниму
    if (player.getDistance(mpos) > 3) {
        player.moveToC(mpos, 3, 3);
        player.rotate(mpos);
    }


    // вариант 3 | Перемещение объекта по нажатию в определенную точку экрана
    if (m.isPress('LEFT')) {
        player.setPositionC(mpos);
    }


    //     // вариант 4 | Движение obj в заданную точку и смотреть на нее
    let pos = player.getPositionC();

    // уже в самой сцене
    if (m.isPress('LEFT')) {
        pos = m.getPosition();
    }
    if (player.getDistance(pos) > 3) {
        player.rotate(pos);
        player.moveToC(pos, 3, 3);
    }

    /* ------------------------------------------------------------------------------------- */

    function playerClass(_c) {
        var obj = _c;
        
        
    
        return obj;
    }

    for (let i = 1; i <= treesCount; i++) {
        if (i <= treesCount / 4)       _trees.push({ num: 1, x: random(200, 4900),  y : random(200, 4900)}); 
        else if (i <= 126) _trees.push({ num: 3, x: random(4900, 9900), y : random(200, 4900)}); 
        else if (i <= 189) _trees.push({ num: 2, x: random(200, 4900),  y : random(4900, 9900)}); 
        else if (i <= 252) _trees.push({ num: 4, x: random(4900, 9900), y : random(4900, 9900)}); 
    }
    
    
    function Player(_settings) {
       var name = _settings.name, clothes;
       
       this.getName = function() {
          return name; 
       }
       
       this.setName = function(_sname) {
          name = _sname; 
       }
       
       switch(_settings.clothes) {
          case 0: clothes = "Тканевая";
          break;
          
          case 1: clothes = "Деревянная";
          break;
        
          case 2: clothes = "Кольчужная";
          break;
          
          case 3: clothes = "Диамантовая";
          break;
          
          default: clothes = "Без брони";
          break;
       }
      
       this.getClothes = function() {
          return clothes; 
       }
       
    }
    
    var user1 = new Player({ 
       name: "Vasya",
       class: 1,
       clothes: 2
    });
    
    document.write("Игрок: user1: <br><br>Name: "+user1.getName()+"<br>Armor: "+user1.getClothes());

    /* ------------------------------------------------------------------------------------- */

    const getKeyByValue = (obj, value) => Object.keys(obj).find(key => obj[key] === value);
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

function Connect(_objr, _player) {
    _player.room = _objr;
    for(let i = 0; i <= rooms[_objr.index].players.length; i++) {
        if (rooms[_objr.index].players[i] === undefined) {
            rooms[_objr.index].players.splice(i, 0, _player);
            _objr.piir = i;
            return function() { player.room = _objr }; 
        }
    }
}

function CreateRoom() {

    this.id = generateID();
    this.players = [];
    this.limit = 2;
    this.online  = function() { return this.players.length };

    return (this);
}

function AddIn(_obj) {
    for(let i = 0; i <= rooms.length; i++) {
        if (rooms[i] === undefined) {
            rooms.splice(i, 0, _obj);
            return { index: i, id: _obj.id }; 
        }
    }

    rooms.splice(i, 0, _obj);
    return { index: i, id: _obj.id }; 
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

console.clear();
console.log("Server was started."); /* "\x1b[32m", */


/* Update */

/* Когда игрок присоединился */
io.sockets.on('connection', function(socket) {

    var first_connect = true,
        player;

    /* Игрок присоединился и нажал кнопку начала игры */
    socket.on('spawned', function(_spawned) {

        player = new function() {
            this.name   = "Player";
            this.gclass = 0;
            this.id     = socket.client.id;
            this.room   = null;
            this.x      = 100;
            this.y      = 100; 
        };

        if (first_connect) { 
            if (rooms.length != 0) { var _connected = false;
                for(var room in rooms) {
                    if (rooms[room].online() < rooms[room].limit) {
                        Connect({ index: room, id: rooms[room].id }, player);
                        _connected = true;
                        break;
                    }
                }
                    if (!_connected) {
                        Connect(AddIn(new CreateRoom()), player);
                    }
            } else {
                var newRoom = new CreateRoom();
                Connect(AddIn(newRoom), player);
            }
        
            setName(_spawned.name, player);
            console.log(player);
            console.log(`\nClient: ${player.id} connected to room: [${player.room.index}/${player.room.id}] | Room online: ${rooms[player.room.index].online()}`);

            socket.emit("get_room", player);
            socket.emit("create_new_player", player);

            first_connect = false;
        } else { /* Если игрок просто респавнится */
            setName(_spawned.name, player);
            console.log("Respawn: ");
            console.log(player);
        }

     }); // spawned

    /* Когда игрок отключился */
    socket.on('disconnect', function(data) { if (player == undefined) return;

        rooms[player.room.index].players.splice(player.room.piir, 1);

        console.log(`Client: ${player.id} disconnected in room [${player.room.index}/${player.room.id}] | Room online: ${rooms[player.room.index].online()}`);
    });

});


/* Очистка пустых комнат */
setInterval(function() {
    if (rooms.length <= 0) return;
    for (var room in rooms) { 
        if (rooms[room].online() == 0) { 
            console.log(`\nКомната [${rooms[room].id}] была удалена из-за отсутствия игроков в ней.`); 
            rooms.splice(room, 1);
            console.log(rooms); 
        }
    }
}, 10000);

var counter = io.sockets.clients(socket.room).length;
if(counter  ==  1){
  //Make a REST call to a third-party service
}

var room = io.sockets.adapter.rooms['my_room'];
room.length;

/* Движение игрока по кордам мышки */
if (drawPos[0] != undefined) { drawPos[0].drawStaticBox(0,0,0,0,"green"); }
if (mp('LEFT')) {
    newMousePos(mpos());

    let send = true;
    for (let _p in players) {
        if (players[_p].isStaticIntersect(drawPos[0].getStaticBox())) send = false;
    }
    if (send) socket.emit('update', {set: "pos", obj: mpos()}); 
}

function everySecondSendXY() {
    setInterval(function() {
        socket.emit('update', {set: "xy", obj: {x: player.x, y: player.y}});
    }, 1000); 
}

function random(min, max) {
    return e.math.random(min, max);
}

//альтернатива отрисовке блоков карты
for (let c = 0; c <= (map1.length + map2.length + map3.length + map4.length); c++) {

    if ((player.x < 6000 && player.y < 5500) && c < map1.length) {
        if (map1[c].isInCamera()) map1[c].draw();
        zone[1] = true;
    }
    
    if ((player.x < 6000 && player.y > 4300) && c < map2.length) {
        if (map2[c].isInCamera()) map2[c].draw();
        zone[2] = true;
    }
    
    if ((player.x > 4000 && player.y < 5500) && c < map3.length) {
        if (map3[c].isInCamera()) map3[c].draw();
        zone[3] = true;
    }
    
    if ((player.x > 4000 && player.y > 4400) && c < map4.length) {
        if (map4[c].isInCamera()) map4[c].draw();
        zone[4] = true;
    }
}


if (k.isDown("W") && k.isDown("D")) {
    _key = "WD";
    // player.x += player.speed - 1.5;
    // player.y -= player.speed - 1.5;
    // player.rotateForAngle(-45, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
        console.log("send");
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("W") && k.isDown("A")) {
    _key = "WA";
    // player.x -= player.speed - 1.5;
    // player.y -= player.speed - 1.5;
    // player.rotateForAngle(-135, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("S") && k.isDown("D")) {
    _key = "SD";
    // player.x += player.speed - 1.5;
    // player.y += player.speed - 1.5;
    // player.rotateForAngle(45, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("S") && k.isDown("A")) {
    _key = "SA";
    // player.x -= player.speed - 1.5;
    // player.y += player.speed - 1.5;
    // player.rotateForAngle(135, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("W")) {
    _key = "W";
    // player.y -= player.speed;
    // player.rotateForAngle(-90, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("S")) {
    _key = "S";
    // player.y += player.speed;
    // player.rotateForAngle(90, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("A")) {
    _key = "A";
    // player.x -= player.speed;
    // player.rotateForAngle(180, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
    _old_key = _key;
} else if (k.isDown("D")) {
    _key = "D";
    // player.x += player.speed;
    // player.rotateForAngle(0, 10);
    if (_old_key != _key) {
        sendPos = 1; sendPos2 = 1;
    } else sendPos2 = 1;
        _old_key = _key;
}


//code



/* Health Bar */
        let maxHealth = player.health, curHealth = maxHealth;
        $('.total').html(maxHealth + "/" + maxHealth);
        $(".health-bar-text").html("1000/1000");
        // $(".health-bar-text").html("100%");
        $(".health-bar").css({
        "width": "100%"
        });
        $("#player_name").click(function() {
        if (curHealth == 0) {
        } else {
            let damage = Math.floor((Math.random() * 100) + 50);
            $(".health-bar-red, .health-bar").stop();
            curHealth = curHealth - damage;
            if (curHealth < 0) {
                curHealth = 0;
            }
            applyChange(curHealth);
        }
        });
        $("#room_info").click(function() {
        if (curHealth == maxHealth) {
        } else {
            let heal = Math.floor((Math.random() * 100) + 5);
            $(".health-bar-red, .health-bar-blue, .health-bar").stop();
            curHealth = curHealth + heal;
            if (curHealth > maxHealth) {
            curHealth = maxHealth;
            }
            applyChange(curHealth);
        }
        });
        
        function applyChange(curHealth) {
            let a = curHealth * (100 / maxHealth);
            // $(".health-bar-text").html(Math.round(a) + "%");
            $('.health-bar-text').html(curHealth + "/" + maxHealth);
            $(".health-bar-red").animate({
                'width': a + "%"
            }, 700);
            $(".health-bar").animate({
                'width': a + "%"
            }, 500);
            $(".health-bar-blue").animate({
                'width': a + "%"
            }, 300);
        }

        $("#player_name, .health-box").show();

/* Health Bar */
/* CSS */
/* Health Bar */
// .health-box {
//     background-color: #ccc;
//     height: 20px;
//     width: 150px;
//     margin: 0 auto;
//     border: solid 1px #aaa;
//     z-index: 201;
//     position: fixed;
//     margin-top: 70px;
//     margin-left: 20px;
//     display: none;
//   }
  
//   .health-bar {
//     background-color: #007f00;
//     width: inherit;
//     height: 20px;
//     position: relative;
//     bottom: 37px;
//   }
  
//   .health-bar-red {
//     width: 100%;
//     height: 100%;
//     background-color: #cc0000;
//   }
  
//   .health-bar-blue {
//     width: 100%;
//     height: 100%;
//     background-color: #3bd3df;
//     bottom: 18px;
//     position: relative;
//   }
  
//   .health-bar-text {
//     position: relative;
//     bottom: 59px;
//     text-align: center;
//   }
  
//   .message-box {
//     text-align: center;
//     padding: 5px;
//   }
  
//   .total,
//   .message-box {
//     font-size: 16px;
//     margin: 5px;
//   }


/* Map client 4*4 */

let map1 = [], mbsize = 1250;
for (let x = 0; x <= 3; x++) {
    for (let y = 0; y <= 3; y++) {
        map1.push(
            new g.newImageObject(   { 
                file : "images/map_block.png", 
                x : mbsize*x, 
                y : mbsize*y, 
                w : mbsize, 
                h : mbsize
            })
        );
    }
}

let map2 = [];
for (let x = 0; x <= 1; x++) {
    for (let y = 2; y <= 3; y++) {
        map2.push(
            new g.newImageObject(   { 
                file : "images/map_block2.png", 
                x : mbsize*x, 
                y : mbsize*y, 
                w : mbsize, 
                h : mbsize
              })
        );
    }
}

let map3 = [];
for (let x = 2; x <= 3; x++) {
    for (let y = 0; y <= 1; y++) {
        map3.push(
            new g.newImageObject(   { 
                file : "images/map_block4.png", 
                x : mbsize*x, 
                y : mbsize*y, 
                w : mbsize, 
                h : mbsize
              })
        );
    }
}

let map4 = [];
for (let x = 2; x <= 3; x++) {
    for (let y = 2; y <= 3; y++) {
        map4.push(
            new g.newImageObject(   { 
                file : "images/map_block3.png", 
                x : mbsize*x, 
                y : mbsize*y, 
                w : mbsize, 
                h : mbsize
              })
        );
    }
}

let map_border_h_t = g.newBackgroundObject(   { 
        x : -5, 
        y : -2501, 
        w : 2500, 
        h : 2500, 
        countX : 10, 
        countY : 1, 
        file : "images/map_border_h.png" 
});  

let map_border_h_b = g.newBackgroundObject(   { 
        x : -5, 
        y : 10004, 
        w : 2500, 
        h : 2500, 
        countX : 10, 
        countY : 3, 
        file : "images/map_border_h.png" 
}); 

let map_border_v_l = g.newBackgroundObject(   { 
        x : -2502, 
        y : -500, 
        w : 2500, 
        h : 2500, 
        countX : 1, 
        countY : 5, 
        file : "images/map_border_v.png" 
});  

let map_border_v_r = g.newBackgroundObject(   { 
        x : 10004, 
        y : -500, 
        w : 2500, 
        h : 2500, 
        countX : 1, 
        countY : 5, 
        file : "images/map_border_v.png" 
});  

    /* ЗОНА ОТРИСОВКИ */

    if (player.x < 6000 && player.y < 5500) {
        for (let c in map1) { if (map1[c].isInCamera()) map1[c].draw(); }
        zone[1] = true;
    }
    
    if (player.x < 6000 && player.y > 4300) {
        for (let c in map2) { if (map2[c].isInCamera()) map2[c].draw(); }
        zone[2] = true;
    }
    
    if (player.x > 4000 && player.y < 5500) {
        for (let c in map3) { if (map3[c].isInCamera()) map3[c].draw(); }
        zone[3] = true;
    }
    
    if (player.x > 4000 && player.y > 4400) {
        for (let c in map4) { if (map4[c].isInCamera()) map4[c].draw(); }
        zone[4] = true;
    }

    // Движение игрока по клавишам
    if (kd("W") && kd("D")) {
        player.key = "WD";
        player.pos.x += player.speed;
        player.pos.y -= player.speed;
        player.rotateForAngle(-45, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("W") && kd("A")) {
        player.key = "WA";
        player.pos.x -= player.speed;
        player.pos.y -= player.speed;
        player.rotateForAngle(-135, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("S") && kd("D")) {
        player.key = "SD";
        player.pos.x += player.speed;
        player.pos.y += player.speed;
        player.rotateForAngle(45, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("S") && kd("A")) {
        player.key = "SA";
        player.pos.x -= player.speed;
        player.pos.y += player.speed;
        player.rotateForAngle(135, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("W")) {
        player.key = "W";
        player.pos.y -= player.speed;
        player.rotateForAngle(-90, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("S")) {
        player.key = "S";
        player.pos.y += player.speed;
        player.rotateForAngle(90, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("A")) {
        player.key = "A";
        player.pos.x -= player.speed;
        player.rotateForAngle(180, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    } else if (kd("D")) {
        player.key = "D";
        player.pos.x += player.speed;
        player.rotateForAngle(0, 10);
        if (player.old_key != player.key) {
            sendPos = 1; sendPos2 = 1;
        } else sendPos2 = 1;
        player.old_key = player.key;
    }

    if (ku("W") && ku("D")) {
        player.key = player.key.replace("WD", ""); sendPos = 1; sendPos2 = 1;
    } else if (ku("W") && ku("A")) {
        player.key = player.key.replace("WA", ""); sendPos = 1; sendPos2 = 1;
    } else if (ku("S") && ku("D")) {
        player.key = player.key.replace("SD", ""); sendPos = 1; sendPos2 = 1;
    } else if (ku("S") && ku("A")) {
        player.key = player.key.replace("SA", ""); sendPos = 1; sendPos2 = 1;
    } else if (ku("W")) {
        player.key = player.key.replace("W", "");  sendPos = 1; sendPos2 = 1;
    } else if (ku("A")) {
        player.key = player.key.replace("A", "");  sendPos = 1; sendPos2 = 1;
    } else if (ku("S")) {
        player.key = player.key.replace("S", "");  sendPos = 1; sendPos2 = 1;
    } else if (ku("D")) {
        player.key = player.key.replace("D", "");  sendPos = 1; sendPos2 = 1;
    }

    if (sendPos && sendPos2) {
        player.pos = player.getPositionC();
        socket.emit('update', {set: "pos", obj: player});
        sendPos = 0; sendPos2 = 0; 
        checkSend += 1.5;
    } 

    case "pos": if (_set.obj.id == player.ids) break;
                        let _vh = 160, _xm = 250;

                        if (_set.obj.key == "WA") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x - _vh; 
                            players[_set.obj.id].pos.y = _set.obj.pos.y - _vh; 
                        } else if (_set.obj.key == "SD") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x + _vh; 
                            players[_set.obj.id].pos.y = _set.obj.pos.y + _vh; 
                        } else if (_set.obj.key == "WD") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x + _vh; 
                            players[_set.obj.id].pos.y = _set.obj.pos.y - _vh; 
                        } else if (_set.obj.key == "SA") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x - _vh; 
                            players[_set.obj.id].pos.y = _set.obj.pos.y + _vh; 
                        } else if (_set.obj.key == "W") {
                            players[_set.obj.id].pos.y = _set.obj.pos.y - _xm; 
                        } else if (_set.obj.key == "S") {
                            players[_set.obj.id].pos.y = _set.obj.pos.y + _xm; 
                        } else if (_set.obj.key == "A") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x - _xm; 
                        } else if (_set.obj.key == "D") {
                            players[_set.obj.id].pos.x = _set.obj.pos.x + _xm; 
                        } else if (_set.obj.key == "") {
                            players[_set.obj.id].pos = _set.obj.pos; 
                        }

                        players[_set.obj.id].s_x = _set.obj.x; 
                        players[_set.obj.id].s_y = _set.obj.y; 
            break;
            case "xy": players[_set.obj.id].x = _set.obj.x; players[_set.obj.id].y = _set.obj.y;
            break;


    /* Когда игрок перешел на другую вкладку или свернул игру */
    $(document).on('visibilitychange', function() {
        if(document.visibilityState == 'hidden') {
            socket.emit('update', {set: "afk", obj: {}});
        } else {
            for (let _p in players) {
                players[_p].x = players[_p].pos.x;
                players[_p].y = players[_p].pos.y;
            }
        }
    });

    /* Функция спавна телепорта */
    function SpawnTeleport() {
        let anim_spawn = g.newAnimationObject({
                animation: t.newImage("images/Wizard/teleport_spawn.png").getAnimation(0, 0, 258, 300, 8),
                x: 200,
                y: 200,
                w: 228,
                h: 270,
                delay: 3
        });

        let anim_teleport = g.newAnimationObject({
                animation: t.newImage("images/Wizard/teleport.png").getAnimation(0, 0, 258, 300, 8),
                x: 200,
                y: 200,
                w: 228,
                h: 270,
                delay: 3
        });

        this.setTeleportPos = function(_x, _y) { anim_spawn.x = _x; anim_spawn.y = _y; anim_teleport.x = _x; anim_teleport.y = _y; }
        this.spawn = function() { return anim_spawn; }
        this.teleport = function() { return anim_teleport; }
        this.count = 0;
      }

    let wizard_teleport = new SpawnTeleport();

        /* Отрисовка дополнительных способностей классов */
        /* Charodey: Teleport */
        if (wizard_teleport.count > 0 && wizard_teleport.count < 37) { 
            wizard_teleport.spawn().draw();
            wizard_teleport.count++;
        }  if (wizard_teleport.count == 37) {
            wizard_teleport.teleport().draw();
        }

        if (mp('Right')) {
            newMPosX = mpos().x;
            newMPosY = mpos().y;
            wizard_teleport.setTeleportPos(newMPosX - 112, newMPosY - 110);
            socket.emit('update', {set: "tp", obj: {x: mpos().x, y: mpos().y}});
            wizard_teleport.count = 1;
        }

////////////////////////////////////////////////
//                                            //
//                  SERVER                    //
//                                            //
////////////////////////////////////////////////

////////////////////////////////////////////////
//                                            //
//                  Class                     //
//                                            //
////////////////////////////////////////////////

    /* Функция для простых возвратов данных, например: получение картинки героя по указанному имени */

    this.get = (_value) => {
        let _imagesPath = "images/classes/";
        switch (_value.get) {
            case "person-image":   
                for (let _hero in _heroList) {
                    if (_value.set.name == _heroList[_hero])
                        return `${_imagesPath}${_heroList[_hero]}/${_heroList[_hero]}_person.png`; 
                }
            break;
            case "cast-image":   
                for (let i = 0; i < _heroList.length; i++) {
                    if (_value.set.name == _heroList[i]){
                        for (let j = 0; j < 5; j++) {
                            if (_value.set.n == j)
                                return `${_imagesPath}${_heroList[i]}/cast_${j}.png`; 
                        }
                    }
                }
            break;
            case "cast-cell-image":   
                for (let i = 0; i < _heroList.length; i++) {
                    if (_value.set.name == _heroList[i]){
                        for (let j = 0; j < 4; j++) {
                            if (_value.set.n == j)
                                return `${_imagesPath}${_heroList[i]}/cast_${j}_cell.png`; 
                        }
                    }
                }
            break;
        }
    }

    /* Менеджер классов теперь имеет своего менеджера кастов :D | Создание / Визуализация / Управление действиями -> кастов | */
    /*  */
    /* Cast #0: Дефолтный каст у всех персов                   */
    /* Cast #1: Три уникальных спосоьностей для каждого класса */
    /* Cast #2: Три уникальных спосоьностей для каждого класса */
    /* Cast #3: Три уникальных спосоьностей для каждого класса */
    /* Cast #4: Самый мощный каст у всех персов                */

    this.castManager = function(_value) {
        switch (_value.get) {
            case "create-cast":
                switch ((_value.set.isServerCast) ? _value.set.obj.gclass : _value.set.name) {
                    case _heroList[0]:
                        let _cast = g.newImageObject({ 
                            file: this.get({get: "cast-image", set: {name: (_value.set.isServerCast) ? _value.set.obj.gclass : player.gclass, n: 0}}),
                            w : 60, 
                            h : 60
                        });
                        switch ((_value.set.isServerCast) ? _value.set.obj.cast : _value.set.cast) {
                            case 0:
                                if (_value.set.isServerCast) {
                                    _cast.x      = _value.set.obj.x;
                                    _cast.y      = _value.set.obj.y;
                                    _cast.end    = _value.set.obj.end;
                                    _cast.gclass = _value.set.obj.gclass;
                                    _cast.cast   = _value.set.obj.cast;
                                    _cast.owner  = _value.set.obj.owner;
                                } else {
                                    _cast.x      = player.x;
                                    _cast.y      = player.y;
                                    _cast.end    = mpos();
                                    _cast.gclass = player.gclass;
                                    _cast.cast   = player.cast;
                                    _cast.owner  = player.ids;
                                    socket.emit('update', {set: "cast", obj: {cast: _cast.cast, x: _cast.x, y: _cast.y, end: _cast.end, owner: _cast.owner, gclass: _cast.gclass}}); 
                                    player.cast = 0;
                                }
                                casts.push(_cast);
                                _cast = null;
                            break;
                            case 1:
                                //drow-ranger second cast
                            break;
                        }
                    break;
                }
            break;
            case "draw-casts":
                for (let _cast in casts) {
                    if (!casts[_cast]) continue;
                    switch (casts[_cast].gclass) {
                        case _heroList[0]:
                            switch (casts[_cast].cast) {
                                case 0: /* Метание обычных стрел */
                                    let isHit = false;
                                    for (let _p in players) {
                                        if (casts[_cast].isStaticIntersect(players[_p].getStaticBox()) && casts[_cast].owner == player.ids) {
                                            isHit = true;
                                            socket.emit('update', {set: "damage", obj: {cast: casts[_cast].cast, enemy: players[_p].ids}});
                                            casts.splice(_cast, 1); 
                                            break;
                                        }
                                    }
                                    if (isHit) continue;
                                    if (casts[_cast].getDistance(casts[_cast].end) > 45) {
                                        casts[_cast].moveToC(casts[_cast].end, 10, 10);
                                        if (casts[_cast].isInCamera()) {
                                            casts[_cast].rotateForPoint(casts[_cast].end, 100);    
                                            casts[_cast].draw();
                                        }
                                    } else {
                                        delete casts[_cast];
                                    }
                                break;
                                case 1: /* Самонаводящаяся стрела с большим уроном */
                                    //second cast
                                break;
                            }
                        break;
                    }
                }
            break;
        }
    };