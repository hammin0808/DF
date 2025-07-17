const QRCode = require('qrcode');

const urls = [
  'https://df-3r3k.onrender.com/?studio=2-3',
  'https://df-3r3k.onrender.com/?studio=1-2',
  'https://df-3r3k.onrender.com/?studio=2-11'
];

urls.forEach(url => {
  const params = new URL(url).searchParams;
  const studio = params.get('studio');
  QRCode.toFile(`qr-${studio}.png`, url, function (err) {
    if (err) throw err;
    console.log(`QR for ${url} saved!`);
  });
});