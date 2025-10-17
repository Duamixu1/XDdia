# OKX NFT 项目 API 接口文档

## 概述

这是一个基于 Express.js 的 NFT 项目后端 API 服务，提供种子管理、图片上传、签名验证和白名单验证等功能。

**基础信息：**
- 服务端口：5301（正式环境）
- 数据库：MySQL
- 支持域名：`https://okart.fun`, `https://diamond.okart.fun`, `https://diamond-t.okart.fun`, `https://xdcheck.okart.fun`

---

## 1. 图片相关接口

### 1.1 上传 Base64 图片
**接口地址：** `POST /api/upload/image64`

**功能描述：** 上传 Base64 格式的图片并关联到收藏品

**请求参数：**
```json
{
  "hseed": "string",        // 种子标识（必需）
  "base64Image": "string",  // Base64 图片数据（必需）
  "address": "string",      // 钱包地址（必需）
  "collectId": "string"     // 收藏品ID（必需）
}
```

**响应示例：**
```json
{
  "code": 0,
  "msg": "base64图片上传成功并更新到收藏品信息",
  "data": {
    "id": 123,
    "hseed": "abc123",
    "collect_id": "collection1",
    "address": "0x123...",
    "image_type": "image/png"
  }
}
```

### 1.2 更新图片
**接口地址：** `POST /api/upload/updateimage`

**功能描述：** 更新已存在的图片数据

**请求参数：**
```json
{
  "hseed": "string",        // 种子标识（必需）
  "base64Image": "string"   // Base64 图片数据（必需）
}
```

**响应示例：**
```json
{
  "code": 0,
  "msg": "图片更新成功",
  "data": {
    "hseed": "abc123",
    "image_type": "image/png",
    "affected_rows": 1
  }
}
```

### 1.3 获取静态图片
**接口地址：** `GET /api/static/:collectId/`

**功能描述：** 根据收藏品ID和种子获取图片

**请求参数：**
- URL 参数：`collectId` - 收藏品ID
- Query 参数：`hseed` - 种子标识

**响应：** 直接返回 PNG 图片二进制数据

---

## 2. 种子管理接口

### 2.1 申请新种子
**接口地址：** `GET /api/seed/request`

**功能描述：** 为指定地址生成唯一的种子标识

**请求参数：**
- Query 参数：`address` - 钱包地址（必需）

**响应示例：**
```json
{
  "hSeed": "abc123def456",
  "success": true,
  "message": "OK"
}
```

### 2.2 标记种子为已使用（铸造）
**接口地址：** `POST /api/seed/use`

**功能描述：** 标记种子为已使用状态，并记录交易哈希

**请求参数：**
```json
{
  "hSeed": "string",    // 种子标识（必需）
  "address": "string",  // 钱包地址（必需）
  "txhash": "string"    // 交易哈希（必需）
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "Seed marked as used"
}
```

### 2.3 标记种子为已使用（预交易）
**接口地址：** `POST /api/seed/usepretx`

**功能描述：** 在交易前标记种子为已使用状态

**请求参数：**
```json
{
  "hSeed": "string",    // 种子标识（必需）
  "address": "string",  // 钱包地址（必需）
  "txhash": "string"    // 交易哈希（必需）
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "Seed marked as used"
}
```

### 2.4 获取已使用种子列表
**接口地址：** `GET /api/seed/getseeds`

**功能描述：** 分页获取已使用的种子列表

**请求参数：**
- Query 参数：
  - `startIndex` - 起始索引（默认：0）
  - `count` - 返回数量（默认：10，最大：100）

**响应示例：**
```json
{
  "success": true,
  "hSeeds": ["seed1", "seed2", "seed3"],
  "count": 3,
  "startIndex": 0,
  "totalCount": 10
}
```

---

## 3. 签名验证接口

### 3.1 生成挑战码
**接口地址：** `POST /api/signature/challenge`

**功能描述：** 生成用于签名的挑战码，包含频率限制

**请求参数：**
```json
{
  "address": "string"  // 钱包地址（必需）
}
```

