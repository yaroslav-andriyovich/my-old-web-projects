<?php

/* ██╗   ██╗ █████╗ ██████╗  ██████╗ ███████╗██╗      █████╗ ██╗   ██╗     █████╗ ███╗   ██╗██████╗ ██████╗ ███████╗███████╗██╗   ██╗ 
   ╚██╗ ██╔╝██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║     ██╔══██╗██║   ██║    ██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝██║   ██║ 
    ╚████╔╝ ███████║██████╔╝██║   ██║███████╗██║     ███████║██║   ██║    ███████║██╔██╗ ██║██║  ██║██████╔╝█████╗  █████╗  ██║   ██║ 
     ╚██╔╝  ██╔══██║██╔══██╗██║   ██║╚════██║██║     ██╔══██║╚██╗ ██╔╝    ██╔══██║██║╚██╗██║██║  ██║██╔══██╗██╔══╝  ██╔══╝  ╚██╗ ██╔╝ 
      ██║   ██║  ██║██║  ██║╚██████╔╝███████║███████╗██║  ██║ ╚████╔╝     ██║  ██║██║ ╚████║██████╔╝██║  ██║███████╗███████╗ ╚████╔╝  
      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝      ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝  ╚═══╝   */

if (isset($_GET['status'])) {

$token = '#TOKEN#';

function GetPlatformVK() {

    $result = "💻 Computer";
    $params = array('fields' => 'last_seen',
                  'user_ids' => '245855787',
                 'name_case' => 'Nom',
              'access_token' => $GLOBALS["token"],
                         'v' => '5.0');
    
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/users.get?'.$params);
    $result = json_decode($query, true);
    
    switch ($result['response']['0']['last_seen']['platform']) {

        case 1: $GLOBALS["platform"] = "📱 Mobile Version";
        break;
        case 2: $GLOBALS["platform"] = "🍏 Iphone";
        break;
        case 3: $GLOBALS["platform"] = "📟 Ipad";
        break;
        case 4: $GLOBALS["platform"] = "📱 Android";
        break;
        case 5: $GLOBALS["platform"] = "📱 Windows Phone";
        break;
        case 6: $GLOBALS["platform"] = "💻 Windows 10";
        break;
        case 7: $GLOBALS["platform"] = "💻 Computer";
        break;
        default: $GLOBALS["platform"] = "💻 Computer";
        break;
    }
    
} GetPlatformVK(); // Получаем платформу

/*                          ---------------------------------------------------------                                */

function SetStatusForVK() {

    date_default_timezone_set("Europe/Kiev");

    $text      = $GLOBALS["platform"]." | 📅 ".date("d.m.Y")." | ⌚ ".date("H:i");
    /* $zamena_iz = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
    $zamena_na = array("0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"); */
    $text      = str_replace($zamena_iz, $zamena_na, $text);
    $params    = array('text' => $text, 'access_token' => $GLOBALS["token"], 'v' => '5.0');
    $params = http_build_query($params);
    $query  = file_get_contents('https://api.vk.com/method/status.set?'.$params);
    $result = json_decode($query, true);
    //print_r($result);

} SetStatusForVK(); // Обновляем статус

/*                          ---------------------------------------------------------                                */

function SetOnlineForVK() { 
    
    $params = array('access_token' => $GLOBALS["token"], 'v' => '5.0');

    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/account.setOnline?'.$params);
    $result = json_decode($query, true);
    //echo "Online test";
    //print_r($result);
    
} SetOnlineForVK(); // Обновляем онлайн с ПК

} // status


/*                          ---------------------------------------------------------                                */


