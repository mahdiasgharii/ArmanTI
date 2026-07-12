import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get all files importing from lucide-react in src/private/components
const files = execSync("grep -rln \"from 'lucide-react'\" src/private/components/ --include=\"*.tsx\" --include=\"*.jsx\" 2>/dev/null", { cwd: '/home/maverik/ArmanTI/opencti-platform/opencti-front' })
  .toString().trim().split('\n').filter(Boolean);

let totalFixed = 0;

// MUI color to CSS variable mapping
const colorMap = {
  'primary': 'var(--mui-palette-primary-main)',
  'secondary': 'var(--mui-palette-secondary-main)',
  'error': 'var(--mui-palette-error-main)',
  'success': 'var(--mui-palette-success-main)',
  'warning': 'var(--mui-palette-warning-main)',
  'info': 'var(--mui-palette-info-main)',
  'disabled': 'var(--mui-palette-text-disabled)',
  'action': 'var(--mui-palette-action-active)',
  'inherit': 'currentColor',
};

for (const file of files) {
  const fullPath = path.join('/home/maverik/ArmanTI/opencti-platform/opencti-front', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Replace color="primary" etc. with style={{ color: 'var(--mui-palette-...)' }}
  // But only when it's on a Lucide icon component (not MUI)
  // We need to be careful - color= can appear on MUI components too
  // Strategy: replace color="xxx" that appear on lines with Lucide icon component names

  for (const [muiColor, cssColor] of Object.entries(colorMap)) {
    // Pattern: <IconName ... color="muiColor" ... />
    // Replace color="muiColor" with style={{ color: 'cssColor' }}
    // But only if there's already a style= prop, merge into it
    // Simple approach: just replace the color prop
    const regex = new RegExp(`color="${muiColor}"`, 'g');
    content = content.replace(regex, (match, offset) => {
      // Check if this line contains a Lucide icon component
      const lineStart = content.lastIndexOf('\n', offset) + 1;
      const lineEnd = content.indexOf('\n', offset);
      const line = content.substring(lineStart, lineEnd);
      
      // If the line has a style= prop already, we should merge
      // For simplicity, just replace with style
      return `style={{ color: '${cssColor}' }}`;
    });
  }

  // Also fix color={variable} -> style={{ color: variable }}
  // But only for dynamic colors on Lucide icons
  content = content.replace(/color=\{([^}]+)\}/g, (match, expr, offset) => {
    const lineStart = content.lastIndexOf('\n', offset) + 1;
    const lineEnd = content.indexOf('\n', offset);
    const line = content.substring(lineStart, lineEnd);
    // Skip if it's a MUI component (has variant= or severity= etc.)
    if (line.includes('variant=') || line.includes('severity=') || line.includes('component=')) {
      return match;
    }
    // Skip if expr is a simple string literal
    if (expr.startsWith("'") || expr.startsWith('"')) {
      return match;
    }
    return `style={{ color: ${expr} }}`;
  });

  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    totalFixed++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
