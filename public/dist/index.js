(()=>{var v=()=>{var l;let p="Last Published:";for(let c of document.childNodes)if(c.nodeType===Node.COMMENT_NODE&&((l=c.textContent)==null?void 0:l.includes(p))){let g=c.textContent.trim().split(p)[1];if(g)return new Date(g)}};var b=p=>{let l=v();console.log(`Hello ${p}!`),console.log(`This site was last published on ${l==null?void 0:l.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{b("Fabiano Alves");let l=[],c=1;async function g(){let e=await o(),n=["US","PR","RU","EH","KZ","VA","DO","SH"],t={cca2:navigator.language.split("-")[1],flag:"",prefix:"",name:""};async function o(){let i=await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags");if(i.ok)return i.json()}function m(){let i=!1;for(;!i;){i=!0;let s=0;l.forEach(function(){if(s>0&&l[s-1].cca2>l[s].cca2){let d=l[s];l[s]=l[s-1],l[s-1]=d,i=!1}s=s+1})}}function a(){let i=0,s=document.querySelector(".prefix-dropdown_list");s.firstElementChild&&s.removeChild(s.firstElementChild),l.forEach(d=>{let f=document.createElement("img");f.src=d.flag,f.setAttribute("data-element","flag"),f.setAttribute("loading","lazy"),f.setAttribute("alt",d.name),f.className="prefix-dropdown_flag";let E=document.createElement("div");E.setAttribute("data-element","value"),E.setAttribute("data-prefix",d.prefix),E.innerHTML=d.cca2;let u=document.createElement("a");u.setAttribute("data-element","item"),u.setAttribute("aria-role","option"),u.setAttribute("aria-selected","false"),u.setAttribute("aria-label",d.name),u.setAttribute("title",d.name),u.setAttribute("data-index",String(i)),u.setAttribute("id","div"+i),u.href="#",u.className="prefix-dropdown_item w-inline-block",u.addEventListener("click",function(A){H(A,this)}),u.appendChild(f),u.appendChild(E),s.appendChild(u),i=i+1})}e.forEach(function(i){let s="";i.idd.root&&(s+=i.idd.root,i.idd.suffixes[0]&&!n.includes(i.cca2)&&(s+=i.idd.suffixes[0]));let d={cca2:i.cca2,flag:i.flags.svg,prefix:s,name:i.name.common};l.push(d),t.cca2===d.cca2&&(t=d)}),m(),a(),w(t)}function S(){let e=document.querySelector(".w--current");if(e){if(e.offsetTop!==0){let r=document.querySelector(".prefix-dropdown_list");r.scrollTop=e.offsetTop-r.clientHeight/2.2}let n=e.getAttribute("data-index");c=parseInt(n)}}function L(){let e=document.querySelector(".prefix-dropdown_component");if(e.classList.contains("open"))y();else{e.classList.add("open");let n=document.querySelector(".prefix-dropdown_list-wrapper");n.style.transition="all 0.075s linear",n.style.display="block";let r=document.querySelector(".prefix-dropdown_chevron");r.style.transition="all 0.075s linear",r.style.transform="rotate(180deg)"}S()}function y(){let e=document.querySelector(".prefix-dropdown_component");if(e.classList.contains("open")){e.classList.remove("open");let n=document.querySelector(".prefix-dropdown_list-wrapper");n.style.transition="all 0.075s linear",n.style.display="none";let r=document.querySelector(".prefix-dropdown_chevron");r.style.transition="all 0.075s linear",r.style.transform="rotate(0deg)",document.querySelectorAll(".prefix-dropdown_item").forEach(function(t){t.classList.remove("arrowSelected")})}}function w(e){let n=document.querySelector("input[name=countryCode]");n.value=e.prefix;let r=document.querySelector(".prefix-dropdown_toggle"),t=r.childNodes[0];t.src=e.flag,t.alt=e.name+" Flag";let o=r.childNodes[2];o.innerHTML=e.prefix,document.querySelectorAll(".prefix-dropdown_item").forEach(a=>{a.title!==e.name?a.classList.remove("w--current"):(a.classList.add("w--current"),c=parseInt(a.getAttribute("data-index")))})}function H(e,n){e.preventDefault();let r=n.childNodes[1],t=n.childNodes[0],o={cca2:r.innerHTML,prefix:r.getAttribute("data-prefix"),flag:t.src,name:n.title};w(o),L()}function h(e){if(document.activeElement===document.querySelector(".prefix-dropdown_toggle")&&(e.preventDefault(),document.querySelector(".prefix-dropdown_component").classList.contains("open"))){let r=document.querySelector(".w--current"),t=document.getElementById("div"+c);if(r&&t&&r!==t){let o=t.childNodes[1],m=t.childNodes[0],a={cca2:o.innerHTML,flag:m.src,prefix:o.getAttribute("data-prefix"),name:t.getAttribute("title")};w(a)}}L()}function M(e){let n=e.key;if(document.querySelector(".prefix-dropdown_component").classList.contains("open")&&n.length===1&&n.match(/[a-z]/i)){let t=n.toUpperCase(),o=0,m=0,a=document.getElementById("div"+o);for(;a&&!m;){let i=a.childNodes[1];if(t===i.innerHTML.charAt(0)){c=o;let s=document.querySelector(".prefix-dropdown_list");s.scrollTop=a.offsetTop-s.clientHeight/2.2,document.querySelectorAll(".prefix-dropdown_item").forEach(function(d){d.classList.remove("arrowSelected")}),a.classList.add("arrowSelected"),m=1}o=o+1,a=document.getElementById("div"+o)}}}function T(e,n){if(document.querySelector(".prefix-dropdown_component").classList.contains("open"))if(n.preventDefault(),e==="up"){let t=document.getElementById("div"+(c-1));if(t){c=c-1,document.querySelectorAll(".prefix-dropdown_item").forEach(function(m){m.classList.remove("arrowSelected")});let o=document.querySelector(".prefix-dropdown_list");o.scrollTop=t.offsetTop-o.clientHeight/2.2,t.classList.add("arrowSelected")}}else{let t=document.getElementById("div"+(c+1));if(t){c=c+1,document.querySelectorAll(".prefix-dropdown_item").forEach(function(m){m.classList.remove("arrowSelected")});let o=document.querySelector(".prefix-dropdown_list");o.scrollTop=t.offsetTop-o.clientHeight/2.2,t.classList.add("arrowSelected")}}}await g();let x=document.querySelector(".prefix-dropdown_toggle");x.setAttribute("tabindex","1"),document.querySelector(".text-field.w-input").setAttribute("tabindex","2"),x.addEventListener("click",function(){L()}),x.addEventListener("keydown",function(e){switch(e.key){case"ArrowDown":T("down",e);break;case"ArrowUp":T("up",e);break;case"Enter":h(e);break;case" ":h(e);break;case"Escape":y();break;case"Tab":y();break;default:M(e);break}});async function D(){let e=document.querySelector('[name="phoneNumber"]'),n=document.querySelector('[name="countryCode"]');if((await fetch("https://webflow.com/api/v1/form/6273d3f75ac01db3e57995c8",{method:"POST",body:"fields[Phone Number]="+e.value+"&fields[countryCode]="+n.value+"&name=Phone Form&dolphin=false&teste=false&source=https://secondchancefinsweet.webflow.io/",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})).ok){let t=document.getElementById("phone-form");t.style.display="none";let o=document.querySelector(".w-form-done");o.style.display="block"}else{let t=document.getElementById("phone-form");t.style.display="none";let o=document.querySelector(".w-form-fail");o.style.display="block"}}document.querySelector(".button.w-button").addEventListener("click",function(e){e.preventDefault(),document.getElementById("phone-form").reportValidity()&&(y(),this.value=this.getAttribute("data-wait"),D())})});})();