if (isset($_GET['VKlogger'])) {

/*Запрос на сервер*/
function LongPollServer() { 

    $params = array('access_token' => $GLOBALS["token"],
                            'v'            => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/messages.getLongPollServer?'.$params);
    $result = json_decode($query, true);

    $GLOBALS["key"]    = $result['response']['key'];
    $GLOBALS["server"] = $result['response']['server'];
    $GLOBALS["ts"]     = file_get_contents("ts.txt");
    $GLOBALS["new_ts"] = $result['response']['ts'];

// echo "TS: ".$GLOBALS["ts"]."<br/>"."Server: ".$GLOBALS["server"]."<br/>"."Key: ".$GLOBALS["key"]."<br/>"."<br/>";
    
}

/*                          ---------------------------------------------------------                                */

/*Отправка на сервер*/
function LongPollHistory() {

    $params = array('key'            => $GLOBALS["key"],
                    'ts'             => $GLOBALS["ts"],
                    'access_token'   => $GLOBALS["token"],
                    'v'              => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/messages.getLongPollHistory?act=a_check&'.$params);
    $result = json_decode($query, true);
    print_r($query);
    $GLOBALS["check_update"] = $result["response"]["history"];
    // $GLOBALS["check_msg_update"] = $result["response"]["messages"]["items"][0];
        
    foreach ($result["response"]["messages"]["items"] as $index => $elem) {
        $GLOBALS["check_msg_update"][$index] = $result["response"]["messages"]["items"][$index];
    }

    print_r($GLOBALS["check_msg_update"]);
    
}

/*                          ---------------------------------------------------------                                */

/*Проверка на новое сообщение/изменения/удаления*/
function CheckMessageUpdate() {

    date_default_timezone_set("Europe/Moscow");

    $historyListJSON = file_get_contents("messagesHistory.json");
    $historyList = json_decode($historyListJSON, TRUE);

    foreach ($GLOBALS["check_msg_update"] as $index0 => $elem0) {

    if (isset($GLOBALS["check_msg_update"][$index0]["update_time"])) {

    foreach ($historyList as $index => $elem) {

       foreach ($historyList[$index] as $index2 => $elem2) {

            if ($historyList[$index][$index2]["id"] == $GLOBALS["check_msg_update"][$index0]["id"]) {

               //if ($historyList[$index][$index2]["text"] != $GLOBALS["check_msg_update"]["text"]) {

                   $old = $historyList[$index][$index2]["text"];
                   $new = $GLOBALS["check_msg_update"][$index0]["text"];
                   $mid = $historyList[$index][$index2]["id"];
                   $uid = $GLOBALS["check_msg_update"][$index0]["from_id"];
                   $bid = $GLOBALS["check_msg_update"][$index0]["peer_id"];
                 
                   /* Тест отправки смс от лица группы */
                   $params = array('message'      => "📟VK-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n[id".$uid."| Пользователь] изменил сообщение (🆔".$mid.")\n🔙: ".$old."\n🆕: ".$new."\n↪: https://vk.com/im?sel=".$bid."&msgid=".$mid,
                                   'user_id'      => '245855787',
                                   'group_id'     => '176736665',
                                   'access_token' => $GLOBALS["token"],
                                   'v'            => '5.87');

                   $params = http_build_query($params);
                   $query = file_get_contents('https://api.vk.com/method/messages.send?'.$params);
                   //echo "<br/><br/>Soobcheniye o loge otrpavleno v ls SUKAA BLYAAAAAAT";
                   break;
               } 
           } // second foreach
         } // first foreach
       } else { continue; }
    }

    foreach ($GLOBALS["check_update"] as $index7 => $elem7) {

        if ($GLOBALS["check_update"][$index7][2] == "131200") {

            foreach ($historyList as $index => $elem) {

                foreach ($historyList[$index] as $index2 => $elem2) {
         
                     if ($historyList[$index][$index2]["id"] == $GLOBALS["check_update"][$index7][1]) {
         
                        //if ($historyList[$index][$index2]["text"] != $GLOBALS["check_msg_update"]["text"]) {
         
                            $old = $historyList[$index][$index2]["text"];
                            $mid = $historyList[$index][$index2]["id"];
                            $uid = $historyList[$index][$index2]["from_id"];
                            $bid = $GLOBALS["check_update"][$index7][3];
                          
                            /* Тест отправки смс от лица группы */
                            $params = array('message'      => "📟VK-Logger | 📅".date("d.m.Y")." | ⌚".date("H:i:s")."\n[id".$uid."| Пользователь] удалил сообщение (🆔".$mid.")\n✉: ".$old."\n↪: https://vk.com/im?sel=".$bid,
                                            'user_id'      => '245855787',
                                            'group_id'     => '176736665',
                                            'access_token' => $GLOBALS["token"],
                                            'v'            => '5.87');
            
                            $params = http_build_query($params);
                            $query = file_get_contents('https://api.vk.com/method/messages.send?'.$params);
                            //echo "<br/><br/>Soobcheniye o loge otrpavleno v ls SUKAA BLYAAAAAAT";
                            break;
                        } 
                    } // second foreach
                  } // first foreach
        }
    }
} 

/*                          ---------------------------------------------------------                                */

/*Получить айди последних пользователей, чтобы знать из какого диалогa выстёгивать сообщения методом messages.getHistory*/  
function GetDialogs() { 

    $params = array('count'        => '10',
                    'access_token' => $GLOBALS["token"],
                    'v'            => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/messages.getDialogs?'.$params);

    $dialogList = json_decode($query,TRUE); // Декодировать в массив

    $GLOBALS["users_id"] = array();
    $test_i              = 0;

    foreach ($dialogList["response"]["items"] as $index => $elem) {

        if (isset($dialogList["response"]["items"][$index]["message"]["chat_id"])) {$GLOBALS["users_id"][$test_i] = array(2000000000 + (int) $dialogList["response"]["items"][$index]["message"]["chat_id"]);}
        else {$GLOBALS["users_id"][$test_i] = array($dialogList["response"]["items"][$index]["message"]["user_id"]);}
        $test_i++;
    }
} 

/*                          ---------------------------------------------------------                                */

function addToArray($uID) {

    $params = array('count'        => '100',
                    'fields'       => 'id,first_name,last_name',
                    'extended'     => '1',
                    'user_id'      => $uID,
                    'access_token' => $GLOBALS["token"],
                    'v'            => '5.87');
    $params = http_build_query($params);
    $query = file_get_contents('https://api.vk.com/method/messages.getHistory?'.$params);
    $msgArray = json_decode($query,TRUE);

    foreach ($msgArray as $tIndex => $tElement) {
        $newTestArr = $msgArray["response"];
    }

    return $newTestArr;
}

/*                          ---------------------------------------------------------                                */

/*Получаем историю сообщений и сохраняем ее в свой json файл*/
function GetHistory() { 
  
    $GLOBALS["messagesHistoryArr"] = array();

    foreach ($GLOBALS["users_id"] as $index => $elem) {
        $GLOBALS["messagesHistoryArr"][$index] = addToArray($GLOBALS["users_id"][$index][0]);
    }

    foreach ($GLOBALS["messagesHistoryArr"] as $testIndex => $testElement) {
        $arr_to_json[$testIndex] = $GLOBALS["messagesHistoryArr"][$testIndex]['items'];
    }
    
    file_put_contents("messagesHistory.json", json_encode($arr_to_json, TRUE));
}

/* Тест логгера */
/* 
LongPollServer(); 
sleep(1);
LongPollHistory();
sleep(1);
    
if ($GLOBALS["check_update"][0] == Array()) {file_put_contents("ts.txt", $GLOBALS["new_ts"]); return;} //continue;
    
CheckMessageUpdate();
sleep(1);
GetDialogs(); //Получить айди последних пользователей, чтобы знать из какого диалогa выстёгивать сообщения методом messages.getHistory 
sleep(1);
GetHistory(); //Получаем историю сообщений и сохраняем ее в свой json файл
file_put_contents("ts.txt", $GLOBALS["new_ts"]); */
} // vk logger

?>