"use strict";
const TelegramBot = require('node-telegram-bot-api'),
      fs = require('fs');
let CronJob = require('cron').CronJob;
const token = '460974597:AAFhzgsqKlGbzUgA3xzqUes3J0Ax7nRH2rc';
const bot = new TelegramBot(token, {polling: true});
let token1 = null;
var PythonShell = require('python-shell');

let _login=null;
let field=null;
let people = [];
let list_of_songs = [];
const player = require('play-sound')();
var audio;
var PythonShell = require('python-shell');
PythonShell.run('script.py', function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});
//let myPythonScriptPath = 'script.py';
//let pyshell = new PythonShell(myPythonScriptPath);

fs.readFile('parserchik.txt', { encoding : 'utf8' },
  (err, data) => {
    if (err) throw err;
    data.split('\n').forEach(line => {

    if ( line.indexOf("Name: " ) != -1){
      list_of_songs.push(line.split('Name: ')[1]);
    }

    });
  });

var job = new CronJob('50 * * * * *', function() {
  token1= Math.round(Math.random() * (10000 - 1000) + 1000);
  bot.sendMessage(249520503,token1);  
  people.length = 0;
  }, null,
  true, 
  "Europe/Minsk"
);


bot.onText(/\/start/, (msg) => {
  let chatId = msg.from.id;
  if( people.indexOf(chatId) != -1){
    bot.sendMessage(chatId,"/count_of_people выводит количество людей в боте, \n /vote голосование за песню");

  }
  else{
    bot.sendMessage(chatId,"/login для того,чтобы залогинится, \n /list_of_songs, \n /count_of_people выводит количество людей в боте  ");    
  }
});

bot.onText(/\/search/, (msg) => {
  field = 'search';
  let chatId = msg.from.id;
  searchSong(chatId);
});

bot.onText(/\/login/, (msg) => {
  let chatId = msg.from.id;
  if( people.indexOf(chatId) != -1){
    bot.sendMessage(chatId,'Вы уже залогинились');
  }
  else{
    field='login';
    login(chatId);
  }
});

var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Кнопка 1', callback_data: '1' }],
  
        ]
      })
    };

bot.onText(/\/count_of_people/, (msg) => {
  bot.sendMessage(msg.from.id,'Сейчас здесь '+people.length+' человек');
});

bot.onText(/\/list_of_songs/, (msg) => {
  let chatId = msg.from.id;
  for (let i = 0; i < list_of_songs.length; i++) {
  var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: list_of_songs[i],  callback_data: list_of_songs[i] }],
  
        ]
      })
    };  
  bot.sendMessage(chatId,i,options);    
}
});
bot.on('callback_query', function (msg) {
 // console.log('ffd');
 // bot.answerCallbackQuery(msg.id, msg.data, false);
  //console.log(msg.data);
  var adr ='/media/iprohorov/ESD-ISO/'+msg.data;
  audio =  player.play(adr, (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });
  bot.sendMessage(msg.from.id,'/media/iprohorov/ESD-ISO/k.mp3');
  bot.sendMessage(msg.from.id,adr);
});
bot.onText(/\/vote/, (msg) => {
  let chatId = msg.from.id;
  if( people.indexOf(chatId) != -1){
    bot.sendMessage(chatId,'Вы можете голосовать,правда пока нет песен :(');
  }
  else {
    bot.sendMessage(chatId,'Сначала надо залогинится /login');
  }
});

bot.on('message', (msg) => {
  let chatId = msg.from.id;
  if(field=='login'){
    login(chatId,msg.text)
  }
  if (field == 'search' ) {
    searchSong(chatId,msg.text);
  }   
});
function searchSong(chatId,text){
   console.log(list_of_songs.indexOf("Name: " + text));

}
function login(chatId,text){
  if(field  =='login'){
  if(text){
    _login=text;
    checkAuth(chatId);
  }
  else {
    bot.sendMessage(chatId,'Введите логин');
  }
}
}

function checkAuth(chatId){
  if(_login == token1){
    bot.sendMessage(chatId,'Вы вошли в систему');
    people.push(chatId);
  }
  else {
    bot.sendMessage(chatId,"Неверный токен ,спросите у бармена или нажмите /start")
  }
  field=null;
}
