<?php

// ini_set('error_reporting', E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
set_time_limit(90);

$GLOBALS["bot_token"] = '#GROUP_PAGE_TOKEN#';
$service_key = "MY_SERVICE_TOKEN";
date_default_timezone_set("Europe/Moscow"); 

function imageresize($outfile,$infile,$neww,$newh,$quality) {

    $im=imagecreatefromjpeg($infile);
    $im1=imagecreatetruecolor($neww,$newh);
    imagecopyresampled($im1,$im,0,0,0,0,$neww,$newh,imagesx($im),imagesy($im));

    imagejpeg($im1,$outfile,$quality);
    imagedestroy($im);
    imagedestroy($im1);
} // Функция для изменения размера фото

$image_path  = "images/bg/o_fztt.jpg"; // Путь к background

# ---------------------Получение информаиции от ВК АПИ-------------------------------
$params2 = array('group_id' => "157972140", 'sort' => 'time_desc', 'count' => "2", "fields" => "first_name,last_name,id,photo_100", 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
$params2 = http_build_query($params2);
$query   = file_get_contents('https://api.vk.com/method/groups.getMembers?'.$params2);
$result  = json_decode($query, true);

if ($result["response"]["items"][0]["id"] == "380024203") {
    $newuser_first_name  = $result["response"]["items"][1]["first_name"];
    $newuser_last_name  = $result["response"]["items"][1]["last_name"];
    $newuser_photo_max  = $result["response"]["items"][1]["photo_100"];
} else {
    $newuser_first_name  = $result["response"]["items"][0]["first_name"];
    $newuser_last_name  = $result["response"]["items"][0]["last_name"];
    $newuser_photo_max  = $result["response"]["items"][0]["photo_100"];
}
/* Определение данных нового участника */

$params = array('owner_id' => "-157972140", 'offset' => '0', 'count' => '20', 'filter' => 'all', 'extended' => '0', 'access_token' => $GLOBALS["service_key"], 'v' => '5.87');
$query  = file_get_contents('https://api.vk.com/method/wall.get?'.http_build_query($params));
$result = json_decode($query, true);
/* Узнаваем айдишники постов по которым считать лайки */

// echo "<pre>"; print_r($result); echo "</pre>";

$likes_list = array();

foreach ($result["response"]["items"] as $key => $value) {

    $params = array('type' => "post", 'owner_id' => '-157972140', 'item_id' => $value["id"], 'filter' => 'likes', 'friends_only' => '0', 'access_token' => $GLOBALS["service_key"], 'v' => '5.87');
    $query  = file_get_contents('https://api.vk.com/method/likes.getList?'.http_build_query($params));
    $result = json_decode($query, true);
    array_push($likes_list, $result["response"]["items"]);
    usleep(500000);  
} 
/* Перебор каждого поста на лайки -> добавляем айдишники тех кто поставил лайк в массив */

// echo "<pre>"; print_r($likes_list); echo "</pre>";

$users_list = array();

foreach ($likes_list as $key => $value) {

    foreach ($value as $key1 => $value1) {

        if (!isset($value1)) { continue; }
        if ($value1 == "380024203") { continue; }
        if (!isset($users_list[$value1])) { $users_list[$value1] = 1; }
        else { $users_list[$value1] += 1; }
    }
}
/* Перебор списка лайкнувших -> добавляем каждому айдишнику счетчик лайков */

// echo "<pre>"; print_r($users_list); echo "</pre>";

$top_likes_int = max($users_list); // Максимальное число лайков у пользователя/лей
$top_likers = array();

foreach ($users_list as $key => $value) {

    if ($value == $top_likes_int) { array_push($top_likers, $key); }
}
/* Добавление в новый массив людей с наибольшим кол-вом лайков */

// echo "<pre>"; print_r($top_likers); echo "</pre>";

$top_liker = $top_likers[random_int(0, count($top_likers)-1)]; // Берем рандомного топ-лайкера из списка топ-лайкеров
// echo "<pre>"; print_r($top_liker); echo "</pre>";

$params = array('user_ids' => $top_liker, 'fields' => 'first_name,last_name,id,photo_100', 'lang' => 'ru', 'access_token' => $GLOBALS["service_key"], 'v' => '5.87');
$query  = file_get_contents('https://api.vk.com/method/users.get?'.http_build_query($params));
$result = json_decode($query, true);
/* Определение данных топ-лайкера */

    $topliker_first_name = $result["response"][0]["first_name"];
    $topliker_last_name  = $result["response"][0]["last_name"];
    $topliker_photo_max  = $result["response"][0]["photo_100"];

// echo "<pre>"; print_r($result); echo "</pre>";

/* --------------------------------------------------------------------- */

$params = array('group_id' => "157972140", 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
$query  = file_get_contents('https://api.vk.com/method/groups.getLongPollServer?'.http_build_query($params));
$result = json_decode($query, true);

// echo "<pre>"; print_r($result); echo "</pre>";
$new_ts = $result["response"]["ts"];

$params = array('act'  => 'a_check',
                'key'  => $result["response"]["key"], 
                'ts'  => file_get_contents("txt/fz_new_ts.txt"), 
                'wait' => '10');
$query  = file_get_contents($result["response"]["server"]."?".http_build_query($params));
$result = json_decode($query, true);

// echo "<pre>"; print_r($result); echo "</pre>";

$events_list = array();

foreach ($result["updates"] as $key => $value) {

    if (strripos($value["type"], "wall_reply_new") !== FALSE) {
        if ($value["object"]["from_id"] == "-157972140") continue; 
        array_push($events_list, $value["object"]["from_id"]); }
}

// echo "<pre>"; print_r($events_list); echo "</pre>";

$comments_id_list = json_decode(file_get_contents("json/top_commenters.json"), true);

    if (date('N') == 1 && date('G') == 0 && date('i') == 00) {
        $comments_id_list = array("245855787" => 0);
    } // Каждый понедельник в 00:00 очистка списка TOP-комментаторов группы

foreach ($events_list as $key => $value) {

        if (!isset($comments_id_list[$value])) { $comments_id_list[$value] = 1; }
        else { $comments_id_list[$value] += 1; }
}
/* Перебор списка комментаторов -> добавляем каждому айдишнику счетчик комментов */

foreach ($result["updates"] as $key => $value) {

    if (strripos($value["type"], "wall_reply_delete") !== FALSE) {
        if ($value["object"]["deleter_id"] == "-157972140" || $value["object"]["from_id"] == "380024203") continue; 
        if (!isset($comments_id_list[$value["object"]["deleter_id"]])) continue;
        $comments_id_list[$value["object"]["deleter_id"]] = $comments_id_list[$value["object"]["deleter_id"]] - 1;
    }
}
/* Система анти-накрутка. Перепроверят данные, и в случае если участник удалил комментарий -> отнимает значение от его четчика. */

// echo "<pre>"; print_r($comments_id_list); echo "</pre>";

$top_comment_int = max($comments_id_list); // Максимальное число комментов у пользователя/лей
$top_comment     = array();

foreach ($comments_id_list as $key => $value) {

    if ($value == $top_comment_int) { array_push($top_comment, $key); }
}
/* Добавление в новый массив людей с наибольшим кол-вом лайков */

// echo "<pre>"; print_r($top_comment); echo "</pre>";

$top_comm = $top_comment[random_int(0, count($top_comment)-1)]; // Берем рандомного топ-комментатор из списка

// echo "<pre>"; print_r($top_comm); echo "</pre>";

file_put_contents("json/top_commenters.json", json_encode($comments_id_list));
file_put_contents("txt/fz_new_ts.txt", $new_ts);

$params = array('user_ids' => $top_comm, 'fields' => 'first_name,last_name,id,photo_100', 'lang' => 'ru', 'access_token' => $GLOBALS["service_key"], 'v' => '5.87');
$query  = file_get_contents('https://api.vk.com/method/users.get?'.http_build_query($params));
$result = json_decode($query, true);
/* Определение данных топ-лайкера */

    $topcommenters_first_name = $result["response"][0]["first_name"];
    $topcommenters_last_name  = $result["response"][0]["last_name"];
    $topcommenters_photo_max  = $result["response"][0]["photo_100"];

// echo "<pre>"; print_r($result); echo "</pre>";

# -----------------------------------------------------------------------------------

$newuser_name  = $newuser_first_name." ".$newuser_last_name;
// Имя нового участника
$topliker_name = $topliker_first_name." ".$topliker_last_name;
// Имя топ лайкера
$topcommenters_name = $topcommenters_first_name." ".$topcommenters_last_name;
// Имя топ комментатора

$img_1 = imagecreatefromjpeg($newuser_photo_max);
#Берем аву юзверя и создаем ее
$img_2 = imagecreatefromjpeg($topliker_photo_max);
#Берем аву юзверя и создаем ее
// if ($topcommenters_photo_max != null || $topcommenters_photo_max != '')
$img_3 = imagecreatefromjpeg($topcommenters_photo_max);
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
//  if ($topcommenters_photo_max != null || $topcommenters_photo_max != '')
 CubeAvaToCircle($img_3);

$img  = imagecreatefromjpeg($image_path); // создаём фон

$font = "../fonts/13343.otf"; // путь к шрифту

function SetFontHeight($_txt) {
    if (mb_strlen($_txt,'UTF-8') >= 0 && mb_strlen($_txt,'UTF-8') < 15) {return 25;}
    else if (mb_strlen($_txt,'UTF-8') >= 15 && mb_strlen($_txt,'UTF-8') < 20) {return 23;}
    else if (mb_strlen($_txt,'UTF-8') >= 20 && mb_strlen($_txt,'UTF-8') < 25) {return 19;}
    else {return 17;}
} /* Задаем размер шрифта для имен */

$color = imageColorAllocate($img, 255, 255, 255); //Цвет шрифта

date_default_timezone_set("Europe/Kiev");
$t_ua = date("d.m.y | H:i");
date_default_timezone_set("Europe/Moscow");
$t_ru = date("d.m.y | H:i");
date_default_timezone_set("America/New_York");
$t_usa = date("d.m.y | H:i");

// if (!isset($topcommenters_name) || $topcommenters_name == null || $topcommenters_name == "" || $topcommenters_name == " ") { $topcommenters_name = "Место свободно"; }

imagecopy($img, $img_1, 834, 279, 0, 0, imagesx($img_1), imagesy($img_1)); // наложение аватара нового участника
imagecopy($img, $img_2, 834, 26, 0, 0, imagesx($img_2), imagesy($img_2)); // наложение аватара топ лайкера
if ($topcommenters_photo_max != null || $topcommenters_photo_max != '')
imagecopy($img, $img_3, 834, 154, 0, 0, imagesx($img_3), imagesy($img_3)); // наложение аватара топ комментатора

//Разметка самого текста и его позиционирование
imagettftext($img, SetFontHeight($newuser_name), 0, 1010, 360, $color, $font, $newuser_name);
imagettftext($img, SetFontHeight($topliker_name), 0, 1010, 109, $color, $font, $topliker_name);
imagettftext($img, SetFontHeight($topcommenters_name), 0, 1010, 233, $color, $font, $topcommenters_name); 
imagettftext($img, 16, 0, 236, 367, $color, $font, $t_ua);
imagettftext($img, 16, 0, 603, 366, $color, $font, $t_ru);
imagettftext($img, 16, 0, 419, 301, $color, $font, $t_usa);

header("Content-type: image/jpeg");
$filename = "images/release/o_fztt_r.jpg";
imagejpeg($img, $filename, 100); // сохранение файла на сервер
imageresize($filename, $filename, 795, 200, 100);
// imagejpeg($img, null, 100); // вывод изображения в браузер
// imagedestroy($img);
//  return;

/* Включать только когда будет готова картинка */

$params = array('group_id' => '157972140',
            'access_token' => $GLOBALS["bot_token"], 
                      'v' => '5.87');
$params = http_build_query($params);
$query  = file_get_contents('https://api.vk.com/method/photos.getOwnerCoverPhotoUploadServer?'.$params);
$result = json_decode($query, true);
// Получение сервера для загрузки обложки группы

// echo "<pre>"; print_r($result); echo "</pre>";

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

// echo "<pre>"; print_r($_server); echo "</pre>";

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