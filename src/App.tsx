import { useEffect, useRef, useState, Fragment } from 'react'
import type { ReactNode } from 'react'
import './App.css'

// ============================================================================
// MOBILE DETECTION
// ============================================================================

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

// ============================================================================
// NAVIGATION SECTIONS
// ============================================================================

type SectionId = 'games' | 'arts' | 'software' | 'mods' | 'about'

const navItems: { id: SectionId; label: string; icon: ReactNode }[] = [
  { 
    id: 'games', 
    label: 'Games',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4M8 10v4" />
        <circle cx="17" cy="10" r="1" />
        <circle cx="15" cy="14" r="1" />
      </svg>
    )
  },
  { 
    id: 'arts', 
    label: 'Arts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    )
  },
  { 
    id: 'software', 
    label: 'Software & Web',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  { 
    id: 'mods', 
    label: 'Mods',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
      </svg>
    )
  },
  { 
    id: 'about', 
    label: 'About',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
]

// ============================================================================
// VIDEO DATA - Organized by Category
// ============================================================================

// COMPLETED GAMES
const completedGames = [
  {
    id: 8,
    src: '/videos/008%20Godot%20-%202D%20Top%20Down%20-%20The%20only%20game%20I%20finished%20(returning%20to%20Game%20Dev%20after%20six%20months%20of%20quitting%20from%20Unity)%20-%20Trapped%20in%20a%20Nightmare.mp4',
    tool: 'Godot',
    title: 'Trapped in a Nightmare',
    description: 'A top-down adventure/puzzle game similar to Zelda or Hyper Light Drifter',
    story: "My first complete game after returning to game dev in Godot. An adventure/puzzle/hack-and-slash top-down game where you explore an abandoned facility filled with slimes. Worked non-stop for 2 months: spent 1 month on the original True Top Down version with SVG animations (too tedious, quit), then restarted with 1 month left. Learned pixel art and animation from scratch to create a complete 6-hour game.",
  },
  {
    id: 4,
    src: '/videos/004%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20A%20Graphic%20Overhaul%20of%20Chrono%20Plasmorph%20Beta.mp4',
    tool: 'Unity',
    title: 'Chrono Plasmorph',
    description: 'My first serious attempt at game dev - a platformer obstacle course',
    story: "This is Chrono Plasmorph, my first official attempt at serious game development. It's a platformer obstacle course game. This version has a graphic overhaul from the Beta version - using better assets and a dark theme instead of the pink theme from Beta.",
  },
]

// CURRENT PROJECTS
const currentProjects = [
  {
    id: 10,
    src: '/videos/010%20Godot%20-%20Current%20Metroidvania%20Project.mp4',
    tool: 'Godot',
    title: 'Metroidvania Project',
    description: 'An attempt to create a metroidvania inspired by Adventure Island',
    story: "This isn't the classic Adventure Island - it's a full metroidvania. The only Adventure Island elements are the MC having a cap, being naked with green shorts, and fighting a giant snail. But our metroidvania has lightning powers, portals, fireballs, and so much more. This project evolved from the Chrono Plasmorph Remake.",
  },
  {
    id: 9,
    src: '/videos/009%20Python%20-%20An%20attempt%20to%20recreate%20Aseprite%20in%20PyQT6%20-%20Kokesprite.mp4',
    tool: 'Python',
    title: 'Kokesprite',
    description: 'An attempt to recreate Aseprite tailored to my preferences, built with PyQt6',
    story: "A pixel art editor built from scratch using PyQt6. This is my attempt to recreate Aseprite but tailored specifically to my desires and workflow preferences. It's a non-game project that explores GUI development and tool creation.",
  },
]

