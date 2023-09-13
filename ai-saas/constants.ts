import { Code, ImagePlus, MessageCircle, Music, VideoIcon } from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: "Conversação",
    icon: MessageCircle,
    href: "/conversation",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Gerar Imagens",
    icon: ImagePlus,
    color: "text-pink-700",
    bgColor: "bg-emerald-500/10",
    href: "/image",
  },
  {
    label: "Gerar Videos",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-pink-700/10",
    href: "/video",
  },
  {
    label: "Gerar Músicas",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-orange-700/10",
    href: "/music",
  },
  {
    label: "Gerar Código",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
];
