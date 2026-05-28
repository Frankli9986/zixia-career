// 8 维参数配置
export const PARAMS = [
  { key: 'overwork', name: '加班强度', left: '准时下班', right: '全力投入', default: 5 },
  { key: 'care', name: '人文关怀', left: '目标导向', right: '人情味浓', default: 5 },
  { key: 'leadership', name: '领导风格', left: '决策集中', right: '平等对话', default: 5 },
  { key: 'competition', name: '竞争压力', left: '合作共进', right: '优胜劣汰', default: 5 },
  { key: 'process', name: '流程规范', left: '灵活应变', right: '制度完善', default: 5 },
  { key: 'growth', name: '成长空间', left: '深耕细作', right: '快速晋升', default: 5 },
  { key: 'innovation', name: '创新自由度', left: '循规蹈矩', right: '鼓励创新', default: 5 },
  { key: 'worklife', name: '工作生活平衡', left: '工作为核', right: '生活优先', default: 5 }
];

export const TRAIT_CONFIG = [
  { key: 'overwork', high: '全力投入型', low: '边界守护型' },
  { key: 'care', high: '氛围优先型', low: '结果导向型' },
  { key: 'leadership', high: '平等对话型', low: '指令执行型' },
  { key: 'competition', high: '竞争驱动型', low: '合作共赢型' },
  { key: 'process', high: '制度依赖型', low: '灵活应变型' },
  { key: 'growth', high: '快速晋升型', low: '深耕细作型' },
  { key: 'innovation', high: '创新冒险型', low: '循规蹈距型' },
  { key: 'worklife', high: '生活优先型', low: '工作重心型' }
];

export const COMMITTEE = [
  { name: '加班委员', desc: '有时劝你冲，有时劝你撤' },
  { name: '人文委员', desc: '关心你冷不冷，累不累' },
  { name: '领导委员', desc: '在乎你有没有被听见' },
  { name: '竞争委员', desc: '想看你赢，也怕你太累' },
  { name: '流程委员', desc: '帮你守住底线和边界' },
  { name: '成长委员', desc: '提醒你目光要放长远' },
  { name: '创新委员', desc: '怂恿你试试，没人在乎' },
  { name: 'WLB委员', desc: '只想让你好好休息' }
];

// 8题问卷
export const QUIZ = [
  {
    key: 'overwork',
    q: '你更能接受哪种工作节奏？',
    opts: [
      { text: '准时下班，下班后不处理工作', val: 2 },
      { text: '偶尔加班，但不影响生活', val: 5 },
      { text: '愿意为事业全力以赴', val: 9 }
    ]
  },
  {
    key: 'care',
    q: '在团队合作中，你更看重什么？',
    opts: [
      { text: '目标和结果最重要', val: 2 },
      { text: '既看结果也看氛围', val: 5 },
      { text: '团队氛围和人际关系', val: 9 }
    ]
  },
  {
    key: 'leadership',
    q: '你更倾向于哪种工作方式？',
    opts: [
      { text: '有明确指令，我执行就好', val: 2 },
      { text: '共同讨论，一起做决定', val: 7 },
      { text: '主动扛事，带动他人', val: 9 }
    ]
  },
  {
    key: 'competition',
    q: '面对职场竞争，你的态度是？',
    opts: [
      { text: '合作共赢比竞争更重要', val: 2 },
      { text: '做好自己，顺其自然', val: 5 },
      { text: '适者生存，愿意接受挑战', val: 9 }
    ]
  },
  {
    key: 'process',
    q: '你更喜欢什么样的工作流程？',
    opts: [
      { text: '灵活应变，不需要太多规则', val: 2 },
      { text: '有基本规范，但可以打破', val: 5 },
      { text: '流程清晰，制度完善更安心', val: 9 }
    ]
  },
  {
    key: 'growth',
    q: '你对职业发展的期待是？',
    opts: [
      { text: '深耕一个领域，成为专家', val: 2 },
      { text: '稳步晋升，不着急', val: 5 },
      { text: '快速成长，承担更大责任', val: 9 }
    ]
  },
  {
    key: 'innovation',
    q: '面对新项目或创新尝试，你的态度？',
    opts: [
      { text: '按既定方式执行就好', val: 2 },
      { text: '愿意尝试，但要看情况', val: 5 },
      { text: '主动提出新想法，喜欢探索', val: 9 }
    ]
  },
  {
    key: 'worklife',
    q: '工作对你来说意味着什么？',
    opts: [
      { text: '工作是为了更好的生活', val: 9 },
      { text: '工作和生活同样重要', val: 5 },
      { text: '工作就是我的重心', val: 2 }
    ]
  }
];

