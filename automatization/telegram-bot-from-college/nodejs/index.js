// Warning! Very bad code!

var TelegramBot = require('node-telegram-bot-api');
var token = "####################";
var bot = new TelegramBot(token, {polling: true});
var getJSON = require('get-json');
var phpAddonPath = "http://site.com/TelegaBot.php";

var pairs = {
    "1": {
        "0": "1. Укр. Мова🔰 [305]\nВчитель І.П.",
        "1": "2. Вища математика🔢 [505]\nВчитель І.П.",
        "2": "3. ↔Ан. та Цифр. Схемотехнiка🔧 [309] Вчитель І.П.\n або Осн. теор. пер. iнформ.🛰 [602]\nВчитель І.П.",
        "3": "4. Iноземна Мова🔤 [420]\n Вчитель І.П."
    },

    "2": {
        "0": "1. Ан. та Цифр. Схемотехнiка🔧 [309]\nВчитель І.П.",
        "1": "2. Осн. теор. пер. iнформ.🛰 [602]\nВчитель І.П.",
        "2": "3. Осн. теор. ел. кiл🔌 [105]\nВчитель І.П.",
        "3": "4. Вища математика🔢 [505] Дiмнич Л.М.\n або Iнформатика💻 [212] Вчитель І.П."
    },

    "3": {
        "0": "1. Iнформатика💻 [212]\nВчитель І.П.",
        "1": "2. Астрономiя🔮 [404]\nВчитель І.П.",
        "2": "3. Фiз-ра Вчитель І.П."
    },

    "4": {
        "0": "1. Осн. теор. пер. iнформ.🛰 [602]\nВчитель І.П.",
        "1": "2. ↔Ан. та Цифр. Схемотехнiка🔧 [309]\nВчитель І.П.",
        "2": "3. Економiка💹 [102]\nВчитель І.П."
    },

    "5": {
        "0": "1. Географiя✈ [503]\nВчитель І.П.",
        "1": "2. Безпека життэдiяльностi💀 [503]\nВчитель І.П.",
        "2": "3. Осн. теор. ел. кiл🔌 [105]\nВчитель І.П."
    }
};

var ringTime = {
    "0": "08:30 - 09:45 🕘",
    "1": "09:55 - 11:10 🕙",
    "2": "11:20 - 12:35 🕚",
    "3": "12:45 - 14:00 🕑"
};

