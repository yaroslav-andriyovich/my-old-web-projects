// - - - - - - - MEGA GROUP - - - - - - -

const { VK } = require('vk-io');
const FS = require('fs');
const needle = require('needle');
const cheerio = require('cheerio');
const querystring = require('querystring');
var CronJob = require('cron').CronJob;

const GROUP = new VK({
	token: '#TOKEN#'
}); // Авторизируем группу

const CONFIG_FILE = "./jsons/bot_config.json"; // Файл для хранения разных значений
let config = JSON.parse(FS.readFileSync(CONFIG_FILE, 'utf8'));

const ANSWER_DB_FILE = "answer_database2.txt"; // База для общения вопрос\ответ
let AnswerDB = FS.readFileSync(ANSWER_DB_FILE, 'utf8').split("\n");

if (!AnswerDB)
{
    console.debug("Error: AnswerDB is incorrect!"); // Если не не удалось загрузить базу или она пуста
    return;
}

const PREFIX = "мега"; // Ключевое первое слово, на которое бот будет реагировать
const PREFIX_REGEXP_START = new RegExp(`^${PREFIX}?.\\s`, "i"); // Вырезать слово в начале
const START_EMOJI = "💬 ";

// - - - - - - - P R O C E D U R E S - - - - - - -

// Очистка текста от лишних символов
function ClearText(text)
{
    return text.toLowerCase().replace(/[^a-zA-Z +-0-9а-яА-ЯіїєІЇЄ]/ig, '').trim();
}

