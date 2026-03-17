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

// ---------------- P1: 数据底座 / Search / RPA / 评论分析 / 参数化模拟 ----------------

const platformProducts = [
  { id: 'tb-1001', platform: '淘宝', categoryId: 4, title: '免打孔家居收纳盒大容量', price: 29.9, estMonthlySales: 1800, rating: 4.7, shopLevel: '金牌', updatedAt: '2026-03-15' },
  { id: 'tb-1002', platform: '淘宝', categoryId: 9, title: '宠物自动喂食器智能定时', price: 119, estMonthlySales: 620, rating: 4.6, shopLevel: '钻石', updatedAt: '2026-03-15' },
  { id: 'tm-2001', platform: 'TEMU', categoryId: 8, title: '多功能厨房切菜神器', price: 12.8, estMonthlySales: 5300, rating: 4.5, shopLevel: 'A', updatedAt: '2026-03-14' },
  { id: 'tm-2002', platform: 'TEMU', categoryId: 20, title: '日用洗护旅行装套装', price: 9.9, estMonthlySales: 4900, rating: 4.4, shopLevel: 'A', updatedAt: '2026-03-14' },
  { id: '1688-3001', platform: '1688', categoryId: 1, title: '劳保鞋防砸防刺穿工作鞋', price: 38, estMonthlySales: 1100, rating: 4.8, shopLevel: '实力商家', updatedAt: '2026-03-16' },
  { id: '1688-3002', platform: '1688', categoryId: 13, title: '工作服夏季透气工装套装', price: 46, estMonthlySales: 860, rating: 4.6, shopLevel: '实力商家', updatedAt: '2026-03-16' }
];

const productReviews = [
  { productId: 'tb-1001', rating: 5, content: '收纳空间大，安装方便，物流也快', date: '2026-03-10' },
  { productId: 'tb-1001', rating: 2, content: '塑料有味道，边缘有毛刺，客服回复慢', date: '2026-03-11' },
  { productId: 'tb-1002', rating: 3, content: '功能可以，但偶尔卡粮，售后处理一般', date: '2026-03-12' },
  { productId: 'tm-2001', rating: 4, content: '切菜很快，材质不错，清洗方便', date: '2026-03-12' },
  { productId: 'tm-2001', rating: 2, content: '刀片不耐用，物流包装差，收到有划痕', date: '2026-03-13' },
  { productId: '1688-3001', rating: 5, content: '质量稳定，尺码标准，复购率高', date: '2026-03-13' },
  { productId: '1688-3001', rating: 3, content: '发货稍慢，价格还能再谈', date: '2026-03-14' }
];

const dataSnapshots = {
  platform_products: {
    total: platformProducts.length,
    sourceCount: 3,
    updatedAt: '2026-03-16T10:00:00Z',
    freshnessHours: 24
  },
  product_reviews: {
    total: productReviews.length,
    sourceCount: 3,
    updatedAt: '2026-03-16T10:00:00Z',
    freshnessHours: 24
  }
};

const rpaTasks = [];

const sentimentLexicon = {
  positive: ['质量', '稳定', '方便', '快', '复购', '不错'],
  negative: ['卡', '慢', '差', '毛刺', '划痕', '味道', '不耐用']
};

const reviewThemes = {
  quality: ['质量', '材质', '毛刺', '划痕', '不耐用'],
  logistics: ['物流', '发货', '包装'],
  service: ['客服', '售后'],
  feature: ['功能', '安装', '清洗', '卡粮']
};

const scenarioMultipliers = {
  conservative: [0.3, 0.5, 0.7],
  normal: [0.5, 0.75, 1],
  aggressive: [0.7, 1, 1.2]
};


const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';
const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';

