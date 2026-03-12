import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 品类库数据（20 个高潜力品类）
const categoryLibrary = [
  {
    id: 1,
    name: "劳保鞋",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "2.5-4.0",
    marketHeat: 4,
    profitMargin: "40-50%",
    newbieMonthlyTarget: 500,
    supplyChainComplexity: "low",
    description: "工作鞋需求稳定，B2B 批发市场成熟"
  },
  {
    id: 2,
    name: "表演服",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "3.0-5.0",
    marketHeat: 4,
    profitMargin: "45-55%",
    newbieMonthlyTarget: 400,
    supplyChainComplexity: "low",
    description: "年会、舞蹈表演服装需求季节性强"
  },
  {
    id: 3,
    name: "儿童收纳盒",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "1.5-3.0",
    marketHeat: 4,
    profitMargin: "50-60%",
    newbieMonthlyTarget: 600,
    supplyChainComplexity: "low",
    description: "小件高频消耗品，重复购买率高"
  },
  {
    id: 4,
    name: "家居收纳",
    channel: "淘宝",
    riskLevel: "green",
    supplyCost: "2.0-4.0",
    marketHeat: 4,
    profitMargin: "40-50%",
    newbieMonthlyTarget: 300,
    supplyChainComplexity: "medium",
    description: "居家需求大，图文销售效果好"
  },
  {
    id: 5,
    name: "美容工具",
    channel: "TEMU",
    riskLevel: "green",
    supplyCost: "1.0-2.0",
    marketHeat: 3,
    profitMargin: "30-40%",
    newbieMonthlyTarget: 2000,
    supplyChainComplexity: "medium",
    description: "小单品，低价易售，销量大"
  },
  {
    id: 6,
    name: "儿童服饰",
    channel: "1688",
    riskLevel: "yellow",
    supplyCost: "3.0-6.0",
    marketHeat: 3,
    profitMargin: "40-50%",
    newbieMonthlyTarget: 300,
    supplyChainComplexity: "medium",
    description: "亲子装、汉服等小众品类有利基"
  },
  {
    id: 7,
    name: "户外用品",
    channel: "TEMU",
    riskLevel: "yellow",
    supplyCost: "2.0-4.0",
    marketHeat: 3,
    profitMargin: "25-35%",
    newbieMonthlyTarget: 1500,
    supplyChainComplexity: "medium",
    description: "季节性强，春夏销量高"
  },
  {
    id: 8,
    name: "厨房用品",
    channel: "TEMU",
    riskLevel: "yellow",
    supplyCost: "1.5-3.0",
    marketHeat: 3,
    profitMargin: "25-35%",
    newbieMonthlyTarget: 1800,
    supplyChainComplexity: "low",
    description: "日常刚需，复购率高"
  },
  {
    id: 9,
    name: "宠物用品",
    channel: "淘宝",
    riskLevel: "yellow",
    supplyCost: "2.0-4.0",
    marketHeat: 3,
    profitMargin: "35-45%",
    newbieMonthlyTarget: 250,
    supplyChainComplexity: "medium",
    description: "新兴品类，增长快"
  },
  {
    id: 10,
    name: "健身器材",
    channel: "1688",
    riskLevel: "yellow",
    supplyCost: "5.0-10.0",
    marketHeat: 2,
    profitMargin: "30-40%",
    newbieMonthlyTarget: 150,
    supplyChainComplexity: "high",
    description: "大件商品，库存压力大"
  },
  {
    id: 11,
    name: "手机壳",
    channel: "TEMU",
    riskLevel: "red",
    supplyCost: "0.5-1.0",
    marketHeat: 2,
    profitMargin: "20-30%",
    newbieMonthlyTarget: 3000,
    supplyChainComplexity: "low",
    description: "竞争激烈，需要大销量"
  },
  {
    id: 12,
    name: "充电线",
    channel: "TEMU",
    riskLevel: "red",
    supplyCost: "0.3-0.8",
    marketHeat: 2,
    profitMargin: "15-25%",
    newbieMonthlyTarget: 4000,
    supplyChainComplexity: "low",
    description: "成熟品类，价格竞争"
  },
  {
    id: 13,
    name: "工作服",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "4.0-8.0",
    marketHeat: 3,
    profitMargin: "35-45%",
    newbieMonthlyTarget: 200,
    supplyChainComplexity: "medium",
    description: "B2B 团购需求"
  },
  {
    id: 14,
    name: "小家电",
    channel: "TEMU",
    riskLevel: "yellow",
    supplyCost: "3.0-8.0",
    marketHeat: 2,
    profitMargin: "25-35%",
    newbieMonthlyTarget: 500,
    supplyChainComplexity: "medium",
    description: "需要供应商支持"
  },
  {
    id: 15,
    name: "美妆面膜",
    channel: "淘宝",
    riskLevel: "yellow",
    supplyCost: "1.5-3.0",
    marketHeat: 3,
    profitMargin: "40-50%",
    newbieMonthlyTarget: 400,
    supplyChainComplexity: "medium",
    description: "高频消耗品，复购驱动"
  },
  {
    id: 16,
    name: "节日装饰",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "2.0-4.0",
    marketHeat: 3,
    profitMargin: "45-55%",
    newbieMonthlyTarget: 300,
    supplyChainComplexity: "low",
    description: "季节性品类，提前备货"
  },
  {
    id: 17,
    name: "母婴用品",
    channel: "淘宝",
    riskLevel: "yellow",
    supplyCost: "3.0-6.0",
    marketHeat: 3,
    profitMargin: "35-45%",
    newbieMonthlyTarget: 200,
    supplyChainComplexity: "medium",
    description: "刚需高频，但竞争大"
  },
  {
    id: 18,
    name: "办公用品",
    channel: "1688",
    riskLevel: "green",
    supplyCost: "1.0-2.5",
    marketHeat: 3,
    profitMargin: "40-50%",
    newbieMonthlyTarget: 500,
    supplyChainComplexity: "low",
    description: "B2B 稳定需求"
  },
  {
    id: 19,
    name: "运动服饰",
    channel: "TEMU",
    riskLevel: "yellow",
    supplyCost: "3.0-5.0",
    marketHeat: 2,
    profitMargin: "25-35%",
    newbieMonthlyTarget: 800,
    supplyChainComplexity: "medium",
    description: "季节性、尺码多"
  },
  {
    id: 20,
    name: "日用洗护",
    channel: "TEMU",
    riskLevel: "yellow",
    supplyCost: "1.5-3.0",
    marketHeat: 3,
    profitMargin: "30-40%",
    newbieMonthlyTarget: 1200,
    supplyChainComplexity: "low",
    description: "刚需日用，高复购"
  }
];

