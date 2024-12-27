import { Config } from 'server';

export function GenerateID(): string
{
    let result       = '';
    let words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let max_position = words.length - 1;

    for(let i = 0; i <= 10; ++i ) 
    {
        let position = Math.floor ( Math.random() * max_position );
        result = result + words.substring(position, position + 1);
    }

    return result;
}

export function NicknameFilter(nickname: string): string
{
    if (!nickname)
    {
        return;
    }

    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return nickname.replace(/[&<>"']/g, function(m) { return map[m]; });
}

export function Random(min: number, max: number): number 
{
    return Math.round(Math.random() * (max - min) + min);
}

export function RandomSpawnPoint(): number
{
    return Random(Config.min_edge_distance, Config.map_size - Config.min_edge_distance);
}

export function GetRGB(colors_arr, is_dark = false): string
{
    if (!is_dark)
    {
        return `rgb(${colors_arr[0]}, ${colors_arr[1]}, ${colors_arr[2]})`;
    }

    let num = 20;
    return `rgb(${colors_arr[0] - num}, ${colors_arr[1] - num}, ${colors_arr[2] - num})`;
} 

export function RandomColor(): number[]
{
    return Config.colors[Random(0, Config.colors.length - 1)];
}

/** Получить значение от числа по проценту
    * @param percent % от числа (0...100)
    * @param number Число, от которого нужно получить процент
*/
export function GetPercentage(percent: number, number: number): number
{
    return number * (percent / 100);
}