// 事件池 - 简化版（保留核心逻辑）
export const EVENT_POOL = [
  {
    id: 'overtime_crunch',
    week: [1, 2, 3, 4, 5],
    difficulty: 12,
    checkParam: 'overwork',
    scene: '项目deadline提前三天。群里炸开了锅。',
    text: '你深呼吸，开始按优先级处理自己的部分。加班到晚上十点，总算没有拖后腿。\n\n地铁末班车上，你看着窗外闪过的广告灯箱，突然意识到自己已经想不起上次准时下班是什么时候。',
    choices: [
      { text: '第二天早点到公司，继续推进', eff: { overwork: 2, growth: 1 }, flavor: '继续保持专注' },
      { text: '在群里同步进度，然后下线', eff: { overwork: 1, care: 1, worklife: 1 }, flavor: '保持节奏' },
      { text: '私聊组长确认优先级，避免做无用功', eff: { competition: 1, leadership: 1 }, flavor: '策略性沟通' }
    ]
  },
  {
    id: 'cross_dept',
    week: [2, 3, 4, 5, 6],
    difficulty: 10,
    checkParam: 'care',
    scene: '隔壁组的负责人给你发了一封邮件。标题写着"创新协作项目 - 诚邀参与"。',
    text: '你打开日历。如果参加，接下来三周每周至少多八小时。如果不参加……\n\n你不确定"不参加"之后会发生什么。那种不确定本身，就是一种信息。',
    choices: [
      { text: '积极加入，争取表现机会', eff: { care: 2, leadership: 2, overwork: 1 }, flavor: '主动出击' },
      { text: '适度参与，不影响本职工作', eff: { care: 1, worklife: 1 }, flavor: '谨慎参与' },
      { text: '婉拒，专注自己岗位', eff: { worklife: 2, care: -1 }, flavor: '守好边界' }
    ]
  },
  {
    id: 'meeting_speak',
    week: [3, 4, 5, 6, 7],
    difficulty: 11,
    checkParam: 'leadership',
    scene: '周会。总监在问一个数据问题，会议室沉默了三秒。',
    text: '你知道答案。至少，你知道一部分答案。\n\n要不要说？你快速评估：说对了，加分。说错了，暴露。不说，安全，但也没有存在感。\n\n会议室的空调嗡嗡响。你数到五。如果数到五还不开口，就放弃。\n\n三。四。',
    choices: [
      { text: '说出自己知道的部分，不确定的坦诚说明', eff: { leadership: 2, care: 1 }, flavor: '诚实发声' },
      { text: '举手说"我需要再确认一下，会后回复"', eff: { leadership: 1, growth: 1 }, flavor: '谨慎确认' },
      { text: '保持沉默，会后再私聊总监', eff: { competition: 1, worklife: 1 }, flavor: '低调处理' }
    ]
  },
  {
    id: 'feedback_bomb',
    week: [4, 5, 6, 7, 8],
    difficulty: 13,
    checkParam: 'process',
    scene: 'mentor把你叫到会议室。关上门。',
    text: '"我需要跟你谈谈。"\n\n你的身体先于大脑做出反应——心跳加速，手心出汗。\n\n"这周的项目，有几个地方可以做得更好。"\n\n你一边听，一边在心里辩解。但你也知道，辩解只会让你看起来防御。',
    choices: [
      { text: '晚上复盘，列出自己的改进清单', eff: { growth: 2, process: 1 }, flavor: '自我提升' },
      { text: '找信任的同事聊聊，确认反馈是否客观', eff: { care: 1, competition: 1 }, flavor: '寻求核实' },
      { text: '情绪低落，但强迫自己完成当天任务', eff: { energy: -15, growth: 1 }, flavor: '韧性应对' }
    ]
  },
  {
    id: 'political_fork',
    week: [6, 7, 8, 9, 10],
    difficulty: 14,
    checkParam: 'competition',
    scene: '两位总监的方案冲突了。你所在的组被夹在中间。',
    text: '这不是普通的分歧。这是权力试探。\n\n你的组长在会议上保持沉默。TA在等什么？等更大的领导表态？还是在等一个替罪羊？\n\n你意识到：在这种局势下，不站队也是一种站队。沉默也会被解读。',
    choices: [
      { text: '支持更有实权的那位，务实但功利', eff: { competition: 2 }, flavor: '务实选择' },
      { text: '支持更受欢迎的那位，赌长期关系', eff: { competition: 1, care: 2 }, flavor: '关系投资' },
      { text: '以"需要更多数据"为由拖延，等局势明朗', eff: { competition: 1, worklife: 1 }, flavor: '静观其变' }
    ]
  },
  {
    id: 'job_switch',
    week: [8, 9, 10, 11, 12],
    difficulty: 15,
    checkParam: 'growth',
    scene: '你同时收到了两个信号：内部晋升提名，和猎头的 exploratory call。',
    text: '这不是"选A还是选B"的问题。这是"现在的你是谁"的问题。\n\n内部晋升意味着被认可，也意味着被绑定。\n\n猎头的电话意味着可能性，也意味着风险。',
    choices: [
      { text: '争取内部晋升，同时低调接触外部机会', eff: { competition: 2, growth: 1 }, flavor: '双轨并行' },
      { text: '坦诚和现任上级谈职业规划，寻求建议', eff: { care: 2, leadership: 1 }, flavor: '开放对话' },
      { text: '给自己两周冷静期，不做任何决定', eff: { worklife: 2, growth: -1 }, flavor: '暂停思考' }
    ]
  }
];

