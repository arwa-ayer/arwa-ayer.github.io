#!/usr/bin/env python3
"""Génère une vidéo TikTok (1080x1920 MP4) à partir d'un scénario validé.

Usage :
    python3 studio/make_video.py scenario.json [--ref felix-happy.jpg] [--music son.mp3] [--out video.mp4]

scenario.json :
{
  "title": "...",
  "style": "photo réaliste, lumière douce",
  "caption": "légende TikTok #hashtags",
  "scenes": [
    {"image_prompt": "description en anglais", "text": "texte à l'écran", "duration": 3}
  ]
}

Images : Nano Banana (Gemini gemini-2.5-flash-image) via l'API Gemini.
La clé est lue dans GEMINI_API_KEY ; dans Claude Code cloud, le proxy l'injecte
automatiquement pour generativelanguage.googleapis.com (secret réseau).
Montage : ffmpeg (zoom lent, fondus, texte), gratuit et local.
"""
import argparse, base64, json, os, subprocess, sys, tempfile, time
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
MODEL = os.environ.get("NANO_BANANA_MODEL", "gemini-2.5-flash-image")
API = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def nano_banana(prompt, style, ref=None, retries=3):
    parts = [{"text": f"{prompt}. Style: {style}. Vertical 9:16 composition. No text, no letters, no watermark."}]
    if ref:
        mime = "image/png" if ref.suffix.lower() == ".png" else "image/jpeg"
        parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(ref.read_bytes()).decode()}})
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16"}}}
    headers = {"Content-Type": "application/json",
               "x-goog-api-key": os.environ.get("GEMINI_API_KEY", "injected-by-proxy")}
    for attempt in range(retries):
        r = requests.post(API, json=body, headers=headers, timeout=180,
                          verify=os.environ.get("REQUESTS_CA_BUNDLE") or os.environ.get("SSL_CERT_FILE") or True)
        if r.status_code == 429 and attempt < retries - 1:
            time.sleep(20 * (attempt + 1)); continue
        if not r.ok:
            raise RuntimeError(f"Nano Banana HTTP {r.status_code}: {r.text[:400]}")
        for p in r.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
            inl = p.get("inlineData") or p.get("inline_data")
            if inl:
                return base64.b64decode(inl["data"])
        raise RuntimeError("Nano Banana n'a pas renvoyé d'image (prompt bloqué ?) : " + r.text[:300])
    raise RuntimeError("Quota Nano Banana dépassé, réessayez plus tard.")


def fit(img_path, out_path):
    im = Image.open(img_path).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    im.crop((l, t, l + W, t + H)).save(out_path, quality=95)


def caption_png(text, out_path):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if text:
        d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, 76)
        words, lines, cur = text.split(), [], ""
        for w in words:
            t = f"{cur} {w}".strip()
            if d.textlength(t, font=f) > W - 180 and cur:
                lines.append(cur); cur = w
            else:
                cur = t
        lines.append(cur)
        lh = 100; y0 = int(H * 0.70) - (len(lines) * lh) // 2
        for i, ln in enumerate(lines):
            tw = d.textlength(ln, font=f); y = y0 + i * lh
            d.rounded_rectangle([W / 2 - tw / 2 - 30, y - 8, W / 2 + tw / 2 + 30, y + lh - 12], 24, fill=(0, 0, 0, 150))
            d.text((W / 2, y + 42), ln, font=f, fill="white", anchor="mm")
    im.save(out_path)


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("scenario"); ap.add_argument("--ref"); ap.add_argument("--music")
    ap.add_argument("--out", default="video.mp4"); ap.add_argument("--images", help="dossier d'images déjà générées (saute Nano Banana)")
    a = ap.parse_args()
    sc = json.loads(Path(a.scenario).read_text())
    ref = Path(a.ref) if a.ref else None
    work = Path(tempfile.mkdtemp(prefix="tiktok_"))
    clips = []
    for i, s in enumerate(sc["scenes"]):
        dur = float(s.get("duration", 3))
        raw = work / f"raw{i}.png"
        if a.images:
            raw = Path(a.images) / f"scene{i + 1}.png"
        else:
            print(f"🍌 Nano Banana : scène {i + 1}/{len(sc['scenes'])}…", flush=True)
            raw.write_bytes(nano_banana(s["image_prompt"], sc.get("style", ""), ref))
            Path(a.out).with_suffix("").parent.mkdir(parents=True, exist_ok=True)
            (Path(a.out).parent / f"scene{i + 1}.png").write_bytes(raw.read_bytes())
        img, cap, clip = work / f"img{i}.jpg", work / f"cap{i}.png", work / f"clip{i}.mp4"
        fit(raw, img); caption_png(s.get("text", ""), cap)
        n = int(dur * FPS)
        zoom = f"1+0.10*on/{n}" if i % 2 == 0 else f"1.10-0.10*on/{n}"
        vf = (f"[0:v]scale={W*2}:{H*2},zoompan=z='{zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS}[bg];"
              f"[bg][1:v]overlay=0:0,fade=t=in:st=0:d=0.3,fade=t=out:st={dur-0.3}:d=0.3,format=yuv420p[v]")
        run(["ffmpeg", "-y", "-loop", "1", "-i", str(img), "-loop", "1", "-i", str(cap),
             "-filter_complex", vf, "-map", "[v]", "-t", str(dur), "-c:v", "libx264", "-preset", "medium",
             "-crf", "20", "-r", str(FPS), str(clip)])
        clips.append(clip)
    lst = work / "list.txt"; lst.write_text("".join(f"file '{c}'\n" for c in clips))
    silent = work / "silent.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)])
    if a.music:
        run(["ffmpeg", "-y", "-i", str(silent), "-stream_loop", "-1", "-i", a.music, "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-af", "afade=t=out:st=0:d=0", "-shortest",
             "-movflags", "+faststart", a.out])
    else:
        run(["ffmpeg", "-y", "-i", str(silent), "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "aac", "-shortest", "-movflags", "+faststart", a.out])
    print(f"✅ Vidéo prête : {a.out}")
    if sc.get("caption"):
        print("Légende :", sc["caption"])


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("❌", e, file=sys.stderr); sys.exit(1)
