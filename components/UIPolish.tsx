'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Activity, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Heart, 
  Star,
  Trophy,
  Flame,
  Rocket,
  Award,
  Crown,
  Gem,
  Diamond,
  Sparkle,
  Sun,
  Moon,
  Cloud,
  Wind,
  Droplet,
  Snowflake,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
  RotateCw,
  RefreshCw
} from 'lucide-react';

interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  repeat: boolean;
  direction: 'normal' | 'reverse' | 'alternate';
}

interface MicroInteraction {
  type: 'hover' | 'focus' | 'click' | 'scroll' | 'load';
  element: string;
  animation: string;
  config: AnimationConfig;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifetime: number;
  opacity: number;
}

interface FloatingElement {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  type: 'star' | 'sparkle' | 'circle' | 'triangle';
}

export default function UIPolish() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [particleEffects, setParticleEffects] = useState(true);
  const [microInteractions, setMicroInteractions] = useState(true);
  const [theme, setTheme] = useState<'default' | 'neon' | 'minimal' | 'glitch'>('default');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [clickedElements, setClickedElements] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });

  // Animation presets
  const animationPresets = {
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    dramatic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };

  // Theme configurations
  const themes = {
    default: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EF4444',
      background: '#0A0A0B',
      text: '#FFFFFF'
    },
    neon: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#000000',
      text: '#FFFFFF'
    },
    minimal: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      accent: '#D1D5DB',
      background: '#FFFFFF',
      text: '#111827'
    },
    glitch: {
      primary: '#FF00FF',
      secondary: '#00FF00',
      accent: '#FF0000',
      background: '#000000',
      text: '#FFFFFF'
    }
  };

  // Initialize floating elements
  useEffect(() => {
    const elements: FloatingElement[] = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: `float-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        type: ['star', 'sparkle', 'circle', 'triangle'][Math.floor(Math.random() * 4)] as any
      });
    }
    setFloatingElements(elements);
  }, []);

  // Particle system
  useEffect(() => {
    if (!particleEffects || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            lifetime: particle.lifetime - 1,
            opacity: particle.opacity * 0.98
          }))
          .filter(particle => particle.lifetime > 0 && particle.opacity > 0.01);

        updatedParticles.forEach(particle => {
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });

        return updatedParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleEffects]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Create particles on mouse move
      if (particleEffects && microInteractions) {
        const newParticle: Particle = {
          id: `particle-${Date.now()}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 2 + Math.random() * 4,
          color: themes[theme].primary,
          lifetime: 60,
          opacity: 0.8
        };
        
        setParticles(prev => [...prev.slice(-50), newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [particleEffects, microInteractions, theme]);

  // Floating elements animation
  useEffect(() => {
    if (!animationsEnabled) return;

    const interval = setInterval(() => {
      setFloatingElements(prev => 
        prev.map(element => ({
          ...element,
          rotation: (element.rotation + 0.5) % 360,
          y: (element.y + 0.1) % 100,
          opacity: 0.3 + Math.sin(Date.now() * 0.001 + element.id.charCodeAt(0)) * 0.3
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [animationsEnabled]);

  const createClickEffect = (e: React.MouseEvent) => {
    if (!microInteractions) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = themes[theme].primary;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const addHoverEffect = (elementId: string) => {
    if (!microInteractions) return;
    setHoveredElement(elementId);
  };

  const removeHoverEffect = () => {
    setHoveredElement(null);
  };

  const getAnimationStyle = (elementId: string) => {
    if (!animationsEnabled) return {};

    const baseStyle = {
      transition: `all 0.3s ${animationPresets.smooth}`,
      transform: hoveredElement === elementId ? 'scale(1.05)' : 'scale(1)',
      boxShadow: hoveredElement === elementId 
        ? `0 10px 30px ${themes[theme].primary}40` 
        : '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    if (clickedElements.has(elementId)) {
      baseStyle.transform = 'scale(0.95)';
      baseStyle.boxShadow = `0 2px 4px rgba(0, 0, 0, 0.2)`;
    }

    return baseStyle;
  };

  const renderFloatingElement = (element: FloatingElement) => {
    const currentTheme = themes[theme];
    
    switch (element.type) {
      case 'star':
        return (
          <div
            key={element.id}
            className="absolute pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
              opacity: element.opacity,
              transition: 'all 0.3s ease-out'
            }}
          >
            <Star className="w-4 h-4" style={{ color: currentTheme.primary }} />
          </div>
        );
      case 'sparkle':
        return (
          <div
            key={element.id}
            className="absolute pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
              opacity: element.opacity,
              transition: 'all 0.3s ease-out'
            }}
          >
            <Sparkle className="w-3 h-3" style={{ color: currentTheme.secondary }} />
          </div>
        );
      case 'circle':
        return (
          <div
            key={element.id}
            className="absolute pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentTheme.accent,
              transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
              opacity: element.opacity,
              transition: 'all 0.3s ease-out'
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={element.id}
            className="absolute pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: `8px solid ${currentTheme.primary}`,
              transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
              opacity: element.opacity,
              transition: 'all 0.3s ease-out'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {Array.from(floatingElements).map(renderFloatingElement)}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-[#111113]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 m-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-mono text-white">UI Polish Studio</h1>
                <p className="text-sm text-white/60 font-mono">Advanced animations and micro-interactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`px-4 py-2 rounded-xl font-mono text-sm transition-all ${
                  animationsEnabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {animationsEnabled ? 'Animations ON' : 'Animations OFF'}
              </button>
              <button
                onClick={() => setParticleEffects(!particleEffects)}
                className={`px-4 py-2 rounded-xl font-mono text-sm transition-all ${
                  particleEffects 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {particleEffects ? 'Particles ON' : 'Particles OFF'}
              </button>
              <button
                onClick={() => setMicroInteractions(!microInteractions)}
                className={`px-4 py-2 rounded-xl font-mono text-sm transition-all ${
                  microInteractions 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {microInteractions ? 'Interactions ON' : 'Interactions OFF'}
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold font-mono text-white mb-4">Theme Selection</h3>
            <div className="flex gap-3">
              {Array.from(Object.keys(themes)).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName as any)}
                  className={`px-4 py-2 rounded-xl font-mono text-sm transition-all capitalize ${
                    theme === themeName
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Animated Cards */}
            {Array.from([
              { id: 'card-1', icon: Shield, title: 'Security', color: 'blue' },
              { id: 'card-2', icon: Zap, title: 'Performance', color: 'yellow' },
              { id: 'card-3', icon: Activity, title: 'Analytics', color: 'green' },
              { id: 'card-4', icon: TrendingUp, title: 'Growth', color: 'purple' },
              { id: 'card-5', icon: Eye, title: 'Insights', color: 'pink' },
              { id: 'card-6', icon: MousePointer, title: 'Interactions', color: 'orange' }
            ]).map(({ id, icon: Icon, title, color }) => (
              <div
                key={id}
                id={id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer"
                style={getAnimationStyle(id)}
                onMouseEnter={() => addHoverEffect(id)}
                onMouseLeave={removeHoverEffect}
                onClick={(e) => {
                  createClickEffect(e);
                  setClickedElements(prev => new Set(Array.from(prev).concat([id])));
                  setTimeout(() => {
                    setClickedElements(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(id);
                      return newSet;
                    });
                  }, 200);
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <h3 className="font-semibold font-mono text-white">{title}</h3>
                </div>
                <p className="text-sm text-white/60 font-mono">
                  Hover, click, and interact with this card to see smooth animations and effects.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-white/40 font-mono">Click to animate</span>
                  <ChevronRight className="w-3 h-3 text-white/40" />
                </div>
              </div>
            ))}

            {/* Special Effects */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold font-mono text-white">Fire Effect</h3>
              </div>
              <p className="text-sm text-white/60 font-mono">
                Animated flame effect with particle system
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Snowflake className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold font-mono text-white">Snow Effect</h3>
              </div>
              <p className="text-sm text-white/60 font-mono">
                Gentle snow animation with falling particles
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkle className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold font-mono text-white">Sparkle Effect</h3>
              </div>
              <p className="text-sm text-white/60 font-mono">
                Magical sparkle animations and glows
              </p>
            </div>
          </div>

          {/* Animation Showcase */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold font-mono text-white mb-4">Animation Showcase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="font-semibold font-mono text-white mb-4">Loading Animations</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <span className="text-sm font-mono text-white">Spinning Loader</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-white">Pulse Effect</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                    <span className="text-sm font-mono text-white">Rotate Animation</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="font-semibold font-mono text-white mb-4">Status Indicators</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-mono text-white">Success</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-mono text-white">Warning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-mono text-white">Error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold font-mono text-white mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-green-400">60 FPS</div>
                <div className="text-xs text-white/60 font-mono">Animation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-blue-400">0.3s</div>
                <div className="text-xs text-white/60 font-mono">Transition Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-purple-400">100+</div>
                <div className="text-xs text-white/60 font-mono">Particles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-orange-400">4</div>
                <div className="text-xs text-white/60 font-mono">Themes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
