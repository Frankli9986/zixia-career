# TODO-2026-05-28-TODOS

> 来源：产品评审报告 PRODUCT-EVALUATION-2026-05-28.md  
> 目标：所有 P0 + P1 问题可执行 spec  
> 状态：待认领

---

## 🔴 P0（阻断，必须修）

### P0-TODO-1：修复 `restoreProfile()` 空壳问题

**问题**：`simulator.html` 的 `restoreProfile()` 是空壳，Onboarding 过来的画像无法正确恢复

**Spec**：
```
1. 确认 simulator.html 的 PARAMS 用 `p.id`（'o'/'c'/'l'/'p'/'f'/'g'/'i'/'w'）
2. 确认 onboarding.html 的 profile.values 用 `p.key`（'overwork'/'care'/'leadership'等）
3. restoreProfile(profile) 内做双向映射：
   - 优先用 KEY_MAP（onboarding key → simulator id）转换
   - 转换后存 state.params[id] = value
4. 验收：本地清除 localStorage → 做完 onboarding → 进 simulator → 8个滑块值完全一致
```

**文件**：simulator.html  
**DoD**：
- [ ] 滑块值与 onboarding 最后调整的值一致（误差0）
- [ ] localStorage 的 ws_userProfile 能被正确读取和渲染

---

### P0-TODO-2：8题问卷替代 DeepSeek mock

**问题**：DeepSeek API 未接入，`simulateParsing()` 是假数据

**Spec**：
```
1. 移除 onboarding.html 的 page-upload（简历上传）+ page-parsing（加载动画）
2. 新增 page-quiz 页面：
   - 8道题，每题对应1个维度
   - 每题3个选项：A/B/C（对应 低值3 / 中值5 / 高值8）
3. 问卷数据结构：
   ```js
   {
     q: '你更倾向于哪种工作节奏？',
     opts: [
       { text: '准时下班，工作生活平衡', val: 2 },  // low
       { text: '适度加班，可以接受', val: 5 },       // mid
       { text: '愿意为事业全力以赴', val: 9 }        // high
     ]
   }
   ```
4. 答完8题 → 生成 profile.values → 跳转过渡页显示雷达图
5. 无网络依赖，可离线演示
```

**文件**：onboarding.html  
**DoD**：
- [ ] 问卷页面可正常显示和作答
- [ ] 8题全部完成后正确跳转
- [ ] 雷达图正确显示8维数据
- [ ] 无网络请求，所有逻辑前端完成

---

### P0-TODO-3：统一 PARAMS 定义（key vs id）

**问题**：onboarding 用 `key='overwork'`，simulator 用 `id='o'`，restoreProfile 找不到对应 key

**Spec**：
```
方案：保持双轨并存，通过 KEY_MAP 做映射

1. simulator.html 新增常量：
   const KEY_MAP = {
     'overwork': 'o', 'care': 'c', 'leadership': 'l',
     'competition': 'p', 'process': 'f', 'growth': 'g',
     'innovation': 'i', 'worklife': 'w'
   };

2. restoreProfile(profile) 实现：
   - 遍历 simulator PARAMS（用 p.id）
   - 用 KEY_MAP 反查 onboarding key
   - 取 profile.values[onboardingKey]，存 state.params[p.id]
   - 兜底：profile.values[p.id] 直接兼容

3. onboarding.html 不改，保持用 key='overwork' 等
```

**文件**：simulator.html, onboarding.html  
**DoD**：
- [ ] onboarding 存 'overwork':7 → simulator 能读到 state.params['o']=7
- [ ] onboarding 存 'care':3 → simulator 能读到 state.params['c']=3

---

## 🟡 P1（影响体验，黑客松前完成）

### P1-TODO-1：补全 Simulator 事件链（4个节点）

**问题**：目前只有 after_week_3 和 after_week_6，12周模拟不完整

**Spec**：
```
1. 在 ROUTE_EVENTS 中补充：
   - after_week_9：第9周事件（公司战略调整/团队变动等场景）
   - after_week_12：最终选择（留下/离开/谈判）

2. 每个事件结构：
   {
     scene: '场景描述',
     text: '叙事文本 + 内心独白',
     choices: [
       {text: '选项1', route: 'tech/social/balanced', flavor: '内心独白'},
       {text: '选项2', route: '...', flavor: '...'},
     ]
   }

3. 每个事件触发后更新 state.params（影响最终结局计算）
```

