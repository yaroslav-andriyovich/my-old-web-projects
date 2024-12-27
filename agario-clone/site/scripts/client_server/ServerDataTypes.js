export class Event {
    constructor(command, data) {
        this.command = command;
        this.data = data;
    }
}
export class MultipleEvents {
    get Events() {
        return this.events;
    }
    Add(command, data) {
        this.events.push(new Event(command, data));
        return this;
    }
}
export class PlayerToRender {
    constructor(name, fillColor, strokeColor, strokeWidth, id, x, y, pointToMove, radius, score, speed, alive) {
        this.name = name;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.id = id;
        this.x = x;
        this.y = y;
        this.pointToMove = pointToMove;
        this.radius = radius;
        this.score = score;
        this.speed = speed;
        this.alive = alive;
    }
}
export class FoodToRender {
    constructor(id, position, radius, fillColor, ownerId, targetPosition) {
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
        this.fillColor = fillColor;
        this.ownerId = ownerId;
        this.targetPosition = targetPosition;
    }
}
export class ThornToRender {
    constructor(id, x, y, radius) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
export class UpdatePlayerPos {
    constructor(pointToMove, x, y, id) {
        this.pointToMove = pointToMove;
        this.x = x;
        this.y = y;
        this.id = id;
    }
}
export class Ping {
    constructor() {
        this.time = new Date().getTime();
    }
}
export class UpdateOnline {
    constructor(online) {
        this.online = online.toString();
    }
}
export class UpdatePlayer {
    constructor(id, radius, score) {
        this.id = id;
        this.radius = radius;
        this.score = score;
    }
}
export class PlayerDisconnected {
    constructor(id, onlineInfo) {
        this.id = id;
        this.onlineInfo = onlineInfo;
    }
}
export class AteFood {
    constructor(removedFoods, player) {
        this.removedFoods = removedFoods;
        this.player = player;
    }
}
export class AteThorn {
    constructor(removedThorns, player) {
        this.removedThorns = removedThorns;
        this.player = player;
    }
}
export class AteEnemy {
    constructor(enemyId, killer) {
        this.enemyId = enemyId;
        this.killer = killer;
    }
}
export class NewFoods {
    constructor(newFoods) {
        this.newFoods = newFoods;
    }
}
export class NewThorns {
    constructor(thorns) {
        this.thorns = thorns;
    }
}
export class MapInitialization {
    constructor(map_size, map_min_edge, tile_size, tile_count, foodPoints, thorns, enemies, local_id, player_scale_value, min_player_radius, max_player_radius, min_player_radius_for_ediblePlayerPart) {
        this.map =
            {
                map_size: map_size,
                map_min_edge: map_min_edge,
                tile_size: tile_size,
                tile_count: tile_count,
                foodPoints: foodPoints,
                thorns: thorns
            };
        this.enemies = enemies;
        this.local_id = local_id;
        this.server_settings =
            {
                player_scale_value: player_scale_value,
                min_player_radius: min_player_radius,
                max_player_radius: max_player_radius,
                min_player_radius_for_ediblePlayerPart
            };
    }
}
export class NewPlayerFood {
    constructor(newFoods, ownerData) {
        this.newFoods = newFoods;
        this.ownerData = ownerData;
    }
}
