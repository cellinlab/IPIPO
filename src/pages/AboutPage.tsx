import { Link } from 'react-router-dom'
import { ExternalLink, Target, Shield, TrendingUp, Users, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 页面头部 */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            IPIPO 白皮书
          </h1>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 blur-3xl -z-10"></div>
        </div>
        <p className="text-2xl text-base-content/80 font-medium">
          Influence Pre-sale, Influence Public Offering
        </p>
        <p className="text-lg text-base-content/60 mb-4">
          IP = Influence Pre-sale | IP = Individual Personal Brand
        </p>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
          为个人IP（个人品牌）影响力构建的区块链预售平台
        </p>
      </div>

      {/* 核心理念 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">💡 核心理念</h2>
          
          <div className="prose prose-lg max-w-none">
            <blockquote className="text-xl italic text-center border-l-4 border-primary pl-6 py-4 bg-base-200 rounded-r-lg">
              "Sell tomorrow's attention, today."<br/>
              <span className="text-base text-base-content/70">— 今天预售明天的注意力</span>
            </blockquote>
            
            <p className="text-lg leading-relaxed mt-6">
              <strong>IPIPO</strong> 让个人IP（个人品牌/创作者）将 <strong>未来的影响力预期</strong> 提前变现，通过预售 <strong>X / Twitter</strong> 
              上的曝光服务（<strong>Tweet / Quote / Reply</strong>）获得即时现金流。早期支持者以当前较低价格 <strong>预购未来的粉丝注意力</strong>，
              当个人IP成长为大V后，这些权益凭证的价值将随着个人品牌影响力增长而提升。
            </p>
            
            <div className="alert alert-info mt-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <div className="font-bold">双重IP含义</div>
                  <div className="text-sm">
                    <strong>IP (Influence Pre-sale)</strong> = 影响力预售 • 
                    <strong>IP (Individual Personal Brand)</strong> = 个人品牌
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 项目背景 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">🌟 项目背景</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                个人IP（个人品牌）痛点
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>低粉丝阶段无法将 <strong>个人品牌未来影响力预期</strong> 变现</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>个人品牌成长期缺乏启动资金和早期粉丝支持</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>个人影响力定价缺乏透明市场机制</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-secondary" />
                早期支持者需求
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>以 <strong>当前低价</strong> 预购潜力个人IP的 <strong>未来注意力</strong></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>参与优质个人品牌的早期成长，分享影响力增值</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>需要透明的供给机制，避免个人IP无限增发权益</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 解决方案 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">🚀 IPIPO 解决方案</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-base-100 rounded-lg">
              <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">区块链透明</h3>
              <p className="text-sm text-base-content/70">
                供给量、销售记录、持有者分布全部上链，避免超发，降低信息不对称
              </p>
            </div>
            
            <div className="text-center p-6 bg-base-100 rounded-lg">
              <TrendingUp className="w-12 h-12 mx-auto text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">个人IP影响力预期变现</h3>
              <p className="text-sm text-base-content/70">
                个人IP（个人品牌）可在早期阶段将 <strong>未来影响力预期</strong> 代币化，提前获得发展资金和粉丝支持
              </p>
            </div>
            
            <div className="text-center p-6 bg-base-100 rounded-lg">
              <Zap className="w-12 h-12 mx-auto text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">服务标准化</h3>
              <p className="text-sm text-base-content/70">
                将推文服务标准化为 ERC-1155 代币，支持转让和二级市场交易
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 产品功能 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">⚡ 产品功能</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">📝 支持的服务类型</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-base-100 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    🐦
                  </div>
                  <div>
                    <div className="font-semibold">Tweet</div>
                    <div className="text-sm text-base-content/70">发布一条推文</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-base-100 rounded-lg">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-3">
                    🔄
                  </div>
                  <div>
                    <div className="font-semibold">Quote</div>
                    <div className="text-sm text-base-content/70">引用转推</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-base-100 rounded-lg">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                    💬
                  </div>
                  <div>
                    <div className="font-semibold">Reply</div>
                    <div className="text-sm text-base-content/70">回复评论</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">🔧 核心功能</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">活动创建</div>
                    <div className="text-sm text-base-content/70">设定服务类型、价格、供应量</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">权益凭证购买</div>
                    <div className="text-sm text-base-content/70">支付ETH获得ERC-1155代币</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">服务核销</div>
                    <div className="text-sm text-base-content/70">提交proof URL核销服务</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">透明度保障</div>
                    <div className="text-sm text-base-content/70">供给、销量、持有者全部可查</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 技术架构 */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">🏗️ 技术架构</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">📱 前端技术栈</h3>
              <div className="space-y-2">
                <div className="badge badge-primary badge-outline">Vite + React 18</div>
                <div className="badge badge-secondary badge-outline">TypeScript</div>
                <div className="badge badge-accent badge-outline">Tailwind CSS + DaisyUI</div>
                <div className="badge badge-info badge-outline">wagmi + viem</div>
                <div className="badge badge-success badge-outline">RainbowKit</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">⛓️ 区块链技术</h3>
              <div className="space-y-2">
                <div className="badge badge-primary badge-outline">ERC-1155 标准</div>
                <div className="badge badge-secondary badge-outline">Solidity + Foundry</div>
                <div className="badge badge-accent badge-outline">Monad Testnet</div>
                <div className="badge badge-info badge-outline">事件监听</div>
                <div className="badge badge-success badge-outline">IPFS MetaURI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 合规说明 */}
      <div className="card bg-gradient-card border border-warning/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 flex items-center">
            <AlertTriangle className="w-8 h-8 text-warning mr-2" />
            <span className="gradient-text">⚖️ 合规说明</span>
          </h2>
          
          <div className="alert alert-warning">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">重要声明</h3>
              <div className="text-sm space-y-1">
                <p>• 本项目发行的是 <strong>服务券</strong>，<strong>不是证券</strong></p>
                <p>• 无任何分红或收益承诺</p>
                <p>• 交付物是一次具体的 X 曝光服务</p>
                <p>• 提供完整的透明度工具便于买家自查</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-semibold mb-3">✅ 我们提供的保障</h4>
              <ul className="space-y-2 text-sm">
                <li>• 总量上限控制</li>
                <li>• 暂停销售功能</li>
                <li>• 已售统计透明</li>
                <li>• 持有者列表公开</li>
                <li>• 超发检查机制</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">❌ 我们不承诺的内容</h4>
              <ul className="space-y-2 text-sm">
                <li>• 不保证投资收益</li>
                <li>• 不提供分红回报</li>
                <li>• 不承诺价格上涨</li>
                <li>• 不进行二级市场操作</li>
                <li>• 不提供仲裁服务</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="card bg-gradient-card border border-primary/20 shadow-web3">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 gradient-text">🗺️ 发展路线</h2>
          
          <div className="timeline timeline-vertical">
            <div className="timeline-item">
              <div className="timeline-start timeline-box bg-primary text-primary-content">
                <div className="font-bold">阶段 1</div>
                <div className="text-sm">MVP 上线</div>
              </div>
              <div className="timeline-middle">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="timeline-end">
                <div className="text-sm text-base-content/70">
                  基础功能、Mock 演示、前端完成
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-start">
                <div className="text-sm text-base-content/70">
                  智能合约开发、测试网部署
                </div>
              </div>
              <div className="timeline-middle">
                <div className="w-5 h-5 bg-secondary rounded-full"></div>
              </div>
              <div className="timeline-end timeline-box bg-secondary text-secondary-content">
                <div className="font-bold">阶段 2</div>
                <div className="text-sm">合约集成</div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-start timeline-box bg-accent text-accent-content">
                <div className="font-bold">阶段 3</div>
                <div className="text-sm">功能扩展</div>
              </div>
              <div className="timeline-middle">
                <div className="w-5 h-5 bg-accent rounded-full"></div>
              </div>
              <div className="timeline-end">
                <div className="text-sm text-base-content/70">
                  线性加价、信誉系统、多平台支持
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 行动召唤 */}
      <div className="card bg-gradient-web3 text-white shadow-web3">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl mb-4 justify-center">🚀 开始体验 IPIPO</h2>
          <p className="text-lg mb-6 opacity-90">
            立即探索影响力预售的新世界，见证区块链如何重新定义创作者经济
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn btn-white btn-lg">
              🔍 探索活动
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-white btn-lg">
              ✨ 创建活动
            </Link>
            <a 
              href="https://x.com/cellinlab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline btn-white btn-lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              关注更新
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
