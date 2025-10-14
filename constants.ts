
import React from 'react';
import type { CategoryInfo, IncomeCategoryInfo } from './types';

// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const FoodIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M3 21h18c-1.1-6.2-4.2-12-18-12Z" }),
    React.createElement('path', { d: "M6 15s1.2-6 6-6 6 6 6 6" }),
    React.createElement('path', { d: "M12 9v0" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const TransportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M10 21h4" }),
    React.createElement('path', { d: "M3 11h18v8H3z" }),
    React.createElement('path', { d: "M15 11V3H9v8" }),
    React.createElement('path', { d: "m14 3-1 2H9L8 3" }),
    React.createElement('path', { d: "m5 19-2 2" }),
    React.createElement('path', { d: "m19 19 2 2" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const HousingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
    React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const HealthIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const EntertainmentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "m16 8 4-4" }),
    React.createElement('path', { d: "m16 16 4 4" }),
    React.createElement('path', { d: "m8 8-4-4" }),
    React.createElement('path', { d: "m8 16 4 4" }),
    React.createElement('rect', { width: "8", height: "14", x: "8", y: "5", rx: "1" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const UtilitiesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement('path', { d: "M12 22v-3.33" }),
    React.createElement('path', { d: "M12 11.33V1" }),
    React.createElement('path', { d: "M4 14h16" }),
    React.createElement('path', { d: "M6 14l-2.73 3.51a1 1 0 0 0 .81 1.49h13.84a1 1 0 0 0 .81-1.49L18 14" }),
    React.createElement('path', { d: "m18 10-3-3" }),
    React.createElement('path', { d: "m9 7 3-3" }),
    React.createElement('path', { d: "m6 10 3-3" }),
    React.createElement('path', { d: "m15 7-3 3" })
  )
);
// FIX: Rewrote icon components using React.createElement to be valid in a .ts file.
const OtherIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement('circle', { cx: "12", cy: "12", r: "1" }),
      React.createElement('circle', { cx: "19", cy: "12", r: "1" }),
      React.createElement('circle', { cx: "5", cy: "12", r: "1" })
    )
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement('circle', { cx: "8", cy: "21", r: "1" }),
      React.createElement('circle', { cx: "19", cy: "21", r: "1" }),
      React.createElement('path', { d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" })
    )
);

const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
      React.createElement('path', { d: "M20 12v10H4V12" }),
      React.createElement('path', { d: "M2 7h20v5H2z" }),
      React.createElement('path', { d: "M12 22V7" }),
      React.createElement('path', { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }),
      React.createElement('path', { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" })
    )
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
        React.createElement('path', { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
    )
);

const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('rect', { width: "20", height: "14", x: "2", y: "7", rx: "2", ry: "2" }),
        React.createElement('path', { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })
    )
);

const LaptopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.9-1.45L4 16" })
    )
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('polyline', { points: "22 7 13.5 15.5 8.5 10.5 2 17" }),
        React.createElement('polyline', { points: "16 7 22 7 22 13" })
    )
);


export const ICONS_MAP: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Food: FoodIcon,
  Transport: TransportIcon,
  Housing: HousingIcon,
  Health: HealthIcon,
  Entertainment: EntertainmentIcon,
  Utilities: UtilitiesIcon,
  Other: OtherIcon,
  Shopping: ShoppingCartIcon,
  Gifts: GiftIcon,
  Education: BookOpenIcon,
  Business: BriefcaseIcon,
};

export const INCOME_ICONS_MAP: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Salary: BriefcaseIcon,
  Freelance: LaptopIcon,
  Investments: TrendingUpIcon,
  Gifts: GiftIcon,
  Other: OtherIcon,
};

export const AVAILABLE_ICONS = [
  { name: 'Food', component: FoodIcon },
  { name: 'Transport', component: TransportIcon },
  { name: 'Housing', component: HousingIcon },
  { name: 'Health', component: HealthIcon },
  { name: 'Entertainment', component: EntertainmentIcon },
  { name: 'Utilities', component: UtilitiesIcon },
  { name: 'Other', component: OtherIcon },
  { name: 'Shopping', component: ShoppingCartIcon },
  { name: 'Gifts', component: GiftIcon },
  { name: 'Education', component: BookOpenIcon },
  { name: 'Business', component: BriefcaseIcon },
];

export const AVAILABLE_COLORS = [
  'text-emerald-400',
  'text-blue-400',
  'text-orange-400',
  'text-red-400',
  'text-purple-400',
  'text-yellow-400',
  'text-slate-400',
  'text-pink-400',
  'text-sky-400',
  'text-lime-400',
  'text-rose-400',
];

export const TAILWIND_COLOR_MAP: { [key: string]: string } = {
    'text-emerald-400': '#34d399',
    'text-blue-400': '#60a5fa',
    'text-orange-400': '#fb923c',
    'text-red-400': '#f87171',
    'text-purple-400': '#c084fc',
    'text-yellow-400': '#facc15',
    'text-slate-400': '#94a3b8',
    'text-pink-400': '#f472b6',
    'text-sky-400': '#38bdf8',
    'text-lime-400': '#a3e635',
    'text-rose-400': '#fb7185',
};

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  { id: 'cat-1', name: 'Food', icon: 'Food', color: 'text-emerald-400', isDefault: true },
  { id: 'cat-2', name: 'Transport', icon: 'Transport', color: 'text-blue-400', isDefault: true },
  { id: 'cat-3', name: 'Housing', icon: 'Housing', color: 'text-orange-400', isDefault: true },
  { id: 'cat-4', name: 'Health', icon: 'Health', color: 'text-red-400', isDefault: true },
  { id: 'cat-5', name: 'Entertainment', icon: 'Entertainment', color: 'text-purple-400', isDefault: true },
  { id: 'cat-6', name: 'Utilities', icon: 'Utilities', color: 'text-yellow-400', isDefault: true },
  { id: 'cat-7', name: 'Other', icon: 'Other', color: 'text-slate-400', isDefault: true },
];

export const DEFAULT_INCOME_CATEGORIES: IncomeCategoryInfo[] = [
  { id: 'inc-1', name: 'Salary', icon: 'Salary', color: 'text-emerald-400', isDefault: true },
  { id: 'inc-2', name: 'Freelance', icon: 'Freelance', color: 'text-sky-400', isDefault: true },
  { id: 'inc-3', name: 'Investments', icon: 'Investments', color: 'text-blue-400', isDefault: true },
  { id: 'inc-4', name: 'Gifts', icon: 'Gifts', color: 'text-pink-400', isDefault: true },
  { id: 'inc-5', name: 'Other', icon: 'Other', color: 'text-slate-400', isDefault: true },
];