// 行动清单数据
const actionChecklist = [
  {
    week: "第 1 周",
    title: "供应链准备",
    items: [
      "联系 1688 供应商，确认样品和采购价",
      "评估样品质量和包装",
      "确认最小起订量和交期"
    ]
  },
  {
    week: "第 2 周",
    title: "店铺准备",
    items: [
      "设计产品图和详情页",
      "撰写产品标题和卖点",
      "选择上架平台（1688/淘宝/TEMU）"
    ]
  },
  {
    week: "第 3 周",
    title: "上架和推广",
    items: [
      "上架产品到平台",
      "设置合理的价格和运费",
      "开始小额推广测试"
    ]
  },
  {
    week: "第 4-12 周",
    title: "持续优化",
    items: [
      "监测销量和转化率",
      "优化产品图、标题、描述",
      "调整定价和推广策略",
      "处理客服和售后"
    ]
  }
];

// 风险预警数据
const riskWarnings = {
  critical: [
    {
      title: "供应商风险",
      description: "样品质量不稳定、交期延误",
      prevention: "多家对比、签署协议、预付样品定金"
    },
    {
      title: "产品风险",
      description: "品质不符、不适应平台消费者",
      prevention: "反复测试、小批量试单、收集反馈"
    },
    {
      title: "推广风险",
      description: "推广费用高、ROI 低",
      prevention: "小额测试、精准投放、优化文案"
    }
  ],
  medium: [
    "竞争风险：价格战、利润被挤压",
    "售后风险：退货率高、物流问题",
    "资金风险：前期投入大、周转慢"
  ],
  low: [
    "平台风险：规则变化、账号风险",
    "市场风险：品类热度下降"
  ]
};

// API 端点

// 获取所有品类
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categoryLibrary,
    count: categoryLibrary.length
  });
});

