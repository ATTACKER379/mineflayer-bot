const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
let bot;

const config = {
  host: 'hypixel.uz',
  port: 25566,
  version: '1.12',
  username: 'AT_OROL_1',
  password: 'abdu2006',
  loginPassword: '1234444', // agar login komandasi boshqa parol bilan bo‘lsa
  controller: 'ATTACKER'
};

function startBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    version: config.version,
    username: config.username
  });

  bot.on('messagestr', (message) => {
    console.log(message);
   
    if (message.includes('/login')) {
      bot.chat(/login ${config.loginPassword});
    }
  });

  bot.on('chat', (username, message) => {
    if (username === config.controller) {
      if (message.startsWith('+ ')) {
        const toSay = message.replace('+ ', '');
        bot.chat(toSay);
      } else if (message === 'tpat1') {
        bot.chat(/tpa ${config.controller});
      }
    }
  });

  bot.on('physicTick', () => {
    const playerEntity = bot.nearestEntity(entity => entity.type === 'player');
    if (!playerEntity) return;
    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
  });

  bot.on('death', () => {
    bot.chat('/back');
    bot.chat(/w ${config.controller} AT_OROL_1 uldi);
  });

  bot.on('spawn', () => {
    console.log('✅ Bot spawn bo‘ldi!');
    // har 5 sekundda sakrash
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 5000);

    // /is warp farm komandasi
    setTimeout(() => {
      bot.chat('/is warp farm');
      console.log('/is warp farm komandasi yuborildi');
    }, 5000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot serverdan chiqdi. Qayta ulanmoqda...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', err => {
    console.log('❌ Bot xatolik berdi:', err.message);
  });
}

// Botni ishga tushiramiz
startBot();

// UptimeRobot uchun web server
app.get('/', (req, res) => {
  res.send('✅ Bot ishlayapti!');
});
app.listen(3000, () => {
  console.log('🌐 Web server ishga tushdi (port 3000)');
});