// OTHER PROJECTS
const otherProjects = [
  {
    id: 11,
    src: '/videos/Godot%20-%20Chrono%20Plasmorph%20Remake.mp4',
    tool: 'Godot',
    title: 'Chrono Plasmorph Remake',
    description: 'A remake with full-body sprites and smoother movements',
    story: "Unlike the original which used premade chibi assets, this remake features full-body sprites with smoother movements. Development only reached the platformer movement stage before evolving into the current Metroidvania project. This was the bridge between my Unity past and my Godot future.",
  },
  {
    id: 12,
    src: '/videos/Godot%20-%20Heavy%20Knight.mp4',
    tool: 'Godot',
    title: 'Heavy Knight',
    description: "A quick game where your heavy knight can't jump and destroys floors when falling",
    story: "An attempt at making a quick game with a unique twist: your knight is so heavy that it can't jump, and when it falls, it destroys the floor beneath it. A simple concept exploring physics-based platforming challenges.",
  },
  {
    id: 13,
    src: '/videos/Godot%20-%20True%20Top%20Down%20Demo.mp4',
    tool: 'Godot',
    title: 'True Top Down Demo',
    description: 'A true top-down shooter similar to Intravenous with shoot, roll, knife, and hide mechanics',
    story: "The original version of Trapped in a Nightmare, but instead of pixel art, this one used original hand-drawn animation retraced in SVG for high-quality sprites. A true top-down game similar to Intravenous. So far it has shoot, roll, knife attack, and hide mechanics. I abandoned this version because SVG animations were too tedious, and restarted the project as pixel art.",
  },
  {
    id: 14,
    src: '/videos/Godot%20-%20Yet%20Another%20Platformer.mp4',
    tool: 'Godot',
    title: 'Yet Another Platformer',
    description: 'An attempt to recreate Chrono Plasmorph in Godot',
    story: "This was my attempt to recreate (not remake) Chrono Plasmorph from Unity to Godot when I first started learning the engine. Eventually abandoned it in favor of other projects.",
  },
  {
    id: 7,
    src: '/videos/007%20Unity%20-%20The%20last%20straw%20for%20Unity%20(I%20quit%20Game%20Dev)%20-%20Flappy%20Bird%20Compilation.mp4',
    tool: 'Unity',
    title: 'Flappy Bird Compilation',
    description: 'My Unity game dev journey demonstrated in Flappy Bird',
    story: "This compilation contains 3 Flappy Bird games showing my Unity learning progression. First: a tutorial-based version where I learned the basics. Second: a personal attempt without tutorials, featuring my first try at animation. Third: the final attempt using a pixel art tool for the first time, with real personal assets and proper animations. This was the start of my game dev journey.",
  },
  {
    id: 2,
    src: '/videos/002%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20My%20first%20ever%202D%20Game%20-%20Chrono%20Plasmorph%20Beta.mp4',
    tool: 'Unity',
    title: 'Chrono Plasmorph Beta',
    description: 'A pink-themed platformer using downloaded assets',
    story: "This is the original Chrono Plasmorph Beta - essentially the same game as the remastered version, but using downloaded assets instead of custom ones. Features a pink theme instead of the dark theme you see in the remake.",
  },
  {
    id: 3,
    src: '/videos/003%20Unity%20-%203D%20-%20My%20first%20and%20last%203D%20Game%20(an%20attempt%20that%20resulted%20to%20reality%20check).mp4',
    tool: 'Unity',
    title: '3D Reality Check',
    description: 'My first and last 3D game - a massive mistake after learning Flappy Bird',
    story: "Right after learning how to make Flappy Bird, I jumped straight into 3D game development. This was a massive mistake and a harsh reality check. It was my first and last 3D game - I quickly realized I needed to master 2D first.",
  },
  {
    id: 5,
    src: '/videos/005%20-%20RPG%20Maker%20-%20An%20attempt%20to%20reenter%20Pokemon%20Fan%20Game%20scene%20but%20this%20time%20through%20RMMXP%20and%20not%20Rom%20Hacking.mp4',
    tool: 'RPG Maker',
    title: 'Pokemon Fan Game',
    description: 'A Pokemon Essentials game featuring 6 choosable characters from BW, BW2, and HeartGold',
    story: "An attempt to reenter the Pokemon fan game scene, but this time through RPG Maker and Pokemon Essentials instead of ROM hacking. The main feature I'm proud of: 6 choosable characters all together in one game, pulled from Pokemon Black/White, Black/White 2, and HeartGold/SoulSilver.",
  },
  {
    id: 1,
    src: '/videos/001%20RPG%20Maker%20-%20Trying%20Game%20Development%20for%20the%20First%20Time%20using%20RPG%20Maker.mp4',
    tool: 'RPG Maker',
    title: 'First Steps in Game Dev',
    description: 'My first game dev attempt with intro, cutscenes, and quest lists (2022)',
    story: "Actually my very first attempt at game development, though I don't consider it official. Made in 2022, I created the intro, cutscenes, and quest lists for this mystery RPG Maker game. But it sucked and didn't progress beyond that. I resumed serious game dev in 2024 to learn Unity.",
  },
  {
    id: 6,
    src: '/videos/006%20Unity%20-%20A%20quick%20project%20for%20a%20refresher%20-%20A%20simple%20platformer.mp4',
    tool: 'Unity',
    title: 'Platformer Refresher',
    description: 'A basic platformer with box sprites - my last Unity project before quitting for 6 months',
    story: "A basic platformer where the sprites are just boxes with faces. This was my last Unity project before I quit game dev for 6 months. After this, I had a game dev program/course in college (second semester, 3rd year as a Computer Science student), which reignited my passion and led me to switch to Godot.",
  },
]

