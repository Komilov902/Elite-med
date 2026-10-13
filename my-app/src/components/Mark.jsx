export default function Mark({ shield = "currentColor", eye = "#fff", size = 34 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" aria-hidden="true">
      <path d="M8 6h84v54c0 28-24 46-42 55C32 106 8 88 8 60z" fill={shield} />
      <ellipse cx="50" cy="57" rx="32" ry="22" fill={eye} />
      <path fill={shield} d="M44 44h12v7h8v12h-8v7H44v-7h-8V51h8z" />
    </svg>
  );
}
