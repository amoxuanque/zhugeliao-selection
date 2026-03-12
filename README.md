# 诸葛选品 - 小微卖家 3 个月回本计划生成器

## 产品概述

为月投入能力 1-2 万的小微电商卖家提供数据驱动的选品决策工具。

**渠道优先级**：1688（首选）> 淘宝 > TEMU

## 快速开始

### 后端启动

```bash
npm install
npm start
```

后端将运行在 `http://localhost:3000`

### API 端点

- `GET /api/categories` - 获取所有品类
- `GET /api/categories/:id` - 获取品类详情
- `POST /api/financial-forecast` - 生成财务预测
- `GET /api/action-checklist` - 获取行动清单
- `GET /api/risk-warnings` - 获取风险预警

## 部署到 Zeabur

1. 连接 GitHub 仓库
2. Zeabur 会自动检测 `zeabur.json` 配置
3. 自动部署 Node.js 应用

## 数据说明

所有分析均来自于亚马逊、淘宝、TEMU、1688 等真实数据搜索后，并基于最新 Claude 模型进行分析总结产出。

## 功能清单

- ✅ 预算配置计算
- ✅ 20 个高潜力品类推荐
- ✅ 三个预测场景（保守/正常/激进）
- ✅ 完整成本拆解
- ✅ 风险拐点预警
- ✅ 行动清单指导
- ✅ 风险预警提示

## 开发者

xue168861
