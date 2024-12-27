"use strict";

// $(document).ready(function() { 
    
    // let socket = io.connect("http://site.com:778");
    let socket = io.connect("http://my-web-projects:777");
    $("#game_over, #score").hide();

    let players = [], trees = [], map = [], mmps = [], zone = [], cells = [], mbsize = 1250, isDisconnected = false;

/* Реагируем на дисконнекты при разных причинах */

    socket.on('connect', () => {
        console.log("Связь с сервером налажена бля!");
        $("#server_indicator").text("Connected").css("color", "#00ff37");
      });
      
    socket.io.on('reconnect_error', (error) => {
        console.log("Сука, сервер включи, дебил!");
        if ($("#server_indicator").text() != "Disconnected") {
            g.stop();
            isDisconnected = true;
            players = [], trees = [], map = [], cells = [];
            $("#room_info").text("");
            $("button, #bg_menu, #set_name, .select-class-div").show();
            $(".fog").fadeIn(2000, function(){});
            $("#server_indicator").text("Disconnected").css("color", "#ff0000");
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(reason);
        if (reason === 'io server disconnect') {
            console.log("Тебя кикнули, дурачок!");
        } else if (reason === "transport close") {
            console.log("Сервер ебанул сальтуху, и потерял сознание!");
        }
        if ($("#server_indicator").text() != "Disconnected") {
            g.stop();
            isDisconnected = true;
            players = [], trees = [], map = [], cells = [];
            $("#room_info").text("");
            $("button, #bg_menu, #set_name, .select-class-div").show();
            $(".fog").fadeIn(2000, function(){});
            $("#server_indicator").text("Disconnected").css("color", "#ff0000");
        }
    });

/* Костыль для возможности ввода никнейма */

    $("#set_name").click().bind('blur', function() {
        (this).focus();    
        k.exitKeyControl();        
    }); 

    $("#bg_menu").click(function() {
        $("#set_name").blur();  
        k.initControl();        
    }); 

    $(document).keyup(function(e) {
        if (e.key === "Escape") { 
           // <DO YOUR WORK HERE>
       }
   });

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]; });
    }

/* Запускаем движок */

    const e    = new PointJS(100, 100, {strokeColor: "#992222", backgroundColor: "rgb(39, 59, 26)"}),
        system = e.system,
        g      = e.game,
        ggwh   = g.getWH,
        c      = e.camera,
        cs     = e.camera.scale,
        m      = e.mouseControl,
        k      = e.keyControl,
        ku     = e.keyControl.isUp,
        kd     = e.keyControl.isDown,
        //kp     = k.isPress,
        mp     = m.isPress,
        mpd     = m.isDown,
        mpos   = m.getPosition,
        p      = e.vector.point,
        t      = e.tiles;

    let mapSize = 2500; // *2

