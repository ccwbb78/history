const REGISTERED_KEY = 'history:registered';
const REGISTERED_NAME_KEY = 'history:registeredName';

export const ALLOWED_NAMES = [
  '程康锐', '刘志涛', '江伟琦', '江相雄', '盛彦宇', '支鲁欢', '汤涛', '涂家铭', '周益鸿', '张梦庆',
  '程伟钊', '陈志涛', '江轩政', '胡勤达', '罗铭', '徐康鑫', '李康星', '李昌武', '章韩兵', '何益彰',
  '詹博亮', '曾佳诚', '黄庭康', '刘文浩', '钟杰', '史博乐', '彭雪锋', '陈敏浩1', '李志华'
];

export function isRegistered(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(REGISTERED_KEY) === 'true';
}

export function getRegisteredName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REGISTERED_NAME_KEY);
}

export function canAccessMan(): boolean {
  const name = getRegisteredName();
  if (!name) return false;
  return ALLOWED_NAMES.includes(name.trim());
}

export function markRegistered(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REGISTERED_KEY, 'true');
    localStorage.setItem(REGISTERED_NAME_KEY, name.trim());
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REGISTERED_KEY);
    localStorage.removeItem(REGISTERED_NAME_KEY);
  }
}
