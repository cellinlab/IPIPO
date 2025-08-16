# IPIPO 前端项目启动指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

项目将在 `http://localhost:3000` 启动。

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── Layout/         # 布局组件
│   ├── UI/             # 基础UI组件 (待创建)
│   └── Business/       # 业务组件 (待创建)
├── pages/              # 页面组件
│   ├── ExplorePage.tsx     # 探索页面
│   ├── CampaignDetailPage.tsx # 活动详情页
│   ├── MyVouchersPage.tsx     # 我的代金券页
│   └── CreatorDashboardPage.tsx # 创作者面板
├── hooks/              # 自定义hooks
│   └── useMockWallet.ts    # Mock钱包hook
├── data/               # 数据层
│   └── mockData.ts         # Mock数据
├── types/              # 类型定义
│   └── index.ts            # 主要类型定义
├── config/             # 配置文件
│   └── index.ts            # 应用配置
├── utils/              # 工具函数 (待创建)
├── styles/             # 样式文件 (如果需要)
└── main.tsx            # 应用入口
```

## 🎨 技术栈

- **框架**: Vite + React 18 + TypeScript
- **样式**: Tailwind CSS + DaisyUI
- **路由**: React Router DOM
- **状态管理**: Zustand
- **表单**: React Hook Form + Zod (待集成)
- **图标**: Lucide React

## 🔧 开发模式功能

### Mock 钱包
- 自动模拟钱包连接状态
- 存储在 localStorage 中持久化
- 默认余额: 1000 ETH
- 默认地址: `0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999`

### Mock 数据
- 预设了 4 个示例活动
- 包含不同类型：Tweet, Quote, Reply
- 模拟用户持有的代金券数据
- 包含购买和核销历史

## 📋 当前功能状态

### ✅ 已完成
- [x] 项目初始化和基础配置
- [x] 路由系统设置
- [x] 基础布局组件 (Header, Footer, Layout)
- [x] Mock钱包系统
- [x] Mock数据结构
- [x] 探索页面基础展示
- [x] 活动详情页面框架
- [x] 我的代金券页面框架
- [x] 创作者面板基础功能

### 🚧 进行中
- [ ] UI组件库完善
- [ ] 表单验证和提交
- [ ] 更详细的数据展示

### 📝 待开发
- [ ] 购买流程实现
- [ ] 核销功能实现
- [ ] 持有者列表展示
- [ ] 数据统计图表
- [ ] 响应式优化
- [ ] 错误处理和Loading状态
- [ ] 搜索和筛选功能

## 🛠️ 开发指南

### 添加新页面
1. 在 `src/pages/` 目录创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在导航中添加链接 (如需要)

### 添加新组件
1. 根据功能在 `src/components/` 相应目录创建组件
2. 遵循 TypeScript 严格模式
3. 使用 Tailwind CSS + DaisyUI 进行样式设计

### Mock数据修改
- 编辑 `src/data/mockData.ts` 文件
- 修改后页面会自动热重载

### 类型定义
- 在 `src/types/index.ts` 中添加新的类型定义
- 保持与智能合约接口的一致性

## 🎯 下一步计划

1. **完善UI组件库**: 创建可复用的基础组件
2. **实现购买流程**: 包含数量选择、价格计算、确认等
3. **完善核销功能**: 提交proof URL、状态追踪等
4. **添加数据图表**: 使用图表库展示统计数据
5. **优化用户体验**: Loading状态、错误处理、响应式等

## 🐛 已知问题

目前项目处于Mock阶段，以下功能为模拟实现：
- 钱包连接 (使用zustand模拟)
- 区块链交互 (使用本地数据模拟)
- 实时数据更新 (使用定时器模拟)

## 📞 支持

如有问题，请查看：
1. 控制台错误信息
2. 网络请求状态
3. 组件状态和props传递

---

*这是IPIPO项目的MVP前端实现，专注于功能演示和用户体验设计。*
