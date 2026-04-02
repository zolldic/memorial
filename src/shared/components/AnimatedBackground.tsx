import { martyrsData } from "@/shared/data/martyrs";

interface PosterColumn {
  posters: string[];
  speed: number;
}

interface AnimatedBackgroundProps {
  absolute?: boolean;
}

export function AnimatedBackground({ absolute = false }: AnimatedBackgroundProps) {
  const allPosters = martyrsData.map(m => m.image);
  const extendedPosters = [...allPosters, ...allPosters, ...allPosters, ...allPosters, ...allPosters];

  const columns: PosterColumn[] = [
    { posters: extendedPosters.slice(0, 12), speed: 60 },
    { posters: extendedPosters.slice(3, 15), speed: 75 },
    { posters: extendedPosters.slice(6, 18), speed: 65 },
    { posters: extendedPosters.slice(9, 21), speed: 80 },
    { posters: extendedPosters.slice(1, 13), speed: 70 },
    { posters: extendedPosters.slice(4, 16), speed: 85 },
    { posters: extendedPosters.slice(7, 19), speed: 72 },
    { posters: extendedPosters.slice(2, 14), speed: 78 },
  ];

  return (
    <div className={`${absolute ? 'absolute' : 'fixed'} inset-0 overflow-hidden pointer-events-none z-0 opacity-30`}>
      <div className="absolute inset-0 flex gap-4 -mx-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 min-w-0 overflow-hidden relative">
            <div
              className="poster-column"
              style={{ animation: `scrollUp ${column.speed}s linear infinite` }}
            >
              {[...column.posters, ...column.posters, ...column.posters].map((poster, index) => (
                <div key={`${columnIndex}-${index}`} className="poster-item mb-4">
                  <img
                    src={poster}
                    alt="Background martyr portrait"
                    className="w-full h-auto object-cover border border-border/10 grayscale contrast-125"
                    style={{ aspectRatio: '3/4' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* White overlay — monochrome fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.98) 0%,
            rgba(255,255,255,0.92) 20%,
            rgba(255,255,255,0.85) 50%,
            rgba(255,255,255,0.92) 80%,
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
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        .poster-column { display: flex; flex-direction: column; }
        .poster-item { flex-shrink: 0; }
        @media (max-width: 768px) { .poster-item { margin-bottom: 0.5rem; } }
      `}</style>
    </div>
  );
}
