#!/usr/bin/env node
/**
 * MUI imports audit script.
 * Scans the codebase for MUI imports and categorizes them.
 * Outputs a markdown report of remaining migration work.
 *
 * Usage: node scripts/migration/audit-mui-imports.mjs
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../..');

function grep(pattern, include = '*.tsx,*.jsx,*.ts,*.js') {
  try {
    const includeFlags = include.split(',').map((ext) => `--include="${ext}"`).join(' ');
    const cmd = `grep -rl "${pattern}" src/ ${includeFlags} 2>/dev/null || true`;
    const result = execSync(cmd, { cwd: projectRoot, encoding: 'utf-8' });
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function grepCount(pattern, include = '*.tsx,*.jsx,*.ts,*.js') {
  try {
    const includeFlags = include.split(',').map((ext) => `--include="${ext}"`).join(' ');
    const cmd = `grep -rn "${pattern}" src/ ${includeFlags} 2>/dev/null | wc -l`;
    const result = execSync(cmd, { cwd: projectRoot, encoding: 'utf-8' });
    return parseInt(result.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

const categories = [
  {
    name: '@mui/icons-material',
    pattern: "from '@mui/icons-material'",
    files: grep("from '@mui/icons-material'"),
    matches: grepCount("from '@mui/icons-material'"),
    status: 'pending',
  },
  {
    name: 'mdi-material-ui',
    pattern: "from 'mdi-material-ui'",
    files: grep("from 'mdi-material-ui'"),
    matches: grepCount("from 'mdi-material-ui'"),
    status: 'pending',
  },
  {
    name: '@mui/styles (makeStyles/withStyles/styled)',
    pattern: "from '@mui/styles'",
    files: grep("from '@mui/styles'"),
    matches: grepCount("from '@mui/styles'"),
    status: 'pending',
  },
  {
    name: 'formik-mui / formik-mui-lab',
    pattern: "from 'formik-mui",
    files: grep("from 'formik-mui"),
    matches: grepCount("from 'formik-mui"),
    status: 'pending',
  },
  {
    name: 'useTheme() calls',
    pattern: 'useTheme\\(\\)',
    files: grep('useTheme\\(\\)'),
    matches: grepCount('useTheme\\(\\)'),
    status: 'pending',
  },
  {
    name: 'MUI transitions (Collapse/Fade/Grow/Zoom/Slide)',
    pattern: 'Collapse|Fade|Grow|Zoom|Slide',
    files: grep('\\bCollapse\\b|\\bFade\\b|\\bGrow\\b|\\bZoom\\b|\\bSlide\\b'),
    matches: grepCount('\\bCollapse\\b|\\bFade\\b|\\bGrow\\b|\\bZoom\\b|\\bSlide\\b'),
    status: 'pending',
  },
  {
    name: 'MUI Skeleton',
    pattern: 'Skeleton',
    files: grep('Skeleton'),
    matches: grepCount('Skeleton'),
    status: 'pending',
  },
  {
    name: 'MUI Stepper',
    pattern: 'Stepper|StepButton|StepContent|StepLabel',
    files: grep('Stepper|StepButton|StepContent|StepLabel'),
    matches: grepCount('Stepper|StepButton|StepContent|StepLabel'),
    status: 'pending',
  },
  {
    name: '@mui/material (all)',
    pattern: "from '@mui/material'",
    files: grep("from '@mui/material'"),
    matches: grepCount("from '@mui/material'"),
    status: 'pending',
  },
  {
    name: '@mui/x-date-pickers (kept)',
    pattern: "from '@mui/x-date-pickers'",
    files: grep("from '@mui/x-date-pickers'"),
    matches: grepCount("from '@mui/x-date-pickers'"),
    status: 'kept (complex)',
  },
];

let report = '# MUI Migration Audit Report\n\n';
report += `Generated: ${new Date().toISOString()}\n\n`;
report += '| Category | Files | Matches | Status |\n';
report += '|----------|-------|---------|--------|\n';

for (const cat of categories) {
  report += `| ${cat.name} | ${cat.files.length} | ${cat.matches} | ${cat.status} |\n`;
}

report += '\n## File Lists\n\n';
for (const cat of categories) {
  if (cat.files.length === 0) continue;
  report += `### ${cat.name} (${cat.files.length} files)\n\n`;
  for (const file of cat.files.slice(0, 50)) {
    report += `- \`${file}\`\n`;
  }
  if (cat.files.length > 50) {
    report += `- ... and ${cat.files.length - 50} more\n`;
  }
  report += '\n';
}

const reportPath = resolve(projectRoot, 'scripts/migration/mui-audit-report.md');
writeFileSync(reportPath, report);
console.log(`Audit report written to: ${reportPath}`);
console.log(`\nSummary:`);
for (const cat of categories) {
  console.log(`  ${cat.name}: ${cat.files.length} files, ${cat.matches} matches [${cat.status}]`);
}
