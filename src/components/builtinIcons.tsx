import {useEffect, useState, type FC, type ReactNode} from "react";
import type {SocialMedia} from "../store/ui.store.ts";
import {usePhotoStore} from "../store/usePhotoStore.ts";

const builtinIcons: Record<string, ReactNode> = {
  "vk.com": (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.271.678-1.846 0-3.896-1.119-5.342-3.202C4.77 11.027 4.18 8.423 4.18 7.77c0-.254.102-.492.593-.492h1.744c.44 0 .61.203.78.678.915 2.681 2.441 5.028 3.064 5.028.237 0 .339-.119.339-.779V9.712c-.085-1.39-.813-1.508-.813-2-.034-.186.153-.372.407-.372h2.712c.372 0 .508.203.508.643v3.473c0 .372.169.508.271.508.237 0 .423-.136.847-.559 1.254-1.407 2.151-3.574 2.151-3.574.119-.254.322-.492.763-.492h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.203.339-.271.491 0 .847.203.254.864.847 1.305 1.356.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
    </svg>
  ),
  "t.me": (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  "wa.me": (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"
      />
    </svg>
  ),
};

const normalizeLink = (link: string) => {
  if (!/^https?:\/\//.test(link)) return `https://${link}`;
  return link;
};

const getHostname = (link: string) => {
  try {
    return new URL(normalizeLink(link)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const SocialIcon: FC<{ media: SocialMedia }> = ({media}) => {
  const photoStore = usePhotoStore();
  const [customSrc, setCustomSrc] = useState<string | null>(null);

  const href = normalizeLink(media?.link ?? '');
  const hostname = getHostname(href);

  const isVK = hostname.includes("vk.com");
  const isTelegram = hostname.includes("t.me");
  const isWhatsApp = hostname.includes("wa.me") || hostname.includes("whatsapp");

  useEffect(() => {
    let mounted = true;
    if (!isVK && !isTelegram && !isWhatsApp && media.image) {
      if (photoStore.error[media.image]) return;

      void photoStore.loadPhoto(media.image).then((url) => {
        if (mounted && url) setCustomSrc(url);
      });
    }
    return () => {
      mounted = false;
    };
  }, [media.image, isVK, isTelegram, isWhatsApp, photoStore]);

  let icon: ReactNode;
  if (isVK) {
    icon = builtinIcons["vk.com"];
  } else if (isTelegram) {
    icon = builtinIcons["t.me"];
  } else if (isWhatsApp) {
    icon = builtinIcons["wa.me"];
  } else if (customSrc) {
    icon = (
      <img
        src={customSrc}
        alt={hostname}
        className="w-5 h-5 object-contain"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = "none";
        }}
      />
    );
  } else {
    icon =
      <span className="font-semibold text-sm">{hostname[0]?.toUpperCase() || "?"}</span>;
  }

  const bgClass = isVK
    ? "hover:bg-primary-600"
    : isTelegram
      ? "hover:bg-primary-500"
      : isWhatsApp
        ? "hover:bg-green-600"
        : "hover:bg-gray-700";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={hostname}
      className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors ${bgClass}`}
    >
      {icon}
    </a>
  );
};

export default SocialIcon;