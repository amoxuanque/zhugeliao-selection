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
  const [error, setError] = useState(null);

  // 获取品类库
  const loadCategories = async () => {
    try {
      setError(null);
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
      if (!res.ok) throw new Error('获取品类失败');
      const data = await res.json();
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('获取品类失败:', err);
      setError('获取品类失败，请重试');
      setCategories([]);
    }
  };

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : Promise.reject('获取品类失败'))
      .then(data => setCategories(Array.isArray(data.data) ? data.data : []))
      .catch(err => {
        console.error('获取品类失败:', err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [step, channel, riskFilter]);

  // 处理预算输入
  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setBudget(isNaN(value) ? 10000 : Math.max(5000, Math.min(50000, value)));
  };

  // 选择品类
  const handleSelectCategory = (category) => {
    if (!category || !category.id) {
      setError('品类数据无效');
      return;
    }
    setSelectedCategory(category);
    setStep(3);
  };

  // 生成财务预测
  const generateForecast = async (categoryId) => {
    const cid = categoryId || selectedCategory?.id;
    if (!cid) {
      setError('请先选择品类');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/financial-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: cid, budget, scenario })
      });
      if (!res.ok) throw new Error('生成预测失败');
      const data = await res.json();
      if (data.success && data.data) {
        // 确保数据结构完整
        const validForecast = {
          categoryName: data.data.categoryName || '未知品类',
          budget: data.data.budget || budget,
          scenario: data.data.scenario || scenario,
          successProbability: data.data.successProbability || '50-60%',
          confidence: data.data.confidence || '±15%',
          totalMonthlyCost: data.data.totalMonthlyCost || 0,
          forecast: Array.isArray(data.data.forecast) ? data.data.forecast : [],
          costs: data.data.costs || {
            supply: 0,
            packaging: 0,
            storage: 0,
            logistics: 0,
            marketing: 0,
            platform: 0,
            other: 0
          }
        };
        setForecast(validForecast);
        setStep(4);
      } else {
        throw new Error(data.error || '生成预测失败');
      }
    } catch (err) {
      console.error('生成预测失败:', err);
      setError(err.message || '生成预测失败，请重试');
    }
    setLoading(false);
  };

  // 获取行动清单
  const handleStartPlan = async () => {
    if (!selectedCategory) {
      setError('请先选择品类');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/action-checklist');
      if (!res.ok) throw new Error('获取行动清单失败');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const normalized = data.data.map((w) => ({
          week: w.week || '未知周期',
          title: w.title || '未知标题',
          items: Array.isArray(w.items) ? w.items : (Array.isArray(w.tasks) ? w.tasks : [])
        }));
        setChecklist(normalized);
        setShowChecklist(true);
      } else {
        throw new Error('行动清单数据无效');
      }
    } catch (err) {
      console.error('获取行动清单失败:', err);
      setError(err.message || '获取行动清单失败，请重试');
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

      {/* Error Alert */}
      {error && (
        <div style={{ maxWidth: '1200px', margin: '16px auto', padding: '12px 16px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
          {error}
        </div>
      )}

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
                  fontSize: '16px',
                  boxSizing: 'border-box'
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
              {categories && categories.length > 0 ? (
                categories.map(cat => (
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
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{cat.name || '未知'}</h3>
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
                    <p style={{ margin: '8px 0', fontSize: '12px', color: '#6b7280' }}>{cat.description || '暂无描述'}</p>
                    <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                      <p style={{ margin: '4px 0' }}>💰 采购价: ¥{cat.supplyCost || 'N/A'}</p>
                      <p style={{ margin: '4px 0' }}>📊 毛利: {cat.profitMargin || 'N/A'}</p>
                      <p style={{ margin: '4px 0' }}>🛒 渠道: {cat.channel || 'N/A'}</p>
                      <p style={{ margin: '4px 0', color: '#10b981' }}>✅ 推荐依据：风险等级 + 渠道匹配 + 毛利区间</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#6b7280' }}>暂无符合条件的品类</p>
              )}
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
            <p style={{ color: '#6b7280' }}>已选择：{selectedCategory.name}（{selectedCategory.channel}）</p>

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{ padding: '12px', border: '1px solid #d1d5db', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                ← 返回重选品类
              </button>
              <button
                onClick={() => generateForecast(selectedCategory.id)}
                disabled={loading}
                style={{ padding: '12px', background: loading ? '#d1d5db' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {loading ? '⏳ 生成中...' : '生成 3 个月预测'}
              </button>
            </div>
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
                  {forecast.forecast && Array.isArray(forecast.forecast) && forecast.forecast.length > 0 ? (
                    forecast.forecast.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>第 {row.month} 月</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{row.volume}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>¥{row.revenue}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>¥{row.cost}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: row.monthProfit > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>¥{row.monthProfit}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: row.cumulativeProfit > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>¥{row.cumulativeProfit}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '12px', textAlign: 'center', color: '#6b7280' }}>暂无预测数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 成本拆解 */}
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0 }}>成本拆解</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '12px' }}>
                <div><strong>采购</strong>: ¥{Math.round(forecast.costs?.supply || 0)}</div>
                <div><strong>包装</strong>: ¥{Math.round(forecast.costs?.packaging || 0)}</div>
                <div><strong>仓储</strong>: ¥{Math.round(forecast.costs?.storage || 0)}</div>
                <div><strong>物流</strong>: ¥{Math.round(forecast.costs?.logistics || 0)}</div>
                <div><strong>推广</strong>: ¥{Math.round(forecast.costs?.marketing || 0)}</div>
                <div><strong>平台费</strong>: ¥{Math.round(forecast.costs?.platform || 0)}</div>
              </div>
            </div>

            {/* 行动按钮 */}
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

      {/* Checklist Modal */}
      {showChecklist && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ width: 'min(760px, 100%)', maxHeight: '85vh', overflow: 'auto', background: 'white', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>4 周行动清单（可执行版）</h3>
            <p style={{ color: '#6b7280', marginTop: 0 }}>建议逐周推进，并根据实际数据复盘。</p>
            {checklist && Array.isArray(checklist) && checklist.length > 0 ? (
              checklist.map((week) => (
                <div key={week.week} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                  <p style={{ margin: '0 0 6px 0', fontWeight: 700 }}>{week.week} · {week.title}</p>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151' }}>
                    {week.items && Array.isArray(week.items) && week.items.length > 0 ? (
                      week.items.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                      ))
                    ) : (
                      <li>暂无任务</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280' }}>暂无行动清单</p>
            )}
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
        <p>诸葛选品 v1.2 | 交互式筛选 + 分步预测 + 执行面板 | 修复 React 错误</p>
      </footer>
    </div>
  );
}
