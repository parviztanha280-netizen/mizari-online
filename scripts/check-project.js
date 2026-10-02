const fs = require('fs');
const { execFileSync } = require('child_process');
const roots = ['apps/passenger','apps/driver','apps/admin','backend/src','mobile/scripts'];
const files=[];
for (const root of roots) {
  for (const name of fs.readdirSync(root)) {
    if (name.endsWith('.js')) files.push(`${root}/${name}`);
  }
}
for (const f of files) execFileSync(process.execPath,['--check',f],{stdio:'inherit'});
for (const f of ['apps/passenger/manifest.webmanifest','apps/driver/manifest.webmanifest','apps/admin/manifest.webmanifest']) JSON.parse(fs.readFileSync(f,'utf8'));
console.log(`Project checks passed: ${files.length} JavaScript files + manifests.`);