/* Менеджер классов */

    let classManager = new function() {
        let _imagesPath = "images/classes/";

        this.heroes = {
            "drow_ranger": new function() {
                let _heroName = "drow_ranger";

                this.images = {
                    person: `${_imagesPath}${_heroName}/person.png`,
                    casts: [
                        `${_imagesPath}${_heroName}/cast_0.png`,
                        `${_imagesPath}${_heroName}/cast_1.png`
                    ],
                    cells: [
                        `${_imagesPath}${_heroName}/cast_0_cell.png`,
                        `${_imagesPath}${_heroName}/cast_1_cell.png`
                    ]
                };

                this.cooldowns = [
                    1200
                ];

                this.createCast = (_cast, _isServerCast = undefined) => {
                    switch (_cast) {
                        case 0:
                            let _mpos = mpos();
                            if (player.getDistance(p(_mpos.x, _mpos.y)) > 1000 && !_isServerCast) {
                                newMousePos(_mpos, "red");
                                return;
                            }
                            let _newFirstCast = g.newImageObject({ 
                                file: this.images.casts[_cast],
                                w : 60, 
                                h : 60
                            });

                            if (_isServerCast) {
                                _newFirstCast.x      = _isServerCast.x;
                                _newFirstCast.y      = _isServerCast.y;
                                _newFirstCast.end    = _isServerCast.end;
                                _newFirstCast.gclass = _isServerCast.gclass;
                                _newFirstCast.cast   = _isServerCast.cast;
                                _newFirstCast.owner  = _isServerCast.owner;

                                players[_isServerCast.owner].rotateForPoint(_isServerCast.end, 100);
                                players[_isServerCast.owner].pos = {x: players[_isServerCast.owner].x+30, y: players[_isServerCast.owner].y+30};
                            } else {
                                _newFirstCast.x      = player.x;
                                _newFirstCast.y      = player.y;
                                _newFirstCast.end    = _mpos;
                                _newFirstCast.gclass = player.gclass;
                                _newFirstCast.cast   = _cast;
                                _newFirstCast.owner  = player.ids;

                                player.rotateForPoint(_mpos, 100);
                                player.pos = {x: player.x+30, y: player.y+30};
                                // player.cooldowns[_cast] = this.heroes[_heroName].cooldowns[_cast];
                                socket.emit('update', {set: "cast", obj: {cast: _newFirstCast.cast, x: _newFirstCast.x, y: _newFirstCast.y, end: _newFirstCast.end, owner: _newFirstCast.owner, gclass: _newFirstCast.gclass}}); 
                                player.cast = 0;
                            }
                            casts.push(_newFirstCast);
                            _newFirstCast = null;
                        break;
                        default:
                            console.log("Cast not founded!"); 
                        break;
                    }
                };

                this.castManagement = (_castOutOfArr) => {
                    switch (casts[_castOutOfArr].cast) {
                        case 0: /* Метание обычных стрел */
                            let isHit = false;
                            for (let _p in players) {
                                if (casts[_castOutOfArr].isStaticIntersect(players[_p].getStaticBox()) && casts[_castOutOfArr].owner == player.ids) {
                                    isHit = true;
                                    socket.emit('update', {set: "damage", obj: {cast: casts[_castOutOfArr].cast, enemy: players[_p].ids}});
                                    casts.splice(_castOutOfArr, 1); 
                                    break;
                                }
                            }
                            if (isHit) break;
                            if (casts[_castOutOfArr].getDistance(casts[_castOutOfArr].end) > 45) {
                                casts[_castOutOfArr].moveToC(casts[_castOutOfArr].end, 10, 10);
                                if (casts[_castOutOfArr].isInCamera()) {
                                    casts[_castOutOfArr].rotateForPoint(casts[_castOutOfArr].end, 100);    
                                    casts[_castOutOfArr].draw();
                                }
                            } else {
                                delete casts[_castOutOfArr];
                            }
                        break;
                        default:
                            console.log("Cast not founded!"); 
                        break;
                    }
                }
            }
        };

        this.drawCasts = function() {
            for (let _cast in casts) {
                if (!casts[_cast]) break;
                this.heroes[casts[_cast].gclass].castManagement(_cast);
            }
        };

        this.createCells = () => {
            cells = []; 
            for (var _c = 0; _c <= 1; _c++) {
                cells[_c] = g.newRectObject({
                    w: 60,
                    h: 60,
                    alpha: 0.7,
                    fillColor: "black"
                });
            }
            cells.push(
                g.newImageObject({ 
                    file: this.heroes[player.gclass].images.cells[1],
                    w : 60, 
                    h : 60
                }),
                g.newImageObject({ 
                    file: this.heroes[player.gclass].images.cells[0],
                    w : 60, 
                    h : 60
                })
            );
            /* for (let i = 0; i < 4; i++) {
                cells.push(
                    g.newImageObject({ 
                        file:  classManager.get({get: "cast-cell-image", set: {name: player.gclass, n: i}}),
                        w : 60, // Когда у героев буду готовы все 4 картинки спос
                        h : 60
                    })
                );
            } */
        };

        this.get = (_value) => {
            switch (_value.get) {
                case "person-image":   
                    return this.heroes[_value.set.name].images.person;
                break;
                case "cast-image":   
                    return this.heroes[_value.set.name].images.casts[_value.set.cast];
                break;
            }
        };

    /* Функция для создания/изменения каких-то данных */

        this.set = (_value) => {
            // switch (_value) {
            //     case "cells":
            //     break;
            // }
        }
    }

