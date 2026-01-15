# 如何生成 PWA 图标

## 问题
PWA manifest 需要 PNG 格式的图标文件，但目前只有 SVG 文件。

## 解决方案

### 方法 1：使用在线工具（推荐）

1. 访问 https://realfavicongenerator.net/ 或 https://www.pwabuilder.com/imageGenerator
2. 上传 `icon.svg` 文件
3. 生成所有尺寸的 PNG 图标
4. 下载并放置到 `public/icons/` 目录

### 方法 2：使用 ImageMagick（命令行）

如果你安装了 ImageMagick，可以运行：

```bash
# 从 SVG 生成各个尺寸的 PNG
magick icon.svg -resize 72x72 icon-72x72.png
magick icon.svg -resize 96x96 icon-96x96.png
magick icon.svg -resize 128x128 icon-128x128.png
magick icon.svg -resize 144x144 icon-144x144.png
magick icon.svg -resize 152x152 icon-152x152.png
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 384x384 icon-384x384.png
magick icon.svg -resize 512x512 icon-512x512.png
```

### 方法 3：使用 Node.js 脚本

可以创建一个 Node.js 脚本来批量生成图标。

## 临时解决方案

在生成 PNG 图标之前，可以暂时使用 SVG 图标。但某些浏览器可能不支持 SVG 格式的 PWA 图标。

## 需要的图标尺寸

- 72x72.png
- 96x96.png
- 128x128.png
- 144x144.png
- 152x152.png
- 192x192.png
- 384x384.png
- 512x512.png
