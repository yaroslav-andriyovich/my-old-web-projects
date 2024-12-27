export var Mode;
(function (Mode) {
    Mode["ToLocal"] = "rpc_to_local";
    Mode["ToAll"] = "rpc_to_all";
    Mode["ToAllExceptLocal"] = "rpc_to_all_except_local";
})(Mode || (Mode = {}));
export var ToClient;
(function (ToClient) {
    ToClient["MultipleEvents"] = "multiple_events";
    ToClient["Pong"] = "pong";
    ToClient["NewPlayer"] = "new_player";
    ToClient["UpdateEnemyPos"] = "update_enemy_pos";
    ToClient["SomeoneAteFood"] = "someone_ate_food";
    ToClient["SomeoneAteThorn"] = "someone_ate_thorn";
    ToClient["SomeoneAteEnemy"] = "someone_ate_enemy";
    ToClient["GenerateNewFoods"] = "generate_new_foods";
    ToClient["GenerateNewThorns"] = "generate_new_thorns";
    ToClient["MapInit"] = "map_init";
    ToClient["UpdateOnline"] = "update_online";
    ToClient["CreatedPlayerFood"] = "created_player_food";
    ToClient["PlayerDisconnected"] = "player_disconnected";
})(ToClient || (ToClient = {}));
export var ToServer;
(function (ToServer) {
    ToServer["MultipleEvents"] = "multiple_events";
    ToServer["Ping"] = "ping";
    ToServer["ReadyToSpawn"] = "ready_to_spawn";
    ToServer["UpdatePos"] = "update_pos";
    ToServer["AteFood"] = "ate_food";
    ToServer["AteThorn"] = "ate_thorn";
    ToServer["AteEnemy"] = "ate_enemy";
    ToServer["CreatePlayerFood"] = "create_player_food";
})(ToServer || (ToServer = {}));
