import { useEffect, useRef, useState } from 'react'
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
  },
  
  // Pairs
  {
    id: 8,
    src: '/videos/008%20Godot%20-%202D%20Top%20Down%20-%20The%20only%20game%20I%20finished%20(returning%20to%20Game%20Dev%20after%20six%20months%20of%20quitting%20from%20Unity)%20-%20Trapped%20in%20a%20Nightmare.mp4',
    tool: 'Godot',
    title: 'Trapped in a Nightmare',
    status: 'Completed',
  },
  {
    id: 4,
    src: '/videos/004%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20A%20Graphic%20Overhaul%20of%20Chrono%20Plasmorph%20Beta.mp4',
    tool: 'Unity',
    title: 'Chrono Plasmorph Remastered',
    status: 'Completed',
  },
  {
    id: 9,
    src: '/videos/009%20Python%20-%20An%20attempt%20to%20recreate%20Aseprite%20in%20PyQT6%20-%20Kokesprite.mp4',
    tool: 'Python',
    title: 'Kokesprite',
    status: 'In Progress',
  },
  {
    id: 11,
    src: '/videos/Godot%20-%20Chrono%20Plasmorph%20Remake.mp4',
    tool: 'Godot',
    title: 'Chrono Plasmorph Remake',
    status: 'In Progress',
  },
  {
    id: 12,
    src: '/videos/Godot%20-%20Heavy%20Knight.mp4',
    tool: 'Godot',
    title: 'Heavy Knight',
    status: 'In Progress',
  },
  {
    id: 13,
    src: '/videos/Godot%20-%20True%20Top%20Down%20Demo.mp4',
    tool: 'Godot',
    title: 'True Top Down Demo',
    status: 'In Progress',
  },
  {
    id: 14,
    src: '/videos/Godot%20-%20Yet%20Another%20Platformer.mp4',
    tool: 'Godot',
    title: 'Yet Another Platformer',
    status: 'In Progress',
  },
  {
    id: 7,
    src: '/videos/007%20Unity%20-%20The%20last%20straw%20for%20Unity%20(I%20quit%20Game%20Dev)%20-%20Flappy%20Bird%20Compilation.mp4',
    tool: 'Unity',
    title: 'Flappy Bird Compilation',
    status: 'Completed',
  },
  {
    id: 2,
    src: '/videos/002%20Unity%20-%202D%20Platformer%20(Obstacle%20Course)%20-%20My%20first%20ever%202D%20Game%20-%20Chrono%20Plasmorph%20Beta.mp4',
    tool: 'Unity',
    title: 'Chrono Plasmorph Beta',
    status: 'Completed',
  },
  {
    id: 3,
    src: '/videos/003%20Unity%20-%203D%20-%20My%20first%20and%20last%203D%20Game%20(an%20attempt%20that%20resulted%20to%20reality%20check).mp4',
    tool: 'Unity',
    title: '3D Reality Check',
    status: 'Completed',
  },
  {
    id: 5,
    src: '/videos/005%20-%20RPG%20Maker%20-%20An%20attempt%20to%20reenter%20Pokemon%20Fan%20Game%20scene%20but%20this%20time%20through%20RMMXP%20and%20not%20Rom%20Hacking.mp4',
    tool: 'RPG Maker',
    title: 'Pokemon Fan Game',
    status: 'Completed',
  },
  {
    id: 1,
    src: '/videos/001%20RPG%20Maker%20-%20Trying%20Game%20Development%20for%20the%20First%20Time%20using%20RPG%20Maker.mp4',
    tool: 'RPG Maker',
    title: 'First Steps in Game Dev',
    status: 'Completed',
  },

  // BOTTOM (full width - the odd one out)
  {
    id: 6,
    src: '/videos/006%20Unity%20-%20A%20quick%20project%20for%20a%20refresher%20-%20A%20simple%20platformer.mp4',
    tool: 'Unity',
    title: 'Platformer Refresher',
    isBottom: true,
    status: 'Completed',
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
}

function VideoCard({ video, isActive = true }: VideoCardProps & { isActive?: boolean }) {
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

  // Desktop: Play/pause based on visibility
  useEffect(() => {
    if (isMobile()) return // Skip for mobile
    
    const vid = videoRef.current
    if (!vid) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          vid.play().catch(() => {})
        } else {
          vid.pause()
        }
      },
      { threshold: [0, 0.3] }
    )

    observer.observe(vid)
    return () => observer.disconnect()
  }, [])

  const toolColor = toolColors[video.tool] || '#888'

  // Determine card class
  const cardClass = video.isHero ? 'card card--full' : video.isBottom ? 'card card--full' : 'card'

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Info panel */}
      <div className={`card__info ${isHovered ? 'card__info--visible' : ''}`}>
        <h3 className="card__title">{video.title}</h3>
        
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
  }

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
              
              <div className="carousel__counter">
                {currentIndex + 1} / {videos.length}
              </div>

              <div className="carousel__controls">
                <button 
                  className="carousel__btn carousel__btn--prev" 
                  onClick={handlePrev}
                  aria-label="Previous video"
                >
                  ‹
                </button>
                
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
            // Desktop: Grid Gallery
            <div className="gallery">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
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
