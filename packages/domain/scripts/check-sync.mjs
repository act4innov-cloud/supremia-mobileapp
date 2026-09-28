/**
 * Vérifie que le cœur de domaine est identique sur les deux branches.
 *
 * Problème : l'application Android (`main`) et la plateforme web (`develop`)
 * consomment le même cœur de domaine. Si les deux branches divergent, chaque
 * cible applique des règles différentes — la plateforme web peut autoriser un
 * export que l'app mobile refuse, ou classer un gaz à un niveau différent.
 * C'est le genre d'écart qui ne se voit qu'en production, sur un rapport de
 * conformité.
 *
 * Ce script compare le contenu du dossier `packages/domain` entre deux
 * références Git et sort en erreur au premier écart.
 *
 *   node packages/domain/scripts/check-sync.mjs [branche1] [branche2]
 *
 * Par défaut : `main` et `origin/develop`.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { relative, posix } from 'node:path';

const AREA = 'packages/domain';
const branchA = process.argv[2] || 'main';
const branchB = process.argv[3] || 'origin/develop';

/** Liste les fichiers suivis d'un dossier dans une révision donnée. */
function listFiles(ref) {
  try {
    const out = execFileSync('git', ['ls-tree', '-r', '--name-only', ref, '--', AREA], {
      encoding: 'utf8',
    });
    return out.split('\n').map((l) => l.trim()).filter(Boolean).sort();
  } catch {
    console.error(`Reference introuvable : ${ref}`);
    process.exit(2);
  }
}

/** Empreinte SHA-256 du contenu d'un fichier dans une révision donnée. */
function hashFile(ref, path) {
  // `git show` sort le contenu en octets bruts : pas de conversion de fin de
  // ligne, sinon deux fichiers identiques sur le disque compareraient
  // différents à cause du style CRLF de Windows.
  const buf = execFileSync('git', ['show', `${ref}:${path}`]);
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

const filesA = listFiles(branchA);
const filesB = listFiles(branchB);

if (filesA.length === 0 && filesB.length === 0) {
  console.error(`Aucun fichier sous ${AREA} sur ${branchA} ni ${branchB}.`);
  process.exit(2);
}

const all = [...new Set([...filesA, ...filesB])].sort();
const onlyA = filesA.filter((f) => !filesB.includes(f));
const onlyB = filesB.filter((f) => !filesA.includes(f));
const divergent = [];

for (const file of all) {
  if (onlyA.includes(file) || onlyB.includes(file)) continue;
  if (hashFile(branchA, file) !== hashFile(branchB, file)) divergent.push(file);
}

const total = all.length;
const aligned = all.length - onlyA.length - onlyB.length - divergent.length;

console.log(`Coeur de domaine : ${AREA}`);
console.log(`  ${branchA.padEnd(18)} ${filesA.length} fichier(s)`);
console.log(`  ${branchB.padEnd(18)} ${filesB.length} fichier(s)`);
console.log(`  identiques       ${aligned}/${total}`);

let exitCode = 0;

if (onlyA.length > 0) {
  console.log(`\nPresents uniquement sur ${branchA} :`);
  onlyA.forEach((f) => console.log(`  + ${relative('.', f).replace(/\\/g, posix.sep)}`));
  exitCode = 1;
}
if (onlyB.length > 0) {
  console.log(`\nPresents uniquement sur ${branchB} :`);
  onlyB.forEach((f) => console.log(`  + ${relative('.', f).replace(/\\/g, posix.sep)}`));
  exitCode = 1;
}
if (divergent.length > 0) {
  console.log(`\nContenu different :`);
  divergent.forEach((f) => console.log(`  ~ ${relative('.', f).replace(/\\/g, posix.sep)}`));
  exitCode = 1;
}

if (exitCode === 0) {
  console.log('\nLes deux cibles partagent exactement le meme coeur de domaine.');
} else {
  console.log(
    '\nLes deux cibles n appliquent pas les memes regles metier.' +
      '\nReprenez le contenu le plus recent, validez-le, puis copiez-le a l identique' +
      '\ndans packages/domain sur les deux branches avant de merger.'
  );
}

process.exit(exitCode);
