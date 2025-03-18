import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: "emerald" | "blue" | "purple" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
  glowEffect?: boolean;
  hoverScale?: number;
  interactive?: boolean;
  showGridLines?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const VARIANTS = {
  emerald: {
    accent: "emerald-500",
    gradient: "from-emerald-500/20 to-emerald-500/0",
    shine:
      "205deg, transparent 0deg, hsl(160deg 95% 39%) 20deg, hsl(160deg 100% 85% / 0.3) 280deg",
    border: "emerald-500/20",
    color: "rgb(16 185 129)",
  },
  blue: {
    accent: "blue-500",
    gradient: "from-blue-500/20 to-blue-500/0",
    shine:
      "205deg, transparent 0deg, hsl(220deg 95% 39%) 20deg, hsl(220deg 100% 85% / 0.3) 280deg",
    border: "blue-500/20",
    color: "rgb(59 130 246)",
  },
  purple: {
    accent: "purple-500",
    gradient: "from-purple-500/20 to-purple-500/0",
    shine:
      "205deg, transparent 0deg, hsl(280deg 95% 39%) 20deg, hsl(280deg 100% 85% / 0.3) 280deg",
    border: "purple-500/20",
    color: "rgb(168 85 247)",
  },
  amber: {
    accent: "amber-500",
    gradient: "from-amber-500/20 to-amber-500/0",
    shine:
      "205deg, transparent 0deg, hsl(40deg 95% 39%) 20deg, hsl(40deg 100% 85% / 0.3) 280deg",
    border: "amber-500/20",
    color: "rgb(245 158 11)",
  },
  rose: {
    accent: "rose-500",
    gradient: "from-rose-500/20 to-rose-500/0",
    shine:
      "205deg, transparent 0deg, hsl(340deg 95% 39%) 20deg, hsl(340deg 100% 85% / 0.3) 280deg",
    border: "rose-500/20",
    color: "rgb(244 63 94)",
  },
};

const SIZES = {
  sm: {
    padding: "p-4 pt-8",
    iconSize: "h-5 w-5",
    titleSize: "text-sm",
    descSize: "text-xs",
  },
  md: {
    padding: "p-5 pt-10",
    iconSize: "h-6 w-6",
    titleSize: "text-base",
    descSize: "text-xs",
  },
  lg: {
    padding: "p-6 pt-12",
    iconSize: "h-7 w-7",
    titleSize: "text-lg",
    descSize: "text-sm",
  },
};

const GRID_STRUCTURE = {
  columns: [
    { start: 0, width: 22.5 },
    { start: 25, width: 25 },
    { start: 50, width: 25 },
    { start: 75, width: 22.5 },
  ],
  rows: [
    { start: 0, height: 10 },
    { start: 10, height: 22.5 },
    { start: 32.5, height: 22.5 },
  ],
};

