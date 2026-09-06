export type Project = {
  title: string;
  description: string;
  tags: string[];
  visual: "vehicle" | "fleet" | "inspection";
  isExample?: boolean;
  href: string;
  githubHref: string;
};

export type Skill = {
  title: string;
  icon: "brain" | "code" | "vision" | "data";
  items: string[];
};

export const profile = {
  name: "YunHsi Lee",
  role: "資訊工程學生作品集",
  bio: "我是國立中山大學資訊工程學系全英學士班大三學生，目前主要透過課程、專案、實習與黑客松累積軟體開發與 AI 相關經驗。",
  location: "所在地 — 高雄",
  email: "yyyunxiii419@gmail.com",
  emailHref: "mailto:yyyunxiii419@gmail.com",
  github: "github.com/yyyunx",
  githubHref: "https://github.com/yyyunx",
  linkedin: "LinkedIn — 請填入個人頁面",
  linkedinHref: "#",
} as const;

// TODO: Replace placeholder links with verified project and social URLs.
export const projects: Project[] = [
  {
    title: "Vehicle Orientation Classifier",
    description: "運用真實車輛影像資料集，建立可辨識 0°、90°、180° 與 270° 方位的車輛影像分類流程。",
    tags: ["PyTorch", "Computer Vision", "ResNet18"],
    visual: "vehicle",
    isExample: true,
    href: "#",
    githubHref: "#",
  },
  {
    title: "HINO Fleet AI",
    description: "整合空間資料、路線分析與 AI 助理的車隊遙測分析平台，協助提升車隊營運效率與決策品質。",
    tags: ["LangChain", "PostgreSQL", "OSRM"],
    visual: "fleet",
    isExample: true,
    href: "#",
    githubHref: "#",
  },
  {
    title: "iRent AI",
    description: "結合影像品質檢查、車輛損傷分析與營運流程的 AI 輔助驗車系統。",
    tags: ["Computer Vision", "Node.js", "Vue"],
    visual: "inspection",
    isExample: true,
    href: "#",
    githubHref: "#",
  },
];

export const skills: Skill[] = [
  { title: "機器學習", icon: "brain", items: ["PyTorch", "Scikit-learn", "Transformers", "LangChain", "模型評估"] },
  { title: "後端開發", icon: "code", items: ["Python", "Node.js", "FastAPI / Express", "REST API", "Docker"] },
  { title: "電腦視覺", icon: "vision", items: ["PyTorch", "OpenCV", "影像分類", "物件偵測", "影像分割"] },
  { title: "資料與空間系統", icon: "data", items: ["PostgreSQL", "GeoTIFF", "OSRM", "空間索引", "ETL / 資料管線"] },
];

export const milestones = [
  { label: "資訊工程", detail: "透過課程與專案建立程式設計、資料結構與軟體開發基礎。" },
  { label: "AI 與電腦視覺", detail: "目前主要接觸 AI 應用、影像處理與電腦視覺相關專案。" },
  { label: "專案與黑客松", detail: "透過團隊專案與黑客松練習把想法做成可以實際操作的成果。" },
  { label: "技術學習", detail: "把開發過程中遇到的新技術整理成筆記，持續累積實作經驗。" },
];
