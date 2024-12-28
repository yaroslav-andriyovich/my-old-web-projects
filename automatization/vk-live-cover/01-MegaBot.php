<?php

set_time_limit(90);

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$GLOBALS["bot_token"] = '#GROUP_TOKEN#';
date_default_timezone_set("Europe/Moscow"); 

$image_path = "images/bg/o_mb.jpg"; //Путь к background

# ---------------------Получение информаиции от ВК АПИ-------------------------------
    $params2 = array('group_id' => "166188343", 'sort' => 'time_desc', 'count' => "2", "fields" => "first_name,last_name,id,photo_100", 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
    $params2 = http_build_query($params2);
    $query   = file_get_contents('https://api.vk.com/method/groups.getMembers?'.$params2);
    $result  = json_decode($query, true);

    $info_first_name = $result["response"]["items"][0]["first_name"];
    $info_last_name  = $result["response"]["items"][0]["last_name"];
    $info_photo_max  = $result["response"]["items"][0]["photo_100"];
# -----------------------------------------------------------------------------------

$prem_list  = json_decode(file_get_contents("../megabot/json/premium_list.json"), true);

foreach ($prem_list as $key => $value) {

    foreach ($value as $key2 => $value2) {

        if ($key2 == "mbshow" && $value2 == true) { 
            $prem_list[$key]["mbshow"] = false; 
            
            $params = array('user_ids' => $key, 'fields' => 'first_name,last_name,id,photo_100', 'lang' => 'ru', 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
            $query  = file_get_contents('https://api.vk.com/method/users.get?'.http_build_query($params));
            $result = json_decode($query, true);

            $prem_name       = $result["response"][0]["first_name"]." ".$result["response"][0]["last_name"];
            $prem_photo_max  = $result["response"][0]["photo_100"];
            
            $pu_c = true;
            break 2;
      }
   }
}

if (!isset($pu_c)) {

    foreach ($prem_list as $key => $value) {

        foreach ($value as $key2 => $value2) {
    
            if ($key2 == "mbshow") { 
                $prem_list[$key]["mbshow"] = true; 
        }
    }
  }

  $params = array('user_ids' => "516075750", 'fields' => 'first_name,last_name,id,photo_100', 'lang' => 'ru', 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
  $query  = file_get_contents('https://api.vk.com/method/users.get?'.http_build_query($params));
  $result = json_decode($query, true);

  $prem_name       = $result["response"][0]["first_name"]." ".$result["response"][0]["last_name"];
  $prem_photo_max  = $result["response"][0]["photo_100"];
}

file_put_contents("../megabot/json/premium_list.json", json_encode($prem_list));

$new_user_name = $info_first_name." ".$info_last_name;
// Имя нового участника

$info = "Статус активности бота: ONLINE";
$time = date("d.m.Y H:i");

$img_1 = imagecreatefromjpeg($info_photo_max);
#Берем аву юзверя и создаем ее
$img_2 = imagecreatefromjpeg($prem_photo_max);
#Берем аву юзверя и создаем ее

function CubeAvaToCircle($_photoname) {
    $x=imagesx($_photoname);
    $y=imagesy($_photoname);
    $img2 = imagecreatetruecolor($x, $y);
    $bg = imagecolorallocate($img2, 100, 100, 100);
    imagefill($img2, 0, 0, $bg);
    $e = imagecolorallocate($img2, 0, 0, 0);
    $r = $x <= $y ? $x : $y;
    imagefilledellipse ($img2, ($x/2), ($y/2), $r, $r, $e); 
    imagecolortransparent($img2, $e);
    imagecopymerge($_photoname, $img2, 0, 0, 0, 0, $x, $y, 100);
    imagecolortransparent($_photoname, $bg);
 } /* Делаем из квадратной авы круглую */

 CubeAvaToCircle($img_1);
 CubeAvaToCircle($img_2);

$img = imagecreatefromjpeg($image_path); // создаём новое изображение из файла

$font = "../fonts/13343.otf"; // путь к шрифту
$font_size = 17; // размер шрифта общий
$font_size2 = 17; // размер шрифта 5 элемента
// $font_size2 = (mb_strlen($text2,'UTF-8') > 24) ? 12 : 15; // размер шрифта 5 элемента
$color = imageColorAllocate($img, 255, 255, 255); //Цвет шрифта

function SetFontHeight($_txt) {
    if (mb_strlen($_txt,'UTF-8') >= 0 && mb_strlen($_txt,'UTF-8') < 15) {return 25;}
    else if (mb_strlen($_txt,'UTF-8') >= 15 && mb_strlen($_txt,'UTF-8') < 20) {return 23;}
    else if (mb_strlen($_txt,'UTF-8') >= 20 && mb_strlen($_txt,'UTF-8') < 25) {return 19;}
    else {return 17;}
} /* Задаем размер шрифта для имен */

imagecopy($img, $img_1, 233, 88, 0, 0, imagesx($img_1), imagesy($img_1)); // наложение аватара нового участника
imagecopy($img, $img_2, 233, 247, 0, 0, imagesx($img_2), imagesy($img_2)); // наложение имеющего прем

//Разметка самого текста и его позиционирование
imagettftext($img, SetFontHeight($new_user_name), 0, 415, 130, $color, $font, $new_user_name);
imagettftext($img, SetFontHeight($prem_name), 0, 415, 317, $color, $font, $prem_name);
imagettftext($img, SetFontHeight($info), 0, 920, 200, $color, $font, $info);
imagettftext($img, SetFontHeight($time), 0, 997, 369, $color, $font, $time);

function imageresize($outfile,$infile,$neww,$newh,$quality) {

    $im=imagecreatefromjpeg($infile);
    $im1=imagecreatetruecolor($neww,$newh);
    imagecopyresampled($im1,$im,0,0,0,0,$neww,$newh,imagesx($im),imagesy($im));

    imagejpeg($im1,$outfile,$quality);
    imagedestroy($im);
    imagedestroy($im1);
    }

header("Content-type: image/jpeg");
$filename = "images/release/o_mb_r.jpg";
imagejpeg($img, $filename, 100); // сохранение файла на сервер
imageresize($filename, $filename, 795, 200, 100);
// imagejpeg($img, null, 100); // вывод изображения в браузер
#imagedestroy($img);

// return;

/* Включать только когда будет готова картинка */

$params = array('group_id' => '166188343',
            'access_token' => $GLOBALS["bot_token"], 
                      'v' => '5.87');
$params = http_build_query($params);
$query  = file_get_contents('https://api.vk.com/method/photos.getOwnerCoverPhotoUploadServer?'.$params);
$result = json_decode($query, true);
// Получение сервера для загрузки обложки группы

$url = $result["response"]["upload_url"];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
$file = new CURLFile(realpath($filename));
$post_data = array("photo" => $file);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
$_server = json_decode(curl_exec($ch), true);
// Отправка фотки на сервер

$params = array('hash' => $_server["hash"],
                'photo' => $_server["photo"],
            'access_token' => $GLOBALS["bot_token"], 
                      'v' => '5.87');
$params = http_build_query($params);
$query  = file_get_contents('https://api.vk.com/method/photos.saveOwnerCoverPhoto?'.$params);
$result = json_decode($query, true);
// Сохранение

// echo "<pre>"; print_r($result); echo "</pre>";

?>