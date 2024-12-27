export const Port = 777;
export function GetPercentage(percent, number) {
    return number * (percent / 100);
}
export function GetRGB(colorsArr, isDark = false) {
    if (!isDark) {
        return `rgb(${colorsArr[0]}, ${colorsArr[1]}, ${colorsArr[2]})`;
    }
    let num = 20;
    return `rgb(${colorsArr[0] - num}, ${colorsArr[1] - num}, ${colorsArr[2] - num})`;
}
