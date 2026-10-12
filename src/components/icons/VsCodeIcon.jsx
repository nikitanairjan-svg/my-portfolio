export default function VsCodeIcon({ className = "h-full w-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#007ACC" />
      <path
        d="M38 30 20 50l18 20M62 30l18 20-18 20M58 27 42 73"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
