export type Project = {
  title: string;
  description: string;
  tags: string[];
  visual: "vehicle" | "fleet" | "inspection";
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
  role: "AI 與軟體工程作品集",
  bio: "我專注於打造實用的 AI 系統與軟體產品，特別關注電腦視覺、AI 應用，以及資料驅動的系統開發。",
  location: "所在地 — 請填入城市",
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
    href: "#",
    githubHref: "#",
  },
  {
    title: "HINO Fleet AI",
    description: "整合空間資料、路線分析與 AI 助理的車隊遙測分析平台，協助提升車隊營運效率與決策品質。",
    tags: ["LangChain", "PostgreSQL", "OSRM"],
    visual: "fleet",
    href: "#",
    githubHref: "#",
  },
  {
    title: "iRent AI",
    description: "結合影像品質檢查、車輛損傷分析與營運流程的 AI 輔助驗車系統。",
    tags: ["Computer Vision", "Node.js", "Vue"],
    visual: "inspection",
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
  { label: "資訊科學", detail: "建立軟體開發與系統設計的基礎。" },
  { label: "AI 專案", detail: "將研究與實驗轉化為實際應用。" },
  { label: "黑客松", detail: "透過團隊協作快速實作與迭代。" },
  { label: "技術學習", detail: "持續深化工程能力與實作經驗。" },
];
