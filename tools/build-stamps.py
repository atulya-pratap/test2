#!/usr/bin/env python3
"""Generates the eight SVG stamps in assets/stamps/.

Run from the project root:  python3 tools/build-stamps.py

Why a script: all stamps share one distress filter and one geometry, so
generating them keeps them identical and makes colour/text changes a
one-line edit. Fonts in SVG-as-<img> cannot load Google Fonts, so text uses
a bold monospace system stack; for exact brand typography use the CSS
.stamp component instead.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "stamps")
os.makedirs(OUT, exist_ok=True)

FONT = "'Courier New', Courier, monospace"

DEFS = """<defs>
<filter id="d" x="-5%" y="-5%" width="110%" height="110%">
<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="{seed}" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 7.2" result="speck"/>
<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="{seed2}" result="n2"/>
<feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -6 0 0 0 5.1" result="patch"/>
<feComposite in="SourceGraphic" in2="speck" operator="in" result="a"/>
<feComposite in="a" in2="patch" operator="in"/>
</filter>
<path id="top" d="M 32,100 A 68,68 0 0 1 168,100"/>
<path id="bot" d="M 32,100 A 68,68 0 0 0 168,100"/>
</defs>"""

def svg(w, h, body, color, rot, seed):
    pad = 16
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {w + 2*pad} {h + 2*pad}" '
            f'width="{w + 2*pad}" height="{h + 2*pad}" role="img">\n'
            + DEFS.format(seed=seed, seed2=seed + 4)
            + f'\n<g filter="url(#d)" fill="{color}" stroke="{color}" '
              f'transform="rotate({rot} {w/2} {h/2})" font-family="{FONT}" font-weight="700">\n'
            + body + '\n</g>\n</svg>\n')

def round_stamp(top, main_lines, bottom, color, rot, seed):
    mains = ""
    n = len(main_lines)
    size = 20 if n == 1 else 15
    start = 100 - (n - 1) * 10 + 5
    for i, line in enumerate(main_lines):
        mains += (f'<text x="100" y="{start + i * 20}" font-size="{size}" text-anchor="middle" '
                  f'stroke="none" letter-spacing="1">{line}</text>\n')
    body = (
        '<circle cx="100" cy="100" r="94" fill="none" stroke-width="6"/>\n'
        '<circle cx="100" cy="100" r="84" fill="none" stroke-width="1.8"/>\n'
        '<circle cx="100" cy="100" r="56" fill="none" stroke-width="1.8"/>\n'
        f'<text font-size="15" stroke="none" letter-spacing="5"><textPath href="#top" startOffset="50%" text-anchor="middle">{top}</textPath></text>\n'
        f'<text font-size="15" stroke="none" letter-spacing="5"><textPath href="#bot" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">{bottom}</textPath></text>\n'
        '<path d="M16 100l4-3 4 3-4 3z M176 100l4-3 4 3-4 3z" stroke="none"/>\n'
        + mains)
    return svg(200, 200, body, color, rot, seed)

def rect_stamp(lines, sub, color, rot, seed):
    h = 90 if sub else 78
    mains = ""
    n = len(lines)
    size = 30 if n == 1 else 22
    for i, line in enumerate(lines):
        y = 46 + i * 26 if n > 1 else 49
        mains += (f'<text x="150" y="{y}" font-size="{size}" text-anchor="middle" '
                  f'stroke="none" letter-spacing="4">{line}</text>\n')
    if sub:
        mains += (f'<text x="150" y="{h - 14}" font-size="11" text-anchor="middle" '
                  f'stroke="none" letter-spacing="5" font-weight="400">{sub}</text>\n')
    body = (f'<rect x="8" y="6" width="284" height="{h}" fill="none" stroke-width="6" rx="4"/>\n'
            f'<rect x="17" y="15" width="266" height="{h - 18}" fill="none" stroke-width="1.8" rx="2"/>\n'
            + mains)
    return svg(300, h + 12, body, color, rot, seed)

OXIDE, GREEN, TEAL, BLUE, INK, GOLD = "#763E35", "#35563A", "#2F6F7E", "#2C4F7C", "#29291F", "#8C6F2B"

STAMPS = {
    "approved":        rect_stamp(["APPROVED"], "TRAVEL DIVISION", GREEN, -6, 2),
    "access-granted":  rect_stamp(["ACCESS", "GRANTED"], None, TEAL, 4, 3),
    "verified":        round_stamp("VERIFIED", ["VERI-", "FIED"], "DEPT. OF ADVENTURES", BLUE, -8, 4),
    "top-secret":      rect_stamp(["TOP SECRET"], "EYES ONLY", OXIDE, -3, 5),
    "official":        round_stamp("OFFICIAL", ["OFFICIAL", "DOCUMENT"], "EST. 2026", INK, 6, 6),
    "travel-authorized": round_stamp("TRAVEL", ["TRAVEL", "AUTHORIZED"], "LICENSE DIVISION", GREEN, -5, 7),
    "archived":        rect_stamp(["ARCHIVED"], "ARCHIVE NO. 001", GOLD, 5, 8),
    "restricted":      rect_stamp(["RESTRICTED"], "AUTHORISED ONLY", OXIDE, -7, 9),
}

for name, content in STAMPS.items():
    path = os.path.join(OUT, f"{name}.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", os.path.normpath(path), len(content), "bytes")