// 路线事件（里程碑选择）
export const ROUTE_EVENTS = {
  after_week_3: {
    scene: '第一个月结束了。周五晚上，办公室里只剩下你和保洁阿姨。',
    text: '你坐在工位上，回顾这四周。\n\n你发现自己更多时间在做什么？不是"应该做什么"，而是实际上，你的注意力自然而然地流向了哪里？\n\n阿姨推着吸尘器经过，你才发现已经九点半了。',
    choices: [
      { text: '研究技术文档，优化手上的工具链', route: 'tech', flavor: '你发现自己进入状态时，整个世界都安静了。' },
      { text: '和同事吃饭聊天，认识其他组的人', route: 'social', flavor: '你发现自己很享受交换信息的快感。' },
      { text: '按流程完成工作，准时下班', route: 'balanced', flavor: '你在找一个可持续的节奏。' }
    ]
  },
  after_week_6: {
    scene: '第二个月结束。你的mentor问你："这三个月你想留下什么？"',
    text: '留下什么。不是"完成什么"，是"留下什么"。\n\n这是一个关于遗产的问题。关于你想被别人记住的样子。\n\n窗外的城市灯火通明。某处有人在加班，某处有人在约会，某处有人正在做出改变一生的决定。\n\n你属于哪一种？',
    choices: [
      { text: '一个扎实的技术方案，能跑三年的那种', route: 'tech', flavor: '你想留下的是作品。' },
      { text: '一群愿意再和你合作的人', route: 'social', flavor: '你想留下的是关系。' },
      { text: '一个更清晰的自己', route: 'balanced', flavor: '你想留下的是答案。' }
    ]
  },
  after_week_9: {
    scene: '三个月到了。你开始问自己：我是不是该换个地方了？',
    text: '你已经在这家公司待了三个月。\n\n有人拿到了晋升，有人选择离开，有人开始带新人。\n\n你也开始想：我在这里，还有多少可能？\n\n窗外是傍晚的天空。你站在十字路口。',
    choices: [
      { text: '留下来，争取更多资源和支持', route: 'balanced', flavor: '你觉得还有机会。' },
      { text: '主动出击，争取晋升或转岗机会', route: 'tech', flavor: '你不想再等了。' },
      { text: '开始投简历，收集外部机会', route: 'social', flavor: '你想知道自己在市场上值多少。' }
    ]
  },
  after_week_12: {
    scene: '三个月试用期结束。HR找你谈话："你的表现不错，但我们需要再谈谈。"',
    text: '留下，还是离开？这是一个问题。\n\n但也许更重要的是：你通过这三个月，更了解自己了。\n\n你开始想：我到底是哪种人？我适合什么样的环境？',
    choices: [
      { text: '留下来，接受这个环境', route: 'balanced', flavor: '你决定在这里继续寻找可能性。' },
      { text: '离开，去更适合自己的地方', route: 'tech', flavor: '你知道这不是终点，是起点。' },
      { text: '谈判，争取更好的条件再留下', route: 'social', flavor: '你想试试，能不能改变这个环境。' }
    ]
  }
};

