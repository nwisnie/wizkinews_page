import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import logo from '../assets/web/logo.webp';
import faviconIcon from '../assets/web/favicon.png';
import mainImage from '../assets/web/character/me_me_main.webp';
import armImage from '../assets/web/character/me_me_arm.webp';
import eyeWhites from '../assets/web/character/me_me_eye_whites.webp';
import eyeLeft from '../assets/web/character/me_me_eye_left.webp';
import eyeRight from '../assets/web/character/me_me_eye_right.webp';
import eyesClosed from '../assets/web/character/me_me_eyes_closed.webp';
import computerDude from '../assets/web/computer.webp';
import bigGuy from '../assets/web/characters/big-guy.webp';
import armoredDog from '../assets/web/characters/armored-dog.webp';
import blueHairedGirl from '../assets/web/characters/blue-haired-girl.webp';
import scientist from '../assets/web/characters/scientist.webp';
import hazDude from '../assets/web/characters/haz-dude.webp';
import hazThick from '../assets/web/characters/haz-thick.webp';
import hazBig from '../assets/web/characters/haz-big.webp';
import emoThey from '../assets/web/characters/emo-they.webp';
import dogUh from '../assets/web/characters/dog.webp';
import idkGirl from '../assets/web/characters/idk-girl.webp';
import './styles.css';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = faviconIcon;
document.head.appendChild(favicon);

const randomBetween = (min, max) => min + Math.random() * (max - min);

// Wait for the actual image elements, including the marquee's offscreen copy.
// A failed request or decode settles too, so it cannot block the whole strip.
function useImageReadiness(enabled = true) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const cleanups = [];
    const images = [...containerRef.current.querySelectorAll('img')];
    const pending = images.map(image => new Promise(resolve => {
      const removeListeners = () => {
        image.removeEventListener('load', finish);
        image.removeEventListener('error', finish);
      };
      const finish = () => {
        removeListeners();
        if (image.naturalWidth && typeof image.decode === 'function') {
          image.decode().catch(() => {}).then(resolve);
        } else {
          resolve();
        }
      };
      cleanups.push(removeListeners);
      if (image.complete) finish();
      else {
        image.addEventListener('load', finish, { once: true });
        image.addEventListener('error', finish, { once: true });
      }
    }));
    Promise.all(pending).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
      cleanups.forEach(cleanup => cleanup());
    };
  }, [enabled]);

  return { containerRef, ready };
}

function Character() {
  const { containerRef, ready } = useImageReadiness();
  const [closed, setClosed] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let blinkTimer, gazeTimer, blinking = false;
    const clearTimers = () => {
      clearTimeout(blinkTimer);
      clearTimeout(gazeTimer);
    };
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        blinking = true;
        setClosed(true);
        blinkTimer = setTimeout(() => {
          blinking = false;
          setClosed(false);
          scheduleBlink();
        }, randomBetween(110, 180));
      }, randomBetween(2500, 6000));
    };
    const scheduleGaze = () => {
      gazeTimer = setTimeout(() => {
        if (!blinking) {
          setGaze(Math.random() < 0.3 ? { x: 0, y: 0 } : {
            x: randomBetween(-1, 1), y: randomBetween(-1, 1),
          });
        }
        scheduleGaze();
      }, randomBetween(1800, 4200));
    };
    const restart = () => {
      clearTimers();
      blinking = false;
      setClosed(false);
      setGaze({ x: 0, y: 0 });
      if (!motion.matches) { scheduleBlink(); scheduleGaze(); }
    };
    restart();
    motion.addEventListener('change', restart);
    return () => { clearTimers(); motion.removeEventListener('change', restart); };
  }, []);

  // Scale pupil movement from the source artwork's 2000 × 2400 visible area.
  const pupilStyle = (distance) => ({
    transform: `translate(${gaze.x * distance / 2000 * 100}%, ${gaze.y * distance / 3 / 2400 * 100}%)`,
  });

  return (
    <div ref={containerRef} className={`artwork${closed ? ' blinking' : ''}${ready ? ' is-ready' : ''}`} role="img" aria-busy={!ready} aria-label="An illustrated character waving, blinking, and glancing around">
      <img src={mainImage} alt="" width="1000" height="1200" />
      <div className="eyes-open">
        <img src={eyeWhites} alt="" width="1000" height="1200" />
        <div className="pupils" style={{ maskImage: `url(${eyeWhites})` }}>
          <img className="pupil" src={eyeLeft} style={pupilStyle(9)} alt="" width="1000" height="1200" />
          <img className="pupil" src={eyeRight} style={pupilStyle(18)} alt="" width="1000" height="1200" />
        </div>
      </div>
      <img className="eyes-closed" src={eyesClosed} alt="" width="1000" height="1200" />
      <img className="arm" src={armImage} alt="" width="1000" height="1200" />
    </div>
  );
}

