<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

/* ███╗   ███╗███████╗ ██████╗  █████╗     ██████╗  ██████╗ ████████╗
   ████╗ ████║██╔════╝██╔════╝ ██╔══██╗    ██╔══██╗██╔═══██╗╚══██╔══╝
   ██╔████╔██║█████╗  ██║  ███╗███████║    ██████╔╝██║   ██║   ██║   
   ██║╚██╔╝██║██╔══╝  ██║   ██║██╔══██║    ██╔══██╗██║   ██║   ██║   
   ██║ ╚═╝ ██║███████╗╚██████╔╝██║  ██║    ██████╔╝╚██████╔╝   ██║   
   ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝    ╚═════╝  ╚═════╝    ╚═╝   */ 

$GLOBALS["_bot"]      = '#PAGE_TOKEN#'; // page token
$GLOBALS["bot_token"] = '#GROUP_TOKEN#'; // group token

function SetStatus() { 

    $stats = json_decode(file_get_contents("json/stats.json"), true);
    
    date_default_timezone_set("Europe/Moscow"); 

    $result2 = "📅 ".date("d.m.Y")." | ⌚ ".date("H:i")." | 📥: ".$stats['taken']." | 📤: ".$stats['sent'];
    $params3 = array('text' => $result2, 'group_id' => "166188343", 'access_token' => $GLOBALS["_bot"], 'v' => '5.87');
    $params3 = http_build_query($params3);
    $query2 = file_get_contents('https://api.vk.com/method/status.set?'.$params3);
    
 } /* Обновляем статус */
        
 function SetOnline() { 
            
    $params = array('access_token' => $GLOBALS["_bot"], 'v' => '5.87');
        
        $params = http_build_query($params);
        $query = file_get_contents('https://api.vk.com/method/account.setOnline?'.$params);

 } /* Обновляем онлайн с ПК */

 /* sms */

 function SetBbool($_id) {

    if ($_id > 1999999999) { $bb_answer["type_id"] = "chat_id"; $bb_answer["id"] = $_id - 2000000000; }
    else { $bb_answer["type_id"] = "user_id"; $bb_answer["id"] = $_id; }

    return $bb_answer;

 } /* Установить значение $bbool + user_id || chat_id */

function SendMessage($_id, $_text, $_att_type = null, $_att = array(null, null)) {

$params = array('message'          => $_text,
                /* $uID               => $_id, */
                SetBbool($_id)["type_id"] => SetBbool($_id)["id"],
                'group_id'         => '166188343',
                'random_id'        => "0",
                'access_token'     => $GLOBALS["bot_token"],
                'v'                => '5.87');
    if ($_att_type == "photo") { $params["attachment"] = "photo".$_att[0]."_".$_att[1]; }
    echo "<pre>"; print_r($params); echo "</pre>";
$params = http_build_query($params);

$msgs = json_decode(file_get_contents("json/msgs.json"), true);
array_push($msgs["messages"], $params);
file_put_contents("json/msgs.json", json_encode($msgs));

} /* Отправка добавление сообщения в очередь на отправку */

function Send() {
    
    $msgs    = json_decode(file_get_contents("json/msgs.json"), true);

    if (count($msgs["messages"]) <= 0) return;
    $_params = current($msgs["messages"]);
    
    array_shift($msgs["messages"]);
    
    file_put_contents("json/msgs.json", json_encode($msgs));
    
    $total_answers = json_decode(file_get_contents("json/stats.json"), true);
    $total_answers['sent'] = $total_answers['sent'] + 1;
    file_put_contents("json/stats.json", json_encode($total_answers));

    $query  = file_get_contents('https://api.vk.com/method/messages.send?'.$_params);
    $result = json_decode($query, true);
    
    echo "<pre>"; print_r($result); echo "</pre>";
    
    } /* Отправка сообщения */

    function Logger($_msg) { //остановился <-- ТУТ
    
        $params = array('message'      => $_msg,
                        'chat_id'      => '1',
                        'group_id'     => '166188343',
                        'access_token' => $GLOBALS["bot_token"],
                        'v'            => '5.87');
        $params = http_build_query($params);
        file_get_contents('https://api.vk.com/method/messages.send?'.$params);
    
    } /* Отправка лога от лица группы */

 /* sms */

function Ban($_id, $_reason, $_comment) {

    $params = array('owner_id'     => $_id,
                    'group_id'     => '166188343',
                    'reason'       => $_reason,
                    'comment'      => "[".date("d.m.Y")." | ".date("H:i")."]".$_comment,
                    'comment_visible' => '1',
                    'access_token' => $GLOBALS["_bot"],
                    'v'            => '5.87');
    $params = http_build_query($params);
    $query  = file_get_contents('https://api.vk.com/method/groups.ban?'.$params);

} /* Занесение в черный список */

function UnBan($_id) {

    $params = array('owner_id' => $_id, 'group_id' => '166188343', 'access_token' => $GLOBALS["_bot"], 'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/groups.unban?'.$params);
    
} /* Убрать из черного списка */

function Banned($_id) {

    $params = array('user_id' => $_id,
                    'group_id' => '166188343',
                    'access_token' => $GLOBALS["bot_token"],
                    'v' => '5.87');
    $params = http_build_query($params);
    $query  = file_get_contents('https://api.vk.com/method/groups.isMember?'.$params);
    $result = json_decode($query, true);

    if ($result["response"] == 0) return true;
    
} /* Если пользователь не состоит в группе, то оменяем обработку сообщения */

function addFriend($_id) {
    
    $params = array('user_id' => $_id, 'access_token' => $GLOBALS["_bot"], 'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/friends.add?'.$params);
} /* Добавление в друзья */

function deleteFriend($_id) {
    
    $params = array('user_id' => $_id, 'access_token' => $GLOBALS["_bot"], 'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/friends.delete?'.$params);
} /* Отклонение заявок в друзья */ 

function checkRequestAdd() {

    $params = array('need_viewed' => "1",
                   'access_token' => $GLOBALS["_bot"],
                              'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/friends.getRequests?'.$params);
    $result = json_decode($query, true);

    if (!isset($result["response"]["items"])) return;

    foreach ($result["response"]["items"] as $index => $elem) {

        $_newID = $result["response"]["items"][$index];

        addFriend($_newID);
    }
} /* Принимаем все новые заявки в друзья */

