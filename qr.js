const QRCode = require('qrcode');

// 외부에서 접속하려면 공인 IP 사용
const url = 'http://58.127.241.36:3000/DF/index.html?current=studio-212';

QRCode.toFile('studio-212.png', url, function (err) {
  if (err) throw err;
  console.log('✅ studio-212.png QR코드 생성 완료!');
});
