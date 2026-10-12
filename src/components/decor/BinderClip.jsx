export default function BinderClip({ className = "", rotate = 0 }) {
  return (
    <div
      className={`pointer-events-none relative z-10 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="mount-clip h-3 w-5 rounded-[3px]" />
      <div className="absolute inset-x-1 top-[3px] h-px bg-white/20" />
      <div className="mx-auto h-1.5 w-px bg-neutral-700" />
    </div>
  );
}