// Рандомное число от min до max включитьельно
function Random(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

// Получение даты и времени в красивом виде по местному времени
function GetLocalTime(europeCity, time = undefined)
{
    if (!time)
        time = new Date();
    
    time = time.toLocaleString('ru-RU',
    {
        timeZone: `Europe/${europeCity}`
    }).split(",");

    return `📅 ${time[0]} | ⌚ ${time[1]}`;
}

// Вызываем при получении нового сообщения
async function OnNewMessage(context)
{
    // let TIMER = new Date().getTime();
    // Игнорим если автор не юзер или сообщение пустое
    if (context.senderType != "user" || !context.text)
        return;

    // console.debug(context);
    // console.debug(`[${context.senderId}]: ${context.text}`);
    
    // Игнорим если ключевое слово вхождения не найдено
    if (!(PREFIX_REGEXP_START.test(context.text)))
        return;

    let text = context.text.replace(PREFIX_REGEXP_START, "").replace(/\?/g, "").trim();

    // Игнорим если после удаления ключевого слова текст пустой
    if (!text)
        return;

    // if (!(await GROUP.api.groups.isMember( { user_id: context.senderId, group_id: 166188343 } ))) // Игнор если юзер не состоит в группе
    //     return;

    // Перебор комманд
    for(cmd in commands)
    {
        // Ищем наличие ключевых слов команд в тексте
        if (await commands[cmd].findKey(text, context))
            return ++config.sent;
    }

    // Если это не одна из команды, запускаем сравнение текста со строками БД
    let req = await RequestForText(text);
    // console.debug(`Question(User): ${text}`);
    // console.debug(`Answer: ${req}`);
    context.reply(req);
    // context.reply(req + "\n\nВремя обработки сообщения: " + (new Date().getTime() - TIMER).toString() + "мс.");
    ++config.sent;
}

async function RequestForText(text) // Ищем схожесть в тексте и вопросах из БД users.sort((a, b) => a.firstname.localeCompare(b.firstname))
{
    let answers = []; // Возможные ответы
    text = ClearText(text);  // Очищаем строку от ненужных символов
    let splitedText = text.split(" "); // Разбиваем текст на массив слов

    AnswerDB.forEach((str, index) => // Перебор строк из базы
    {
        let coincidencesCount = 0; // Кол-во совпадений в тек. строке
        str = str.split("\\")[0]; // Очищаем строку от ненужных символов

        splitedText.forEach(word => // Перебор вопроса юзера
        {
            if (str.includes(word)) // Если слово есть в вопросе базы
                ++coincidencesCount; // Добавляем совпадение
        });        

        if ((coincidencesCount > 0) && splitedText.length == str.split(" ").length) // Проверяем схожесть по кол-ву слов в строках
                ++coincidencesCount;

        if (coincidencesCount > 0) // Вносим строку в вариант ответа
            answers.push([coincidencesCount, index]);
    });

    let max = 0; // Максимальное кол-во совпадений

    answers.forEach(count => // Перебор вариантов ответа
    {
        if (count[0] > max) // Находим самое большое кол-во совпадений
        {
            max = count[0]; // Кол-во совпадений
            answerIndex = count[1]; // Индекс строки с ответом из базы
        }
    });

    answers = answers.filter(a => a[0] >= max); // Оставляем только варианты с наибольшим совпадением

    // console.log("Max cincidences count: " + max);
    // console.log("Answers count: " + answers.length);

    let answer;

    if (!max) // Если не найдено ни одного ответа в базе
        answer = GetRandomAnswer(AnswerDB).split("\\")[1]; // Отправляем рандомный ответ из базы
    else
    {
        answer = AnswerDB[GetRandomAnswer(answers)[1]];
        // console.debug("Question(DB): " + answer.split("\\")[0]);
        answer = answer.split("\\")[1].trim(); // Берём ответ из строки базы
    }

    answer = answer[0].toUpperCase() + answer.slice(1);

    if (!(/[.!?()]$/i.test(answer)))
        answer += ".";
    
    return answer;
}

function GetRandomAnswer(arr) // Возвращает рандомное значение из массива
{
    return arr[Random(0, arr.length - 1)];
}

async function GetUserInfo(userID) // Возвращает информацию о пользователе по айди
{
    return GROUP.api.users.get( { fields:'first_name,last_name,id,city,bdate,counters,domain,followers_count,photo_id', user_ids: userID } );
}

async function GetUserID(damain) // Возвращает айди юзера по домену
{
    return GROUP.api.utils.resolveScreenName( { screen_name: damain });
}

async function GetPhotosInAlbum(album_url, count = undefined)
{
    album_url = album_url.split("_");

    return (await GROUP.api.photos.get(
        {
            owner_id: album_url[0],
            album_id: album_url[1],
            count: count || 500,
            access_token: "#TOKEN_MEGA_PAGE_NO_GROUP#" // mega user
        }
    )).items;
}

// - - - - - - - C O M M A N D S - - - - - - -

let commands = []; // Массив всех команд
let Command = function (key, func) // Прототип команды
{
    this.key = key; // Регулярное выражение для нахождения команды в тексте
    this.execute = func; // Процедура которая будет запущена если в тексте найдена команда
    this.findKey = async (text, context) => // Поиск команды в тексте
    {
        if (this.key.test(text)) // Если команда найдена в тексте
        {
            await this.execute(text, context); // Выполнение команды
            return true; // Команда найдена
        }
        
        return false; // Команда не найдена
    };
    this.removeKey = (text) => // Удаление команды из текста
    {
        return text.replace(this.key, "").trim();
    };

    commands.push(this); // Автоматическое внесение команды в массив команд после создания
};

new Command(/^(команды|help|помощь|что\sты\s(умеешь|можешь).?)/i, async function(text, context) // Получение списка команд
{
    context.reply("📜 Список того, что я могу\n📄 https://vk.com/topic-166188343_40003425");
});

new Command(/^скажи/i, async function(text, context) // Скажи *текст*
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        let answers = [
            "Ты забыл/а написать чего мне надо сказать!",
            "Чего сказать?",
            "Мне нечего сказать."
        ];
        context.reply(`⚠ ${GetRandomAnswer(answers)}`);
        return;
    }
    context.send(START_EMOJI + text);
});

new Command(/^(за|о)цени/i, async function(text, context) // Получение оценки чего-либо
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        let answers = [
            "Ты забыл/а написать чего мне надо заценить!",
            "Чего мне заценить?",
            "Мне нечего оценивать."
        ];
        context.reply(`⚠ ${GetRandomAnswer(answers)}`);
        return;
    }

    let answers = [
        "Моя оценка:",
        "Тянет на",
        "Наверное..",
        "Поставлю в этот раз"
    ];
    context.reply(`🛃 ${GetRandomAnswer(answers)} ${Random(0, 12)} баллов.`);
});

