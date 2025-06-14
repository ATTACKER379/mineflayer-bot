const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
let bot;

const config = {
  host: 'play.pika-network.net',
  port: 25565,
  version: '1.12', // yoki kerakli versiyani yozing
  username: 'attacker_yt',
  loginPassword: '88a88a88',
  controller: 'mineside'
};

function startBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    version: config.version,
    username: config.username,
    auth: 'offline'
  });

  bot.on('messagestr', (message) => {
    console.log('📨 Chat:', message);
    if (message.toLowerCase().includes('/register')) {
      bot.chat(`/register ${config.loginPassword} ${config.loginPassword}`);
    }
    if (message.toLowerCase().includes('/login')) {
      bot.chat(`/login ${config.loginPassword}`);
    }
  });

  bot.once('spawn', () => {
    console.log('✅ Bot serverga kirdi');

    setTimeout(() => {
      bot.chat('/skyblock');
      console.log('📦 /skyblock buyruq yuborildi');
    }, 3000);
  });

  // Skyblock GUI ochilganda uni tanlaydi
  bot.on('windowOpen', async (window) => {
    const slot = window.slots.find(item => item && item.name.toLowerCase().includes('skyblock'));
    if (slot) {
      try {
        await bot.clickWindow(slot.slot, 0, 0);
        console.log('✅ Skyblock GUI tanlandi');
      } catch (err) {
        console.log('❌ Skyblock slot tanlashda xato:', err.message);
      }
    }
  });

  // Skyblock'ga o‘tib bo‘lgach
  bot.on('spawn', () => {
    setTimeout(() => {
      bot.chat('/is visit mineside');
      console.log('🌍 /is visit mineside yuborildi');
    }, 7000);

    // Har 60 sekundda sakrash
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 60000);
  });

  // O‘lsa yana visit qiladi
  bot.on('death', () => {
    console.log('💀 Bot o‘ldi, qayta /is visit mineside');
    setTimeout(() => {
      bot.chat('/is visit mineside');
    }, 5000);
  });

  // Nazorat qilish (chat orqali buyruqlar)
  bot.on('chat', (username, message) => {
    if (username === config.controller) {
      if (message.startsWith('+ ')) {
        const msg = message.slice(2);
        bot.chat(msg);
      } else if (message === 'tpat1') {
        bot.chat(`/tpa ${config.controller}`);
      }
    }
  });

  // Har doim eng yaqin playerga qarasin
  bot.on('physicTick', () => {
    const target = bot.nearestEntity(e => e.type === 'player');
    if (target) {
      const pos = target.position.offset(0, target.height, 0);
      bot.lookAt(pos);
    }
  });

  bot.on('end', () => {
    console.log('🔁 Bot serverdan chiqdi. Qayta ulanmoqda...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', err => {
    console.log('❌ Bot xatolik berdi:', err.message);
  });
}

startBot();

// Web server (Uptime uchun)
app.get('/', (req, res) => {
  res.send('✅ Bot ishlayapti!');
});

app.listen(3000, () => {
  console.log('🌐 Web server ishga tushdi (port 3000)');
});
