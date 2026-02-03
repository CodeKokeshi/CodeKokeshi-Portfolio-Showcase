import { useState, useRef, useEffect } from 'react'
import './Timeline.css'

// ============================================================================
// MOBILE DETECTION
// ============================================================================

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

// ============================================================================
// TIMELINE DATA
// ============================================================================

interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  story: string
  type: 'era' | 'project' | 'milestone'
  link?: string
  linkText?: string
  embed?: string
  video?: string
}

const timelineData: TimelineItem[] = [
  // 2017 - Rom Hacking Era
  {
    id: 1,
    year: '2017',
    title: 'The Beginning',
    description: '12 years old - Got my first laptop (1GB RAM)',
    story: "I got a 1GB RAM laptop with Intel Celeron. I explored ROM Hacking and CLEO Modding, doing this randomly until 2018. I played Pokemon ROM hacks as a kid and wanted to make my own game, but never really finished anything. This sparked my interest in game development.",
    type: 'era',
  },
  {
    id: 2,
    year: '2017',
    title: 'ROM Hacking Tutorial',
    description: 'Tutorial on changing overworld sprites and trainer sprites - Watch on YouTube: https://www.youtube.com/watch?v=UFMMqssgIJE',
    story: "I made tutorials showing my ROM hacking process - specifically how to change overworld sprites and trainer sprites in Pokemon games. This was one of my first attempts at creating game-related content and sharing knowledge with others. My dumbass forgot to title it properly though, leaving it undiscovered by people who actually needed it.",
    type: 'project',
    video: '/videos/FF1 - Pokemon Hacking.mp4',
    link: 'https://www.youtube.com/watch?v=UFMMqssgIJE',
  },
  {
    id: 3,
    year: '2018',
    title: 'Laptop Broke',
    description: 'End of the ROM Hacking era',
    story: "My 1GB RAM laptop finally gave up. This marked a pause in my game dev explorations until I could get new hardware.",
    type: 'milestone',
  },
  
  // 2022 - RPG Maker Era
  {
    id: 4,
    year: '2022',
    title: 'PC Struggles',
    description: 'Bought a PC for 4k - it was a scam',
    story: "We bought a PC at a value of 4k. It was cheap but it was a scam. I managed to salvage its parts. When we bought another PC for 16k, it was another scam. We managed to use that with GTX 550Ti but it was useless compared to the PC I would build later. It was a scam through and through. I was able to build a stronger PC in under 10k after all.",
    type: 'milestone',
  },
  {
    id: 5,
    year: '2022',
    title: 'RPG Maker Era',
    description: "Downloaded RPG Maker - I don't consider this official",
    story: "With my salvaged PC, I downloaded RPG Maker and made a mystery game, then a Pokemon fan game. I don't consider this my official game dev journey - it was too easy after all. But it planted the seeds for what was to come.",
    type: 'era',
  },
  {
    id: 6,
    year: '2022',
    title: 'Mystery Game',
    description: 'First RPG Maker project with intro and cutscenes',
    story: "My first attempt at game development with intro, cutscenes, and quest lists. But because it was made in 2022 with limited skills, it sucked and didn't progress.",
    type: 'project',
    video: '/videos/001 RPG Maker - Trying Game Development for the First Time using RPG Maker.mp4',
  },
  {
    id: 7,
    year: '2022',
    title: 'Pokemon Fan Game',
    description: '6 choosable characters from BW, BW2, and HeartGold',
    story: "An attempt to reenter the Pokemon fan game scene through RPG Maker and Pokemon Essentials instead of ROM hacking. Featured 6 choosable characters from Pokemon Black/White, Black/White 2, and HeartGold/SoulSilver.",
    type: 'project',
    video: '/videos/005 - RPG Maker - An attempt to reenter Pokemon Fan Game scene but this time through RMMXP and not Rom Hacking.mp4',
  },
  
  // 2023 - Unity Era
  {
    id: 8,
    year: '2023',
    title: 'Modern Laptop',
    description: '8GB DDR5, Intel i5 11th Gen, Intel Iris Xe',
    story: "I got a laptop for the first time. A modern one - not a 1GB RAM with Intel Celeron. This time: 8GB RAM DDR5, Intel Iris Xe iGPU, Intel i5 11th Gen, NVMe storage. During this time I wasn't into any projects, just casually using my laptop for school and programming assignments.",
    type: 'milestone',
  },
  {
    id: 9,
    year: 'Nov 2023',
    title: 'Unity Era Begins',
    description: 'Started learning Unity game development',
    story: "From November 2023 to February 2024, I tried Unity and made several games. This was my serious attempt at game development.",
    type: 'era',
  },
  {
    id: 10,
    year: 'Nov 2023',
    title: 'Flappy Bird Compilation',
    description: 'My Unity journey demonstrated in Flappy Bird',
    story: "3 Flappy Bird games showing my Unity learning progression. First: tutorial-based. Second: personal attempt with my first animation try. Third: using pixel art tools for the first time with real personal assets.",
    type: 'project',
    video: '/videos/007 Unity - The last straw for Unity (I quit Game Dev) - Flappy Bird Compilation.mp4',
  },
  {
    id: 11,
    year: 'Dec 2023',
    title: '3D Reality Check',
    description: 'First and last 3D game - massive mistake',
    story: "Right after learning Flappy Bird, I jumped straight into 3D. This was a massive mistake and harsh reality check. My first and last 3D game - I quickly realized I needed to master 2D first.",
    type: 'project',
    video: '/videos/003 Unity - 3D - My first and last 3D Game (an attempt that resulted to reality check).mp4',
  },
  {
    id: 12,
    year: 'Jan 2024',
    title: 'Chrono Plasmorph Beta',
    description: 'Pink-themed platformer with downloaded assets',
    story: "The original Chrono Plasmorph Beta using downloaded assets with a pink theme.",
    type: 'project',
    video: '/videos/002 Unity - 2D Platformer (Obstacle Course) - My first ever 2D Game - Chrono Plasmorph Beta.mp4',
  },
  {
    id: 13,
    year: 'Jan 2024',
    title: 'Chrono Plasmorph',
    description: 'My first serious game - platformer obstacle course',
    story: "My first official attempt at serious game development. A platformer obstacle course game with a dark theme and better assets.",
    type: 'project',
    video: '/videos/004%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20A%20Graphic%20Overhaul%20of%20Chrono%20Plasmorph%20Beta.mp4',
  },
  {
    id: 14,
    year: 'Feb 2024',
    title: 'Platformer Refresher',
    description: 'Basic platformer - my last Unity project',
    story: "A basic platformer where sprites are just boxes with faces. This was my last Unity project before I quit game dev for 6 months.",
    type: 'project',
    video: '/videos/006 Unity - A quick project for a refresher - A simple platformer.mp4',
  },
  {
    id: 15,
    year: 'Feb 2024',
    title: 'Quit Game Dev',
    description: '6 months hiatus from game development',
    story: "After the Platformer Refresher, I quit game development for 6 months. I needed a break and time to figure out my next steps.",
    type: 'milestone',
  },
  
  // 2025 - Godot Era
  {
    id: 16,
    year: 'Apr 2025',
    title: 'Godot Era Begins',
    description: 'Returned to game dev for college course',
    story: "Entered game dev once again, this time in Godot, to tackle the major subject we had in college - Game Development. Like other programming subjects, I wanted to show off here as well.",
    type: 'era',
  },
  {
    id: 17,
    year: 'Apr 2025',
    title: 'Learning Phase',
    description: 'Learned animation, SVG, pixel art, and Godot',
    story: "During this 2-month period I learned how to animate digitally, draw in SVG, and finally draw and animate in pixel art. Of course, learned Godot as well.",
    type: 'milestone',
  },
  {
    id: 18,
    year: 'Apr 2025',
    title: 'True Top Down Demo',
    description: 'Original version with SVG animations',
    story: "The original version of Trapped in a Nightmare using hand-drawn SVG animations. A true top-down game similar to Intravenous. Abandoned because SVG animations were too tedious.",
    type: 'project',
    video: '/videos/Godot - True Top Down Demo.mp4',
  },
  {
    id: 20,
    year: 'Jun 2025',
    title: 'Trapped in a Nightmare',
    description: 'COMPLETE GAME - 6 hours playtime, 900 hrs work',
    story: "My first complete game! A top-down adventure/puzzle game similar to Zelda or Hyper Light Drifter. Spent 900 hours making this game alone. We got a perfect grade - we were the last group to present and the instructor saw we had the most progress. Little did he know, I was the one who made everything.",
    type: 'project',
    video: '/videos/008%20Godot%20-%202D%20Top%20Down%20-%20The%20only%20game%20I%20finished%20(returning%20to%20Game%20Dev%20after%20six%20months%20of%20quitting%20from%20Unity)%20-%20Trapped%20in%20a%20Nightmare.mp4',
  },
  {
    id: 19,
    year: 'Jul 2025',
    title: 'Yet Another Platformer',
    description: 'Attempt to recreate Chrono Plasmorph in Godot',
    story: "My attempt to recreate Chrono Plasmorph from Unity to Godot when first learning the engine.",
    type: 'project',
    video: '/videos/Godot - Yet Another Platformer.mp4',
  },
  {
    id: 21,
    year: '2025',
    title: 'Heavy Knight',
    description: "Heavy knight can't jump, destroys floors",
    story: "An attempt at making a quick game with a unique twist: your knight is so heavy it can't jump, and when it falls, it destroys the floor.",
    type: 'project',
    video: '/videos/Godot - Heavy Knight.mp4',
  },
  {
    id: 22,
    year: '2025',
    title: 'Chrono Plasmorph Remake',
    description: 'Full-body sprites and smoother movements',
    story: "A remake featuring full-body sprites with smoother movements. Development reached the platformer movement stage before evolving into the Metroidvania project.",
    type: 'project',
    video: '/videos/Godot%20-%20Chrono%20Plasmorph%20Remake.mp4',
  },
  {
    id: 23,
    year: '2025',
    title: 'Kokesprite',
    description: 'Custom pixel art editor in PyQt6',
    story: "An attempt to recreate Aseprite but tailored to my preferences, built with PyQt6.",
    type: 'project',
    video: '/videos/009%20Python%20-%20An%20attempt%20to%20recreate%20Aseprite%20in%20PyQT6%20-%20Kokesprite.mp4',
  },
  {
    id: 24,
    year: 'Current',
    title: 'Metroidvania Project',
    description: 'Adventure Island-inspired metroidvania',
    story: "My current project - a metroidvania inspired by Adventure Island. Features lightning powers, portals, fireballs, and more. The MC has a cap, is naked with green shorts, and fights a giant snail with throwing axes.",
    type: 'project',
    video: '/videos/010%20Godot%20-%20Current%20Metroidvania%20Project.mp4',
  },
]