new Command(/^монетка/i, async function(text, context) // Решка или Орел
{
    context.reply((Random(0, 1) == 0) ? "⏺ Решка" : "🦅 Орёл");
});

new Command(/^рандом/i, async function(text, context) // Рандом от min до max
{
    text = text.match(/-?\d+/g);

    if (!(/\d+.+\d+/g.test(text)) || isNaN(text[0]) || isNaN(text[1]))
    {
        context.reply("⚠ Введены некорректные числа!\nПример: Мега, рандом 0 100 (0 - min, 100 - max)");
        return;
    }

    context.reply(`🎲 ${(Random(parseInt(text[0]), parseInt(text[1])))}`);
});

new Command(/(врем(я|ени)|который\sчас)/i, async function(text, context) // Получение времени
{
    let moscow = GetLocalTime("Moscow");
    let kiev = GetLocalTime("Kiev");
    context.reply(`🇺🇦 Київ: ${kiev}\n🇷🇺 Москва: ${moscow}\n`);
});

async function GetCreatedDateForVKUser(id, context) // Процедура получения даты регистрации страницы
{
    await needle.get(`https://vk.com/foaf.php?id=${id}`, function(error, res) 
    {
        if (error || res.statusCode != 200)
            return context.reply("❌ Parsing error. (Error or StatusCode)");

        let xml = res.body.split("\n");

        for (let str in xml)
        {
            if (xml[str].includes("<ya:created dc:date="))
            {
                let date_string = xml[str].match(/".+?"/)[0].replace(/"/g, "").trim();
                let date = new Date(date_string);
                
                context.reply(`🔙 [id${id}|Страница] была создана ${Math.floor(((new Date().getTime() - date.getTime()) / 86400000)).toString()} дней назад.
                \nТочная дата: ${GetLocalTime("Moscow", date)}`);
                return;
            }
        }

        return context.reply("❌ Parsing error. (Date not found)");
    });
}

new Command(/^(креатед|created)/i, async function(text, context) // Получение даты регистрации страницы
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        await GetCreatedDateForVKUser(context.senderId, context);
        return;
    }

    let user = await GetUserID(text.replace(/.+com\//i, "").replace(/\s.*/i, "").trim());

    if (!user.type)
    {
        context.reply("❌ Пользователь не найден.");
        return;
    }
    else if (user.type != "user")
    {
        context.reply("⚠ Нужно вводить айди пользователя, а не группы :/");
        return;
    }
    
    await GetCreatedDateForVKUser(user.object_id, context);
});

new Command(/^(транслит|translit)/i, async function(text, context) // Перевод текста в транслит
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply("📛 После слова |транслит| -> пишешь текст, раскладку которого нужно перевести.");
        return;
    }

    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }, n_str = [];
    
    text = text.replace(/[ъь]+/g, '').replace(/й/g, 'i');
    
    for ( var i = 0; i < text.length; ++i )
    {
        n_str.push(
            ru[ text[i] ]
            || ru[ text[i].toLowerCase() ] == undefined && text[i]
            || ru[ text[i].toLowerCase() ].toUpperCase()
        );
    }
    
    text = n_str.join('');

    context.reply(START_EMOJI + text);
});

new Command(/^знп/i, async function(text, context) // Возвращает перевёрнутый текст
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply("⚠ Ты забыл/а написать чего мне надо закинуть в реверс!");
        return;
    }

    context.reply(START_EMOJI + text.split("").reverse().join(""));
});

new Command(/.+\sили\s.+/i, async function(text, context) // Выбирает что-то одно между *или*
{
    let regexpI = /^\s?я\s/ig;
    let regexpYOU = /^\s?ты\s/ig;

    text = text.split("или");

    for (let t in text)
    {
        if (regexpYOU.test(text[t]))
            text[t] = text[t].replace(regexpYOU, "я ");
        else if (regexpI.test(text[t]))
            text[t] = text[t].replace(regexpI, "ты ");
    }

    let answers = ["Я думаю, что лучше", "Пусть будет", "Наверное это", "Я бы выбрал", "Мой ответ"];

    context.reply(`⚖ ${GetRandomAnswer(answers)}: ${GetRandomAnswer(text)}`);
});

