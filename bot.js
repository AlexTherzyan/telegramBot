const telegramBot = require('node-telegram-bot-api');
const request = require('request');
const fixer = require('fixer-api');

const TOKKEN = '524525040:AAFMrNEETq-1g2TwABclW8JWRjQ8NfdzTQQ';

const keyboardClick = {
    currency : 'Курс валют',
    picture : 'Картинка',
    cat: 'cat',
    car: 'car',
    back: 'back'
};
// connect to telegram
const bot = new telegramBot(TOKKEN,{
    polling: true
});

bot.onText(/\/start/, msg =>{
    sendGreeting(msg.chat.id)
});

// обрабатываем нажатия кнопок с клавиатуры
bot.on('message', msg =>{

    switch (msg.text){
case keyboardClick.currency:
    sendCurrencyScreen(msg.chat.id)
    break
case keyboardClick.picture:
    sendPicture(msg.chat.id) // определяем в какой чат нам нужно передать
    break
case keyboardClick.cat:
    break
case keyboardClick.car:
    break
case keyboardClick.back:
    sendGreeting(msg.chat.id,false)
    break

}

})

// обрабатываем нажатия кнопок inline клавиатуры
bot.on('callback_query', query =>{
    const base = query.data
    const symbol = 'RUB' //BYN

    // всплывающее сообщение
    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text: `Вы выбрали ${base}`
    })
    //http://data.fixer.io/api/latest?symbols=${symbol}&base=${base}&access_key=91f6c9250867b8b4badb15c009f66c86
    request(`http://api.fixer.io/latest?symbols=${symbol}&base=${base}`, (error,response,body) =>{

        if(error) throw new Error(error)
        // если успешный запрос
        if(response.statusCode === 200){
            // парсим
            const currencyData = JSON.parse(body)
            //console.log(currencyData)

            const html = `<b>$1 ${base} </b> - <em>${currencyData.rates[symbol]} ${symbol}</em>`
            bot.sendMessage(query.message.chat.id,html, {
                parse_mode: 'HTML' // говорим боту что передаем данные в html
            })
        }
   })
    //console.log(JSON.stringify(query,null,2))

})

function sendPicture(chatId) {
    bot.sendMessage(chatId,'Change picture type', {
        reply_markup:{  //отправляем клавиатуру
            keyboard:[
                [keyboardClick.cat, keyboardClick.car],
                [keyboardClick.back]
            ]
        }
    })
}

function sendGreeting(chatId, sayHello = true,) {
    const text = sayHello
        ? 'Hello from WebStorm'
        : 'Что вы хотите Сделать?';
    bot.sendMessage(chatId,text, {
        reply_markup:{  //отправляем клавиатуру
            keyboard:[
                [keyboardClick.currency, keyboardClick.picture]
            ]
        }
    })

}


function sendCurrencyScreen(chatId) {

    bot.sendMessage(chatId, 'Выберите тип валюты', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Доллар',
                        callback_data: 'USD'
                    }
                ],
                [
                    {
                        text: 'Евро',
                        callback_data: 'EUR'
                    }
                ]
            ]
        }
    })
}














