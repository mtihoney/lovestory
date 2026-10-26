// =====================================================================
//  EDIT THIS FILE to make the site yours. Everything the site shows
//  comes from here. After editing, just refresh the page.
// =====================================================================
window.SITE = {
  pageTitle: "For You",
  herName: "My Love",          // shown on the lock screen and in the letter
  myName: "Frank",                // signs the letter

  // Passcode: stored as a hash, not as plain text.
  // Default passcode is:  forever
  // To change it, run:  node set-passcode.js "your new passcode"
  passcodeHash: "2070f725ff1c765b73c498de52bc419377979691f6100de3ed99794aeb40d988",
  passcodeHint: "Hint: the length of us.",

  // ---------------- HOME: the love letter ----------------
  letter: {
    greeting: "My Love Nyambu},",
    paragraphs: [
      "I wanted to build you something that is only ours, a quiet little corner of the internet where nobody else can walk in.",
      "Every day with you feels like the good part of a story I didn't know I'd get to be in. Your laugh, your voice, the way you make ordinary days feel important. You are the best thing that has happened to me❤️.",
      "I'm not perfect and I don't always say it enough, so I wrote it down here where it can't get lost: thank you for choosing me, and I will keep choosing you.",
      "Whenever you miss me, come back to this page. Play our songs, look at our pictures, and remember that someone is thinking of you right now. 💕❤️🥹🫆"
    ],
    closing: "Forever yours,",
    signature: "{Your Love Frank❤️🥺}"
  },

  // ---------------- MUSIC: exactly the songs you list here ----------------
  // Put the audio files (mp3 / m4a) in media/music/ and list them here.
  songs: [
    { title: "Baby's Favourite", artist: "Kinoti", file: "media/music/safespace.mp3" },
    { title: "Frank's fav", artist: "Ravyn", file: "media/music/loveme.mp3" }
  ],

  // ---------------- GALLERY ----------------
  // Photos of the two of you. Put image files in media/photos/.
  photos: [
    { src: "media/photos/pic 4.jpeg", caption: "First Glance of love" },
    { src: "media/photos/pic7.jpeg", caption: "A Kiss , a desire" },
    { src: "media/photos/pic 9.jpeg", caption: "Boss " },
    { src: "media/photos/pic 5.jpeg", caption: "Last meet up" },
    { src: "media/photos/love.jpeg", caption: "My baby is hot" },
    { src: "media/photos/pic 6.jpeg", caption: "Us, being us" }
  ],
  // Her videos (media/videos-her/) and your videos (media/videos-me/).
  // Example: { src: "media/videos-her/hello.mp4", caption: "Her hello" }
  videosHer: [
    { src: "media/videos-her/video 1.mp4", caption: "if you want jamaican she can..." },
    { src: "media/videos-her/video 3.mp4", caption: "if you need kinoti❤️..." },
    { src: "media/videos-her/video2.mp4", caption: "if you want it smooth🫆" },
    { src: "media/videos-her/video5.mp4", caption: "Representing waingo boys..." },
    { src: "media/videos-her/video6.mp4", caption: "Always beautiful" },
    { src: "media/videos-her/vvideo4.mp4", caption: "We dont Kiss and tell🥺" },
    
   ],
  videosMe: [
    { src: "media/videos-me/me2.mp4", caption: "Message" },
  ],

  // ---------------- NOTES: one appears each time she taps the button ----------------
  notes: [
    "Eat on time.",
    "Take care of yourself today.",
    "You're mine.",
    "Drink some water, please.",
    "I'm proud of you.",
    "Get some rest. I'll be here."
  ]
};