new Command(/^кто/i, async function(text, context) // Возвращает рандомного участника беседы или информацию из подкомманд
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply(`⚠ Кто-что? Где? Когда?!`);
        return;
    }
    
    if (/^я.?$/i.test(text)) // Возвращает информацию о странице задающего вопрос
    {
        let user = (await GetUserInfo(context.senderId))[0];
        let answer = `📋 Информация о [id${user.id}|твоём] аккаунте:\n\n🆔ID: ${user.id}\n📎Домен: ${user.domain}`;

        if (user.bdate) 
            answer += `\n🚼Дата рождения: ${user.bdate}`;
        if (user.followers_count) 
            answer += `\n🚻Подписчиков: ${user.followers_count}`;            
        if (user.city) 
            answer += `\n🏙Город: ${user.city.title}`;
        if (user.home_town) 
            answer += `\n🌃Родной город: ${user.home_town}`;
        if (user.country) 
            answer += `\n🏳‍🌈Страна: ${user.country}`;
        if (user.counters.albums) 
            answer += `\n\n📚Кол-во альбомов: ${user.counters.albums}`;
        if (user.counters.videos) 
            answer += `\n🎬Кол-во видосов: ${user.counters.videos}`;
        if (user.counters.audios) 
            answer += `\n🎵Кол-во аудиозаписей: ${user.counters.audios}`;
        if (user.counters.photos) 
            answer += `\n🏖Кол-во фоточек: ${user.counters.photos}`;
        if (user.counters.friends) 
            answer += `\n👥Кол-во друзей: ${user.counters.friends}`;
        if (user.counters.online_friends) 
            answer += `\n🚸Кол-во друзей в онлайне: ${user.counters.online_friends}`;
        if (user.counters.groups) 
            answer += `\n🛐Кол-во групп: ${user.counters.groups}`;
        if (user.counters.posts) 
            answer += `\n🆕Кол-во постов: ${user.counters.posts}`;
        if (user.counters.gifts) 
            answer += `\n🎁Кол-во подарков: ${user.counters.gifts}`;

        context.reply(answer);
        return;
    }
    else if (/^ты.?$/i.test(text)) // Говорит что он бот
    {
        context.reply("🌚 Я мега бот! Помимо того, что я могу общаться почти как реальный человек - я также могу выполнять и другие команды!");
        return;
    }
    else if (/^(тебя\s(родил|создал|разработал)|(твой|твои)\s(отец|батя|папа|создатель|разработчик|родител)).?$/i.test(text)) // Возвращает создателя
    {
        context.reply("👤 Мой создатель: [id245855787|Yaroslav Andreev]");
        return;
    }

    try // Try/Catch - нужен в случае, если боту не выдали права администратора
    {
        let chat_members = (await GROUP.api.messages.getConversationMembers( { peer_id: context.peerId })).profiles;

        let random_member = chat_members[Random(0, chat_members.length - 1)];
        
        let answers = [
            "Я думаю это",
            "Сто пудов это",
            "Конечно же это",
            "Кто же это? Это же",
            "Прикинь! Походу это",
        ];
        context.reply(`👁‍🗨 ${GetRandomAnswer(answers)}: ${random_member.first_name} ${random_member.last_name} (https://vk.com/id${random_member.id})`);
    }
    catch
    {
        context.reply(`🚧 Для получения списка пользователей беседы нужны права администратора! Потому, предоставтье мне их.`);
    }
});

new Command(/^инфа/i, async function(text, context) // Возвращает рандомный шанс в процентах
{
    context.reply(`⚛ Вероятность: ${Random(0, 130)}%`);
});

new Command(/^(\[\id\\b+|.+])/i, async function(text, context) // Говорит да/нет/не знаю при вопросе "Мега, @user *текст*?"
{
    let answers = [
        "Да :D",
        "Не знаю :(",
        "Нет."
    ];

    context.reply(`👻 ${GetRandomAnswer(answers)}`);
});

