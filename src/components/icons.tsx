export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="hsl(var(--primary))" stroke="none" />
    <path d="M12 16.5c-2.28 0-4.22-1.42-5-3.5h10c-.78 2.08-2.72 3.5-5 3.5z" fill="hsl(var(--background))" />
    <path d="M12 2a10 10 0 0 0-3.54 19.46" />
    <path d="M12 2a10 10 0 0 1 3.54 19.46" />
    <path d="M12 8a4.5 4.5 0 0 0-4.5 4.5" />
  </svg>
);