function checkRequestDeleted() {
    
    $params = array('need_viewed' => "1", "out" => "1", 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/friends.getRequests?'.$params);
    $result = json_decode($query, true);

    if (!isset($result["response"]["items"])) return;

    foreach ($result["response"]["items"] as $index => $elem) {

        $_newID = $result["response"]["items"][$index];
        deleteFriend($_newID);
    }

} /* Баним всех кто удалил бота из друзей */

function GetUserId($_id) {

    $params = array('screen_name' => $_id, 'access_token' => $GLOBALS["_bot"], 'v' => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/utils.resolveScreenName?'.$params);
    $result = json_decode($query, true);

    if (isset($result["response"]["type"]))      $GLOBALS["id_as_screen_name"]["type"]      = $result["response"]["type"];
    if (isset($result["response"]["object_id"])) $GLOBALS["id_as_screen_name"]["object_id"] = $result["response"]["object_id"];

} /* Получаем объект по domain -> User/Group && id */

function LongPollServer() { 

    $params = array('group_id' => '166188343', 'access_token' => $GLOBALS["bot_token"], 'v' => '5.87');
    $params = http_build_query($params);    
    $query = file_get_contents('https://api.vk.com/method/groups.getLongPollServer?'.$params);
    $result = json_decode($query, true);
    
    $GLOBALS["key"]    = $result['response']['key'];
    $GLOBALS["server"] = $result['response']['server'];
    $GLOBALS["ts"]     = file_get_contents("txt/ts_bot.txt");
    $GLOBALS["new_ts"] = $result['response']['ts'];

    echo "TS: ".$GLOBALS["ts"]."<br/>"."Server: ".$GLOBALS["server"]."<br/>"."Key: ".$GLOBALS["key"]."<br/>"."<br/>";
    
} /* Запрос на сервер */

function LongPollHistory() { 

    $params = array('key' => $GLOBALS["key"],
                    'ts'  => $GLOBALS["ts"],
                    'act' => "a_check");
    $query = file_get_contents($GLOBALS["server"]."?".http_build_query($params));
    $result = json_decode($query, true);
    print_r($query);
    $GLOBALS["msg_treatment"] = $result["updates"];

} /*Отправка на сервер*/

function GetUserInfo($_id) {

    $params = array('user_ids'     => $_id,
                    'access_token' => $GLOBALS["bot_token"],
                    'fields'       => 'first_name,last_name,id,city,bdate,counters,domain,followers_count,photo_id,is_friend',
                    'v'            => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/users.get?'.$params);
    $result = json_decode($query, true);

    $GLOBALS["uInfo"]["id"] = $result["response"][0]["id"];
    $GLOBALS["uInfo"]["domain"] = $result["response"][0]["domain"];
    $GLOBALS["uInfo"]["first_name"] = $result["response"][0]["first_name"];
    $GLOBALS["uInfo"]["last_name"] = $result["response"][0]["last_name"];
    
    if (isset($result["response"][0]["followers_count"])) $GLOBALS["uInfo"]["followers_count"] = $result["response"][0]["followers_count"];
    if (isset($result["response"][0]["bdate"])) $GLOBALS["uInfo"]["bdate"]                     = $result["response"][0]["bdate"];
    if (isset($result["response"][0]["city"])) $GLOBALS["uInfo"]["city"]                       = $result["response"][0]["city"]["title"];
    if (isset($result["response"][0]["home_town"])) $GLOBALS["uInfo"]["home_town"]             = $result["response"][0]["home_town"];
    if (isset($result["response"][0]["country"])) $GLOBALS["uInfo"]["country"]                 = $result["response"][0]["country"]["title"];
    if (isset($result["response"][0]["photo_id"])) $GLOBALS["uInfo"]["photo_id"]               = $result["response"][0]["photo_id"];

    if (isset($result["response"][0]["counters"]["albums"])) $GLOBALS["uInfo"]["albums"]                 = $result["response"][0]["counters"]["albums"];
    if (isset($result["response"][0]["counters"]["videos"])) $GLOBALS["uInfo"]["videos"]                 = $result["response"][0]["counters"]["videos"];
    if (isset($result["response"][0]["counters"]["audios"])) $GLOBALS["uInfo"]["audios"]                 = $result["response"][0]["counters"]["audios"];
    if (isset($result["response"][0]["counters"]["photos"])) $GLOBALS["uInfo"]["photos"]                 = $result["response"][0]["counters"]["photos"];
    if (isset($result["response"][0]["counters"]["friends"])) $GLOBALS["uInfo"]["friends"]               = $result["response"][0]["counters"]["friends"];
    if (isset($result["response"][0]["counters"]["groups"])) $GLOBALS["uInfo"]["groups"]                 = $result["response"][0]["counters"]["groups"];
    if (isset($result["response"][0]["counters"]["online_friends"])) $GLOBALS["uInfo"]["online_friends"] = $result["response"][0]["counters"]["online_friends"];
    if (isset($result["response"][0]["counters"]["mutual_friends"])) $GLOBALS["uInfo"]["mutual_friends"] = $result["response"][0]["counters"]["mutual_friends"];
    if (isset($result["response"][0]["counters"]["pages"])) $GLOBALS["uInfo"]["pages"]                   = $result["response"][0]["counters"]["pages"];
    
} /* Получение информации о пользователе */

function CheckNoRepeats() {

    $repeats = file_get_contents("json/repeats.json");
    $repeats = json_decode($repeats, true);

    if (count($repeats) == 0) return;

    foreach ($repeats as $index => $elem) {

    if (time() > $repeats[$index]["last_msg"]) unset($repeats[$index]);

    }

    file_put_contents("json/repeats.json", json_encode($repeats));

} /* Если повторение было больше двух минут назад, то удаляем юзверя из этого списка */

function ClearBlockTxt() {

    $ssCheck = file_get_contents("json/safety_system.json");
    $ssCheck = json_decode($ssCheck, true);

    if (count($ssCheck) == 0) return;

    foreach ($ssCheck as $index => $elem) {

    unset($ssCheck[$index]);

    }

    file_put_contents("json/safety_system.json", json_encode($ssCheck));

} /* Если запрещенных слов больше небыло */ 

function CheckFastMessages() {

    $fast = file_get_contents("json/fast_msgs.json");
    $fast = json_decode($fast, true);

    if (count($fast) == 0) return;

    foreach ($fast as $index => $elem) {

    if (time() > $fast[$index]["time"]+(30)) unset($fast[$index]);

    }

    file_put_contents("json/fast_msgs.json", json_encode($fast));

} /* Если пользователь отправляет слишком много сообщений в 10 секунд */

function gtranslate($str, $lang_from, $lang_to) {
    $query_data = array(
      'client' => 'x',
      'q' => $str,
      'sl' => $lang_from,
      'tl' => $lang_to
    );
    $filename = 'http://translate.google.ru/translate_a/t';
    $options = array(
      'http' => array(
        'user_agent' => 'Mozilla/5.0 (Windows NT 6.0; rv:26.0) Gecko/20100101 Firefox/26.0',
        'method' => 'POST',
        'header' => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query($query_data)
      )
    );
    $context = stream_context_create($options);
    $response = file_get_contents($filename, false, $context);
    return json_decode($response);
  } /* Переводчик гугль */

  function ABSvk($_str) {

    $shit_detected = false;

    $_str = mb_ereg_replace(" \t\n\r\0\x0B", "", $_str);
    $_str = str_replace(' ', '', $_str);
    $_str = str_replace('_', '', $_str);
    $_str = str_replace('-', '', $_str);
    $_str = str_replace(',', '', $_str);
    $_str = preg_replace('/\d+/u', '', $_str);
    
    switch(true) {
        case strpos($_str, "http") !== FALSE:
        case strpos($_str, "www") !== FALSE:
        case strpos($_str, ".co") !== FALSE:
        case strpos($_str, ".ua") !== FALSE:
        case strpos($_str, ".ru") !== FALSE:
        case strpos($_str, ".ру") !== FALSE:
        case strpos($_str, ".рф") !== FALSE:
        case strpos($_str, ".pe") !== FALSE:
        case strpos($_str, ".ре") !== FALSE:
        case strpos($_str, ".рe") !== FALSE:
        case strpos($_str, ".pе") !== FALSE:
        case strpos($_str, ".net") !== FALSE:
        case strpos($_str, ".io") !== FALSE:
        case strpos($_str, ".me") !== FALSE:
        case strpos($_str, ".de") !== FALSE:
        case strpos($_str, ".org") !== FALSE:
        case strpos($_str, ".in") !== FALSE:
        case strpos($_str, ".tv") !== FALSE:
        case strpos($_str, ".br") !== FALSE:
        case strpos($_str, ".ly") !== FALSE:
        case strpos($_str, ".cn") !== FALSE:
        case strpos($_str, ".it") !== FALSE:
        case strpos($_str, ".uk") !== FALSE:
        case strpos($_str, ".us") !== FALSE:
        case strpos($_str, ".pro") !== FALSE:
        case strpos($_str, ".gg") !== FALSE:
        case strpos($_str, ".om") !== FALSE:
        case strpos($_str, ".su") !== FALSE:
        case strpos($_str, ".info") !== FALSE:
        case strpos($_str, ".biz") !== FALSE:
        case strpos($_str, ".xyz") !== FALSE:
        case strpos($_str, ".top") !== FALSE:
        case strpos($_str, ".app") !== FALSE:
        case strpos($_str, ".edu") !== FALSE:
        case strpos($_str, ".mobi") !== FALSE:
        case strpos($_str, ".on") !== FALSE:
        case strpos($_str, ".xx") !== FALSE:
        case strpos($_str, ".zone") !== FALSE:
        case strpos($_str, ".ком") !== FALSE:
        case strpos($_str, ".ио") !== FALSE:
        case strpos($_str, ".юа") !== FALSE:
        case strpos($_str, "vkrobot") !== FALSE:
        case strpos($_str, "vto") !== FALSE:
        case strpos($_str, "mix") !== FALSE:
        case strpos($_str, "/") !== FALSE: $shit_detected = true;
        break;
      } /* find shit */

    if ($shit_detected) { 
        
        $ss     = json_decode(file_get_contents("json/safety_system.json"), true);
        $ss_id  = $GLOBALS["c_id"];
        $ss_txt = "📛Внимание! Всем лежать, руки за-головУ! Работает БАБУ-НАБУ, пху ты.. СБУ!📛\n⚠[ЗАМЕЧЕН ЗАПРЕЩЕННЫЙ ТЕКСТ]⚠\n\nУважаемый [id$ss_id|Юзверь] -> если Вы не прекратите использовать ссылки на сторонние ресурсы в сообщениях - Вы будете забанены!🚫\n\nПредупреждений осталось: ";

        if (!isset($ss[$ss_id])) { $ss[$ss_id] = 3; SendMessage($GLOBALS["c_bid"], $ss_txt.$ss[$ss_id]); } 
        else if ($ss[$ss_id] != 0) { $ss[$ss_id] = $ss[$ss_id] - 1; SendMessage($GLOBALS["c_bid"], $ss_txt.$ss[$ss_id]); }
        else if ($ss[$ss_id] == 0) { 
            unset($ss[$ss_id]); 
            SendMessage($GLOBALS["c_bid"], "⛔ Бан БЛЯТЬ! (c) Hard Play");
            SendMessage(2000000001, "📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[BAN] [id".$_id."| Юзверь] забнен.");
            Ban($ss_id, 4, "Запрет.текст в смс: $str");
        }

        file_put_contents("json/safety_system.json", json_encode($ss));

        return true;
     } else return false;

    } /* Anti Block System */

    /* function Stats() */
    function Stats($_cmd_name) { if ($GLOBALS["c_id"] == "245855787") return;

        $stats = json_decode(file_get_contents("json/stats.json"), true);

        $stats["{$_cmd_name}"] = $stats["{$_cmd_name}"] + 1;

        file_put_contents("json/stats.json", json_encode($stats));

    } /* Обновление счетчиков статистики для команд */

    function CreateImage($_id, $_text, $_type, $_bg = null) {

        $params = array('user_ids'     => $_id,
                        'access_token' => $GLOBALS["bot_token"],
                        'fields'       => 'first_name,last_name,photo_max',
                        'v'            => '5.87');
        $params = http_build_query($params);
        $query = file_get_contents('https://api.vk.com/method/users.get?'.$params);
        $result = json_decode($query, true);

        $ava      = $result["response"][0]["photo_max"];
        $username = $result["response"][0]["first_name"]." ".$result["response"][0]["last_name"];

        $myDomainPath = "http://my-site.com/";

        $params2 = array('type'     => $_type,
                         'ava'      => $ava,
                         'username' => $username,
                         'text'     => $_text,
                         'heroku'   => "test");
        $params2 = http_build_query($params2);
        $query2 = file_get_contents($myDomainPath.'megabot/cmd.php?'.$params2);
        // $query2 = explode("\n", $query2);
        // $_p = $myDomainPath."megabot/".$query2;
        $_p = $query2;

        return $_p;
    
    } /* Создание фотографий с текстом и т.д. */

    function ClearImages($_arrDir = array()) {
        foreach ($_arrDir as $dir) {
        $files = glob("images/".$dir."/*");
        $c = count($files);
        if ($c == 0) continue;
        if (count($files) > 0) {
            foreach ($files as $file) {      
                if (file_exists($file)) {
                unlink($file);
                }   
            }
         }
       }
     } /* Удаление всех фотографий из папки */

    function GetPhoto($_photo_file_name, $_peer_id) {

        $params = array('peer_id'      => $_peer_id, 
                        'access_token' => $GLOBALS["bot_token"], 
                        'v'            => '5.87');
        $params = http_build_query($params);
        $query  = file_get_contents('https://api.vk.com/method/photos.getMessagesUploadServer?'.$params);
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
        $file = new CURLFile(realpath($_photo_file_name));
        $post_data = array("photo" => $file);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        $_server = json_decode(curl_exec($ch), true);
        // Отправка фотки на сервер

        // echo "<pre>"; print_r($_server); echo "</pre>";

        $params = array('server'       => $_server["server"],
                        'hash'         => $_server["hash"],
                        'photo'        => $_server["photo"],
                        'access_token' => $GLOBALS["bot_token"], 
                        'v'            => '5.87');
        $params = http_build_query($params);
        $query  = file_get_contents('https://api.vk.com/method/photos.saveMessagesPhoto?'.$params);
        $result = json_decode($query, true);
        // Сохранение

        // echo "<pre>"; print_r($result); echo "</pre>";

        $_gphoto = [$result["response"][0]["owner_id"], $result["response"][0]["id"]];

        return $_gphoto;

    } /* Получаем адрес созданной фотографии и загружаем на сервер ВК */

    function CheckPremium($_id) {

        $prem = json_decode(file_get_contents("json/premium_list.json"), true);
        if (array_key_exists($_id, $prem) != 1) return false;
        else return true;
    
    } /* Проверка на наличие премиум статуса у юзверя */

    function SetPremium($_id, $_status, $_month) {

        $prem = json_decode(file_get_contents("json/premium_list.json"), true);

        if ($_status == "set") { 
            $date = date('d.m.Y', strtotime("+".$_month." month", time())); 
            $prem[$_id]["date"]   = $date;
            $prem[$_id]["accost"] = "мега";
            $prem[$_id]["mbshow"] = true;
            Logger("📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[PREMIUM] Установлен для [id".$_id."| пользователя] до {$date}");
            SendMessage($_id, "📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[PREMIUM] Установлен для [id".$_id."| Вас] до {$date}");
        } else if ($_status == "unset")  {
             unset($prem[$_id]); 
             Logger("📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[PREMIUM] У [id".$_id."| пользователя] закончился.");
             SendMessage($_id, "📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[PREMIUM] Закончился. Спасибо за приобретение и использование данной функции. Этим Вы сильно помогли проекту. Если будет еще желание приобрести Premium-Status - не стесняйтесь, пишите.");
        }

        file_put_contents("json/premium_list.json", json_encode($prem));
        return "📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[PREMIUM] Установлен для [id".$_id."| Вас] до {$date}";

     } /* Добавление || Удаление Premium статуса */

     function CheckPremiumDate() {
        $prem = json_decode(file_get_contents("json/premium_list.json"), true);
        foreach ($prem as $key => $value) {

            if (strtotime($prem[$key]["date"]) <= time()) {
                SetPremium($key, "unset", "");
            }
        }
    } /* Проверка истечения срока премиума */


function MessageTreatment() {

        foreach ($GLOBALS["msg_treatment"] as $index => $elem) {

            if ($GLOBALS["msg_treatment"][$index]["type"] != "message_new") continue;

        $str = mb_strtolower($GLOBALS["msg_treatment"][$index]["object"]["text"]);    
        
        $uId  = $GLOBALS["msg_treatment"][$index]["object"]["from_id"];
        $GLOBALS["c_id"] = $uId;
        if (Banned($uId) == true) continue;

        $total_answers = json_decode(file_get_contents("json/stats.json"), true);
        $total_answers['taken'] = $total_answers['taken'] + 1;
        file_put_contents("json/stats.json", json_encode($total_answers));

        /* if (strpos($str, "бот,") !== 0) continue; */
        $prem = json_decode(file_get_contents("json/premium_list.json"), true);
        if (CheckPremium($uId) == true) { if (strpos($str, $prem[$uId]["accost"]) !== 0) continue; }
        else if (strpos($str, "мега") !== 0) continue; 
        if (mb_strlen($str, 'UTF-8') > 700) continue;

        $bId  = $GLOBALS["msg_treatment"][$index]["object"]["peer_id"];
        $GLOBALS["c_bid"] = $bId;

        $user_id = $bId;

        $fast = file_get_contents("json/fast_msgs.json");
        $fast = json_decode($fast, true);
        if (isset($fast[$uId]) && time() > $fast[$uId]["time"]) { $fast[$uId]["count"] = 1; $fast[$uId]["time"] = time()+15;}
        if (!isset($fast[$uId])) { $fast[$uId]["count"] = 1; $fast[$uId]["time"] = time()+15;}
        else $fast[$uId]["count"] = $fast[$uId]["count"] + 1;
            if ($fast[$uId]["count"] > 5) { 
                continue;
            }

        file_put_contents("json/fast_msgs.json", json_encode($fast));

        if (!CheckPremium($uId)) { $str = mb_ereg_replace("мега", "", $str); }
        else { $str = mb_ereg_replace($prem[$uId]["accost"], "", $str); }
        $str = trim($str, " \t\n\r\0\x0B");
        $str = mb_ereg_replace(" \t\n\r\0\x0B", " ", $str);

        $strSplit = explode(" ", $str);

        // $msg_id = $GLOBALS["msg_treatment"][$index]["object"]["conversation_message_id"];

        $repeats = file_get_contents("json/repeats.json");
        $repeats = json_decode($repeats, true);

        if ($str == $repeats[$uId]["text"]) { 

         if ($repeats[$uId]["count"] > 3) {
             if (CheckPremium($uId)) {
                SendMessage($user_id, "Повезло тебе! Что у тебя премиум статус. Остынь немного с повторами, потом продолжим разговор.");
                SendMessage(2000000001,  "📟Bot-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n\n[id".$uId."| Пользователь] не был забанен за повторы из-за [Premium] в беседе №$user_id");
                $repeats[$uId]["count"] = 1;
                file_put_contents("json/repeats.json", json_encode($repeats));
                continue;
             } else {
                Ban($uId, 1, "Повтор смс: $str");
                unset($repeats[$uId]);
                SendMessage($user_id, "⛔ Бан БЛЯТЬ! (c) Hard Play");
                file_put_contents("json/repeats.json", json_encode($repeats));
                continue;
             }
            } else { $repeats[$uId]["count"] = $repeats[$uId]["count"] + 1;
                   $repeats[$uId]["last_msg"] = time()+(30);
                   if ($repeats[$uId]["count"] == 2) { SendMessage($user_id, "⚠ Пожалуйста не повторяйся, меня это бесит.\nБудешь много повторяться - забаню."); } }

            file_put_contents("json/repeats.json", json_encode($repeats));
            continue;
         } else {
            $repeats[$uId]["text"]     = $str;
            $repeats[$uId]["count"]    = 0;
            $repeats[$uId]["last_msg"] = time()+(30); 
            file_put_contents("json/repeats.json", json_encode($repeats));
         }

         if (!isset($repeats[$uId]["text"])) {
            $repeats[$uId]["text"]     = $str;
            $repeats[$uId]["count"]    = 0;
            $repeats[$uId]["last_msg"] = time()+(30);
            file_put_contents("json/repeats.json", json_encode($repeats));
         }

    /* Команды */

        /* Function Say() */
        if ($strSplit[0] == "скажи") { Stats("say");

            if (!isset($strSplit[1]) || $strSplit[1] == "" || $strSplit[1] == " ") { SendMessage($user_id, "⚠ Что сказать?"); continue; }

            if (ABSvk($str)) continue;

         $str = htmlspecialchars(mb_ereg_replace("скажи", "", $str), ENT_QUOTES);
         SendMessage($user_id, $str);
         continue;
        } /* Бот, скажи $str */

        /* Function Matheval() */
        if ($strSplit[0] == "посчитай" || $strSplit[0] == "пощитай" || $strSplit[0] == "математика" || $strSplit[0] == "калькулятор" || $strSplit[0] == "math" || $strSplit[0] == "сколько" && $strSplit[1] == "будет") { Stats("math");

            function matheval($equation) { 

                $equation = preg_replace("/[^0-99999999999999999999999999+\-.*\/()%]/","",$equation); 
                $equation = preg_replace("/([+-])([0-99999999999999999999999999]{1})(%)/","*(1\$1.0\$2)",$equation); 
                $equation = preg_replace("/([+-])([0-99999999999999999999999999]+)(%)/","*(1\$1.\$2)",$equation);
                $equation = preg_replace("/([0-99999999999999999999999999]+)(%)/",".\$1",$equation); 
                if ( $equation == "" ) { 
                  $return = 0; 
                } else { 
                    try { @eval("\$return=" . $equation . ";" ); } catch (Exception $e) {return "⚠ Ошибка в вычислениях. Или я тупой, или ты что-то не правильно написал/а😑";}
                } 
                return $return;  
            }
           
        $str = matheval($str);
        $answer_arr = ["Ответ: ", "У меня получилось вот столько: ", "Наверное ответ такой: ", "Изи, это будет: ", "Вот стоко: "];
        $rnd = random_int(0, 4);
        $str = $answer_arr[$rnd].$str;
        SendMessage($user_id, $str);
        continue;
         } /* Бот, посчитай (5+5)/2 */
        
        /* Function RandomNumber() */
        if ($strSplit[0] == "рандом") { Stats("random");

            if (ctype_digit($strSplit[1]) && ctype_digit($strSplit[2])) {

            $str = mb_ereg_replace("рандом", "", $str);
            $str = mb_ereg_replace(" \t\n\r\0\x0B", " ", trim(str_replace(" \t\n\r\0\x0B", "", $str), " \t\n\r\0\x0B"));
            $strSplit2 = explode(" ", $str);

            if ( (int) $strSplit2[0] > 9999999 || (int) $strSplit2[1] > 9999999 ) {
                SendMessage($user_id, "Ой! Максимальное число можно указать: 9999999");
            continue;
            }

            SendMessage($user_id, random_int($strSplit2[0], $strSplit2[1]));
            continue;
           } else if (ctype_digit($strSplit2[0]) && !ctype_digit($strSplit2[1]) || !ctype_digit($strSplit2[0]) && !ctype_digit($strSplit2[1])) {
            SendMessage($user_id, "Выпало число: ".random_int(0, 9999999)."\n\n"."⚠ Если нужно в определенном диапазоне, пиши так: \"Бот, рандом 0 100\" <- Видишь, сначала первое число, а потом второе через пробел");
            continue;
           } /* Бот, рандом 0 100 */
        }

        /* Function CountryTime() */
        if (strpos($str, "время") !== FALSE || strpos($str, "времени") !== FALSE || strpos($str, "который час") !== FALSE) { Stats("time");

            date_default_timezone_set("Europe/Kiev"); 
            $time_kiev  = "🇺🇦 Киев: ____📅 ".date("d.m.y")." | ⌚ ".date("H:i:s")."\n";
            date_default_timezone_set("Europe/Moscow"); 
            $time_msk   = "🇷🇺 Москва: _📅 ".date("d.m.y")." | ⌚ ".date("H:i:s")."\n";

            SendMessage($user_id, $time_kiev.$time_msk);
            continue;
        } /* Бот, время */

        /* Function When() */
        if ($strSplit[0] == "когда") { if (ABSvk($str)) continue; Stats("when");

            if ($strSplit == "") { SendMessage($user_id, "⚠ Что?"); continue;}

         $str = mb_ereg_replace("когда", "", $str);
         $str = str_replace("?", "", $str);
         $str = trim($str, " \t\n\r\0\x0B");
         $rnd0 =  random_int(0, 5);
         $days = 30;
         $nedils = 4;
         $month = 12;
         $years = 999;

        switch ($rnd0) {

            case 0: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "⏳ Это случится через ".random_int(1, $days)." дней.");
                    else SendMessage($user_id, "⏳ Через ".random_int(1, $days)." дней: ".$str);
            break;
            case 1: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "Наверное это произойдет через ".random_int(1, $nedils)." недели.");
                    else SendMessage($user_id, "⏳ Через ".random_int(1, $nedils)." недели: ".$str);
            break;
            case 2: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "Я не экстрасенс, но наверное это будет через ".random_int(1, $month)." месяцев.");
                    else SendMessage($user_id, "⏳ Через ".random_int(1, $month)." месяцев: ".$str);
            break;
            case 3: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "Ждать тебе еще долго.. Целых ".random_int(1, $years)." лет.");
                    else SendMessage($user_id, "⏳ Через ".random_int(1, $month)." лет: ".$str);
            break;
            case 4: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "Опа, чики брики! Событие произойдет ".random_int(1, $days).".".random_int(1, $month).".".random_int(2019, 2100));
                    else SendMessage($user_id, $str." -> через ".random_int(1, $month)." месяцев. ⏳");
            break;
            case 5: $_rnd = random_int(0, 1); if ($_rnd == 0) SendMessage($user_id, "⏳ Это событие не случится.");
                    else SendMessage($user_id, "⏳ Никогда \"".$str."\" -> этого не произойдет.");
            break;
        }

         continue;
        } /* Бот, когда $str */

        /* Function WhoI() */
        if ($strSplit[0] == "кто" && str_replace("?", "", $strSplit[1]) == "я") {  Stats("who_i");

        GetUserInfo($uId);

         $str = "📋 Информация о [id$uId|твоём] аккаунте:\n\n🆔ID: {$GLOBALS["uInfo"]["id"]}\n📎Домен: {$GLOBALS["uInfo"]["domain"]}";
        if (isset($GLOBALS["uInfo"]["bdate"])) $str = $str."\n🚼Дата рождения: {$GLOBALS["uInfo"]["bdate"]}";
        if (isset($GLOBALS["uInfo"]["followers_count"])) $str = $str."\n🚻Подписчиков: {$GLOBALS["uInfo"]["followers_count"]}";
        if (isset($GLOBALS["uInfo"]["city"])) $str = $str."\n🏙Город: {$GLOBALS["uInfo"]["city"]}";
        if (isset($GLOBALS["uInfo"]["home_town"])) $str = $str."\n🌃Родной город: {$GLOBALS["uInfo"]["home_town"]}";
        if (isset($GLOBALS["uInfo"]["country"])) $str = $str."\n🏳‍🌈Страна: {$GLOBALS["uInfo"]["country"]}";
        if (isset($GLOBALS["uInfo"]["albums"])) $str = $str."\n\n📚Кол-во альбомов: {$GLOBALS["uInfo"]["albums"]}";
        if (isset($GLOBALS["uInfo"]["videos"])) $str = $str."\n🎬Кол-во видосов: {$GLOBALS["uInfo"]["videos"]}";
        if (isset($GLOBALS["uInfo"]["audios"])) $str = $str."\n🎵Кол-во аудиозаписей: {$GLOBALS["uInfo"]["audios"]}";
        if (isset($GLOBALS["uInfo"]["photos"])) $str = $str."\n🏖Кол-во фоточек: {$GLOBALS["uInfo"]["photos"]}";
        if (isset($GLOBALS["uInfo"]["friends"])) $str = $str."\n👥Кол-во друзей: {$GLOBALS["uInfo"]["friends"]}";
        if (isset($GLOBALS["uInfo"]["online_friends"])) $str = $str."\n🚸Кол-во друзей в онлайне: {$GLOBALS["uInfo"]["online_friends"]}";
        if (isset($GLOBALS["uInfo"]["mutual_friends"])) $str = $str."\n👬Кол-во общих друзей: {$GLOBALS["uInfo"]["mutual_friends"]}";
        if (isset($GLOBALS["uInfo"]["groups"])) $str = $str."\n🛐Кол-во групп: {$GLOBALS["uInfo"]["groups"]}";
        if (isset($GLOBALS["uInfo"]["pages"])) $str = $str."\n🔖Кол-во интересных страниц: {$GLOBALS["uInfo"]["pages"]}";
        
         SendMessage($user_id, $str);
         continue;
        } /* Бот, кто я */

        /* Function Zaceni() */
        if ($strSplit[0] == "зацени") { Stats("zaceni");

            $str = explode(" ", $str);

            if ($str[1] == "" || $str[1] == " " || !isset($str[1])) { SendMessage($user_id, "⚠ Ты забыл/а написать чего мне надо заценить)"); continue;}

         SendMessage($user_id, "🛃 Моя оценка: ".random_int(0, 12)." баллов.");
         continue;
        } /* Бот, зацени аватарку */

        /* Function Infa() */
        if ($strSplit[0] == "инфа") { if (ABSvk($str)) continue; Stats("infa");

            $str2 = explode(" ", $str);

            if ($str2[1] == "" || $str2[1] == " " || !isset($str2[1])) { SendMessage($user_id, "⚠ Ты забыл/а написать для чего нужно составить вероятность)"); continue;}

            $str = mb_ereg_replace("инфа", "", $str);
            $str = str_replace("?", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

         SendMessage($user_id, "⚛ Вероятность \"{$str}\": ".random_int(0, 130)."%");
         continue;
        } /* Бот, инфа завтра конец света */

        /* function Cmd() */
        if (stristr($str, 'cmd') != FALSE || stristr($str, 'кмд') != FALSE || stristr($str, 'help') != FALSE || stristr($str, 'помощь') != FALSE || stristr($str, 'команд') != FALSE || $strSplit[0] == 'начать') { Stats("help");

            $str = "📜 Список того, что я могу:\n\n📄 https://vk.com/topic-166188343_40003425";

            SendMessage($user_id, $str);
            continue;
        } /* Бот, команды */

        /* function WhenCreated() */
        if ($strSplit[0] == "креатед") { Stats("created");

            if (isset($strSplit[1])) $uId = $strSplit[1];

          if (!ctype_digit(preg_replace("/.+id/", "", $uId))) { $uId = preg_replace("/.+com\//", "", $uId);  GetUserId($uId);
            
             if (isset($GLOBALS["id_as_screen_name"]["type"]) && $GLOBALS["id_as_screen_name"]["type"] == "group") { SendMessage($user_id, "⚠ Нужно вводить айди пользователя, а не группы :/"); continue; }
             else if ($GLOBALS["id_as_screen_name"]["type"] == "user") $uId = $GLOBALS["id_as_screen_name"]["object_id"];
             else { SendMessage($user_id, "❌ Пользователь не найден."); continue; }
          } else $uId = preg_replace("/.+id/", "", $uId);

            $html_code = file_get_contents("https://vk.com/foaf.php?id={$uId}");
            $Data = explode("\n", $html_code);

            foreach ($Data as $index => $elem) {
    
                if (strpos($Data[$index], "<ya:created dc:date=") !== false) {
        
                    $created = $Data[$index];
                    break;
                }
            }

            if (!isset($created)) { SendMessage($user_id, "❌ Пользователь не найден."); continue; }

            $created = mb_ereg_replace("    <ya:created dc:date=\"", "", $created);
            $created = mb_ereg_replace("\"/>", "", $created);
            $created = mb_ereg_replace("T", " ", $created);
            $created = preg_replace("/\+.+/", "", $created);
            $created = trim($created, " \t\n\r\0\x0B");

            $today = time();
            $moon = strtotime($created);
            $moon2 = date("H:i:s d.m.20y", strtotime($created));
            
            SendMessage($user_id, "🔙 [id{$uId}|Страница] была создана ".floor(($today - $moon) / 86400)." дней назад.\n📆 Точная дата: {$moon2}");
            continue;
        } /* Бот, креатед */

        /* function Translate() */
        if ($strSplit[0] == "переведи") { if (ABSvk($str)) continue; Stats("translate");

            $first_lang  = $strSplit[1];
            $second_lang = $strSplit[2];

            unset($strSplit[0]); unset($strSplit[1]); unset($strSplit[2]);
              
            $translate = gtranslate(implode(" ", $strSplit), $first_lang, $second_lang);

            if ($translate == "" || $translate == null || $translate == false) {

                SendMessage($user_id, "⚠ Ты ввел/а что-то не правильно. Правильное использование данной команды расписано тут: ( https://vk.com/topic-166188343_39868320 )");
                continue;
            } if (ABSvk($translate)) continue;

            SendMessage($user_id, $translate);
            continue;
        } /* Бот, переведи ru en Привет как твои дела? */

        /* Function Translit() */
        if ($strSplit[0] == "транслит") { if (!isset($strSplit[1])) { SendMessage($user_id, "📛 После слова |транслит| -> пишешь текст, раскладку которого нужно перевести."); continue;} Stats("translit");
        if (ABSvk($str)) continue;

            $str = mb_ereg_replace("транслит", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

            $rus_arr = "Й Ц У К Е Н Г Ш Щ З Х Ъ Ф Ы В А П Р О Л Д Ж Э Я Ч С М И Т Ь Б Ю й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю";
            $rus_arr = explode(" ", $rus_arr);
            $eng_arr = "Q W E R T Y U I O P [ ] A S D F G H J K L ; ' Z X C V B N M , . q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , .";
            $eng_arr = explode(" ", $eng_arr);
            if (ABSvk(str_replace($eng_arr, $rus_arr, $str))) continue;

            SendMessage($user_id, str_replace($eng_arr, $rus_arr, $str));
            continue;
        } /* Бот, транслит ghbdtn */

        /* Function WriteTranslitom() */
        if ($strSplit[0] == "напиши" && $strSplit[1] == "транслитом") { if (!isset($strSplit[1])) { SendMessage($user_id, "📛 После слова |транслит| -> пишешь текст, раскладку которого нужно перевести."); continue;} Stats("write_translit");
        if (ABSvk($str)) continue;

            $str = mb_ereg_replace("напиши", "", $str);
            $str = mb_ereg_replace("транслитом", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");
       
            $rus = array('А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я','а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я',' ');
            $lat = array('a','b','v','g','d','e','e','gh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','y','y','y','e','yu','ya','a','b','v','g','d','e','e','gh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','y','y','y','e','yu','ya',' ');
       
            if (ABSvk(str_replace($rus, $lat, $str))) continue;
            SendMessage($user_id, str_replace($rus, $lat, $str));
            continue;
        } /* Бот, напиши транслитом Привет */

        /* Function Weather() */
        if ($strSplit[0] == "погода") { Stats("weather");

            if (!isset($strSplit[1]) || $strSplit[1] == "" || $strSplit[1] == " ") { SendMessage($user_id, "⚠ Ты не указал/a Город/Страну. Указывать надо на английском языке.\nПример: Мега погода Kiev"); continue; }

            $str = mb_ereg_replace("погода", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");
            $weatherAppId = "#APP_ID#";

            $params = array('appid'            => $weatherAppId,
                            'mode'             => "json",
                            'lang'             => "ru",
                            'units'            => "metric",
                            'cnt'              => "20",
                            'q'                => "{$str}");
            $params = http_build_query($params);
            $query = file_get_contents('http://api.openweathermap.org/data/2.5/forecast?'.$params);
            $result = json_decode($query, true);

            if ($result["cod"] == "404") { SendMessage($user_id, "Страна/Город не найден."); continue; }

            $weather = array();

            foreach ($result["list"] as $index => $elem) {

                $d = explode(" ", $elem["dt_txt"]);

                if ($d[1][0] != "1" || $d[1][1] != "8") continue;

                array_push($weather, "📅 Дата: {$elem["dt_txt"]}\n🌃 Город: {$result["city"]["name"]}\n🏳‍🌈 Страна: {$result["city"]["country"]}\n👥 Население: ".(isset($result["city"]["population"]) ? $result["city"]["population"] : "неизвестно")."\n🌡 Температура: ".floor($elem["main"]["temp"])." °С\n♨ Атм.Давление на ур. моря: ".floor($elem["main"]["sea_level"])." hpa\n💧 Влажность: {$elem["main"]["humidity"]}%\n📜 Описание: {$elem["weather"][0]["description"]}\n☁ Облачность: {$elem["clouds"]["all"]}%\n🌪 Скорость ветра: {$elem["wind"]["speed"]} м/с");
            }

            $weather = implode("\n\n--------------\n\n", $weather);

         SendMessage($user_id, $weather);
         continue;
        } /* Бот, погода Kiev */

        /* Function ZNP() */
        if ($strSplit[0] == "знп") { Stats("znp");

            $str = mb_ereg_replace("знп", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

            preg_match_all('/./us', $str, $ar);
            $str =  join('', array_reverse($ar[0]));

        if (ABSvk($str)) continue;
        SendMessage($user_id, "🔛 $str");
         continue;
        } /* Бот, знп спел лепс */

    /* Premium-Area */

        if (CheckPremium($uId)) {

        /* Function Certificate() */
        if ($strSplit[0] == "сертификат") { Stats("certificate");
            
            $str = preg_replace("/сертификат/", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

            if (mb_strlen($str,'UTF-8') >= 150) { SendMessage($user_id, "❌ Объём текста не должен быть больше чем 150 символов."); continue; }

            $sp = GetPhoto(CreateImage($uId, $str, "c"), $user_id);

         SendMessage($user_id, "Сертификат для [id$uId|пользователя]:", "photo", [$sp[0], $sp[1]]);
         continue;
        } /* Бот, сертификат text */

        /* Function Quote() */
        if ($strSplit[0] == "цитата") { Stats("quotes");
            
            $str = preg_replace("/цитата/", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

            if (mb_strlen($str,'UTF-8') >= 200) { SendMessage($user_id, "❌ Объём текста не должен быть больше чем 200 символов."); continue; }

            $sp = GetPhoto(CreateImage($uId, $str, "q"), $user_id);

         SendMessage($user_id, "Цитата для [id$uId|пользователя]:", "photo", [$sp[0], $sp[1]]);
         continue;
        } /* Бот, цитата text */

        /* Function SetAccost() */
        if ($strSplit[0] == "/setaccost") { Stats("setaccost");
            
            $str = preg_replace("/\/setaccost/", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

            if ($str == "" || $str == " " || $str == null) { SendMessage($user_id, "❌ Обращение должно иметь хотя бы 1 символ!"); continue; }

            $prem[$uId]["accost"] = $str;
            file_put_contents("json/premium_list.json", json_encode($prem));

         SendMessage($user_id, "✅ Новое обращение \"$str\" -> установлено.");
         continue;
        } /* Бот, /setaccost васян */

    }
    /* Premium-Area */

        /* Function RepForUsers() */
        if ($strSplit[0] == "/rep" || $strSplit[0] == "/report") { Stats("report");

            $str = preg_replace("/\/rep/", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");

         SendMessage($user_id, "📮 Твой вопрос был отправлен в службу поддержки. В случае, если на вопрос будет дан ответ - ты будешь об этом уведомлен/а.");
         SendMessage(2000000003, "📣 Вопрос от [id$uId|пользователя] [$uId] в беседе: [$user_id]\n\n-> $str");
         continue;
        } /* Бот, /rep Тест обращения в репорт */

        /* Function RepForModerators() */
        if ($strSplit[0] == "!rep") {

            $str = preg_replace("/!rep/", "", $str);
            $str = trim($str, " \t\n\r\0\x0B");
            $str = explode(" ", $str);
            $rep_dialog = $str[0];
            $rep_user   = $str[1];
            unset($str[0]); unset($str[1]);
            $str = implode(" ", $str);

         SendMessage($rep_dialog, "🛂 Ответ службы поддержки [id$rep_user|пользователю]:\n\n-> $str");
         SendMessage(2000000003, "✅ Ответ был отправлен.");
         continue;
        } /* Бот, !rep 1 245855787 Сам казел */

            /* Admin Команды */

            if ($uId == "245855787") {

                /* function Shkila() */
                if ($strSplit[0] == "шкила") {
        
                    $shkila = mb_ereg_replace("мега шкила", "", $GLOBALS["msg_treatment"][$index]["object"]["text"]);
                    $shkila = trim($shkila, " \t\x0B");
        
                    $shkila = explode("!_", $shkila);
        
                    $fp = fopen("txt/answer_databse.txt","a");  
                    fwrite($fp, "\r\n".$shkila[0]."\\".$shkila[1]."\\0");  
                    fclose($fp);
        
                    SendMessage($user_id, "Ваша запись сохранена в базу ответов.\n\nВопрос: {$shkila[0]}\nОтвет: {$shkila[1]}");
                    continue;
                } /* Бот, шкила test!_Test!!!! */

                /* function GetStats() */
                if ($strSplit[0] == "!stats") {

                    $stats = json_decode(file_get_contents("json/stats.json"), true);

                    $_stats = array("- Статистика использования команд -\n");

                    foreach ($stats as $index => $elem) {

                        $_var = $index.": ".$elem;
                        array_push($_stats , $_var);
                    }

                    $_stats = implode("\n", $_stats);
        
                    SendMessage($user_id, $_stats);
                    continue;
                } /* Бот, !stats */

                /* function prem() */
                if ($strSplit[0] == "!premium") {

                    $str = preg_replace("/!premium/", "", $str);
                    $str = trim($str, " \t\x0B");
                    $str = explode(" ", $str);

                    SetPremium($str[1], $str[0], (isset($str[2]) == true) ? $str[2] : null);
                    continue;
                } /* Бот, !premium status id date*/

                /* function prem() */
            } 

            if ($uId == "245855787" || $uId == "141807531") {
                if ($strSplit[0] == "!fc_set_info") {

                    $fcinfo = $GLOBALS["msg_treatment"][$index]["object"]["text"];
                    $fcinfo = str_replace("мега", "", $fcinfo);
                    $fcinfo = str_replace("Мега", "", $fcinfo);
                    $fcinfo = preg_replace("/!fc_set_info/i", "", $fcinfo);
                    $fcinfo = trim($fcinfo, " \t\n\r\0\x0B");

                    // $str = explode("/", $fcinfo);

                    if (strripos($fcinfo, "Мега") === FALSE && strripos($fcinfo, "!fc_set_info") === FALSE) {

                    $fc_info_arr = json_decode(file_get_contents("../oblojki/json/fc_info.json"), true);

                    array_push($fc_info_arr, $fcinfo);

                    file_put_contents("../oblojki/json/fc_info.json", json_encode($fc_info_arr));
                    SendMessage($user_id, "✅ Новый текст информации на обложке - установлен.");
                    continue;
                    } else {
                        SendMessage($user_id, "❌ Команда написана не правильно!");
                        continue;
                    }
                } /* Бот, !fc_set_info */
                if ($strSplit[0] == "!fc_del_info") {

                    $fcinfo = $GLOBALS["msg_treatment"][$index]["object"]["text"];
                    $fcinfo = str_replace("мега", "", $fcinfo);
                    $fcinfo = str_replace("Мега", "", $fcinfo);
                    $fcinfo = preg_replace("/!fc_del_info/i", "", $fcinfo);
                    $fcinfo = trim($fcinfo, " \t\n\r\0\x0B");

                    if (strripos($fcinfo, "Мега") === FALSE && strripos($fcinfo, "!fc_del_info") === FALSE) {

                    $fc_info_arr = json_decode(file_get_contents("../oblojki/json/fc_info.json"), true);

                    unset($fc_info_arr[$fcinfo]);

                    $fc_info_arr = array_values($fc_info_arr);

                    file_put_contents("../oblojki/json/fc_info.json", json_encode($fc_info_arr));
                    SendMessage($user_id, "✅ Текст с индексом : $fcinfo: - удалён.");
                    continue;
                    } else {
                        SendMessage($user_id, "❌ Команда написана не правильно!");
                        continue;
                    }
                } /* Бот, !fc_del_info */
                if ($strSplit[0] == "!fc_list_info") {

                    $fc_info_arr = json_decode(file_get_contents("../oblojki/json/fc_info.json"), true);
                    $fc_info_arrNew = array();

                    foreach($fc_info_arr as $item => $value) {
                        $fc_info_arrNew[$item] = "[$item] => $value";
                    }

                    $fian = implode("\n", $fc_info_arrNew);
                    if (count($fc_info_arrNew)-1 < 0) $fian = "❌ Список пуст! Будет выводиться простое приветствие.";

                    SendMessage($user_id, "✅ Список текстов и индексов: [index] => text\n\n$fian");
                    continue;
                } /* Бот, !fc_list_info */
              }
              
        /* Function Or() */
        if (stristr($str, 'или') != FALSE) { if (ABSvk($str)) continue; Stats("or");

            $str = str_replace("?", "", $str);
            $str = explode("или", $str);
    
             $rnd = random_int(0, 1);
             $answer_arr = ["Я думаю, что лучше: ", "Пусть будет: ", "Наверное это: ", "Я бы выбрал: ", "Мой ответ: "];
             $rnd2 = random_int(0, 4);
    
             if ($rnd == 0) SendMessage($user_id, $answer_arr[$rnd2].$str[0]);
             else SendMessage($user_id, $answer_arr[$rnd2].$str[1]);
             continue;
        } /* Бот, $txt1 или $txt2 */

         /* Function Monetka() */
        if ($strSplit[0] == "монетка") { Stats("monetka");
    
             $monetka = round(random_int(0, 1));
             $monetka = ($monetka == 0) ? "⏺ Решка" : "🦅 Орёл";

             SendMessage($user_id, $monetka);
             continue;
        } /* Бот, монетка */

        /* Function Answer() */
        $answers = file_get_contents("txt/answer_databse.txt");
        $answers = explode("\\0", $answers);
 
        $variants = array();
        
        foreach($answers as $index => $elem) { // берем строки из файла
            
            $var_count = 0;
            $_answ = explode("\\", mb_strtolower($elem)); // -> разбиваем строку файла на вопрос/ответ
            
             foreach($strSplit as $index2 => $elem2) { // $strSplit -> слова
            
            if (strripos($_answ[0], str_replace("?", "", $strSplit[$index2])) !== FALSE) { // -> если в вопросе файла есть вопрос юзера
       
             $variants[$index] = array($index, $var_count+=1);
             }
             /* Если слово N в вовпросе найдено в слове N строки базы -> Добавляем index строки и кол-во совпадений в варианты ответов */
          }
        }
        
        $arMax = [
           // 'max' => 0,
           // 'item' => null,
            'item_idx' => -1
           ];          
       $tmpMax = 0;
       foreach( $variants as $k => $value ){
           if($value[1] > $tmpMax){
               $tmpMax = $value[1];
               // $arMax['max'] = $tmpMax;
               // $arMax['item'] = &$variants[$k];
               $arMax['item_idx'] = $k;
           }
       }
       
       if ($arMax['item_idx'] == -1) { $rnd = random_int(0, count($answers)-1); SendMessage($user_id, "💬 ".explode("\\", preg_replace("/\\0/", "", $answers[$rnd]))[1]."*"); continue; }
       /* Рандомный ответ, в случае, если не нашлось подходящего */

       $resAnswer = explode("\\", preg_replace("/\\0/", "", $answers[$arMax['item_idx']]))[1];

       SendMessage($user_id, "💬 $resAnswer");
       continue;
       /* Ответ на стандартный вопрос */
    }
} /* Обработка сообщения */

/*------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------ЗАПУСК ФУНКЦИЙ------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/

if (isset($_GET['other'])) {

    SetStatus();
    usleep(500000);
    SetOnline();
    usleep(500000);
    checkRequestAdd();
    usleep(500000);
    checkRequestDeleted();
    usleep(500000);
    CheckNoRepeats();
    usleep(500000);
    ClearBlockTxt();
    usleep(500000);
    CheckFastMessages();
    usleep(500000);
    CheckPremiumDate();
    usleep(500000);
    ClearImages(array("quotes", "certificates"));

} /* check_request */

if (isset($_GET['check_msg'])) {

    LongPollServer();
    usleep(500000);
    LongPollHistory();
    usleep(500000);
    print_r($GLOBALS["new_ts"]);
    if (count($GLOBALS["msg_treatment"]) < 1) {file_put_contents("txt/ts_bot.txt", $GLOBALS["new_ts"]); return;}
    MessageTreatment();

    print_r("<pre>");
    print_r($GLOBALS["msg_treatment"]);
    print_r("</pre>");

    // print_r($GLOBALS["new_ts"]);
    file_put_contents("txt/ts_bot.txt", $GLOBALS["new_ts"]);

} /* check_msg */

if (isset($_GET['send_msg'])) {

    Send();

} /* send_msg */

/* mb_strtolower() -> перевод любой строки в нижний регистр */
/* mb_strtoupper("привет!"); -> ПРИВЕТ! */
/* random_int(0, 4); -> 0..4 */
/* explode(" ", $str); -> строка в массив через пробелы */
/* stristr($str, 'или') != FALSE -> Если слово найдено */
/* mb_ereg_replace("бот,", "", $str); -> удаление слова */
/* str_replace("?", "", $str); -> удаление символов */
/* trim($str, " \t\n\r\0\x0B"); -> удаляемвсе ненужные " ", \n и т.д. из начала и конца строки */
/* mb_strlen("text",'UTF-8'); -> 4 */
/* ctype_digit("текст5"); [false] <- строка только из чисел/нет */
/* preg_replace("/.+id/", "", $var); <- сьъедаем все, что идет в строке до "id" */
/* mb_strstr('abCDef','CD', true); if (true) -> "ab" | if (false) -> "ef" */

?>