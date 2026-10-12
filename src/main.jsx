import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import logo from '../assets/images/branding/Wizkinews_logo.png';
import faviconIcon from '../assets/enemy_cube.png';
import mainImage from '../assets/images/character/me_me_main.png';
import armImage from '../assets/images/character/me_me_arm.png';
import eyeWhites from '../assets/images/character/me_me_eye_whites.png';
import eyeLeft from '../assets/images/character/me_me_eye_left.png';
import eyeRight from '../assets/images/character/me_me_eye_right.png';
import eyesClosed from '../assets/images/character/me_me_eyes_closed.png';
import computerDude from '../assets/images/characters/computer/computer_dude.png';
import bigGuy from '../assets/images/characters/marquee/big_guy_full.png';
import armoredDog from '../assets/images/characters/marquee/grater_dog_full.png';
import blueHairedGirl from '../assets/images/characters/marquee/girl_not_good_full.png';
import scientist from '../assets/images/characters/marquee/sci_guy_full.png';
import hazDude from '../assets/images/characters/marquee/haz_dude_full.png';
import hazThick from '../assets/images/characters/marquee/haz_thick_full.png';
import hazBig from '../assets/haz_big_better.png';
import emoThey from '../assets/emo_they.png';
import dogUh from '../assets/dog_uh.png';
import idkGirl from '../assets/images/characters/marquee/idk_girl_full.png';
import './styles.css';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = faviconIcon;
document.head.appendChild(favicon);

const randomBetween = (min, max) => min + Math.random() * (max - min);

function Character() {
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

  // Translate relative to each full-size canvas so movement scales with the artwork.
  const pupilStyle = (distance) => ({
    transform: `translate(${gaze.x * distance / 2000 * 100}%, ${gaze.y * distance / 3 / 4050 * 100}%)`,
  });

  return (
    <div className={`artwork${closed ? ' blinking' : ''}`} role="img" aria-label="An illustrated character waving, blinking, and glancing around">
      <img src={mainImage} alt="" width="2000" height="4050" />
      <div className="eyes-open">
        <img src={eyeWhites} alt="" width="2000" height="4050" />
        <div className="pupils" style={{ maskImage: `url(${eyeWhites})` }}>
          <img className="pupil" src={eyeLeft} style={pupilStyle(9)} alt="" width="2000" height="4050" />
          <img className="pupil" src={eyeRight} style={pupilStyle(18)} alt="" width="2000" height="4050" />
        </div>
      </div>
      <img className="eyes-closed" src={eyesClosed} alt="" width="2000" height="4050" />
      <img className="arm" src={armImage} alt="" width="2000" height="4050" />
    </div>
  );
}

const showcaseCharacters = [
  { name: 'A scientist in a lab coat', src: scientist, width: 585, height: 1723 },
  { name: 'A girl standing with her arms crossed', src: idkGirl, width: 643, height: 1857, groupEnd: true },
  { name: 'A broad character in a hazmat suit', src: hazThick, width: 812, height: 1336, small: true },
  { name: 'A character in a hazmat suit', src: hazDude, width: 674, height: 1764 },
  { name: 'A large character in a hazmat suit', src: hazBig, width: 1170, height: 1754, groupEnd: true },
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

function CharacterMarquee() {
  return (
    <section className="character-marquee" aria-label="Character artwork">
      <div className="marquee-window">
        <MarqueeTrack className="character-marquee-track">
          {[0, 1].map(group => (
            <div className="character-marquee-group" aria-hidden={group === 1} key={group}>
              {showcaseCharacters.map(character => (
                <React.Fragment key={character.name}>
                  <div
                    className={`character-slot${character.small ? ' character-slot-small' : ''}${character.tight ? ' character-slot-tight' : ''}`}
                    style={{ '--character-ratio': character.width / character.height }}
                  >
                    <img
                      src={character.src}
                      alt={group === 0 ? character.name : ''}
                      width={character.width}
                      height={character.height}
                      loading="lazy"
                    />
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
    <section className="art-banner" aria-labelledby="second-banner-title">
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
