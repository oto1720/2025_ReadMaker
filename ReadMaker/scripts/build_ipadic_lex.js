// Build Vibrato-ready lex.csv and DEFs (UTF-8, no BOM) from MeCab IPADIC (EUC-JP)
// Usage: npm run dic:build-lex
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const baseDir = path.resolve(__dirname, '..', 'native', 'rust', 'dictionaries', 'mecab-ipadic-2.7.0-20070801', 'mecab-ipadic-2.7.0-20070801');
const outLex = path.join(baseDir, 'lex_utf8.csv');
const files = fs.readdirSync(baseDir);

function toUtf8Eol(str) {
  return str.replace(/\r\n|\r|\n/g, '\n');
}

function isIntLike(s) {
  return /^-?\d+$/.test(s);
}

function buildLex() {
  if (fs.existsSync(outLex)) fs.unlinkSync(outLex);
  const csvs = files.filter(f => f.toLowerCase().endsWith('.csv'));
  for (const f of csvs) {
    const buf = fs.readFileSync(path.join(baseDir, f));
    const text = iconv.decode(buf, 'EUC-JP');
    const lines = toUtf8Eol(text).split('\n');
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      const cols = line.split(',');
      if (cols.length < 4) continue;
      const surface = cols[0];
      const left = cols[1];
      const right = cols[2];
      const cost = cols[3];
      if (!isIntLike(left) || !isIntLike(right) || !isIntLike(cost)) continue;
      const rest = cols.length > 4 ? cols.slice(4).join(',') : '';
      // MeCab標準の列順を維持: surface,left,right,cost,features
      const out = `${surface},${left},${right},${cost}${rest ? ',' + rest : ''}\n`;
      fs.appendFileSync(outLex, out, { encoding: 'utf8', flag: 'a' });
    }
  }
  console.log('Wrote', outLex, fs.existsSync(outLex) ? fs.statSync(outLex).size : 0, 'bytes');
}

function convertDef(name) {
  const src = path.join(baseDir, name);
  const dst = path.join(baseDir, name.replace('.def', '_utf8.def'));
  const buf = fs.readFileSync(src);
  const text = iconv.decode(buf, 'EUC-JP');
  fs.writeFileSync(dst, toUtf8Eol(text), { encoding: 'utf8' });
  console.log('Wrote', dst, fs.statSync(dst).size, 'bytes');
}

function main() {
  if (!fs.existsSync(baseDir)) {
    console.error('Dictionary folder not found:', baseDir);
    process.exit(1);
  }
  buildLex();
  for (const n of ['unk.def', 'char.def', 'matrix.def']) convertDef(n);
}

main();