// All videos combined for mobile carousel
const allVideos = [...completedGames, ...currentProjects, ...otherProjects]

// ============================================================================
// ARTWORK DATA - For masonry grid
// ============================================================================

interface Artwork {
  id: number
  src: string
  isGif: boolean
  staticSrc?: string // Static preview for GIFs
}

// Placeholder artworks - replace with actual artwork paths
const artworks: Artwork[] = [
  { id: 1, src: '/artworks/104943736_f3e130fa02dc6590a5fb05513e0ce962_p1_master1200.jpg-375w-2x.jpg', isGif: false },
  { id: 2, src: '/artworks/angela_from_mobile_legends_by_codekokeshi_dk10mpu-414w-2x.jpg', isGif: false },
  { id: 3, src: '/artworks/dk10p2j-fb4f8030-7fa9-49c2-ae12-dc6b6a7ac79d.gif', isGif: true },
  { id: 4, src: '/artworks/dlany1o-d686d2b3-3b63-4ddf-abba-8f507f144845.gif', isGif: true },
  { id: 5, src: '/artworks/gaomon_contest_submission_by_codekokeshi_dk10mw3-375w-2x.jpg', isGif: false },
  { id: 6, src: '/artworks/Mahiro2.jpg-375w-2x.jpg', isGif: false },
  { id: 7, src: '/artworks/marnie_by_codekokeshi_dk10n2n-fullview.jpg', isGif: false },
  { id: 8, src: '/artworks/oyama_mahiro_recolored_by_codekokeshi_dk10mfz-375w-2x.jpg', isGif: false },
  { id: 9, src: '/artworks/suyarisu_kaymin_by_codekokeshi_dk10n9d-375w-2x.jpg', isGif: false },
  { id: 10, src: '/artworks/takahama_reiko_fully_colorized_by_codekokeshi_dk10lby-pre.jpg', isGif: false },
]

// Tool/Engine colors
const toolColors: Record<string, string> = {
  'RPG Maker': '#4ade80',
  'Unity': '#ffffff',
  'Godot': '#478cbf',
  'Python': '#fbbf24',
}

// ============================================================================
// VIDEO CARD COMPONENT
// ============================================================================

interface Video {
  id: number
  src: string
  tool: string
  title: string
  description: string
  story: string
}

interface VideoCardProps {
  video: Video
  isExpanded?: boolean
  onClick?: () => void
}

function VideoCard({ video, isActive = true, isExpanded = false, onClick }: VideoCardProps & { isActive?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play when active (for mobile carousel)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid || !isActive) return

    vid.play().catch(() => {})
    
    return () => {
      vid.pause()
      vid.currentTime = 0
    }
  }, [isActive])

  // Desktop: Play/pause based on visibility (only fully visible videos)
  useEffect(() => {
    if (isMobile()) return // Skip for mobile
    
    const vid = videoRef.current
    if (!vid) return

    // If expanded, always play regardless of visibility
    if (isExpanded) {
      vid.play().catch(() => {})
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only play when video is almost fully visible (90%+)
        if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
          vid.play().catch(() => {})
        } else {
          vid.pause()
        }
      },
      { threshold: [0, 0.9] }
    )

    observer.observe(vid)
    return () => observer.disconnect()
  }, [isExpanded])

  const toolColor = toolColors[video.tool] || '#888'

  // Determine card class
  const cardClass = isExpanded ? 'card card--expanded' : 'card'

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <video
        ref={videoRef}
        className="card__video"
        src={video.src}
        muted
        loop
        playsInline
        preload={isActive ? "auto" : "none"}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      />

      {/* Gradient overlay */}
      <div className={`card__overlay ${isHovered ? 'card__overlay--visible' : ''}`} />

      {/* Info panel - Show on hover */}
      <div className={`card__info ${isHovered ? 'card__info--visible' : ''}`}>
        <div className="card__tags">
          <span 
            className="card__tag"
            style={{ 
              backgroundColor: `${toolColor}22`,
              color: toolColor,
              borderColor: `${toolColor}44`
            }}
          >
            {video.tool}
          </span>
        </div>
        
        <p className="card__overview">{video.description}</p>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION COMPONENT
