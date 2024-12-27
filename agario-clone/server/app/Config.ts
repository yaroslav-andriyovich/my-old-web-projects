let tile_count = 1;
let tile_size = 1250;
let map_size = tile_count * tile_size;
let max_foods_count = 40 * tile_count;
let max_thorns_count = 1 * tile_count;
let max_player_radius = +((map_size / 4).toFixed(0));

export const Config = 
{
    domain: "http://my-web-projects",
    port: 777,
    room_name: "fress.io",
    colors: [
        [255, 43, 43],
        [255, 43, 192],
        [230, 43, 255],
        [156, 43, 255],
        [65, 43, 255],
        [43, 135, 255],
        [43, 241, 255],
        [43, 255, 163],
        [43, 255, 75],
        [167, 255, 43],
        [255, 244, 43],
        [255, 149, 43],
        [255, 100, 43]
    ],
    tile_count: tile_count,
    tile_size: tile_size,
    map_size: map_size,
    max_foods_count: max_foods_count,
    max_thorns_count: max_thorns_count,
    min_edge_distance: 35,
    min_food_radius: 5,
    max_food_radius: 10,
    ediblePlayerPart_radius: 19,
    ediblePlayerPart_maxDistance: 120,
    min_thorn_radius: 50,
    max_thorn_radius: 100,
    min_player_radius: 20,
    max_player_radius: max_player_radius,
    min_player_radius_for_ediblePlayerPart: 40,
    player_scale_value: 1, //0.3
    player_score_mult: 1.5,
    player_start_score: 10
};