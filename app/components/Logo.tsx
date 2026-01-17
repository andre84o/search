export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Background circle - Deep luxurious blue */}
      <circle cx="50" cy="50" r="48" fill="url(#blueGradient)" stroke="url(#goldGradient)" strokeWidth="1.5" />

      {/* Inner circle - Warm sun/gold */}
      <circle cx="50" cy="50" r="38" fill="url(#goldGradient)" opacity="0.1" />

      {/* Map pin shape */}
      <path
        d="M50 15C35 15 24 26 24 40C24 58 50 85 50 85C50 85 76 58 76 40C76 26 65 15 50 15Z"
        fill="url(#blueGradient)"
        stroke="url(#goldGradient)"
        strokeWidth="2"
      />

      {/* Swedish cross geometry but stylized */}
      <rect x="32" y="36" width="36" height="6" fill="#fbbf24" rx="1" />
      <rect x="47" y="24" width="6" height="36" fill="#fbbf24" rx="1" />

      {/* Center jewel */}
      <circle cx="50" cy="40" r="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />

      {/* Definitions for gradients */}
      <defs>
        <linearGradient id="blueGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}
