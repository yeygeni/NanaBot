"use strict";
const TelegramBot = require('node-telegram-bot-api'),
      fs = require('fs');
let CronJob = require('cron').CronJob;
const token = '460974597:AAFhzgsqKlGbzUgA3xzqUes3J0Ax7nRH2rc';
const bot = new TelegramBot(token, {polling: true});
let token1 = 1111;
let PythonShell = require('python-shell');
let _login=null;
let field=null;
let people = [];
let peopleObject=[];
let list_of_songs = [];
var player = require('play-sound')();
let audio;
let keyboard = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['/count_of_people'],
          ['/searchSong'],
          ['/list_of_songs'],
        ]
      })
  };
let keyboard_admin = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['/play_song','/count_of_people'],
          ['/searchSong','/list_of_songs'],
        ]
      })
  };
let keyboardwithnext = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['/stop_song'],
          ['/play_next'],
          ['/count_of_people'],
          ['/searchSong'],
          ['/list_of_songs'],
        ]
      })
  };  
let keyboard2 = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['/count_of_people'],
          ['/searchSong'],
          ['/list_of_songs'],
          ['/login'],
        ]
      })
  };
class User{
  constructor(id,location){
    this.id=id;
    this.lacation=location;
  }



} 
class Song {

  constructor(name,count,users) {
    this.name = name;
    this.count = count;
    this.users = users;
  }

}
/*
PythonShell.run('script.py', function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});
//let myPythonScriptPath = 'script.py';
//let pyshell = new PythonShell(myPythonScriptPath);
*/

fs.readFile('parserchik.txt', { encoding : 'utf8' },
  (err, data) => {
    if (err) throw err;
    data.split('\n').forEach(line => {

     if ( line.indexOf("Name: " ) != -1){

      list_of_songs.push(new Song(line.split('Name: ')[1],0,[]));
    }
    });
  });


/*
var job = new CronJob('* 20 19 * * *', function() {
  token1= Math.round(Math.random() * (10000 - 1000) + 1000);
  bot.sendMessage(249520503,token1);  
  people.length = 0;
  }, null,
  true, 
  "Europe/Minsk"
);
*/

bot.onText(/\/start/, (msg) => {
  let chatId = msg.from.id;
  if(chatId == 249520503){
    bot.sendMessage(chatId,'Menu',keyboard_admin);
  }
  else if( people.indexOf(chatId) != -1){
    bot.sendMessage(chatId,'Menu',keyboard);

  }
  else{
    bot.sendMessage(chatId,"Menu",keyboard2);    
  }
});

bot.onText(/\/searchSong/, (msg) => {
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


bot.onText(/\/play_song/, (msg) => {
   bot.sendMessage(msg.from.id,'Menu',keyboardwithnext);
   console.log(msg.from.id); 
   let rand = Math.floor(Math.random() * list_of_songs.length);
   audio = player.play(list_of_songs[rand].name, function(err){
       if (err && !err.killed) throw err
    })

});
bot.onText(/\/play_next/, (msg) => {
  if (audio != null) {
  audio.kill();
  }
  let rand = Math.floor(Math.random() * list_of_songs.length);
  audio = player.play(list_of_songs[rand].name, function(err){
       if (err && !err.killed) throw err
    })
});
bot.onText(/\/stop_song/, (msg) => {
    audio.kill();
});

bot.onText(/\/count_of_people/, (msg) => {
  bot.sendMessage(msg.from.id,'Сейчас здесь '+people.length+' человек');
});

bot.onText(/\/list_of_songs/, (msg) => {
  field='';
  let chatId = msg.from.id;
  list_of_songs.sort(function (a, b) {
  if (a.count < b.count) {
    return 1;
  }
  if (a.count > b.count) {
    return -1;
  }
  return 0;
  });
  for (let i = 0; i < list_of_songs.length; i++) {
  var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
          {text:'👍 '+list_of_songs[i].count,callback_data : i}
          ],
        ]
      })
    };
  var adminoptions = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
          {text:'🔈',callback_data : i },
          ]
        ]
      })
    }
  if(chatId == 249520503){
     bot.sendMessage(chatId,list_of_songs[i].name,adminoptions);
     console.log(list_of_songs[i].name);
    
     }
  else{
        bot.sendMessage(chatId,list_of_songs[i].name,options);
        console.log(list_of_songs[i].name);     
     }
}
});
bot.on('callback_query', function (msg) {
  if( people.indexOf(msg.from.id) != -1 && list_of_songs[msg.data].users.indexOf(msg.from.id) == -1 ){
      list_of_songs[msg.data].count++;
      bot.ed
      list_of_songs[msg.data].users.push(msg.from.id);
      console.log(list_of_songs[msg.data].users);
  }
  else if(people.indexOf(msg.from.id) != -1 && list_of_songs[msg.data].users.indexOf(msg.from.id) != -1){
    bot.sendMessage(msg.from.id,'Вы уже голосовали за эту песню');
  }
  else if(msg.from.id == 249520503 ){
    if (audio != null) {
      audio.kill();
    }
      audio = player.play(list_of_songs[msg.data].name, function(err){
        if (err && !err.killed) throw err
      })
  }
  else {
      bot.sendMessage(msg.from.id,'Сначала надо залогинится /login');
  }
});

bot.on('message', (msg) => {
  let chatId = msg.from.id;
  if(field =='login'){
    login(chatId,msg.text)
  }
  if (field == 'search' ) {
    searchSong(chatId,msg.text);
  }   
});
function searchSong(chatId,text){
  if(text){
  let countsongs=0;
  for (let i = 0; i < list_of_songs.length; i++) {
  if(list_of_songs[i].name.indexOf(text) != -1) {
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
          {text:'👍',callback_data : i}
          ],
        ]
      })
    };  
    bot.sendMessage(chatId,list_of_songs[i].name+".Голосов "+list_of_songs[i].count,options);    
    countsongs++;
  }
}

  if (countsongs == 0)  {   
    bot.sendMessage(chatId,'Нет таких песен');
  }

}
  else {
    bot.sendMessage(chatId,'Введите песню');
  }
}

function login(chatId,text){
  if(field  =='login'){
  if(text){
    _login = text;
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
    peopleObject.push(new User(chatId,0));
    bot.sendMessage(chatId,'Menu',keyboard);

  }
  else {
    bot.sendMessage(chatId,"Неверный токен ,спросите у бармена или нажмите /start")
  }
  field=null;
}