export interface Teacher {
  id: number;
  name: string;
  subject: string;
  title: string;
  quote: string;
  color: string;
  initials: string;
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "陈明远",
    subject: "语文",
    title: "高级教师",
    quote: "文字是青春的注脚，愿你们在字里行间找到光。",
    color: "from-amber-400 to-orange-500",
    initials: "陈",
  },
  {
    id: 2,
    name: "林晓薇",
    subject: "数学",
    title: "年级组长",
    quote: "每一条公式背后，都藏着通往未来的钥匙。",
    color: "from-sky-400 to-blue-500",
    initials: "林",
  },
  {
    id: 3,
    name: "王浩然",
    subject: "英语",
    title: "骨干教师",
    quote: "语言打开世界，勇敢说出属于你们的故事。",
    color: "from-rose-400 to-pink-500",
    initials: "王",
  },
  {
    id: 4,
    name: "赵雅琴",
    subject: "物理",
    title: "特级教师",
    quote: "作用力与反作用力之间，是你们成长的回响。",
    color: "from-emerald-400 to-teal-500",
    initials: "赵",
  },
  {
    id: 5,
    name: "孙博文",
    subject: "体育",
    title: "教练",
    quote: "跑道上留下的每一滴汗水，都是青春的勋章。",
    color: "from-violet-400 to-purple-500",
    initials: "孙",
  },
];
