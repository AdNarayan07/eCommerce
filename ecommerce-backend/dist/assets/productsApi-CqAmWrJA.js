import{h as e,x as o}from"./index-CgZGQlFR.js";const a="/api/products",p=async s=>(await e.get(a,o(s))).data,u=async s=>(await e.get(`${a}/bySeller`,o(s))).data,d=async s=>(await e.get(`${a}/${s}`)).data,i=async(s,t)=>(await e.post(a,s,o(t))).data,y=async(s,t)=>(await e.delete(`${a}/${s}`,o(t))).data,$=async(s,t,n)=>(await e.put(`${a}/${s}`,t,o(n))).data,m=async(s,t,n)=>(await e.post(`${a}/${s}/buy`,t,o(n))).data,w=async s=>(await e.get(`${a}/${s}/comments`)).data,g=async(s,t,n)=>(await e.put(`${a}/${s}/comments`,t,o(n))).data;export{i as a,u as b,m as c,d,p as f,w as g,g as p,y as r,$ as u};