/* Менеджер карты */

    let mapManager = new function() {

        let _map, _border, _tree;

        this.createMap = (_trees, _seed) => {
            _map = _border = _tree = null;

            _map = g.newImageObject({ 
                file: `images/map_block${_seed}.png`, 
                w : mbsize-1, 
                h : mbsize-1
              });

            _border = g.newImageObject({ 
                file: `images/map_border.png`, 
                w : mbsize-1, 
                h : mbsize-1
              });

            _tree = g.newImageObject({
                file : `images/tree_${_seed}.png`,
                w : 250, 
                h : 250,
                alpha: 0.5
            });

            for (let x = -1; x <= 2; x++) 
            {
                for (let y = -1; y <= 2; y++) 
                {
                    if (((y == -1 || y == 2) || (x == -1 || x == 2))) 
                    {
                        map.push(
                            {
                                x: mbsize*x,
                                y: mbsize*y,
                                __proto__: _border
                            }
                        );
                    } else {
                        map.push(
                            {
                                x: mbsize*x,
                                y: mbsize*y,
                                __proto__: _map
                            }
                        );
                    }
                }
            }

            for (let t in _trees) {
                trees[t] = {  
                    x : _trees[t].x, 
                    y : _trees[t].y,
                    __proto__: _tree
                };
            }
        };

        this.drawMap = () => {
            for (let c in map) {
                if (map[c].isInCamera())
                    map[c].draw(); 
            }
        };

        this.drawTrees = () => {
            for (let tree in trees) {
                if (trees[tree].isInCamera())
                    trees[tree].draw();
            }
        };
    };

/* Создаём миникарту */

    let miniMapCord = g.newImageObject({ 
        file : `images/mini-map-cord-2.png`,  
        w : 110, 
        h : 110,
        alpha: 0.5
    });

    let _data_gclass;
    let player = {};
    let localMMP = g.newCircleObject({radius: 2, fillColor: "gold"});
    let onlineMMP = {fillColor: "red", __proto__: localMMP};
    let casts = [];

    $(".select-class-div").click(function(elem) {
        _data_gclass = elem.target.getAttribute("data-game-class");      
    }); 

/* Обработчик нажатия кнопки "Начать игру" */

    $("#startGame").click(function() { 

    /* Не пускаем в бой, пока не убедимся, что игрок подключён к серверу, выбран класс, и введён ник */

        if(!socket.connected) {
            alert("Василий! Ты не подключён к сервакубл.");
            return;
        }
        $("#set_name").blur();
        k.initControl();
        var _name = escapeHtml($("#set_name").val());
            _name = _name.replace(/\s/g, ' ');
        if (!_name) {
            alert("Василий! Ты не ввёл имябл!");
            return;
        } else if (!_data_gclass) {
            alert("Василий! Ты не выбрал классбл!");
            return;
        }

    /* Игрок начинает игру */

        player = g.newImageObject({ 
            file: classManager.get({get: "person-image", set: {name: _data_gclass}}),
            x : 10, 
            y : 10,
            w : 80, 
            h : 80
        });

        player.ids    = "ID_NOT_CREATED";
        player.name   = "Player";
        player.speed  = 4;
        player.health = 10000;
        player.pos    = { x: player.x, y: player.y };
        player.mmp    = {__proto__: localMMP};
        player.text   = g.newTextObject({
            size: 18,
            alpha: 0.7,
            color: "#33ff00",
            strokeColorText: "#156900",
            strokeWidthText: 0.8
        });
        player.hpbar  = new playerHpBar();
        hpBarManager.calculateHealthScale(player);
        player.cooldowns = [0, 0, 0, 0];

    /* Сообщаем серверу, что мы готовы к глобальному спавну */

        console.log("Client spawned!");
        socket.emit("client spawned", { name: _name, _gclass: _data_gclass });
        $("#player_name").text(_name);
        $("button, #bg_menu, #set_name, .select-class-div").hide();
        $(".fog").fadeOut(2500, function(){});

    /* Ждём одобрения спавна от сервера */

        socket.on("server spawned", function(obj) {
            let _obj   = obj.p;
            console.log("Server spawned!");

            c.setPositionC(player.getPositionC());

            player.pos    = _obj.pos;
            player.x      = _obj.pos.x;
            player.y      = _obj.pos.y;
            player.gclass = _obj.gclass;
            player.ids    = _obj.id;
            player.name   = _obj.name;
            player.speed  = _obj.speed;
            player.health = _obj.health;
            player.cast   = 0;
            player.text.text = player.name;

            classManager.createCells();

            if (!obj.t && !obj.m)
                return;

            mapManager.createMap(obj.t, obj.m);

            console.log(obj);

            if (obj.players) {
                obj.players.forEach(function(item, i, arr) {
                    console.log(item);
                    players[item.id] = new NewPlayer(item);
                });
            }
        });

    /* Игрок был заспавнен */

        if (isDisconnected) {
            isDisconnected = false;
            g.resume(); 
        }
        else 
            g.setLoop("game");

     }); // spawned /* Обработчик нажатия кнопки "Начать игру" */