const showcaseCharacters = [
  { name: 'A scientist in a lab coat', src: scientist, width: 585, height: 1723 },
  { name: 'A girl standing with her arms crossed', src: idkGirl, width: 643, height: 1857, groupEnd: true },
  { name: 'A broad character in a hazmat suit', src: hazThick, width: 812, height: 1336, small: true },
  { name: 'A character in a hazmat suit', src: hazDude, width: 674, height: 1764 },
  { name: 'A large character in a hazmat suit', src: hazBig, width: 1299, height: 1848, groupEnd: true },
  { name: 'A horned warrior', src: bigGuy, width: 1126, height: 1628 },
  { name: 'An armored dog', src: armoredDog, width: 878, height: 1417, groupEnd: true },
  { name: 'An emo character', src: emoThey, width: 984, height: 1838 },
  { name: 'A small dog', src: dogUh, width: 1127, height: 1476, small: true, groupEnd: true, tight: true },
];

function MarqueeTrack({ children, className = '', speed = 42 }) {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const firstGroup = track?.firstElementChild;
    if (!track || !firstGroup) return undefined;

    const syncSpeed = () => {
      const distance = firstGroup.getBoundingClientRect().width;
      track.style.setProperty('--marquee-duration', `${distance / speed}s`);
    };

    syncSpeed();
    const observer = new ResizeObserver(syncSpeed);
    observer.observe(firstGroup);
    return () => observer.disconnect();
  }, [speed]);

  return <div ref={trackRef} className={`marquee-track ${className}`}>{children}</div>;
}

function ShowcaseImage({ character, duplicate }) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <img
        src={character.src}
        alt={duplicate ? '' : character.name}
        width={character.width}
        height={character.height}
        loading="eager"
        decoding="async"
        hidden={failed}
        onError={() => setFailed(true)}
      />
      {failed && <span className="character-image-fallback" role="img" aria-label={`${character.name}: artwork unavailable`}>Artwork unavailable</span>}
    </>
  );
}

function CharacterMarquee() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { containerRef, ready } = useImageReadiness(shouldLoad);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <section ref={containerRef} className="character-marquee" aria-label="Character artwork" aria-busy={!ready}>
      {shouldLoad && !ready && <p className="marquee-loading" role="status">Loading artwork…</p>}
      <div className="marquee-window">
        <MarqueeTrack className={`character-marquee-track${ready ? ' is-ready' : ''}`}>
          {[0, 1].map(group => (
            <div className="character-marquee-group" aria-hidden={group === 1} key={group}>
              {showcaseCharacters.map(character => (
                <React.Fragment key={character.name}>
                  <div
                    className={`character-slot${character.small ? ' character-slot-small' : ''}${character.tight ? ' character-slot-tight' : ''}`}
                    style={{ '--character-ratio': character.width / character.height }}
                  >
                    {shouldLoad && <ShowcaseImage character={character} duplicate={group === 1} />}
                  </div>
                  {character.groupEnd && <span className="character-group-separator" aria-hidden="true">X</span>}
                </React.Fragment>
              ))}
            </div>
          ))}
        </MarqueeTrack>
      </div>
    </section>
  );
}

