# 开宝箱活动 — 前端对接文档

> 所有接口均需在 Header 中携带登录 Token。  
> 响应统一格式：`{ "code": 0, "msg": "success", "data": ... }`，code 非 0 时 msg 为错误提示，直接弹窗展示即可。

---

## 一、业务流程说明

### 全服宝箱流程

```
进入活动页
    │
    ▼
调用【获取全服宝箱信息】
    │
    ├─ 无进行中宝箱 → 展示"暂无活动"
    │
    └─ 有进行中宝箱 → 展示宝箱详情（奖品、进度、参与列表）
            │
            ▼
        用户选择装扮 + 数量，点击"参与"
            │
            ▼
        调用【参与全服宝箱】
            │
            ├─ 失败 → 弹窗提示错误信息
            │
            └─ 成功 → 刷新宝箱信息
                        │
                        └─ 若 status=2（已开启）→ 展示中奖结果弹窗
```

---

### 战队宝箱流程

```
进入战队宝箱页
    │
    ▼
调用【获取战队资格信息】
    │
    ├─ hasTeam = false（未开通战队）
    │       │
    │       ▼
    │   展示"开通战队"按钮
    │       │
    │       ├─ 点击前先调用【获取开通战队坐骑配置】展示坐骑名称和价格
    │       │
    │       └─ 确认购买 → 调用【开通战队】
    │               │
    │               ├─ 失败 → 弹窗提示
    │               └─ 成功 → 刷新战队资格信息，展示"发起战队宝箱"按钮
    │
    └─ hasTeam = true（已有战队）
            │
            ▼
        展示战队信息 + "发起战队宝箱"按钮 + "修改战队名称"入口
            │
            ├─ 点击"发起战队宝箱"
            │       │
            │       ▼
            │   用户选择一二三等奖奖品及金额配置
            │       │
            │       ▼
            │   调用【发起战队宝箱】
            │       │
            │       ├─ 失败 → 弹窗提示
            │       └─ 成功 → 跳转到战队宝箱详情页
            │
            ├─ 进入战队宝箱详情页
            │       │
            │       ▼
            │   调用【获取战队宝箱信息】（传 teamId）
            │       │
            │       └─ 展示宝箱进度、参与列表、奖品信息
            │               │
            │               ▼
            │           其他用户点击"参与"
            │               │
            │               ▼
            │           调用【参与战队宝箱】
            │               │
            │               ├─ 失败 → 弹窗提示
            │               └─ 成功 → 刷新宝箱信息
            │                           └─ status=2 → 展示中奖结果
            │
            └─ 点击"历史宝箱记录"
                    │
                    ▼
                调用【战队历史宝箱记录】
                    │
                    └─ 展示历史列表（发起时间、奖品、状态、中奖人）
```

---

### 我的参与记录流程

```
进入"我的记录"页
    │
    ▼
调用【用户参与记录】（分页）
    │
    └─ 展示列表：装扮名称、购买数量、购买时间、中奖状态
```

---

## 二、接口列表

### 公共说明

- Base URL：`/chest` 或 `/treasureBox`（两个路径等价）
- 请求方式：全部为 `POST`
- Content-Type：`application/json`（有 Body 的接口），无 Body 的接口可不传
- 分页参数通过 Query String 传递

---

## 2.1 全服宝箱

### 获取全服宝箱信息

`POST /chest/global/info`

无需请求参数。

**响应 data：**

| 字段 | 类型 | 说明 |
|------|------|------|
| chestActivityId | Long | 宝箱活动ID |
| chestId | String | 第三方宝箱ID |
| type | Integer | 宝箱类型：1-全服，2-战队 |
| status | Integer | 状态：1-进行中，2-已开启，3-已取消 |
| totalPrizeAmount | BigDecimal | 奖品总金额（元） |
| singleParticipationAmount | BigDecimal | 单次参与金额（元） |
| totalOpenTimes | Integer | 开箱所需总次数 |
| currentParticipationCount | Integer | 当前已参与次数 |
| firstPrizeItemId | Long | 一等奖奖品ID |
| firstPrizeQuantity | Integer | 一等奖数量 |
| secondPrizeItemId | Long | 二等奖奖品ID |
| secondPrizeQuantity | Integer | 二等奖数量 |
| thirdPrizeItemId | Long | 三等奖奖品ID |
| thirdPrizeQuantity | Integer | 三等奖数量 |
| result | Object | 中奖结果，status=2 时有值，见下方 result 说明 |
| participants | Array | 参与者列表，见下方 participants 说明 |

