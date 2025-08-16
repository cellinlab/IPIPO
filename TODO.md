# IPIPO 项目开发计划

## 阶段一：前端基础框架和Mock数据 (Week 1-2)

### 1. 项目初始化 ✅
- [x] 创建git仓库
- [x] 搭建Vite + React + TypeScript项目
- [x] 配置Tailwind CSS + DaisyUI
- [x] 设置路由结构 (React Router)
- [x] 创建基础项目文件结构
- [x] 配置ESLint和基础开发环境
- [x] 创建布局组件和页面框架

### 2. Mock数据和API接口
- [ ] 设计Mock数据结构 (campaigns, users, vouchers)
- [ ] 创建Mock API服务 (json-server 或 MSW)
- [ ] 模拟Web3钱包连接状态
- [ ] 模拟合约交互方法 (buy, redeem, withdraw等)

### 3. UI组件库开发
- [ ] 基础组件：Button, Card, Modal, Input, Select
- [ ] 业务组件：CampaignCard, VoucherCard, PriceDisplay
- [ ] 导航组件：Header, Navigation, Footer
- [ ] 响应式布局组件

## 阶段二：核心功能页面 (Week 2-3)

### 4. Explore页面 (活动探索)
- [ ] 活动卡片列表展示
- [ ] 筛选和排序功能 (类型、价格、剩余数量)
- [ ] 购买功能UI和交互
- [ ] 分页或无限滚动

### 5. Campaign详情页
- [ ] 活动详细信息展示
- [ ] MetaURI数据展示 (X主页链接、Showcase等)
- [ ] 购买数量选择和价格计算
- [ ] 持有者列表展示

### 6. My Vouchers页面 (我的代金券)
- [ ] 个人持有的代金券列表
- [ ] 代金券详情和状态显示
- [ ] 核销功能 (提交proofURL)
- [ ] 核销历史记录

### 7. Creator Dashboard (创作者面板)
- [ ] 创建新活动表单
- [ ] 活动管理 (暂停/恢复、编辑)
- [ ] 设置MetaURI功能
- [ ] 提现功能界面
- [ ] 收益统计和分析

## 阶段三：高级功能和优化 (Week 3-4)

### 8. 持有者列表功能
- [ ] 按活动显示持有者信息
- [ ] 持有数量和比例统计
- [ ] 转账记录追踪 (Mock版本)

### 9. 透明度面板
- [ ] 供给和销售统计展示
- [ ] 超发检查显示
- [ ] 实时数据更新

### 10. 用户体验优化
- [ ] Loading状态和错误处理
- [ ] 表单验证和用户反馈
- [ ] 移动端适配优化
- [ ] 暗色模式支持

## 阶段四：演示文档准备 (Week 4)

### 11. 功能演示文档
- [ ] 用户操作流程截图
- [ ] 各功能模块演示视频
- [ ] 界面设计说明文档
- [ ] Mock数据和API接口文档
- [ ] Web3集成需求文档

## 阶段五：Web3集成 (Week 5-6)

### 12. 智能合约开发
- [ ] 基于ERC-1155的IPIPO合约
- [ ] 合约测试和部署脚本
- [ ] 合约验证和安全检查

### 13. 前端Web3集成
- [ ] 集成wagmi/viem + RainbowKit
- [ ] 替换Mock数据为真实合约调用
- [ ] 事件监听和状态同步
- [ ] 错误处理和用户体验优化

## 开发优先级

**高优先级 (MVP必需):**
- 项目初始化 ✅
- Mock数据和基础UI组件
- Explore页面和购买流程
- Creator Dashboard基础功能

**中优先级:**
- My Vouchers和核销功能
- Campaign详情页
- 透明度面板

**低优先级 (可后续迭代):**
- 高级统计功能
- 复杂的数据可视化
- 二级市场功能

## 技术栈

**前端:**
- Vite + React 18 + TypeScript
- Tailwind CSS + DaisyUI
- React Router
- React Hook Form + Zod
- Zustand (状态管理)

**Mock阶段:**
- JSON Server 或 MSW (Mock Service Worker)
- 本地存储 (localStorage)

**Web3阶段:**
- wagmi + viem
- RainbowKit
- Foundry (合约开发)
- Monad Testnet

---

*备注：每个阶段完成后进行code review和功能测试，确保质量后再进入下一阶段。*
