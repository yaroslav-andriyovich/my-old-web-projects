
"use strict";
$(document).ready(function() { 
    
    let socket = io.connect("http://game:777");
    $("#game_over").hide();
    $("#score").hide();

    $(document).bind("contextmenu", function(e) {
        e.preventDefault();
    });

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

    //  if (true) return;
    const e    = new PointJS(1, 1, {strokeColor: "#992222", backgroundColor: "#0c2400"}),
        system = e.system,
        g      = e.game,
        gsfps  = g.setFPS,
        ggwh   = g.getWH,
        c      = e.camera.setPositionC,
        cs     = e.camera.scale,
        m      = e.mouseControl,
        k      = e.keyControl,
        kp     = k.isPress,
        mp     = m.isPress,
        mpos   = m.getPosition,
        p      = e.vector.point,
        t      = e.tiles;

    let map1 = g.newBackgroundObject(   { 
            x : 0, 
            y : 0, 
            w : 2500, 
            h : 2500, 
            countX : 2, 
            countY : 2, 
            file : "images/map_block.png"
    });

    let map2 = g.newBackgroundObject(   { 
            x : 0, 
            y : 5002, 
            w : 2500, 
            h : 2500, 
            countX : 2, 
            countY : 2, 
            file : "images/map_block2.png"
    });
    
    let map3 = g.newBackgroundObject(   { 
            x : 5002, 
            y : 0, 
            w : 2500, 
            h : 2500, 
            countX : 2, 
            countY : 2, 
            file : "images/map_block4.png"
    }); 

    let map4 = g.newBackgroundObject(   { 
            x : 5002, 
            y : 5002, 
            w : 2500, 
            h : 2500, 
            countX : 2, 
            countY : 2, 
            file : "images/map_block3.png"
    }); 

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

    let mapSize = (map1.w*map1.countX)*2;
    // let mapSize = map.w*map.countX;

    let miniMap = g.newRectObject({
            w: 100,
            h: 100,
            alpha: 0.4,
            fillColor: "black"
    });

    $("#set_name").mouseenter(function() {
        $("#set_name").focus();
        k.exitKeyControl();
    });

    $("#set_name").mouseleave(function() {
        $("#set_name").blur();
        k.initControl();
    });

    let players = [], trees = [], gameStarted = false;
    let player = g.newRectObject(   { 
            x           : 1000, 
            y           : 1000, 
            /* radius      : 20, */ 
            w           : 40,
            h           : 35,
            fillColor   : "#00770f", 
            strokeColor : "#05e822", 
            strokeWidth : 1
    }); // Создание объекта 

    function everySecondSendXY() {
        setInterval(function() {
            socket.emit('update', {set: "xy", obj: {x: player.x, y: player.y}});
        }, 1000); 
    }

    $("#startGame").click(function() { 
        var _name = escapeHtml($("#set_name").val());
            _name = _name.replace(/\s/g, ' ');
        if (_name == null || _name == "" || _name == " " || _name == undefined) {
            _name = "Player";
        }
        var _class = 0;
        socket.emit("client spawned", { name: _name, gclass: _class });
        $("#player_name").text(_name);
        $("button").hide();
        $("#bg_menu").hide();
        $("#set_name").hide();

        socket.on("server spawned", function(obj) {
            let _obj   = obj.p;
            player.x      = _obj.x;
            player.y      = _obj.y;
            player.gclass = _obj.gclass;
            player.ids    = _obj.id;
            player.name   = _obj.name;
            player.speed  = _obj.speed;
            player.pos    = _obj.pos;
            player.mmp    = g.newCircleObject({radius: 2, fillColor: "gold"});
            player.text   = g.newTextObject({
                                size: 18,
                                color: "#33ff00",
                                strokeColorText: "#156900",
                                strokeWidthText: 0.8
                            });
            players[_obj.id] = player;
            everySecondSendXY();

            let _trees = obj.t;
            for (let t in _trees) {
                trees.push(new g.newImageObject({ 
                    file : `images/tree_${_trees[t].num}.png`, 
                    x : _trees[t].x, 
                    y : _trees[t].y, 
                    w : 250, 
                    h : 250,
                    alpha: 0.5
                }));
            }
        });

        gameStarted = true;
        g.setLoop("game");

     }); // spawned

    function random(min, max) {
        return e.math.random(min, max);
    }
    
    function movementStabilization(_fps, _p) {
        if (_fps >= 55)      _p.speed = 5;
        else if (_fps >= 35) _p.speed = 6;
        else if (_fps >= 25) _p.speed = 10;
        else if (_fps < 25)  _p.speed = 14;
    }

    function NewPlayer(_obj) {
        let np = g.newRectObject(   { 
                x           : 0, 
                y           : 0, 
                /* radius      : 20, */ 
                w           : 40,
                h           : 35,
                fillColor   : "#00770f", 
                strokeColor : "#05e822", 
                strokeWidth : 1
        }); // Создание объекта

        np.name   = _obj.name; 
        np.x      = _obj.x; 
        np.y      = _obj.y; 
        np.ids    = _obj.id; 
        np.gclass = _obj.gclass;
        np.pos    = _obj.pos;
        np.speed  = _obj.speed;
        np.mmp    = g.newCircleObject({radius: 2, fillColor: "red"});
        np.text   = g.newTextObject({
                        size: 18,
                        color: "#33ff00",
                        strokeColorText: "#156900",
                        strokeWidthText: 0.8
                    });
 
        return np;
    }

    socket.on('get players', function(_id) {
        socket.emit('new player', _id);
    });
 
    socket.on('new player', function(_np) {
        players[_np.id] = new NewPlayer(_np);
    });

    socket.on('update_server', function(_set) {
        switch (_set.set) {
            case "pos": players[_set.obj.id].pos = _set.obj.pos;
            break;
            case "xy": players[_set.obj.id].x = _set.obj.x; players[_set.obj.id].y = _set.obj.y;
            break;
            case "online": $("#room_info").text(_set.obj);
            break;
            case "tp": if (players[_set.obj.id].pos.x < 0 && players[_set.obj.id].pos.x > mapSize && players[_set.obj.id].pos.y < 0 && players[_set.obj.id].pos.y > mapSize) return;
                         players[_set.obj.id].pos = _set.obj.pos; players[_set.obj.id].x = _set.obj.pos.x; players[_set.obj.id].y = _set.obj.pos.y;
            break;
        }
    });

    $(document).on('visibilitychange', function() {
        if(document.visibilityState == 'hidden') {
            socket.emit('update', {set: "afk", obj: {}});
        }
    });

    /* Игрок отключился */
    socket.on('player disconnected', function(_id) {
        delete players[_id];
    });

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

    let fps = g.newTextObject({
            size: 10,
            color: "#33ff00",
            strokeColorText: "#156900",
            strokeWidthText: 0.3
    });
    system.initFPSCheck();

    /* Пре-игровые назначения  */
    let wizard_teleport = new SpawnTeleport();
    let newMPosX, newMPosY,
        one = 1,
        drawPos   = [],
        width     = ggwh().w,
        height    = ggwh().h;

    system.initFullPage();
    m.initControl();
    k.initControl();

    function newMousePos(_pos, _d) {
        let _point = g.newCircleObject({radius: 4, fillColor: "green", x: _pos.x, y: _pos.y});
        drawPos[0] = _point;
        setTimeout(function() {drawPos = []; }, 200);
    }

    g.newLoop("game", function() {
        // gsfps(34);
        width  = ggwh().w;
        height = ggwh().h;
        let mmps   = []; 
        let fpsNow = system.getFPS();

        if (k.isDown("CTRL") && m.isWheel( "UP" ) && one < 4)         { cs(p(1.1, 1.1)); one++ }
        else if (k.isDown("CTRL") && m.isWheel( "DOWN" ) && one > -2) { cs(p(0.9, 0.9)); one--}

    /* ЗОНА ОТРИСОВКИ */

        map1.draw();
        map2.draw();
        map3.draw();
        map4.draw();
        map_border_h_t.draw();
        map_border_v_r.draw();
        map_border_h_b.draw();
        map_border_v_l.draw();

    /* Отрисовка дополнительных способностей классов */
        /* Charodey: Teleport */
        if (wizard_teleport.count > 0 && wizard_teleport.count < 37) { 
            wizard_teleport.spawn().draw();
            wizard_teleport.count++;
        }  if (wizard_teleport.count == 37) {
            wizard_teleport.teleport().draw();
        }

    /* Зона тех-части */

        if (mp('RIGHT')) {
            newMPosX = mpos().x;
            newMPosY = mpos().y;
            wizard_teleport.setTeleportPos(newMPosX - 112, newMPosY - 110);
            socket.emit('update', {set: "tp", obj: {x: mpos().x, y: mpos().y}});
            wizard_teleport.count = 1;
            /* $("button").show();
            $("#bg_menu").show();
            $("#set_name").show();
            $("#set_name").focus();
            k.exitKeyControl(); */
        }

        if (drawPos[0] != undefined) { drawPos[0].drawStaticBox(0,0,0,0,"green"); }
        if (mp('LEFT')) {
            newMousePos(mpos());

            let send = true;
            for (let _p in players) {
                if (players[_p].isStaticIntersect(drawPos[0].getStaticBox())) send = false;
            }
            if (send) socket.emit('update', {set: "pos", obj: mpos()}); 
        }
        for (let _p in players) {
            let _pp = players[_p];
            movementStabilization(fpsNow, _pp);
            if (_pp.getDistance(_pp.pos) > _pp.speed) {
                _pp.rotate(_pp.pos);
                _pp.moveToC(_pp.pos, _pp.speed, _pp.speed);
            }
               
            /* Отрисовка игроков */
            if (_pp.isInCamera()) {
                _pp.draw();
                // _pp.drawStaticBox();
                // _pp.drawDynamicBox();
                _pp.text.reStyle({ text: _pp.name });
                _pp.text.setPositionC(p(_pp.x+20, _pp.y-20));
                _pp.text.draw();

                /* Отрисовка игроков на миникарте */
                let pposmm = _pp.getPosition();
                _pp.mmp.setPositionS(p(width-110, height-110));
                let _divsize = (mapSize/100)+2.2;
                _pp.mmp.move(p(pposmm.x / _divsize, pposmm.y / _divsize));
                mmps.push(_pp.mmp);
            }
        }

        for (let tree in trees) {
            if (trees[tree].isInCamera()) trees[tree].draw();
        }

    /* Отрисовка миникарты */
        miniMap.setPositionS(p(width-110, height-110));
        miniMap.draw();
        for (let _mmp in mmps) {
            mmps[_mmp].draw();
        }

        c(player.getPositionC());

    /* Отрисовка текстов */
        fps.reStyle({ text: "FPS: " + system.getFPS() + " | x: " + player.x.toFixed(0) + ", y: " + player.y.toFixed(0) });
        fps.setPositionS(p(10, height-15));
        fps.draw();

    }); // Сцена

    g.newLoop("menu", function() {
        //code
    });

    g.setLoop("menu");
    g.start();

}); // documentUploaded