bot.on("message", function (msg) {

    var prefix = "/";

    if (!msg.text.startsWith(prefix)) return;

    var text = msg.text.slice(1).toLowerCase();
    var chatId = msg.chat.id;
    var senderId = msg.from.id;
    var msgId = msg.message_id;

    function IsCorrectChatID() {
        var id = -12345678;
        if (chatId == id) return true;
        else return false;
    }

    var com = ["/cmd 📋", "/acc 📃", "/chatInfo 📄"/*, "/say + TestText"*/];

    switch (text) {
        case "cmd":
        case "команды":
        case "help":
        case "помощь":
            if (IsCorrectChatID() == true) {
                com.push("/пари *цифра дня недiлi* 💬");
                com.push("/час 🔔");
            }

            var cvCount = 0, cmdVar = "";

            for (key in com) {
                cmdVar += cvCount + ": " + com[key] + "\n";
                cvCount++;
            }

            bot.sendMessage(chatId, "Commands: \n\n" + cmdVar);
            break;
        case "chatinfo":
            bot.sendMessage(chatId, `Title: ${msg.chat.title}\nType: ${msg.chat.type}\nId: ${msg.chat.id}`);
            break;
        case "acc":
            bot.forwardMessage(chatId, chatId, msgId);
            bot.sendMessage(chatId, `👕Username: ${msg.from.first_name} ${msg.from.last_name}\n👖Твой id: ${senderId}`);
            break;
        case "time":
            var currentDate = new Date();
            var dateHours = currentDate.getHours();
            var dateMinutes = currentDate.getMinutes();

            bot.sendMessage(chatId, "Time: " + `${dateHours}:${dateMinutes}`);
            break;
        // default: bot.forwardMessage(chatId, chatId, msgId); bot.sendMessage(chatId, "404: Command not found.");
        // break;
    }

    bot.onText(/\/test/, function (msg) {
        var chatId = msg.chat.id;

        bot.sendMessage(chatId, "✊ Я тут");
    });

    bot.onText(/\/say (.+)/, function (msg, match) {
        var chatId = msg.chat.id;
        var resp = match[1];

        bot.sendMessage(chatId, resp);
    });

    if (IsCorrectChatID() != true) {
        return;
    } else {
        var chatText = text.replace(/\s/g, "");
        var response = "";

        for (var i = 1; i <= 5; i++) {
            if (chatText.startsWith(`${i.toString()}`)) {
                for (key in pairs[`${i}`]) {
                    response += pairs[`${i}`][`${key}`] + " | " + ringTime[`${key}`] + "\n\n";
                }

                if (i == 1) {
                    getJSON(`${phpAddonPath}?getNedilya=1`).then(async function (response) {
                        dejuriki = response;
                        console.log(dejuriki);

                        return bot.sendMessage(chatId, response + dejuriki);
                        // dejuriki = JSON.parse(JSON.stringify(response));
                    }).catch(function (error) {
                        console.log(error);
                    });
                    return;
                } else if (i == 2) {
                    getJSON(`${phpAddonPath}?getNedilya=2`).then(async function (response) {
                        dejuriki = response;
                        console.log(dejuriki);

                        return bot.sendMessage(chatId, response + dejuriki);
                    }).catch(function (error) {
                        console.log(error);
                    });
                    return;
                }

                return bot.sendMessage(chatId, response);
            }
        }

        if (text == "дзвінки") {
            bot.sendMessage(chatId, "⌚ Розклад дзвiнкiв: \n\n" + "1. 08:30 - 09:45 🕘\n2. 09:55 - 11:10 🕙\n3. 11:20 - 12:35 🕚\n4. 12:45 - 14:00 🕑");
        }
    }
});

bot.onText(/\/s/, function (msg) {
    bot.sendMessage(msg.chat.id, "1. Ім'я Прізвище\n2. Ім'я Прізвище\n3. Ім'я Прізвище");
});

bot.onText(/\/rload/, (msg) => {
    bot.sendMessage(msg.chat.id, "Розклад завантажено.", {
        "reply_markup": {
            "keyboard": [["/1 Понедiлок", "/2 Вiвторок"], ["/3 Середа", "/4 Четвер"], ["/5 П'ятниця"], ["/дзвінки"]]
        }
    });
});

