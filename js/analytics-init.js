window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-1G6VC4NMYL');

// 利用状況の計測。QRの内容そのものは送らない（プライバシー方針: 入力はサーバーに出さない）
window.trackQR = function (action, params) {
  try {
    gtag('event', action, params || {});
  } catch (e) { /* 計測失敗で機能を止めない */ }
};
