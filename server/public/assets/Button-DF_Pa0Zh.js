import{g as u,j as m}from"./index-YnYz-TJH.js";var a={exports:{}},T="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",l=T,f=l;function c(){}function i(){}i.resetWarningCache=c;var h=function(){function e(p,n,P,v,x,y){if(y!==f){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}e.isRequired=e;function t(){return e}var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:c};return r.PropTypes=r,r};a.exports=h();var g=a.exports;const o=u(g),b=({text:e,activeClass:t,btnType:r,func:p,type:n})=>m.jsx("button",{className:`btn ${t} ${r}`,type:n||"button",onClick:p,children:e});b.propTypes={text:o.string,btnType:o.string,activeClass:o.string,type:o.string,func:o.func};export{b as B,o as P};
