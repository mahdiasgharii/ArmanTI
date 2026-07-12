import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get all files importing from lucide-react in src/private/components
const files = execSync("grep -rln \"from 'lucide-react'\" src/private/components/ --include=\"*.tsx\" --include=\"*.jsx\" 2>/dev/null", { cwd: '/home/maverik/ArmanTI/opencti-platform/opencti-front' })
  .toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

for (const file of files) {
  const fullPath = path.join('/home/maverik/ArmanTI/opencti-platform/opencti-front', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Fix fontSize="small" -> size={16} on Lucide icon components
  // Pattern: <IconName fontSize="small" ...> where IconName is a Lucide import alias
  content = content.replace(/fontSize="small"/g, 'size={16}');

  // Fix fontSize="medium" -> size={20} (MUI medium default is 24px, but "small" variant is 20px, medium is 24)
  content = content.replace(/fontSize="medium"/g, 'size={20}');

  // Fix fontSize="large" -> size={24}
  content = content.replace(/fontSize="large"/g, 'size={24}');

  // Fix fontSize={number} -> size={number}
  content = content.replace(/fontSize=\{(\d+)\}/g, 'size={$1}');

  // Fix fontSize="1rem" -> size={16}
  content = content.replace(/fontSize="1rem"/g, 'size={16}');

  // Fix fontSize="0.75rem" -> size={12}
  content = content.replace(/fontSize="0\.75rem"/g, 'size={12}');

  // Fix fontSize="0.875rem" -> size={14}
  content = content.replace(/fontSize="0\.875rem"/g, 'size={14}');

  // Fix fontSize="1.25rem" -> size={20}
  content = content.replace(/fontSize="1\.25rem"/g, 'size={20}');

  // Fix fontSize="1.5rem" -> size={24}
  content = content.replace(/fontSize="1\.5rem"/g, 'size={24}');

  // Fix fontSize="2rem" -> size={32}
  content = content.replace(/fontSize="2rem"/g, 'size={32}');

  // Fix fontSize="3rem" -> size={48}
  content = content.replace(/fontSize="3rem"/g, 'size={48}');

  // Fix sx={{ ... }} on Lucide icons -> style={{ ... }}
  // This is trickier - we need to find sx= on components that are Lucide icons
  // Simple approach: replace sx= with style= for any component that is imported from lucide-react
  // We'll do this only for inline sx props on icon-like components

  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    totalFixed++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