**频率限制：**
- IP 地址：每天最多 500 次
- 钱包地址：每天最多 20 次

**响应示例：**
```json
{
  "challenge": "0x1234567890abcdef..."
}
```

### 3.2 生成签名（带挑战码验证）
**接口地址：** `POST /api/signature/generate`

**功能描述：** 验证挑战码后生成签名数据

**请求参数：**
```json
{
  "hSeed": "string",        // 种子标识（必需）
  "address": "string",      // 钱包地址（必需）
  "chainId": "number",      // 链ID（必需）
  "challenge": "string"     // 挑战码（必需）
}
```

**响应示例：**
```json
{
  "hSeed": "abc123",
  "signature": "0x1234567890abcdef..."
}
```

### 3.3 生成签名（无挑战码验证）
**接口地址：** `POST /api/signature/generate-no-challenge`

**功能描述：** 直接生成签名数据，无需挑战码验证

**请求参数：**
```json
{
  "hSeed": "string",        // 种子标识（必需）
  "address": "string",      // 钱包地址（必需）
  "chainId": "number"       // 链ID（必需）
}
```

**响应示例：**
```json
{
  "hSeed": "abc123",
  "signature": "0x1234567890abcdef..."
}
```

---

## 4. 白名单验证接口

### 4.1 检查地址是否在白名单中
**接口地址：** `POST /api/signature/is-white-address`

**功能描述：** 检查地址是否在白名单中且未被使用过

**请求参数：**
```json
{
  "address": "string"  // 钱包地址（必需）
}
```

**响应示例：**
```json
{
  "address": "0x123...",
  "isWhitelisted": true
}
```

### 4.2 检查地址是否在白名单中（XDCheck）
**接口地址：** `POST /api/signature/is-white-address-xdcheck`

**功能描述：** 仅检查地址是否在白名单中，不检查使用状态

**请求参数：**
```json
{
  "address": "string"  // 钱包地址（必需）
}
```

**响应示例：**
```json
{
  "address": "0x123...",
  "isWhitelisted": true
}
```

---

## 5. 测试接口

### 5.1 测试接口
**接口地址：** `GET /api/test`

**功能描述：** 服务健康检查

**响应示例：**
```json
{
  "code": 0,
  "msg": "ok"
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源未找到 |
| 429 | 频率限制 |
| 500 | 服务器内部错误 |

---

## 数据库表结构

### collection_images（收藏品图片表）
- `id` - 主键
- `hseed` - 种子标识
- `collect_id` - 收藏品ID
- `image_base64` - Base64图片数据
- `address` - 钱包地址
- `update_time` - 更新时间

### seed_order（种子订单表）
- `id` - 主键
- `address` - 钱包地址
- `hSeed` - 种子标识
- `created_at` - 创建时间
- `updated_at` - 更新时间

### seed_used（已使用种子表）
- `id` - 主键
- `address` - 钱包地址
- `hSeed` - 种子标识
- `txhash` - 交易哈希
- `state` - 状态（1=已使用，2=已处理图片）
- `image_id` - 图片ID
- `update_at` - 更新时间
- `created_at` - 创建时间

### seed_used_pretx（预交易种子表）
- 结构与 seed_used 类似，用于预交易场景

### whitelist_usage（白名单使用记录表）
- `id` - 主键
- `wallet_address` - 钱包地址
- `created_at` - 创建时间

### challenge_codes（挑战码表）
- `id` - 主键
- `challenge_code` - 挑战码
- `wallet_address` - 钱包地址
- `ip_address` - IP地址
- `is_used` - 是否已使用
- `expires_at` - 过期时间
- `created_at` - 创建时间

---

## 安全说明

1. **CORS 配置**：仅允许指定域名访问
2. **频率限制**：IP和钱包地址都有请求频率限制
3. **挑战码机制**：防止重放攻击
4. **白名单验证**：确保只有授权地址可以参与铸造
5. **签名验证**：使用服务器私钥进行消息签名

---

**文档版本：** v1.0  
**最后更新：** 2025-01-15