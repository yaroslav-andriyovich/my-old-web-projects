<?php

/* IMAGE GENERATION SCRIPT */

#$start = microtime(true); 
#// тело скрипта 
#echo 'Время выполнения скрипта: '.(microtime(true) - $start).' сек.';

// ini_set('error_reporting', E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);

if ($_GET['type'] == "q") {

$image_path = "images/q.jpg"; //Путь к background

$text1 = /*"«".*/$_GET['text']/*."»"*/;
$first = mb_substr($text1,0,1);//первая буква
$last = mb_substr($text1,1);//все кроме первой буквы
$first = mb_strtoupper($first);
$last = mb_strtolower($last);
$text1 = $first.$last;
$text1 = wordwrap($text1, 80, "\n", 1);
$text2 = "© ".$_GET['username'];

#copy("https://pp.userapi.com/c850220/v850220908/7cf95/hKkqqspAuR4.jpg?ava=1", "images/ava.jpg");
#$img1 = imagecreatefromjpeg("images/ava.jpg");
$img1 = imagecreatefromjpeg($_GET['ava']);
#Берем аву юзверя и создаем ее

$x=imagesx($img1)-$width ;
$y=imagesy($img1)-$height;
$img2 = imagecreatetruecolor($x, $y);
$bg = imagecolorallocate($img2, 100, 100, 100);
imagefill($img2, 0, 0, $bg);
$e = imagecolorallocate($img2, 0, 0, 0);
$r = $x <= $y ? $x : $y;
imagefilledellipse ($img2, ($x/2), ($y/2), $r, $r, $e); 
imagecolortransparent($img2, $e);
imagecopymerge($img1, $img2, 0, 0, 0, 0, $x, $y, 100);
imagecolortransparent($img1, $bg);
/* Делаем из квадратной авы круглую */

#$stamp_path = "images/ava.jpg"; //Путь к изображению штампа 1

#$file_new = $_GET['file_new']." ".$text3.".png"; //Путь к изображению

$img = imagecreatefromjpeg($image_path); // создаём новое изображение из файла
#$stamp1 = imagecreatefrompng($stamp_path); // создаём новое изображение штамп 1

$font = "../fonts/12787.ttf"; // путь к шрифту
$font_size = 16; // размер шрифта общий
$font_size2 = (mb_strlen($text2,'UTF-8') > 24) ? 12 : 15; // размер шрифта 5 элемента
$color = imageColorAllocate($img, 255, 255, 255); //Цвет шрифта

#imagecopy($img, $stamp1, 693, 68, 0, 0, imagesx($stamp1), imagesy($stamp1)); // наложение штампа на основное изображение
imagecopy($img, $img1, 60, 68, 0, 0, imagesx($img1), imagesy($img1)); // наложение штампа на основное изображение

//Разметка самого текста и его позиционирование
imagettftext($img, $font_size, 0, 328, 140, $color, $font, $text1);
imagettftext($img, $font_size2, 0, 560, 360, $color, $font, $text2);

#header("Content-type: image/jpeg");
$filename = "images/quotes/".uniqid().".jpg";
imagejpeg($img, $filename, 90); // сохранение файла на сервер
#imagejpeg($img); // вывод изображения в браузер
#imagedestroy($img);

echo $filename;

} // q

/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */

if ($_GET['type'] == "c") {

$image_path = "images/c.jpg"; //Путь к background

$name = $_GET['username'];
$info = $_GET['text'];
$first = mb_substr($info,0,1);//первая буква
$last = mb_substr($info,1);//все кроме первой буквы
$first = mb_strtoupper($first);
$last = mb_strtolower($last);
$info = $first.$last;
$info = wordwrap($info, 130, "\n", 1);
$info = explode("\n", $info);
$info1 = $info[0];
$info2 = $info[1];
date_default_timezone_set("Europe/Moscow"); 
$date1 = date("d.m");
$date2 = str_replace("20", "", date("Y"));

#copy("https://pp.userapi.com/c850220/v850220908/7cf95/hKkqqspAuR4.jpg?ava=1", "images/ava.jpg");
#$img1 = imagecreatefromjpeg("images/ava.jpg");
$img1 = imagecreatefromjpeg($_GET['ava']);
#Берем аву юзверя и создаем ее

#$stamp_path = "images/ava.jpg"; //Путь к изображению штампа 1

#$file_new = $_GET['file_new']." ".$text3.".png"; //Путь к изображению

$img = imagecreatefromjpeg($image_path); // создаём новое изображение из файла
#$stamp1 = imagecreatefrompng($stamp_path); // создаём новое изображение штамп 1

$font = "../fonts/verdanab.ttf"; // путь к шрифту
$font2 = "../fonts/12808.ttf"; // путь к шрифту
$font_size = 23; // размер шрифта общий
$font_size2 = 19; // размер шрифта 5 элемента
$color = imageColorAllocate($img, 68, 68, 68); //Цвет шрифта

#imagecopy($img, $stamp1, 693, 68, 0, 0, imagesx($stamp1), imagesy($stamp1)); // наложение штампа на основное изображение
imagecopy($img, $img1, 170, 200, 0, 0, imagesx($img1), imagesy($img1)); // наложение штампа на основное изображение |  170 200 | 800 735

//Разметка самого текста и его позиционирование
imagettftext($img, $font_size, 0, (mb_strlen($name,'UTF-8') > 13) ? 620 : 650, 435, $color, $font2, $name);
imagettftext($img, $font_size2, 0, 255, 566, $color, $font2, $info1);// (imagesx($img)/2)-(16*mb_strlen($info1)/2)
imagettftext($img, $font_size2, 0, 255, 660, $color, $font2, $info2);
imagettftext($img, 16, 0, 1195, 900, $color, $font2, $date1);
imagettftext($img, 16, 0, 1305, 900, $color, $font2, $date2);

$w =  imagesx($img)/1.5;
$h =  imagesy($img)/1.5;

$image_p = imagecreatetruecolor($w, $h);
imagecopyresampled($image_p, $img, 0, 0, 0, 0, $w, $h, imagesx($img), imagesy($img));

// header("Content-type: image/jpeg");
$filename = "images/certificates/".uniqid().".jpg";
imagejpeg($image_p, $filename, 80); // сохранение файла на сервер
// imagejpeg($image_p); // вывод изображения в браузер
#imagedestroy($image_p);

echo $filename;

} // certificate

?>