/* Создание HP-бара */ 

    function playerHpBar() {

        this._healthScale = new g.newRoundRectObject({ 
            x : 100, 
            y : 100, 
            w : 100, 
            h : 16.25, 
            radius: 10,
            alpha: 0.7,
            fillColor : "#00ff00", 
        });

        this._bg = {
            fillColor:  "black",
            w: 100,
            alpha: 0.4,
            __proto__:  this._healthScale
        }

        this._value = new g.newTextObject({
                size: 13,
                color: "white",
                strokeColorText: "#000000",
                strokeWidthText: 0.2,
                text: "0%"
        });
    }

    let hpBarManager = new function() {

        this.calculateHealthScale = function(_p) {

            let _percentageHealth = Math.round(_p.health / 10000 * 100);
            _p.hpbar._value.text = `${_percentageHealth}%`;
            _p.hpbar._healthScale.w = _percentageHealth * 1;

            if (_percentageHealth >= 70 && _percentageHealth <= 100) {
                _p.hpbar._healthScale.fillColor = "green";
                _p.hpbar._healthScale.visible = true;
            }
            else if (_percentageHealth >= 40 && _percentageHealth < 70)
                _p.hpbar._healthScale.fillColor = "#b8a306";
            else if (_percentageHealth > 3 && _percentageHealth < 40)
                _p.hpbar._healthScale.fillColor = "red";
            else {
                _p.hpbar._healthScale.visible = false;
                _p.hpbar._bg.visible = true;
            }
        }

        this.damage = (_p, damage) => {
            if (_p.health <= 0) {
                if (!$("#set_name").is(":hidden")) return;
                $("button, #bg_menu, #set_name, .select-class-div").show();
                $(".fog").fadeIn(2500, function(){});
                socket.emit('update', {set: "die", obj: _p.ids });
                console.log("Ты сдох как шаболда!");
                return;
            }
            _p.health -= damage;
            console.log("Player Health: " + _p.hpbar.health);
            this.calculateHealthScale(_p);
        }

        this.pseudoDamage = (_p) => {
            _p.health -= 1000;
            this.calculateHealthScale(_p);
        }

        this.init = function(_p) {
            _p.hpbar._bg.setPositionC(p(_p.x+37, _p.y-10));
            _p.hpbar._healthScale.setPositionC(p(_p.x+37, _p.y-10));
            _p.hpbar._value.setPositionC(p(_p.x+34, _p.y-8));
            _p.hpbar._bg.draw();
            _p.hpbar._healthScale.draw();
            _p.hpbar._value.draw();
        }
    }

/* Функция стабилизации скорости при разном фпс */
    
    function movementStabilization(_fps) {
        if      (_fps >= 55) return 4;
        else if (_fps >= 50) return 5;
        else if (_fps >= 35) return 6;
        else if (_fps >= 25) return 9;
        else if (_fps < 25)  return 12;
    }

/* Создание новых игроков */

    function NewPlayer(_obj) {
        let np = g.newImageObject(   { 
                x           : 0, 
                y           : 0, 
                file: classManager.get({get: "person-image", set: {name: _obj.gclass}}),
                w : 80, 
                h : 80,
                // radius      : 23,
                // fillColor   : "#00770f", 
                // strokeColor : "#05e822", 
                // strokeWidth : 1,
                alpha       : 0.8
        }); // Создание объекта

        np.name   = _obj.name; 
        np.x      = _obj.x; 
        np.y      = _obj.y; 
        np.s_x    = _obj.pos.x; 
        np.s_y    = _obj.pos.y; 
        np.ids    = _obj.id; 
        np.gclass = _obj.gclass;
        np.pos    = _obj.pos;
        np.speed  = _obj.speed+0.5;
        np.health = _obj.health;
        np.mmp    = {__proto__: onlineMMP};
        np.text   = g.newTextObject({
                        size: 18,
                        text: np.name,
                        color: "#bd1000",
                        strokeColorText: "#ff1803",
                        strokeWidthText: 0.8
                    });
        np.hpbar = new playerHpBar();
        hpBarManager.calculateHealthScale(np);

        _obj = null;
        return np;
    }

