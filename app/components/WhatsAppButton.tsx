"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappGroupUrl = "https://chat.whatsapp.com/BEq5RbAyvpF1SvnzGgSNoU?s=cl&p=a&mlu=4";

  return (
    <a
      href={whatsappGroupUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our WhatsApp group"
      title="Join our WhatsApp group"
      className="
        fixed bottom-6 right-6 z-[9999]
        flex h-16 w-16 items-center justify-center
        rounded-full
        bg-[#25D366]
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:-translate-y-1
        hover:scale-105
      "
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 fill-white"
        aria-hidden="true"
      >
        <path d="M16.04 3C9.39 3 4 8.25 4 14.73c0 2.29.69 4.53 1.98 6.42L4 29l8.05-2.05a12.27 12.27 0 0 0 3.98.67h.01C22.69 27.62 28 22.37 28 15.89 28 9.41 22.69 3 16.04 3Zm0 22.63a10.1 10.1 0 0 1-3.46-.61l-.5-.18-4.78 1.22 1.28-4.55-.33-.52a9.72 9.72 0 0 1-1.52-5.2c0-5.37 4.46-9.74 9.94-9.74s9.94 4.37 9.94 9.74-4.46 9.84-9.94 9.84h-.63Zm5.46-7.29c-.3-.15-1.77-.85-2.04-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.14-.17.2-.35.22-.65.07-.3-.15-1.26-.45-2.4-1.44a8.85 8.85 0 0 1-1.66-2.01c-.17-.29-.02-.45.13-.6.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.19.05-.36-.02-.51-.08-.15-.67-1.58-.92-2.16-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.36-.27.29-1.04 1-1.04 2.44s1.07 2.83 1.22 3.03c.15.19 2.1 3.14 5.09 4.4.71.3 1.27.48 1.7.62.71.22 1.36.19 1.87.12.57-.08 1.77-.71 2.02-1.39.25-.68.25-1.26.17-1.39-.07-.12-.27-.19-.57-.34Z" />
      </svg>
    </a>
  );
}