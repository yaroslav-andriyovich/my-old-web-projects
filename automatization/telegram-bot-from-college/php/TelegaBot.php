<?php

date_default_timezone_set("Europe/Kiev");

if (isset($_GET['getList'])) {

    $checkDay =  json_decode(file_get_contents("tb_checkDay.json"), true);

    if ($checkDay["day"] != date("N")) { $checkDay["day"] = date("N"); $checkDay["check"] = false; }

    if (date("N") > 5) return;
    if      (date("N") == 3 && $checkDay["check"] == false && $checkDay["nedilya"] == false) $checkDay["nedilya"] = true;
    else if (date("N") == 3 && $checkDay["check"] == false && $checkDay["nedilya"] == true)  $checkDay["nedilya"] = false;

     $list = file_get_contents("tb_list.txt"); // Получить список

     $_str = explode("\n", $list); // -> разбиваем строки списка на группы дежурных
     
     foreach ($_str as $key => $value) {

     if (strpos($value, "!") === FALSE) { $dej = $value; if ($checkDay["check"] != true)  { $_str[$key] = $value."!"; break; } /*checkDay*/ }
     } //Если еще не все дежурили

     if ($dej == "") { 
         $newList = str_replace("!", "", $list);
         $_str = explode("\n", $newList); // -> разбиваем строки списка на группы дежурных
         foreach ($_str as $key => $value) {

         if (strpos($value, "!") === FALSE) { $dej = $value; if ($checkDay["check"] != true)  { $_str[$key] = $value."!"; break; } /*checkDay*/ }
         } //Если еще не все дежурили
    }

    file_put_contents("tb_list.txt", implode("\n", $_str)); // Занести дежурных

    if ($checkDay["day"] == 1 && $checkDay["nedilya"] == true) $dej = "🔴 3тя(пара). Ан. та Цифр. Схемотехнiка🔧 [309]\nВчитель І.П.\n\n📌 Сьогоднi черговi: ".$dej;
    else if ($checkDay["day"] == 1 && $checkDay["nedilya"] == false) $dej = "🔴 3тя(пара). Осн. теор. пер. iнформ.🛰 [602]\nВчитель І.П.\n\n📌 Сьогоднi черговi: ".$dej;
    else if ($checkDay["day"] == 2 && $checkDay["nedilya"] == true) $dej = "🔴 4та(пара). Вища математика🔢 [505]\nВчитель І.П.\n\n📌 Сьогоднi черговi: ".$dej;
    else if ($checkDay["day"] == 2 && $checkDay["nedilya"] == false) $dej = "🔴 4та(пара). Iнформатика💻 [212]\nВчитель І.П.\n\n📌 Сьогоднi черговi: ".$dej;
    $json = [$dej];

    if (!$checkDay["check"]) $checkDay["check"] = true;
    file_put_contents("tb_checkDay.json", json_encode($checkDay)); // Занести день для проверки

    print(json_encode($json));

}

if (isset($_GET['getNedilya'])) {

    $checkDay =  json_decode(file_get_contents("tb_checkDay.json"), true);
    $dej      = "Not found.";

    if ($_GET['getNedilya'] == 1) {
        if      ($checkDay["nedilya"] == true)  $dej = "🔴 3тя(пара). Ан. та Цифр. Схемотехнiка🔧 [309]\nВчитель І.П.";
        else if ($checkDay["nedilya"] == false) $dej = "🔴 3тя(пара). Осн. теор. пер. iнформ.🛰 [602]\nВчитель І.П.";
    } else if ($_GET['getNedilya'] == 2) {
        if      ($checkDay["nedilya"] == true)  $dej = "🔴 4та(пара). Вища математика🔢 [505]\nВчитель І.П.";
        else if ($checkDay["nedilya"] == false) $dej = "🔴 4та(пара). Iнформатика💻 [212]\nВчитель І.П.";
    }

    $json = [$dej];

    print(json_encode($json));
}

?>