/* Просим сервер прислать нам список всех игроков в комнате */

    socket.on('get players', function(_id) {
        socket.emit('new player', _id);
        _id = null;
    });
 
    socket.on('new player', function(_np) {
        console.log("new-player: ");
        console.log(_np);
        players[_np.id] = new NewPlayer(_np);
        _np = null;
    });

/* Обрабатываем изменения во время игры */

    socket.on('update_server', function(_set) {
        switch (_set.set) {
            case "pos": if (_set.obj.id == player.ids) break;
                players[_set.obj.id].pos = _set.obj.pos;
                players[_set.obj.id].s_x = _set.obj.x;
                players[_set.obj.id].s_y = _set.obj.y;
            break;
            case "xy": players[_set.obj.id].x = _set.obj.x; players[_set.obj.id].y = _set.obj.y;
            break;
            case "online": $("#room_info").text(_set.obj);
            break;
            case "tp": if (players[_set.obj.id].pos.x < 0 && players[_set.obj.id].pos.x > mapSize && players[_set.obj.id].pos.y < 0 && players[_set.obj.id].pos.y > mapSize) return;
                         players[_set.obj.id].pos = _set.obj.pos; players[_set.obj.id].x = _set.obj.pos.x; players[_set.obj.id].y = _set.obj.pos.y;
            break;
            case "cast": if (_set.obj.owner == player.ids) break;
                classManager.heroes[_set.obj.gclass].createCast(_set.obj.cast, _set.obj);
            break;
            case "damage":
                if (_set.obj.enemy == player.ids) {
                    hpBarManager.damage(player, _set.obj.damage);
                }
            break;
            case "die": 
                if (_set.obj == player.ids) {
                    g.setLoop("menu");
                    g.resume(); 
                } else {
                    delete players[_set.obj];
                }
            break;
        }

        _set = null;
    });

    /* Игрок отключился */
    socket.on('player disconnected', function(_id) {
        delete players[_id];
        // players[_id] = null;
    });

/* Создание текстов */

    let fps = g.newTextObject({
            size: 10,
            color: "#33ff00",
            strokeColorText: "#156900",
            strokeWidthText: 0.3
    });
    system.initFPSCheck();

    let cast_key_proto = g.newTextObject({
        size: 10,
        color: "#ffffff",
        strokeColorText: "#000000",
        strokeWidthText: 0.3
    });

    let cast_keys = [
        {
            text: "E",
            __proto__: cast_key_proto
        },
        {
            text: "W",
            __proto__: cast_key_proto
        },
        {
            text: "Q",
            __proto__: cast_key_proto
        },
        {
            text: "LMB",
            __proto__: cast_key_proto
        },
    ];

/* Пре-игровые назначения  */

    let newMPosX, newMPosY,
        one = 1,
        drawPos   = [],
        width     = ggwh().w,
        height    = ggwh().h;

    system.initFullPage();
    m.initControl();
    k.initControl();

/* Указатель движения (точка) */

    function newMousePos(_pos, _color = "green") {
        let _point = g.newCircleObject({radius: 6, fillColor: _color, x: _pos.x, y: _pos.y});
        drawPos[0] = _point;
        setTimeout(function() {drawPos = [];}, 500);
    }

    let fpsNow;
    let pos = player.pos;
    let _divsize = (mapSize/100)+1.5;
    let c_pix;
    let playerCanMove = false;

