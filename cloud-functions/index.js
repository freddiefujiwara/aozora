exports.aozora = async (req, res) => {
  const id = req.query.id || req.body.id || '100';
  const callback = req.query.callback || req.body.callback || '';
  const fetch = require('node-fetch');
  let data = JSON.parse(await (await fetch(`http://www.aozorahack.net/api/v0.1/books/${id}`)).text());
  data.html = await (await fetch(`https://wakufactory.jp/densho/font/aozorautf.php?yoko=on&post=Submit&url=${encodeURIComponent(data.html_url)}`)).text();
  data.contents = data.html.split("\n").join()
    .replace(/.*class="main_text">/g, '')
    .replace(/<div class="bibliographical_information.*$/g, '')
    .replace(/<ruby>(.*?)<\/ruby>/g, '')
    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    .split("。");
  res
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', callback ? 'text/javascript' : 'application/json')
    .status(200)
    .send(callback ? `${callback} && ${callback}(${JSON.stringify(data)});` : JSON.stringify(data));
};