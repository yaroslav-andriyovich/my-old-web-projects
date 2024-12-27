/** Порт для подключения к серверу */
export const Port: number = 777;

/** Получить значение от числа по проценту
    * @param percent % от числа (0...100)
    * @param number Число, от которого нужно получить процент
*/
export function GetPercentage(percent: number, number: number): number
{
    return number * (percent / 100);
}

/** Получить строку цвета
    * @param colorsArr Массив цифр для создания цвета
    * @param isDark True, если нужно получить тёмную версию цвета
*/
export function GetRGB(colorsArr: Array<number>, isDark: boolean = false): string
{
    if (!isDark)
    {
        return `rgb(${colorsArr[0]}, ${colorsArr[1]}, ${colorsArr[2]})`;
    }

    let num = 20;
    return `rgb(${colorsArr[0] - num}, ${colorsArr[1] - num}, ${colorsArr[2] - num})`;
} 