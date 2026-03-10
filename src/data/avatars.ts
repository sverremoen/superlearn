export type AvatarOption = {
  id: string;
  emoji: string;
  label: string;
  gradient: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: 'fox', emoji: '🦊', label: 'Reven', gradient: 'from-orange-300 to-rose-300' },
  { id: 'bear', emoji: '🐻', label: 'Bjørnen', gradient: 'from-amber-300 to-orange-300' },
  { id: 'cat', emoji: '🐱', label: 'Katten', gradient: 'from-yellow-200 to-pink-200' },
  { id: 'dog', emoji: '🐶', label: 'Hunden', gradient: 'from-amber-200 to-lime-200' },
  { id: 'owl', emoji: '🦉', label: 'Uglen', gradient: 'from-violet-200 to-fuchsia-200' },
  { id: 'panda', emoji: '🐼', label: 'Pandaen', gradient: 'from-slate-200 to-zinc-300' },
  { id: 'lion', emoji: '🦁', label: 'Løven', gradient: 'from-yellow-300 to-orange-200' },
  { id: 'frog', emoji: '🐸', label: 'Frosken', gradient: 'from-green-200 to-emerald-300' },
  { id: 'rabbit', emoji: '🐰', label: 'Kaninen', gradient: 'from-pink-200 to-rose-200' },
  { id: 'unicorn', emoji: '🦄', label: 'Enhjørningen', gradient: 'from-fuchsia-200 to-sky-200' },
  { id: 'penguin', emoji: '🐧', label: 'Pingvinen', gradient: 'from-slate-200 to-sky-200' },
  { id: 'whale', emoji: '🐳', label: 'Hvalen', gradient: 'from-cyan-200 to-blue-300' },
];

export const defaultAvatarId = avatarOptions[0].id;
