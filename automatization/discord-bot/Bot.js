// Warning! Very bad code!

const Discord = require('discord.js');
const robot = new Discord.Client();
var date = new Date();
date.setUTCHours(16);

robot.login("#TOKEN#");

robot.on('ready', () => {
    console.log("Стартуем!!!");
    robot.user.setStatus('dnd');
    robot.user.setActivity("Testing..");
});

robot.on("guildMemberAdd", function (member) {
    try {
        member.guild.channels.find("id", member.guild.systemChannelID).send(`${member.toString()} Добро пожаловать на сервер: ${member.guild.name}`);
    } catch (error) {
        console.log(error);
    }
});

robot.on('guildMemberRemove', async member => {
    try {
        member.guild.channels.get(member.guild.systemChannelID).send(`Попрощайтесь с ${member.user.tag}. Он покинул этот сервер.`);
    } catch (error) {
        console.log(error);
    }
});

robot.on('message', async msg => {
    if (msg.author.bot || msg.channel.type != "text")
        return;

    let sender = msg.author;
    let sms = msg.content;
    let prefix = "!";
    let thisAuthor = msg.member;

    let botIsAdmin = (function () {
        if (msg.guild.me.hasPermission("ADMINISTRATOR"))
            return true;
        else
            return false;
    }());

    function authorIsAdmin(_sndErrMsg = false) {
        if (!thisAuthor.hasPermission('ADMINISTRATOR')) {
            if (_sndErrMsg) {
                msg.reply(":no_entry: Вы не являетесь администратором на этом сервере! Данная команда не доступна. :no_entry:");
                return false;
            } else
                return false;
        } else
            return true;
    }

    /* Adblock (Discord) */

    if (botIsAdmin && !authorIsAdmin()) {
        if (sms.toLowerCase().includes("discord.gg")) {
            msg.author.lastMessage.delete(1);
            if (thisAuthor) {
                msg.guild.ban(thisAuthor, {days: 1, reason: "Реклама другого сервера в Дискорде."});
                msg.channel.send(`:chicken: Данный (${thisAuthor.user.tag}) человек был забанен мною на 1 день по причине: ` + "```Реклама другого сервера в Дискорде.```");
            }
        }
    }

    if (!sms.startsWith(`${prefix}`))
        return;

    let command = sms.substr(1).split(" ", 1);

    switch (command.join(" ")) {
        case "тест":
            msg.reply("Я работаю, фсе норм!");
            return;
            break;

        case "status":
            msg.reply(msg.guild.me.hasPermission("ADMINISTRATOR"));
            return;
            break;

        case "cmd":
            if (!authorIsAdmin(true)) return;
            cmd();
            return;
            break;

        case "ban":
            if (!authorIsAdmin(true)) return;
            ban();
            return;
            break;

        case "c":
        case "с":
            if (!authorIsAdmin(true)) return;
            clearChatMessages();
            return;
            break;

        case "help":
        case "h":
        case "команды":
            help();
            return;
            break;

        case "a":
        case "а":
            checkAdmin();
            return;
            break;

        case "rr":
            removeRole();
            return;
            break;

        case "ава":
            avatar();
            return;
            break;

        case "инфа":
            accountInfo();
            return;
            break;

        case "сервер":
        case "server":
            serverInfo();
            return;
            break;

        case "анонимно":
            sendAnonim();
            return;
            break;

        case "когда":
            when();
            return;
            break;

        case "или":
            or();
            return;
            break;

        case "длина":
            myLength();
            return;
            break;

        case "рандом":
            myRandom();
            return;
            break;

        case "скажи":
            say();
            return;
            break;

        case "кто":
            who();
            return;
            break;

        default:
            return;
            break;

    }

/////////////////////////////////////////////////////////////////
//                                                             //
//                                                             //
//                     ADMIN   COMMANDS                        //
//                                                             //
//                                                             //
/////////////////////////////////////////////////////////////////

    /* !cmd */

    async function cmd() {
        const m = await msg.channel.send("ЗагрузОчка..");

        let embed = new Discord.RichEmbed().setAuthor("Команды спешл фор админс")
            .setDescription("Ток использовать с умом!")
            .addField("!ban [days] [nickname]", "Бан юзверя")
            .addField("!clean || !c [сколько сообщений]", "Очистит чат")
            //.setThumbnail("https://cdn.discordapp.com/avatars/441934736957636619/fce94b2b931af895d1fe09ea13997037.png?size=512")
            .setColor("#ff0000");

        m.edit(embed);
    }

    /* !ban */

    function ban() {
        let nameForBan = sms.replace("!ban", "").replace(/\s/g, " ").substr(1).split(" ");
        let banDays = nameForBan[0];
        delete nameForBan[0];
        nameForBan = nameForBan.filter(function () {
            return true
        }).join(" ");
        let guildMemberForBan = msg.guild.members.find("displayName", nameForBan);

        if (!guildMemberForBan)
            return msg.reply(`:name_badge: ОшибОчка! Пользователь [${nameForBan}] - не найден.\n\n` + "```!ban [days] [nickname] - для бана пользователя```\n\n:warning: Если у пользователя нет никнейма на вашем сервере - вводим его имя аккаунта, которое идёт до #0000. Если же на сервере у юзверя есть ник (второе имя) - вводим именно его, ибо по имени аккаунта поиск не сработает!");
        else {
            if (guildMemberForBan.hasPermission("ADMINISTRATOR"))
                return msg.reply(`:name_badge: ОшибОчка! Пользователь [${guildMemberForBan.user.tag}] - является администратором сервера, и не может быть забанен.`);
            else {
                msg.guild.ban(guildMemberForBan, {
                    days: Number(banDays),
                    reason: `Бан командой от админа: ${thisAuthor.user.tag}`
                });
                return msg.reply(`:white_check_mark: Пользователь (${guildMemberForBan.user.tag}) был забанен на: ${banDays} дней.`);
            }
        }
    }

    /* !clean */

    function clearChatMessages() {
        intDelSms = Number(sms.replace("!c", "").replace("!с", "").replace("!clean", "").replace(/\s/g, ""));

        if (!isNaN(intDelSms)) {
            if (intDelSms <= 0) {
                return msg.reply(":name_badge: Ты ввел меньше 1! Так низя.");
            } else {
                msg.channel.bulkDelete(++intDelSms).catch(e => {
                    return msg.reply(":name_badge: Можно удалять только те сообщения, которые были отправлены не позднее, чем 14 дней назад!");
                });
            }
        } else {
            return msg.reply(":name_badge: Ты ввёл не число!");
        }
    }

/////////////////////////////////////////////////////////////////
//                                                             //
//                      USER   COMMANDS                        //
//                                                             //
/////////////////////////////////////////////////////////////////  

    /* !check admin */

    function checkAdmin() {
        if (!authorIsAdmin())
            return msg.reply("Ты не админ на сервере :x: ");
        else
            return msg.reply("Ты админ на сервере, да, подтверждаю :white_check_mark: ");
    }

    /* !help */

    async function help() {
        const m = await msg.channel.send("Погодь..");

        let embed = new Discord.RichEmbed().setAuthor("Вот тебе мои команды")
            .setDescription("Команды MegaБот'а")
            .addField("!cmd", "Список всех команд ! ДЛЯ АДМИНИСТРАТОРОВ !")
            .addField("!admin / !a", "Проверка на права администратора")
            .addField("!ава / !ава [name | id]", "Скинет вашу или аву нужного вам юзверя")
            .addField("!анонимно [id] [сообщение]", "Система отправки анонимных сообщений через Бота (Айди узнавать по ПКМ на пользователя => Копировать ID)")
            .addField("!инфа", "Скинет инфу про ваш Дискордный Аккаунт")
            .addField("!когда [text]", "Попробует угадать когда случится событие")
            .addField("!или [text 1] или [text 2]", "Поможет с выбором")
            .addField("!рандом [число1] [число2]", "Сгенирирует рандомное число в вашем диапазоне")
            .addField("!скажи [text]", "Повторит за вами текст")
            .addField("!сервер", "Покажет информацию о данном сервере")
            .setThumbnail(msg.author.avatarURL)
            .setColor("#ffff00");

        m.edit(embed);
    }

    /* !ава */

    function avatar() {
        let _avaMsg = msg.content.replace("!ава", "").replace(/\s/g, " ").substr(1);

        if (!_avaMsg)
            if (thisAuthor.user.avatarURL)
                msg.reply(msg.author.avatarURL);
            else
                msg.reply(`:name_badge: ОшибОчка! У Вас аватар не установлен!`);
        else {
            if (msg.guild.members.find("displayName", _avaMsg))
                if (!msg.guild.members.find("displayName", _avaMsg).user.avatarURL)
                    msg.reply(`:name_badge: ОшибОчка! У пользователя [${_avaMsg}] - аватар не установлен.`);
                else
                    msg.reply(msg.guild.members.find("displayName", _avaMsg).user.avatarURL);
            else
                msg.reply(`:name_badge: ОшибОчка! Пользователь [${_avaMsg}] - не найден.\n\n` + "```!ава - для получения своего аватара\n!ава [nickname] - для получения аватара другого пользователя сервера```\n\n:warning: Если у пользователя нет никнейма на вашем сервере - вводим его имя аккаунта, которое идёт до #0000. Если же на сервере у юзверя есть ник (второе имя) - вводим именно его, ибо по имени аккаунта поиск не сработает!");
        }
    }

    /* !инфа */

    async function accountInfo() {
        const m = await msg.channel.send("Погодь..");

        let embed = new Discord.RichEmbed().setAuthor("Ответец")
            .setDescription("Информация о вашем аккаунте")
            .addField("Ваш настоящий ник: ", msg.author.username)
            .addField("Ваш дискриминатор: ", `#${msg.author.discriminator}`)
            .addField("Дата создания аккаунта: ", msg.author.createdAt)
            .addField("Ваш id: ", msg.author.id)
            .setThumbnail(msg.author.avatarURL)
            .setColor("#ff44ff");

        m.edit(embed);
    }

    /* !длина */

    function myLength() {
        str = msg.content.replace("!длина", "");
        str1 = str.replace(/\s/g, " ").substr(1);
        str2 = str.replace(/\s/g, "");
        msg.reply("```" + `Символов в тексте с учётом пробелов:  ${str1.length}\nСимволов в тексте без учёта пробелов: ${str2.length}` + "```");
    }

    /* !скажи */

    function say() {
        strSay = sms.replace("!скажи", "").replace(/\s/g, " ").substr(1);
        if (!strSay)
            msg.channel.send(":name_badge: ОшибОчка! Ты не ввёл текст, который я должен сказать!");
        else
            msg.channel.send(strSay);
    }

    /* !рандом */

    function myRandom() {
        rand = msg.content.replace("!рандом", "");
        rand = rand.replace(/\s/g, " ");
        rand = rand.split(' ', 3);

        minN = Math.ceil(rand[1]);
        maxN = Math.floor(rand[2]);
        num = Math.floor(Math.random() * (maxN - minN + 1)) + minN;

        if (isNaN(num))
            return msg.reply(":name_badge: ОшибОчка! Введите правильно команду!\n\n```Пример: !рандом 1 100```");
        else
            msg.reply("Выпало число: " + num);
    }

    /* !сервер */

    async function serverInfo() {
        const m2 = await msg.channel.send("Погодь..");

        let embed2 = new Discord.RichEmbed()
            .setTitle(`Информация о сервере: "${msg.guild.name}"`)
            .addField("Создан: ", msg.guild.createdAt)
            .addField("ID сервера: ", msg.guild.id)
            .addField("Создатель сервера: ", msg.guild.owner)
            .addField("Регион: ", msg.guild.region)
            .addField("АФК канал: ", msg.guild.afkChannel)
            .addField("Макс. вермя АФК: ", `${msg.guild.afkTimeout / 60} минут.`)
            .addField("Количество людей на сервере: ", msg.guild.memberCount)
            .addField("Роль по умолчанию: ", msg.guild.defaultRole)
            .addField("Список ролей сервера: ", "\nВсего ролей: " + msg.guild.roles.size + " \n\n" + "Роли: " + `${rolesList}`)
            .setThumbnail((!msg.guild.iconURL) ? "http://globalcs.ru/uploads/posts/2015-09/1442814842_12705367.png" : msg.guild.iconURL)
            .setColor("#000000");

        m2.edit(embed2);
    }

    /* !аноним */

    function sendAnonim() {
        try {
            anonimStr = sms.replace("!анонимно", "");
            anonimStr = anonimStr.replace(/\s/g, " ");
            var anonimId = anonimStr.split(' ', 2);
            anonimStr = anonimStr.replace(anonimId[1], "");
            var poluchatel = anonimId[1];

            if (poluchatel != "" && poluchatel != undefined && anonimStr != "" && anonimStr != undefined) {
                if (msg.guild.me.hasPermission("ADMINISTRATOR"))
                    msg.channel.bulkDelete(1);

                if (msg.guild.members.find('id', poluchatel) == null || msg.guild.members.find('id', poluchatel) == "")
                    return msg.author.send(':name_badge: Ошибка отправки анонимного сообщения. Скорее всего айди указан не верно, или человека нет на вашем сервере.. Пример ввода команды:\n```!аноним [id] [сообщение]```');
                msg.author.send(`**Ваше анонимное сообщение успешно отправлено.**\n\n :spy: Получатель: ${msg.guild.members.find('id', poluchatel)}\n\n :incoming_envelope: Сообщение: ${anonimStr}`);

                var anonimUser = msg.guild.members.find('id', poluchatel);
                msg.guild.member(anonimUser).send(`:spy: **Вы получили анонимное сообщение. Нет никакого смысла мне на него отвечать, ибо я просто Бот :)** :spy: \n\n :envelope_with_arrow: ${anonimStr}`);
            } else {
                return msg.reply(":name_badge: Ты допустил где-то ошибку. Пример ввода команды:\n```!аноним [id] [сообщение]```");
            }
        } catch (error) {
            return msg.reply(':name_badge: Неизвестная ошибка. Айди или сообщение указаны не верно. Пример ввода команды:\n```!аноним [id] [сообщение]```');
        }
    }

    /* !когда */

    function when() {
        whenRandMsg = msg.content.replace("!когда", "");
        whenRandMsg = whenRandMsg.replace(/\s/g, " ");

        var mindays = 1, maxdays = 300;
        var minnedils = 1, maxnedils = 4;
        var minmonth = 1, maxmonth = 12;
        var minyears = 1, maxyears = 999;

        var randOtvetKogda = Math.round(Math.random() * (5 - 1) + 1);

        switch (randOtvetKogda) {
            case 1:
                var randDays = Math.round(Math.random() * (maxdays - mindays) + mindays);
                msg.reply(`думаю это случится через ${randDays} дней.`);
                break;
            case 2:
                var randNedils = Math.round(Math.random() * (maxnedils - minnedils) + minnedils);
                msg.reply(`наверное это произойдет через ${randNedils} недели.`);
                break;
            case 3:
                var randMonth = Math.round(Math.random() * (maxmonth - minmonth) + minmonth);
                msg.reply(`я не экстрасенс, но наверное это будет через ${randMonth} месяца.`);
                break;
            case 4:
                var randYears = Math.round(Math.random() * (maxyears - minyears) + minyears);
                msg.reply(`ждать тебе еще долго.. Целых ${randYears} года.`);
                break;
            case 5:
                msg.reply("Наверное этого не случится никогда..");
                break;
        }
    }

    /* !или */

    function or() {
        var ili = msg.content.replace("!или", "").replace(/\s/g, " ").substr(1).split("или");

        if (!ili[0] || !ili[1])
            return msg.reply(":name_badge: ОшибОчка! Пример команды:\n```!или Собака грызёт диван или это делает кот?```");

        var rand = Math.round(Math.random() * (3 - 1) + 1);
        var rand2 = Math.round(Math.random() * (5 - 1) + 1);
        var iliAnswers = ["Ответ: ", "Я думаю, что лучше: ", "Пусть будет: ", "Наверное это: ", "Я бы выбрал: ", "Мой ответ: "];

        switch (rand) {
            case 1:
                msg.channel.send(iliAnswers[rand2] + ili[0]);
                break;
            case 2:
                msg.channel.send(iliAnswers[rand2] + ili[1]);
                break;
            case 3:
                msg.channel.send("Думаю я бы ничего из этого не выбрал..");
                break;
        }
    }

    /* !кто */

    function who() {
        who = msg.content.replace("!кто", "").replace(/\s/g, " ").replace("?", "");

        var membersList = msg.guild.members.array().length;
        var randPerson = Math.round(Math.random() * (membersList - 0) + 0);
        var randomPersona = msg.guild.members.array().toString().split(",");
        var whoAnswerList = ["Я думаю, что именно -->", "Конкретном в данном случае:", "Не, ну 100% -->", "Атвечаю -->"];

        msg.channel.send(`${whoAnswerList[Math.round(Math.random() * ((whoAnswerList.length - 1) - 0) + 0)]} ${randomPersona[randPerson]} - ${who}`);
    }

    // Получить список аккаунтов которые имеют роль N и снять роль с них

    async function removeRole() {
        let rname = msg.content.replace("!rr", "").rname.replace(/\s/g, " ").substr(1);

        var mlist = msg.guild.roles.find("name", rname).members.map(m => m.user.id).join(' | ');

        var splitMlist = mlist.split(" | ");
        var countMlist = splitMlist.length;

        for (let i = 0; i < countMlist; i++) {
            msg.guild.members.find('id', splitMlist[i]).removeRole(msg.guild.roles.find("name", rname), "Удаление роли с помощью бота.");
        }

        const test = await msg.channel.send("Loading..");

        let testList = new Discord.RichEmbed().setAuthor("Result: ")
            .addField("Следующие пользователи имели роль: ", mlist)
            .addField("-", "Роль снята.")
            .setColor("#0000fa");

        test.edit(testList);
    }

});