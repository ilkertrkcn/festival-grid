#!/usr/bin/env node
/**
 * Festival Grid — Yönetmen Ekleme Aracı
 * Kullanım: node add_director.js
 * ENTRIES'e ekle, çalıştır → directors.json güncellenir → GitHub'a yükle → site güncellenir.
 */

const fs = require('fs');
const path = require('path');
const JSON_FILE = path.join(__dirname, 'directors.json');

// ─── BURAYA EKLE ───────────────────────────────────────────────
const ENTRIES = [
  // {
  //   name: "Yönetmen Adı",
  //   nat: "🇫🇷 Fransa",
  //   films: [
  //     { y: 2023, t: "Film Adı", r: 7.5,
  //       fests: [
  //         { f: "cannes", a: "Palme d'Or", main: 1 },
  //         { f: "oscar", a: "Best Picture nom." }
  //       ]
  //     }
  //   ]
  // },
];
// ───────────────────────────────────────────────────────────────

function run() {
  if (ENTRIES.length === 0) {
    console.log('ENTRIES boş. add_director.js içine yönetmen ekle.');
    process.exit(0);
  }

  const dirs = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  const before = dirs.length;

  for (const entry of ENTRIES) {
    const existing = dirs.find(d => d.name === entry.name);
    if (existing) {
      for (const film of entry.films) {
        const ef = existing.films.find(f => f.y === film.y && f.t === film.t);
        if (!ef) {
          existing.films.push(film);
          console.log(`+ ${entry.name} — ${film.y} ${film.t}`);
        } else {
          for (const fe of film.fests) {
            if (!ef.fests.some(x => x.f === fe.f)) {
              ef.fests.push(fe);
              console.log(`+ ${entry.name} — ${film.t} > ${fe.f}`);
            } else {
              console.log(`= ${entry.name} — ${film.t} ${fe.f} zaten var`);
            }
          }
        }
      }
    } else {
      dirs.push(entry);
      console.log(`+ Yeni yönetmen: ${entry.name}`);
    }
  }

  fs.writeFileSync(JSON_FILE, JSON.stringify(dirs, null, 2));
  console.log(`\nToplam: ${before} → ${dirs.length} yönetmen`);
  console.log('directors.json guncellendi. GitHub a yukle, site guncellenir.');
}

run();
