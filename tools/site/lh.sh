#!/bin/sh
# Lab ölçümü (Lighthouse, mobil öykünme, yerel Chrome): sh tools/site/lh.sh <base_url> <çıktı_dizini>
# Aynı makine/ağ; her URL 3 tekrar. Sonuç lab verisidir, saha (CrUX) değildir.
BASE="${1:?base url}"; OUT="${2:?çıktı}"; mkdir -p "$OUT"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for p in / /en /demo/demo /demo/demo-en; do
  n=$(echo "$p" | tr '/' '_'); [ "$n" = "_" ] && n=_root
  for i in 1 2 3; do
    npx -y lighthouse@12 "$BASE$p" --quiet --only-categories=performance --chrome-flags="--headless=new" \
      --output=json --output-path="$OUT/$n-$i.json" >/dev/null 2>&1 || echo "BLOCKED $p $i"
  done
done
node -e '
const fs=require("fs"),d=process.argv[1];const r={};
for(const f of fs.readdirSync(d).filter(f=>f.endsWith(".json"))){const j=JSON.parse(fs.readFileSync(d+"/"+f));const k=f.replace(/-\d\.json$/,"");
 (r[k]=r[k]||[]).push({score:j.categories.performance.score,lcp:j.audits["largest-contentful-paint"].numericValue,cls:j.audits["cumulative-layout-shift"].numericValue,tbt:j.audits["total-blocking-time"].numericValue,bytes:j.audits["total-byte-weight"].numericValue});}
const med=a=>a.sort((x,y)=>x-y)[Math.floor(a.length/2)];const s={};
for(const[k,v]of Object.entries(r))s[k]={n:v.length,score:med(v.map(x=>x.score)),lcp_ms:Math.round(med(v.map(x=>x.lcp))),cls:+med(v.map(x=>x.cls)).toFixed(3),tbt_ms:Math.round(med(v.map(x=>x.tbt))),kb:Math.round(med(v.map(x=>x.bytes))/1024)};
fs.writeFileSync(d+"/ozet.json",JSON.stringify(s,null,1));console.log(JSON.stringify(s));' "$OUT"
