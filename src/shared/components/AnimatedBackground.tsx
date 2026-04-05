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
  // Reduce from 3x to 2x duplication for better memory usage
  const extendedPosters = [...allPosters, ...allPosters];

  // 8 columns with dramatic speed variations (30s to 120s)
  const columns: ColumnConfig[] = [
    { speed: 30, delay: 0 },
    { speed: 55, delay: 0.08 },
    { speed: 90, delay: 0.16 },
    { speed: 120, delay: 0.24 },
    { speed: 45, delay: 0.04 },
    { speed: 75, delay: 0.12 },
    { speed: 105, delay: 0.20 },
    { speed: 65, delay: 0.10 },
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
                animationDelay: `${-column.delay * 5}s`
              }}
            >
              {extendedPosters.map((poster, index) => (
                <div key={`${columnIndex}-${index}`} className="poster-item">
                  <img
                    src={poster}
                    alt=""
                    className="w-full h-auto object-cover border border-border/10 grayscale contrast-125"
                    style={{ aspectRatio: '3/4' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
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
    </div>
  );
}
