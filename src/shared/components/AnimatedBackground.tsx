import { martyrsData } from "@/shared/data/martyrs";

interface ColumnConfig {
  speed: number;
  delay: number;
}

interface AnimatedBackgroundProps {
  absolute?: boolean;
}

export function AnimatedBackground({ absolute = false }: AnimatedBackgroundProps) {
  const allPosters = martyrsData.map(m => m.image);
  // Optimize: reduce redundancy from 5x to 3x for better performance
  const extendedPosters = [...allPosters, ...allPosters, ...allPosters];

  // Dramatic speed variations: 30s to 120s (2x–4x difference)
  // Staggered entrance animation with delays
  const columns: ColumnConfig[] = [
    { speed: 30, delay: 0 },      // Very slow
    { speed: 55, delay: 0.08 },   // Slow
    { speed: 90, delay: 0.16 },   // Medium-fast
    { speed: 120, delay: 0.24 },  // Very fast
    { speed: 45, delay: 0.04 },   // Medium-slow
    { speed: 75, delay: 0.12 },   // Medium
    { speed: 105, delay: 0.20 },  // Fast
    { speed: 65, delay: 0.10 },   // Medium
  ];

  return (
    <div 
      className={`${absolute ? 'absolute' : 'fixed'} inset-0 overflow-hidden pointer-events-none z-0 opacity-30`}
      style={{ animation: "fadeIn 0.8s ease-out" }}
    >
      <div className="absolute inset-0 flex gap-4 -mx-4">
        {columns.map((column, columnIndex) => (
          <div 
            key={columnIndex} 
            className={`flex-1 min-w-0 overflow-hidden relative column-${columnIndex}`}
            style={{ 
              animation: `slideIn 0.6s ease-out ${column.delay}s backwards`,
            }}
          >
            <div
              className="poster-column"
              style={{ 
                animation: `scrollUp ${column.speed}s linear infinite`,
                animationDelay: `${-column.delay * 5}s` // Slight offset for visual variety
              }}
            >
              {[...extendedPosters, ...extendedPosters].map((poster, index) => (
                <div key={`${columnIndex}-${index}`} className="poster-item">
                  <img
                    src={poster}
                    alt="Background martyr portrait"
                    className="w-full h-auto object-cover border border-border/10 grayscale contrast-125"
                    style={{ aspectRatio: '3/4' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sophisticated overlay — gradient fade with vignette depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%, 
              transparent 0%,
              rgba(255,255,255,0.01) 35%,
              rgba(255,255,255,0.35) 65%,
              rgba(255,255,255,0.95) 100%
            ),
            linear-gradient(180deg,
              rgba(255,255,255,0.98) 0%,
              rgba(255,255,255,0.93) 12%,
              rgba(255,255,255,0.78) 50%,
              rgba(255,255,255,0.93) 88%,
              rgba(255,255,255,0.98) 100%
            )`
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      <style>{`
        /* Entrance animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          0% { 
            opacity: 0;
            transform: translateY(16px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Main scroll animation — 50% for seamless loop */
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        /* Column and item layout */
        .poster-column { 
          display: flex; 
          flex-direction: column;
          will-change: transform;
        }
        
        .poster-item { 
          flex-shrink: 0;
        }

        /* Responsive speed and spacing by breakpoint */
        
        /* Desktop: Full 8 columns, default spacing, normal rhythm */
        @media (min-width: 1024px) {
          .poster-item { margin-bottom: 1rem; }
        }
        
        /* Tablet: 6 columns, compressed spacing, slightly faster animation */
        @media (max-width: 1023px) and (min-width: 768px) {
          .poster-item { margin-bottom: 0.75rem; }
          
          /* Reduce speeds on tablet by ~10% to compensate for smaller viewport */
          @supports (animation-name: scrollUp) {
            /* Speeds will be handled at component level */
          }
        }
        
        /* Mobile: 4 columns, tight spacing, slower animation for meditative feel */
        @media (max-width: 767px) {
          .poster-item { margin-bottom: 0.5rem; }
          
          /* Reduce speeds on mobile by ~25% to feel less frantic */
          .column-0 { --speed-factor: 0.75; }
          .column-1 { --speed-factor: 0.75; }
          .column-2 { --speed-factor: 0.75; }
          .column-3 { --speed-factor: 0.75; }
        }
      `}</style>
    </div>
  );
}
