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

export type Note = {
  title: string;
  description: string;
  category: string;
  visual: "exif" | "runnable" | "terrain";
  slug: string;
  href: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
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

export const notes: Note[] = [
  {
    title: "為什麼只有 EXIF Orientation 還不夠",
    description: "從實務角度解析影像方向中繼資料，以及電腦視覺管線仍需補上的檢查。",
    category: "電腦視覺",
    visual: "exif",
    slug: "exif-orientation",
    href: "/notes/exif-orientation/",
    sections: [
      {
        heading: "EXIF Orientation 解決了什麼？",
        paragraphs: [
          "相機或手機拍攝影像時，實際像素排列不一定與觀看時的方向相同。EXIF Orientation 會記錄影像應該如何旋轉或翻轉，讓支援這項資訊的軟體以正確方向顯示。",
          "問題在於，不同影像函式庫、上傳流程與壓縮工具對 EXIF 的處理方式並不一致。有些會自動旋轉像素，有些只讀取標記，也有些會在轉檔時直接移除中繼資料。",
        ],
      },
      {
        heading: "進入模型前需要統一影像狀態",
        paragraphs: [
          "電腦視覺模型接收的是像素，而不是使用者在相簿中看到的顯示結果。因此，資料管線應先讀取 Orientation、套用對應旋轉或鏡像，再移除或重設方向標記，確保後續處理只有一種明確解讀。",
          "完成正規化後，還需要驗證寬高比例、檔案格式與解碼結果。若資料來自多個來源，也應保留處理紀錄，方便追查單張影像在不同階段的方向變化。",
        ],
      },
      {
        heading: "模型與產品流程仍需防護",
        paragraphs: [
          "即使 EXIF 已正確處理，拍攝者仍可能真的把車輛或物件拍成側向。因此，影像方向分類器仍有價值：它能辨識像素內容本身的方向，而不是只相信中繼資料。",
          "較穩健的流程會結合中繼資料正規化、內容方向辨識與人工覆核機制，並針對手機截圖、重新編碼影像與缺少 EXIF 的檔案建立測試案例。",
        ],
      },
    ],
  },
  {
    title: "理解 LangChain Runnable",
    description: "認識如何透過 Runnable sequence，組合出更穩定、可預期的 AI 應用流程。",
    category: "AI 工程",
    visual: "runnable",
    slug: "langchain-runnable",
    href: "/notes/langchain-runnable/",
    sections: [
      {
        heading: "把 AI 流程視為可組合的步驟",
        paragraphs: [
          "Runnable 可以把提示詞、模型、資料轉換與輸出解析器視為具有一致介面的處理單元。每個步驟接收輸入並產生輸出，因此能像資料管線一樣組合與替換。",
          "這種結構比把所有邏輯寫進單一函式更容易閱讀，也讓測試可以聚焦在個別步驟，例如先驗證提示詞輸入，再獨立檢查解析器能否處理異常回覆。",
        ],
      },
      {
        heading: "Sequence 與 Parallel 的使用時機",
        paragraphs: [
          "循序處理適合前一步輸出會成為下一步輸入的情境，例如檢索資料、組合提示詞、呼叫模型，最後轉換成結構化結果。平行處理則適合多個互不依賴的任務，例如同時產生摘要、關鍵字與分類。",
          "設計時應先定義每一步的輸入輸出格式。若資料結構模糊，即使鏈結語法簡潔，錯誤仍會在執行到後段時才被發現。",
        ],
      },
      {
        heading: "可靠性來自可觀察與可測試",
        paragraphs: [
          "正式系統除了串接模型，也需要逾時、重試、錯誤分類與追蹤資訊。對每個 Runnable 記錄輸入摘要、耗時與輸出狀態，能讓問題更容易定位。",
          "對不可預期的模型輸出，應搭配明確 schema、解析失敗處理與安全的 fallback。Runnable 提供的是組合方式，系統可靠性仍取決於每個邊界是否被清楚定義。",
        ],
      },
    ],
  },
  {
    title: "從 GeoTIFF 到高程資料回填",
    description: "探討如何運用網格高程資料，讓空間分析與路線資訊更加完整。",
    category: "資料系統",
    visual: "terrain",
    slug: "geotiff-elevation",
    href: "/notes/geotiff-elevation/",
    sections: [
      {
        heading: "GeoTIFF 不只是一張圖片",
        paragraphs: [
          "GeoTIFF 會在網格影像中保存座標參考系統與地理定位資訊。對高程資料而言，每個像素代表特定位置的高度值，因此可以用來補足 GPS 點位或路線資料缺少的高程欄位。",
          "開始處理前，必須確認座標參考系統、像素解析度、NoData 值與高程單位。這些資訊若解讀錯誤，後續結果可能看似合理，實際上卻落在錯誤位置或使用錯誤單位。",
        ],
      },
      {
        heading: "從座標找到對應網格",
        paragraphs: [
          "回填流程會先把輸入點位轉換成 GeoTIFF 使用的座標系統，再計算該座標對應的像素列與欄。若需要更平滑的結果，可以使用鄰近像素插值；若重視可重現與速度，最近鄰取樣通常更簡單。",
          "批次處理大量點位時，應避免每筆資料都重新開啟檔案。較有效率的做法是依影像範圍分組、批次讀取網格區塊，並保留找不到有效高程的狀態。",
        ],
      },
      {
        heading: "回填後仍要驗證",
        paragraphs: [
          "資料回填完成後，可以檢查高程分布、相鄰點變化與 NoData 比例。沿路線突然出現極端落差，通常代表座標轉換、資料邊界或無效值處理出了問題。",
          "在實際系統中，建議保存來源資料版本、取樣方法與處理時間。這些欄位能協助日後更新資料集，也讓分析結果具有可追溯性。",
        ],
      },
    ],
  },
];

export const milestones = [
  { label: "資訊科學", detail: "建立軟體開發與系統設計的基礎。" },
  { label: "AI 專案", detail: "將研究與實驗轉化為實際應用。" },
  { label: "黑客松", detail: "透過團隊協作快速實作與迭代。" },
  { label: "技術學習", detail: "持續深化工程能力與實作經驗。" },
];