/* Запускаем игровой цикл */

    g.newLoop("game", function() {
        width  = ggwh().w;
        height = ggwh().h;
        fpsNow = system.getFPS();

        if (kd("CTRL") && m.isWheel( "UP" ) && one < 4)          { cs(p(1.1, 1.1)); one++ }
        else if (kd("CTRL") && m.isWheel( "DOWN" ) && one > -20) { cs(p(0.9, 0.9)); one-- }

    /* Отрисовка карты */

        mapManager.drawMap();

    /* Визуализация кастов */

        if (kd('Q')) {player.cast = 1;}
        else if (kd('W')) {player.cast = 2;}
        else if (kd('E')) {player.cast = 3;}

        classManager.drawCasts();

    /* Обработка нажатий */

        if (mp('LEFT')) {
            classManager.heroes[player.gclass].createCast(player.cast);
        }

        if (kd("SHIFT")) {
            player.speed = 20;
        } else
            player.speed = movementStabilization(fpsNow);

        if (mp('RIGHT')) {
            pos = mpos();
            player.pos = pos;
            (player.x >= 8 && player.x <= mapSize-8 && player.y >= 8 && player.y <= mapSize-8) || (player.pos.x >= 8 && player.pos.x <= mapSize-8 && player.pos.y >= 8 && player.pos.y <= mapSize-8) ? newMousePos(pos) : newMousePos(pos, "red");
            socket.emit('update', {set: "pos", obj: player}); 
        }

    /* Движение локального игрока */
        
        if (player.getDistance(player.pos) > 15) {
            if ((player.x >= 8 && player.x <= mapSize-8 && player.y >= 8 && player.y <= mapSize-8) || (player.pos.x >= 8 && player.pos.x <= mapSize-8 && player.pos.y >= 8 && player.pos.y <= mapSize-8)) {
                player.rotateForPoint(player.pos, 20);
                player.moveToC(player.pos, player.speed, player.speed);
            }
        }

        if (drawPos[0])
            drawPos[0].draw();

    /* Движение других игроков */

        for (let _p in players) {

            let _pp   = players[_p];
               
            /* Отрисовка игроков */
            if (_pp.isInCamera()) {
                if (_pp.getDistanceC(_pp.pos) > 15) {
                    if ((_pp.x >= 8 && _pp.x <= mapSize-8 && _pp.y >= 8 && _pp.y <= mapSize-8) || (_pp.pos.x >= 8 && _pp.pos.x <= mapSize-8 && _pp.pos.y >= 8 && _pp.pos.y <= mapSize-8)) {
                        _pp.rotateForPoint(_pp.pos, 20);
                        _pp.moveToC(_pp.pos, _pp.speed, _pp.speed);
                    }
                } 
                
                _pp.speed = movementStabilization(fpsNow);
                _pp.draw();
                _pp.text.setPositionC(p(_pp.x+36, _pp.y-28));
                _pp.text.draw();
                hpBarManager.init(_pp);
                // _pp.drawStaticBox();
                // _pp.drawDynamicBox();
                // _pp.text.reStyle({ text: _pp.name, color: "#bd1000", strokeColorText: "#ff1803" });
                // _pp.text.reStyle({ color: "#38a605", strokeColorText: "#53ff03" });
            } else {
                _pp.x = _pp.s_x;
                _pp.y = _pp.s_y;
            }

            /* Отрисовка игроков на миникарте */
                if (player.getDistanceC(_pp.pos) < 1000) {
                    _pp.mmp.setPositionS(p(width-110, height-110));
                    _pp.mmp.move(p(_pp.x / _divsize, _pp.y / _divsize));
                    mmps.push(_pp.mmp);
                }
        }

    /* Отрисовка локального игрока */
        player.draw();
        player.mmp.setPositionS(p(width-110, height-110));
        player.mmp.move(p(player.x / _divsize, player.y / _divsize));
        player.text.setPositionC(p(player.x + (55 - (player.name.length) * 2.5), player.y-28));
        player.text.draw();
        hpBarManager.init(player);
        mmps.push(player.mmp);

    /* Отрисовка деревьев */
        mapManager.drawTrees();
    
    /* Отрисовка ячеек со способностями */
        c_pix = (width/2)+90;
        for (let _c in cells) {
            cells[_c].setPositionCS(p(c_pix, height - 85));
            cast_keys[_c].setPositionCS(p(c_pix, height - 105));
            cells[_c].draw();
            cast_keys[_c].draw();
            c_pix -= 70;
        }

    /* Отрисовка миникарты */
        miniMapCord.setPositionS(p(width-120, height-120));
        miniMapCord.draw();
        for (let _mmp in mmps) {
            mmps[_mmp].draw();
        }

        mmps = [];

        c.follow(player, 15);

    /* Отрисовка текстов */
        fps.reStyle({ text: "FPS: " + fpsNow + " | x: " + player.x.toFixed(0) + ", y: " + player.y.toFixed(0)});
        fps.setPositionS(p(10, height-15));
        fps.draw();

    }); // Сцена

    g.newLoop("menu", function() {
        //code
    });

    g.setLoop("menu");
    g.start();

// }); // documentUploaded