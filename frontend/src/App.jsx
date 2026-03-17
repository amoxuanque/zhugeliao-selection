import React, { useState, useEffect } from 'react';

export default function App() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(15000);
  const [channel, setChannel] = useState('1688');
  const [riskFilter, setRiskFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scenario, setScenario] = useState('normal');
  const [forecast, setForecast] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      if (step !== 2) {
        return;
      }
      const shouldFilter = riskFilter !== 'all' || channel !== '多渠道';
      const endpoint = shouldFilter ? '/api/categories/filter' : '/api/categories';
      const options = shouldFilter
        ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              riskLevel: riskFilter === 'all' ? undefined : riskFilter,
              channel: channel === '多渠道' ? undefined : channel
            })
          }
        : { method: 'GET' };

      const res = await fetch(endpoint, options);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('获取品类失败:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [step, channel, riskFilter]);

  const handleBudgetChange = (e) => {
    setBudget(parseInt(e.target.value, 10) || 10000);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setStep(3);
  };

  const generateForecast = async () => {
    if (!selectedCategory) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/financial-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedCategory.id, budget, scenario })
      });
      const data = await res.json();
      if (data.success) {
        setForecast(data.data);
        setStep(4);
      }
    } catch (err) {
      console.error('生成预测失败:', err);
    }
    setLoading(false);
  };

  const handleStartPlan = async () => {
    if (!selectedCategory) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/action-checklist');
      const data = await res.json();
      if (data.success) {
        const normalized = (data.data || []).map((w) => ({
          ...w,
          items: w.items || w.tasks || []
        }));
        setChecklist(normalized);
        setShowChecklist(true);
      }
    } catch (err) {
      console.error('获取行动清单失败:', err);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, -apple-system' }}>
      <header style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>诸葛选品</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>小微卖家 3 个月回本计划生成器</p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
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
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
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
              style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              下一步：选择品类
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 2: 交互筛选品类</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>基于渠道和风险偏好动态筛选候选品类，再进入场景预测</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { key: 'all', label: '全部风险' },
                { key: 'green', label: '🟢 低风险' },
                { key: 'yellow', label: '🟡 中风险' },
                { key: 'red', label: '🔴 高风险' }
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRiskFilter(r.key)}
                  style={{
                    padding: '10px',
                    border: riskFilter === r.key ? '2px solid #10b981' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: riskFilter === r.key ? '#d1fae5' : 'white',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '13px' }}>当前候选：{categories.length} 个</p>

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
                    <p style={{ margin: '4px 0', color: '#10b981' }}>✅ 推荐依据：风险等级 + 渠道匹配 + 毛利区间</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{ marginTop: '24px', padding: '12px 24px', border: '1px solid #d1d5db', background: 'white', borderRadius: '8px', cursor: 'pointer' }}
            >
              ← 返回
            </button>
          </div>
        )}

        {step === 3 && selectedCategory && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 3: 选择预测场景</h2>
            <p style={{ color: '#6b7280' }}>已选择：{selectedCategory.name}（{selectedCategory.channel}）</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {['conservative', 'normal', 'aggressive'].map(sc => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{ padding: '12px', border: '1px solid #d1d5db', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                ← 返回重选品类
              </button>
              <button
                onClick={generateForecast}
                disabled={loading}
                style={{ padding: '12px', background: loading ? '#d1d5db' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {loading ? '⏳ 生成中...' : '生成 3 个月预测'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && forecast && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>步骤 4: 3 个月财务预测</h2>
            <p style={{ color: '#6b7280' }}>品类: {forecast.categoryName} | 预算: ¥{forecast.budget} | 场景: {forecast.scenario}</p>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => {
                  setForecast(null);
                  setStep(2);
                }}
                style={{ padding: '12px', border: '1px solid #d1d5db', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                ← 选择其他品类
              </button>
              <button
                onClick={handleStartPlan}
                disabled={loading}
                style={{ padding: '12px', background: loading ? '#d1d5db' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {loading ? '⏳ 生成中...' : '✓ 打开执行计划面板'}
              </button>
            </div>
          </div>
        )}
      </main>

      {showChecklist && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ width: 'min(760px, 100%)', maxHeight: '85vh', overflow: 'auto', background: 'white', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>4 周行动清单（可执行版）</h3>
            <p style={{ color: '#6b7280', marginTop: 0 }}>建议逐周推进，并根据实际数据复盘。</p>
            {checklist.map((week) => (
              <div key={week.week} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 700 }}>{week.week} · {week.title}</p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151' }}>
                  {week.items.map((item) => (
                    <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => setShowChecklist(false)}
              style={{ marginTop: '8px', width: '100%', padding: '10px', border: 'none', borderRadius: '8px', background: '#111827', color: 'white', fontWeight: 600, cursor: 'pointer' }}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <footer style={{ background: '#f3f4f6', padding: '24px', marginTop: '48px', borderTop: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'center', fontSize: '12px' }}>
        <p>诸葛选品 v1.1 | 交互式筛选 + 分步预测 + 执行面板</p>
      </footer>
    </div>
  );
}
