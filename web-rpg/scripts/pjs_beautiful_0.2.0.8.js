function PointJS(Ua, Va, yb, Sc) {
    this._logo = "https://mult-uroki.ru/media/pointjs/gamedev_4.png";
    var k = window,
        A = this,
        K = !1,
        Da = "fixed",
        Vb = 0,
        Wb = 0,
        zb = 100,
        Xb = function(a) {
            a = a.getBoundingClientRect();
            return {
                y: a.top + k.pageYOffset,
                x: a.left + k.pageXOffset
            }
        },
        Ec = function(a) {
            for (var b = 1; a;) b += a.style.zIndex, a = a.offsetParent;
            return b
        };
    if (1 === arguments.length) {
        K = arguments[0];
        var Yb = Xb(K);
        Vb = Yb.x;
        Wb = Yb.y;
        Ua = K.offsetWidth;
        Va = K.offsetHeight;
        Da = "absolute";
        zb = Ec(K)
    }
    var Ea = !0,
        Ab = !0,
        Zb = !0,
        ja = !1,
        Fa = !0,
        m = Ua,
        n = Va,
        na = Ua,
        oa = Va,
        H = m / 2,
        I = n / 2,
        pa = 1,
        qa = 1,
        g = {
            x: 0,
            y: 0
        },
        t = {
            fillStyle: "black",
            strokeStyle: "black",
            globalAlpha: 1,
            font: "serif",
            textBaseline: "top"
        },
        ea = function(a) {
            console.log("[PointJS] : ", a)
        };
    "undefined" !== typeof POINTJS_USER_LOG && (ea = POINTJS_USER_LOG);
    var Wa = function(a) {
        var b = decodeURI(a.stack.toString().replace(/(@|[\(\)]|[\w]+:\/\/)/g, ""));
        b = b.split(/\n/);
        b = ("" === b[2] ? b[0] : b[1]).split("/");
        b = b[b.length - 1].split(":");
        ea('ERROR "' + a.toString() + '" \n in      ' + b[0] + " \n line :   " + b[1] + " \n symbol : " + b[2])
    };
    this.game = {};
    this.levels = {};
    this.camera = {};
    this.keyControl = {};
    this.mouseControl = {};
    this.touchControl = {};
    this.system = {};
    this.vector = {};
    this.math = {};
    this.layers = {};
    this.colors = {};
    this.brush = {};
    this.audio = {};
    this.wAudio = {};
    this.resources = {};
    this.tiles = {};
    this.OOP = {};
    this.memory = {};
    this.modules = {};
    this.zList = {};
    this.filters = {};
    this.presets = {};
    this.system.log = ea;
    this.system.consoleLog = function(a) {
        this.log = !0 === a ? console.log : ea
    };
    this.system.setTitle = function(a) {
        k.document.title = a
    };
    this.system.setSettings = function(a) {
        Ea =
            w(a.isShowError) ? a.isShowError : !0;
        Ab = w(a.isStopForError) ? a.isStopForError : !0;
        Zb = w(a.isAutoClear) ? a.isAutoClear : !1;
        w(a.isZBuffer)
    };
    this.system.setDefaultSettings = function(a) {
        for (var b in a) t[b] = a[b];
        h.save()
    };
    this.system.setSmoothing = function(a) {
        Fa = a;
        h.msImageSmoothingEnabled = Fa;
        h.imageSmoothingEnabled = Fa
    };
    this.system.restart = function(a) {
        k.location.reload(a)
    };
    var Fc = {
        name: "PointJS",
        desc: "HTML5 Game Engine for JavaScript",
        author: "\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u041f\u0442\u0438\u0447\u043a\u0438\u043d (multuroki@gmail.com)",
        version: "0.2.0.7"
    };
    this.system.getInfo = function() {
        return Fc
    };
    this.modules["import"] = function(a, b) {
        B.add();
        var c = new XMLHttpRequest;
        c.open("GET", a, !0);
        c.onload = function() {
            var a = {
                    constructor: function() {}
                },
                d = c.responseText.toString().replace(/PointJS.Module/i, "Module.constructor");
            (new Function("Module", d))(a);
            a = new a.constructor(A, k);
            B.load();
            b(a)
        };
        c.send()
    };
    this.modules.importSync = function(a) {
        try {
            var b = new XMLHttpRequest;
            b.open("GET", a, !1);
            b.send()
        } catch (c) {
            return
        }
        a = {
            constructor: function() {}
        };
        b = b.responseText.toString().replace(/PointJS.Module/i,
            "Module.constructor");
        (new Function("Module", b))(a);
        return new a.constructor(A, k)
    };
    var fa = function(a, b) {
            b.prototype = Object.create(a.prototype);
            b.prototype.constructor = b
        },
        ha = function(a, b, c) {
            this.x = a || 0;
            this.y = b || 0;
            this.z = c || 0
        };
    ha.prototype = {
        abs: function() {
            return new ha(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
        },
        invert: function() {
            return new ha(-this.x, -this.y, -this.z)
        },
        plus: function(a) {
            return new ha(this.x + a.x, this.y + a.y, this.z + a.z)
        },
        minus: function(a) {
            return new ha(this.x - a.x, this.y - a.y, this.z -
                a.z)
        },
        inc: function(a) {
            return new ha(this.x * a.x, this.y * a.y, this.z * a.z)
        },
        div: function(a) {
            return new ha(this.x / a.x, this.y / a.y, this.z / a.z)
        },
        "int": function() {
            return new ha(this.x >> 0, this.y >> 0, this.z >> 0)
        }
    };
    var e = function(a, b, c) {
            return new ha(a, b, c)
        },
        z = function(a, b, c) {
            return {
                w: a,
                h: b,
                d: c
            }
        },
        Xa = function(a, b) {
            return {
                x: a.x + b.x,
                y: a.y + b.y,
                z: a.z + b.z
            }
        },
        J = function(a, b, c) {
            if (c) {
                var f = C(c);
                c = a.x - b.x;
                a = a.y - b.y;
                var d = Math.cos(f);
                f = Math.sin(f);
                return e(c * d - a * f + b.x, c * f + a * d + b.y)
            }
            return e(a.x, a.y)
        },
        Ga = function(a, b) {
            return 180 /
                Math.PI * Math.atan2(b.y - a.y, b.x - a.x)
        },
        ra = function(a, b) {
            var c, f = 0;
            var d = 0;
            var e = b.length;
            for (c = b.length - 1; d < e; c = d++) b[d].y > a.y !== b[c].y > a.y && a.x < (b[c].x - b[d].x) * (a.y - b[d].y) / (b[c].y - b[d].y) + b[d].x && (f = !f);
            return f
        },
        Ha = function(a, b, c) {
            return !(a < b || a > c)
        };
    this.vector.isNumInRange = Ha;
    this.vector.point = e;
    this.vector.simplePoint = function(a, b, c) {
        return {
            x: !1 !== a ? a : !1,
            y: !1 !== b ? b : !1,
            z: !1 !== c ? c : !1
        }
    };
    this.vector.v2d = e;
    this.vector.size = z;
    this.vector.getPointAngle = J;
    this.vector.isPointIn = ra;
    this.vector.pointMinus =
        function(a, b) {
            return {
                x: a.x - b.x,
                y: a.y - b.y,
                z: a.z - b.z
            }
        };
    this.vector.pointPlus = Xa;
    this.vector.pointInc = function(a, b) {
        return {
            x: a.x * b.x,
            y: a.y * b.y,
            z: a.z * b.z
        }
    };
    this.vector.pointDiv = function(a, b) {
        return {
            x: a.x / (0 !== b.x ? b.x : 1),
            y: a.y / (0 !== b.y ? b.y : 1),
            z: a.z / (0 !== b.z ? b.z : 1)
        }
    };
    this.vector.pointAbs = function(a) {
        return {
            x: Math.abs(a.x),
            y: Math.abs(a.y),
            z: Math.abs(a.z)
        }
    };
    this.vector.getMidPoint = function(a, b) {
        return w(b) ? e((a.x + b.x) / 2, (a.y + b.y) / 2) : 0
    };
    this.vector.getDistance = function(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x,
            2) + Math.pow(b.y - a.y, 2))
    };
    this.vector.isSame = function(a, b) {
        return w(b) ? a.x === b.x && a.y === b.y : !1
    };
    this.vector.getAngle2Points = Ga;
    this.vector.newStaticBox = function(a, b, c, f) {
        return {
            x: a,
            y: b,
            w: c,
            h: f
        }
    };
    this.vector.newDynamicBoxRect = function(a, b, c, f) {
        return [e(a, b), e(a + c, b), e(a + c, b + f), e(a, b + f)]
    };
    this.vector.moveCollision = function(a, b, c, f, d, e) {
        var u = !1,
            g = !1,
            h = c.abs(),
            E = a.getStaticBoxPosition(),
            k = b.length - 1,
            m;
        var n = 2 + h.x;
        for (m = 2 + h.y; 0 <= k; k--)
            if (h = b[k], h.visible && a !== h && !(d && !h.isInCameraStatic() || e && a.getDistanceC(h.getPositionC()) >
                    e) && a.isStaticIntersect(h.getStaticBox())) {
                var l = h.getStaticBoxPosition();
                E.h >= l.y + m && E.y <= l.h - m && (0 <= c.x ? Ha(E.w, l.x, l.w) && (a.x = l.x - (a.w + a.box.w + a.box.x) + 1, c.x = 0, u = !0) : 0 > c.x && Ha(E.x, l.x, l.w) && (a.x = l.w - a.box.x - 1, c.x = 0, u = !0));
                E.w >= l.x + n && E.x <= l.w - n && (0 < c.y ? Ha(E.h, l.y, l.h) && (a.y = l.y - (a.h + a.box.h + a.box.y) + 1, c.y = 0, g = !0) : 0 > c.y && Ha(E.y, l.y, l.h) && (a.y = l.h - a.box.y - 1, c.y = 0, g = !0));
                f && f(a, h, u, g)
            } a.move(c)
    };
    this.vector.moveCollisionAngle = function(a, b, c, f, d, g, h) {
        var u = e();
        d = math.a2r(OOP.isDef(d) ? d : a.angle);
        u.x =
            c * Math.cos(d);
        u.y = c * Math.sin(d);
        c = 0;
        d = b.length;
        for (var E; c < d; c += 1)
            if (E = b[c], !g || E.isInCamera())
                if (!h || !a.getDistanceC(E.getPositionC())) {
                    var k = E.getStaticBox();
                    if (a.isIntersect(E)) {
                        var l = a.getStaticBox(),
                            Ya = Math.abs(u.x),
                            m = Math.abs(u.y);
                        l.x + l.w > k.x + 10 + Ya && l.x < k.x + k.w - 10 - Ya && (0 < u.y && l.y + l.h < k.y + k.h / 2 + m ? u.y = 0 : 0 > u.y && l.y > k.y + k.h - k.h / 2 - m && (u.y = 0));
                        l.y + l.h > k.y + 10 + m && l.y < k.y + k.h - 10 - m && (0 < u.x && l.x + l.w < k.x + k.w / 2 + Ya ? u.x = 0 : 0 > u.x && l.x > k.x + k.w - k.w / 2 - Ya && (u.x = 0));
                        f && f(a, E)
                    }
                } a.move(u);
        return u
    };
    var $b = {},
        Bb = function() {
            var a =
                (new Date).getTime();
            $b[a] && (a = Bb());
            $b[a] = !0;
            return a
        },
        C = function(a) {
            return Math.PI / 180 * a
        },
        S = function(a, b, c) {
            var f = Math.floor(Math.random() * (b - a + 1) + a);
            return c && 0 == f ? S(a, b, c) : f
        },
        Cb = function(a) {
            return 0 > a ? -1 : 1
        };
    this.math.limit = function(a, b) {
        var c = Cb(a);
        a = Math.abs(a);
        b = Math.abs(b);
        return a < b ? a * c : b * c
    };
    this.math.sign = Cb;
    this.math.a2r = C;
    this.math.random = S;
    this.math.randomFY = function(a) {
        for (var b = a.length - 1; 0 < b; b--) {
            var c = Math.floor(Math.random() * (b + 1)),
                f = a[b];
            a[b] = a[c];
            a[c] = f
        }
        return a
    };
    this.math.toInt =
        function(a) {
            return a >> 0
        };
    this.math.uid = Bb;
    this.math.toZiro = function(a, b) {
        if (0 == a) return 0;
        var c = Cb(a);
        b = Math.abs(b);
        a = Math.abs(a);
        return 0 < a && (a -= b, a < b) ? 0 : a * c
    };
    var ac = function(a, b) {
            return a ? a : b ? b : !1
        },
        Db = [],
        Gc = function(a, b) {
            var c;
            this.canvas = c = k.document.createElement("canvas");
            var f = c.style,
                d = q.style;
            f.position = Da;
            f.top = d.top;
            f.left = d.left;
            c.width = q.width;
            c.height = q.height;
            f.width = d.width;
            f.height = d.height;
            f.zIndex = d.zIndex + a;
            b && (f.opacity = ac(b.alpha, 1), f.backgroundColor = ac(b.backgroundColor, "transparent"));
            l.attach(c);
            (this.context = c.getContext("2d")).textBaseline = t.textBaseline;
            this.isAutoClear = !0;
            this.clear = function() {
                this.context.clearRect(0, 0, m, n)
            };
            this.on = function(a) {
                h = this.context;
                this.isAutoClear && this.clear();
                a(this);
                h = bc
            };
            this.setVisible = function(a) {
                this.canvas.style = a ? "block" : "none"
            };
            Db.push(this)
        },
        sa = function() {
            v(Db, function(a) {
                a.canvas.width = m;
                a.canvas.height = n;
                a.canvas.style.width = q.style.width;
                a.canvas.style.height = q.style.height;
                a.context.textBaseline = t.textBaseline
            })
        },
        Hc = function() {
            v(Db,
                function(a) {
                    a.canvas.style.left = q.style.left;
                    a.canvas.style.top = q.style.top
                })
        };
    this.layers.newLayer = function(a, b) {
        return new Gc(a, b)
    };
    var cc = 0,
        l = {
            loaded: !1,
            events: {
                onload: [],
                preLoop: [],
                postLoop: [],
                entryLoop: [],
                exitLoop: [],
                gameBlur: [],
                gameFocus: [],
                gameResize: [],
                gameStop: [],
                gameStart: []
            },
            addEvent: function(a, b, c) {
                "onload" === a && l.loaded ? c() : l.events[a].push({
                    id: b,
                    func: c
                })
            },
            delEvent: function(a, b) {
                v(l.events[a], function(a, f, d) {
                    a.id === b && d.splice(f, 1)
                })
            },
            runEvent: function(a) {
                v(l.events[a], function(a) {
                    "function" ===
                    typeof a.func && a.func()
                })
            },
            attach: function(a) {
                var b = function() {
                    k.document.body.appendChild(a)
                };
                l.loaded ? b() : l.addEvent("onload", "attachElement_PointJS" + (cc += 1), b)
            },
            remove: function(a) {
                var b = function() {
                    k.document.body.removeChild(a)
                };
                l.loaded ? b() : l.addEvent("onload", "attachElement_PointJS" + (cc += 1), b)
            },
            getWH: function() {
                return {
                    w: parseInt(k.innerWidth || k.document.body.clientWidth),
                    h: parseInt(k.innerHeight || k.document.body.clientHeight)
                }
            }
        };
    this.system.delEvent = function(a, b) {
        l.delEvent(a, b)
    };
    this.system.addEvent =
        function(a, b, c) {
            l.addEvent(a, b, c)
        };
    this.system.removeDOM = function(a) {
        l.remove(a)
    };
    this.system.attachDOM = function(a) {
        l.attach(a)
    };
    this.system.newDOM = function(a, b) {
        var c = k.document.createElement(a);
        c.style.position = Da;
        c.style.left = 0;
        c.style.top = 0;
        c.style.zIndex = r.style.zIndex + 1;
        if (b) {
            var f = function(a) {
                a.stopPropagation()
            };
            c.addEventListener("touchstart", f, !1);
            c.addEventListener("touchend", f, !1);
            c.addEventListener("touchmove", f, !1);
            c.addEventListener("mousedown", f, !1);
            c.addEventListener("mousepress",
                f, !1);
            c.addEventListener("mouseup", f, !1);
            c.addEventListener("mousemove", f, !1);
            c.addEventListener("keypress", f, !1);
            c.addEventListener("keydown", f, !1);
            c.addEventListener("keyup", f, !1);
            c.addEventListener("click", f, !1);
            c.addEventListener("wheel", f, !1);
            c.addEventListener("mousewheel", f, !1);
            c.addEventListener("contextmenu", f, !1);
            c.addEventListener("selectstart", f, !1);
            c.addEventListener("dragstart", f, !1);
            c.addEventListener("DOMMouseScroll", f, !1)
        }
        l.attach(c);
        return c
    };
    var h = null,
        bc = null,
        Ia = e(Vb, Wb);
    var q =
        k.document.createElement("canvas");
    bc = h = q.getContext("2d");
    h.textBaseline = t.textBaseline;
    q.crossOrigin = "anonymous";
    q.width = parseInt(Ua);
    q.height = parseInt(Va);
    q.style.position = Da;
    K ? (q.style.left = Ia.x + "px", q.style.top = Ia.y + "px", l.addEvent("gameResize", "initedCanvasResize", function() {
        var a = Xb(K);
        A.system.setOffset(a.x, a.y);
        A.system.resize(K.offsetWidth, K.offsetHeight)
    })) : (q.style.left = 0, q.style.top = 0);
    q.style.zIndex = zb;
    q.id = "PointJS-canvas_0";
    if ("object" === typeof yb)
        for (var Eb in yb) Eb.match(/margin|padding|position/) ||
            (q.style[Eb] = yb[Eb]);
    this.system.setOffset = function(a, b) {
        r.style.left = q.style.left = a + "px";
        r.style.top = q.style.top = b + "px";
        Ia = {
            x: a,
            y: b
        };
        Hc()
    };
    var r = k.document.createElement("div");
    (function() {
        var a = r.style;
        a.position = Da;
        a.left = q.style.left;
        a.top = q.style.top;
        a.width = q.width + "px";
        a.height = q.height + "px";
        a.zIndex = zb + 100
    })();
    l.attach(r);
    l.attach(q);
    this.system.setStyle = function(a) {
        if ("object" === typeof a)
            for (var b in a) q.style[b] = a[b]
    };
    this.system.getCanvas = function() {
        return q
    };
    this.system.getContext = function() {
        return h
    };
    this.system.setContext = function(a) {
        a && (h = a)
    };
    this.system.resize = function(a, b) {
        m = a || na;
        n = b || oa;
        H = m / 2;
        I = n / 2;
        q.width = m;
        q.height = n;
        r.style.width = m + "px";
        r.style.height = n + "px";
        sa()
    };
    this.system.initFullPage = function() {
        K || (l.addEvent("gameResize", "PointJS_resizeGame", function() {
            m = l.getWH().w;
            n = l.getWH().h;
            H = m / 2;
            I = n / 2;
            q.width = m;
            q.height = n;
            h.textBaseline = t.textBaseline;
            r.style.width = m + "px";
            r.style.height = n + "px";
            sa()
        }), l.runEvent("gameResize", "PointJS_resizeGame"))
    };
    var Y = !1,
        Ic = function() {
            Y || (this.requestFullscreen ?
                (this.requestFullscreen(), Y = !0) : this.mozRequestFullScreen ? (this.mozRequestFullScreen(), Y = !0) : this.webkitRequestFullscreen && (this.webkitRequestFullscreen(), Y = !0), m = l.getWH().w, n = l.getWH().h, H = m / 2, I = n / 2, q.width = m, q.height = n, r.style.width = m + "px", r.style.height = n + "px", sa())
        },
        Fb = function(a) {
            Y = dc(k.document.fullscreenElement || k.document.mozFullScreenElement || k.document.webkitFullscreenElement)
        };
    k.document.addEventListener("webkitfullscreenchange", Fb);
    k.document.addEventListener("mozfullscreenchange", Fb);
    k.document.addEventListener("fullscreenchange", Fb);
    this.system.initFullScreen = function() {
        K || Y || (k.document.documentElement.onclick = Ic, Ja || (l.addEvent("gameResize", "PointJS_initFullScreen", function() {
            m = l.getWH().w;
            n = l.getWH().h;
            H = m / 2;
            I = n / 2;
            q.width = m;
            q.height = n;
            h.textBaseline = t.textBaseline;
            r.style.width = m + "px";
            r.style.height = n + "px";
            sa()
        }), l.runEvent("gameResize", "PointJS_initFullScreen")))
    };
    this.system.exitFullScreen = function() {
        Y && (l.delEvent("gameResize", "PointJS_initFullScreen"), k.document.exitFullscreen ?
            (k.document.exitFullscreen(), Y = !1) : k.document.mozCancelFullScreen ? (k.document.mozCancelFullScreen(), Y = !1) : k.document.webkitExitFullscreen && (k.document.webkitExitFullscreen(), Y = !1), m = na, n = oa, H = m / 2, I = n / 2, q.width = m, q.height = n, r.style.width = m + "px", r.style.height = n + "px", sa(), k.document.documentElement.onclick = function() {})
    };
    this.system.isFullScreen = function() {
        return Y
    };
    this.system.exitFullPage = function() {
        l.delEvent("gameResize", "PointJS_resizeGame");
        m = na;
        n = oa;
        H = m / 2;
        I = n / 2;
        q.width = m;
        q.height = n;
        r.style.width =
            m + "px";
        r.style.height = n + "px";
        sa()
    };
    var Z = !1,
        Ja = !1,
        ec = na,
        fc = oa,
        gc = !1;
    this.system.initFullScale = function(a) {
        K || Ja || (a && (gc = !0), l.addEvent("gameResize", "PointJS_initFullScale", function() {
            var a = ec,
                c = fc,
                f = l.getWH();
            gc ? (a = f.w, c = f.h) : f.w < f.h ? (c = f.w / m, a = f.w, c *= n) : f.h < f.w && (a = f.h / n, c = f.h, a *= m);
            ec = a;
            fc = c;
            Z = {
                w: a / m,
                h: c / n
            };
            q.style.width = a + "px";
            q.style.height = c + "px";
            r.style.width = a + "px";
            r.style.height = c + "px";
            sa()
        }), l.runEvent("gameResize", "PointJS_initFullScale"), Ja = !0)
    };
    this.system.exitFullScale = function() {
        Ja &&
            (Ja = !1, l.delEvent("gameResize", "PointJS_initFullScale"), q.style.width = na + "px", q.style.height = oa + "px", r.style.width = na + "px", r.style.height = oa + "px")
    };
    this.system.getWH = function() {
        return l.getWH()
    };
    var Gb = !1,
        Za = {
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40,
            SPACE: 32,
            CTRL: 17,
            SHIFT: 16,
            ALT: 18,
            ESC: 27,
            ENTER: 13,
            MINUS: 189,
            PLUS: 187,
            CAPS_LOCK: 20,
            BACKSPACE: 8,
            TAB: 9,
            DELETE: 46,
            Q: 81,
            W: 87,
            E: 69,
            R: 82,
            T: 84,
            Y: 89,
            U: 85,
            I: 73,
            O: 79,
            P: 80,
            A: 65,
            S: 83,
            D: 68,
            F: 70,
            G: 71,
            H: 72,
            J: 74,
            K: 75,
            L: 76,
            Z: 90,
            X: 88,
            V: 86,
            B: 66,
            N: 78,
            M: 77,
            0: 48,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            5: 53,
            6: 54,
            7: 55,
            8: 56,
            C: 67,
            9: 57,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123
        },
        za = {
            37: "LEFT",
            39: "RIGHT",
            38: "UP",
            40: "DOWN",
            32: "SPACE",
            17: "CTRL",
            16: "SHIFT",
            18: "ALT",
            27: "ESC",
            13: "ENTER",
            189: "MINUS",
            187: "PLUS",
            20: "CAPS_LOCK",
            8: "BACKSPACE",
            9: "TAB",
            46: "DELETE",
            81: "Q",
            87: "W",
            69: "E",
            82: "R",
            84: "T",
            89: "Y",
            85: "U",
            73: "I",
            79: "O",
            80: "P",
            65: "A",
            83: "S",
            68: "D",
            70: "F",
            71: "G",
            72: "H",
            74: "J",
            75: "K",
            76: "L",
            90: "Z",
            88: "X",
            86: "V",
            66: "B",
            78: "N",
            77: "M",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            67: "C",
            57: "9",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12"
        },
        Jc = {
            8: !0,
            9: !0,
            13: !0,
            18: !0,
            16: !0,
            17: !0,
            27: !0,
            112: !0,
            113: !0,
            114: !0,
            115: !0,
            116: !0,
            117: !0,
            118: !0,
            119: !0,
            120: !0,
            121: !0,
            122: !0,
            123: !0
        };
    this.keyControl.getKeyList = function() {
        var a, b = [];
        for (a in Za) b.push(a);
        return b
    };
    var aa = {},
        Ka = {},
        ta = {},
        La = !1,
        Ma = !1,
        $a = !1,
        ab = !1,
        Kc = function(a) {
            G(ta, function(a, c, f) {
                1 == a && (f[c] = 2)
            })
        };
    this.keyControl.getCountKeysDown = function() {
        var a =
            0;
        G(aa, function(b, c) {
            b && a++
        });
        return a
    };
    this.keyControl.getAllKeysDown = function() {
        var a = [];
        G(aa, function(b, c) {
            b && a.push(za[c])
        });
        return a
    };
    this.keyControl.getLastKeyPress = function() {
        return ab ? za[ab] : !1
    };
    this.keyControl.isDown = function(a) {
        return 1 == aa[Za[a]]
    };
    this.keyControl.isUp = function(a) {
        return 1 == Ka[Za[a]]
    };
    this.keyControl.isPress = function(a) {
        return 1 == ta[Za[a]]
    };
    this.keyControl.getInputChar = function() {
        return La
    };
    this.keyControl.getInputKey = function() {
        return za[Ma]
    };
    this.keyControl.setInputMode =
        function(a) {
            $a = a
        };
    this.keyControl.isInputMode = function() {
        return $a
    };
    this.keyControl.exitKeyControl = function() {
        k.onkeydown = function() {};
        k.onkeypress = function() {};
        k.onkeyup = function() {};
        D.clear("key:down");
        D.clear("key:press");
        D.clear("key:up");
        l.delEvent("postLoop", "PointJS_clearAllKeyUp");
        l.delEvent("preLoop", "PointJS_KeyDownEvent");
        aa = {};
        Ka = {};
        ta = {};
        Gb = $a = Ma = La = !1
    };
    this.keyControl.initControl = this.keyControl.initKeyControl = function() {
        if (Gb) return this;
        Gb = !0;
        k.onkeydown = function(a) {
            if ($a) return Ma =
                a.keyCode, Jc[a.keyCode] ? (a.preventDefault(), !1) : !0;
            a.preventDefault();
            2 != ta[a.keyCode] && (ta[a.keyCode] = 1, ab = a.keyCode, D.run("key:press", za[a.keyCode]));
            aa[a.keyCode] = !0;
            return !1
        };
        k.onkeypress = function(a) {
            var b = !1;
            0 != a.which && 0 != a.charCode && 32 <= a.which && (b = String.fromCharCode(a.which));
            La = b
        };
        k.onkeyup = function(a) {
            a.preventDefault();
            1 == aa[a.keyCode] && (Ka[a.keyCode] = !0);
            aa[a.keyCode] = !1;
            D.run("key:up", za[a.keyCode]);
            delete ta[a.keyCode];
            delete aa[a.keyCode];
            return !1
        };
        l.addEvent("postLoop", "PointJS_clearAllKeyUp",
            function() {
                Ka = {};
                Kc();
                ab = Ma = La = !1
            });
        l.addEvent("preLoop", "PointJS_KeyDownEvent", function() {
            D.isEvent("key:down") && G(aa, function(a, b) {
                a && D.run("key:down", za[b])
            })
        });
        return this
    };
    var Na = !1,
        x = e(0, 0),
        bb = e(0, 0);
    e(0, 0);
    var Oa = !0,
        cb = "",
        db = !1,
        ua = e(0, 0),
        eb = !1,
        Hb = {
            LEFT: 1,
            RIGHT: 3,
            MIDDLE: 2
        },
        Ib = {
            1: "LEFT",
            3: "RIGHT",
            2: "MIDDLE"
        },
        fb = !1,
        gb = {},
        hb = {},
        Pa = {},
        Aa = 0,
        hc = function() {
            gb = {};
            hb = {};
            Pa = {};
            Aa = 0;
            eb = !1
        },
        Lc = function() {
            G(Pa, function(a, b, c) {
                1 == a && (c[b] = 2)
            })
        },
        ib = function(a) {
            var b = 0,
                c = 0;
            a && (b = g.x, c = g.y);
            return e(b + x.x, c +
                x.y)
        };
    this.mouseControl.getPosition = function() {
        return ib(1)
    };
    this.mouseControl.getPositionS = function() {
        return ib()
    };
    this.mouseControl.setCursorImage = function(a) {
        a = "url('" + a + "'), auto";
        if (cb !== a) return cb = a, k.document.body.style.cursor = cb
    };
    this.mouseControl.setVisible = function(a) {
        !Oa && !a || Oa && a || (Oa = 1 == a, k.document.body.style.cursor = Oa ? cb : "none")
    };
    this.mouseControl.isVisible = function() {
        return Oa
    };
    this.mouseControl.isDown = function(a) {
        return gb[Hb[a]]
    };
    this.mouseControl.isUp = function(a) {
        return hb[Hb[a]]
    };
    this.mouseControl.isPress = function(a) {
        return 1 == Pa[Hb[a]]
    };
    this.mouseControl.isMove = function() {
        return eb
    };
    this.mouseControl.isInStatic = function(a) {
        var b = ib(1);
        return b.x >= a.x && b.x <= a.x + a.w && b.y >= a.y && b.y <= a.y + a.h
    };
    this.mouseControl.isInDynamic = function(a) {
        return ra(ib(1), a)
    };
    this.mouseControl.isInObject = function(a) {
        return a.visible ? a.angle ? this.isInDynamic(a.getDynamicBox()) : this.isInStatic(a.getStaticBox()) : !1
    };
    this.mouseControl.isWheel = function(a) {
        return "UP" === a && 0 < Aa || "DOWN" === a && 0 > Aa
    };
    var ic =
        function(a) {
            a.preventDefault();
            Aa = a.wheelDelta ? a.wheelDelta : -a.detail;
            D.run("mouse:wheel", 0 > Aa ? "DOWN" : "UP");
            return !1
        },
        jb = !1,
        jc = function() {
            jb && (db = w(k.document.pointerLockElement) || w(k.document.mozPointerLockElement) ? !0 : !1)
        };
    this.mouseControl.initMouseLock = function() {
        l.addEvent("onload", "initPointerLock", function() {
            jb = r.requestPointerLock || r.mozRequestPointerLock || !1;
            k.document.exitPointerLock = k.document.exitPointerLock || k.document.mozExitPointerLock || !1;
            "onpointerlockchange" in k.document ? k.document.addEventListener("pointerlockchange",
                jc, !1) : "onmozpointerlockchange" in k.document && k.document.addEventListener("mozpointerlockchange", jc, !1);
            if (!jb) return ea("error in initMouseLock : not supported");
            db || (r.onclick = jb)
        })
    };
    this.mouseControl.exitMouseLock = function() {
        k.document.exitPointerLock();
        r.onclick = function() {};
        ua = e(0, 0)
    };
    this.mouseControl.unlockMouse = function() {
        ua = e(0, 0);
        k.document.exitPointerLock()
    };
    this.mouseControl.isMouseLock = function() {
        return db
    };
    this.mouseControl.getSpeed = function() {
        return e(ua.x, ua.y)
    };
    this.mouseControl.isPeekStatic =
        function(a, b) {
            return this.isPress(a) ? this.isInStatic(b) : !1
        };
    this.mouseControl.isPeekDynamic = function(a, b) {
        return this.isPress(a) ? this.isInDynamic(b) : !1
    };
    this.mouseControl.isPeekObject = function(a, b) {
        return this.isPress(a) && b.visible ? this.isInDynamic(b.getDynamicBox()) : !1
    };
    this.mouseControl.initControl = this.mouseControl.initMouseControl = function() {
        if (Na) return this;
        Na = !0;
        r.onmousemove = function(a) {
            a.preventDefault();
            a.stopPropagation();
            if (db) {
                var b = a.movementY || a.mozMovementY || 0;
                x.x += a.movementX || a.mozMovementX ||
                    0;
                x.y += b
            } else x.x = a.pageX - Ia.x, x.y = a.pageY - Ia.y, Z && (x.x /= Z.w, x.y /= Z.h);
            x.x /= pa;
            x.y /= qa;
            ua.x = x.x - bb.x;
            ua.y = x.y - bb.y;
            bb.x = x.x;
            bb.y = x.y;
            D.run("mouse:move");
            eb = !0;
            return !1
        };
        r.onmousedown = function(a) {
            a.preventDefault();
            a.stopPropagation();
            !a.which && a.button && (a.button & 1 ? a.which = 1 : a.button & 4 ? a.which = 2 : a.button & 2 && (a.which = 3));
            D.run("mouse:press", Ib[a.which]);
            fb = Ib[a.which];
            gb[a.which] = !0;
            Pa[a.which] = 1
        };
        r.onmouseup = function(a) {
            a.preventDefault();
            a.stopPropagation();
            !a.which && a.button && (a.button & 1 ? a.which =
                1 : a.button & 4 ? a.which = 2 : a.button & 2 && (a.which = 3));
            D.run("mouse:up", Ib[a.which]);
            fb = !1;
            gb[a.which] = !1;
            hb[a.which] = !0;
            delete Pa[a.which]
        };
        r.oncontextmenu = r.onselectstart = r.ondragstart = function() {
            return !1
        };
        r.onmousewheel = ic;
        r.addEventListener("DOMMouseScroll", ic, !1);
        l.addEvent("preLoop", "PointJS_MouseEventDown", function() {
            fb && D.run("mouse:down", fb)
        });
        l.addEvent("postLoop", "PointJS_clearAllMouseUp", function() {
            hb = {};
            Lc();
            Aa = 0;
            eb = !1;
            ua = e(0, 0)
        });
        return this
    };
    this.mouseControl.exitMouseControl = function() {
        D.clear("mouse:press");
        D.clear("mouse:down");
        D.clear("mouse:up");
        D.clear("mouse:move");
        D.clear("mouse:wheel");
        r.onmousemove = r.onmousedown = r.onmouseup = r.oncontextmenu = r.onselectstart = r.ondragstart = r.onmousewheel = function() {};
        l.delEvent("postLoop", "PointJS_clearAllMouseUp");
        l.delEvent("preLoop", "PointJS_MouseEventDown");
        hc();
        Na = !1
    };
    var Jb = !1,
        Qa = !1,
        kb = 0,
        lb = 0,
        L = 0,
        M = 0,
        y = e(0, 0),
        mb = [],
        Ra = e(0, 0),
        nb = e(0, 0);
    this.touchControl.isTouchSupported = function() {
        return !!("ontouchstart" in window)
    };
    this.touchControl.isMobileDevice = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(k.navigator.userAgent)
    };
    var kc = function() {
        Qa = !1;
        lb = kb = 0;
        y = e(0, 0);
        mb = [];
        M = L = 0
    };
    this.touchControl.getFixPositionS = function() {
        return y.x || y.y ? e(y.x, y.y) : !1
    };
    this.touchControl.getFixPosition = function() {
        return y.x || y.y ? e(y.x + g.x, y.y + g.y) : !1
    };
    this.touchControl.getRun = function() {
        var a = 0,
            b = 0;
        y.x && y.x != L && (a = L - y.x);
        y.y && y.y != M && (b = M - y.y);
        return e(a, b)
    };
    this.touchControl.getVector = function() {
        var a = 0,
            b = 0;
        y.x && y.x != L && (a = L > y.x ? 1 : -1);
        y.y && y.y != M && (b = M > y.y ? 1 : -1);
        return e(a, b)
    };
    this.touchControl.getSpeed = function() {
        return e(Ra.x, Ra.y)
    };
    this.touchControl.isDown = function() {
        return Qa
    };
    this.touchControl.isPress = function() {
        return 1 == kb
    };
    this.touchControl.isUp = function() {
        return 1 == lb
    };
    this.touchControl.getPosition = function() {
        return e(L + g.x, M + g.y)
    };
    this.touchControl.getPositionS = function() {
        return e(L, M)
    };
    this.touchControl.isPeekStatic = function(a) {
        return this.isPress() ? this.isInStatic(a) : !1
    };
    this.touchControl.isPeekDynamic = function(a) {
        return this.isPress() ? this.isInDynamic(a) : !1
    };
    this.touchControl.isPeekObject = function(a) {
        return this.isPress() &&
            a.visible ? this.isInDynamic(a.getDynamicBox()) : !1
    };
    this.touchControl.isInStatic = function(a) {
        var b = this.getPosition();
        return b.x >= a.x && b.x <= a.x + a.w && b.y >= a.y && b.y <= a.y + a.h
    };
    this.touchControl.isInDynamic = function(a) {
        return ra(this.getPosition(), a)
    };
    this.touchControl.isInObject = function(a) {
        return a.visible ? a.angle ? this.isInDynamic(a.getDynamicBox()) : this.isInStatic(a.getStaticBox()) : !1
    };
    this.touchControl.getTouches = function() {
        return mb
    };
    this.touchControl.initControl = this.touchControl.initTouchControl =
        function() {
            if (Jb) return this;
            Jb = !0;
            k.addEventListener("touchstart", function(a) {
                a.preventDefault();
                L = a.targetTouches[0].pageX;
                M = a.targetTouches[0].pageY;
                mb = a.targetTouches;
                Z && (L /= Z.w, M /= Z.h);
                D.run("touch:press");
                y.x = L;
                y.y = M;
                Qa = !0;
                kb = 1;
                return !1
            }, {
                passive: !1
            });
            k.addEventListener("touchmove", function(a) {
                L = a.targetTouches[0].pageX;
                M = a.targetTouches[0].pageY;
                mb = a.targetTouches;
                Z && (L /= Z.w, M /= Z.h);
                Ra.x = L - nb.x;
                Ra.y = M - nb.y;
                D.run("touch:move");
                return !1
            }, !1);
            k.addEventListener("touchend", function(a) {
                y.x = 0;
                y.y =
                    0;
                Qa = !1;
                lb = 1;
                D.run("touch:up");
                return !1
            }, !1);
            A.touchControl.vibrate = function(a) {
                if (k.navigator.vibrate) return k.navigator.vibrate(a);
                if (k.navigator.oVibrate) return k.navigator.oVibrate(a);
                if (k.navigator.mozVibrate) return k.navigator.mozVibrate(a);
                if (k.navigator.webkitVibrate) return k.navigator.webkitVibrate(a)
            };
            l.addEvent("preLoop", "PointJS_TouchDownEvent", function() {
                Qa && D.run("touch:down")
            });
            l.addEvent("postLoop", "PointJS_touchStopPress", function() {
                lb = kb = 0;
                nb.x = L;
                nb.y = M;
                Ra = e(0, 0)
            });
            return this
        };
    this.touchControl.exitTouchControl = function() {
        k.ontouchstart = k.ontouchmove = k.ontouchend = function(a) {};
        l.delEvent("postLoop", "PointJS_touchStopPress");
        l.delEvent("preLoop", "PointJS_TouchDownEvent");
        kc();
        Jb = !1
    };
    var ob = function(a, b, c, f) {
            return f ? "rgba(" + a + ", " + b + ", " + c + ", " + f + ")" : "rgb(" + a + ", " + b + ", " + c + ")"
        },
        lc = function(a, b) {
            a = "#" === a[0] ? a.substr(1, 6) : a;
            var c = parseInt(a.substr(0, 2), 16),
                f = parseInt(a.substr(2, 2), 16),
                d = parseInt(a.substr(4, 2), 16);
            return ob(c, f, d, b)
        };
    this.colors.rgb = function(a, b, c) {
        return ob(a,
            b, c)
    };
    this.colors.rgba = function(a, b, c, f) {
        return ob(a, b, c, f)
    };
    this.colors.hex2rgb = function(a) {
        return lc(a)
    };
    this.colors.hex2rgba = function(a, b) {
        return lc(a, b)
    };
    this.colors.randomColor = function(a, b, c) {
        return ob(S(a, b), S(a, b), S(a, b), c || 1)
    };
    this.colors.fromImage = function(a, b, c, f, d) {
        var u = {
            img: k.document.createElement("img"),
            color: null
        };
        u.img.onload = function() {
            var a = k.document.createElement("canvas");
            a.width = f ? f : this.width;
            a.height = d ? d : this.height;
            a.getContext("2d").drawImage(this, 0, 0, a.width, a.height);
            u.color = h.createPattern(a, b);
            "function" === typeof c && (u.onload = c, u.onload(), delete u.onload)
        };
        u.img.src = a;
        return u
    };
    var w = function(a) {
            return "undefined" == typeof a || null == a ? !1 : !0
        },
        dc = function(a) {
            return w(a) && "" !== a && 0 !== a ? !0 : !1
        },
        G = function(a, b, c) {
            var f, d;
            for (f in a)
                if ((!c || a.hasOwnProperty(f)) && "undefined" !== typeof a[f] && (d = b(a[f], f, a)) && "break" === d) break
        },
        v = function(a, b) {
            if (a.length)
                for (var c = a.length - 1, f; 0 <= c && ("undefined" === typeof a[c] || !(f = b(a[c], c, a) || !1) || "break" !== f); c--);
        };
    this.OOP.extractArrElement =
        function(a, b) {
            var c = a[b];
            a.splice(b, 1);
            return c
        };
    this.OOP.extractRandArrElement = function(a) {
        var b = S(0, a.length - 1),
            c = a[b];
        a.splice(b, 1);
        return c
    };
    this.OOP.drawEach = function(a, b) {
        G(a, function(a) {
            a && a.draw && a.isInCamera() && (a.draw(), b && b(a))
        })
    };
    this.OOP.drawArr = function(a, b) {
        var c;
        var f = 0;
        for (c = a.length; f < c; f += 1) a[f] && a[f].draw && a[f].isInCamera() && (a[f].draw(), b && b(a[f], f))
    };
    this.OOP.getArrInCamera = function(a) {
        var b = [];
        v(a, function(a) {
            a.isInCamera() && b.push(a)
        });
        return b
    };
    this.OOP.getArrOutCamera = function(a) {
        var b = [];
        v(a, function(a) {
            a.isInCamera() || b.push(a)
        });
        return b
    };
    var mc = function(a) {
            a.length = 0
        },
        Mc = function(a, b) {
            var c = !1,
                f = Bb(),
                d = !1,
                e = new XMLHttpRequest,
                g = function() {
                    e.open("GET", a, !0);
                    e.send()
                };
            e.onreadystatechange = function() {
                4 == e.readyState && (b(e.responseText), c && (d ? setTimeout(g, d) : g()))
            };
            this.start = function() {
                a = a.match(/\?/) ? a + ("&session_id=" + f) : a + ("?session_id=" + f);
                g();
                c = !0
            };
            this.setSID = function(a) {
                f = a
            };
            this.setTime = function(a) {
                d = a
            };
            this.stop = function() {
                c = !1
            };
            this.isActive = function() {
                return c
            }
        };
    this.OOP.readJSON =
        function(a, b, c) {
            var f = {},
                d = new XMLHttpRequest;
            d.open("GET", a, !0);
            B.add();
            d.onreadystatechange = function() {
                4 == d.readyState && (f = d.responseText, c || (f = JSON.parse(f)), B.load(), b(f))
            };
            d.send()
        };
    this.OOP.toString = function(a, b) {
        var c, f = 0,
            d = "[";
        for (c in a)
            if (a.hasOwnProperty(c)) {
                var e = a[c];
                "number" == typeof e && b && (e = parseInt(e));
                d += (0 < f ? ", " : "") + c + " : " + e;
                f += 1
            } return d + "]"
    };
    this.OOP.sendGET = function(a, b, c) {
        var f = new XMLHttpRequest,
            d = "?";
        G(b, function(a, b) {
            d += b + "=" + encodeURIComponent(a) + "&"
        });
        f.open("GET", a + d,
            !0);
        f.onreadystatechange = function() {
            4 == f.readyState && c(f.responseText)
        };
        f.send()
    };
    this.OOP.sendPOST = function(a, b, c) {
        var f = new XMLHttpRequest,
            d = "";
        G(b, function(a, b) {
            d += b + "=" + encodeURIComponent(a) + "&"
        });
        f.open("POST", a, !0);
        f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        f.onreadystatechange = function() {
            4 == f.readyState && c(f.responseText)
        };
        f.send(d)
    };
    this.OOP.sendPOSTScreen = function(a, b, c) {
        var f = new XMLHttpRequest;
        b = b + "=" + q.toDataURL("image/png");
        f.open("POST", a, !0);
        f.setRequestHeader("Content-Type",
            "application/x-www-form-urlencoded");
        f.onreadystatechange = function() {
            4 == f.readyState && c(f.responseText)
        };
        f.send(b)
    };
    this.OOP.isDef = w;
    this.OOP.isSet = dc;
    this.OOP.forEach = G;
    this.OOP.forInt = function(a, b) {
        var c, f;
        for (c = 0; c < a && (!(f = b(c)) || "break" != f); c += 1);
    };
    this.OOP.forXY = function(a, b, c) {
        var f, d, e;
        for (d = 0; d < b; d += 1)
            for (f = 0; f < a && (!(e = c(f, d)) || "break" != e); f += 1);
    };
    this.OOP.forArr = v;
    this.OOP.clearArr = mc;
    this.OOP.fillArr = function(a, b, c) {
        a.length = 0;
        var f;
        for (f = 0; f < b; f += 1) a.push(c(f, 0 < f ? a[f - 1] : !1));
        return a
    };
    this.OOP.delObject = function(a, b) {
        var c;
        var f = 0;
        for (c = a.length; f < c; f += 1)
            if (a[f] == b) return a.splice(f, 1), !0
    };
    this.OOP.randArrElement = function(a) {
        return a[S(0, a.length - 1)]
    };
    this.OOP.readJSONSync = function(a) {
        var b = new XMLHttpRequest;
        b.open("GET", a, !1);
        b.send();
        a = b.responseText;
        return a = JSON.parse(a)
    };
    this.OOP.sendGETSync = function(a, b) {
        var c = new XMLHttpRequest,
            f = "?";
        G(b, function(a, b) {
            f += b + "=" + encodeURIComponent(a) + "&"
        });
        c.open("GET", a + f, !1);
        c.send();
        return c.responseText
    };
    this.OOP.sendPOSTSync = function(a,
        b) {
        var c = new XMLHttpRequest,
            f = "";
        G(b, function(a, b) {
            f += b + "=" + encodeURIComponent(a) + "&"
        });
        c.open("POST", a, !1);
        c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        c.send(f);
        return c.responseText
    };
    this.OOP.newAJAXListener = function(a, b) {
        return new Mc(a, b)
    };
    this.OOP.runCode = function(a) {
        (new Function("", a))()
    };
    var N = {};
    this.OOP.includeSync = function(a, b) {
        if (N[a]) N[a].loaded && !b && N[a].code();
        else {
            N[a] = {
                loaded: !1,
                code: function() {
                    console.log(a + " is loading")
                }
            };
            var c = new XMLHttpRequest;
            c.open("GET",
                a, !1);
            c.send();
            N[a].code = new Function("", c.responseText);
            N[a].loaded = !0;
            N[a].code()
        }
    };
    this.OOP.include = function(a, b, c) {
        if (N[a]) N[a].loaded && !c && N[a].code(), b && b();
        else {
            N[a] = {
                loaded: !1,
                code: function() {
                    console.log(a + " is loading")
                }
            };
            var f = new XMLHttpRequest;
            f.open("GET", a, !0);
            f.onreadystatechange = function() {
                4 === f.readyState && (N[a].code = new Function("", f.responseText), N[a].loaded = !0, N[a].code(), b && b())
            };
            f.send()
        }
    };
    this.OOP.clone = function(a, b) {
        var c = nc(a);
        G(a, function(a, b) {
            -1 === ["id", "type", "anim"].indexOf(b) &&
                (c[b] = a)
        });
        b && (c.onClone = b, c.onClone(c), delete c.onClone);
        return c
    };
    var Nc = function() {
        var a = [];
        this.fillFromArr = function(b) {
            a.length = 0;
            v(b, function(b) {
                a.push(b)
            })
        };
        this.fill = function(b, c) {
            a.length = 0;
            A.OOP.fillArr(a, b, c)
        };
        this.draw = function(b) {
            for (var c = a.length - 1; 0 <= c; c--) a[c].isInCamera() && (a[c].draw(), b && b(a[c], c))
        };
        this.update = function(b, c) {
            for (var f = a.length - 1; 0 <= f; f--) c && !a[f].isInCamera() || b(a[f], f)
        };
        this.add = function(b) {
            a.push(b)
        };
        this.del = function(b) {
            A.OOP.delObject(a, b)
        }
    };
    this.OOP.newGroup =
        function() {
            return new Nc
        };
    var Sa = 60,
        O = Date.now(),
        pb = 0,
        qb = -1,
        oc = O,
        ka = {},
        rb = 0;
    this.game.setFPS = function(a) {
        Sa = 0 < a ? a : 60
    };
    this.game.getDT = function(a) {
        a || (a = 1E3);
        return pb / a
    };
    this.game.getTime = function() {
        return O
    };
    var pc = function() {
            return k.requestAnimationFrame || k.webkitRequestAnimationFrame || k.mozRequestAnimationFrame || k.oRequestAnimationFrame || k.msRequestAnimationFrame || function(a) {
                k.setTimeout(a, 1E3 / Sa)
            }
        },
        Ba = pc(),
        qc = function() {
            O = Date.now();
            Zb && h.clearRect(0, 0, m, n);
            l.runEvent("preLoop")
        },
        rc = function() {
            l.runEvent("postLoop"); -
            1 !== qb && (pb = O - qb);
            qb = O
        },
        P = {
            func: function() {
                console.log('please, use a "setLoop" function.');
                Ba = function() {}
            },
            events: !1,
            start: !1,
            end: !1,
            audio: !1,
            fps: !1,
            name: "NotLoop"
        },
        sc = function() {
            P.audio && v(P.audio, function(a) {
                a.stop()
            })
        };
    this.game.newLoop = function(a, b, c, f, d) {
        "function" === typeof b ? ka[a] = {
            events: d || !1,
            func: b,
            start: c || !1,
            end: f || !1,
            audio: !1,
            fps: !1,
            name: a
        } : la("error in newLoop : " + b + " is not a function")
    };
    this.game.newLoopFromClassObject = function(a, b) {
        if (!b.update) return la('error in newLoopFromClassObject : function "update" not found');
        ka[a] = {
            events: b.events || !1,
            func: b.update,
            start: b.entry || !1,
            end: b.exit || !1,
            audio: !1,
            fps: !1,
            name: a
        }
    };
    this.game.newLoopFromConstructor = function(a, b) {
        A.game.newLoopFromClassObject(a, new b)
    };
    this.game.setLoopSound = function(a, b) {
        var c;
        ka[a].audio || (ka[a].audio = []);
        for (c = 0; c < b.length; c += 1) ka[a].audio.length = 0, b[c].setNextPlay(b[c + 1 === b.length ? 0 : c + 1]), ka[a].audio.push(b[c])
    };
    this.game.setLoop = function(a) {
        if (!ka[a]) return la("setLoop : " + a + " is no a Loop");
        sc();
        hc();
        aa = {};
        Ka = {};
        ta = {};
        Ma = La = !1;
        kc();
        Kb(e(0,
            0));
        P.end && P.end();
        l.runEvent("exitLoop");
        P = ka[a];
        D.loadFromEvents(P.events);
        P.start && P.start();
        l.runEvent("entryLoop");
        P.audio && P.audio[0].play()
    };
    var D = new function() {
        var a = {
                "mouse:click": []
            },
            b = this;
        this.add = function(b, f) {
            a[b] || (a[b] = []);
            a[b].push(f)
        };
        this.run = function(b, f) {
            a[b] && v(a[b], function(a) {
                return a(f)
            })
        };
        this.clear = function(b) {
            a[b] && (a[b].length = 0)
        };
        this.clearAll = function() {
            G(a, function(a) {
                a.length = 0
            })
        };
        this.loadFromEvents = function(a) {
            b.clearAll();
            a && G(a, function(a, c) {
                b.add(c, a)
            })
        };
        this.isEvent =
            function(b) {
                return !!a[b]
            }
    };
    this.game.tick = function(a, b) {
        rb === a && b()
    };
    var sb = {};
    this.game.skip = function(a, b, c) {
        w(sb[a]) || (sb[a] = 0);
        sb[a]++ >= b && (c(), sb[a] = 0)
    };
    var Lb = function() {
            60 > rb ? rb++ : rb = 0;
            if (60 > Sa) {
                var a = 1E3 / Sa;
                try {
                    O = Date.now(), O - oc > a && (qc(), P.func(pb), oc = O, rc())
                } catch (b) {
                    Ea && Wa(b), Ab && (Ea || Wa(b), la())
                }
                Ba(Lb);
                return !1
            }
            try {
                qc(), P.func(pb), rc()
            } catch (b) {
                Ea && Wa(b), Ab && (Ea || Wa(b), la())
            }
            Ba(Lb)
        },
        tc = function(a) {
            ja || (ja = !0, Sa = a || 60, Ba(Lb), l.runEvent("gameStart"))
        },
        la = function(a) {
            ja && (ja = !1, sc(), Ba = function() {
                "undefined" !==
                typeof a && ea(a)
            }, l.runEvent("gameStop"))
        };
    this.game.isStopped = function() {
        return !ja
    };
    this.game.getWH = function() {
        return {
            w: m,
            h: n,
            w2: H,
            h2: I
        }
    };
    this.game.getWH2 = function() {
        return {
            w: H,
            h: I
        }
    };
    this.game.getResolution = function() {
        return Math.min(m / na, n / oa)
    };
    this.game.startLoop = function(a, b) {
        this.setLoop(a);
        this.start(b)
    };
    this.game.start = tc;
    this.game.stop = la;
    this.game.resume = function() {
        if (!ja) return P.audio && P.audio[0].play(), Ba = pc(), qb = -1, tc(), !1
    };
    var Oc = 0,
        F = function(a) {
            this.type = "BaseObject";
            this.id = Oc += 1;
            this.x =
                a.x || 0;
            this.y = a.y || 0;
            this.w = a.w || 0;
            this.h = a.h || 0;
            this.ondraw = a.ondraw ? a.ondraw : !1;
            "function" === typeof a.predraw && (this.predraw = a.predraw);
            this.parent = !1;
            this.children = [];
            this.fillColor = a.fillColor || !1;
            this.strokeColor = a.strokeColor || t.strokeStyle;
            this.strokeWidth = a.strokeWidth || 0;
            this.angle = a.angle || 0;
            this.alpha = w(a.alpha) ? a.alpha : 1;
            this.center = e(0, 0);
            this.box = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.visible = w(a.visible) ? a.visible : !0;
            this.flip = e(0, 0);
            this.__dataset__ = {};
            this.setShadow(a);
            "object" === typeof a.data &&
                G(a.data, function(a, c) {
                    this.dataSet(c, a)
                }, !0);
            a.userData && this.setUserData(a.userData);
            a.center && this.setCenter(a.center);
            a.box && this.setBox(a.box);
            a.size && this.setSize(a.size);
            a.sizeC && this.setSizeC(a.sizeC);
            a.position && this.setPosition(a.position);
            a.positionC && this.setPositionC(a.positionC);
            "function" === typeof a.oncreate && (this.oncreate = a.oncreate, this.oncreate(this), delete this.oncreate)
        };
    F.prototype = {
        predraw: function() {},
        getID: function() {
            return this.id
        },
        getType: function() {
            return this.type
        },
        dataDel: function(a) {
            delete this.__dataset__[a]
        },
        dataSet: function(a, b) {
            this.__dataset__[a] = b
        },
        dataGet: function(a, b) {
            return "undefined" !== typeof this.__dataset__[a] ? this.__dataset__[a] : "undefined" !== typeof b ? b : !1
        },
        data: function() {
            return this.__dataset__
        },
        getParent: function() {
            return this.parent
        },
        addChild: function(a) {
            a && a.id != this.id && (a.parent = this, this.children.push(a), a.move(this.getPosition()), a.setPositionC(J(a.getPositionC(), this.getPositionC(), this.angle)), a.turn(this.angle))
        },
        delChild: function(a) {
            a.parent = !1;
            var b;
            var c = 0;
            for (b = this.children.length; c <
                b; c += 1)
                if (this.children[c].id == a.id) {
                    this.children.splice(c, 1);
                    break
                }
        },
        delParent: function() {
            this.parent.delChild(this)
        },
        setBox: function(a) {
            a.offset && (this.box.x = a.offset.x || 0, this.box.y = a.offset.y || 0);
            a.size && (this.box.w = a.size.w || 0, this.box.h = a.size.h || 0)
        },
        isArrIntersect: function(a) {
            var b;
            var c = 0;
            for (b = a.length; c < b; c += 1)
                if (a[c].id !== this.id && this.isIntersect(a[c])) return a[c];
            return !1
        },
        isArrInside: function(a) {
            var b;
            var c = 0;
            for (b = a.length; c < b; c += 1)
                if (this.isDynamicInside(a[c].getDynamicBox())) return a[c];
            return !1
        },
        getNearest: function(a) {
            var b = 0,
                c = !1,
                f;
            var d = 0;
            for (f = a.length; d < f; d += 1)
                if (this.id !== a[d].id) {
                    !1 === c && (c = this.getDistanceC(a[d].getPositionC()), b = d);
                    var e = this.getDistanceC(a[d].getPositionC());
                    e < c && (c = e, b = d)
                } return a[b]
        },
        setFlip: function(a, b) {
            w(a) && this.flip.x !== a && (this.flip.x = a);
            w(b) && this.flip.y !== b && (this.flip.y = b)
        },
        setUserData: function(a) {
            for (var b in a) w(this[b]) || (this[b] = a[b])
        },
        setShadow: function(a) {
            this.shadowColor = a.shadowColor || !1;
            this.shadowBlur = w(a.shadowBlur) ? a.shadowBlur : 3;
            this.shadowX = a.shadowX || 0;
            this.shadowY = a.shadowY || 0
        },
        getDynamicBox: function() {
            var a = this.getPosition(1);
            return 0 === this.angle ? [e(this.x + this.box.x, this.y + this.box.y), e(this.x + this.box.x + this.w + this.box.w, this.y + this.box.y), e(this.x + this.box.x + this.w + this.box.w, this.y + this.box.y + this.h + this.box.h), e(this.x + this.box.x, this.y + this.box.y + this.h + this.box.h)] : [J(e(this.x + this.box.x, this.y + this.box.y), a, this.getAngle()), J(e(this.x + this.box.x + this.w + this.box.w, this.y + this.box.y), a, this.getAngle()), J(e(this.x +
                this.box.x + this.w + this.box.w, this.y + this.box.y + this.h + this.box.h), a, this.getAngle()), J(e(this.x + this.box.x, this.y + this.box.y + this.h + this.box.h), a, this.getAngle())]
        },
        isDynamicIntersect: function(a) {
            if (3 > a.length) return !1;
            var b = this.getDynamicBox(),
                c;
            for (c = b.length - 1; 0 <= c; c--)
                if (ra(b[c], a)) return !0;
            for (c = b.length - 1; 0 <= c; c--)
                if (ra(a[c], b)) return !0;
            return !1
        },
        isIntersect: function(a) {
            return a.visible ? this.angle || a.angle ? this.isDynamicIntersect(a.getDynamicBox()) : this.isStaticIntersect(a.getStaticBox()) :
                !1
        },
        isDynamicInside: function(a) {
            if (3 > a.length) return !1;
            var b = this.getDynamicBox(),
                c, f = 0;
            var d = 0;
            for (c = b.length; d < c; d += 1) ra(b[d], a) && (f += 1);
            return f === b.length ? !0 : !1
        },
        drawDynamicBox: function(a, b, c, f, d) {
            T(this, 1);
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + (a || 0), this.y + this.box.y + (b || 0)), z(this.w + this.box.w + (2 * c || 0), this.h + this.box.h + (2 * f || 0)), !1, d || "red", 2);
            uc(e(this.x + this.w / 2 + this.center.x, this.y + this.h / 2 + this.center.y), 10, d || "red");
            Q()
        },
        drawStaticBox: function(a, b, c, f, d) {
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + (a || 0), this.y + this.box.y + (b || 0)), z(this.w + this.box.w + (2 * c || 0), this.h + this.box.h + (2 * f || 0)), !1, d || "yellow", 2);
            uc(e(this.x + this.w / 2 + this.center.x, this.y + this.h / 2 + this.center.y), 10, d || "yellow")
        },
        drawStaticBoxA: function(a, b, c, f, d) {
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + (a || 0), this.y + this.box.y + 1 + (b || 0)), z(this.w + this.box.w - 1 + (c || 0), this.h + this.box.h - 2 + (f || 0)), !1, d || "orange", 2)
        },
        drawStaticBoxD: function(a, b, c, f, d) {
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + 1 + (a ||
                0), this.y + this.box.y + 1 + (b || 0)), z(this.w + this.box.w - 1 + (c || 0), this.h + this.box.h - 2 + (f || 0)), !1, d || "red", 2)
        },
        drawStaticBoxW: function(a, b, c, f, d) {
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + 1 + (a || 0), this.y + this.box.y + (b || 0)), z(this.w + this.box.w - 2 + (c || 0), this.h + this.box.h - 1 + (f || 0)), !1, d || "blue", 2)
        },
        drawStaticBoxS: function(a, b, c, f, d) {
            h.shadowColor = "transparent";
            ba(e(this.x + this.box.x + 1 + (a || 0), this.y + this.box.y + 1 + (b || 0)), z(this.w + this.box.w - 2 + (c || 0), this.h + this.box.h - 1 + (f || 0)), !1, d || "#329F93", 2)
        },
        isStaticIntersect: function(a) {
            return this.y +
                this.box.y + this.h + this.box.h >= a.y && this.x + this.box.x + this.w + this.box.w >= a.x && this.x + this.box.x < a.x + a.w && this.y + this.box.y < a.y + a.h
        },
        getStaticBoxPosition: function() {
            return {
                x: this.x + this.box.x,
                y: this.y + this.box.y,
                w: this.x + this.box.x + this.w + this.box.w,
                h: this.y + this.box.y + this.h + this.box.h
            }
        },
        getStaticBox: function(a, b, c, f) {
            return {
                x: this.x + this.box.x + (a || 0),
                y: this.y + this.box.y + (b || 0),
                w: this.w + this.box.w + (2 * c || 0),
                h: this.h + this.box.h + (2 * f || 0)
            }
        },
        getStaticBoxA: function(a, b, c, f) {
            return {
                x: this.x + this.box.x + (a ||
                    0),
                y: this.y + this.box.y + 1 + (b || 0),
                w: this.w + this.box.w - 1 + (c || 0),
                h: this.h + this.box.h - 2 + (f || 0)
            }
        },
        getStaticBoxD: function(a, b, c, f) {
            return {
                x: this.x + this.box.x + 1 + (a || 0),
                y: this.y + this.box.y + 1 + (b || 0),
                w: this.w + this.box.w - 1 + (c || 0),
                h: this.h + this.box.h - 2 + (f || 0)
            }
        },
        getStaticBoxW: function(a, b, c, f) {
            return {
                x: this.x + this.box.x + 1 + (a || 0),
                y: this.y + this.box.y + (b || 0),
                w: this.w + this.box.w - 2 + (c || 0),
                h: this.h + this.box.h - 1 + (f || 0)
            }
        },
        getStaticBoxS: function(a, b, c, f) {
            return {
                x: this.x + this.box.x + 1 + (a || 0),
                y: this.y + this.box.y + 1 + (b || 0),
                w: this.w + this.box.w - 1 + (c || 0),
                h: this.h + this.box.h - 2 + (f || 0)
            }
        },
        setAlpha: function(a) {
            this.alpha !== a && (this.alpha = 0 <= a ? 1 >= a ? a : 1 : 0)
        },
        transparent: function(a) {
            this.setAlpha(this.alpha + a)
        },
        getAlpha: function() {
            return this.alpha
        },
        rotate: function(a) {
            this.setAngle(Math.atan2(a.y - this.getPosition(1).y, a.x - this.getPosition(1).x) * (180 / Math.PI))
        },
        setCenter: function(a) {
            this.center = e(a.x, a.y)
        },
        nullCenter: function(a) {
            a || (a = e(0, 0));
            this.center = e(-this.w / 2 + a.x, -this.h / 2 + a.y)
        },
        getCenter: function() {
            return e(this.center.x,
                this.center.y)
        },
        getBox: function() {
            return this.box
        },
        move: function(a) {
            this.x += a.x;
            this.y += a.y
        },
        circling: function(a, b, c) {
            w(this.circlingAnglePointJS) || (this.circlingAnglePointJS = 0);
            this.x = a.x + b * Math.cos(C(this.circlingAnglePointJS));
            this.y = a.y + b * Math.sin(C(this.circlingAnglePointJS));
            this.circlingAnglePointJS = 360 < this.circlingAnglePointJS ? 0 : this.circlingAnglePointJS + c
        },
        circlingC: function(a, b, c) {
            w(this.circlingAnglePointJS) || (this.circlingAnglePointJS = 0);
            this.setPositionC(e(a.x + b * Math.cos(C(this.circlingAnglePointJS)),
                a.y + b * Math.sin(C(this.circlingAnglePointJS))));
            this.circlingAnglePointJS = 360 < this.circlingAnglePointJS ? 0 : this.circlingAnglePointJS + c
        },
        motion: function(a, b, c) {
            w(this.motionPercentPointJS) || (this.motionPercentPointJS = 0);
            this.x = a.x + b.w * Math.cos(C(this.motionPercentPointJS));
            this.y = a.y + b.h * Math.sin(C(this.motionPercentPointJS));
            this.motionPercentPointJS = 360 < this.motionPercentPointJS ? 0 : this.motionPercentPointJS + c
        },
        motionC: function(a, b, c) {
            w(this.motionPercentPointJS) || (this.motionPercentPointJS = 0);
            this.setPositionC(e(a.x +
                b.w * Math.cos(C(this.motionPercentPointJS)), a.y + b.h * Math.sin(C(this.motionPercentPointJS))));
            this.motionPercentPointJS = 360 < this.motionPercentPointJS ? 0 : this.motionPercentPointJS + c
        },
        scale: function(a) {
            this.w *= a;
            this.h *= a
        },
        scaleC: function(a) {
            var b = this.w,
                c = this.h;
            this.scale(a);
            this.move(e(-((this.w - b) / 2), -((this.h - c) / 2)))
        },
        getPosition: function(a) {
            return 1 === a ? e(this.x + (this.w / 2 + this.center.x), this.y + (this.h / 2 + this.center.y)) : 2 === a ? (a = e(this.x + this.w / 2, this.y + this.h / 2), this.angle && (a = J(a, this.getPosition(1),
                this.angle)), e(a.x, a.y)) : e(this.x, this.y)
        },
        getPositionC: function() {
            return e(this.x + (this.w / 2 + this.center.x), this.y + (this.h / 2 + this.center.y))
        },
        getPositionS: function() {
            return e(this.x + g.x, this.y + g.x)
        },
        getPositionCS: function() {
            return e(this.x + (this.w / 2 + this.center.x) + g.x, this.y + (this.h / 2 + this.center.y) + g.y)
        },
        setPosition: function(a) {
            !1 !== a.x && (this.x = a.x);
            !1 !== a.y && (this.y = a.y)
        },
        setPositionS: function(a) {
            !1 !== a.x && (this.x = a.x + g.x);
            !1 !== a.y && (this.y = a.y + g.y)
        },
        setPositionC: function(a) {
            !1 !== a.x && (this.x = -(this.w / 2 + this.center.x) + a.x);
            !1 !== a.y && (this.y = -(this.h / 2 + this.center.y) + a.y)
        },
        setPositionCS: function(a) {
            !1 !== a.x && (this.x = -(this.w / 2 + this.center.x) + a.x + g.x);
            !1 !== a.y && (this.y = -(this.h / 2 + this.center.y) + a.y + g.y)
        },
        getSize: function() {
            return z(this.w, this.h)
        },
        setSize: function(a) {
            this.w = a.w;
            this.h = a.h
        },
        setSizeC: function(a) {
            var b = this.w,
                c = this.h;
            this.w = a.w;
            this.h = a.h;
            this.move(e(-((this.w - b) / 2), -((this.h - c) / 2)))
        },
        turn: function(a) {
            this.angle += a
        },
        rotateForAngle: function(a, b) {
            0 > this.angle && (this.angle +=
                360);
            0 > a && (a += 360);
            var c = this.angle - a;
            180 < c ? c -= 360 : -180 > c && (c += 360);
            c >= -b - .5 && c <= b + .5 ? this.angle = a : c > b + .5 ? this.angle -= b : c < -b - .5 && (this.angle += b)
        },
        rotateForPoint: function(a, b) {
            var c = Ga(this.getPositionC(), a);
            this.rotateForAngle(c, b)
        },
        rotateForObject: function(a, b) {
            var c = Ga(this.getPositionC(), a.getPositionC());
            this.rotateForAngle(c, b)
        },
        moveTo: function(a, b) {
            var c = C(Ga(this.getPosition(), a));
            this.x += b * Math.cos(c);
            this.y += b * Math.sin(c)
        },
        moveToC: function(a, b, c) {
            a = C(Ga(this.getPositionC(), a));
            this.x += b *
                Math.cos(a);
            this.y += c * Math.sin(a)
        },
        moveAngle: function(a, b) {
            b = C(w(b) ? b : this.angle);
            this.x += a * Math.cos(b);
            this.y += a * Math.sin(b)
        },
        moveTime: function(a, b) {
            b = b || 1;
            var c = this.getPosition();
            this.move(e((a.x - c.x) / b, (a.y - c.y) / b))
        },
        moveTimeC: function(a, b) {
            b = b || 1;
            var c = this.getPosition(1);
            this.move(e((a.x - c.x) / b, (a.y - c.y) / b))
        },
        getAngle: function() {
            return this.angle
        },
        setAngle: function(a) {
            this.angle !== a && (this.angle = a % 360)
        },
        getDistance: function(a) {
            return Math.sqrt(Math.pow(a.x - this.getPosition(2).x, 2) + Math.pow(a.y -
                this.getPosition(2).y, 2))
        },
        getDistanceC: function(a) {
            return Math.sqrt(Math.pow(a.x - this.getPosition(1).x, 2) + Math.pow(a.y - this.getPosition(1).y, 2))
        },
        setVisible: function(a) {
            this.visible = !0 === a
        },
        isVisible: function() {
            return this.visible
        },
        isInCamera: function() {
            return this.angle ? this.isInCameraDynamic() : this.isInCameraStatic()
        },
        isInCameraStatic: function() {
            return this.x + this.w < g.x || this.x > g.x + m || this.y + this.h < g.y || this.y > g.y + n ? !1 : !0
        },
        isInCameraDynamic: function() {
            var a = this.getDynamicBox(),
                b = [e(g.x, g.y), e(g.x +
                    m, g.y), e(g.x + m, g.y + n), e(g.x, g.y + n)],
                c, f = 0;
            var d = 0;
            for (c = a.length; d < c; d += 1) ra(a[d], b) && (f += 1);
            return 0 < f
        },
        draw: function() {}
    };
    this.game.newBaseObject = function(a) {
        return new F(a)
    };
    var tb = function(a) {
        F.call(this, a);
        this.type = "TriangleObject"
    };
    fa(F, tb);
    tb.prototype.getDynamicBox = function() {
        var a = this.getPositionC();
        return 0 === this.angle ? [e(this.x + this.w / 2, this.y), e(this.x + this.w, this.y + this.h), e(this.x, this.y + this.h)] : [J(e(this.x + this.w / 2, this.y), a, this.getAngle()), J(e(this.x + this.w, this.y + this.h), a, this.getAngle()),
            J(e(this.x, this.y + this.h), a, this.getAngle())
        ]
    };
    tb.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha) {
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), a = !0;
            Ta(this.x, this.y, [e(this.w / 2, 0), e(this.w, this.h), e(0, this.h)], this.fillColor, this.strokeWidth ? this.strokeColor : !1, this.strokeWidth);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    this.game.newTriangleObject = function(a) {
        return new tb(a)
    };
    var Mb = function(a) {
        F.call(this, a);
        this.type = "RectObject"
    };
    fa(F, Mb);
    Mb.prototype.draw =
        function() {
            this.predraw();
            if (this.visible && this.alpha) {
                var a = !1;
                if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), a = !0;
                ba(e(this.x, this.y), z(this.w, this.h), this.fillColor, this.strokeColor, this.strokeWidth);
                if (this.ondraw) this.ondraw();
                a && Q()
            }
        };
    this.game.newRectObject = function(a) {
        return new Mb(a)
    };
    var Nb = function(a) {
        F.call(this, a);
        this.type = "RoundRectObject";
        this.radius = a.radius || 1
    };
    fa(F, Nb);
    Nb.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha) {
            var a = !1;
            if (this.angle || 1 !==
                this.alpha || this.shadowColor) T(this), a = !0;
            ub(e(this.x, this.y), z(this.w, this.h), this.radius, this.fillColor, this.strokeColor, this.strokeWidth);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    this.game.newRoundRectObject = function(a) {
        return new Nb(a)
    };
    var ma = function(a) {
        F.call(this, a);
        this.radius = a.radius || 5;
        a.scale && (this.radius *= a.scale);
        this.w = 2 * this.radius;
        this.h = 2 * this.radius;
        this.type = "CircleObject";
        a.positionC && this.setPositionC(a.positionC)
    };
    fa(F, ma);
    ma.prototype.draw = function() {
        this.predraw();
        if (this.visible) {
            if (!this.alpha) return this.ondraw ?
                this.ondraw() : null;
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), a = !0;
            Ca(e(this.x, this.y), this.radius, this.fillColor, this.strokeColor, this.strokeWidth);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    ma.prototype.scale = function(a) {
        this.w *= a || 0;
        this.h *= a || 0;
        this.radius *= a
    };
    ma.prototype.scaleC = function(a) {
        var b = this.w,
            c = this.h;
        this.w *= a || 0;
        this.h *= a || 0;
        this.radius *= a;
        this.move(e(-((this.w - b) / 2), -((this.h - c) / 2)))
    };
    ma.prototype.getRadius = function() {
        return this.radius
    };
    ma.prototype.setRadius =
        function(a) {
            a && this.radius !== a && (1 > a && (a = 1, console.log("\u0412\u043d\u0438\u043c\u0430\u043d\u0438\u0435! \u0420\u0430\u0434\u0438\u0443\u0441 \u043e\u043a\u0440\u0443\u0436\u043d\u043e\u0441\u0442\u0438 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0440\u0430\u0432\u043d\u044f\u0442\u044c\u0441\u044f \u043d\u0443\u043b\u044e \u0438\u043b\u0438 \u0431\u044b\u0442\u044c \u043e\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c")), this.radius = a, this.w = 2 * a, this.h = 2 * a)
        };
    ma.prototype.setRadiusC =
        function(a, b, c) {
            if (a && this.radius !== a) {
                1 > a && (a = 1, console.log("\u0412\u043d\u0438\u043c\u0430\u043d\u0438\u0435! \u0420\u0430\u0434\u0438\u0443\u0441 \u043e\u043a\u0440\u0443\u0436\u043d\u043e\u0441\u0442\u0438 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0440\u0430\u0432\u043d\u044f\u0442\u044c\u0441\u044f \u043d\u0443\u043b\u044e \u0438\u043b\u0438 \u0431\u044b\u0442\u044c \u043e\u0442\u0440\u0438\u0446\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u043c"));
                var f = this.w,
                    d = this.h;
                this.radius = a;
                this.w =
                    2 * a;
                this.h = 2 * a;
                this.move(e(-((this.w - f + (b || 0)) / 2), -((this.h - d + (c || 0)) / 2)))
            }
        };
    this.game.newCircleObject = function(a) {
        return new ma(a)
    };
    var Ob = function(a) {
        this.file = a.file;
        this.w = a.w;
        this.h = a.h;
        this.read = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        a.read && (this.read.w = a.read.w || 0, this.read.h = a.read.h || 0, this.read.x = a.read.x || 0, this.read.y = a.read.y || 0);
        this.countX = a.countX;
        this.countY = a.countY;
        this.fullW = this.countX * this.w;
        this.fullH = this.countY * this.h;
        this.cnv = k.document.createElement("canvas");
        this.cnv.width = this.w;
        this.cnv.height =
            this.h;
        this.ctx = this.cnv.getContext("2d");
        this.loaded = !1;
        this.x = a.x || 0;
        this.y = a.y || 0;
        a = k.document.createElement("img");
        var b = this;
        a.onload = function() {
            b.ctx.drawImage(this, b.read.x ? b.read.x : 0, b.read.y ? b.read.y : 0, b.read.w ? b.read.w : this.width, b.read.h ? b.read.h : this.height, 0, 0, b.w, b.h);
            b.loaded = !0;
            B.load()
        };
        a.src = this.file;
        B.add()
    };
    Ob.prototype.draw = function() {
        if (this.loaded) {
            var a = -g.x + this.x,
                b = -g.y + this.y,
                c, f;
            for (f = 0; f < this.countY; f += 1)
                if (!(this.y + f * this.h + this.h < g.y || this.y + f * this.h > g.y + n))
                    for (c = 0; c <
                        this.countX; c += 1) this.x + c * this.w + this.w < g.x || this.x + c * this.w > g.x + m || h.drawImage(this.cnv, a + c * this.w, b + f * this.h, this.w, this.h)
        }
    };
    Ob.prototype.getSize = function() {
        return this.loaded ? z(this.fullW, this.fullH) : z()
    };
    this.game.newBackgroundObject = function(a) {
        return new Ob(a)
    };
    var Pb = function(a) {
        F.call(this, a);
        this.type = "EllipsObject"
    };
    fa(F, Pb);
    Pb.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha) {
            T(this);
            Ca(e(this.x, this.y), this.h / 2, this.fillColor, this.strokeColor, this.strokeWidth);
            if (this.ondraw) this.ondraw();
            Q()
        }
    };
    this.game.newEllipsObject = function(a) {
        return new Pb(a)
    };
    var ca = function(a) {
        F.call(this, a);
        this.type = "TextObject";
        this.text = a.text || "TextObject";
        this.color = a.color || "";
        this.size = 0 < a.size ? a.size : 10;
        a.scale && (this.size *= a.scale);
        this.font = a.font || "serif";
        this.style = a.style || "";
        this.align = "left";
        this.valign = "top";
        this.radius = a.radius || 0;
        this.padding = a.padding || 0;
        this.w = Qb(this.text, this.style, this.size, this.font) + 2 * this.padding;
        this.h = this.size + 2 * this.padding;
        this.strokeColorText = a.strokeColorText ||
            !1;
        this.strokeWidthText = a.strokeWidthText || !1;
        this.textDY = -this.size / 11;
        a.positionC && this.setPositionC(a.positionC)
    };
    fa(F, ca);
    ca.prototype.reStyle = function(a) {
        this.text = a.text || this.text;
        this.color = a.color || this.color;
        this.size = a.size || this.size;
        this.font = a.font || this.font;
        this.style = a.style || this.style;
        this.padding = a.padding || this.padding;
        this.w = Qb(this.text, this.style, this.size, this.font) + 2 * this.padding;
        this.h = this.size + 2 * this.padding;
        this.strokeColorText = a.strokeColorText || this.strokeColorText;
        this.strokeWidthText = a.strokeWidthText || this.strokeWidthText;
        this.strokeColor = a.strokeColor || this.strokeColor;
        this.strokeWidth = a.strokeWidth || this.strokeWidth;
        this.fillColor = a.fillColor || this.fillColor;
        this.textDY = -this.size / 11
    };
    ca.prototype.setText = function(a) {
        this.text !== a && this.reStyle({
            text: a
        })
    };
    ca.prototype.getText = function() {
        return this.text
    };
    ca.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha) {
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), a = !0;
            if (this.fillColor ||
                this.strokeColor) this.radius ? ub(e(this.x, this.y), z(this.w, this.h), this.radius, this.fillColor, this.strokeColor, this.strokeWidth) : ba(e(this.x, this.y), z(this.w, this.h), this.fillColor, this.strokeColor, this.strokeWidth);
            va(e(this.x + this.padding, this.textDY + this.y + this.padding), this.text, this.color, this.size, this.font, this.style, this.align, this.strokeColorText, this.strokeWidthText);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    ca.prototype.scale = function(a) {
        this.reStyle({
            size: this.size * a
        })
    };
    ca.prototype.scaleC =
        function(a) {
            var b = this.w,
                c = this.h;
            this.reStyle({
                size: this.size * a
            });
            this.move(e(-((this.w - b) / 2), -((this.h - c) / 2)))
        };
    ca.prototype.setSize = function(a) {
        this.size !== a && this.reStyle({
            size: a
        })
    };
    ca.prototype.setSizeC = function(a) {
        this.size !== a && (this.reStyle({
            size: a
        }), this.move(e(-a / 2, -a / 2)))
    };
    var Qb = function(a, b, c, f) {
        var d = k.document.createElement("canvas").getContext("2d");
        d.font = (b ? b + " " : "") + c + "px " + f;
        return d.measureText(a).width
    };
    this.OOP.getTextWidth = function(a) {
        return Qb(a.text, a.style || "", a.size || 10,
            a.font || "serif")
    };
    this.game.newTextObject = function(a) {
        return new ca(a)
    };
    var U = function(a) {
        F.call(this, a);
        this.type = "PolygonObject";
        this.points = [];
        this.pointColor = a.pointColor || !1;
        this.w = this.h = 0;
        var b = this;
        "undefined" !== typeof a.points && v(a.points, function(a) {
            b.addPoint(a)
        })
    };
    fa(F, U);
    U.prototype.addPoint = function(a) {
        this.points.push(a);
        a.x > this.w && (this.w = a.x);
        a.x > this.h && (this.h = a.x)
    };
    U.prototype.delPoint = function(a) {
        this.points.splice(a, 1)
    };
    U.prototype.clearPoints = function() {
        this.points.length =
            0
    };
    U.prototype.getPoints = function() {
        return this.points
    };
    U.prototype.getCount = function() {
        return this.points.length
    };
    U.prototype.getPoint = function(a) {
        return this.points[a]
    };
    U.prototype.isIntersect = function(a) {
        return a.visible ? this.isDynamicIntersect(a.getDynamicBox()) : !1
    };
    U.prototype.drawDynamicBox = function(a) {
        Ta(this.x, this.y, this.points, !1, "yellow", 1, "red")
    };
    U.prototype.getDynamicBox = function() {
        for (var a = [], b = this.points.length - 1; 0 <= b; b--) a.push(J(this.points[b], e(this.w / 2 + this.center.x, this.h / 2 +
            this.center.y), this.angle).plus(e(this.x, this.y)));
        return a
    };
    U.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha) {
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), a = !0;
            Ta(this.x, this.y, this.points, this.fillColor, this.strokeColor, this.strokeWidth, this.pointColor);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    this.game.newPolygonObject = function(a) {
        return new U(a)
    };
    var wa = function(a) {
        F.call(this, a);
        this.type = "ImageObject";
        this.loaded = !1;
        this.file = "";
        this.forOnLoad = a.onload ||
            !1;
        vc(a.file, this, a.scale || 1)
    };
    fa(F, wa);
    wa.prototype.draw = function() {
        this.predraw();
        if (this.visible && this.alpha && this.loaded) {
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor || this.flip.x || this.flip.y) T(this), a = !0;
            wc(e(this.x, this.y), z(this.w, this.h), this.file);
            if (this.ondraw) this.ondraw();
            a && Q()
        }
    };
    wa.prototype.simpleDraw = function(a) {
        this.predraw();
        if (this.loaded) {
            var b = !1;
            if (this.angle || 1 !== this.alpha || this.shadowColor) T(this), b = !0;
            wc(e(a.x, a.y), z(this.w, this.h), this.file);
            b && Q()
        }
    };
    wa.prototype.setImage =
        function(a, b) {
            this.file !== a && (w(p[a]) ? (this.file = a, b && b()) : (this.loaded = !1, this.origHeight = this.origWidth = 0, this.forOnLoad = b || !1, vc(a, this)))
        };
    wa.prototype.getImage = function() {
        return this.file
    };
    wa.prototype.resize = function(a) {
        if (!1 !== a.w && !1 === a.h) {
            var b = a.w / this.w;
            this.w = a.w;
            this.h *= b
        } else !1 !== a.h && !1 === a.w ? (b = a.h / this.h, this.h = a.h, this.w *= b) : !1 !== a.w && !1 !== a.h && (this.w = a.w, this.h = a.h)
    };
    this.game.newImageObject = function(a) {
        return new wa(a)
    };
    var R = function(a) {
        F.call(this, a);
        this.type = "AnimationObject";
        this.frame = 0;
        this.anim = a.animation;
        this.step = a.delay || 10;
        this.toFrameStep = this.difStep = 0;
        a.scale && (this.w *= a.scale, this.h *= a.scale)
    };
    fa(F, R);
    R.prototype.draw = function() {
        if (this.visible && this.alpha) {
            var a = !1;
            if (this.angle || 1 !== this.alpha || this.flip.x || this.flip.y || this.shadowColor) T(this), a = !0;
            Rb(this.anim, e(this.x, this.y), z(this.w, this.h), this.frame);
            if (this.ondraw) this.ondraw();
            this.difStep > this.step ? (this.frame = this.frame < this.anim.r ? this.frame + 1 : 0, this.difStep = 0) : this.difStep += 1;
            a && Q()
        }
    };
    R.prototype.drawFrames =
        function(a, b, c) {
            if (this.visible && this.alpha) {
                if (this.frame < a || this.frame > b) this.frame = a;
                c = !1;
                if (this.angle || 1 !== this.alpha || this.flip.x || this.flip.y || this.shadowColor) T(this), c = !0;
                Rb(this.anim, e(this.x, this.y), z(this.w, this.h), this.frame);
                if (this.ondraw) this.ondraw();
                this.difStep > this.step ? (this.frame = this.frame < b ? this.frame + 1 : a, this.difStep = 0) : this.difStep += 1;
                c && Q()
            }
        };
    R.prototype.drawFrame = function(a) {
        if (this.visible && this.alpha) {
            var b = !1;
            if (this.angle || 1 !== this.alpha || this.flip.x || this.flip.y ||
                this.shadowColor) T(this), b = !0;
            Rb(this.anim, e(this.x, this.y), z(this.w, this.h), a);
            if (this.ondraw) this.ondraw();
            b && Q()
        }
    };
    R.prototype.drawToFrame = function(a) {
        if (this.visible && this.alpha) {
            if (this.frame < a) this.toFrameStep = 1;
            else if (this.frame > a) this.toFrameStep = -1;
            else {
                this.drawFrame(a);
                return
            }
            this.drawFrame(this.frame);
            if (this.ondraw) this.ondraw();
            this.difStep > this.step ? (this.frame = this.frame < this.anim.r ? this.frame + this.toFrameStep : 0, this.difStep = 0) : this.difStep += 1
        }
    };
    R.prototype.drawReverFrames = function(a,
        b) {
        if (this.visible && this.alpha) {
            this.drawFrame(this.frame);
            if (this.ondraw) this.ondraw();
            this.difStep > this.step ? (this.frame <= a ? this.toFrameStep = 1 : this.frame >= b && (this.toFrameStep = -1), this.frame += this.toFrameStep, this.difStep = 0) : this.difStep += 1
        }
    };
    R.prototype.setAnimation = function(a) {
        a !== this.anim && (this.frame = 0, this.anim = a)
    };
    R.prototype.getAnimation = function() {
        return this.anim
    };
    R.prototype.setDelay = function(a) {
        this.step = 0 < a ? a : this.step
    };
    R.prototype.getDelay = function() {
        return this.step
    };
    R.prototype.getFrame =
        function() {
            return this.frame
        };
    R.prototype.setFrame = function(a) {
        this.frame = a
    };
    R.prototype.getLastFrame = function() {
        return this.anim.endFrame
    };
    this.game.newAnimationObject = function(a) {
        return new R(a)
    };
    var nc = function(a) {
            var b = !1;
            "RectObject" === a.type ? b = A.game.newRectObject({}) : "CircleObject" === a.type ? b = A.game.newCircleObject({}) : "RoundRectObject" === a.type ? b = A.game.newRoundRectObject({}) : "TextObject" === a.type ? b = A.game.newTextObject({}) : "EllipsObject" === a.type ? b = A.game.newEllipsObject({}) : "ImageObject" ===
                a.type ? b = A.game.newImageObject({
                    file: a.file
                }) : "TriangleObject" === a.type ? b = A.game.newTriangleObject({}) : "PolygonObject" === a.type ? b = A.game.newTriangleObject({
                    points: a.points
                }) : "AnimationObject" === a.type && (b = A.game.newAnimationObject({
                    animation: a.anim
                }));
            return b
        },
        Sb = {},
        Pc = 0,
        xa = function(a, b) {
            this.file = a;
            this.loaded = !1;
            this.h = this.w = 0;
            this.id = Pc++;
            this.toLoad = [];
            var c = k.document.createElement("img"),
                f = this;
            Sb[a] = f;
            c.onload = function() {
                f.loaded = !0;
                f.w = this.width;
                f.h = this.height;
                f.img = k.document.createElement("canvas");
                f.img.width = this.width;
                f.img.height = this.height;
                f.context = f.img.getContext("2d");
                f.context.drawImage(this, 0, 0);
                f.toLoad.length && v(f.toLoad, function(a) {
                    a.func(f.context, a.w, a.h, a.r)
                });
                b && (f.onLoad = b, f.onLoad());
                B.load()
            };
            c.src = a;
            B.add()
        };
    xa.prototype.onContext = function(a) {
        this.loaded ? a(this.context, this.w, this.h, 1) : this.toLoad.push({
            w: this.w,
            h: this.h,
            r: 1,
            func: a
        })
    };
    xa.prototype.getCanvas = function() {
        return this.img
    };
    var Qc = 0;
    xa.prototype.getAnimation = function(a, b, c, f, d) {
        var e = function(a, b, c, f, d, e) {
            this.id =
                Qc++;
            this.image = a;
            this.x = b;
            this.y = c;
            this.w = f;
            this.h = d;
            this.endFrame = this.r = e ? e - 1 : 0;
            this.frameCount = this.r + 1
        };
        e.prototype = {
            onContext: function(a) {
                this.image.loaded ? a(this.image.context, this.w, this.h, this.r) : this.image.toLoad.push({
                    w: this.w,
                    h: this.h,
                    r: this.r,
                    func: a
                })
            },
            getImage: function() {
                return this.image
            },
            getCount: function() {
                return this.r
            }
        };
        return new e(this, a, b, c, f, d)
    };
    var Tb = function(a, b) {
        this.loaded = !0;
        this.w = a;
        this.h = b;
        this.img = k.document.createElement("canvas");
        this.img.width = a;
        this.img.height =
            b;
        this.context = this.img.getContext("2d")
    };
    Tb.prototype.onContext = xa.prototype.onContext;
    Tb.prototype.getAnimation = xa.prototype.getAnimation;
    this.tiles.newDrawImage = function(a, b) {
        return new Tb(a, b)
    };
    this.tiles.newImage = function(a, b) {
        return Sb[a] ? Sb[a] : new xa(a, b)
    };
    this.tiles.newAnimation = function(a, b, c, f) {
        return (new xa(a)).getAnimation(0, 0, b, c, f)
    };
    var Rb = function(a, b, c, f) {
            if (a && a.image.loaded) {
                var d = -g.x,
                    e = -g.y;
                a.image.img && h.drawImage(a.image.img, a.x + a.w * f, a.y, a.w, a.h, b.x + d, b.y + e, c.w, c.h)
            }
        },
        p = {},
        vc = function(a, b, c) {
            if (w(p[a])) {
                b.loaded = !0;
                b.file = a;
                if (b.w && !b.h) {
                    var f = b.w / p[a].w;
                    var d = b.w;
                    var e = p[a].h * f
                } else !b.w && b.h ? (f = b.h / p[a].h, e = b.h, d = p[a].w * f) : b.w && b.h ? (d = b.w, e = b.h) : (d = p[a].w, e = p[a].h);
                c && (d *= c, e *= c);
                b.w = d;
                b.h = e;
                b.forOnLoad && b.forOnLoad()
            } else d = k.document.createElement("img"), d.onload = function() {
                p[a] = {};
                p[a].loaded = !0;
                p[a].img = this;
                p[a].w = this.width;
                p[a].h = this.height;
                if (w(b)) {
                    b.loaded = !0;
                    if (b.w && !b.h) {
                        var f = b.w / p[a].w;
                        var d = b.w;
                        var e = p[a].h * f
                    } else !b.w && b.h ? (f = b.h / p[a].h, e = b.h, d = p[a].w *
                        f) : b.w && b.h ? (d = b.w, e = b.h) : (d = p[a].w, e = p[a].h);
                    c && (d *= c, e *= c);
                    b.w = d;
                    b.h = e;
                    b.file = a;
                    b.forOnLoad && b.forOnLoad()
                }
                B.load()
            }, d.src = a, B.add()
        },
        wc = function(a, b, c) {
            if (c) {
                var d = -g.x,
                    e = -g.y;
                p[c] && h.drawImage(p[c].img, 0, 0, p[c].w, p[c].h, a.x + d, a.y + e, b.w, b.h)
            }
        },
        xc = function(a) {
            this.type = "Mesh";
            this.objs = [];
            this.x = a.x || 0;
            this.y = a.y || 0;
            this.angle = a.angle || 0;
            this.count = 0;
            var b = this;
            a.add && v(a.add, function(a) {
                b.add(a)
            });
            this.angle && this.setAngle(this.angle)
        };
    xc.prototype = {
        getCount: function() {
            return this.count
        },
        getObjects: function() {
            return this.objs
        },
        add: function(a) {
            this.count += 1;
            this.objs.push(a);
            a.offsetMesh = a.getPosition(1);
            a.turn(this.angle);
            a.setPositionC(e(this.x + a.offsetMesh.x, this.y + a.offsetMesh.y))
        },
        del: function(a) {
            var b = this;
            v(this.objs, function(c) {
                c.id == a.id && (b.objs.splice(void 0, 1), b.count--)
            })
        },
        draw: function(a) {
            v(this.objs, function(a) {
                a.draw()
            })
        },
        move: function(a) {
            this.x += a.x || 0;
            this.y += a.y || 0;
            var b = this;
            v(this.objs, function(a) {
                a.setPositionC(e(b.x + a.offsetMesh.x, b.y + a.offsetMesh.y))
            })
        },
        turn: function(a) {
            if (0 != a) {
                this.angle %= 360;
                this.angle +=
                    a;
                var b = e(this.x, this.y),
                    c = this;
                v(this.objs, function(d) {
                    d.turn(a);
                    d.setPositionC(J(e(c.x + d.offsetMesh.x, c.y + d.offsetMesh.y), b, c.angle))
                })
            }
        },
        setAngle: function(a) {
            if (a != this.angle) {
                this.angle = a %= 360;
                var b = e(this.x, this.y),
                    c = this;
                v(this.objs, function(d) {
                    d.setAngle(a);
                    d.setPositionC(J(e(c.x + d.offsetMesh.x, c.y + d.offsetMesh.y), b, c.angle))
                })
            }
        },
        setPosition: function(a) {
            if (this.x != a.x || this.y != a.y) {
                this.x = a.x || this.x;
                this.y = a.y || this.y;
                var b = this;
                v(this.objs, function(a) {
                    b.angle ? a.setPositionC(J(e(b.x + a.offsetMesh.x,
                        b.y + a.offsetMesh.y), e(b.x, b.y), b.angle)) : a.setPositionC(e(b.x + a.offsetMesh.x, b.y + a.offsetMesh.y))
                })
            }
        },
        isDynamicIntersect: function(a) {
            if (3 > a.length) return !1;
            var b = !1;
            v(this.objs, function(c) {
                if (c.isDynamicIntersect(a)) return b = c
            });
            return b
        },
        isStaticIntersect: function(a) {
            var b = !1;
            v(this.objs, function(c) {
                if (c.isStaticIntersect(a)) return b = c
            });
            return b
        },
        isIntersect: function(a) {
            var b = !1;
            v(this.objs, function(c) {
                if (c.isIntersect(a)) return b = c
            });
            return b
        }
    };
    this.game.newMesh = function(a) {
        return new xc(a)
    };
    this.camera.shake =
        function(a, b) {
            g.x = a.x + S(-1, 1, !0) * b.w;
            g.y = a.y + S(-1, 1, !0) * b.h
        };
    this.camera.shakeC = function(a, b) {
        g.x = -H + a.x + S(-1, 1, !0) * b.w;
        g.y = -I + a.y + S(-1, 1, !0) * b.h
    };
    this.camera.scale = function(a) {
        pa *= a.x;
        qa *= a.y;
        m /= a.x;
        n /= a.y;
        H = m / 2;
        I = n / 2;
        h.scale(a.x, a.y);
        h.save();
        Na && (x.x /= a.x, x.y /= a.y)
    };
    this.camera.scaleC = function(a) {
        var b = m,
            c = n;
        pa *= a.x;
        qa *= a.y;
        m /= a.x;
        n /= a.y;
        H = m / 2;
        I = n / 2;
        h.scale(a.x, a.y);
        h.save();
        g.x += (b - m) / 2;
        g.y += (c - n) / 2;
        Na && (x.x /= a.x, x.y /= a.y)
    };
    this.camera.circling = function(a, b, c) {
        w(this.circlingAnglePointJS) || (this.circlingAnglePointJS =
            c);
        g.x = a.x + b * Math.cos(C(this.circlingAnglePointJS));
        g.y = a.y + b * Math.sin(C(this.circlingAnglePointJS));
        this.circlingAnglePointJS = 360 <= this.circlingAnglePointJS ? c : this.circlingAnglePointJS + c
    };
    this.camera.circlingC = function(a, b, c) {
        w(this.circlingAnglePointJS) || (this.circlingAnglePointJS = c);
        g.x = -H + a.x + b * Math.cos(C(this.circlingAnglePointJS));
        g.y = -I + a.y + b * Math.sin(C(this.circlingAnglePointJS));
        this.circlingAnglePointJS = 360 <= this.circlingAnglePointJS ? c : this.circlingAnglePointJS + c
    };
    this.camera.motion = function(a,
        b, c) {
        w(this.motionPercentPointJS) || (this.motionPercentPointJS = b);
        g.x = a.x + b.w * Math.cos(C(this.motionPercentPointJS));
        g.y = a.y + b.h * Math.sin(C(this.motionPercentPointJS));
        this.motionPercentPointJS = 360 <= this.motionPercentPointJS ? b : this.motionPercentPointJS + c
    };
    this.camera.motionC = function(a, b, c) {
        w(this.motionPercentPointJS) || (this.motionPercentPointJS = b);
        this.setPositionC(e(a.x + b.w * Math.cos(C(this.motionPercentPointJS)), a.y + b.h * Math.sin(C(this.motionPercentPointJS))));
        this.motionPercentPointJS = 360 <= this.motionPercentPointJS ?
            b : this.motionPercentPointJS + c
    };
    this.camera.follow = function(a, b) {
        this.moveTimeC(a.getPositionC(), b || 10)
    };
    this.camera.move = function(a) {
        g.x += a.x || 0;
        g.y += a.y || 0
    };
    this.camera.moveTime = function(a, b) {
        b = b || 1;
        var c = e(g.x, g.y);
        this.move(e(pa * (a.x - c.x) / b, qa * (a.y - c.y) / b))
    };
    this.camera.moveTimeC = function(a, b) {
        b = b || 1;
        var c = e(g.x + H, g.y + I);
        this.move(e(pa * (a.x - c.x) / b, qa * (a.y - c.y) / b))
    };
    this.camera.setPosition = function(a) {
        Kb(e(!1 !== a.x ? a.x : g.x, !1 !== a.y ? a.y : g.y))
    };
    this.camera.setPositionC = function(a) {
        Kb(e(!1 !== a.x ? a.x -
            H : g.x, !1 !== a.y ? a.y - I : g.y))
    };
    this.camera.getPosition = function(a) {
        return a ? e(g.x + H, g.y + I) : e(g.x, g.y)
    };
    this.camera.getPositionC = function() {
        return e(g.x + H, g.y + I)
    };
    this.camera.getStaticBox = function() {
        return {
            x: g.x,
            y: g.y,
            w: m,
            h: n
        }
    };
    this.camera.getDynamicBox = function() {
        return [e(g.x, g.y), e(g.x + m, g.y), e(g.x + m, g.y + n), e(g.x, g.y + n)]
    };
    var Kb = function(a) {
            g = e(a.x, a.y)
        },
        Q = function(a) {
            h.restore();
            h.globalAlpha = t.globalAlpha;
            h.fillStyle = "black";
            h.strokeStyle = "black";
            h.msImageSmoothingEnabled = Fa;
            h.imageSmoothingEnabled =
                Fa
        },
        T = function(a, b) {
            h.save();
            var c = a.getPositionC();
            a.angle && (h.translate(-g.x + c.x, -g.y + c.y), h.rotate(C(a.angle)), h.translate(-c.x + g.x, -c.y + g.y));
            1 !== a.alpha && (h.globalAlpha = a.alpha);
            if (a.flip.x || a.flip.y) h.translate(-g.x + c.x, -g.y + c.y), h.scale(a.flip.x ? -1 : 1, a.flip.y ? -1 : 1), h.translate(-c.x + g.x, -c.y + g.y);
            a.shadowColor && (h.shadowBlur = a.shadowBlur, h.shadowColor = a.shadowColor, h.shadowOffsetX = a.shadowX, h.shadowOffsetY = a.shadowY);
            if ("EllipsObject" === a.type && !b) {
                c = a.w / 2;
                var d = a.h / 2,
                    u = e(-g.x + a.x, -g.y + a.y);
                h.translate(u.x, u.y);
                h.scale(c / d, 1);
                h.translate(-u.x, -u.y)
            }
        };
    this.system.setContextSettings = function(a) {
        h.save();
        for (var b in a) h[b] = a[b]
    };
    this.system.defaultSettings = function() {
        Q()
    };
    this.game.clear = function() {
        h.clearRect(0, 0, m, n)
    };
    this.game.fill = function(a) {
        h.fillStyle = a;
        h.fillRect(0, 0, m, n)
    };
    var Ta = function(a, b, c, d, u, k, l) {
            if (!(3 > c.length)) {
                if (d && !(3 > c.length)) {
                    h.fillStyle = d;
                    d = -g.x + a;
                    var f = -g.y + b;
                    var E;
                    h.beginPath();
                    h.moveTo(d + c[0].x, f + c[0].y);
                    for (E = 1; E < c.length; E += 1) h.lineTo(d + c[E].x, f + c[E].y);
                    h.closePath();
                    h.fill()
                }
                for (d = 0; d < c.length; d += 1) f = d + 1 < c.length ? d + 1 : 0, u && da(Xa(c[d], e(a, b)), Xa(c[f], e(a, b)), u, k), l && vb(Xa(c[d], e(a, b)), l)
            }
        },
        V = function(a) {
            a.x || (a.x = 0);
            a.y || (a.y = 0);
            a.w || (a.w = 0);
            a.h || (a.h = 0)
        };
    this.brush.drawPolygon = function(a) {
        var b = a.points || [],
            c = a.fillColor || !1,
            d = a.strokeColor || !1,
            e = a.strokeWidth || 1;
        a = a.pointColor || !1;
        if (!(3 > b.length)) {
            if (c && !(3 > b.length)) {
                h.fillStyle = c;
                c = -g.x;
                var k = -g.y;
                var l;
                h.beginPath();
                h.moveTo(c + b[0].x, k + b[0].y);
                for (l = 1; l < b.length; l += 1) h.lineTo(c + b[l].x, k + b[l].y);
                h.closePath();
                h.fill()
            }
            for (c = 0; c < b.length; c += 1) k = c + 1 < b.length ? c + 1 : 0, d && da(b[c], b[k], d, e), a && vb(b[c], a)
        }
    };
    this.brush.drawTriangle = function(a) {
        V(a);
        if (a.x + a.w < g.x || a.x > g.x + m || a.y + a.h < g.y || a.y > g.y + n) return !1;
        Ta(a.x, a.y, [e(a.w / 2, 0), e(a.w, a.h), e(0, a.h)], a.fillColor, a.strokeColor, a.strokeWidth)
    };
    this.brush.drawTriangleS = function(a) {
        V(a);
        if (0 > a.x + a.w || a.x > m || 0 > a.y + a.h || a.y > n) return !1;
        Ta(g.x + a.x, g.y + a.y, [e(a.w / 2, 0), e(a.w, a.h), e(0, a.h)], a.fillColor, a.strokeColor, a.strokeWidth)
    };
    var va = function(a, b, c, d, e, k, l, m, n) {
        h.textAlign =
            l;
        h.lineWidth = n;
        h.font = (k ? k + " " : "") + d + "px " + e;
        d = -g.x;
        e = -g.y;
        c && (h.fillStyle = c, h.fillText(b, d + a.x, e + a.y));
        m && (h.strokeStyle = m, h.strokeText(b, d + a.x, e + a.y))
    };
    this.brush.drawMultiText = function(a) {
        var b, c = a.text.split("\n");
        for (b = 0; b < c.length; b += 1) va(e(a.x, a.y + a.size * b), c[b], a.color || t.fillStyle, a.size || 10, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
    };
    this.brush.drawMultiTextS = function(a) {
        var b, c = a.text.split("\n"),
            d = a.size || 10;
        for (b = 0; b < c.length; b += 1) va(e(a.x + g.x, a.y +
            g.y + d * b), c[b], a.color || t.fillStyle, d || 10, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
    };
    this.brush.drawText = function(a) {
        va(e(a.x || 0, a.y || 0), a.text, a.color || !1, a.size || 10, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
    };
    this.brush.drawTextS = function(a) {
        va(e((a.x || 0) + g.x, (a.y || 0) + g.y), a.text, a.color || t.fillStyle, a.size || 10, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
    };
    this.brush.drawTextLines = function(a) {
        if (a.lines) {
            var b,
                c = a.size || 10;
            for (b = 0; b < a.lines.length; b += 1) va(e(a.x || 0, (a.y || 0) + c * b), a.lines[b], a.color || t.fillStyle, c, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
        }
    };
    this.brush.drawTextLinesS = function(a) {
        if (a.lines) {
            var b, c = a.size || 10;
            for (b = 0; b < a.lines.length; b += 1) va(e((a.x || 0) + g.x, (a.y || 0) + g.y + c * b), a.lines[b], a.color || t.fillStyle, c, a.font || t.font, a.style || !1, a.align || "left", a.strokeColor || !1, a.strokeWidth || 2)
        }
    };
    var uc = function(a, b, c) {
            da(e(a.x - b, a.y), e(a.x + b, a.y), c, 2);
            da(e(a.x, a.y -
                b), e(a.x, a.y + b), c, 2)
        },
        ba = function(a, b, c, d, e) {
            h.fillStyle = c;
            h.strokeStyle = d;
            d = -g.x;
            var f = -g.y;
            c && h.fillRect(a.x + d, a.y + f, b.w, b.h);
            e && (h.lineWidth = e, c = e / 2, h.strokeRect(a.x + d + c, a.y + f + c, b.w - e, b.h - e))
        };
    this.brush.drawRect = function(a) {
        V(a);
        if (a.x + a.w < g.x || a.x > g.x + m || a.y + a.h < g.y || a.y > g.y + n) return !1;
        ba(e(a.x, a.y), z(a.w, a.h), a.fillColor || !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
    };
    this.brush.drawRectS = function(a) {
        V(a);
        if (0 > a.x + a.w || a.x > m || 0 > a.y + a.h || a.y > n) return !1;
        ba(e(a.x + g.x, a.y + g.y), z(a.w, a.h), a.fillColor ||
            !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
    };
    var vb = function(a, b) {
        (h.fillStyle = b) && h.fillRect(-g.x + a.x - 1, -g.y + a.y - 1, 2, 2)
    };
    this.brush.drawPoint = function(a) {
        V(a);
        if (a.x < g.x || a.x > g.x + m || a.y < g.y || a.y > g.y + n) return !1;
        vb(e(a.x, a.y), a.fillColor || !1)
    };
    this.brush.drawPointS = function(a) {
        V(a);
        if (0 > a.x || a.x > m || 0 > a.y || a.y > n) return !1;
        vb(e(a.x + g.x, a.y + g.y), a.fillColor || !1)
    };
    var ub = function(a, b, c, d, e, k) {
        h.fillStyle = d;
        h.strokeStyle = e;
        h.lineWidth = k;
        e = -g.x + a.x + k / 2;
        a = -g.y + a.y + k / 2;
        b.w -= +k;
        b.h -= +k;
        h.beginPath();
        h.moveTo(e + c, a);
        h.lineTo(e + b.w - c, a);
        h.quadraticCurveTo(e + b.w, a, e + b.w, a + c);
        h.lineTo(e + b.w, a + b.h - c);
        h.quadraticCurveTo(e + b.w, a + b.h, e + b.w - c, a + b.h);
        h.lineTo(e + c, a + b.h);
        h.quadraticCurveTo(e, a + b.h, e, a + b.h - c);
        h.lineTo(e, a + c);
        h.quadraticCurveTo(e, a, e + c, a);
        h.closePath();
        d && h.fill();
        k && h.stroke()
    };
    this.brush.drawRoundRect = function(a) {
        V(a);
        if (a.x + a.w < g.x || a.x > g.x + m || a.y + a.h < g.y || a.y > g.y + n) return !1;
        ub(e(a.x, a.y), z(a.w, a.h), a.radius || 2, a.fillColor || !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
    };
    this.brush.drawRoundRectS =
        function(a) {
            V(a);
            if (0 > a.x + a.w || a.x > m || 0 > a.y + a.h || a.y > n) return !1;
            ub(e(g.x + a.x, g.y + a.y), z(a.w, a.h), a.radius || 2, a.fillColor || !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
        };
    var Ca = function(a, b, c, d, e) {
        h.fillStyle = c;
        h.strokeStyle = d;
        h.lineWidth = e;
        d = -g.x + b + (e ? e / 2 : 0);
        var f = -g.y + b + (e ? e / 2 : 0);
        h.beginPath();
        h.arc(a.x + d, a.y + f, b, 0, 2 * Math.PI, !0);
        h.closePath();
        c && h.fill();
        e && h.stroke()
    };
    this.brush.drawCircle = function(a) {
        V(a);
        var b = 2 * a.radius;
        if (a.x + b < g.x || a.x > g.x + m || a.y + b < g.y || a.y > g.y + n) return !1;
        Ca(e(a.x, a.y),
            a.radius, a.fillColor || !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
    };
    this.brush.drawCircleS = function(a) {
        V(a);
        var b = 2 * a.radius;
        if (0 > a.x + b || a.x > m || 0 > a.y + b || a.y > n) return !1;
        Ca(e(a.x + g.x, a.y + g.y), a.radius, a.fillColor || !1, a.strokeColor || t.strokeStyle, a.strokeWidth || !1)
    };
    var da = function(a, b, c, d) {
        h.strokeStyle = c;
        h.lineWidth = d;
        c = -g.x;
        d = -g.y;
        h.beginPath();
        h.moveTo(c + a.x, d + a.y);
        h.lineTo(c + b.x, d + b.y);
        h.closePath();
        h.stroke()
    };
    this.brush.drawLineAngle = function(a) {
        var b = J(e(a.x + a.length, a.y), e(a.x, a.y), a.angle);
        da(e(a.x, a.y), e(b.x, b.y), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawLineAngleS = function(a) {
        var b = J(e(g.x + a.x + a.length, g.y + a.y), e(g.x + a.x, g.y + a.y), a.angle);
        da(e(g.x + a.x, g.y + a.y), e(b.x, b.y), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawLine = function(a) {
        da(e(a.x1, a.y1), e(a.x1 + a.x2, a.y1 + a.y2), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawLineS = function(a) {
        da(e(g.x + a.x1, g.y + a.y1), e(g.x + a.x2, g.y + a.y2), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawLineA = function(a) {
        da(e(a.x1, a.y1), e(a.x2, a.y2), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawLineAS = function(a) {
        da(e(a.x1 + g.x, a.y1 + g.y), e(a.x2 + g.x, a.y2 + g.y), a.strokeColor || t.strokeStyle, a.strokeWidth || 1)
    };
    this.brush.drawEllips = function(a) {
        V(a);
        if (a.x + a.w < g.x || a.x > g.x + m || a.y + a.h < g.y || a.y > g.y + n) return !1;
        var b = a.w / 2,
            c = a.h / 2,
            d = e(-g.x + a.x, -g.y + a.y);
        h.save();
        h.translate(d.x, d.y);
        h.scale(b / c, 1);
        h.translate(-d.x, -d.y);
        Ca(e(a.x, a.y), c, a.fillColor, a.strokeColor, a.strokeWidth);
        h.restore()
    };
    this.brush.drawEllipsS = function(a) {
        V(a);
        if (0 > a.x + a.w || a.x > m || 0 > a.y + a.h || a.y > n) return !1;
        var b = a.w / 2,
            c = a.h / 2,
            d = e(a.x, a.y);
        h.save();
        h.translate(d.x, d.y);
        h.scale(b / c, 1);
        h.translate(-d.x, -d.y);
        Ca(e(g.x + a.x, g.y + a.y), c, a.fillColor, a.strokeColor, a.strokeWidth);
        h.restore()
    };
    this.brush.drawImageS = function(a) {
        if (a.file)
            if (w(p[a.file])) {
                if (p[a.file].loaded) {
                    var b = a.x || 0,
                        c = a.y || 0;
                    if (a.w && !a.h) {
                        var d = a.w / p[a.file].w;
                        var e = a.w;
                        var g = p[a.file].h * d
                    } else !a.w && a.h ? (d = a.h / p[a.file].h, g = a.h, e = p[a.file].w *
                        d) : a.w && a.h ? (e = a.w, g = a.h) : (e = p[a.file].w, g = p[a.file].h);
                    a.scale && (e *= a.scale, g *= a.scale);
                    if (0 > b + e || b > m || 0 > c + g || c > n) return !1;
                    h.drawImage(p[a.file].img, 0, 0, p[a.file].w, p[a.file].h, b, c, e, g)
                }
            } else p[a.file] = {
                loaded: !1
            }, b = k.document.createElement("img"), b.onload = function() {
                p[a.file].loaded = !0;
                p[a.file].img = this;
                p[a.file].w = this.width;
                p[a.file].h = this.height;
                B.load()
            }, b.src = a.file, B.add()
    };
    this.brush.drawImage = function(a) {
        if (a.file)
            if (w(p[a.file])) {
                if (p[a.file].loaded) {
                    var b = a.x || 0,
                        c = a.y || 0;
                    if (a.w && !a.h) {
                        var d =
                            a.w / p[a.file].w;
                        var e = a.w;
                        var l = p[a.file].h * d
                    } else !a.w && a.h ? (d = a.h / p[a.file].h, l = a.h, e = p[a.file].w * d) : a.w && a.h ? (e = a.w, l = a.h) : (e = p[a.file].w, l = p[a.file].h);
                    a.scale && (e *= a.scale, l *= a.scale);
                    if (b + e < g.x || b > g.x + m || c + l < g.y || c > g.y + n) return !1;
                    h.drawImage(p[a.file].img, 0, 0, p[a.file].w, p[a.file].h, -g.x + b, -g.y + c, e, l)
                }
            } else p[a.file] = {}, p[a.file].loaded = !1, b = k.document.createElement("img"), b.onload = function() {
                    p[a.file].loaded = !0;
                    p[a.file].img = this;
                    p[a.file].w = this.width;
                    p[a.file].h = this.height;
                    B.load()
                }, b.src =
                a.file, B.add()
    };
    this.brush.onContext = function(a) {
        a(h)
    };
    this.brush.getPixelColor = function(a, b) {
        var c = h.getImageData(a, b, 1, 1).data;
        return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")"
    };
    this.brush.setPixelColor = function(a, b, c) {
        var d = h.createImageData(1, 1);
        d.data[0] = c.r || d.data[0];
        d.data[1] = c.g || d.data[1];
        d.data[2] = c.b || d.data[2];
        d.data[3] = c.a || 255;
        h.putImageData(d, a, b)
    };
    this.brush.onPixel = function(a, b, c) {
        var d = h.getImageData(a, b, 1, 1),
            e = {
                r: d.data[0],
                g: d.data[1],
                b: d.data[2],
                a: d.data[3] ? d.data[3] : 255
            };
        c(e);
        d.data[0] =
            e.r;
        d.data[1] = e.g;
        d.data[2] = e.b;
        d.data[3] = e.a;
        h.putImageData(d, a, b)
    };
    this.brush.onPixels = function(a, b, c, d, e) {
        c = h.getImageData(a, b, c, d);
        var f;
        d = 0;
        for (f = c.data.length; d < f; d += 4) {
            var g = {
                r: c.data[d],
                g: c.data[d + 1],
                b: c.data[d + 2],
                a: c.data[d + 3] ? c.data[d + 3] : 255
            };
            e(g);
            c.data[d] = g.r;
            c.data[d + 1] = g.g;
            c.data[d + 2] = g.b;
            c.data[d + 3] = g.a
        }
        h.putImageData(c, a, b)
    };
    this.brush.onRawPixels = function(a, b, c, d, e) {
        c = h.getImageData(a, b, c, d);
        e(c.data, c.data.length);
        h.putImageData(c, a, b)
    };
    var W = k.AudioContext || k.webkitAudioContext ||
        !1;
    (W = W ? new W : !1) && W.listener.setPosition(0, 0, 0);
    var X = function(a, b) {
        W || ea('module "wAudio" is not supported! use a "audio"');
        this.vol = b && 1 >= b && 0 < b ? b : 1;
        this.loadPLay = this.nextPlay = this.loaded = this.playing = !1;
        this.pausedTime = this.duration = this.startTime = 0;
        var c = this,
            d = new XMLHttpRequest;
        d.open("GET", a, !0);
        d.responseType = "arraybuffer";
        d.onload = function(a) {
            W.decodeAudioData(this.response, function(a) {
                c.wABuffer = a;
                c.duration = c.wABuffer.duration;
                c.wAGain = W.createGain();
                c.wAGain.gain.value = c.vol;
                c.wAPanner =
                    W.createPanner();
                c.wAPanner.setPosition(0, 0, 1);
                c.wAPanner.panningModel = "equalpower";
                B.load();
                c.loaded = !0;
                c.loadPlay && c.replay()
            }, function(a) {
                ea("error in wAudio.newAudio : error decoding file", a)
            })
        };
        a ? d.send() : ea("error in wAudio.newAudio : Where is file?");
        B.add()
    };
    X.prototype.play = function(a) {
        if (!this.loaded) this.loadPlay = !0;
        else if (!this.playing) {
            this.playing = !0;
            this.wASource = W.createBufferSource();
            this.wASource.buffer = this.wABuffer;
            this.wAListener = W.destination;
            this.wASource.connect(this.wAGain);
            this.wAGain.connect(this.wAPanner);
            this.wAPanner.connect(this.wAListener);
            this.wASource.start(0, this.pausedTime, this.duration);
            this.startTime = W.currentTime;
            var b = this;
            this.wASource.onended = function() {
                b.playing = !1;
                b.startTime = 0;
                b.pausedTime = 0;
                b.nextPlay && b.nextPlay.replay()
            }
        }
    };
    X.prototype.replay = function(a) {
        this.loaded ? (this.stop(), this.play()) : this.loadPlay = !0
    };
    X.prototype.stop = function() {
        this.pause();
        this.pausedTime = this.startTime = 0
    };
    X.prototype.pause = function() {
        if (this.playing) {
            this.pausedTime =
                this.getProgress();
            this.playing = !1;
            this.wASource.stop(0);
            var a = this;
            this.wASource.onended = function() {
                a.playing = !1
            }
        }
    };
    X.prototype.getProgress = function() {
        return this.playing ? W.currentTime - this.startTime + this.pausedTime : this.pausedTime
    };
    X.prototype.playPause = function() {
        this.playing ? this.pause() : this.play()
    };
    X.prototype.setNextPlay = function(a) {
        this.nextPlay = a
    };
    X.prototype.setVolume = function(a) {
        this.vol = a && 1 >= a && 0 < a ? a : this.vol;
        this.wAGain.gain.value = this.vol
    };
    X.prototype.getVolume = function() {
        return this.vol
    };
    X.prototype.setSide = function(a) {
        this.side = a;
        this.wAPanner && this.wAPanner.setPosition(this.side, 0, 1 - Math.abs(this.side))
    };
    X.prototype.getSide = function() {
        return this.side
    };
    this.wAudio.newAudio = function(a, b) {
        return new X(a, b)
    };
    var ia = function(a, b) {
        var c, d = k.document.createElement("audio");
        if ("string" == typeof a) {
            var e = k.document.createElement("source");
            e.src = a;
            d.appendChild(e)
        } else {
            var g = 0;
            for (c = a.length; g < c; g += 1) e = k.document.createElement("source"), e.src = a[g], d.appendChild(e)
        }
        this.vol = b && 1 >= b && 0 < b ? b :
            1;
        this.playing = 0;
        this.audio = d;
        this.nextPlay = this.loaded = !1;
        d.volume = this.vol;
        var h = this;
        d.onloadeddata = function() {
            h.loaded = !0;
            B.load()
        };
        d.onended = function() {
            h.playing = !1;
            h.nextPlay && h.nextPlay.play()
        };
        d.load();
        B.add()
    };
    ia.prototype.play = function(a) {
        this.playing || (a && (this.vol = a && 1 >= a && 0 < a ? a : this.vol, this.audio.volume = this.vol), this.playing = !0, this.audio.play())
    };
    ia.prototype.replay = function(a) {
        a && this.setVolume(a);
        this.playing = !0;
        this.audio.currentTime = 0;
        this.audio.play()
    };
    ia.prototype.stop = function() {
        this.playing &&
            (this.playing = !1, this.audio.pause(), this.audio.currentTime = 0)
    };
    ia.prototype.pause = function() {
        this.playing && (this.playing = !1, this.audio.pause())
    };
    ia.prototype.playPause = function() {
        this.playing ? this.pause() : this.play()
    };
    ia.prototype.setNextPlay = function(a) {
        this.nextPlay = a
    };
    ia.prototype.setVolume = function(a) {
        this.vol = a && 1 >= a && 0 < a ? a : this.vol;
        this.audio.volume = this.vol
    };
    ia.prototype.getVolume = function() {
        return this.vol
    };
    this.audio.newAudio = function(a, b) {
        return new ia(a, b)
    };
    var wb = [],
        ya = [];
    this.zList.useZValue =
        function() {
            this.update = function() {
                ya.length = 0;
                v(wb, function(a) {
                    a.isInCamera() && ya.push(a)
                });
                ya.sort(function(a, b) {
                    return a.z - b.z
                })
            }
        };
    this.zList.useYValue = function() {
        this.update = function() {
            ya.length = 0;
            v(wb, function(a) {
                a.isInCamera() && ya.push(a)
            });
            ya.sort(function(a, b) {
                return a.y + a.h - (b.y + b.h)
            })
        }
    };
    this.zList.add = function(a) {
        wb.push(a)
    };
    this.zList.init = function(a) {
        v(a, function(a) {
            A.zList.add(a)
        })
    };
    this.zList.draw = function(a) {
        A.OOP.drawArr(ya, a)
    };
    this.zList.del = function(a) {
        A.OOP.delObject(wb, a)
    };
    this.zList.useYValue();
    var B = {
        count: 0,
        loaded: 0,
        errored: 0,
        add: function() {
            this.count += 1
        },
        load: function() {
            this.loaded += 1
        },
        error: function() {
            this.errored += 1
        }
    };
    this.resources.isLoaded = function() {
        return B.count == B.loaded
    };
    this.resources.getProgress = function() {
        return Math.ceil(B.loaded / B.count * 100)
    };
    this.levels.forStringArray = function(a, b) {
        var c = a.offset || e(0, 0);
        v(a.source, function(d, e) {
            v(d, function(d, f) {
                " " !== d && b(d, c.x + a.w * f, c.y + a.h * e, a.w, a.h)
            })
        })
    };
    var Rc = function(a) {
            if ("AnimationObject" === a.type && "undefined" !== typeof __LVL_ANIMATIONS &&
                a.__realAnim) {
                var b = __LVL_ANIMATIONS[a.__realAnim];
                a.anim = A.tiles.newImage(b.file).getAnimation(b.x, b.y, b.w, b.h, b.frames)
            }
            var c = nc(a);
            c.name = "";
            G(a, function(a, b) {
                "id" !== b && "anim" !== b && (c[b] = a)
            });
            return c
        },
        yc = function(a, b) {
            var c = {
                settings: {},
                objects: []
            };
            a = JSON.parse(a);
            c.settings = a.settings;
            v(a.objects, function(a) {
                var d = Rc(a);
                d.name = a.name;
                b && b(d);
                c.objects.push(d)
            });
            return c
        },
        zc = function(a, b, c) {
            var d = [],
                e = {};
            if (a && "json" === b) {
                b = yc(a, c);
                d = b.objects;
                e = b.settings;
                var g = a
            }
            this.backgroundColor = e.backgroundColor ?
                e.backgroundColor : !1;
            this.reload = function() {
                d = yc(g)
            };
            this.clear = function() {
                mc(d)
            };
            this.add = function(a) {
                d.push(a)
            };
            this.del = function(a) {
                v(d, function(b, c) {
                    if (a === b) return d.splice(c, 1), "break"
                })
            };
            this.delById = function(a) {
                d.splice(a, 1)
            };
            this.getObjects = function() {
                return d
            };
            this.getObjectByName = function(a) {
                var b;
                var c = 0;
                for (b = d.length; c < b; c += 1)
                    if (d[c].name == a) return d[c];
                return !1
            };
            this.getObjectById = function(a) {
                var b;
                var c = 0;
                for (b = d.length; c < b; c += 1)
                    if (d[c].id == a) return d[c];
                return !1
            };
            this.draw = function(a) {
                this.backgroundColor &&
                    A.game.fill(this.backgroundColor);
                v(d, function(b) {
                    a && a(b);
                    b.isInCamera() && b.draw()
                })
            };
            this.getObjectsInCamera = function() {
                var a = [];
                v(d, function(b) {
                    b.isInCamera() && a.push(b)
                });
                return a
            };
            this.getLevelAsJSON = function(a, b) {
                var c = '{"settings":' + JSON.stringify({
                    backgroundColor: this.backgroundColor
                }) + ',"objects":[';
                if (!d.length) return c + "]}";
                v(d, function(d, e) {
                    a && a(d);
                    c += "{";
                    G(d, function(a, b) {
                        "function" != typeof a && (c += '"' + b + '":' + JSON.stringify(a) + ",")
                    });
                    c = c.substr(0, c.length - 1) + "},";
                    b && b(d)
                });
                c = c.substr(0,
                    c.length - 1);
                return c + "]}"
            }
        };
    this.levels.newLevelFromJSON = function(a, b) {
        return new zc(a, "json", b || !1)
    };
    this.levels.newEmptyLevel = function(a) {
        return new zc(!1)
    };
    var Ac = 0,
        Bc = 0,
        Ub = 0,
        Cc = !1;
    this.system.initFPSCheck = function() {
        Cc || (Cc = !0, l.addEvent("postLoop", "fpsCheckUpdate", function() {
            Ub += 1;
            1E3 <= O - Bc && (Ac = Ub, Ub = 0, Bc = O)
        }))
    };
    this.system.getFPS = function() {
        return Ac
    };
    var xb = this.filters;
    xb.setCSSFilter = function(a, b) {
        var c = (b ? b.canvas : q).style,
            d = "";
        G(a, function(a, b) {
            d += " " + b + "(" + a + ")"
        });
        c.OFilter = c.MozFilter =
            c.WebkitFilter = c.filter = d
    };
    xb.clearCSSFilter = function(a) {
        a = (a ? a.canvas : q).style;
        a.OFilter = a.MozFilter = a.WebkitFilter = a.filter = "none"
    };
    xb.setCSSTransform = function(a, b) {
        var c = (b ? b.canvas : q).style,
            d = "perspective(" + m + "px)";
        G(a, function(a, b) {
            d += " " + b + "(" + a + ")"
        });
        c.transform = c.MozTransform = c.WebkitTransform = d
    };
    xb.clearCSSTransform = function(a) {
        a = (a ? a.canvas : q).style;
        a.transform = a.MozTransform = a.WebkitTransform = "none"
    };
    var d = this.presets;
    d.key = {
        NAME: null,
        keyMoveDX: 0,
        keyMoveDY: 0,
        p: 0
    };
    d.keyMoveInit = function(a,
        b, c, e, g, h) {
        d.key.NAME = a;
        d.key.SPEED = b;
        d.key.keyMoveDX = 0;
        d.key.keyMoveDY = 0;
        d.key.p = pjs.vector.point;
        a = pjs.keyControl.isDown;
        d.key.keyMoveDX = d.key.keyMoveDY = 0;
        if (c) a(c) && (d.key.keyMoveDX = d.key.SPEED || 1);
        else if (a("D") || a("RIGHT")) d.key.keyMoveDX = d.key.SPEED || 1;
        if (e) a(e) && (d.key.keyMoveDX = -d.key.SPEED || -1);
        else if (a("A") || a("LEFT")) d.key.keyMoveDX = -d.key.SPEED || -1;
        if (g) a(g) && (d.key.keyMoveDY = -d.key.SPEED || -1);
        else if (a("W") || a("UP")) d.key.keyMoveDY = -d.key.SPEED || -1;
        if (h) a(h) && (d.key.keyMoveDY = d.key.SPEED ||
            1);
        else if (a("S") || a("DOWN")) d.key.keyMoveDY = d.key.SPEED || 1
    };
    d.keyMoveCollision = function(a) {
        a.isStaticIntersect(d.key.NAME.getStaticBoxD(0, 0, d.key.SPEED)) && d.key.keyMoveDX == d.key.SPEED && (d.key.keyMoveDX = 0, d.key.NAME.x = a.x - d.key.NAME.w);
        a.isStaticIntersect(d.key.NAME.getStaticBoxA(-d.key.SPEED, 0, d.key.SPEED)) && d.key.keyMoveDX == -d.key.SPEED && (d.key.keyMoveDX = 0, d.key.NAME.x = a.x + a.w);
        a.isStaticIntersect(d.key.NAME.getStaticBoxW(0, -d.key.SPEED, 0, d.key.SPEED)) && d.key.keyMoveDY == -d.key.SPEED && (d.key.keyMoveDY =
            0, d.key.NAME.y = a.y + a.h);
        a.isStaticIntersect(d.key.NAME.getStaticBoxS(0, 0, 0, d.key.SPEED)) && d.key.keyMoveDY == d.key.SPEED && (d.key.keyMoveDY = 0, d.key.NAME.y = a.y - d.key.NAME.h)
    };
    d.keyMove = function() {
        d.key.NAME.move(d.key.p(d.key.keyMoveDX, d.key.keyMoveDY))
    };
    d.mouse = {
        mouseMoveDX: 0,
        mouseMoveDY: 0,
        mouseX: 1,
        mouseY: 1,
        POINT: 0,
        TYPE: 1,
        SPEED: 1,
        TRACKING: 0,
        NAME: null,
        FLAG1: !1,
        FLAG2: !1,
        mouseControl: null,
        getPosition: null
    };
    d.mouseMoveInit = function(a, b, c, e) {
        d.mouse.TYPE = c;
        d.mouse.SPEED = b;
        d.mouse.TRACKING = e;
        d.mouse.NAME =
            a;
        d.mouse.FLAG1 = !1;
        d.mouse.FLAG2 = !1;
        d.mouse.mouseControl = pjs.mouseControl;
        d.mouse.getPosition = d.mouse.mouseControl.getPosition();
        a = pjs.mouseControl;
        1 == d.mouse.TRACKING && d.mouse.NAME.rotate(d.mouse.getPosition);
        if (1 == d.mouse.TYPE || 2 == d.mouse.TYPE) d.mouse.POINT = d.mouse.getPosition, d.mouse.getPosition.x > d.mouse.NAME.getPositionC().x ? (d.mouse.mouseMoveDX = d.mouse.SPEED, d.mouse.mouseX = 1) : d.mouse.getPosition.x < d.mouse.NAME.getPositionC().x && (d.mouse.mouseMoveDX = -d.mouse.SPEED, d.mouse.mouseX = 1), d.mouse.getPosition.y <
            d.mouse.NAME.getPositionC().y ? (d.mouse.mouseMoveDY = -d.mouse.SPEED, d.mouse.mouseY = 1) : d.mouse.getPosition.y > d.mouse.NAME.getPositionC().y && (d.mouse.mouseMoveDY = d.mouse.SPEED, d.mouse.mouseY = 1);
        if (3 == d.mouse.TYPE || 4 == d.mouse.TYPE || 5 == d.mouse.TYPE) a.isPress("LEFT") && (d.mouse.POINT = d.mouse.getPosition, 1 == d.mouse.TRACKING && d.mouse.NAME.rotate(d.mouse.getPosition), d.mouse.getPosition.x > d.mouse.NAME.getPositionC().x ? (d.mouse.mouseMoveDX = d.mouse.SPEED, d.mouse.mouseX = 1) : d.mouse.getPosition.x < d.mouse.NAME.getPositionC().x &&
            (d.mouse.mouseMoveDX = -d.mouse.SPEED, d.mouse.mouseX = 1), d.mouse.getPosition.y < d.mouse.NAME.getPositionC().y ? (d.mouse.mouseMoveDY = -d.mouse.SPEED, d.mouse.mouseY = 1) : d.mouse.getPosition.y > d.mouse.NAME.getPositionC().y && (d.mouse.mouseMoveDY = d.mouse.SPEED, d.mouse.mouseY = 1)), 5 == d.mouse.TYPE && (0 == d.mouse.FLAG1 && 0 == d.mouse.mouseX ? d.mouse.mouseX = 1 : 0 == d.mouse.FLAG2 && 0 == d.mouse.mouseY && (d.mouse.mouseY = 1))
    };
    d.mouseMoveCollision = function(a) {
        a.isStaticIntersect(d.mouse.NAME.getStaticBoxD(0, 0, d.mouse.SPEED)) && 1 == d.mouse.mouseX &&
            d.mouse.mouseMoveDX == d.mouse.SPEED && (d.mouse.FLAG1 = !0, d.mouse.mouseX = 0, 2 == d.mouse.TYPE && (d.mouse.mouseY = 0), d.mouse.NAME.x = a.x - d.mouse.NAME.w, 4 == d.mouse.TYPE && (d.mouse.POINT = 0));
        a.isStaticIntersect(d.mouse.NAME.getStaticBoxA(-d.mouse.SPEED, 0, d.mouse.SPEED)) && 1 == d.mouse.mouseX && d.mouse.mouseMoveDX == -d.mouse.SPEED && (d.mouse.FLAG1 = !0, d.mouse.mouseX = 0, 2 == d.mouse.TYPE && (d.mouse.mouseY = 0), d.mouse.NAME.x = a.x + a.w, 4 == d.mouse.TYPE && (d.mouse.POINT = 0));
        a.isStaticIntersect(d.mouse.NAME.getStaticBoxW(0, -d.mouse.SPEED,
            0, d.mouse.SPEED)) && 1 == d.mouse.mouseY && d.mouse.mouseMoveDY == -d.mouse.SPEED && (d.mouse.FLAG2 = !0, d.mouse.mouseY = 0, 2 == d.mouse.TYPE && (d.mouse.mouseX = 0), d.mouse.NAME.y = a.y + a.h, 4 == d.mouse.TYPE && (d.mouse.POINT = 0));
        a.isStaticIntersect(d.mouse.NAME.getStaticBoxS(0, 0, 0, d.mouse.SPEED)) && 1 == d.mouse.mouseY && d.mouse.mouseMoveDY == d.mouse.SPEED && (d.mouse.FLAG2 = !0, d.mouse.mouseY = 0, 2 == d.mouse.TYPE && (d.mouse.mouseX = 0), d.mouse.NAME.y = a.y - d.mouse.NAME.h, 4 == d.mouse.TYPE && (d.mouse.POINT = 0))
    };
    d.mouseMove = function() {
        d.mouse.NAME.getDistanceC(d.mouse.POINT) >
            d.mouse.SPEED + 1 && d.mouse.NAME.moveToC(d.mouse.POINT, d.mouse.SPEED * d.mouse.mouseX, d.mouse.SPEED * d.mouse.mouseY)
    };
    d.bgCycle = function(a, b, c, d, e) {
        var f = pjs.vector.point;
        if (0 != b) var g = game.newImageObject({
            x: 0 > b ? a.x + a.w + b + (d || 0) : a.x - a.w + b + (d || 0),
            y: a.y,
            file: a.file
        });
        if (0 != c) var h = game.newImageObject({
            x: a.x,
            y: 0 > c ? a.y + a.h + c + (e || 0) : a.y - a.h + c + (e || 0),
            file: a.file
        });
        0 != b && (0 > b ? 0 > a.x + a.w && (a.x = 0) : 0 < b && 0 < a.x - a.w && (a.x = 0));
        0 != c && (0 > c ? 0 > a.y + a.h + c && (a.y = 0) : 0 < c && a.y > a.h && (a.y = 0));
        a.move(f(b, c));
        0 != b && g.draw();
        0 != c &&
            h.draw()
    };
    d.physics = {
        NAME: null,
        keyMoveDX: 0,
        keyMoveDY: 0,
        SPEED: 0,
        GRAVITY: 0,
        DENSITY: 0,
        BOUNCE: 0,
        STICKING: 0,
        minBounce: 0,
        m: 0,
        flag1: !0,
        GG: 0,
        p: 0,
        memoryDY: 0,
        ROTATION: 0,
        rtStop: 0,
        ACCELETARIONDOWN: 0
    };
    d.physicsMoveInit = function(a, b, c, e, g, h, k, l, m, n, p, q, r, t) {
        d.physics.NAME = a;
        d.physics.SPEED = b;
        d.physics.GRAVITY = c;
        d.physics.DENSITY = e;
        d.physics.rtStop = m;
        d.physics.BOUNCE = g;
        0 != d.physics.BOUNCE && 2.4 >= d.physics.BOUNCE && (d.physics.BOUNCE = 2.4);
        d.physics.STICKING = h;
        d.physics.minBounce = k;
        d.physics.ACCELETARIONDOWN = n;
        a = pjs.keyControl.isDown;
        h = pjs.mouseControl.isPress;
        d.physics.p = pjs.vector.point;
        d.physics.keyMoveDX = 0;
        d.physics.ROTATION = 0;
        if (a(p[0]) || a(p[1]) || a(p[2]) || a(p[3]) || a(p[4]) || a(p[5])) d.physics.keyMoveDX = b, 0 != l && (d.physics.ROTATION = l);
        if (a(q[0]) || a(q[1]) || a(q[2]) || a(q[3]) || a(q[4]) || a(q[5])) d.physics.keyMoveDX = -b, 0 != l && (d.physics.ROTATION = -l);
        (a(r[0]) || a(r[1]) || a(r[2]) || a(r[3]) || a(r[4]) || a(r[5]) || h(t[0]) || h(t[1]) || h(t[2])) && 0 == d.physics.flag1 && (d.physics.GG = c, d.physics.BOUNCE = g, d.physics.memoryDY = 0, d.physics.keyMoveDY = 0, d.physics.flag1 = !0);
        d.physics.keyMoveDY -= e;
        d.physics.GG += d.physics.keyMoveDY;
        d.physics.NAME.y -= d.physics.GG
    };
    d.physicsMoveCollision = function(a) {
        0 > d.physics.GG && a.isStaticIntersect(d.physics.NAME.getStaticBoxS(0, -d.physics.keyMoveDY + 1, 0, 0)) && (d.physics.NAME.y = a.y - d.physics.NAME.h, d.physics.m = Math.abs(d.physics.GG), d.physics.keyMoveDY = 0, d.physics.GG = 0, 0 != d.physics.BOUNCE && d.physics.m > d.physics.minBounce && (d.physics.GG = d.physics.m / d.physics.BOUNCE), 0 == d.physics.GG && 0 == d.physics.keyMoveDY && 1 == d.physics.flag1 && (d.physics.memoryDY =
            d.physics.NAME.y, d.physics.flag1 = !1), 0 == d.physics.flag1 && (d.physics.GG = d.physics.ACCELETARIONDOWN));
        0 < d.physics.GG && a.isStaticIntersect(d.physics.NAME.getStaticBoxW(0, -d.physics.keyMoveDY, 1, d.physics.ACCELETARIONDOWN)) && (d.physics.NAME.y = a.y + a.h, d.physics.GG = 0, 0 != d.physics.STICKING && (d.physics.keyMoveDY = d.physics.STICKING));
        a.isStaticIntersect(d.physics.NAME.getStaticBoxA(d.physics.keyMoveDX, 0, -d.physics.keyMoveDX, 0)) && d.physics.keyMoveDX == -d.physics.SPEED ? (d.physics.keyMoveDX = 0, d.physics.NAME.x =
            a.x + a.w, 1 == d.physics.rtStop && (d.physics.ROTATION = 0)) : a.isStaticIntersect(d.physics.NAME.getStaticBoxD(0, 0, d.physics.keyMoveDX, d.physics.ACCELETARIONDOWN)) && d.physics.keyMoveDX == d.physics.SPEED && (d.physics.keyMoveDX = 0, d.physics.NAME.x = a.x - d.physics.NAME.w, 1 == d.physics.rtStop && (d.physics.ROTATION = 0))
    };
    d.physicsMove = function() {
        d.physics.NAME.move(d.physics.p(d.physics.keyMoveDX, d.physics.keyMoveDY));
        d.physics.NAME.turn(d.physics.ROTATION);
        0 != d.physics.memoryDY && d.physics.NAME.y > d.physics.memoryDY && 0 ==
            d.physics.flag1 && (d.physics.memoryDY = 0, d.physics.flag1 = !0)
    };
    this.OOP.newRever = function(a, b, c) {
        var d = function(a, b, c) {
            this.min = a;
            this.max = b;
            this.step = c;
            this.value = a;
            this.to = c
        };
        d.prototype = {
            update: function() {
                var a = this.value;
                this.value <= this.min ? this.to = this.step : this.value >= this.max && (this.to = -this.step);
                this.value += this.to;
                return a
            },
            getValue: function() {
                return this.value
            },
            setValue: function(a) {
                this.value = parseFloat(a)
            },
            setStep: function(a) {
                this.step = a
            },
            getStep: function() {
                return this.step
            }
        };
        return new d(a,
            b, c)
    };
    var Dc = {};
    this.OOP.once = function(a, b) {
        Dc[a] || (Dc[a] = !0, b())
    };
    this.OOP.newTimer = function(a, b) {
        if (0 >= a) return la("error in system.newTimer : variable < 0, Timer is not created");
        var c = {
            time: 0 < a ? a : 1E3,
            func: b,
            startTime: !1,
            ending: !1,
            start: function() {
                this.ending || this.startTime || (this.startTime = O)
            },
            run: function() {
                !this.ending && this.startTime && O - this.startTime >= this.time && (this.func(), this.ending = !0)
            },
            end: function() {
                this.ending || (this.ending = !0, this.func())
            },
            restart: function(a) {
                this.startTime || this.start();
                if (this.ending) {
                    if (a && 0 >= a) return la("error in Timer.restart : variable < 0");
                    a && (this.time = a);
                    this.ending = !1;
                    this.startTime = O
                }
            },
            stop: function() {
                this.ending || (this.ending = !0)
            }
        };
        l.addEvent("postLoop", "timer" + S(-100, 100) * S(-100, 100) + O, function() {
            c.run()
        });
        return c
    };
    this.memory.local = {
        storage: k.localStorage,
        clear: function() {
            this.storage.clear()
        },
        save: function(a, b) {
            this.storage.setItem(a, b)
        },
        saveAsObject: function(a, b) {
            var c = JSON.stringify(b);
            this.storage.setItem(a, c)
        },
        loadAsObject: function(a) {
            return JSON.parse(this.storage.getItem(a) ||
                "false")
        },
        load: function(a) {
            return this.storage.getItem(a)
        },
        loadAsNumber: function(a) {
            return parseFloat(this.storage.getItem(a))
        }
    };
    this.memory.temp = {
        values: {},
        save: function(a, b) {
            this.values[a] = b
        },
        load: function(a) {
            return this.values[a]
        },
        loadAsNumber: function(a) {
            return parseFloat(this.values[a])
        }
    };
    k.addEventListener("load", function() {
        if (h) {
            for (var a in t) h[a] = t[a];
            h.save()
        }
        l.runEvent("onload");
        l.loaded = !0;
        K || (k.document.body.style.overflow = "hidden");
        "function" === typeof POINTJS_USER_ONLOAD && POINTJS_USER_ONLOAD();
        return !1
    });
    k.addEventListener("blur", function() {
        if (ja) return l.runEvent("gameBlur"), !1
    });
    k.addEventListener("focus", function() {
        if (!ja) return k.document.activeElement.blur(), k.focus(), l.runEvent("gameFocus"), !1
    });
    k.addEventListener("resize", function() {
        l.runEvent("gameResize");
        h && (h.textBaseline = t.textBaseline, m /= pa, n /= qa, H = m / 2, I = n / 2, h.scale(pa, qa));
        return !1
    });
    (K ? r : k).addEventListener("click", function() {
        k.document.activeElement && k.document.activeElement.blur();
        k.focus()
    });
    if ("undefined" !== typeof POINTJS_LOADED_DOM_IGNORE) k.onload();
    "undefined" !== typeof POINTJS_ENGINE_CREATED_EVENT && POINTJS_ENGINE_CREATED_EVENT(this);
    k._GLOGAL_POINT_JS = this
};