new Command(/^когда/i, async function(text, context) // Говорит когда случится событие
{
    let rand = Math.random();
    let days = Random(1, (rand < 0.5) ? 50 : (rand >= 0.5 && rand <= 0.7) ? 250 : 500);
    let hours = Random(0, 23);
    let minutes = Random(0, 59);
    let seconds = Random(0, 59);
    let date = new Date();
    let new_date = GetLocalTime("Moscow", new Date((date.setDate(date.getDate() + days)))).split(" ");
    
    context.reply(`⏳ Событие произойдет через ${days} дней.
    \nТочная дата события: ${new_date[0]} ${new_date[1]} | ⌚ ${(hours <= 9) ? "0" + hours : hours}:${(minutes <= 9) ? "0" + minutes : minutes}:${(seconds <= 9) ? "0" + seconds : seconds} по МСК.`);
});

new Command(/^погода/i, async function(text, context) // Находит погоду по конкретному городу
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply(`⚠ Не правильно ты Вася погоду узнаешь! Почитай тут как надо: https://vk.com/@megabot_club-pagoda`);
        return;
    }

    text = text.trim();
    
    let weather_request = querystring.stringify(
    { 
        appid: "#openweathermap_app_id#",
        mode: "json",
        lang: "ru",
        units: "metric",
        cnt: "20",
        q: text
    });

    await needle.get(`http://api.openweathermap.org/data/2.5/forecast?${weather_request}`, function(error, res) 
    {
        if (error || res.statusCode != 200 || res.body.cod != "200")
            return context.reply("❌ Страна/Город не найден.");

        let city = res.body.city;
        let city_info = `🌐 Город: ${city.name}\n🚩 Страна: ${city.country}\n🌄 Восход солнца: ${GetLocalTime("Moscow", new Date(city.sunrise*1000))}\n🌅 Закат солнца: ${GetLocalTime("Moscow", new Date(city.sunset*1000))}`;

        let wlist = res.body.list;
        let other = "";

        wlist.forEach(o =>
        {
            if (o.dt_txt.split(" ")[1].startsWith(15))
            {
                other += `\n\n📅 Дата: ${o.dt_txt}\n🌡 Температура: ${Math.floor(o.main.temp)} °С\n♨ Атм.Давление на ур. моря: ${Math.floor(o.main.sea_level)} hpa\n💧 Влажность: ${o.main.humidity}%\n📜 Описание: ${o.weather[0].description}\n☁ Облачность: ${o.clouds.all}%\n🌪 Скорость ветра: ${o.wind.speed} м/с`;
            }
        });
        
        context.reply(`${city_info}\n${other}`);
    });
});

new Command(/^статус/i, async function(text, context) // Выводит текущий статус
{
    context.reply(`♻ Я обработал уже ${config.sent} сообщений!`);
});

// - - - - - - - Команда поиска фото  - - - - - - -

const PhotoElement = function(key, text, ids, count = undefined) // Позволяет добавить новый объект для поиск фотографий
{
    this.key = key; // Регулярное выражение объекта
    this.text = text; // Возвращаемый текст
    this.ids = ids; // Массив айдишников альбомов
    this.count = count;
};

let photo_elements = [ // Массив фото-элементов для перебора всех объектов
    new PhotoElement(/лис/i, "🦊 Держи лися :3", ["-154332271_254183799", "-154332271_251104512"]),
    new PhotoElement(/ко(т|шк)/i, "🐈 Держи котю :3", ["-23300841_140078617", "-33621085_164135136", "-33621085_149514761"]),
    new PhotoElement(/соба(к|ч)|пса|пес|пёс/i, "🐶 Держи пёселя :3", ["-64071719_257962649", "-54147255_257371399", "-54147255_257322126"]),
    new PhotoElement(/енот/i, "🦝 Держи енотика :3", ["-156058801_249018370", "-29290939_177484881"]),
    new PhotoElement(/((танк)?тастик|tanktastic)/i, "📱 Любителям тастика посвящается..", ["-56842466_227123664", "-56842466_218094633", "-50012518_170259816", "-56842466_189303835", "-56842466_178482029"])
];

