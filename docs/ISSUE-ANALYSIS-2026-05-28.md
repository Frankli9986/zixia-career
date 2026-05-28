# ISSUE-ANALYSIS-2026-05-28

> 项目：zixia-career（自洽职场模拟器）  
> 分析日期：2026-05-28  
> 状态：待修复

---

## P0 必须处理（阻断问题）

### Issue #1：Onboarding → Simulator 数据传不过去

**严重程度**：🔴 Blocker  
**影响**：用户做完 Onboarding，进模拟器是空的，需重新填画像

**根因**：
- `onboarding.html` 用 `localStorage.setItem('zq-profile', ...)` 存画像
- `simulator.html` 用 `localStorage.getItem('ws_userProfile')` 读画像
- Key 不一致：`zq-profile` vs `ws_userProfile`

**现状**：simulator 没有读取 `zq-profile` 的代码，进入时无法恢复画像

**Spec**：
```
1. onboarding.html 第465行：
   localStorage.setItem('zq-profile', JSON.stringify(profile));
   改为 → localStorage.setItem('ws_userProfile', JSON.stringify(profile));

2. simulator.html 需要在 init 时（initSliders 之前）加入：
   const savedProfile = loadFromStorage(STORAGE_KEYS.userProfile);
   if (savedProfile) { restoreProfile(savedProfile); }

3. restoreProfile(profile) 函数：
   - 恢复 8 维参数滑块值
   - 恢复内心委员会 8 个 chip 的选中状态
   - 更新 UI 显示用户名字（如果有）

验收：
-做完 Onboarding，进模拟器，滑块值/名字/委员会状态完全一致
```

---

### Issue #2：DeepSeek API 完全未接入

**严重程度**：🔴 Blocker  
**影响**：简历上传后 AI 解析不工作，核心卖点报废

**根因**：`onboarding.html` 第148行注释「模拟 DeepSeek 返回」，8个参数全是写死的 mock 数据

**现状**：
- 第293行：`// 生成模拟解析结果（随机化一点点）`
- 没有实际调用任何 API

**Spec**：
```
1. 接入 DeepSeek API（推荐）或快速替换方案

方案A（推荐）：快速问卷替代（2-3h，完全离线）
- 移除简历上传功能
- 改为 8 道选择题（每题对应一个维度）
- 答完直接生成 profile，进模拟器

方案B：接 DeepSeek API（4h+，需要网络）
- 使用 fetch 调用 DeepSeek Chat API
- 传入简历文本，解析 8 维参数
- 需要处理 API Key 配置、错误处理

验收（方案A）：
- 用户答完 8 题，立即看到 8 维雷达图
- 点击进入模拟器，数据正确传递
- 无网络依赖，可离线演示
```

---

### Issue #3：Vercel 部署地址缺失

**严重程度**：🟡 Major（但属于低工作量）  
**影响**：README 和文档里没实际可访问地址

**Spec**：
```
1. 部署到 Vercel（onboarding.html + simulator.html + styles.css）
2. 更新 README.md 底部填入实际 URL
3. 两个 HTML 文件内的跳转地址统一更新

验收：
- 访问 https://xxx.vercel.app/onboarding.html 可正常运行
- simulator.html 内嵌在 onboarding.html 内可正常跳转
```

---

## P1 影响体验

### Issue #4：事件整合状态未确认

**严重程度**：🟡 Major  
**现状**：代码里事件命名是 `after_week_3` / `after_week_6`，不是 E1/E2/E3 编号体系

**Spec**：
```
1. 确认 SCENARIOS 事件数量（目前看到 2 个：after_week_3 / after_week_6）
2. 确认是否需要 E1-E3 的完整事件链
3. 如果需要，补全事件内容

验收：
- 从第1周走到第12周，每3周有一个分支选择
- 选择后影响最终结局
```

---

### Issue #5：内心委员会 8 个 chip 联动逻辑缺失

**严重程度**：🟡 Major  
**现状**：`initProfileChips()` 存在但未验证与滑块的联动

**Spec**：
```
1. 验证 8 个 chip 与 8 维参数的对应关系
2. 验证选中 chip 后是否影响参数值
3. 验证参数变化后 chip 的展示状态

验收：
- 拖动滑块，chip 数量/类型相应变化
- 选中 chip，进模拟器后能看到对应效果
```

---

## P2 低优先级

| # | 问题 | Spec | 工作量 |
|---|------|------|--------|
| 6 | 错误处理边界 | 简历上传失败 / 格式不支持 / localStorage 满 的降级提示 | 1h |
| 7 | Demo 演示脚本 | 5分钟路演节奏控制（引导语 + 点击顺序） | 1h |

---

## 执行顺序（建议）

```
Phase 1（1-2h，可独立完成）：
  → Issue #1：修复 localStorage key 对齐（tester 验收）
  → Issue #3：Vercel 部署 + README 更新

Phase 2（2-3h，可离线演示）：
  → Issue #2 方案A：8题问卷替代 DeepSeek API

Phase 3（按需）：
  → Issue #4：事件整合确认
  → Issue #5：chip 联动逻辑
  → Issue #6-7：错误处理 + Demo 脚本
```

---

## 修复后验收清单

- [ ] Onboarding 做完，进模拟器滑块值完全一致
- [ ] 8题问卷答完，雷达图正确显示
- [ ] Vercel URL 可访问，页面功能正常
- [ ] 无 JS 报错（Console 0 errors）
- [ ] 移动端布局正常（iPhone 12 viewport 测试）
