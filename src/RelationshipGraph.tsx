import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import './RelationshipGraph.css'

// ============================================================================
// TYPES
// ============================================================================

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  title: string
  year: string
  description: string
  engine: string
  group: 'chrono' | 'trapped'
  status: 'completed' | 'in-progress' | 'archived'
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
  type: 'same' | 'branch' | 'evolution'
  label: string
}

// ============================================================================
// DATA
// ============================================================================

const nodes: GraphNode[] = [
  {
    id: 'cp-beta',
    title: 'Chrono Plasmorph Beta',
    year: 'Jan 2024',
    description: 'The original version with pink theme. First serious game project in Unity.',
    engine: 'Unity',
    group: 'chrono',
    status: 'archived'
  },
  {
    id: 'cp',
    title: 'Chrono Plasmorph',
    year: 'Jan 2024',
    description: 'Same game, dark color theme overhaul. The core that spawned two branches.',
    engine: 'Unity',
    group: 'chrono',
    status: 'archived'
  },
  {
    id: 'yap',
    title: 'Yet Another Platformer',
    year: 'Jul 2025',
    description: 'Port attempt using original Unity assets in limbo/grayscale style.',
    engine: 'Godot',
    group: 'chrono',
    status: 'in-progress'
  },
  {
    id: 'cp-remake',
    title: 'Chrono Plasmorph Remake',
    year: '2025',
    description: 'Complete remake from scratch with new pixel art and animations.',
    engine: 'Godot',
    group: 'chrono',
    status: 'archived'
  },
  {
    id: 'metroidvania',
    title: 'Metroidvania Project',
    year: 'Current',
    description: 'Expanded from the Remake - adding new skills, enemies, NPCs, and story.',
    engine: 'Godot',
    group: 'chrono',
    status: 'in-progress'
  },
  {
    id: 'ttd',
    title: 'True Top Down Demo',
    year: 'Apr 2025',
    description: 'Original version with hand-drawn SVG graphics.',
    engine: 'Godot',
    group: 'trapped',
    status: 'archived'
  },
  {
    id: 'tian',
    title: 'Trapped in a Nightmare',
    year: 'Jun 2025',
    description: 'COMPLETED - Restarted from scratch with pixel art style.',
    engine: 'Godot',
    group: 'trapped',
    status: 'completed'
  },
]

