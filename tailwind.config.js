/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ipipo-pink': '#E91E63',
        'ipipo-purple': '#9C27B0',
        'ipipo-blue': '#2196F3',
        'ipipo-cyan': '#00BCD4',
        'ipipo-dark': '#0F0F23',
        'ipipo-gray': '#1A1B3A',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-web3': 'linear-gradient(135deg, #E91E63 0%, #9C27B0 25%, #673AB7 50%, #3F51B5 75%, #2196F3 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(233, 30, 99, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(233, 30, 99, 0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'web3': '0 0 20px rgba(233, 30, 99, 0.3)',
        'web3-lg': '0 0 40px rgba(233, 30, 99, 0.4)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(233, 30, 99, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(233, 30, 99, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        ipipo: {
          "primary": "#E91E63",        // 主粉色
          "primary-content": "#ffffff",
          "secondary": "#9C27B0",      // 紫色
          "secondary-content": "#ffffff",
          "accent": "#00BCD4",         // 青色
          "accent-content": "#ffffff",
          "neutral": "#1A1B3A",        // 深蓝灰
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",       // 白色背景
          "base-200": "#f8fafc",       // 浅灰背景
          "base-300": "#e2e8f0",       // 边框色
          "base-content": "#1e293b",   // 文字色
          "info": "#2196F3",           // 蓝色
          "info-content": "#ffffff",
          "success": "#4CAF50",        // 绿色
          "success-content": "#ffffff",
          "warning": "#FF9800",        // 橙色
          "warning-content": "#ffffff",
          "error": "#F44336",          // 红色
          "error-content": "#ffffff",
        },
        "ipipo-dark": {
          "primary": "#E91E63",        // 主粉色
          "primary-content": "#ffffff",
          "secondary": "#9C27B0",      // 紫色
          "secondary-content": "#ffffff",
          "accent": "#00BCD4",         // 青色
          "accent-content": "#ffffff",
          "neutral": "#374151",        // 中性色
          "neutral-content": "#ffffff",
          "base-100": "#0F0F23",       // 深色背景
          "base-200": "#1A1B3A",       // 卡片背景
          "base-300": "#2D3748",       // 边框色
          "base-content": "#f1f5f9",   // 文字色
          "info": "#2196F3",           // 蓝色
          "info-content": "#ffffff",
          "success": "#4CAF50",        // 绿色
          "success-content": "#ffffff",
          "warning": "#FF9800",        // 橙色
          "warning-content": "#ffffff",
          "error": "#F44336",          // 红色
          "error-content": "#ffffff",
        },
      },
      "light",
      "dark",
    ],
    darkTheme: "ipipo-dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}
