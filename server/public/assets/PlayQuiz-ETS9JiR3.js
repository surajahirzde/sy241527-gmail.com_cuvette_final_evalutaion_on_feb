import{r as l,j as n,a as E,u as _}from"./index-BsGi0Z90.js";import{P as m,B}from"./Button-BXglfU5k.js";import b from"./Loader-DxiaRQZX.js";const k=({func:d,quiz:e,setScore:f})=>{var N,S,w,P,C,Q,I,O,R;const[s,j]=l.useState(0),[r,i]=l.useState(null),[y,g]=l.useState(!0),[h,p]=l.useState(!1),[c,$]=l.useState(null);l.useEffect(()=>{v()},[]),l.useEffect(()=>{var o,a;(o=e==null?void 0:e.questions[s])!=null&&o.timer?i((a=e==null?void 0:e.questions[s])==null?void 0:a.timer):i(null),$(null)},[s,e==null?void 0:e.questions]),l.useEffect(()=>{const o=setInterval(()=>{i(a=>{var t;if((t=e==null?void 0:e.questions[s])!=null&&t.timer)return a>0?a-1:(clearInterval(o),(e==null?void 0:e.quizType)!=="Poll Type"&&T(),null)})},1e3);return()=>{clearInterval(o)}},[r,s]);const T=async()=>{var o,a;s<((o=e==null?void 0:e.questions)==null?void 0:o.length)-1?j(t=>t+1):d("ended"),s<((a=e==null?void 0:e.questions)==null?void 0:a.length)-1&&await v()},x=o=>{var a;$(o),e.quizType==="Poll Type"&&fetch(`https://server-final.up.railway.app/api/quiz/${e==null?void 0:e._id}/questions/${s}/poll-options/${o}`,{method:"POST",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{t.code===200&&p(!0)}).catch(t=>console.log(t)),e.quizType==="Q & A"&&(((a=e==null?void 0:e.questions[s])==null?void 0:a.answer)===o&&c===null?(f(t=>t+1),fetch(`https://server-final.up.railway.app/api/quiz/${e==null?void 0:e._id}/correct-answers/${s} `,{method:"POST",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{t.code===200&&console.log(t)}).catch(t=>console.log(t))):fetch(`https://server-final.up.railway.app/api/quiz/${e==null?void 0:e._id}/wrong-answers/${s} `,{method:"POST",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{t.code===200&&console.log(t)}).catch(t=>console.log(t)))},v=async()=>{await fetch(`https://server-final.up.railway.app/api/quiz/${e==null?void 0:e._id}/attempted-questions/${s}`,{method:"POST",headers:{"Content-Type":"application/json"}}).then(o=>o.json()).then(o=>{o.code===200&&console.log(o)}).catch(o=>console.log(o)).finally(()=>g(!1))};return n.jsxs("section",{className:"game",children:[n.jsx("div",{className:"game-header",children:n.jsxs("p",{children:[n.jsx("span",{className:"qno",children:`0${s+1} / 0${(N=e==null?void 0:e.questions)==null?void 0:N.length}`}),n.jsx("span",{className:"timer",children:(e==null?void 0:e.quizType)!=="Poll Type"&&r!==null&&((S=e==null?void 0:e.questions[s])!=null&&S.timer)?`00:${r>9?r:`0${r}`}s`:null})]})}),n.jsxs("div",{className:"game-body",children:[n.jsx("h2",{children:(w=e==null?void 0:e.questions[s])==null?void 0:w.question}),n.jsx("div",{className:"options",children:((P=e==null?void 0:e.questions[s])==null?void 0:P.optionType)==="text"?(C=e==null?void 0:e.questions[s])==null?void 0:C.options.map((o,a)=>{var t;return n.jsx("div",{className:`option ${a===((t=e==null?void 0:e.questions[s])==null?void 0:t.answer)?"correct":""} ${a===c?"selected":""}`,onClick:()=>{!h&&x(a)},children:o.text},a)}):((Q=e==null?void 0:e.questions[s])==null?void 0:Q.optionType)==="image"?(I=e==null?void 0:e.questions[s])==null?void 0:I.options.map((o,a)=>{var t;return n.jsx("div",{style:{backgroundImage:`url(${o.image})`},className:`option image-option ${a===((t=e==null?void 0:e.questions[s])==null?void 0:t.answer)?"correct":""} ${a===c?"selected":""}`,onClick:()=>{!h&&x(a)}},a)}):(O=e==null?void 0:e.questions[s])==null?void 0:O.options.map((o,a)=>n.jsxs("div",{className:`option text image-option ${a===c?"selected":""}`,onClick:()=>{!h&&x(a)},children:[n.jsx("p",{children:o.text}),n.jsx("img",{src:o.image,alt:"option"})]},a))}),n.jsx("div",{className:"game-footer",children:n.jsx("button",{className:"next-btn",onClick:T,children:s<((R=e==null?void 0:e.questions)==null?void 0:R.length)-1?"Next":"Submit"})})]}),y&&n.jsx(b,{})]})};k.propTypes={quiz:m.object.isRequired,setScore:m.func.isRequired,func:m.func.isRequired};const L="/assets/award-BdRS2T2a.svg",A=({type:d,score:e})=>n.jsx("section",{className:"result",children:d==="Q & A"?n.jsxs("div",{className:"result-wrapper",children:[n.jsx("h1",{children:"Congrats Quiz is completed"}),n.jsx("img",{src:L,alt:"award"}),n.jsxs("h1",{children:["Your score is ",n.jsx("span",{children:e})]})]}):n.jsx("div",{className:"result-wrapper",children:n.jsx("h1",{className:"poll",children:"Thank you for participating in the Poll"})})});A.propTypes={type:m.string.isRequired,score:m.string.isRequired};const D=()=>{var h;const{quizId:d}=E(),[e,f]=l.useState("none"),[s,j]=l.useState(null),[r,i]=l.useState(0),y=_(),g=()=>{fetch(`https://server-final.up.railway.app/api/quiz/${d}/impressions`,{method:"POST",headers:{"Content-Type":"application/json"}}).then(p=>p.json()).then(p=>{p.code===200&&fetch(`https://server-final.up.railway.app/api/quiz/${d}`).then(c=>c.json()).then(c=>{c.code===200&&j(c.data)}),p.code===404&&y("/404",{state:{message:"Quiz Not Found"}})}).catch(p=>console.log(p))};return n.jsx("main",{className:"play-quiz",children:e==="none"?n.jsx(B,{type:"button",text:"Play Quiz",func:()=>{f("yes"),g()}}):e==="yes"&&s?n.jsx(k,{quiz:s,setScore:i,func:()=>f("ended")}):e==="ended"?n.jsx(A,{type:`${(s==null?void 0:s.quizType)==="Poll Type"?"Poll Type":"Q & A"}`,score:`${r>9?r:`0${r}`}/0${(h=s==null?void 0:s.questions)==null?void 0:h.length}`}):n.jsx(b,{})})};export{D as default};