**result 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| chestId | String | 宝箱ID |
| firstPrizeUserId | String | 一等奖得主用户ID |
| secondPrizeUserId | String | 二等奖得主用户ID |
| thirdPrizeUserId | String | 三等奖得主用户ID |

**participants 数组元素：**

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | Long | 用户ID |
| userName | String | 用户昵称 |
| unitPrice | BigDecimal | 单价（元） |
| quantity | Integer | 购买数量 |
| purchaseTime | String | 购买时间，格式 yyyy-MM-dd HH:mm:ss |

**响应示例：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "chestActivityId": 1001,
    "chestId": "CHEST_20250319_001",
    "type": 1,
    "status": 1,
    "totalPrizeAmount": 5000.00,
    "singleParticipationAmount": 100.00,
    "totalOpenTimes": 50,
    "currentParticipationCount": 12,
    "firstPrizeItemId": 1,
    "firstPrizeQuantity": 1,
    "secondPrizeItemId": 2,
    "secondPrizeQuantity": 1,
    "thirdPrizeItemId": 3,
    "thirdPrizeQuantity": 1,
    "result": null,
    "participants": [
      {
        "userId": 10001,
        "userName": "用户A",
        "unitPrice": 100.00,
        "quantity": 1,
        "purchaseTime": "2025-03-19 10:00:00"
      }
    ]
  }
}
```

---

### 参与全服宝箱

`POST /chest/global/join`

**请求 Body（JSON）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dressUpItemId | Long | 是 | 购买的装扮道具ID（需为该宝箱允许的装扮） |
| quantity | Integer | 是 | 购买数量 |

**请求示例：**
```json
{
  "dressUpItemId": 10086,
  "quantity": 1
}
```

**响应 data：** null（成功即可）

> 失败时 code 非 0，msg 直接弹窗展示。

---

## 2.2 战队管理

### 获取战队资格信息

`POST /chest/team/info`

无需请求参数。

**响应 data：**

| 字段 | 类型 | 说明 |
|------|------|------|
| hasTeam | Boolean | 是否已有战队：true-已开通，false-未开通 |
| teamId | Long | 战队ID（hasTeam=true 时有值） |
| teamName | String | 战队名称（hasTeam=true 时有值） |
| ownerUserId | Long | 战队长用户ID（hasTeam=true 时有值） |

**响应示例：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "hasTeam": true,
    "teamId": 2001,
    "teamName": "张三战队",
    "ownerUserId": 10001
  }
}
```

---

### 获取开通战队所需坐骑配置

`POST /chest/team/mountConfig`

无需请求参数。用于开通战队前展示需要购买的坐骑信息和价格。

**响应 data：**

| 字段 | 类型 | 说明 |
|------|------|------|
| mountItemId | Long | 坐骑装扮ID |
| mountName | String | 坐骑名称 |
| mountUrl | String | 坐骑图片URL |
| price | Long | 价格（GGD，单位：元） |

