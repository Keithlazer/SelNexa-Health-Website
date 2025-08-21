#!/usr/bin/env python3
"""
Repo-wide HTML cleaner used by CI.

- Removes a large 'printed CSS' chunk detected before a unique marker string.
- Normalizes duplicated asset paths like
  styles/scripts/assets/styles/scripts/assets/... -> /styles/scripts/assets/
- Normalizes logo filenames to /styles/scripts/assets/selnexa-logo.jpg
- Writes backups (*.bak) and commits + pushes changes if any (using the workflow's token).
"""

import os
import re
import subprocess
from pathlib import Path

ROOT = Path('.')
HTML_EXTS = {'.html', '.htm'}
MARKER = '-->Skip to content'

changed_files = []

def read_text(p: Path):
    return p.read_text(encoding='utf-8', errors='replace')

def write_backup(p: Path, text: str):
    bak = p.with_suffix(p.suffix + '.bak')
    bak.write_text(text, encoding='utf-8')

def commit_and_push(files):
    if not files:
        print('No files changed; nothing to commit')
        return
    try:
        subprocess.run(['git', 'config', 'user.name', 'github-actions'], check=True)
        subprocess.run(['git', 'config', 'user.email', 'actions@github.com'], check=True)
        subprocess.run(['git', 'add'] + files, check=True)
        msg = 'chore: clean printed CSS and normalize logo/asset paths (automated)'
        subprocess.run(['git', 'commit', '-m', msg], check=True)
        subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)
        print('Committed and pushed changes')
    except subprocess.CalledProcessError as e:
        print('Git operation failed:', e)

def remove_printed_css(text: str):
    if MARKER not in text:
        return text, False
    idx = text.find(MARKER)
    scan_start = max(0, idx - 40000)
    window = text[scan_start:idx]
    best = None
    for i in range(0, len(window), 200):
        chunk = window[i:]
        if chunk.count('{') >= 8:
            best = scan_start + i
            break
    if best is None:
        last_para = text.rfind('\n\n', 0, idx)
        if last_para == -1:
            return text, False
        start = last_para
    else:
        start = best
    new_text = text[:start] + text[idx + len(MARKER):]
    return new_text, True

def normalize_paths(text: str):
    orig = text
    text = re.sub(r'(?:/)?styles/scripts/assets/(?:styles/scripts/assets/)+', '/styles/scripts/assets/', text)
    text = text.replace('styles/scripts/assets/styles/scripts/assets/', 'styles/scripts/assets/')
    text = re.sub(r'SelNexa%20Health%20Logo%20Full\.jpg', 'selnexa-logo.jpg', text, flags=re.IGNORECASE)
    text = re.sub(r'SelNexa[\w %.-]*Logo[\w %.-]*Full\.(jpg|jpeg|png)', 'selnexa-logo.jpg', text, flags=re.IGNORECASE)
    text = re.sub(r'styles/scripts/assets/selnexa-logo\.jpg', '/styles/scripts/assets/selnexa-logo.jpg', text, flags=re.IGNORECASE)
    text = re.sub(r'src=\"styles/scripts/assets/selnexa-logo', 'src=\"/styles/scripts/assets/selnexa-logo', text, flags=re.IGNORECASE)
    text = re.sub(r'href=\"styles/scripts/assets/selnexa-logo', 'href=\"/styles/scripts/assets/selnexa-logo', text, flags=re.IGNORECASE)
    # collapse accidental repeated nested <picture> wrappers (conservative)
    text = re.sub(r'(<picture[^>]*>\s*)+(<source[\s\S]*?>\s*)*(<img[\s\S]*?>)\s*(</picture>\s*)+', r'\3', text, flags=re.IGNORECASE)
    return text, (text != orig)

def fix_manifest(p: Path):
    text = read_text(p)
    orig = text
    text = text.replace('/styles/scripts/assets/styles/scripts/assets/selnexa-logo.jpg', '/styles/scripts/assets/selnexa-logo.jpg')
    text = text.replace('styles/scripts/assets/styles/scripts/assets/selnexa-logo.jpg', '/styles/scripts/assets/selnexa-logo.jpg')
    return text, (text != orig)

for root, dirs, files in os.walk('.'):
    if root.startswith('./.git') or '/.git/' in root:
        continue
    for name in files:
        path = Path(root) / name
        if path.suffix.lower() in HTML_EXTS or path.name == 'manifest.json':
            text = read_text(path)
            changed = False
            if path.name == 'manifest.json':
                new_text, c = fix_manifest(path)
                if c:
                    write_backup(path, text)
                    path.write_text(new_text, encoding='utf-8')
                    changed = True
            else:
                new_text, removed = remove_printed_css(text)
                if removed:
                    print(f'Removed printed CSS from {path}')
                    write_backup(path, text)
                    text = new_text
                    changed = True
                new_text2, normed = normalize_paths(text)
                if normed:
                    if not changed:
                        write_backup(path, text)
                    path.write_text(new_text2, encoding='utf-8')
                    print(f'Normalized paths in {path}')
                    changed = True
            if changed:
                changed_files.append(str(path))

if changed_files:
    print('Files changed:', changed_files)
    commit_and_push(changed_files)
else:
    print('No changes detected')
