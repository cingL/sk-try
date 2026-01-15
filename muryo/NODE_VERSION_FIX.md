# Node.js 版本问题解决方案

## 问题
~~当前 Node.js 版本: `18.18.0`~~  
✅ **已升级到 Node.js v20.20.0**  
Vite 7.x 要求: `20.19+` 或 `22.12+` ✅ 已满足要求

## 解决方案

### 方案 1: 升级 Node.js（推荐）⭐

#### 使用 nvm (Node Version Manager) - Windows

1. **安装 nvm-windows**:
   - 下载: https://github.com/coreybutler/nvm-windows/releases
   - 安装 `nvm-setup.exe`

2. **如果遇到 "Node v18.18.0 is already installed" 反复提示问题**:
   
   这是 nvm-windows 无法接管现有 Node.js 安装的常见问题。解决方法：
   
   **方法 A: 卸载现有 Node.js（推荐）**
   ```powershell
   # 1. 通过控制面板卸载 Node.js
   # 控制面板 -> 程序和功能 -> 卸载 Node.js
   
   # 2. 手动删除 Node.js 目录（如果存在）
   # 通常位于: C:\Program Files\nodejs
   # 或: C:\Program Files (x86)\nodejs
   
   # 3. 清理环境变量
   # 系统属性 -> 高级 -> 环境变量
   # 从 PATH 中删除所有 nodejs 相关路径
   
   # 4. 重启电脑（重要！）
   
   # 5. 重新运行 nvm-setup.exe 安装
   ```
   
   **方法 B: 手动配置 NVM 接管**
   ```powershell
   # 1. 以管理员身份打开 PowerShell
   
   # 2. 卸载现有 Node.js（通过控制面板或命令行）
   # 或直接删除目录: C:\Program Files\nodejs
   
   # 3. 检查 NVM 安装路径（通常是）
   # C:\Users\<用户名>\AppData\Roaming\nvm
   
   # 4. 手动将 Node.js 18.18.0 移动到 NVM 目录
   # 如果 Node.js 安装在 C:\Program Files\nodejs
   # 复制到: C:\Users\<用户名>\AppData\Roaming\nvm\v18.18.0
   
   # 5. 在 NVM 目录创建符号链接或直接使用
   nvm use 18.18.0
   ```

3. **安装 Node.js 20 LTS**:
   ```bash
   nvm install 20
   nvm use 20
   ```

4. **设置 PATH 和自动切换（重要！）**:
   
   NVM 会自动管理 PATH，但为了确保每次打开新终端时都使用 Node.js 20，可以设置 PowerShell 自动切换：
   
   ```powershell
   # 检查 PowerShell Profile 是否存在
   Test-Path $PROFILE
   
   # 如果不存在，创建它
   New-Item -Path $PROFILE -Type File -Force
   
   # 添加自动切换命令（每次打开 PowerShell 时自动使用 Node.js 20）
   Add-Content -Path $PROFILE -Value "nvm use 20.20.0"
   
   # 或者手动编辑配置文件
   # 位置: C:\Users\<用户名>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
   # 添加一行: nvm use 20.20.0
   ```
   
   **验证 PATH 设置**:
   ```powershell
   # 检查 Node.js 是否在 PATH 中
   where.exe node
   # 应该显示类似: I:\nvm4w\nodejs\node.exe
   
   # 检查环境变量
   $env:PATH -split ';' | Select-String -Pattern 'node|nvm'
   # 应该包含 nvm 和 nodejs 路径
   ```

5. **验证版本**:
   ```bash
   node --version  # 应该显示 v20.x.x
   npm --version   # 应该显示 npm 版本
   ```

6. **重新安装依赖**:
   ```bash
   cd muryo
   rm -rf node_modules package-lock.json
   npm install
   ```

#### 使用 nvm (Node Version Manager) - Mac/Linux

```bash
# 安装 nvm (如果还没有)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node.js 20
nvm install 20
nvm use 20

# 验证
node --version

# 重新安装依赖
cd muryo
rm -rf node_modules package-lock.json
npm install
```

#### 直接下载安装

- 访问 https://nodejs.org/
- 下载 Node.js 20 LTS 版本
- 安装后重启终端
- 验证: `node --version`

---

### 方案 2: 降级 Vite（如果无法升级 Node.js）

如果暂时无法升级 Node.js，可以降级到 Vite 5.x（支持 Node.js 18+）

#### 步骤

1. **修改 package.json**:
   ```json
   {
     "devDependencies": {
       "vite": "^5.4.0",  // 从 ^7.2.4 改为 ^5.4.0
       "@vitejs/plugin-react": "^4.3.0"  // 从 ^5.1.1 改为 ^4.3.0
     }
   }
   ```

2. **删除并重新安装依赖**:
   ```bash
   cd muryo
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **验证**:
   ```bash
   npm run dev
   ```

---

## 推荐方案

**强烈推荐方案 1（升级 Node.js）**，因为：
- ✅ 使用最新的稳定版本
- ✅ 更好的性能和安全性
- ✅ 兼容所有最新工具和库
- ✅ 长期维护支持

---

## 验证安装

无论选择哪个方案，完成后运行：

```bash
node --version  # 应该显示 v20.x.x 或更高
npm run dev     # 应该能正常启动
```
