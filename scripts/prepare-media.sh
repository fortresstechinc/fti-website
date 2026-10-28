#!/bin/sh
# Builds the web brand assets (public/brand/), threat-scene photos (public/icp/)
# and footage and event photos (public/media/)
# from the originals in media/.
# Needs ImageMagick. Run with `npm run prepare:media`.
set -eu

# Brand marks, trimmed to the solid ink so they sit tight in the nav.
mkdir -p public/brand
for c in black white; do
  BB=$(magick "media/logo-$c.png" -alpha extract -threshold 50% -format %@ info:)
  magick "media/logo-$c.png" -crop "$BB" +repage -resize x240 "public/brand/fti-$c.png"
done
magick public/brand/fti-black.png -background none -gravity center -extent 280x280 -resize 64x64 src/app/icon.png

# Threat-scene photos (supplied by FTI), one per audience, for the threat sequence.
mkdir -p public/icp
set -- 1:commercial 2:border 3:defense 4:international
for pair in "$@"; do
  cwebp -quiet -q 80 -resize 1280 0 "media/icp-photos/${pair%%:*}.png" -o "public/icp/${pair#*:}.webp"
done

# Product footage for the In action section: portrait, silent, small, with a
# poster from the first frame so the frame is never empty while it loads.
# The iPhone exports are stored 1080x1080 with a 9:16 pixel aspect, so they are
# scaled to their true 9:16 shape with square pixels.
# Needs ffmpeg.
mkdir -p public/media
for p in bolt fist; do
  ffmpeg -v error -y -i "media/$p-marketing.mp4" -an -vf "scale=540:960,setsar=1,fps=30" \
    -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "public/media/$p.mp4"
  ffmpeg -v error -y -i "media/$p-marketing.mp4" -frames:v 1 -vf "scale=540:960,setsar=1" "public/media/$p-poster.png"
  cwebp -quiet -q 78 "public/media/$p-poster.png" -o "public/media/$p-poster.webp" && rm "public/media/$p-poster.png"
done

# Lunch and Launch: FTI's footage and photos from an earlier event at Goshen.
# The footage is cut to the stretch from the team waiting on the field to the
# trail climbing away (5s to 21s), silent, at its native 640x360; the photos
# are sized for the past-launches mosaic.
mkdir -p public/media/lunch-and-launch
L=media/lunch-and-launch
ffmpeg -v error -y -ss 5 -i "$L/IMG_1874.mp4" -t 16 -an -vf "setsar=1,fps=24" \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart public/media/lunch-and-launch/launch.mp4
ffmpeg -v error -y -ss 5 -i "$L/IMG_1874.mp4" -frames:v 1 public/media/lunch-and-launch/launch-poster.png
cwebp -quiet -q 80 public/media/lunch-and-launch/launch-poster.png -o public/media/lunch-and-launch/launch-poster.webp
rm public/media/lunch-and-launch/launch-poster.png
set -- IMG_1867:arrival IMG_1868:watching IMG_1866:briefing
for pair in "$@"; do
  cwebp -quiet -q 80 -resize 1600 0 "$L/${pair%%:*}.jpg" -o "public/media/lunch-and-launch/${pair#*:}.webp"
done
# The portrait photo is taller than wide, so it is sized by its height instead.
cwebp -quiet -q 80 -resize 0 1600 "$L/IMG_1872.jpg" -o public/media/lunch-and-launch/guest.webp

# NVIDIA Inception member badge, used as supplied (NVIDIA's guidelines forbid altering it).
cwebp -quiet -q 90 media/nvidia-inception-program-badge-rgb-1c-blk-for-screen.jpg -o public/brand/nvidia-inception.webp

echo "brand assets written to public/brand and src/app/icon.png; scene photos to public/icp; footage to public/media"