**响应示例：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "mountItemId": 20001,
    "mountName": "战龙坐骑",
    "mountUrl": "https://cdn.example.com/mount/dragon.png",
    "price": 888
  }
}
```

---

### 开通战队

`POST /chest/team/create`

无需请求参数。后端自动扣费购买坐骑，战队名称默认为"用户昵称+战队"。

**响应 data：**

| 字段 | 类型 | 说明 |
|------|------|------|
| hasTeam | Boolean | 固定为 true |
| teamId | Long | 新建战队ID |
| teamName | String | 战队名称 |
| ownerUserId | Long | 战队长用户ID |

---

### 修改战队名称

`POST /chest/team/rename`

**请求 Body（JSON）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| teamName | String | 是 | 新战队名称，1-20个字符 |

**请求示例：**
```json
{
  "teamName": "无敌战队"
}
```

**响应 data：** null（成功即可）

---

## 2.3 战队宝箱

### 发起战队宝箱

`POST /chest/team/init`

需要已开通战队（hasTeam=true），否则返回错误。

**请求 Body（JSON）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| firstPrizeItemId | Long | 是 | 一等奖奖品ID |
| firstPrizeQuantity | Integer | 是 | 一等奖数量 |
| secondPrizeItemId | Long | 是 | 二等奖奖品ID |
| secondPrizeQuantity | Integer | 是 | 二等奖数量 |
| thirdPrizeItemId | Long | 是 | 三等奖奖品ID |
| thirdPrizeQuantity | Integer | 是 | 三等奖数量 |
| totalPrizeAmount | BigDecimal | 是 | 宝箱奖品总金额（元） |
| singleParticipationAmount | BigDecimal | 是 | 单次参与金额（元） |

**请求示例：**
```json
{
  "firstPrizeItemId": 1,
  "firstPrizeQuantity": 1,
  "secondPrizeItemId": 2,
  "secondPrizeQuantity": 1,
  "thirdPrizeItemId": 3,
  "thirdPrizeQuantity": 2,
  "totalPrizeAmount": 3000.00,
  "singleParticipationAmount": 100.00
}
```

**响应 data：** 宝箱活动对象（同获取宝箱信息的 data 结构）

---

### 获取战队宝箱信息

`POST /chest/team/info`

> 注意：此接口与"获取战队资格信息"路径不同，通过 Query 参数区分。

`POST /chest/team/detail?teamId=2001`

**Query 参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| teamId | String | 是 | 战队ID |

**响应 data：** 同全服宝箱信息结构，额外包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| teamId | String | 战队ID |
| initiatorUserId | Long | 发起人用户ID |

---

### 参与战队宝箱

`POST /chest/team/join`

**请求 Body（JSON）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| teamId | String | 是 | 战队ID |
| dressUpItemId | Long | 是 | 购买的装扮道具ID（需为该宝箱允许的装扮） |
| quantity | Integer | 是 | 购买数量 |

**请求示例：**
```json
{
  "teamId": "2001",
  "dressUpItemId": 10086,
  "quantity": 1
}
```

**响应 data：** null（成功即可）

---

### 战队历史宝箱记录

`POST /chest/team/history`

无需请求参数。仅战队拥有者可查看，返回该战队所有历史宝箱记录。

**响应 data：** Array，每条记录字段如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| chestActivityId | Long | 宝箱活动ID |
| createTime | String | 发起时间，格式 yyyy-MM-dd HH:mm:ss |
| status | Integer | 状态：1-进行中，2-已开启，3-已取消 |
| statusDesc | String | 状态描述："进行中" / "已开启" / "已取消" |
| currentParticipationCount | Integer | 当前参与次数 |
| totalOpenTimes | Integer | 开箱所需总次数 |
| firstPrizeItemId | Long | 一等奖奖品ID |
| firstPrizeName | String | 一等奖奖品名称 |
| firstPrizeValue | BigDecimal | 一等奖奖品价值（元） |
| firstPrizeQuantity | Integer | 一等奖数量 |
| secondPrizeItemId | Long | 二等奖奖品ID |
| secondPrizeName | String | 二等奖奖品名称 |
| secondPrizeValue | BigDecimal | 二等奖奖品价值（元） |
| secondPrizeQuantity | Integer | 二等奖数量 |
| thirdPrizeItemId | Long | 三等奖奖品ID |
| thirdPrizeName | String | 三等奖奖品名称 |
| thirdPrizeValue | BigDecimal | 三等奖奖品价值（元） |
| thirdPrizeQuantity | Integer | 三等奖数量 |
| firstPrizeUserId | String | 一等奖得主用户ID（status=2 时有值） |
| secondPrizeUserId | String | 二等奖得主用户ID（status=2 时有值） |
| thirdPrizeUserId | String | 三等奖得主用户ID（status=2 时有值） |

**响应示例：**
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "chestActivityId": 3001,
      "createTime": "2025-03-10 20:00:00",
      "status": 2,
      "statusDesc": "已开启",
      "currentParticipationCount": 30,
      "totalOpenTimes": 30,
      "firstPrizeItemId": 1,
      "firstPrizeName": "iPhone 17 Pro",
      "firstPrizeValue": 9999.00,
      "firstPrizeQuantity": 1,
      "secondPrizeItemId": 2,
      "secondPrizeName": "AirPods Pro",
      "secondPrizeValue": 1999.00,
      "secondPrizeQuantity": 1,
      "thirdPrizeItemId": 3,
      "thirdPrizeName": "京东购物卡",
      "thirdPrizeValue": 500.00,
      "thirdPrizeQuantity": 2,
      "firstPrizeUserId": "10001",
      "secondPrizeUserId": "10002",
      "thirdPrizeUserId": "10003"
    }
  ]
}
```