// Era colors
const eraColors: Record<string, string> = {
  '2017': '#ef4444', // Red - ROM Hacking
  '2018': '#ef4444',
  '2022': '#f59e0b', // Orange - RPG Maker
  '2023': '#ffffff', // White - Unity
  'Nov 2023': '#ffffff',
  'Dec 2023': '#ffffff',
  'Jan 2024': '#ffffff',
  'Feb 2024': '#ffffff',
  'Apr 2025': '#478cbf', // Godot Blue
  'May 2025': '#478cbf',
  'Jun 2025': '#478cbf',
  'Jul 2025': '#478cbf',
  '2025': '#478cbf',
  'Current': '#10b981', // Green - Current
}

// ============================================================================
// TIMELINE COMPONENT
// ============================================================================

function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null)
  const [mobile, setMobile] = useState(isMobile())
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Drag to scroll handlers (desktop only)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mobile || !containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
    containerRef.current.style.cursor = 'grabbing'
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
  }

  // Touch handlers for desktop horizontal scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mobile || !containerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mobile || !isDragging || !containerRef.current) return
    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Close details on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="timeline-page">
      {/* Header */}
      <header className="timeline-header">
        <a href="#/" className="timeline-back">← Back to Portfolio</a>
        <h1>Game Dev Timeline</h1>
        <p className="timeline-subtitle">{mobile ? 'Scroll to explore' : 'Drag to scroll through my journey'}</p>
      </header>

      {/* Era Legend */}
      <div className="timeline-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }}></span>ROM Hacking (2017)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span>RPG Maker (2022)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ffffff' }}></span>Unity (2023-2024)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#478cbf' }}></span>Godot (2025)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }}></span>Current</span>
      </div>

      {mobile ? (
        // Mobile: Vertical Timeline
        <div className="timeline-vertical">
          {timelineData.map((item) => (
            <div 
              key={item.id}
              className={`timeline-vertical__item timeline-vertical__item--${item.type}`}
              style={{ '--item-color': eraColors[item.year] || '#888' } as React.CSSProperties}
              onClick={() => setSelectedItem(item)}
            >
              <div className="timeline-vertical__line"></div>
              <div className="timeline-vertical__dot"></div>
              <div className="timeline-vertical__content">
                <span className="timeline-vertical__year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop: Horizontal Timeline
        <div 
          className="timeline-container"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="timeline-track">
            {/* Timeline Line */}
            <div className="timeline-line"></div>
            
            {/* Timeline Items */}
            {timelineData.map((item, index) => (
              <div 
                key={item.id}
                className={`timeline-item timeline-item--${item.type} ${selectedItem?.id === item.id ? 'timeline-item--selected' : ''}`}
                style={{ 
                  '--item-color': eraColors[item.year] || '#888'
                } as React.CSSProperties}
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              >
                <div className="timeline-item__dot"></div>
                <div className="timeline-item__year">{item.year}</div>
                <div className={`timeline-item__card ${index % 2 === 0 ? 'timeline-item__card--top' : 'timeline-item__card--bottom'}`}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Panel - Different layout for mobile */}
      {selectedItem && (
        <div className={`timeline-detail ${mobile ? 'timeline-detail--mobile' : ''}`} onClick={() => setSelectedItem(null)}>
          <div className="timeline-detail__content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="timeline-detail__close" onClick={() => setSelectedItem(null)}>
              {mobile ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              ) : '×'}
            </button>
            
            {/* Video/Embed at the top */}
            {selectedItem.video && (
              <video 
                className="timeline-detail__video"
                src={selectedItem.video}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
              >
                <source src={selectedItem.video} type="video/mp4" />
              </video>
            )}
            
            {selectedItem.embed && (
              <div className="timeline-detail__embed">
                <iframe 
                  width="100%" 
                  height="315" 
                  src={selectedItem.embed}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="timeline-detail__info">
              <span className="timeline-detail__year" style={{ color: eraColors[selectedItem.year] }}>{selectedItem.year}</span>
              <h2>{selectedItem.title}</h2>
              <p className="timeline-detail__desc">{selectedItem.description}</p>
              <div className="timeline-detail__story">{selectedItem.story}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
