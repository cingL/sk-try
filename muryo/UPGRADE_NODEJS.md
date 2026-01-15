# 升级 Node.js 到 20.x - Windows 指南

## 当前状态
- 当前版本: Node.js 18.18.0
- 目标版本: Node.js 20.x LTS（推荐）或 22.x

## 方法 1: 使用 nvm-windows（推荐）⭐

### 步骤 1: 安装 nvm-windows

1. **下载 nvm-windows**:
   - 访问: https://github.com/coreybutler/nvm-windows/releases
   - 下载最新版本的 `nvm-setup.exe`
   - 例如: `nvm-setup-v1.1.12.exe`

2. **安装 nvm-windows**:
   - 运行下载的 `nvm-setup.exe`
   - 按照安装向导完成安装
   - **重要**: 安装完成后**重启 PowerShell 或命令提示符**

3. **验证安装**:
   ```powershell
   nvm version
   ```
   应该显示版本号，例如: `1.1.12`

### 步骤 2: 安装 Node.js 20 LTS

```powershell
# 查看可用的 Node.js 版本
nvm list available

# 安装 Node.js 20 LTS（最新稳定版）
nvm install 20

# 或安装特定版本
nvm install 20.18.0

# 使用刚安装的版本
nvm use 20

# 验证版本
node --version
npm --version
```

### 步骤 3: 重新安装项目依赖

```powershell
cd muryo
rm -r -force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

### 步骤 4: 验证

```powershell
npm run dev
```

应该能正常启动，不再有版本错误。

---

## 方法 2: 直接下载安装（简单但无法管理多版本）

### 步骤 1: 下载 Node.js

1. 访问: https://nodejs.org/
2. 下载 **Node.js 20.x LTS** 版本（推荐）
3. 运行安装程序
4. 按照向导完成安装

### 步骤 2: 验证安装

打开**新的** PowerShell 窗口：

```powershell
node --version  # 应该显示 v20.x.x
npm --version
```

### 步骤 3: 重新安装项目依赖

```powershell
cd muryo
rm -r -force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev
```

---

## 方法 3: 使用 Chocolatey（如果已安装）

```powershell
# 升级 Node.js 到最新 LTS
choco upgrade nodejs-lts -y

# 验证
node --version
```

---

## 常见问题

### Q: 安装 nvm-windows 后，`nvm` 命令找不到？

**A**: 
1. 确保已重启 PowerShell/命令提示符
2. 检查环境变量 PATH 是否包含 nvm 路径
3. 尝试以管理员身份运行 PowerShell

### Q: 安装后还是显示旧版本？

**A**: 
1. 关闭所有 PowerShell/终端窗口
2. 重新打开新的窗口
3. 运行 `node --version` 验证

### Q: 如何在不同项目间切换 Node.js 版本？

**A**: 使用 nvm-windows:
```powershell
nvm list          # 查看已安装的版本
nvm use 18        # 切换到 Node.js 18
nvm use 20        # 切换到 Node.js 20
```

### Q: 安装后 npm 命令找不到？

**A**: 
1. 确保 Node.js 安装时选择了 "Add to PATH" 选项
2. 重新安装 Node.js，确保勾选所有选项

---

## 验证清单

完成升级后，检查：

- [ ] `node --version` 显示 v20.x.x 或更高
- [ ] `npm --version` 正常工作
- [ ] `npm run dev` 能正常启动，无版本错误
- [ ] 应用能正常访问 `http://localhost:3000`

---

## 推荐配置

安装完成后，建议设置默认版本：

```powershell
# 设置 Node.js 20 为默认版本
nvm alias default 20
```

这样每次打开新终端都会自动使用 Node.js 20。

---

## 下一步

升级完成后：

1. **重新安装依赖**:
   ```powershell
   cd muryo
   npm install
   ```

2. **启动开发服务器**:
   ```powershell
   npm run dev
   ```

3. **访问应用**:
   - 打开浏览器访问 `http://localhost:3000`
   - 应该能看到应用界面