export function PulseCard({
  icon,
  title,
  description,
  className,
  variant = "emerald",
  size = "md",
  glowEffect = false,
  hoverScale = 1.02,
  interactive = true,
  showGridLines = true,
  onClick,
  disabled = false,
  isActive = false,
}: CardProps) {
  const variantConfig = VARIANTS[variant];
  const sizeConfig = SIZES[size];

  const Div = interactive ? motion.div : "div";
  const IconWrapper = interactive ? motion.span : "span";

  return (
    <Div
      whileHover={interactive && !disabled ? { scale: hoverScale } : undefined}
      transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
      className={`
        group relative z-10 overflow-hidden rounded-lg transition-all
        ${sizeConfig.padding}
        bg-white/10 backdrop-blur-md
        dark:bg-dark-900/40 dark:backdrop-blur-md
        before:absolute before:inset-0 before:rounded-[inherit] before:content-['']
        after:absolute after:inset-0 after:rounded-[inherit] after:content-['']
        ${glowEffect ? `hover:before:bg-${variantConfig.accent}/10` : ''}
        shadow-[0px_3px_8px_rgba(0,0,0,0.05),0px_2px_5px_rgba(0,0,0,0.05)]
        hover:shadow-[0px_5px_15px_rgba(0,0,0,0.08),0px_15px_35px_rgba(0,0,0,0.15)]
        dark:shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_5px_10px_rgba(0,0,0,0.2)]
        dark:hover:shadow-[0px_5px_15px_rgba(0,0,0,0.2),0px_15px_35px_rgba(0,0,0,0.3)]
        ${isActive ? `ring-2 ring-offset-2 ring-offset-dark-900 dark:ring-offset-dark-900 ring-${variantConfig.accent}` : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className || ''}
      `}
      style={
        {
          "--card-color": variantConfig.color,
        } as React.CSSProperties
      }
      onClick={!disabled && onClick ? onClick : undefined}
    >
      {/* Moving Border */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      >
        <div
          className={`absolute inset-[-200%] opacity-0 transition-opacity duration-500 ${
            isActive ? "opacity-100" : "group-hover:opacity-100"
          }`}
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, var(--card-color) 360deg)`,
            animation: "spin 4s linear infinite",
          }}
        />
      </div>

      {/* Icon */}
      <IconWrapper
        className="relative z-10 table rounded-xl p-2"
        whileHover={interactive && !disabled ? { scale: 1.1 } : undefined}
        transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
      >
        <span
          className="absolute inset-[4.5px] rounded-[inherit] bg-dark-800/50 backdrop-blur-sm transition-all duration-300"
        />
        <span
          className={`
            relative z-1 block transition-colors duration-300
            text-white/70 group-hover:text-[var(--card-color)]
            dark:text-white/70
            ${sizeConfig.iconSize}
          `}
        >
          {icon}
        </span>
      </IconWrapper>

      {/* Content */}
      <div className="relative z-10 mt-1">
        <h3
          className={`
            font-medium transition-colors duration-300
            text-white/90 group-hover:text-white
            dark:text-white/90 dark:group-hover:text-white
            ${sizeConfig.titleSize}
          `}
        >
          {title}
        </h3>
        <p
          className={`
            mt-1 transition-colors duration-300
            text-white/70 group-hover:text-white/90
            dark:text-white/70 dark:group-hover:text-white/90
            ${sizeConfig.descSize}
          `}
        >
          {description}
        </p>

        {/* Grid Lines */}
        {showGridLines && (
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            {/* Horizontal Lines */}
            {GRID_STRUCTURE.rows.map((row, i) => (
              <div
                key={`h-${i}`}
                className="duration-[350ms] absolute inset-x-0 h-[1px] origin-[0%_50%] scale-x-0 transition-transform group-hover:scale-x-100"
                style={{
                  top: `${row.start}%`,
                  transitionDelay: `${(i) * 150}ms`,
                  background: `linear-gradient(to right, ${variantConfig.color}00, ${variantConfig.color}40, ${variantConfig.color}00)`
                }}
              />
            ))}
            
            {/* Vertical Lines */}
            {GRID_STRUCTURE.columns.map((col, i) => (
              <div
                key={`v-${i}`}
                className="duration-[350ms] absolute inset-y-0 w-[1px] origin-[50%_0%] scale-y-0 transition-transform group-hover:scale-y-100"
                style={{
                  left: `${col.start + col.width}%`,
                  transitionDelay: `${(i) * 150}ms`,
                  background: `linear-gradient(to bottom, ${variantConfig.color}00, ${variantConfig.color}40, ${variantConfig.color}00)`
                }}
              />
            ))}
          </div>
        )}

        {/* Grid Cells */}
        <div className="group-hover:delay-[500ms] absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100">
          {GRID_STRUCTURE.rows.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {GRID_STRUCTURE.columns.map((col, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="absolute animate-pulse-tile opacity-0"
                  style={{
                    top: `${row.start}%`,
                    left: `${col.start}%`,
                    width: `${col.width}%`,
                    height: `${row.height}%`,
                    animationDelay: `${((rowIndex + colIndex) % 3) * 2}s`,
                    background: `linear-gradient(to bottom right, ${variantConfig.color}30, ${variantConfig.color}00)`
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Div>
  );
} 