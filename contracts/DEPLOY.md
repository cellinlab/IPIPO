# IPIPO 智能合约部署指南

## 🚀 快速部署到 Monad Testnet

### 1. 环境准备

1. **复制环境变量文件**
   ```bash
   cd contracts
   cp env.example .env
   ```

2. **配置环境变量**
   编辑 `.env` 文件，填入实际值：
   ```bash
   # 部署者私钥 (不含0x前缀)
   PRIVATE_KEY=你的私钥
   
   # Monad Testnet RPC (待比赛方提供)
   MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
   
   # 平台手续费接收地址
   PLATFORM_FEE_RECIPIENT=0x742d35Cc5Ba1e2e5b9bC0e0ed50E38A8e9b9e999
   ```

### 2. 获取测试币

1. 访问 Monad Testnet 水龙头
2. 连接钱包到 Monad Testnet
3. 领取测试币（MON）
4. 确认余额足够支付部署gas

### 3. 部署合约

```bash
# 编译合约
forge build

# 运行测试（可选）
forge test

# 部署到 Monad Testnet
forge script script/Deploy.s.sol:Deploy --rpc-url $MONAD_TESTNET_RPC_URL --broadcast --verify
```

### 4. 验证部署

部署成功后会生成 `deployment.json` 文件，包含：
- 合约地址
- 部署者地址  
- 平台手续费设置
- 部署区块号

## 📋 合约功能概览

### 核心功能
- ✅ **创建活动** - 创作者发布影响力预售活动
- ✅ **购买权益凭证** - 买家购买ERC-1155代币
- ✅ **核销服务** - 持有者核销获得X平台曝光服务
- ✅ **提现收益** - 创作者提取销售收入
- ✅ **暂停/恢复** - 活动管理功能
- ✅ **透明度** - 链上数据完全公开

### 安全特性
- ✅ ReentrancyGuard - 防止重入攻击
- ✅ Pausable - 紧急暂停功能
- ✅ Ownable - 管理员权限控制
- ✅ 输入验证和边界检查
- ✅ 超额付款自动退还

## 🔧 Gas 优化报告

| 功能 | Gas 消耗 | 说明 |
|------|----------|------|
| 创建活动 | ~296k | 初次创建campaign |
| 购买权益凭证 | ~64k | 购买1-10个代币 |
| 核销服务 | ~145k | 销毁代币+记录 |
| 提现收益 | ~100k | 转账给创作者 |

## 🎯 前端集成准备

部署完成后，更新前端配置：

```typescript
// src/config/contracts.ts
export const IPIPO_CONTRACT = {
  address: "0x...", // 从 deployment.json 获取
  abi: [], // 从 out/IPIPO.sol/IPIPO.json 获取
  deploymentBlock: 123456 // 扫描事件的起始区块
}
```

## 🧪 测试用例覆盖

- ✅ 13个测试用例全部通过
- ✅ 覆盖正常流程和异常情况
- ✅ Gas消耗测试和优化
- ✅ 边界条件和权限验证

## ⚠️ 注意事项

1. **私钥安全** - 不要提交 `.env` 文件到Git
2. **测试网络** - 确保连接到正确的Monad Testnet
3. **Gas限制** - 部署可能需要较高gas limit
4. **合约验证** - 部署后在区块链浏览器验证合约代码

---

*IPIPO合约已准备好部署到Monad Testnet! 🚀*