const links: GraphLink[] = [
  { source: 'cp-beta', target: 'cp', type: 'same', label: 'Same Game' },
  { source: 'cp', target: 'yap', type: 'branch', label: 'Port Attempt' },
  { source: 'cp', target: 'cp-remake', type: 'branch', label: 'Full Remake' },
  { source: 'cp-remake', target: 'metroidvania', type: 'evolution', label: 'Evolved Into' },
  { source: 'ttd', target: 'tian', type: 'evolution', label: 'Restarted' },
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function RelationshipGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 900, height: 650 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(600, window.innerHeight - 180)
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    const { width, height } = dimensions
    const svg = d3.select(svgRef.current)
    
    // Clear previous
    svg.selectAll('*').remove()

    // Create container group for zoom/pan
    const g = svg.append('g')

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create deep copies of data for simulation
    const nodesCopy: GraphNode[] = nodes.map(d => ({ ...d }))
    const linksCopy: GraphLink[] = links.map(d => ({ ...d }))

    // Force simulation - Obsidian-like physics
    const simulation = d3.forceSimulation<GraphNode>(nodesCopy)
      .force('link', d3.forceLink<GraphNode, GraphLink>(linksCopy)
        .id(d => d.id)
        .distance(160)
        .strength(1))
      .force('charge', d3.forceManyBody()
        .strength(-600)
        .distanceMax(500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(70))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03))

    // Defs for filters and gradients
    const defs = svg.append('defs')

    // Glow filter for nodes
    const glowFilter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%')

    glowFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '8')
      .attr('result', 'blur')

    glowFilter.append('feColorMatrix')
      .attr('in', 'blur')
      .attr('type', 'matrix')
      .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')

    const glowMerge = glowFilter.append('feMerge')
    glowMerge.append('feMergeNode').attr('in', 'blur')
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Link glow filter
    const linkGlow = defs.append('filter')
      .attr('id', 'link-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%')

    linkGlow.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur')

    const linkMerge = linkGlow.append('feMerge')
    linkMerge.append('feMergeNode').attr('in', 'coloredBlur')
    linkMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(linksCopy)
      .join('path')
      .attr('class', d => `graph-link graph-link--${d.type}`)
      .attr('fill', 'none')
      .attr('filter', 'url(#link-glow)')

    // Link labels with background
    const linkLabelGroup = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('g')
      .data(linksCopy)
      .join('g')
      .attr('class', 'graph-link-label')
      .style('pointer-events', 'none')

    // Background pill for labels
    linkLabelGroup.append('rect')
      .attr('class', 'link-label-bg')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', '#0a0a0a')
      .attr('stroke', d => {
        if (d.type === 'same') return '#8b5cf6'
        if (d.type === 'branch') return '#6366f1'
        return '#10b981'
      })
      .attr('stroke-width', 1)

    // Label text
    const linkLabelText = linkLabelGroup.append('text')
      .attr('class', 'link-label-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d.label)
    
    // Size backgrounds based on text
    linkLabelText.each(function() {
      const bbox = this.getBBox()
      d3.select(this.parentNode as SVGGElement).select('.link-label-bg')
        .attr('x', bbox.x - 4)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 8)
        .attr('height', bbox.height + 4)
    })

    // Draw nodes group
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodesCopy)
      .join('g')
      .attr('class', d => `graph-node graph-node--${d.status}`)
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // Node outer glow circle
    node.append('circle')
      .attr('class', 'node-outer-glow')
      .attr('r', 42)
      .attr('fill', d => {
        if (d.status === 'completed') return 'rgba(16, 185, 129, 0.15)'
        if (d.status === 'in-progress') return 'rgba(99, 102, 241, 0.15)'
        return 'rgba(107, 114, 128, 0.1)'
      })

    // Node main circle
    node.append('circle')
      .attr('class', 'node-main')
      .attr('r', 32)
      .attr('fill', '#0c0c0c')
      .attr('stroke', d => {
        if (d.status === 'completed') return '#10b981'
        if (d.status === 'in-progress') return '#6366f1'
        return '#4b5563'
      })
      .attr('stroke-width', 2)
      .attr('filter', 'url(#node-glow)')

    // Node inner highlight
    node.append('circle')
      .attr('class', 'node-inner')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.status === 'completed') return 'rgba(16, 185, 129, 0.3)'
        if (d.status === 'in-progress') return 'rgba(99, 102, 241, 0.3)'
        return 'rgba(107, 114, 128, 0.2)'
      })
      .attr('stroke-width', 1)

    // Node title text
    node.each(function(d) {
      const nodeGroup = d3.select(this)
      const words = d.title.split(' ')
      
      // Create text element
      const text = nodeGroup.append('text')
        .attr('class', 'node-title')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')

      // Word wrap logic
      if (words.length <= 2) {
        text.append('tspan')
          .attr('x', 0)
          .attr('dy', 0)
          .text(d.title)
      } else {
        // Split into two lines
        const mid = Math.ceil(words.length / 2)
        const line1 = words.slice(0, mid).join(' ')
        const line2 = words.slice(mid).join(' ')
        
        text.append('tspan')
          .attr('x', 0)
          .attr('dy', '-0.5em')
          .text(line1)
        text.append('tspan')
          .attr('x', 0)
          .attr('dy', '1.1em')
          .text(line2)
      }
    })

    // Node year text (outside circle)
    node.append('text')
      .attr('class', 'node-year')
      .attr('text-anchor', 'middle')
      .attr('y', 50)
      .text(d => d.year)

    // Node interaction handlers
    node.on('click', (event, d) => {
      event.stopPropagation()
      setSelectedNode(d)
    })

    node.on('mouseenter', function(_event, d) {
      const self = d3.select(this)
      
      // Scale up hovered node
      self.select('.node-outer-glow')
        .transition().duration(200)
        .attr('r', 55)
        .attr('fill', () => {
          if (d.status === 'completed') return 'rgba(16, 185, 129, 0.35)'
          if (d.status === 'in-progress') return 'rgba(99, 102, 241, 0.35)'
          return 'rgba(107, 114, 128, 0.25)'
        })

      self.select('.node-main')
        .transition().duration(200)
        .attr('r', 38)
        .attr('stroke-width', 3)

      self.select('.node-inner')
        .transition().duration(200)
        .attr('r', 34)

      // Highlight connected
      const connectedIds = new Set<string>()
      linksCopy.forEach(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source
        const targetId = typeof l.target === 'object' ? l.target.id : l.target
        if (sourceId === d.id) connectedIds.add(targetId)
        if (targetId === d.id) connectedIds.add(sourceId)
      })

      // Fade unconnected nodes
      node.transition().duration(200)
        .style('opacity', n => n.id === d.id || connectedIds.has(n.id) ? 1 : 0.15)

      // Highlight connected links
      link.transition().duration(200)
        .style('opacity', l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source
          const targetId = typeof l.target === 'object' ? l.target.id : l.target
          return sourceId === d.id || targetId === d.id ? 1 : 0.08
        })
        .attr('stroke-width', l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source
          const targetId = typeof l.target === 'object' ? l.target.id : l.target
          return sourceId === d.id || targetId === d.id ? 4 : 2
        })

      linkLabelGroup.transition().duration(200)
        .style('opacity', l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source
          const targetId = typeof l.target === 'object' ? l.target.id : l.target
          return sourceId === d.id || targetId === d.id ? 1 : 0
        })
    })

    node.on('mouseleave', function() {
      const self = d3.select(this)
      const d = self.datum() as GraphNode
      
      self.select('.node-outer-glow')
        .transition().duration(300)
        .attr('r', 42)
        .attr('fill', () => {
          if (d.status === 'completed') return 'rgba(16, 185, 129, 0.15)'
          if (d.status === 'in-progress') return 'rgba(99, 102, 241, 0.15)'
          return 'rgba(107, 114, 128, 0.1)'
        })

      self.select('.node-main')
        .transition().duration(300)
        .attr('r', 32)
        .attr('stroke-width', 2)

      self.select('.node-inner')
        .transition().duration(300)
        .attr('r', 28)

      // Restore all nodes
      node.transition().duration(300)
        .style('opacity', 1)

      // Restore all links
      link.transition().duration(300)
        .style('opacity', 0.6)
        .attr('stroke-width', l => l.type === 'evolution' ? 3 : 2)

      linkLabelGroup.transition().duration(300)
        .style('opacity', 0.7)
    })

    // Click outside to deselect
    svg.on('click', () => setSelectedNode(null))

    // Curved link path generator
    function linkPath(d: GraphLink) {
      const source = d.source as GraphNode
      const target = d.target as GraphNode
      const dx = target.x! - source.x!
      const dy = target.y! - source.y!
      const dr = Math.sqrt(dx * dx + dy * dy) * 0.8

      // Slight curve for visual appeal
      return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`
    }

    // Simulation tick
    simulation.on('tick', () => {
      link.attr('d', linkPath)

      linkLabelGroup
        .attr('transform', d => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          const x = (source.x! + target.x!) / 2
          const y = (source.y! + target.y!) / 2
          return `translate(${x},${y})`
        })

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // Set initial zoom
    const initialTransform = d3.zoomIdentity
      .translate(width * 0.08, height * 0.08)
      .scale(0.85)
    svg.call(zoom.transform, initialTransform)

    return () => {
      simulation.stop()
    }
  }, [dimensions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#6366f1'
      default: return '#6b7280'
    }
  }

  return (
    <div className="graph-page">
      <header className="graph-header">
        <a href="#/timeline" className="graph-back">Back to Timeline</a>
        <h1>Project Relationships</h1>
        <p className="graph-hint">Drag nodes · Scroll to zoom · Click for details</p>
      </header>

      <div className="graph-container" ref={containerRef}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>

      <div className="graph-legend">
        <div className="legend-group">
          <span className="legend-label">Status</span>
          <div className="legend-item"><span className="legend-circle legend-circle--complete"></span>Completed</div>
          <div className="legend-item"><span className="legend-circle legend-circle--progress"></span>In Progress</div>
          <div className="legend-item"><span className="legend-circle legend-circle--archived"></span>Archived</div>
        </div>
        <div className="legend-group">
          <span className="legend-label">Links</span>
          <div className="legend-item"><span className="legend-link legend-link--same"></span>Same</div>
          <div className="legend-item"><span className="legend-link legend-link--branch"></span>Branch</div>
          <div className="legend-item"><span className="legend-link legend-link--evo"></span>Evolved</div>
        </div>
      </div>

      {selectedNode && (
        <div className="graph-modal" onClick={() => setSelectedNode(null)}>
          <div className="graph-modal__card" onClick={e => e.stopPropagation()}>
            <button className="graph-modal__close" onClick={() => setSelectedNode(null)}>×</button>
            <div className="graph-modal__head">
              <span className="graph-modal__dot" style={{ background: getStatusColor(selectedNode.status) }}></span>
              <div>
                <h2>{selectedNode.title}</h2>
                <span className="graph-modal__sub">{selectedNode.year} · {selectedNode.engine}</span>
              </div>
            </div>
            <p>{selectedNode.description}</p>
            <span className="graph-modal__tag" style={{ borderColor: getStatusColor(selectedNode.status), color: getStatusColor(selectedNode.status) }}>
              {selectedNode.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