// 获取品类详情
app.get('/api/categories/:id', (req, res) => {
  const category = categoryLibrary.find(c => c.id === parseInt(req.params.id));
  if (!category) {
    return res.status(404).json({ success: false, error: '品类不存在' });
  }
  res.json({ success: true, data: category });
});

// 按条件筛选品类
app.post('/api/categories/filter', (req, res) => {
  const { riskLevel, channel, industry } = req.body;
  let filtered = categoryLibrary;

  if (riskLevel) {
    filtered = filtered.filter(c => c.riskLevel === riskLevel);
  }
  if (channel) {
    filtered = filtered.filter(c => c.channel === channel);
  }

  res.json({ success: true, data: filtered });
});

// 财务预测计算
app.post('/api/financial-forecast', (req, res) => {
  const { categoryId, budget, scenario } = req.body;
  const category = categoryLibrary.find(c => c.id === parseInt(categoryId));

  if (!category) {
    return res.status(404).json({ success: false, error: '品类不存在' });
  }

  // 成本拆解
  const monthlyCosts = {
    supply: budget * 0.6,      // 采购 60%
    packaging: budget * 0.05,  // 包装 5%
    storage: budget * 0.05,    // 仓储 5%
    logistics: budget * 0.08,  // 物流 8%
    marketing: budget * 0.12,  // 推广 12%
    platform: budget * 0.05,   // 平台费 5%
    other: budget * 0.05       // 其他风险 5%
  };

  const totalMonthlyCost = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);

  // 销量预测（三个场景）
  const scenarios = {
    conservative: {
      months: [
        { month: 1, volume: Math.floor(category.newbieMonthlyTarget * 0.3), scenario: '保守' },
        { month: 2, volume: Math.floor(category.newbieMonthlyTarget * 0.5), scenario: '保守' },
        { month: 3, volume: Math.floor(category.newbieMonthlyTarget * 0.7), scenario: '保守' }
      ],
      confidence: '±25%'
    },
    normal: {
      months: [
        { month: 1, volume: Math.floor(category.newbieMonthlyTarget * 0.5), scenario: '正常' },
        { month: 2, volume: Math.floor(category.newbieMonthlyTarget * 0.75), scenario: '正常' },
        { month: 3, volume: Math.floor(category.newbieMonthlyTarget * 1.0), scenario: '正常' }
      ],
      confidence: '±15%'
    },
    aggressive: {
      months: [
        { month: 1, volume: Math.floor(category.newbieMonthlyTarget * 0.7), scenario: '激进' },
        { month: 2, volume: Math.floor(category.newbieMonthlyTarget * 1.0), scenario: '激进' },
        { month: 3, volume: Math.floor(category.newbieMonthlyTarget * 1.2), scenario: '激进' }
      ],
      confidence: '±30%'
    }
  };

  const selectedScenario = scenarios[scenario] || scenarios.normal;

  // 计算收入和利润
  const supplyPrice = parseFloat(category.supplyCost.split('-')[0]);
  const profitMargin = parseFloat(category.profitMargin.split('-')[0]) / 100;

  const forecast = selectedScenario.months.map(m => {
    const revenue = m.volume * (supplyPrice / (1 - profitMargin));
    const cost = m.volume * supplyPrice;
    const profit = revenue - cost - (totalMonthlyCost / 3);

    return {
      month: m.month,
      volume: m.volume,
      revenue: Math.round(revenue),
      cost: Math.round(cost),
      monthProfit: Math.round(profit),
      cumulativeProfit: Math.round(profit * m.month)
    };
  });

  res.json({
    success: true,
    data: {
      categoryName: category.name,
      budget: budget,
      scenario: scenario,
      costs: monthlyCosts,
      totalMonthlyCost: Math.round(totalMonthlyCost),
      forecast: forecast,
      confidence: selectedScenario.confidence,
      successProbability: category.riskLevel === 'green' ? '70-80%' : category.riskLevel === 'yellow' ? '40-60%' : '20-40%'
    }
  });
});

// 获取行动清单
app.get('/api/action-checklist', (req, res) => {
  res.json({ success: true, data: actionChecklist });
});

// 获取风险预警
app.get('/api/risk-warnings', (req, res) => {
  res.json({ success: true, data: riskWarnings });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: '服务器错误',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 诸葛选品 Backend 运行在 http://localhost:${PORT}`);
  console.log(`📊 API 文档: http://localhost:${PORT}/api`);
});