function ArtMarquee() {
  const messages = [
    `hey there buddy chum pal friend buddy pal chum bud friend fella bruther amigo pal buddy friend chummy chum chum pal i don't mean to be rude my friend pal home slice bread slice dawg but i gotta warn ya if u take one more diddly darn step right there im going to have to diddly darn snap ur neck and wowza wouldn't that be a crummy juncture, huh? do yuo want that? do wish upon yourself to come into physical experience with a crummy juncture? because friend buddy chum friend chum pally pal chum friend if you keep this up well gosh diddly darn i just might have to get not so friendly with u my friendly friend friend pal friend buddy chum pally friend chum buddy...`
  ];
  return (
    <section id="art" className="art-banner" aria-labelledby="art-banner-title">
      <h2 className="visually-hidden" id="art-banner-title">Cool Art and Things</h2>
      <div className="marquee-window" aria-hidden="true">
        <MarqueeTrack speed={36}>
          {[0, 1].map(group => (
            <div className="marquee-group" key={group}>
              {messages.map(message => <span key={message}>{message} <span className="marquee-separator">X</span></span>)}
            </div>
          ))}
        </MarqueeTrack>
      </div>
    </section>
  );
}

function SecondArtMarquee() {
  const messages = [
    `Anyways, um... I bought a whole bunch of shungite rocks, do you know what shungite is? Anybody know what shungite is? No, not Suge Knight, I think he's locked up in prison. I'm talkin' shungite. Anyways, it's a two billion year-old like, rock stone that protects against frequencies and unwanted frequencies that may be traveling in the air. That's my story, I bought a whole bunch of stuff. Put 'em around the la casa. Little pyramids, stuff like that.`
  ];
  return (
    <section className="art-banner game-marquee" aria-labelledby="second-banner-title">
      <h2 className="visually-hidden" id="second-banner-title">More Art and Things</h2>
      <div className="marquee-window" aria-hidden="true">
        <MarqueeTrack speed={48}>
          {[0, 1].map(group => (
            <div className="marquee-group" key={group}>
              {messages.map(message => <span key={message}>{message} <span className="marquee-separator">X</span></span>)}
            </div>
          ))}
        </MarqueeTrack>
      </div>
    </section>
  );
}

const gameUrl = '/games/multi-grappler/index.html';

