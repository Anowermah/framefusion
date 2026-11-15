import{u as h,j as e,L as l}from"./app-DmW8vfvG.js";import{L as d,S as p}from"./MainLayout-CWEYVM-h.js";import{U as m}from"./users-fsx-022t.js";import{L as f}from"./layers-CMQu48wt.js";import{c as t}from"./createLucideIcon-B6PcPVkp.js";import{S as x}from"./shield-exclamation-point-C4VNYE7B.js";/**
 * @license lucide-react v1.73.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s={name:"chart-column",size:24,node:[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],aliases:["bar-chart-3"]};s.node;const g=t(s);/**
 * @license lucide-react v1.73.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n={name:"grid-3x3",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]],aliases:["grid","grid-3-x-3"]};n.node;const b=t(n);function j(){const{url:r}=h(),o=[{href:"/admin",label:"Overview",icon:d,exact:!0},{href:"/admin/users",label:"Users",icon:m},{href:"/admin/campaigns",label:"Campaigns",icon:f},{href:"/admin/categories",label:"Categories",icon:b},{href:"/admin/reports",label:"Reports & Moderation",icon:x},{href:"/admin/settings",label:"Settings",icon:p},{href:"/admin/analytics",label:"Analytics",icon:g}];return e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold scrollbar-none",children:o.map(a=>{const i=a.icon,c=a.exact?r===a.href:r.startsWith(a.href);return e.jsxs(l,{href:a.href,className:`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${c?"bg-purple-600 text-white shadow-xs":"text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`,children:[e.jsx(i,{className:"w-4 h-4"}),e.jsx("span",{children:a.label})]},a.href)})})}export{j as A,g as C};
