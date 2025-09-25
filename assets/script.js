// GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Header animations
gsap
  .timeline()
  .to(".header h1", {
    backgroundPosition: "200% center",
    duration: 3,
    repeat: -1,
    ease: "none",
  })
  .to(
    ".subtitle",
    { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
    "-=2"
  )
  .to(".scroll-hint", { opacity: 1, duration: 1, ease: "power2.out" }, "-=1");

gsap.to(".scroll-arrow", {
  y: 10,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut",
});

gsap.to(".timeline-progress", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".timeline-container",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

gsap.to(".progress-bar", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

// Era animations
document.querySelectorAll(".era").forEach((era, index) => {
  const isEven = index % 2 === 0;
  const direction = isEven ? -100 : 100;

  gsap.fromTo(
    era,
    { opacity: 0, x: direction, rotationY: isEven ? -15 : 15 },
    {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: era,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  const icon = era.querySelector(".era-icon");
  gsap.to(icon, { rotation: 360, duration: 20, repeat: -1, ease: "none" });

  const content = era.querySelector(".era-content");
  content.addEventListener("mouseenter", () => {
    gsap.to(content, {
      scale: 1.05,
      y: -10,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(icon, { scale: 1.1, duration: 0.3, ease: "power2.out" });
  });
  content.addEventListener("mouseleave", () => {
    gsap.to(content, { scale: 1, y: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
});

// Feature tags animations
gsap.utils.toArray(".feature-tag").forEach((tag, index) => {
  gsap.fromTo(
    tag,
    { opacity: 0, y: 20, scale: 0.8 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: index * 0.1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: tag,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// Modal and Narration
const modal = document.getElementById("eraModal");
const modalContent = document.querySelector(".modal-content");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".modal-close");

let currentSpeech = null;
let isNarrating = false;

function startNarration(text) {
  stopNarration();
  if ("speechSynthesis" in window) {
    currentSpeech = new SpeechSynthesisUtterance(text);
    currentSpeech.rate = 0.85;
    currentSpeech.pitch = 1.0;
    currentSpeech.volume = 0.9;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Google") ||
        v.name.includes("Microsoft") ||
        v.name.includes("Samantha") ||
        v.name.includes("Alex")
    );
    if (preferredVoice) currentSpeech.voice = preferredVoice;

    currentSpeech.onstart = () => {
      isNarrating = true;
      updateNarratorButton();
      pauseMusicForNarration();
    };
    currentSpeech.onend = () => {
      isNarrating = false;
      updateNarratorButton();
      resumeMusicAfterNarration();
    };

    speechSynthesis.speak(currentSpeech);
  }
}

function stopNarration() {
  if (currentSpeech) {
    speechSynthesis.cancel();
    currentSpeech = null;
    isNarrating = false;
    updateNarratorButton();
  }
}

function toggleNarration() {
  if (isNarrating) stopNarration();
  else {
    const modalText = modalBody.textContent || modalBody.innerText;
    startNarration(modalText);
  }
}

function updateNarratorButton() {
  const button = document.getElementById("narratorButton");
  if (button) {
    button.textContent = isNarrating ? "Stop Narration" : "Listen";
    button.style.background = isNarrating ? "#ff6b6b" : "#4ecdc4";
  }
}

// Background Music
let backgroundMusic = document.getElementById("backgroundMusic");
let isMusicPlaying = false;

function toggleBackgroundMusic() {
  if (!backgroundMusic) return;
  if (isMusicPlaying) backgroundMusic.pause();
  else
    backgroundMusic.play().catch((err) => {
      console.log("Autoplay blocked:", err);
      alert("Click the music button to start music.");
    });
}

backgroundMusic.volume = 0.3;
backgroundMusic.loop = true;

backgroundMusic.addEventListener("play", () => {
  isMusicPlaying = true;
  updateMusicButton();
});
backgroundMusic.addEventListener("pause", () => {
  isMusicPlaying = false;
  updateMusicButton();
});

function updateMusicButton() {
  const button = document.getElementById("musicToggle");
  const text = document.getElementById("musicText");
  if (isMusicPlaying) {
    text.textContent = "Music On";
    button.classList.add("playing");
  } else {
    text.textContent = "Play Music";
    button.classList.remove("playing");
  }
}

function pauseMusicForNarration() {
  if (backgroundMusic && isMusicPlaying) backgroundMusic.volume = 0.1;
}
function resumeMusicAfterNarration() {
  if (backgroundMusic && isMusicPlaying) backgroundMusic.volume = 0.3;
}

// Narrative details for each era
const detailedInfo = {
  sahelanthropus: {
    title: "Sahelanthropus tchadensis",
    details: `
    <h3>The Dawn of Human Evolution</h3>
    <p>Discovered in Chad in 2001, Sahelanthropus tchadensis lived around 7 million years ago. 
    This tiny ancestor is one of our earliest known relatives, walking upright in a world still ruled by apes.</p>
    <h4>Key Characteristics:</h4>
    <ul>
      <li>Foramen magnum placed forward — a hint of upright walking.</li>
      <li>Brain size: 375–500 cc, about the size of a chimp’s.</li>
      <li>A varied diet: fruits, seeds, roots, maybe even small animals.</li>
    </ul>
  `,
  },

  australopithecus: {
    title: "Australopithecus - The Upright Walker",
    details: `
    <h3>Lucy and the Bipedal Revolution</h3>
    <p>Living between 4.2 and 1.9 million years ago, Australopithecus was a turning point. 
    The famous fossil “Lucy” showed us that our ancestors were walking fully upright long before big brains appeared.</p>
    <h4>Revolutionary Adaptations:</h4>
    <ul>
      <li>Walked confidently on two legs, freeing hands for tools and gathering.</li>
      <li>Brain size: 400–500 cc — still small, but a step forward.</li>
      <li>Group living and a mostly plant-based diet.</li>
    </ul>
  `,
  },

  "homo-habilis": {
    title: "Homo habilis - The Toolmaker",
    details: `
    <h3>The First Craftsmen</h3>
    <p>About 2.8 to 1.5 million years ago, Homo habilis — the “Handy Man” — 
    began shaping the world with tools. They chipped stones into sharp edges, 
    making survival a little easier.</p>
    <h4>Technological Innovation:</h4>
    <ul>
      <li>Oldowan stone tools: simple, yet revolutionary.</li>
      <li>Brain size: 500–800 cc — growing bigger.</li>
      <li>New foods like meat, shared within groups.</li>
    </ul>
  `,
  },

  "homo-erectus": {
    title: "Homo erectus - The Wanderer",
    details: `
    <h3>Out of Africa</h3>
    <p>Homo erectus appeared around 2 million years ago and had the courage to explore. 
    They were the first to leave Africa, journeying across Asia, adapting to new lands, 
    and carrying fire wherever they went.</p>
    <h4>Major Achievements:</h4>
    <ul>
      <li>Controlled fire — cooking food, staying warm, scaring predators.</li>
      <li>Brain size: 750–1,200 cc — smarter, tougher.</li>
      <li>Skilled toolmakers with iconic hand axes.</li>
    </ul>
  `,
  },

  neanderthals: {
    title: "Neanderthals - Our Cousins",
    details: `
    <h3>The Ice Age Survivors</h3>
    <p>From 400,000 to 40,000 years ago, Neanderthals thrived in icy Europe and Asia. 
    They weren’t brutish cavemen — they were intelligent, caring, and surprisingly like us.</p>
    <h4>Sophisticated Behaviors:</h4>
    <ul>
      <li>Large brains: 1,200–1,750 cc, sometimes bigger than ours.</li>
      <li>Crafted complex tools and symbolic art.</li>
      <li>Buried their dead with thought and care.</li>
    </ul>
  `,
  },

  "homo-sapiens": {
    title: "Homo sapiens - The Wise",
    details: `
    <h3>The Rise of Modern Humans</h3>
    <p>About 300,000 years ago in Africa, our species — Homo sapiens — emerged. 
    With imagination, language, and culture, we spread across the globe and reshaped it forever.</p>
    <h4>Defining Characteristics:</h4>
    <ul>
      <li>Abstract thought and problem-solving.</li>
      <li>Language and rich symbolic communication.</li>
      <li>Art, culture, and an explosion of creativity.</li>
    </ul>
  `,
  },

  "modern-human": {
    title: "Modern Civilization",
    details: `
    <h3>The Agricultural Revolution and Beyond</h3>
    <p>From the first farms 10,000 years ago to today’s digital world, 
    modern humans have transformed the planet — and even reached for the stars.</p>
    <h4>Transformations:</h4>
    <ul>
      <li>Agriculture and domestication of plants and animals.</li>
      <li>Writing systems that preserved knowledge.</li>
      <li>Scientific discoveries and industrial revolutions.</li>
      <li>Space exploration and the digital age.</li>
    </ul>
  `,
  },
};

// Modal Functions
function openModal(eraType) {
  const info = detailedInfo[eraType];
  if (!info) return;

  modalBody.innerHTML = `
    <h2>${info.title}</h2>
    ${info.details}
    <div style="text-align:center; margin-top:20px;">
      <button id="narratorButton" onclick="toggleNarration()" style="
        background:#4ecdc4; color:#fff; border:none;
        padding:10px 20px; border-radius:20px; cursor:pointer;
      ">Listen</button>
    </div>
  `;

  modal.style.visibility = "visible";

  gsap
    .timeline()
    .to(modal, { opacity: 1, duration: 0.3 })
    .to(
      modalContent,
      { scale: 1, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.2"
    );

  document.body.style.overflow = "hidden";
}

function closeModalFunc() {
  stopNarration();
  gsap
    .timeline()
    .to(modalContent, { scale: 0.8, duration: 0.3 })
    .to(
      modal,
      {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          modal.style.visibility = "hidden";
        },
      },
      "-=0.1"
    );
  document.body.style.overflow = "auto";
}

document.addEventListener("click", (e) => {
  const eraContent = e.target.closest(".era-content");
  if (eraContent) {
    const eraType = eraContent.parentElement.dataset.era;
    openModal(eraType);
  }
});
closeModal.addEventListener("click", closeModalFunc);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFunc();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.visibility === "visible")
    closeModalFunc();
});

document
  .getElementById("musicToggle")
  .addEventListener("click", toggleBackgroundMusic);
