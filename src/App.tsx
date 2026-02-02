import { useEffect, useRef, useState, Fragment } from 'react'
import './App.css'

// ============================================================================
// MOBILE DETECTION
// ============================================================================

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

// ============================================================================
// VIDEO DATA - Ordered by priority (Featured first, then Godot → Unity → RPG Maker)
// ============================================================================

const videos = [
  // HERO (full width)
  {
    id: 10,
    src: '/videos/010%20Godot%20-%20Current%20Metroidvania%20Project.mp4',
    tool: 'Godot',
    title: 'Metroidvania Project',
    isHero: true,
    status: 'Current Project',
    description: 'An attempt to create a metroidvania inspired by Adventure Island',
    story: "This isn't the classic Adventure Island - it's a full metroidvania. The only Adventure Island elements are the MC having a cap, being naked with green shorts, and fighting a giant snail. But our metroidvania has lightning powers, portals, fireballs, and so much more. This project evolved from the Chrono Plasmorph Remake.",
  },
  
  // Pairs
  {
    id: 8,
    src: '/videos/008%20Godot%20-%202D%20Top%20Down%20-%20The%20only%20game%20I%20finished%20(returning%20to%20Game%20Dev%20after%20six%20months%20of%20quitting%20from%20Unity)%20-%20Trapped%20in%20a%20Nightmare.mp4',
    tool: 'Godot',
    title: 'Trapped in a Nightmare',
    status: 'Completed',
    description: 'A top-down adventure/puzzle game similar to Zelda or Hyper Light Drifter',
    story: "My first complete game after returning to game dev in Godot. An adventure/puzzle/hack-and-slash top-down game where you explore an abandoned facility filled with slimes. Worked non-stop for 2 months: spent 1 month on the original True Top Down version with SVG animations (too tedious, quit), then restarted with 1 month left. Learned pixel art and animation from scratch to create a complete 6-hour game.",
  },
  {
    id: 4,
    src: '/videos/004%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20A%20Graphic%20Overhaul%20of%20Chrono%20Plasmorph%20Beta.mp4',
    tool: 'Unity',
    title: 'Chrono Plasmorph',
    status: 'Completed',
    description: 'My first serious attempt at game dev - a platformer obstacle course',
    story: "This is Chrono Plasmorph, my first official attempt at serious game development. It's a platformer obstacle course game. This version has a graphic overhaul from the Beta version - using better assets and a dark theme instead of the pink theme from Beta.",
  },
  {
    id: 9,
    src: '/videos/009%20Python%20-%20An%20attempt%20to%20recreate%20Aseprite%20in%20PyQT6%20-%20Kokesprite.mp4',
    tool: 'Python',
    title: 'Kokesprite',
    status: 'In Progress',
    description: 'An attempt to recreate Aseprite tailored to my preferences, built with PyQt6',
    story: "A pixel art editor built from scratch using PyQt6. This is my attempt to recreate Aseprite but tailored specifically to my desires and workflow preferences. It's a non-game project that explores GUI development and tool creation.",
  },
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
    status: 'In Progress',
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
    status: 'Beta',
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

  // BOTTOM (full width - the odd one out)
  {
    id: 6,
    src: '/videos/006%20Unity%20-%20A%20quick%20project%20for%20a%20refresher%20-%20A%20simple%20platformer.mp4',
    tool: 'Unity',
    title: 'Platformer Refresher',
    isBottom: true,
    description: 'A basic platformer with box sprites - my last Unity project before quitting for 6 months',
    story: "A basic platformer where the sprites are just boxes with faces. This was my last Unity project before I quit game dev for 6 months. After this, I had a game dev program/course in college (second semester, 3rd year as a Computer Science student), which reignited my passion and led me to switch to Godot.",
  },
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

interface VideoCardProps {
  video: typeof videos[0]
  isExpanded?: boolean
  forceNormalSize?: boolean
  onClick?: () => void
}

function VideoCard({ video, isActive = true, isExpanded = false, forceNormalSize = false, onClick }: VideoCardProps & { isActive?: boolean }) {
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
  let cardClass = 'card'
  if (isExpanded) {
    cardClass = 'card card--expanded'
  } else if ((video.isHero || video.isBottom) && !forceNormalSize) {
    // Only apply full width if nothing else is expanded
    cardClass = 'card card--full'
  }

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

      {/* Status badge */}
      {video.status && (
        <div className={`card__badge card__badge--${video.status.toLowerCase().replace(' ', '-')}`}>
          {video.status}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobile, setMobile] = useState(isMobile())
  const [showStory, setShowStory] = useState(false)
  const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset story when changing videos
  useEffect(() => {
    setShowStory(false)
  }, [currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
  }

  const handleCardClick = (videoId: number) => {
    if (mobile) return
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId)
  }

  // Auto-scroll to expanded card
  useEffect(() => {
    if (expandedVideoId && !mobile) {
      // Small delay to allow DOM to update
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

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <a href="/" className="logo">
          <div className="logo__icon">CK</div>
          <div className="logo__text">
            <span className="logo__name">CodeKokeshi</span>
            <span className="logo__sub">Portfolio</span>
          </div>
        </a>
        <a href="#/timeline" className="header__nav-link">
          Game Dev Timeline
        </a>
      </header>

      {/* Main */}
      <main className="main">
        <div className="container">
          {mobile ? (
            // Mobile: Carousel/Slideshow
            <div className="carousel">
              <div className="carousel__content">
                <VideoCard 
                  key={videos[currentIndex].id} 
                  video={videos[currentIndex]} 
                  isActive={true}
                />
              </div>
              
              <div className="carousel__info">
                <div className="carousel__tool-tag" style={{
                  backgroundColor: `${toolColors[videos[currentIndex].tool] || '#888'}22`,
                  color: toolColors[videos[currentIndex].tool] || '#888',
                  borderColor: `${toolColors[videos[currentIndex].tool] || '#888'}44`
                }}>
                  {videos[currentIndex].tool}
                </div>
                <p className="carousel__description">
                  {videos[currentIndex].description}
                </p>
                {videos[currentIndex].story && (
                  <>
                    <button 
                      className="carousel__read-more"
                      onClick={() => setShowStory(!showStory)}
                    >
                      {showStory ? 'Read Less' : 'Read More'}
                    </button>
                    {showStory && (
                      <div className="carousel__story">
                        {videos[currentIndex].story}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="carousel__controls">
                <button 
                  className="carousel__btn carousel__btn--prev" 
                  onClick={handlePrev}
                  aria-label="Previous video"
                >
                  ‹
                </button>
                
                <div className="carousel__counter">
                  {currentIndex + 1} / {videos.length}
                </div>
                
                <button 
                  className="carousel__btn carousel__btn--next" 
                  onClick={handleNext}
                  aria-label="Next video"
                >
                  ›
                </button>
              </div>
            </div>
          ) : (
            // Desktop: Grid Gallery with expandable cards
            <div className="gallery">
              {(() => {
                if (!expandedVideoId) {
                  // No expansion - normal grid
                  return videos.map((video) => (
                    <VideoCard 
                      key={video.id}
                      video={video} 
                      onClick={() => handleCardClick(video.id)}
                    />
                  ))
                }

                // Find clicked card
                const expandedIndex = videos.findIndex(v => v.id === expandedVideoId)
                const isSecondHalf = expandedIndex >= videos.length / 2
                
                // Find partner index
                // Hero (0) and Bottom (last) have no partners
                let partnerIndex = -1
                if (expandedIndex > 0 && expandedIndex < videos.length - 1) {
                  // After hero, cards are in pairs: (1,2), (3,4), (5,6), etc.
                  const posAfterHero = expandedIndex - 1
                  const isLeftCard = posAfterHero % 2 === 0
                  partnerIndex = isLeftCard ? expandedIndex + 1 : expandedIndex - 1
                }
                
                // Reorder the array
                let reordered = [...videos]
                
                if (partnerIndex >= 0) {
                  // Remove the partner
                  const partner = reordered.splice(partnerIndex, 1)[0]
                  
                  if (isSecondHalf) {
                    // Clicked in second half - move partner to pair with LAST card
                    // Insert before the last card
                    reordered.splice(reordered.length - 1, 0, partner)
                  } else {
                    // Clicked in first half - move partner to pair with FIRST card  
                    // Insert after the first card (hero)
                    reordered.splice(1, 0, partner)
                  }
                }
                
                // Render cards
                return reordered.map((video) => {
                  const isExpanded = video.id === expandedVideoId
                  return (
                    <Fragment key={video.id}>
                      <VideoCard 
                        video={video} 
                        isExpanded={isExpanded}
                        forceNormalSize={expandedVideoId !== null && !isExpanded}
                        onClick={() => handleCardClick(video.id)}
                      />
                      {isExpanded && video.story && (
                        <div className="gallery__story">
                          <h3>The Story Behind This Project</h3>
                          <p>{video.story}</p>
                        </div>
                      )}
                    </Fragment>
                  )
                })
              })()}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} CodeKokeshi</p>
      </footer>
    </div>
  )
}

export default App