// 印记定义
export const IMPRINTS = {
  first_voice: {
    name: '「初啼」',
    desc: '你第一次在会议上提出了不同意见。虽然声音在抖，但你说完了。',
    effect: '表达观点类选项额外+1领导力'
  },
  burnout_warning: {
    name: '「红灯」',
    desc: '你的身体在发出警告。但你还没有停下来。',
    effect: '加班选项效果翻倍，精力消耗也翻倍'
  },
  bridge_builder: {
    name: '「架桥者」',
    desc: '你在两个对立的势力之间找到了第三条路。不是妥协，是创造。',
    effect: '政治相关检定+2'
  }
};

// 委员会性格映射
export const COUNCIL_PERSONALITY = {
  overwork: {
    agree: ['这才对嘛。', '机会是拼出来的。', '年轻时不拼什么时候拼？'],
    disagree: ['你明明说不想加班的。', '又要重蹈覆辙？', '你还记得上周的承诺吗？'],
    high: ['继续保持这个节奏！', '三连胜！', '我就知道你可以。'],
    low: ['你果然还是老样子。', '每次到关键时刻就退。', '不意外。']
  },
  care: {
    agree: ['大家一起走才能远。', '团队需要这样的人。', '你让他们感到被接纳。'],
    disagree: ['你确定要一个人扛？', '团队会怎么看你？', '这不是逞强的时候。'],
    high: ['你是团队的粘合剂。', '大家都信任你。', '这种能力很稀缺。'],
    low: ['你把自己孤立了。', '一个人走得快，一群人走得远。', '你需要盟友。']
  },
  leadership: {
    agree: ['去争取。', '你值得更好的位置。', '领导力和职位无关。'],
    disagree: ['又在退缩。', '机会不会自己敲门。', '你明明可以的。'],
    high: ['天生领导者。', '他们已经在注意你了。', '继续。'],
    low: ['你总是把自己放得太低。', '为什么不试试？', '你在怕什么？']
  },
  competition: {
    agree: ['信息就是权力。', '你看到了别人看不到的。', '这是必要的。'],
    disagree: ['把头埋进沙子？', '你会后悔不知道的。', '职场不是温室。'],
    high: ['你是信息枢纽。', '没有人能在你眼皮底下搞小动作。', '这种敏感度是天赋。'],
    low: ['你太天真了。', '事情没有那么简单。', '醒醒。']
  },
  process: {
    agree: ['你需要被看见。', '认可不是软弱。', '你的努力值得被承认。'],
    disagree: ['你不在乎吗？', '为什么总是你付出、别人收获？', '这不公平。'],
    high: ['你渴望被认可，这很正常。', '去要你该得的。', '别让他们忽视你。'],
    low: ['你把自己封闭了。', '反馈不是毒药。', '听听别人怎么说。']
  },
  growth: {
    agree: ['这才叫成长。', '投资自己永远是对的。', '未来的你会感谢现在。'],
    disagree: ['就这点本事？', '你可以学得更多。', '别满足于现状。'],
    high: ['学习机器。', '你停不下来，对吗？', '这种饥渴感会带你很远。'],
    low: ['你在浪费潜力。', '就这样了吗？', '舒服区是个陷阱。']
  },
  innovation: {
    agree: ['打破它。', '为什么不试试新的？', '规则是写给遵守者看的。'],
    disagree: ['又是老一套。', '你就不能有点创意？', '循规蹈矩很安全，也很无聊。'],
    high: ['颠覆者。', '你生来就不安分。', '这个世界需要你的疯狂。'],
    low: ['你怕出错？', '不敢冒险的人，得不到意外。', '试试又不会死。']
  },
  worklife: {
    agree: ['对，就是这样。', '你需要休息。', '这不是逃避，是必要。'],
    disagree: ['你又在牺牲自己。', '说好的边界呢？', '你还记得自己的承诺吗？'],
    high: ['保护自己是对的。', '工作不是全部。', '你的生活值得被守护。'],
    low: ['你在燃烧自己。', '停下来。', '求你了。']
  }
};

export function getTopTraits(values) {
  const scored = TRAIT_CONFIG.map(t => ({
    ...t,
    value: values[t.key] || 5
  }));
  scored.sort((a, b) => b.value - a.value);
  return scored.slice(0, 3).map(t => t.value >= 5 ? t.high : t.low);
}