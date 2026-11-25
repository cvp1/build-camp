# dev

Build and test tools for this site. Nothing here is linked from the pages.

- `test-site.mjs <url> <screenshot-dir>`: walks the five steps in headless Chrome at phone size.
- `video.html` + `render-video.mjs <file-url> <frames-dir> video`: renders the intro video frame by frame;
  encode with `ffmpeg -framerate 30 -i f%04d.jpg -c:v libx264 -crf 19 -vf "scale=1080:1920:in_range=full:out_range=tv,format=yuv420p" -movflags +faststart intro.mp4`.
- `og.html`: source for `og.png` (screenshot at 1200x630).
