<?php // Крон задача посещала данную страницу, тем самым запуская цепочку других триггеров, которые приводили в действие PHP код

set_time_limit(90);

$myDomain = "https://my-site.com/";

file_get_contents($myDomain.'oblojki/02-TT-Fan-Club.php');
sleep(1);
file_get_contents($myDomain.'oblojki/03-TT-Fan-Zone.php');
sleep(1);
file_get_contents($myDomain.'oblojki/01-MegaBot.php');

?>