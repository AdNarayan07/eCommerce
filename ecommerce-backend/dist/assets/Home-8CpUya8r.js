import{u as i,a as n,b as o,r as c,j as s,L as m,s as d,n as x}from"./index-B9PCgfjE.js";import{f}from"./productsApi-O_D6sO7N.js";import{I as h}from"./ImageWithFallback-NGMloEEn.js";import{N as p}from"./NoProductsAvailable-CN-JbXic.js";const N=()=>{const l=i(),a=n(e=>e.products.products),r=o();return c.useEffect(()=>{(async()=>{try{const t=await f();l(d(t)),x.done()}catch(t){console.log(t)}})()},[]),s.jsxs("div",{className:"p-4 w-full h-full flex flex-col",children:[s.jsx("h1",{className:"text-3xl font-bold mb-6",children:"Products"}),a?a.length?s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 h-fit",children:a==null?void 0:a.map(e=>s.jsxs("div",{className:"bg-white border rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 cursor-pointer",onClick:()=>r(`/product/${e.id}`),children:[s.jsxs("h2",{className:"font-semibold text-xl mb-2 flex items-center space-x-2",children:[s.jsxs("span",{className:"px-2 py-0.5 bg-gray-200 rounded text-sm",children:["#",e.id]}),s.jsx("span",{children:e.name})]}),s.jsx("div",{className:"h-60 flex items-center justify-center bg-gray-200 mb-4 rounded p-2",children:s.jsx(h,{src:e.id,alt:e.name,fallbackSrc:"/images/default.jpg",className:"max-h-[-webkit-fill-available] max-w-[-webkit-fill-available]"})}),s.jsx("p",{className:"mb-4",children:e.shortDescription}),s.jsxs("div",{className:"flex flex-wrap text-gray-600 mb-1",children:[s.jsxs("span",{className:"px-2 py-0.5 m-1 bg-green-200 rounded text-sm font-medium",children:["₹",e.price.toFixed(2)]}),s.jsxs("span",{className:`px-2 py-0.5 m-1 ${e.quantity<10?"bg-red-600 text-white":"bg-yellow-300"} rounded text-sm font-medium`,children:["Stock: ",e.quantity]}),s.jsxs("span",{className:"px-2 py-0.5 m-1 bg-blue-200 rounded text-sm font-medium",children:["Seller: ",e.seller||"Unknown"]})]})]},e.id))}):s.jsx(p,{}):s.jsx(m,{component:"Products"})]})};export{N as default};
