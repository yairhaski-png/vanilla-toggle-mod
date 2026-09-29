#!/usr/bin/env python3
"""Builds the phone-friendly artifact variant of index.html into a staging dir.
usage: make_artifact.py <staging-dir>   (run from docs/)"""
import re, os, sys, shutil, glob
S = sys.argv[1]
os.makedirs(S, exist_ok=True)
h = open('index.html', encoding='utf8').read()
RAW = "https://github.com/yairhaski-png/vanilla-toggle-mod/raw/claude/vexo-shirt-designs-97mz6y/docs/"
style = re.search(r'<style>(.*?)</style>', h, re.S).group(1)
style = re.sub(r"@font-face\{.*?\}", '', style)
style = style.replace("font-family:Rubik,system-ui,sans-serif", "font-family:Rubik,system-ui,-apple-system,'Segoe UI',Arial,sans-serif").replace("font-family:Bungee,Rubik,sans-serif", "font-family:Bungee,Rubik,Impact,sans-serif")
style = ":root{color-scheme:dark}\n" + style + "\n#hud{bottom:calc(16px + env(safe-area-inset-bottom,0px))}\n"
body = re.search(r'<body>(.*)</body>', h, re.S).group(1)
def fix(m):
    tag = m.group(0)
    if ' download' not in tag: return tag
    tag = tag.replace(' download', '')
    return re.sub(r'href="((?:downloads|logos|vexo-)[^"]*)"', lambda x: 'href="' + RAW + x.group(1) + '" target="_blank" rel="noopener"', tag)
body = re.sub(r'<a [^>]*>', fix, body)
out = ('<title>VEXO Collection</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
       '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bungee&family=Rubik:wght@500;700;800&display=swap">\n<style>' + style + '</style>\n<div dir="rtl">' + body + '</div>')
open(S + '/index.html', 'w', encoding='utf8').write(out)
files = glob.glob('downloads/*/*-mockup-*.jpg') + glob.glob('downloads/merch/*-mockup.jpg') + glob.glob('logos/*-purple.png')
for f in files:
    os.makedirs(os.path.dirname(os.path.join(S, f)), exist_ok=True); shutil.copy(f, os.path.join(S, f))
refs = set(re.findall(r'src="([^"]+)"', out))
print(len(files), 'files; missing:', [r for r in refs if not os.path.exists(os.path.join(S, r))])