async function fetchTavilySearch({ query, topic = 'general', maxResults = 8, searchDepth = 'advanced' }) {
  if (!TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY 未配置');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(TAVILY_SEARCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        topic,
        search_depth: searchDepth,
        max_results: maxResults,
        include_answer: false,
        include_images: false,
        include_raw_content: false
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Tavily 请求失败: ${response.status} ${msg}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeTavilyResults(payload, platformHint, categoryHint) {
  const now = new Date().toISOString();
  return (payload.results || []).map((r, idx) => ({
    id: `tavily-${idx}-${Date.now()}`,
    platform: platformHint || 'web',
    categoryId: Number(categoryHint) || null,
    categoryName: categoryHint ? (categoryLibrary.find(c => c.id === Number(categoryHint))?.name || '未知品类') : '未知品类',
    title: r.title || '未命名结果',
    snippet: r.content || '',
    sourceUrl: r.url || '',
    sourceDomain: (() => {
      try {
        return r.url ? new URL(r.url).hostname : '';
      } catch {
        return '';
      }
    })(),
    updatedAt: now,
    estMonthlySales: 1000,
    rating: 4.5,
    shopLevel: 'N/A',
    confidenceScore: Number((r.score ?? 0.5).toFixed(2))
  }));
}

function calcScenarioForecast(category, budget, scenario = 'normal', overrides = {}) {
  const baseCostRates = {
    supply: 0.6,
    packaging: 0.05,
    storage: 0.05,
    logistics: 0.08,
    marketing: 0.12,
    platform: 0.05,
    other: 0.05
  };

  const monthlyCosts = Object.fromEntries(
    Object.entries(baseCostRates).map(([k, v]) => [k, budget * (overrides.costRates?.[k] ?? v)])
  );
  const totalMonthlyCost = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);

  const multipliers = scenarioMultipliers[scenario] || scenarioMultipliers.normal;
  const supplyFloor = parseFloat(category.supplyCost.split('-')[0]);
  const marginFloor = parseFloat(category.profitMargin.split('-')[0]) / 100;
  const priceMultiplier = overrides.priceMultiplier ?? 1;
  const cvrMultiplier = overrides.cvrMultiplier ?? 1;

  let cumulative = 0;
  const forecast = multipliers.map((m, idx) => {
    const month = idx + 1;
    const volume = Math.floor(category.newbieMonthlyTarget * m * cvrMultiplier);
    const revenue = volume * ((supplyFloor * priceMultiplier) / (1 - marginFloor));
    const variableCost = volume * supplyFloor;
    const monthProfit = revenue - variableCost - (totalMonthlyCost / 3);
    cumulative += monthProfit;

    return {
      month,
      volume,
      revenue: Math.round(revenue),
      cost: Math.round(variableCost),
      monthProfit: Math.round(monthProfit),
      cumulativeProfit: Math.round(cumulative)
    };
  });

  return {
    monthlyCosts,
    totalMonthlyCost: Math.round(totalMonthlyCost),
    forecast
  };
}

function analyzeReviewTexts(reviews) {
  const themeCounter = Object.fromEntries(Object.keys(reviewThemes).map((k) => [k, 0]));
  let positive = 0;
  let negative = 0;

  reviews.forEach((r) => {
    const text = r.content || '';
    sentimentLexicon.positive.forEach((w) => {
      if (text.includes(w)) positive += 1;
    });
    sentimentLexicon.negative.forEach((w) => {
      if (text.includes(w)) negative += 1;
    });

    Object.entries(reviewThemes).forEach(([theme, words]) => {
      if (words.some((w) => text.includes(w))) {
        themeCounter[theme] += 1;
      }
    });
  });

  const totalSignals = positive + negative || 1;
  const sentiment = {
    positiveScore: Number((positive / totalSignals).toFixed(2)),
    negativeScore: Number((negative / totalSignals).toFixed(2))
  };

  const topThemes = Object.entries(themeCounter)
    .sort((a, b) => b[1] - a[1])
    .map(([theme, count]) => ({ theme, count }));

  return { sentiment, topThemes, samples: reviews.slice(0, 5) };
}

function rerankSearchResults(items, query = '') {
  const q = query.trim();
  return items
    .map((item) => {
      const category = categoryLibrary.find((c) => c.id === item.categoryId);
      const keywordScore = q && item.title.includes(q) ? 2 : 0;
      const salesScore = Math.min(item.estMonthlySales / 1000, 6);
      const ratingScore = item.rating;
      const marginScore = category ? parseFloat(category.profitMargin.split('-')[0]) / 10 : 0;
      const competitionPenalty = category?.riskLevel === 'red' ? -1 : 0;

      const rerankScore = Number((keywordScore + salesScore + ratingScore + marginScore + competitionPenalty).toFixed(2));
      return { ...item, rerankScore, categoryName: category?.name || '未知品类' };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore);
}

function enqueueRpaTask(task) {
  if (!rpaTasks.some((t) => t.id === task.id)) {
    rpaTasks.push(task);
  }
  setTimeout(async () => {
    task.status = 'running';
    task.attempts += 1;

    try {
      const isFail = task.target.includes('fail') && task.attempts < task.maxRetries;
      if (isFail) {
        task.status = 'retrying';
        task.error = '触发平台频控，已进入重试队列';
        enqueueRpaTask(task);
        return;
      }

      if (task.provider === 'tavily') {
        const payload = await fetchTavilySearch({ query: `${task.platform} ${task.target}`, maxResults: 5 });
        const normalized = normalizeTavilyResults(payload, task.platform, task.categoryId);
        task.result = {
          captured: normalized.length,
          platform: task.platform,
          target: task.target,
          sources: normalized.map((r) => r.sourceUrl).filter(Boolean)
        };
      } else {
        task.result = {
          captured: Math.floor(100 + Math.random() * 200),
          platform: task.platform,
          target: task.target
        };
      }

      task.status = 'completed';
      task.error = null;
      task.finishedAt = new Date().toISOString();
    } catch (error) {
      if (task.attempts < task.maxRetries) {
        task.status = 'retrying';
        task.error = error.message;
        enqueueRpaTask(task);
      } else {
        task.status = 'failed';
        task.error = error.message;
        task.finishedAt = new Date().toISOString();
      }
    }
  }, 300);
}

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

// 数据底座概览
app.get('/api/data/snapshots', (req, res) => {
  res.json({
    success: true,
    data: dataSnapshots,
    schema: ['platform_products', 'product_reviews'],
    description: 'P1 数据底座：原始商品与评论快照概览'
  });
});


app.get('/api/data/quality', (req, res) => {
  const now = Date.now();
  const freshnessMs = now - new Date(dataSnapshots.platform_products.updatedAt).getTime();
  const freshnessHours = Number((freshnessMs / 36e5).toFixed(2));

  res.json({
    success: true,
    data: {
      freshnessHours,
      sourceCoverage: dataSnapshots.platform_products.sourceCount,
      records: {
        products: platformProducts.length,
        reviews: productReviews.length
      },
      realtimeSearchEnabled: Boolean(TAVILY_API_KEY),
      guardrails: [
        '返回 sourceUrl/sourceDomain/fetchedAt',
        '重排因子可解释',
        'provider 区分 mock 与 tavily'
      ]
    }
  });
});

// Search + 重排（支持 mock / tavily）
app.post('/api/search/rerank', async (req, res) => {
  const { query = '', platform, categoryId, limit = 10, provider = 'mock' } = req.body || {};

  try {
    let candidates = platformProducts;

    if (provider === 'tavily') {
      const payload = await fetchTavilySearch({
        query: [query, platform, categoryId ? `category:${categoryId}` : ''].filter(Boolean).join(' '),
        maxResults: Number(limit)
      });
      candidates = normalizeTavilyResults(payload, platform, categoryId);
    } else {
      if (platform) {
        candidates = candidates.filter((p) => p.platform === platform);
      }
      if (categoryId) {
        candidates = candidates.filter((p) => p.categoryId === Number(categoryId));
      }
    }

    const ranked = rerankSearchResults(candidates, query).slice(0, Number(limit));
    res.json({
      success: true,
      provider,
      query,
      count: ranked.length,
      data: ranked,
      factors: ['keywordScore', 'salesScore', 'ratingScore', 'marginScore', 'competitionPenalty'],
      freshness: {
        fetchedAt: new Date().toISOString(),
        realtime: provider === 'tavily',
        hasTavilyKey: Boolean(TAVILY_API_KEY)
      }
    });
  } catch (error) {
    res.status(502).json({ success: false, error: '实时搜索失败', message: error.message });
  }
});

// Tavily 实时搜索（原始结果）
app.post('/api/search/live', async (req, res) => {
  const { query = '', platform, categoryId, maxResults = 8, topic = 'general', searchDepth = 'advanced' } = req.body || {};
  if (!query) {
    return res.status(400).json({ success: false, error: 'query 不能为空' });
  }

  try {
    const payload = await fetchTavilySearch({
      query: [query, platform, categoryId ? `category:${categoryId}` : ''].filter(Boolean).join(' '),
      topic,
      maxResults: Number(maxResults),
      searchDepth
    });

    const normalized = normalizeTavilyResults(payload, platform, categoryId);
    res.json({
      success: true,
      provider: 'tavily',
      query,
      count: normalized.length,
      fetchedAt: new Date().toISOString(),
      data: normalized,
      raw: {
        hasAnswer: Boolean(payload.answer),
        responseTime: payload.response_time || null
      }
    });
  } catch (error) {
    res.status(502).json({ success: false, error: 'Tavily 实时搜索失败', message: error.message });
  }
});

// 评论主题分析
app.post('/api/reviews/analyze', (req, res) => {
  const { productId, categoryId, platform } = req.body || {};

  let scopedProducts = platformProducts;
  if (platform) scopedProducts = scopedProducts.filter((p) => p.platform === platform);
  if (categoryId) scopedProducts = scopedProducts.filter((p) => p.categoryId === Number(categoryId));
  if (productId) scopedProducts = scopedProducts.filter((p) => p.id === productId);

  const productIds = new Set(scopedProducts.map((p) => p.id));
  const reviews = productReviews.filter((r) => productIds.has(r.productId));

  const analysis = analyzeReviewTexts(reviews);
  res.json({
    success: true,
    scope: { productId, categoryId, platform },
    reviewCount: reviews.length,
    data: analysis
  });
});

// RPA 编排：创建任务
app.post('/api/rpa/tasks', (req, res) => {
  const { platform = '淘宝', target = '榜单抓取', maxRetries = 2, provider = 'mock', categoryId = null } = req.body || {};
  if (provider === 'tavily' && !TAVILY_API_KEY) {
    return res.status(400).json({ success: false, error: '缺少 TAVILY_API_KEY，无法执行 tavily provider 任务' });
  }

  const task = {
    id: `task_${Date.now()}`,
    platform,
    target,
    provider,
    categoryId,
    status: 'queued',
    attempts: 0,
    maxRetries,
    createdAt: new Date().toISOString(),
    finishedAt: null,
    error: null,
    result: null
  };
  enqueueRpaTask(task);
  res.status(202).json({ success: true, data: task });
});

// RPA 编排：任务列表
app.get('/api/rpa/tasks', (req, res) => {
  const sorted = [...rpaTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: sorted.length, data: sorted.slice(0, 50) });
});

// RPA 编排：单任务查询
app.get('/api/rpa/tasks/:id', (req, res) => {
  const task = rpaTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' });
  }
  res.json({ success: true, data: task });
});

