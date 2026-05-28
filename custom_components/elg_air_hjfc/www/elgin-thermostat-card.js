// Elgin Thermostat Card — built artifact. Source: frontend/src/elgin-thermostat-card.ts
var wt=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var u=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ct(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&wt(t,e,r),r};var F=globalThis,V=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),nt=new WeakMap,k=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(e,t))}return t}toString(){return this.cssText}},at=i=>new k(typeof i=="string"?i:i+"",void 0,X),_=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new k(e,i,X)},ct=(i,t)=>{if(V)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=F.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Z=V?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return at(e)})(i):i;var{is:Pt,defineProperty:Rt,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:Mt,getOwnPropertySymbols:Ot,getPrototypeOf:kt}=Object,b=globalThis,lt=b.trustedTypes,Tt=lt?lt.emptyScript:"",Ht=b.reactiveElementPolyfillSupport,T=(i,t)=>i,H={toAttribute(i,t){switch(t){case Boolean:i=i?Tt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},G=(i,t)=>!Pt(i,t),ht={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:G};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),b.litPropertyMetadata??(b.litPropertyMetadata=new WeakMap);var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Rt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=Ut(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let c=r?.call(this);o?.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ht}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=kt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Mt(e),...Ot(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:H).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:H;this._$Em=r;let c=n.fromAttribute(e,o.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??(s=n.getPropertyOptions(t)),!((s.hasChanged??G)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,c=this[r];n!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[T("elementProperties")]=new Map,$[T("finalized")]=new Map,Ht?.({ReactiveElement:$}),(b.reactiveElementVersions??(b.reactiveElementVersions=[])).push("2.1.2");var D=globalThis,pt=i=>i,K=D.trustedTypes,dt=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,_t="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+A,Nt=`<${$t}>`,w=document,L=()=>w.createComment(""),j=i=>i===null||typeof i!="object"&&typeof i!="function",it=Array.isArray,Dt=i=>it(i)||typeof i?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,mt=/>/g,S=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,gt=/"/g,vt=/^(?:script|style|textarea|title)$/i,ot=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=ot(1),Zt=ot(2),Qt=ot(3),C=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),yt=new WeakMap,E=w.createTreeWalker(w,129);function bt(i,t){if(!it(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var Lt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=N;for(let c=0;c<e;c++){let a=i[c],h,d,l=-1,y=0;for(;y<a.length&&(n.lastIndex=y,d=n.exec(a),d!==null);)y=n.lastIndex,n===N?d[1]==="!--"?n=ut:d[1]!==void 0?n=mt:d[2]!==void 0?(vt.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=S):d[3]!==void 0&&(n=S):n===S?d[0]===">"?(n=r??N,l=-1):d[1]===void 0?l=-2:(l=n.lastIndex-d[2].length,h=d[1],n=d[3]===void 0?S:d[3]==='"'?gt:ft):n===gt||n===ft?n=S:n===ut||n===mt?n=N:(n=S,r=void 0);let v=n===S&&i[c+1].startsWith("/>")?" ":"";o+=n===N?a+Nt:l>=0?(s.push(h),a.slice(0,l)+_t+a.slice(l)+A+v):a+A+(l===-2?c:v)}return[bt(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},z=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,c=t.length-1,a=this.parts,[h,d]=Lt(t,e);if(this.el=i.createElement(h,s),E.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(r=E.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let l of r.getAttributeNames())if(l.endsWith(_t)){let y=d[n++],v=r.getAttribute(l).split(A),W=/([.?@])?(.*)/.exec(y);a.push({type:1,index:o,name:W[2],strings:v,ctor:W[1]==="."?tt:W[1]==="?"?et:W[1]==="@"?st:R}),r.removeAttribute(l)}else l.startsWith(A)&&(a.push({type:6,index:o}),r.removeAttribute(l));if(vt.test(r.tagName)){let l=r.textContent.split(A),y=l.length-1;if(y>0){r.textContent=K?K.emptyScript:"";for(let v=0;v<y;v++)r.append(l[v],L()),E.nextNode(),a.push({type:2,index:++o});r.append(l[y],L())}}}else if(r.nodeType===8)if(r.data===$t)a.push({type:2,index:o});else{let l=-1;for(;(l=r.data.indexOf(A,l+1))!==-1;)a.push({type:7,index:o}),l+=A.length-1}o++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function P(i,t,e=i,s){if(t===C)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=j(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=P(i,r._$AS(i,t.values),r,s)),t}var Y=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??w).importNode(e,!0);E.currentNode=r;let o=E.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new q(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new rt(o,this,t)),this._$AV.push(h),a=s[++c]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=w,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},q=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),j(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Dt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=z.createElement(bt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Y(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new z(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(L()),this.O(L()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=pt(t).nextSibling;pt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=P(this,t,e,0),n=!j(t)||t!==this._$AH&&t!==C,n&&(this._$AH=t);else{let c=t,a,h;for(t=o[0],a=0;a<o.length-1;a++)h=P(this,c[s+a],e,a),h===C&&(h=this._$AH[a]),n||(n=!j(h)||h!==this._$AH[a]),h===p?t=p:t!==p&&(t+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},et=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},st=class extends R{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??p)===C)return;let s=this._$AH,r=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var jt=D.litHtmlPolyfillSupport;jt?.(z,q),(D.litHtmlVersions??(D.litHtmlVersions=[])).push("3.3.3");var At=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new q(t.insertBefore(L(),o),o,void 0,e??{})}return r._$AI(i),r};var B=globalThis,m=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=At(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};m._$litElement$=!0,m.finalized=!0,B.litElementHydrateSupport?.({LitElement:m});var zt=B.litElementPolyfillSupport;zt?.({LitElement:m});(B.litElementVersions??(B.litElementVersions=[])).push("4.2.2");var x=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var qt={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:G},Bt=(i=qt,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i,!0,c)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(s==="setter"){let{name:n}=e;return function(c){let a=this[n];t.call(this,c),this.requestUpdate(n,a,i,!0,c)}}throw Error("Unsupported decorator location: "+s)};function g(i){return(t,e)=>typeof e=="object"?Bt(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function xt(i){return g({...i,state:!0,attribute:!1})}function St(i,t){let e=i.entities;if(!e)return;let s=e[t];if(s?.device_id){for(let[r,o]of Object.entries(e))if(o.device_id===s.device_id&&r.startsWith("switch.")&&r.endsWith("_scrdisp"))return r}}var Et=.5,U=class extends m{static get styles(){return _`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 10px;
        margin: 4px 0 8px;
      }
      .target {
        font-size: 36px;
        font-weight: 300;
        line-height: 1;
        color: var(--primary-text-color);
      }
      .target .unit {
        font-size: 0.5em;
        margin-left: 2px;
        color: var(--secondary-text-color);
      }
      .sep {
        color: var(--secondary-text-color);
        font-size: 0.8rem;
      }
      .current {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .step-row {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .step {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--divider-color);
        background: transparent;
        color: var(--primary-text-color);
        font-size: 16px;
        padding: 0;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.05s ease;
      }
      .step:hover {
        background: var(--secondary-background-color);
      }
      .step:active {
        transform: scale(0.94);
      }
    `}render(){return f`
      <div class="row">
        <div class="target">
          ${this.target!==void 0?this.target.toFixed(1):"\u2014"}<span
            class="unit"
            >°C</span
          >
        </div>
        <div class="sep">·</div>
        <div class="current">
          Atual:
          ${this.current!==void 0?`${this.current.toFixed(1)}\xB0C`:"\u2014"}
        </div>
      </div>
      <div class="step-row">
        <button
          class="step"
          @click=${()=>this._step(-Et)}
          aria-label="Diminuir temperatura"
        >
          −
        </button>
        <button
          class="step"
          @click=${()=>this._step(Et)}
          aria-label="Aumentar temperatura"
        >
          +
        </button>
      </div>
    `}_step(t){this.dispatchEvent(new CustomEvent("temperature-step",{detail:{delta:t},bubbles:!0,composed:!0}))}};u([g({type:Number})],U.prototype,"target",2),u([g({type:Number})],U.prototype,"current",2),U=u([x("elgin-temperature-dial")],U);var It={off:"Off",auto:"Auto",cool:"Cool",dry:"Dry",fan_only:"Fan"},M=class extends m{constructor(){super(...arguments);this.modes=[];this.current=""}static get styles(){return _`
      :host {
        display: block;
      }
      .modes {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .mode {
        padding: 4px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease,
          border-color 0.15s ease;
      }
      .mode:hover {
        background: var(--secondary-background-color);
      }
      .mode.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: transparent;
      }
    `}render(){return f`
      <div class="modes">
        ${this.modes.map(e=>f`
            <button
              class="mode ${e===this.current?"active":""}"
              @click=${()=>this._select(e)}
            >
              ${It[e]??e}
            </button>
          `)}
      </div>
    `}_select(e){this.dispatchEvent(new CustomEvent("hvac-mode-change",{detail:{mode:e},bubbles:!0,composed:!0}))}};u([g({type:Array})],M.prototype,"modes",2),u([g({type:String})],M.prototype,"current",2),M=u([x("elgin-hvac-mode-selector")],M);var I=class extends m{constructor(){super(...arguments);this.on=!1}static get styles(){return _`
      :host {
        display: inline-flex;
      }
      .wrap {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 4px 6px;
        border-radius: 18px;
        color: var(--primary-text-color);
        transition: background 0.15s ease;
      }
      .wrap:hover {
        background: var(--secondary-background-color);
      }
      .icon {
        display: inline-flex;
        align-items: center;
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        transition: color 0.15s ease;
      }
      .wrap.on .icon {
        color: var(--primary-color);
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 18px;
        border-radius: 9px;
        background: var(--disabled-color, #bbb);
        transition: background 0.15s ease;
        flex: 0 0 auto;
      }
      .knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        transition: left 0.15s ease;
      }
      .wrap.on .switch {
        background: var(--primary-color);
      }
      .wrap.on .knob {
        left: 16px;
      }
    `}render(){return f`
      <button
        class="wrap ${this.on?"on":""}"
        @click=${this._toggle}
        title="${this.on?"Desligar display":"Ligar display"}"
        aria-label="${this.on?"Desligar display":"Ligar display"}"
        aria-pressed=${this.on}
      >
        <span class="icon">
          <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        </span>
        <span class="switch">
          <span class="knob"></span>
        </span>
      </button>
    `}_toggle(){this.dispatchEvent(new CustomEvent("display-toggle",{bubbles:!0,composed:!0}))}};u([g({type:Boolean})],I.prototype,"on",2),I=u([x("elgin-display-toggle")],I);var Wt=17,Ft=32,O=class extends m{setConfig(t){if(!t?.entity)throw new Error("'entity' (a climate.* entity_id) is required");this._config=t}getCardSize(){return 4}static get styles(){return _`
      ha-card {
        padding: 14px 16px 12px;
        font-family: var(
          --mdc-typography-body1-font-family,
          var(--paper-font-body1_-_font-family, Roboto, sans-serif)
        );
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 6px;
      }
      .name {
        font-size: 1rem;
        font-weight: 500;
        color: var(--primary-text-color);
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .error {
        color: var(--error-color);
        padding: 16px;
      }
    `}render(){if(!this.hass||!this._config)return f``;let t=this.hass.states[this._config.entity];if(!t)return f`<ha-card
        ><div class="error">Entity not found: ${this._config.entity}</div></ha-card
      >`;let e=t.attributes.temperature,s=t.attributes.current_temperature,r=t.state,o=t.attributes.hvac_modes??[],n=this._config.name??t.attributes.friendly_name??"Ar-condicionado",c=this._config.display_entity??St(this.hass,this._config.entity),a=c?this.hass.states[c]?.state==="on":!1;return f`
      <ha-card>
        <div class="header">
          <div class="name">${n}</div>
          ${c?f`
                <elgin-display-toggle
                  .on=${a}
                  @display-toggle=${()=>this._toggleDisplay(c)}
                ></elgin-display-toggle>
              `:""}
        </div>
        <elgin-temperature-dial
          .target=${e}
          .current=${s}
          @temperature-step=${this._onTemperatureStep}
        ></elgin-temperature-dial>
        <elgin-hvac-mode-selector
          .modes=${o}
          .current=${r}
          @hvac-mode-change=${this._onHvacModeChange}
        ></elgin-hvac-mode-selector>
      </ha-card>
    `}_onTemperatureStep(t){let e=this.hass.states[this._config.entity],s=e.attributes.temperature??24,r=e.attributes.min_temp??Wt,o=e.attributes.max_temp??Ft,n=Math.max(r,Math.min(o,s+t.detail.delta));this.hass.callService("climate","set_temperature",{entity_id:this._config.entity,temperature:n})}_onHvacModeChange(t){this.hass.callService("climate","set_hvac_mode",{entity_id:this._config.entity,hvac_mode:t.detail.mode})}_toggleDisplay(t){this.hass.callService("switch","toggle",{entity_id:t})}};u([g({attribute:!1})],O.prototype,"hass",2),u([xt()],O.prototype,"_config",2),O=u([x("elgin-thermostat-card")],O);window.customCards=window.customCards||[];window.customCards.push({type:"elgin-thermostat-card",name:"Elgin Thermostat",description:"Termostato Elgin Air HJFC com toggle de display embutido"});export{O as ElginThermostatCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
