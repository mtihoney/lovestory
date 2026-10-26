# Our Little Corner: a private website for her

A passcode-protected page with four tabs in the top bar:

- **Home**: your love letter
- **Music**: two songs she can play
- **Gallery**: photos of you together, plus her videos and your videos
- **Notes**: a button that shows a note ("Eat on time", "Take care", "You're mine", and more)

It is plain HTML, CSS and JavaScript. No install and no build step.

## 1. See it right now

Open `index.html` in Chrome. The passcode is **forever**.

## 2. Make it yours (everything is in `config.js`)

1. **Names and letter:** change `herName`, `myName` and the `letter` text. `{name}` and `{me}` are replaced automatically.
2. **Passcode:** run `node set-passcode.js "your passcode"`, then change `passcodeHint` in `config.js`.
   No Node? Ask me and I'll give you a one-line alternative.
3. **Songs:** copy two audio files (mp3 or m4a) into `media/music/`, then set their `title`, `artist` and `file` in `config.js`.
4. **Photos:** copy images into `media/photos/` and list each one under `photos`. Delete the three placeholder hearts.
5. **Videos:** put hers in `media/videos-her/` and yours in `media/videos-me/` (mp4 works everywhere), then list them under `videosHer` and `videosMe`.
6. **Notes:** edit the `notes` list. A different note appears on each tap, and never the same one twice in a row.

Tip: shrink big photos and videos first (phone videos can be hundreds of MB). A 720p mp4 under 30 MB loads fast on mobile data.

## 3. Put it online so she can open it on her phone

Any static host works. The easiest options:

- **Netlify Drop** (app.netlify.com/drop): drag the whole folder in and you get a link.
- **GitHub Pages** or **Render (Static Site)**: push the folder to a GitHub repo and connect it. GitHub rejects single files over 100 MB.
- Use a link name only the two of you would guess, and don't share it.

## Honest note on privacy

The passcode screen is a **door lock, not a vault**. It keeps casual visitors out, but this is a static site, so the letter,
photos and videos are still files on the server. Someone who has the exact file address, or who knows how to view the page
source, can reach them without the passcode. For truly private photos and videos:

- turn on your host's own password protection (Netlify password protection is on a paid plan; Cloudflare Access has a free tier), or
- keep the link private and only put things you'd be fine with a determined stranger seeing.

The site also asks search engines not to index it (`noindex`).

## Files

```
index.html     page structure
style.css      colours and layout
app.js         passcode check, tabs, music player, gallery, notes
config.js      <- your letter, songs, photos, videos, notes, passcode
set-passcode.js  helper to change the passcode
media/         your photos, music and videos go here
```