// 财务预测计算
app.post('/api/financial-forecast', (req, res) => {
  const { categoryId, budget, scenario } = req.body;
  const category = categoryLibrary.find(c => c.id === parseInt(categoryId));

  if (!category) {
    return res.status(404).json({ success: false, error: '品类不存在' });
  }

  const simulation = calcScenarioForecast(category, Number(budget), scenario);
  const confidenceMap = {
    conservative: '±25%',
    normal: '±15%',
    aggressive: '±30%'
  };

  res.json({
    success: true,
    data: {
      categoryName: category.name,
      budget: budget,
      scenario: scenario,
      costs: simulation.monthlyCosts,
      totalMonthlyCost: simulation.totalMonthlyCost,
      forecast: simulation.forecast,
      confidence: confidenceMap[scenario] || confidenceMap.normal,
      successProbability: category.riskLevel === 'green' ? '70-80%' : category.riskLevel === 'yellow' ? '40-60%' : '20-40%'
    }
  });
});

// 参数化财务模拟（P10/P50/P90）
app.post('/api/forecast/simulate', (req, res) => {
  const {
    categoryId,
    budget,
    scenario = 'normal',
    assumptions = {}
  } = req.body || {};

  const category = categoryLibrary.find((c) => c.id === Number(categoryId));
  if (!category) {
    return res.status(404).json({ success: false, error: '品类不存在' });
  }
  if (!budget || Number(budget) <= 0) {
    return res.status(400).json({ success: false, error: '预算必须大于 0' });
  }

  const p10 = calcScenarioForecast(category, Number(budget), scenario, {
    priceMultiplier: assumptions.priceMultiplierP10 ?? 0.92,
    cvrMultiplier: assumptions.cvrMultiplierP10 ?? 0.85,
    costRates: assumptions.costRatesP10
  });
  const p50 = calcScenarioForecast(category, Number(budget), scenario, {
    priceMultiplier: assumptions.priceMultiplierP50 ?? 1,
    cvrMultiplier: assumptions.cvrMultiplierP50 ?? 1,
    costRates: assumptions.costRatesP50
  });
  const p90 = calcScenarioForecast(category, Number(budget), scenario, {
    priceMultiplier: assumptions.priceMultiplierP90 ?? 1.08,
    cvrMultiplier: assumptions.cvrMultiplierP90 ?? 1.15,
    costRates: assumptions.costRatesP90
  });

  res.json({
    success: true,
    data: {
      categoryId: category.id,
      categoryName: category.name,
      budget: Number(budget),
      scenario,
      assumptionsApplied: {
        p10: { priceMultiplier: assumptions.priceMultiplierP10 ?? 0.92, cvrMultiplier: assumptions.cvrMultiplierP10 ?? 0.85 },
        p50: { priceMultiplier: assumptions.priceMultiplierP50 ?? 1, cvrMultiplier: assumptions.cvrMultiplierP50 ?? 1 },
        p90: { priceMultiplier: assumptions.priceMultiplierP90 ?? 1.08, cvrMultiplier: assumptions.cvrMultiplierP90 ?? 1.15 }
      },
      distributions: { p10, p50, p90 }
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
