import type { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedin,
  FaJava,
  FaAws,
  FaRegEnvelope,
  FaRegFilePdf,
  FaCode,
  FaLock,
  FaChartBar,
  FaFileExcel,
  FaPaypal,
  FaCoffee,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaStar,
  FaArrowRight,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaChevronDown,
  FaCopy,
  FaCheck,
  FaQrcode,
  FaSyncAlt,
  FaHeart,
  FaDatabase,
  FaLink,
  FaRegClock,
} from "react-icons/fa";
import {
  SiLeetcode,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiRedis,
  SiPrisma,
  SiSocketdotio,
  SiReactquery,
  SiJavascript,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPython,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiDocker,
  SiGit,
  SiNginx,
  SiGithubactions,
  SiCloudinary,
  SiFigma,
  SiCanvas,
  SiJsonwebtokens,
} from "react-icons/si";
const icons: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  leetcode: SiLeetcode,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  postgresql: SiPostgresql,
  redis: SiRedis,
  prisma: SiPrisma,
  socketio: SiSocketdotio,
  query: SiReactquery,
  javascript: SiJavascript,
  express: SiExpress,
  mongodb: SiMongodb,
  mysql: SiMysql,
  java: FaJava,
  python: SiPython,
  html: SiHtml5,
  css: SiCss,
  tailwind: SiTailwindcss,
  bootstrap: SiBootstrap,
  docker: SiDocker,
  aws: FaAws,
  git: SiGit,
  nginx: SiNginx,
  githubactions: SiGithubactions,
  cloudinary: SiCloudinary,
  figma: SiFigma,
  canva: SiCanvas,
  jwt: SiJsonwebtokens,
  code: FaCode,
  lock: FaLock,
  chart: FaChartBar,
  sheet: FaFileExcel,
  email: FaRegEnvelope,
  resume: FaRegFilePdf,
  paypal: FaPaypal,
  coffee: FaCoffee,
  education: FaGraduationCap,
  location: FaMapMarkerAlt,
  star: FaStar,
  right: FaArrowRight,
  left: FaArrowLeft,
  external: FaExternalLinkAlt,
  chevron: FaChevronDown,
  copy: FaCopy,
  check: FaCheck,
  qr: FaQrcode,
  refresh: FaSyncAlt,
  heart: FaHeart,
  database: FaDatabase,
  link: FaLink,
  clock: FaRegClock,
};
export default function Icon({
  name,
  className,
  colored = false,
}: {
  name: string;
  className?: string;
  colored?: boolean;
}) {
  if (name === "email" && colored) {
    return (
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className={className}>
        <path fill="#4285f4" d="M2 20h4V10L0 5.5V18a2 2 0 0 0 2 2Z" />
        <path fill="#34a853" d="M18 20h4a2 2 0 0 0 2-2V5.5L18 10Z" />
        <path fill="#fbbc04" d="M18 10V4.2l2.2-1.65A2.4 2.4 0 0 1 24 4.5v1Z" />
        <path fill="#ea4335" d="M6 10V4.2l6 4.5 6-4.5V10l-6 4.5Z" />
        <path fill="#c5221f" d="M0 5.5v-1a2.4 2.4 0 0 1 3.8-1.95L6 4.2V10Z" />
      </svg>
    );
  }
  if (name === "leetcode" && colored) {
    return (
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className={className} fill="none" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.5 1.5 4.3 11.4" stroke="#60666d" />
        <path d="m17.9 9.4-3.5-2.8c-1.8-1.5-4.8-1.3-6.3.3l-3.8 4.5c-1.7 1.8-1.5 4.3.2 6l4.3 4.2c1.7 1.6 4.4 1.6 6.2-.1l2.4-2.4" stroke="#ffa116" />
        <path d="M10.6 14.2h10.2" stroke="#92999f" />
      </svg>
    );
  }
  const Component = icons[name] || FaCode;
  const colors: Record<string, string> = {
    email: "#ea4335",
    linkedin: "#2f9bdf",
    github: "#ffffff",
    resume: "#ff5c63",
  };
  return <Component aria-hidden="true" className={className} style={colored ? { color: colors[name] } : undefined} />;
}