function GameEmbed() {
  const [gameState, setGameState] = useState('ready');
  const hasStarted = useRef(false);
  const controlRef = useRef(null);

  useLayoutEffect(() => {
    if (hasStarted.current) controlRef.current.focus({ preventScroll: true });
  }, [gameState]);

  const startGame = () => {
    hasStarted.current = true;
    setGameState('playing');
  };

  const checkGameFrame = (event) => {
    // The game shares the homepage's origin. Browser error pages are inaccessible.
    if (!event.currentTarget.contentDocument) setGameState('blocked');
  };

  return (
    <section id="play" className="game-section" aria-labelledby="game-title">
      <div className="game-content">
        <div className="game-stage">
          <div className="game-toolbar">
            <h2 id="game-title" className="game-tab">Speed Balls</h2>
            {gameState === 'playing' && (
              <button ref={controlRef} className="game-control" type="button" onClick={() => setGameState('ready')}>
                Stop game
              </button>
            )}
          </div>
          <div className="game-frame">
            <div className={`game-screen${gameState === 'ready' ? ' is-ready' : ''}`}>
              {gameState === 'playing' && (
                <iframe
                  id="speed-balls-game"
                  src={gameUrl}
                  title="Play Speed Balls"
                  width="1280"
                  height="720"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  onLoad={checkGameFrame}
                />
              )}
              {gameState === 'blocked' && (
                <div className="game-recovery">
                  <p>The game couldn’t load inside this page.</p>
                  <a ref={controlRef} className="game-control" href={gameUrl} target="_blank" rel="noopener">
                    Open game in a new tab
                  </a>
                  <button className="game-retry" type="button" onClick={startGame}>Try again here</button>
                </div>
              )}
              {gameState === 'ready' && (
                <button ref={controlRef} className="game-control game-play" type="button" onClick={startGame}>
                  Play
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="game-description">P2P Multiplayer + Level Editor</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
    <nav className="site-nav" aria-label="Site identity">
      <div className="site-nav-inner">Wizkinews</div>
    </nav>
    <main>
      <section id="home" className="title-card" aria-label="Wizkinews introduction">
      <header>
        <h1><img className="logo" src={logo} alt="Wizkinews" width="1110" height="383" /></h1>
        <p>Showcase of Things</p>
      </header>
      <Character />
      </section>
      <ArtMarquee />
      <CharacterMarquee />
      <SecondArtMarquee />
      <GameEmbed />
      <section id="work" className="career-section" aria-labelledby="work-title">
        <img className="bottom-girl" src={blueHairedGirl} alt="A girl with blue hair" width="890" height="2660" loading="lazy" />
        <h2 id="work-title">I will add more stuff here when I feel like it :)</h2>
        <img className="computer-dude" src={computerDude} alt="A smiling cartoon computer" width="918" height="1027" loading="lazy" />
        {/* <div className="career-details">
          <div className="work-experience">
            <article className="experience-entry">
              <h3>Technical Operations Associate</h3>
              <p className="experience-company">Blooio · Full-time</p>
              <p className="experience-meta">Jun 2026-Present · Carlsbad, California · On-site</p>
              <ul>
                <li>Support and maintain technical infrastructure for reliable day-to-day operations and system performance.</li>
                <li>Collaborate across teams to improve processes, troubleshoot technical issues, and scale internal systems and workflows.</li>
              </ul>
            </article>
            <article className="experience-entry">
              <h3>Digital Operations Intern</h3>
              <p className="experience-company">DreamWorks Animation · Internship</p>
              <p className="experience-meta">Jun-Aug 2025 · United States · On-site</p>
              <ul>
                <li>Managed data center installations, cabling, and power alignment, keeping connections organized and documented.</li>
                <li>Coordinated vendor repairs and supported installation, upgrades, and maintenance of servers, storage, networking hardware, and other data center equipment.</li>
              </ul>
            </article>
            <article className="experience-entry">
              <h3>Technology Intern</h3>
              <p className="experience-company">Teijin Automotive Technologies · Internship</p>
              <p className="experience-meta">May-Aug 2024 · Huntington, Indiana · On-site</p>
              <ul>
                <li>Configured and documented operating systems and software on automation equipment using SSH and PuTTY.</li>
                <li>Maintained network infrastructure, resolved connectivity issues, and implemented security protocols to protect sensitive data and network integrity.</li>
              </ul>
            </article>
          </div>
          <div>
            <h3>Education</h3>
            <p className="experience-name">Purdue University College of Engineering</p>
            <p>2022-2026</p>
          </div>
        </div> */}
      </section>
    </main>
    <footer className="site-footer">
      <p className="footer-credit">made with <span>love</span> by Noah W. &lt;3</p>
      <div className="social-links" aria-label="Social links">
        <a href="https://www.instagram.com/wizkinews_art?mdxt=bjV3Njh3N2JuMm1j&utm_source=qr" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="icon-fill" /></svg>
        </a>
        <a href="https://www.youtube.com/@wizkinews9257" aria-label="YouTube">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path className="youtube-shell" d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8Z" /><path className="icon-cutout" d="m10 9 5 3-5 3Z" /></svg>
        </a>
      </div>
    </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
