export enum Mode
{
    ToLocal          = "rpc_to_local",
    ToAll            = "rpc_to_all",
    ToAllExceptLocal = "rpc_to_all_except_local"
}

export enum ToClient
{
    MultipleEvents     = "multiple_events",
    Pong               = "pong",
    NewPlayer          = "new_player",
    UpdateEnemyPos     = "update_enemy_pos",
    SomeoneAteFood     = "someone_ate_food",
    SomeoneAteThorn    = "someone_ate_thorn",
    SomeoneAteEnemy    = "someone_ate_enemy",
    GenerateNewFoods   = "generate_new_foods",
    GenerateNewThorns  = "generate_new_thorns",
    MapInit            = "map_init",
    UpdateOnline       = "update_online",
    CreatedPlayerFood  = "created_player_food",
    PlayerDisconnected = "player_disconnected"
}

export enum ToServer
{
    MultipleEvents    = "multiple_events",
    Ping              = "ping",
    ReadyToSpawn      = "ready_to_spawn",
    UpdatePos         = "update_pos",
    AteFood           = "ate_food",
    AteThorn          = "ate_thorn",
    AteEnemy          = "ate_enemy",
    CreatePlayerFood = "create_player_food"
}