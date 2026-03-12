# 部署指南

## 步骤 1: 创建 GitHub 仓库

由于 token 权限限制，需要手动创建仓库。请按以下步骤操作：

1. 访问 https://github.com/new
2. 输入仓库名: `zhugeliao-selection`
3. 选择 Public
4. 点击 "Create repository"

## 步骤 2: 推送代码到 GitHub

执行以下命令：

```bash
cd /tmp/zhugeliao-selection

# 验证 remote
git remote -v

# 推送代码
git push -u origin main
```

## 步骤 3: 部署到 Zeabur

1. 访问 https://zeabur.com
2. 用账号 xue168861 登录
3. 选择 "Create Project"
4. 选择 "Deploy from GitHub"
5. 选择 `zhugeliao-selection` 仓库
6. Zeabur 会自动检测配置并部署

## 预期上线时间

- 代码推送: 5 分钟
- Zeabur 部署: 3-5 分钟
- 总计: 10 分钟

## 测试应用

部署完成后，访问 Zeabur 提供的域名即可。