---

## 2.4 我的参与记录

### 用户参与记录（分页）

`POST /chest/record/list?page=1&size=20`

**Query 参数：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | Integer | 否 | 1 | 页码，从1开始 |
| size | Integer | 否 | 20 | 每页条数 |

**响应 data：**

| 字段 | 类型 | 说明 |
|------|------|------|
| total | Long | 总条数 |
| page | Integer | 当前页码 |
| size | Integer | 每页条数 |
| list | Array | 记录列表，见下方字段说明 |

**list 数组元素：**

| 字段 | 类型 | 说明 |
|------|------|------|
| chestType | Integer | 宝箱类型：1-全服宝箱，2-战队宝箱 |
| dressUpName | String | 购买的装扮名称 |
| quantity | Integer | 购买数量 |
| purchaseTime | String | 购买时间，格式 yyyy-MM-dd HH:mm:ss |
| prizeStatus | Integer | 中奖状态：0-未开奖，1-一等奖，2-二等奖，3-三等奖，-1-未中奖 |
| prizeDesc | String | 中奖描述："开奖中" / "一等奖" / "二等奖" / "三等奖" / "未中奖" |

**响应示例：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "total": 5,
    "page": 1,
    "size": 20,
    "list": [
      {
        "chestType": 1,
        "dressUpName": "星辰战甲",
        "quantity": 2,
        "purchaseTime": "2025-03-19 10:30:00",
        "prizeStatus": 1,
        "prizeDesc": "一等奖"
      },
      {
        "chestType": 2,
        "dressUpName": "龙纹披风",
        "quantity": 1,
        "purchaseTime": "2025-03-18 15:00:00",
        "prizeStatus": -1,
        "prizeDesc": "未中奖"
      }
    ]
  }
}
```

---

## 三、接口汇总

| 功能 | 接口地址 | 说明 |
|------|----------|------|
| 获取全服宝箱信息 | POST /chest/global/info | 展示宝箱详情和参与列表 |
| 参与全服宝箱 | POST /chest/global/join | 扣费+发放装扮+记录参与 |
| 获取战队资格信息 | POST /chest/team/info | 判断展示"开通战队"还是"发起宝箱" |
| 获取开通战队坐骑配置 | POST /chest/team/mountConfig | 展示坐骑名称、图片、价格 |
| 开通战队 | POST /chest/team/create | 购买坐骑+建立战队 |
| 修改战队名称 | POST /chest/team/rename | 战队长修改名称 |
| 发起战队宝箱 | POST /chest/team/init | 战队长发起宝箱，选择奖品 |
| 获取战队宝箱信息 | POST /chest/team/detail?teamId= | 展示战队宝箱详情 |
| 参与战队宝箱 | POST /chest/team/join | 扣费+发放装扮+记录参与 |
| 战队历史宝箱记录 | POST /chest/team/history | 战队长查看历史宝箱 |
| 用户参与记录 | POST /chest/record/list | 分页查询我的参与记录 |

---

## 四、状态码说明

| 宝箱状态 status | 说明 |
|----------------|------|
| 1 | 进行中 |
| 2 | 已开启（已结算，result 字段有中奖结果） |
| 3 | 已取消 |

| 中奖状态 prizeStatus | 说明 |
|---------------------|------|
| 0 | 未开奖（宝箱还在进行中） |
| 1 | 一等奖 |
| 2 | 二等奖 |
| 3 | 三等奖 |
| -1 | 未中奖 |
