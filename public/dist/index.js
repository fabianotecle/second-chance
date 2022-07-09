(()=>{var E=()=>{var l;let d="Last Published:";for(let u of document.childNodes)if(u.nodeType===Node.COMMENT_NODE&&((l=u.textContent)==null?void 0:l.includes(d))){let a=u.textContent.trim().split(d)[1];if(a)return new Date(a)}};var w=d=>{let l=E();console.log(`Hello ${d}!`),console.log(`This site was last published on ${l==null?void 0:l.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{w("Fabiano Alves");let l=[],a={cca2:navigator.language.split("-")[1],flag:"",prefix:"",name:""},h=await b(),T=["US","PR","RU","EH","KZ","VA","DO","SH"],c=1;async function b(){let e=await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags");if(e.ok)return e.json()}function S(e){let n=!1;for(;!n;){n=!0;let t=0;e.forEach(function(){if(t>0&&e[t-1].cca2>e[t].cca2){let o=e[t];e[t]=e[t-1],e[t-1]=o,n=!1}t=t+1})}}function H(e){let n=0,t=document.querySelector(".prefix-dropdown_list");t.firstElementChild&&t.removeChild(t.firstElementChild),e.forEach(o=>{let r=document.createElement("img");r.src=o.flag,r.setAttribute("data-element","flag"),r.setAttribute("loading","lazy"),r.setAttribute("alt",o.name),r.className="prefix-dropdown_flag";let s=document.createElement("div");s.setAttribute("data-element","value"),s.setAttribute("data-prefix",o.prefix),s.innerHTML=o.cca2;let i=document.createElement("a");i.setAttribute("data-element","item"),i.setAttribute("aria-role","option"),i.setAttribute("aria-selected","false"),i.setAttribute("aria-label",o.name),i.setAttribute("title",o.name),i.setAttribute("data-index",String(n)),i.setAttribute("id","div"+n),i.href="#",i.className="prefix-dropdown_item w-inline-block",i.addEventListener("click",function(y){M(y,this)}),i.appendChild(r),i.appendChild(s),t.appendChild(i),n=n+1})}function D(){let e=document.querySelector(".w--current");if(e){if(e.offsetTop!==0){let t=document.querySelector(".prefix-dropdown_list");t.scrollTop=e.offsetTop-t.clientHeight/2.2}let n=e.getAttribute("data-index");c=parseInt(n)}}function f(){let e=document.querySelector(".prefix-dropdown_component");if(e.classList.contains("open"))m();else{e.classList.add("open");let n=document.querySelector(".prefix-dropdown_list-wrapper");n.style.transition="all 0.075s linear",n.style.display="block";let t=document.querySelector(".prefix-dropdown_chevron");t.style.transition="all 0.075s linear",t.style.transform="rotate(180deg)"}D()}function m(){let e=document.querySelector(".prefix-dropdown_component");if(e.classList.contains("open")){e.classList.remove("open");let n=document.querySelector(".prefix-dropdown_list-wrapper");n.style.transition="all 0.075s linear",n.style.display="none";let t=document.querySelector(".prefix-dropdown_chevron");t.style.transition="all 0.075s linear",t.style.transform="rotate(0deg)",document.querySelectorAll(".prefix-dropdown_item").forEach(function(o){o.classList.remove("arrowSelected")})}}function p(e){let n=document.querySelector("input[name=countryCode]");n.value=e.prefix;let t=document.querySelector(".prefix-dropdown_toggle"),o=t.childNodes[0];o.src=e.flag,o.alt=e.name+" Flag";let r=t.childNodes[2];r.innerHTML=e.prefix,document.querySelectorAll(".prefix-dropdown_item").forEach(i=>{i.title!==e.name?i.classList.remove("w--current"):(i.classList.add("w--current"),c=parseInt(i.getAttribute("data-index")))})}function M(e,n){e.preventDefault();let t=n.childNodes[1],o=n.childNodes[0],r={cca2:t.innerHTML,prefix:t.getAttribute("data-prefix"),flag:o.src,name:n.title};p(r),f()}function L(e){if(document.activeElement===document.querySelector(".prefix-dropdown_toggle")&&(e.preventDefault(),document.querySelector(".prefix-dropdown_component").classList.contains("open"))){let t=document.querySelector(".w--current"),o=document.getElementById("div"+c);if(t&&o&&t!==o){let r=o.childNodes[1],s=o.childNodes[0],i={cca2:r.innerHTML,flag:s.src,prefix:r.getAttribute("data-prefix"),name:o.getAttribute("title")};p(i)}}f()}function A(e){let n=e.key;if(document.querySelector(".prefix-dropdown_component").classList.contains("open")&&n.length===1&&n.match(/[a-z]/i)){let o=n.toUpperCase(),r=0,s=0,i=document.getElementById("div"+r);for(;i&&!s;){let y=i.childNodes[1];if(o===y.innerHTML.charAt(0)){c=r;let v=document.querySelector(".prefix-dropdown_list");v.scrollTop=i.offsetTop-v.clientHeight/2.2,document.querySelectorAll(".prefix-dropdown_item").forEach(function(q){q.classList.remove("arrowSelected")}),i.classList.add("arrowSelected"),s=1}r=r+1,i=document.getElementById("div"+r)}}}function x(e,n){if(document.querySelector(".prefix-dropdown_component").classList.contains("open"))if(n.preventDefault(),e==="up"){let o=document.getElementById("div"+(c-1));if(o){c=c-1,document.querySelectorAll(".prefix-dropdown_item").forEach(function(s){s.classList.remove("arrowSelected")});let r=document.querySelector(".prefix-dropdown_list");r.scrollTop=o.offsetTop-r.clientHeight/2.2,o.classList.add("arrowSelected")}}else{let o=document.getElementById("div"+(c+1));if(o){c=c+1,document.querySelectorAll(".prefix-dropdown_item").forEach(function(s){s.classList.remove("arrowSelected")});let r=document.querySelector(".prefix-dropdown_list");r.scrollTop=o.offsetTop-r.clientHeight/2.2,o.classList.add("arrowSelected")}}}async function C(){let e=document.querySelector('[name="phoneNumber"]'),n=document.querySelector('[name="countryCode"]');if((await fetch("/?phoneNumber="+e.value+"&countryCode="+n.value)).ok){let o=document.getElementById("phone-form");o.style.display="none";let r=document.querySelector(".w-form-done");r.style.display="block"}else{let o=document.getElementById("phone-form");o.style.display="none";let r=document.querySelector(".w-form-fail");r.style.display="block"}}h.forEach(function(e){let n="";e.idd.root&&(n+=e.idd.root,e.idd.suffixes[0]&&!T.includes(e.cca2)&&(n+=e.idd.suffixes[0]));let t={cca2:e.cca2,flag:e.flags.svg,prefix:n,name:e.name.common};l.push(t),a.cca2===t.cca2&&(a=t)}),S(l),H(l),p(a);let g=document.querySelector(".prefix-dropdown_toggle");g.setAttribute("tabindex","1"),document.querySelector(".text-field.w-input").setAttribute("tabindex","2"),g.addEventListener("click",function(){f()}),g.addEventListener("keydown",function(e){switch(e.key){case"ArrowDown":x("down",e);break;case"ArrowUp":x("up",e);break;case"Enter":L(e);break;case" ":L(e);break;case"Escape":m();break;case"Tab":m();break;default:A(e);break}}),document.querySelector(".button.w-button").addEventListener("click",function(e){e.preventDefault(),m(),this.value=this.getAttribute("data-wait"),C()})});})();
