import type { SVGProps } from 'react';

export function BusMarkerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 17h2l.64-2.56a2.5 2.5 0 0 0-1.94-3.44H5.3a2.5 2.5 0 0 0-1.94 3.44L4 17h2" />
      <path d="M19 17H5v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5Z" />
      <path d="M5 17H3" />
      <path d="M21 17h-2" />
      <circle cx="7" cy="20" r="2" />
      <circle cx="17" cy="20" r="2" />
    </svg>
  );
}