// ============================================================================

interface SectionProps {
  title: string
  videos: Video[]
  expandedVideoId: number | null
  onCardClick: (id: number) => void
}

function Section({ title, videos, expandedVideoId, onCardClick }: SectionProps) {
  return (
    <div className="section">
      <h2 className="section__title">{title}</h2>
      <div className="section__grid">
        {videos.map((video) => {
          const isExpanded = video.id === expandedVideoId
          return (
            <Fragment key={video.id}>
              <VideoCard 
                video={video} 
                isExpanded={isExpanded}
                onClick={() => onCardClick(video.id)}
              />
              {isExpanded && video.story && (
                <div className="gallery__story">
                  <h3>The Story Behind This Project</h3>
                  <p>{video.story}</p>
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// PLACEHOLDER SECTION COMPONENT
// ============================================================================

interface PlaceholderSectionProps {
  title: string
  description: string
}

function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <div className="placeholder-section">
      <div className="placeholder-section__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h3 className="placeholder-section__title">{title}</h3>
      <p className="placeholder-section__description">{description}</p>
    </div>
  )
}

// ============================================================================
// ARTWORK ITEM COMPONENT
// ============================================================================

interface ArtworkItemProps {
  artwork: Artwork
  mobile: boolean
}

function ArtworkItem({ artwork, mobile }: ArtworkItemProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // For GIFs: show static image by default, swap to GIF on interaction
  const currentSrc = artwork.isGif 
    ? (isPlaying ? artwork.src : (artwork.staticSrc || artwork.src))
    : artwork.src

  const handleMouseEnter = () => {
    if (!mobile && artwork.isGif) {
      setIsPlaying(true)
    }
  }

  const handleMouseLeave = () => {
    if (!mobile && artwork.isGif) {
      setIsPlaying(false)
    }
  }

  const handleClick = () => {
    if (mobile && artwork.isGif) {
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div 
      className={`masonry__item ${artwork.isGif ? 'masonry__item--gif' : ''} ${isPlaying ? 'masonry__item--playing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img 
        ref={imgRef}
        src={currentSrc} 
        alt=""
        loading="lazy"
      />
      {artwork.isGif && !isPlaying && (
        <div className="masonry__gif-badge">GIF</div>
      )}
    </div>
  )
}

// ============================================================================
// ARTS SECTION COMPONENT
// ============================================================================

interface ArtsSectionProps {
  mobile: boolean
}

function ArtsSection({ mobile }: ArtsSectionProps) {
  if (artworks.length === 0) {
    return (
      <PlaceholderSection
        title="Arts & Animations"
        description="Coming soon - drawings, pixel art, and animations will be showcased here."
      />
    )
  }

  return (
    <div className="masonry">
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork.id} artwork={artwork} mobile={mobile} />
      ))}
    </div>
  )
}

// ============================================================================
// GAMES SECTION CONTENT
// ============================================================================

interface GamesSectionProps {
  mobile: boolean
  currentIndex: number
  showStory: boolean
  expandedVideoId: number | null
  onPrev: () => void
  onNext: () => void
  onToggleStory: () => void
  onCardClick: (id: number) => void
}

function GamesSection({ 
  mobile, 
  currentIndex, 
  showStory, 
  expandedVideoId, 
  onPrev, 
  onNext, 
  onToggleStory, 
  onCardClick 
}: GamesSectionProps) {
  if (mobile) {
    return (
      <div className="carousel">
        <div className="carousel__content">
          <VideoCard 
            key={allVideos[currentIndex].id} 
            video={allVideos[currentIndex]} 
            isActive={true}
          />
        </div>
        
        <div className="carousel__info">
          <div className="carousel__tool-tag" style={{
            backgroundColor: `${toolColors[allVideos[currentIndex].tool] || '#888'}22`,
            color: toolColors[allVideos[currentIndex].tool] || '#888',
            borderColor: `${toolColors[allVideos[currentIndex].tool] || '#888'}44`
          }}>
            {allVideos[currentIndex].tool}
          </div>
          <p className="carousel__description">
            {allVideos[currentIndex].description}
          </p>
          {allVideos[currentIndex].story && (
            <>
              <span 
                className="carousel__read-more"
                onClick={onToggleStory}
              >
                {showStory ? 'Read less' : 'Read more...'}
              </span>
              {showStory && (
                <div className="carousel__story">
                  {allVideos[currentIndex].story}
                </div>
              )}
            </>
          )}
        </div>

        <div className="carousel__controls">
          <button 
            className="carousel__btn carousel__btn--prev" 
            onClick={onPrev}
            aria-label="Previous video"
          >
            ‹
          </button>
          
          <div className="carousel__counter">
            {currentIndex + 1} / {allVideos.length}
          </div>
          
          <button 
            className="carousel__btn carousel__btn--next" 
            onClick={onNext}
            aria-label="Next video"
          >
            ›
          </button>
        </div>

        {/* Timeline Link at bottom */}
        <a href="#/timeline" className="timeline-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          View Timeline
        </a>
      </div>
    )
  }

  return (
    <div className="gallery">
      <Section 
        title="Completed" 
        videos={completedGames} 
        expandedVideoId={expandedVideoId}
        onCardClick={onCardClick}
      />
      <Section 
        title="Current Projects" 
        videos={currentProjects} 
        expandedVideoId={expandedVideoId}
        onCardClick={onCardClick}
      />
      <Section 
        title="Other Projects" 
        videos={otherProjects} 
        expandedVideoId={expandedVideoId}
        onCardClick={onCardClick}
      />
      
      {/* Timeline Link at bottom */}
      <a href="#/timeline" className="timeline-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        View Timeline
      </a>
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('games')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobile, setMobile] = useState(isMobile())
  const [showStory, setShowStory] = useState(true)
  const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset story when changing videos
  useEffect(() => {
    setShowStory(true)
  }, [currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allVideos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allVideos.length - 1 ? 0 : prev + 1))
  }

  const handleCardClick = (videoId: number) => {
    if (mobile) return
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId)
  }

  // Auto-scroll to expanded card
  useEffect(() => {
    if (expandedVideoId && !mobile) {
      setTimeout(() => {
        const expandedElement = document.querySelector('.card--expanded')
        if (expandedElement) {
          expandedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
    }
  }, [expandedVideoId, mobile])

  const renderSection = () => {
    switch (activeSection) {
      case 'games':
        return (
          <GamesSection
            mobile={mobile}
            currentIndex={currentIndex}
            showStory={showStory}
            expandedVideoId={expandedVideoId}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleStory={() => setShowStory(!showStory)}
            onCardClick={handleCardClick}
          />
        )
      case 'arts':
        return <ArtsSection mobile={mobile} />
      case 'software':
        return (
          <PlaceholderSection
            title="Software & Web Projects"
            description="Coming soon - software tools, applications, and websites will be showcased here."
          />
        )
      case 'mods':
        return (
          <PlaceholderSection
            title="Stardew Valley Mods"
            description="Coming soon - custom mods for Stardew Valley will be showcased here."
          />
        )
      case 'about':
        return (
          <div className="about-section">
            <h2 className="about-section__title">About Me</h2>
            <p className="about-section__text">
              Hi! I'm CodeKokeshi, a game developer and programmer. I started my journey in game development 
              with RPG Maker, moved to Unity, and eventually found my home in Godot.
            </p>
            <a href="#/timeline" className="timeline-link timeline-link--about">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              View My Game Dev Timeline
            </a>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      {/* Header - Desktop: full nav, Mobile: logo only */}
      <header className="header">
        <a href="/" className="logo">
          <div className="logo__icon">CK</div>
          <div className="logo__text">
            <span className="logo__name">CodeKokeshi</span>
            <span className="logo__sub">Portfolio</span>
          </div>
        </a>
        
        {/* Desktop Navigation */}
        {!mobile && (
          <nav className="header__nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`header__nav-btn ${activeSection === item.id ? 'header__nav-btn--active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main */}
      <main className="main">
        <div className="container">
          {renderSection()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {mobile && (
        <nav className="bottom-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`bottom-nav__btn ${activeSection === item.id ? 'bottom-nav__btn--active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Footer - Desktop only */}
      {!mobile && (
        <footer className="footer">
          <p>© {new Date().getFullYear()} CodeKokeshi</p>
        </footer>
      )}
    </div>
  )
}

export default App
