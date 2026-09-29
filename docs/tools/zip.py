#!/usr/bin/env python3
"""Creates per-shirt ZIPs, the logo pack and the all-in-one ZIP."""
import os, zipfile
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
dl, lg = os.path.join(root, 'downloads'), os.path.join(root, 'logos')

def zipdir(out, items):
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for src, arc in items:
            z.write(src, arc)

for d in sorted(os.listdir(dl)):
    p = os.path.join(dl, d)
    if d == 'merch' or not os.path.isdir(p): continue
    files = [f for f in sorted(os.listdir(p)) if not f.endswith('.zip')]
    zipdir(os.path.join(p, d + '.zip'), [(os.path.join(p, f), f) for f in files])

zipdir(os.path.join(root, 'vexo-logos.zip'), [(os.path.join(lg, f), f) for f in sorted(os.listdir(lg))])

items = []
for base, _, fs in os.walk(dl):
    for f in sorted(fs):
        if f.endswith('.zip'): continue
        full = os.path.join(base, f)
        items.append((full, os.path.join('vexo-designs', os.path.relpath(full, root))))
for f in sorted(os.listdir(lg)):
    items.append((os.path.join(lg, f), os.path.join('vexo-designs', 'logos', f)))
items.append((os.path.join(root, 'vexo-catalog.csv'), 'vexo-designs/vexo-catalog.csv'))
zipdir(os.path.join(root, 'vexo-all-designs.zip'), items)
print('zips ok')