**文件**：simulator.html  
**DoD**：
- [ ] Week 3/6/9/12 四个节点都有事件
- [ ] 每个事件有2-3个选项
- [ ] 选择后 params 有变化

---

### P1-TODO-2：实现结局计算引擎

**问题**：Ending 页面三项内容（Final Params / Council Summary / Plan）都是占位符

**Spec**：
```
1. 实现 computeEnding(params, history) 函数：
   - 根据12周参数变化，计算「职场风格类型」
   - 找出变化最大的维度 → 给出标签（如「技术深耕型」「人际经营型」）
   - 找出保持不变的维度 → 给出标签（如「WLB坚定型」「竞争导向型」）

2. Council Summary：
   - 统计 history 中各委员被提及次数
   - 次数最多的3个委员 → 「主导声音」
   - 次数最少的1个委员 → 「被忽略的声音」

3. Improvement Plan：
   - 基于最终 params vs 初始 params 的 gap
   - 给出1-3条具体建议（如「你的加班接受度偏高，但WLB维度在下降，建议...」）

4. 结局类型候选（至少3种）：
   - 「创业探索型」：growth高/innovation高/worklife低
   - 「稳定经营型」：process高/worklife高/competition低
   - 「人际精英型」：leadership高/care高/competition中
```

**文件**：simulator.html  
**DoD**：
- [ ] 结局页显示「你是XX类型」结论
- [ ] 雷达图显示 Final Params（不是全是5）
- [ ] 有3条具体可操作的建议

---

### P1-TODO-3：内心委员会实质互动

**问题**：委员会只有文案展示，用户选择时没有委员发声

**Spec**：
```
1. 在每个事件选择前，展示委员辩论：
   - 随机选2-3个委员，针对当前事件表态（agree/disagree 文案）
   - 展示200-300ms，然后消失

2. 选择后：
   - 显示「XX委员对你的选择感到满意/失望」
   - 展示对应委员的 flavor text

3. 实现函数 showCouncilCommentary(theme)：
   - 根据 theme（加班/晋升/人际等）选择相关委员
   - 从 COUNCIL_PERSONALITY 读文案，展示动画
```

**文件**：simulator.html  
**DoD**：
- [ ] 每个事件选择前有委员表态动画
- [ ] 选择后有委员反馈文案
- [ ] 用户感受到「委员会真的在辩论」

---

## 🟢 P2（优化，黑客松后迭代）

### P2-TODO-1：印记系统（Imprint）逻辑实现

**Spec**：
```
1. 定义3-5种印记：
   - 「初啼」：第一次提不同意见
   - 「架桥者」：主动帮助同事
   - 「红灯」：连续加班超过3天

2. 在 state.history 中记录 meta 标签（如 'honest_voice'）

3. 结局页检查印记获取情况，高亮展示
```

**DoD**：[ ] 印记有获取条件判断 / [ ] 结局页展示印记画廊

---

### P2-TODO-2：社交分享卡片

**Spec**：
```
1. 结局页增加「分享我的职场类型」按钮
2. 生成 Canvas 卡片：
   - 雷达图（缩小版）
   - 「我是XX型职场人」一句话结论
   - 产品名 + 二维码（可选）
3. 支持保存到相册 / 分享到微信
```

**DoD**：[ ] 卡片可生成 / [ ] 可保存到本地

---

### P2-TODO-3：styles.css 复用

**问题**：simulator.html 内联样式未复用 styles.css

**Spec**：
```
1. 将 simulator.html 的内联 <style> 内容合并到 styles.css
2. simulator.html 改为 <link rel="stylesheet" href="styles.css">
3. 检查两个页面的设计系统是否一致
```

**DoD**：[ ] simulator.html 不再有内联 <style> / [ ] 两页面样式一致

---

## 执行顺序建议

```
Phase 0（工程师当前任务）：
  → P0-TODO-1 + P0-TODO-2 + P0-TODO-3（已完成大部分）

Phase 1（tester 验收后修复）：
  → P1-TODO-1（事件链补全）
  → P1-TODO-2（结局计算引擎）
  → P1-TODO-3（委员会互动）

Phase 2（黑客松后）：
  → P2-TODO-1/2/3
```

---

## 验收约定

- 每个 TODO 完成前必须本地测试通过
- 提交前确认：Console 0 errors
- tester 验收通过后标记 Done
