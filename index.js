const qrcode = require('qrcode-terminal');
const fs = require("fs");
const { Client, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');    // youtube
const readline = require('readline');   //manual
const path = require("path"); //manual

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  }
});



client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

/*********************************************************************************************************** */
var rmsg = `Brother, currently you can download  youtube videos 📽️ only with this bot 🤖.

Just type

youtube URL_OF_VIDEO

e.g,

youtube https://youtu.be/dX4Uk8QMiAs


Contact Mazan👦 for more details ♥️🇵🇰`;
/*********************************************************************************************************** */

client.on('message', message => {
  console.log(message.body);
});

client.on('message', message => {
  var foo = message.body;
  foo = foo.substring(0,7);
  if (foo === "youtube") {
    message.reply("hosla ustaad g! video send horhi hai 😍😍");
  }else{
    message.reply(rmsg);
  }
});

client.on('message', async msg => {
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    // do something with the media data here
    // console.log(
    //     media,
    //     media.mimetype,
    //     media.filename,
    //     media.data.length
    //   );
    fs.writeFile(
      "./upload/" + Date.now() + ".jpg",
      media.data,
      "base64",
      function (err) {
        if (err) {

          console.log(err);
        }
      }
    );
  }
});

client.on('ready', () => {
  console.log('Client is ready!');

  // Number where you want to send the message.
  const number = "+923061695230";

  // Your message.
  const text = "helo mazan! I am online.";

  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
  const chatId = number.substring(1) + "@c.us";

  // Sending message.
  client.sendMessage(chatId, text);

});


// Replying Messages with image from url
client.on("message", async (message) => {
  if (message.body === "url") {
    var src = "https://rr5---sn-5hnekn7z.googlevideo.com/videoplayback?expire=1655583018&ei=ytytYpC1Ho6JhwbX3KT4DA&ip=209.107.204.189&id=o-AAgwFxU9SMRAlF-GDHZIUHntCtIN3YPZsrZRv2ZAb-U2&itag=134&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=youtube&requiressl=yes&spc=4ocVC7YLHpDh8Qiq_MVHoyjOwq4gaMY&vprv=1&mime=video%2Fmp4&ns=3bvon723W0IUcCaNFFpcMbMG&gir=yes&clen=1672667&otfp=1&dur=21.066&lmt=1620029996591052&keepalive=yes&fexp=24001373,24007246&c=WEB&n=dOkOpLLsYQGrqw&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAOWvtSsirO9GOncpY9c9_sSgMcOy_WUzNkihHgYQL6qpAiB3C5d3qcldgtSq9IcEignFxyA_D8ijGDIJpoYsp_zBTA%3D%3D&redirect_counter=1&cm2rm=sn-hp5y676&req_id=f24986363c61a3ee&cms_redirect=yes&cmsv=e&mh=qQ&mip=206.84.182.52&mm=34&mn=sn-5hnekn7z&ms=ltu&mt=1655569776&mv=u&mvi=5&pl=15&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAKp4IE6Cgceyg1t6pGUVAItdcxY8yTLEHiEi35VnU_B5AiB3EeWpVndaFAcZyQdtTUUB9UXesre8c4AjYn6vUhMQ0A%3D%3D"
    //get media from url
    const media = await MessageMedia.fromUrl(
      src, { unsafeMime: true }
    );

    //replying with media
    client.sendMessage(message.from, media, {
      caption: "meme",
    });
  }
});


// replying message with image from our own pc
client.on("message", async (message) => {
  var foo = message.body;
  foo = foo.substring(0,7);
  if (foo === "youtube") {
    var downloadPath = Date.now();
    var url = message.body.slice(8);
    
    const output = path.resolve(__dirname, './temp_files/' + downloadPath + '.mp4');
    const video = ytdl(url);

    if (ytdl.validateURL(url)) {
      console.log("Video Url Ok"); video.pipe(fs.createWriteStream(output));
      video.once('response', () => {
        starttime = Date.now();
      });
      video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout, 0, -1);
      });
      video.on('end', () => {
        process.stdout.write('\nDownload complete, now sending to user...\n\n');
        const media = MessageMedia.fromFilePath('./temp_files/' + downloadPath + '.mp4');
        client.sendMessage(message.from, media);
        client.sendMessage(message.from, 'aa lo ustad g, aur koi hukm mery laiq 🙇‍♂️🙇‍♂️');
      });


    } else {
      client.sendMessage(message.from, "Bhai link theek bhejo 🙏🏻🙏🏻");
      
    }



  }
});


