export const profile = {
  name: 'YunHsi Lee',
  github: 'https://github.com/yyyunx',
  email: 'yyyunxiii419@gmail.com',
  education: {
    'zh-tw': '國立中山大學 · 資訊工程學系全英學士班',
    en: 'National Sun Yat-sen University · English-taught undergraduate program in Computer Science',
  },
} as const;

// Learning directions, not completed projects or proficiency claims.
export const roadmap = [
  {
    title: 'Digital logic & Verilog',
    detail: {
      'zh-tw': '組合邏輯、循序邏輯、ALU 與 Register File',
      en: 'Combinational and sequential logic, ALU, and register file',
    },
  },
  {
    title: 'Computer architecture',
    detail: {
      'zh-tw': 'RISC-V、CPU 資料路徑、RTL 驗證與 FPGA 實作',
      en: 'RISC-V, CPU datapaths, RTL verification, and FPGA implementation',
    },
  },
  {
    title: 'PQC hardware',
    detail: {
      'zh-tw': '模運算、NTT / INTT 與後量子密碼硬體加速',
      en: 'Modular arithmetic, NTT / INTT, and post-quantum cryptography acceleration',
    },
  },
] as const;