new Command(/^фото/i, async function(text, context) // Выводит текущий статус
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply(`⚠ Фото кого?`);
        return;
    }

    let photo_element;

    for (let p in photo_elements) // Перебор всех фото-элементов
    {
        if (photo_elements[p].key.test(text)) // Если юзер хочет найти фото этого объекта
        {
            photo_element = photo_elements[p]; // Указываем на этот объект
            break;
        }
    }

    if (!photo_element) // Если запрашиваемый объект отсутствует в массиве
        return context.reply("❌ Я не умею такое показывать.. Прости :(\n\nПодробнее: https://vk.com/@megabot_club-command-photo");

    let photo = GetRandomAnswer(await GetPhotosInAlbum(GetRandomRandomAnswer(photo_element.ids), photo_element.count)); // Получаем рандомное фото с рандомного альбома запрашиваемого элемента

    context.reply(
        photo_element.text,
        {
            attachment: `photo${photo.owner_id}_${photo.id}` // Отправляем фото
        }
    );
});

new Command(/^факт/i, async function(text, context) // Выводит текущий статус
{
    await needle.get(`https://randstuff.ru/fact/`, function(error, res) 
    {
        if (error || res.statusCode != 200)
            return console.debug("RANDSTUFF PARSING ERROR!");

        var $ = cheerio.load(res.body);

        context.reply("🔔 " + ($("#fact")[0].children[0].children[0].children[0].children[0].children[0].data));
    });
});

new Command(/^мудрость/i, async function(text, context) // Выводит текущий статус
{
    await needle.get(`https://randstuff.ru/saying/`, function(error, res) 
    {
        if (error || res.statusCode != 200)
            return console.debug("RANDSTUFF PARSING ERROR!");

        var $ = cheerio.load(res.body);

        context.reply("👨‍💼 " + ($("#saying")[0].children[0].children[0].children[0].children[0].children[0].data));
    });
});

new Command(/^(посчитай|калькулятор|сколько\sбудет\s)/i, async function(text, context) // Выводит текущий статус
{
    text = this.removeKey(text);

    if (text.length <= 0)
    {
        context.reply(`⚠ Введены некорректные данные для калькулятора.`);
        return;
    }

    text = text.replace(/[^+-/*\d()]/ig, '').trim();

    try
    {
        context.reply("✨ Ответ: " + eval(text));
    }
    catch
    {
        context.reply(`⚠ Введены некорректные данные для калькулятора.`);
    }
});

// - - - - - - - C R O N S - - - - - - - // Выполнение раз в N времени

new CronJob('0 */10 * * * *', function()
{
    GROUP.api.status.set( // обновление статуса сообщества
        { 
            text: `${GetLocalTime("Moscow")} | 📤: ${config.sent}`,
            group_id: "166188343",
            access_token: "#TOKEN_MAIN_PAGE#" // main
        }
    );

    GROUP.api.status.set( // обновление статуса для страницы
        { 
            text: `${GetLocalTime("Kiev")}`,
            access_token: "#TOKEN_MAIN_PAGE#" // main
        }
    );

    FS.writeFile(CONFIG_FILE, JSON.stringify(config), (err) => { // обновление информации кол-ва отправленных смс
        if (err) console.debug(err);
    });
}, null, true, 'Europe/Moscow');


// - - - - - - - U P D A T E S - - - - - - - // Обработчики событий

GROUP.updates.on('message_new', async (context) => // реакция на новое сообщение
{
	OnNewMessage(context);
});

GROUP.updates.on('chat_photo_update', async (context) => // реакция на смену аватарки чата
{
    context.send(Random(0, 1) ? "🙄 Мне старая ава нравилась больше." : `🛃 Ставлю новой аве ${Random(0, 12)} баллов.`);
});

GROUP.updates.on('chat_invite_user', async (context) => // реакция на нового участника беседы
{
    context.send(`😏 Фсшъъоъоъошшъооо! Ну ка праснулисяяя! [id${context.eventMemberId}|Батя] в здании.`);
});

GROUP.updates.on('chat_kick_user', async (context) => // реакция на кик участника из чата
{
    context.send(`🤨 [id${context.eventMemberId}|Пользователь] покинул нашу беседу :(`);
});

GROUP.updates.start(); // Запуск обработчиков событий