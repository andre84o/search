export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with Swedish blue */}
      <circle cx="50" cy="50" r="48" fill="#006AA7" />

      {/* Inner circle - warm Spanish orange/sun */}
      <circle cx="50" cy="50" r="38" fill="#F4A300" />

      {/* Map pin shape */}
      <path
        d="M50 15C35 15 24 26 24 40C24 58 50 85 50 85C50 85 76 58 76 40C76 26 65 15 50 15Z"
        fill="#006AA7"
        stroke="#FECC00"
        strokeWidth="3"
      />

      {/* Swedish cross on pin */}
      <rect x="32" y="36" width="36" height="8" fill="#FECC00" rx="1" />
      <rect x="46" y="24" width="8" height="36" fill="#FECC00" rx="1" />

      {/* Small dot in center */}
      <circle cx="50" cy="40" r="6" fill="#006AA7" stroke="#FECC00" strokeWidth="2" />
    </svg>
  );
}
