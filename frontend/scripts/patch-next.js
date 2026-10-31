const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'lib', 'recursive-delete.js');
if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  if (content.includes('const linkPath = await _fs.promises.readlink(absolutePath);') && !content.includes('isSymlink = false;')) {
    content = content.replace(
      /const isSymlink = part\.isSymbolicLink\(\);\s*if \(isSymlink\) \{\s*const linkPath = await _fs\.promises\.readlink\(absolutePath\);\s*try \{\s*const stats = await _fs\.promises\.stat\(\(0, _path\.isAbsolute\)\(linkPath\) \? linkPath : \(0, _path\.join\)\(\(0, _path\.dirname\)\(absolutePath\), linkPath\)\);\s*isDirectory = stats\.isDirectory\(\);\s*\} catch\s*\{\}\s*\}/,
      `let isSymlink = part.isSymbolicLink();
        if (isSymlink) {
            try {
                const linkPath = await _fs.promises.readlink(absolutePath);
                try {
                    const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                    isDirectory = stats.isDirectory();
                } catch {}
            } catch {
                isSymlink = false;
            }
        }`
    );
    fs.writeFileSync(target, content, 'utf8');
    console.log('[Eternelle] Applied Windows OneDrive reparse-point patch to Next.js recursive-delete.');
  }
}

