import React, { useEffect, useState } from 'react';
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
import bigLegs from '../assets/images/characters/big-guy/big_guy_legs.png';
import bigBody from '../assets/images/characters/big-guy/big_guy_body.png';
import bigHead from '../assets/images/characters/big-guy/big_guy_head.png';
import dogLegs from '../assets/images/characters/greater-dog/great_dog_legs.png';
import dogBody from '../assets/images/characters/greater-dog/grater_dog_body.png';
import dogHead from '../assets/images/characters/greater-dog/greater_dog_head.png';
import girlLegs from '../assets/images/characters/girl/girl_not_good_legs.png';
import girlUpper from '../assets/images/characters/girl/girl_not_good_upper.png';
import sciLegs from '../assets/images/characters/scientist/sci_guy_legs.png';
import sciBody from '../assets/images/characters/scientist/sci_guy_body.png';
import sciHead from '../assets/images/characters/scientist/sci_guy_head.png';
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
  { name: 'A scientist in a lab coat', legs: sciLegs, upper: [sciBody, sciHead], width: 650, height: 1801 },
  { name: 'An armored dog', legs: dogLegs, upper: [dogBody, dogHead], width: 1071, height: 1560 },
  { name: 'A girl with blue hair', legs: girlLegs, upper: [girlUpper], legsInFront: true, width: 999, height: 2780 },
  { name: 'A horned warrior', legs: bigLegs, upper: [bigBody, bigHead], legsInFront: true, upperOffset: '2%', width: 1182, height: 1709 },
];

function CharacterGallery() {
  return (
    <section className="character-gallery" aria-label="Character artwork">
      {showcaseCharacters.map((character, index) => (
        <div className="character-slot" key={character.name}>
          <div className="layered-character" role="img" aria-label={character.name}
            style={{ '--ratio': character.width / character.height, '--breath-delay': `${index * -0.7}s`, '--upper-offset': character.upperOffset ?? '0%' }}>
            <img src={character.legs} style={{ zIndex: character.legsInFront ? 1 : undefined }} alt="" width={character.width} height={character.height} loading="lazy" />
            <div className="breathing-upper">
              {character.upper.map(src => (
                <img key={src} src={src} style={{ translate: src === bigBody ? '0 -0.5%' : undefined }} alt="" width={character.width} height={character.height} loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function ArtMarquee() {
  const messages = [
    'If I see another ad I\'m killing my dog',
    'These fellas so PUSSY I jack off when I see em!',
    'id fuck someone in the ass for some dumplings rn',
    'why the fuck my@dick so small'
  ];
  return (
    <section id="art" className="art-banner" aria-labelledby="art-banner-title">
      <h2 className="visually-hidden" id="art-banner-title">Cool Art and Things</h2>
      <div className="marquee-window" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(group => (
            <div className="marquee-group" key={group}>
              {messages.map(message => <span key={message}>{message} <span className="marquee-separator">X</span></span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReverseMarquee() {
  const messages = [
    'If ur pussy don\'t smell like wet monkey scalp I do NOT want it',
    'fuck all these kids getting iPhones for Christmas all I got was the clap smfh',
    'morning pussy is dangerous it been marinating all night',
    'swag punch a bitch'
  ];
  return (
    <section className="art-banner art-banner-reverse" aria-labelledby="reverse-banner-title">
      <h2 className="visually-hidden" id="reverse-banner-title">More Art and Things</h2>
      <div className="marquee-window" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(group => (
            <div className="marquee-group" key={group}>
              {messages.map(message => <span key={message}>{message} <span className="marquee-separator">X</span></span>)}
            </div>
          ))}
        </div>
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
      <CharacterGallery />
      <ReverseMarquee />
      <section id="work" className="career-section" aria-labelledby="work-title">
        <img className="computer-dude" src={computerDude} alt="A smiling cartoon computer" width="918" height="1027" loading="lazy" />
        <h2 id="work-title">I will add more stuff here when I feel like it :)</h2>
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
      <p className="footer-credit">made with <span>hate</span> by Noah W. &lt;3</p>
      <div className="social-links" aria-label="Social links">
        <a href="#instagram" aria-label="Instagram">
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
