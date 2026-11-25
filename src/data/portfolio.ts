// Public facts confirmed by the owner. Keep private resume files outside this repo.
export const profile = {
  name: 'YunHsi Lee',
  github: 'https://github.com/yyyunx',
  email: 'yyyunxiii419@gmail.com',
  education: {
    university: 'National Sun Yat-sen University',
    department: 'Department of Computer Science and Engineering',
    program: "English-taught Bachelor's Program",
    expectedGraduation: { 'zh-tw': '2028 年 6 月', en: 'June 2028' },
    // Completed or currently enrolled; no individual completion status is claimed.
    coursework: [
      'Digital System',
      'Computer Organization',
      'Introduction to VLSI Design',
      'Assembly Language and Microcomputer',
      'Fundamental Signal Processing',
      'Operating Systems',
    ],
  },
  honors: [
    { distinction: 'Third Place', event: 'n8n Taiwan Open Hackathon 2026' },
  ],
  participation: [
    {
      role: 'Participant',
      event: '2026 Hotai AI Hackathon',
      project: 'irent-ai-dashboard',
    },
  ],
  assessments: [
    { name: 'TOEIC', result: '790/990' },
    {
      name: 'Collegiate Programming Examination (CPE)',
      result: '2 problems solved',
    },
  ],
  // Set only after the owner approves a public PDF and its complete contents.
  resume: { publicPdf: null as string | null },
} as const;

export const researchInterests = [
  {
    title: 'Digital IC Design',
    description: {
      'zh-tw': '對數位電路的設計方法與實作取捨有興趣。',
      en: 'Interested in digital circuit design methods and implementation tradeoffs.',
    },
  },
  {
    title: 'Computer Architecture',
    description: {
      'zh-tw': '希望進一步理解處理器、記憶體系統與運算效能的關係。',
      en: 'Interested in the relationship between processors, memory systems, and computing performance.',
    },
  },
  {
    title: 'FPGA',
    description: {
      'zh-tw': '未來希望透過可程式化硬體探索數位設計。',
      en: 'A future direction for exploring digital design on programmable hardware.',
    },
  },
  {
    title: 'Post-Quantum Cryptography (PQC)',
    description: {
      'zh-tw': '對後量子密碼中的運算結構與硬體實作問題有興趣。',
      en: 'Interested in the computation and hardware implementation of post-quantum cryptography.',
    },
  },
  {
    title: 'Hardware/Software Co-design',
    description: {
      'zh-tw': '希望了解硬體與軟體之間的工作分配、介面與資料流。',
      en: 'Interested in partitioning work, interfaces, and data flow between hardware and software.',
    },
  },
  {
    title: 'Hardware Acceleration',
    description: {
      'zh-tw': '關注特定運算的加速方式，以及效能與資源的取捨。',
      en: 'Interested in accelerating specific computations and balancing performance with resource use.',
    },
  },
] as const;

// Planned topics only: Verilog, RTL, FPGA and RISC-V study has not started.
export const roadmap = [
  {
    title: 'Digital logic & Verilog',
    detail: {
      'zh-tw': '未來規劃：組合與循序邏輯、ALU、Register File。',
      en: 'Planned: combinational and sequential logic, ALU, and register file.',
    },
  },
  {
    title: 'Architecture, RTL & FPGA',
    detail: {
      'zh-tw': '未來規劃：RISC-V、RTL 設計與驗證、FPGA 實作。',
      en: 'Planned: RISC-V, RTL design and verification, and FPGA implementation.',
    },
  },
  {
    title: 'PQC hardware acceleration',
    detail: {
      'zh-tw': '未來規劃：模運算、NTT / INTT 與硬體加速。',
      en: 'Planned: modular arithmetic, NTT / INTT, and hardware acceleration.',
    },
  },
] as const;
