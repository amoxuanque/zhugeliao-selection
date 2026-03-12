import React, { useState, useEffect } from 'react';

export default function App() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(15000);
  const [channel, setChannel] = useState('1688');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scenario, setScenario] = useState('normal');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取品类库
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error('获取品类失败:', err));
  }, []);

  // 处理预算输入
  const handleBudgetChange = (e) => {
    setBudget(parseInt(e.target.value) || 10000);
  };

  // 选择品类
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    generateForecast(category.id);
  };

  // 生成财务预测
  const generateForecast = async (categoryId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/financial-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, budget, scenario })
      });
      const data = await res.json();
      if (data.success) {
        setForecast(data.data);
        setStep(4);
      }
    } catch (err) {
      console.error('生成预测失败:', err);
      alert('生成预测失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, -apple-system' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>诸葛选品</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>小微卖家 3 个月回本计划生成器</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Step 1: 预算配置 */}
        {step === 1 && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 1: 配置预算</h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>月预算（人民币）</label>
              <input
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                min="5000"
                max="50000"
                step="1000"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0' }}>建议 1-2 万元</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>销售渠道</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['1688', '淘宝', 'TEMU', '多渠道'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    style={{
                      padding: '12px',
                      border: channel === ch ? '2px solid #10b981' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: channel === ch ? '#d1fae5' : 'white',
                      cursor: 'pointer',
                      fontWeight: channel === ch ? '600' : '500',
                      color: channel === ch ? '#065f46' : '#374151'
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              下一步：选择品类
            </button>
          </div>
        )}

        {/* Step 2: 品类推荐 */}
        {step === 2 && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 2: 选择品类</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>我们为你推荐了 20 个高潜力品类，按风险等级分类</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  style={{
                    padding: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedCategory?.id === cat.id ? '#d1fae5' : 'white'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{cat.name}</h3>
                    <span style={{
                      padding: '4px 8px',
                      background: cat.riskLevel === 'green' ? '#d1fae5' : cat.riskLevel === 'yellow' ? '#fef3c7' : '#fee2e2',
                      color: cat.riskLevel === 'green' ? '#065f46' : cat.riskLevel === 'yellow' ? '#92400e' : '#991b1b',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {cat.riskLevel === 'green' ? '🟢 绿' : cat.riskLevel === 'yellow' ? '🟡 黄' : '🔴 红'}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#6b7280' }}>{cat.description}</p>
                  <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                    <p style={{ margin: '4px 0' }}>💰 采购价: ¥{cat.supplyCost}</p>
                    <p style={{ margin: '4px 0' }}>📊 毛利: {cat.profitMargin}</p>
                    <p style={{ margin: '4px 0' }}>🛒 渠道: {cat.channel}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                background: 'white',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← 返回
            </button>
          </div>
        )}

        {/* Step 3: 预测场景选择 */}
        {step === 3 && selectedCategory && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 3: 选择预测场景</h2>
            <p style={{ color: '#6b7280' }}>为了给你最真实的预测，我们提供三个场景</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {['conservative', 'normal', 'aggressive'].map(sc => (
                <button
                  key={sc}
                  onClick={() => {
                    setScenario(sc);
                    generateForecast(selectedCategory.id);
                  }}
                  style={{
                    padding: '16px',
                    border: scenario === sc ? '2px solid #10b981' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: scenario === sc ? '#d1fae5' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {sc === 'conservative' ? '📉 保守' : sc === 'normal' ? '📊 正常' : '📈 激进'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {sc === 'conservative' ? '30%-50%-70%' : sc === 'normal' ? '50%-75%-100%' : '70%-100%-120%'}
                  </div>
                </button>
              ))}
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>生成预测中...</p>}
          </div>
        )}

        {/* Step 4: 财务预测结果 */}
        {step === 4 && forecast && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 4: 3 个月财务预测</h2>
            <p style={{ color: '#6b7280' }}>品类: {forecast.categoryName} | 预算: ¥{forecast.budget} | 场景: {forecast.scenario}</p>

            {/* 关键指标卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#065f46' }}>成功概率</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#047857' }}>{forecast.successProbability}</p>
              </div>
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#92400e' }}>置信区间</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#b45309' }}>{forecast.confidence}</p>
              </div>
              <div style={{ padding: '16px', background: '#dbeafe', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#0c4a6e' }}>月均成本</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>¥{forecast.totalMonthlyCost}</p>
              </div>
            </div>

            {/* 预测表格 */}
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>月份</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>销量(件)</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>销售额</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>成本</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>月利润</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>累计利润</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.forecast.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>第 {row.month} 月</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{row.volume}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>¥{row.revenue}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>¥{row.cost}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.monthProfit > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>¥{row.monthProfit}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: row.cumulativeProfit > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>¥{row.cumulativeProfit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 成本拆解 */}
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0 }}>成本拆解</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '12px' }}>
                <div><strong>采购</strong>: ¥{Math.round(forecast.costs.supply)}</div>
                <div><strong>包装</strong>: ¥{Math.round(forecast.costs.packaging)}</div>
                <div><strong>仓储</strong>: ¥{Math.round(forecast.costs.storage)}</div>
                <div><strong>物流</strong>: ¥{Math.round(forecast.costs.logistics)}</div>
                <div><strong>推广</strong>: ¥{Math.round(forecast.costs.marketing)}</div>
                <div><strong>平台费</strong>: ¥{Math.round(forecast.costs.platform)}</div>
              </div>
            </div>

            {/* 行动按钮 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => { setStep(2); setSelectedCategory(null); }}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ← 选择其他品类
              </button>
              <button
                style={{
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ✓ 开始执行计划
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#f3f4f6', padding: '24px', marginTop: '48px', borderTop: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'center', fontSize: '12px' }}>
        <p>诸葛选品 v1.0 | 所有分析基于亚马逊、淘宝、TEMU、1688 等真实数据</p>
      </footer>
    </div>
  );
}