function checkDay() {
    var date = new Date();
    if (date.getHours() < 4 || date.getHours() >= 17) return;
    var id = -258056732;
    switch (date.getDay()) {
        case 1:
            var dateHours = new Date().getHours();
            var dateMinutes = new Date().getMinutes();
            if (dateHours == "4" && dateMinutes == "20") {
                bot.sendMessage(id, `Cьогодi будуть такi пари:\n\n ${pairs["1"]["0"]} | ${ringTime["0"]}\n\n${pairs["1"]["1"]} | ${ringTime["1"]}\n\n${pairs["1"]["2"]} | ${ringTime["2"]}\n\n${pairs["1"]["3"]} | ${ringTime["3"]}`);
                getJSON(`${phpAddonPath}?getList`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, dejuriki + " ♻");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (dateHours == "16" && dateMinutes == "00") {
                bot.sendMessage(id, `Завтра будуть такi пари:\n\n ${pairs["2"]["0"]} | ${ringTime["0"]}\n\n${pairs["2"]["1"]} | ${ringTime["1"]}\n\n${pairs["2"]["2"]} | ${ringTime["2"]}\n\n${pairs["2"]["3"]} | ${ringTime["3"]}`);
                getJSON(`${phpAddonPath}?getNedilya=2`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, "\n\n" + dejuriki);
                }).catch(function (error) {
                    console.log(error);
                });
            } else return;
            break;
        case 2:
            var dateHours = new Date().getHours();
            var dateMinutes = new Date().getMinutes();
            if (dateHours == "4" && dateMinutes == "20") {
                bot.sendMessage(id, `Cьогодi будуть такi пари:\n\n ${pairs["2"]["0"]} | ${ringTime["0"]}\n\n${pairs["2"]["1"]} | ${ringTime["1"]}\n\n${pairs["2"]["2"]} | ${ringTime["2"]}\n\n${pairs["2"]["3"]} | ${ringTime["3"]}`);
                getJSON(`${phpAddonPath}?getList`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, dejuriki + " ♻");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (dateHours == "16" && dateMinutes == "00") {
                bot.sendMessage(id, `Завтра будуть такi пари:\n\n ${pairs["3"]["0"]} | ${ringTime["0"]}\n\n${pairs["3"]["1"]} | ${ringTime["1"]}\n\n${pairs["3"]["2"]} | ${ringTime["2"]}`);
            } else return;
            break;
        case 3:
            var dateHours = new Date().getHours();
            var dateMinutes = new Date().getMinutes();
            if (dateHours == "4" && dateMinutes == "20") {
                bot.sendMessage(id, `Cьогодi будуть такi пари:\n\n ${pairs["3"]["0"]} | ${ringTime["0"]}\n\n${pairs["3"]["1"]} | ${ringTime["1"]}\n\n${pairs["3"]["2"]} | ${ringTime["2"]}`);
                getJSON(`${phpAddonPath}?getList`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, "📌 Сьогоднi черговi: " + dejuriki + " ♻");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (dateHours == "16" && dateMinutes == "00") {
                bot.sendMessage(id, `Завтра будуть такi пари:\n\n ${pairs["4"]["0"]} | ${ringTime["0"]}\n\n${pairs["4"]["1"]} | ${ringTime["1"]}\n\n${pairs["4"]["2"]} | ${ringTime["2"]}`);
            } else return;
            break;
        case 4:
            var dateHours = new Date().getHours();
            var dateMinutes = new Date().getMinutes();
            if (dateHours == "4" && dateMinutes == "20") {
                bot.sendMessage(id, `Cьогодi будуть такi пари:\n\n ${pairs["4"]["0"]} | ${ringTime["0"]}\n\n${pairs["4"]["1"]} | ${ringTime["1"]}\n\n${pairs["4"]["2"]} | ${ringTime["2"]}`);
                getJSON(`${phpAddonPath}?getList`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, "📌 Сьогоднi черговi: " + dejuriki + " ♻");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (dateHours == "16" && dateMinutes == "00") {
                bot.sendMessage(id, `Завтра будуть такi пари:\n\n ${pairs["5"]["0"]} | ${ringTime["0"]}\n\n${pairs["5"]["1"]} | ${ringTime["1"]}\n\n${pairs["5"]["2"]} | ${ringTime["2"]}`);
            } else return;
            break;
        case 5:
            var dateHours = new Date().getHours();
            var dateMinutes = new Date().getMinutes();
            if (dateHours == "4" && dateMinutes == "20") {
                bot.sendMessage(id, `Cьогодi будуть такi пари:\n\n ${pairs["5"]["0"]} | ${ringTime["0"]}\n\n${pairs["5"]["1"]} | ${ringTime["1"]}\n\n${pairs["5"]["2"]} | ${ringTime["2"]}`);
                getJSON(`${phpAddonPath}?getList`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, "📌 Сьогоднi черговi: " + dejuriki + " ♻");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (dateHours == "16" && dateMinutes == "00") {
                bot.sendMessage(id, `В понедiлок будуть пари:\n\n ${pairs["1"]["0"]} | ${ringTime["0"]}\n\n${pairs["1"]["1"]} | ${ringTime["1"]}\n\n${pairs["1"]["2"]} | ${ringTime["2"]}\n\n${pairs["1"]["3"]} | ${ringTime["3"]}`);
                getJSON(`${phpAddonPath}?getNedilya=1`).then(async function (response) {
                    dejuriki = response;
                    console.log(dejuriki);

                    bot.sendMessage(id, "\n\n" + dejuriki);
                }).catch(function (error) {
                    console.log(error);
                });
            } else return;
            break;
    }
    //console.log(`${date.getDay()} - ${dateHours}:${dateMinutes}`);
}

setInterval(checkDay, 60000);

bot.on('polling_error', (error) => {
    console.log(error);
});