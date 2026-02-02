let t,e=!1;try{t=await import("lit")}catch{t=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm"),e=!0}const{LitElement:r,html:o,css:i,svg:s,nothing:a}=t;console.info(`[MMAB] v1.0.0 loaded (Lit: ${e?"CDN":"local"})`);const n={cs:{missing:"Chybí konfigurace – zadej entitu.",min:"Min",max:"Max",avg:"Průměr",thresholds:"Barevné rozsahy",thresholds_by:"podle",add:"Přidat",remove:"Odebrat",lt:"méně než",color:"barva",months:"Měsíce",weeks:"Týdny",preset:"Přednastavený styl",color_by:"Barva podle",color_by_max:"Maximum",color_by_average:"Průměr",color_by_min:"Minimum",use_trailing:"Posuvné období",trailing_periods:"Počet období"},en:{missing:"Missing config – provide an entity.",min:"Min",max:"Max",avg:"Avg",thresholds:"Color ranges",thresholds_by:"by",add:"Add",remove:"Remove",lt:"less than",color:"color",months:"Months",weeks:"Weeks",preset:"Style Preset",color_by:"Color by",color_by_max:"Maximum",color_by_average:"Average",color_by_min:"Minimum",use_trailing:"Trailing period",trailing_periods:"Number of periods"}},l={temperature:[{lt:-15,color:"#b968f4"},{lt:0,color:"#039be5"},{lt:20,color:"#43a047"},{lt:25,color:"#fdd835"},{lt:30,color:"#fb8c00"},{lt:999,color:"#e53935"}],temperature_f:[{lt:5,color:"#b968f4"},{lt:32,color:"#039be5"},{lt:68,color:"#43a047"},{lt:77,color:"#fdd835"},{lt:86,color:"#fb8c00"},{lt:999,color:"#e53935"}],beaufort:[{lt:1,color:"#2196F3"},{lt:5,color:"#64B5F6"},{lt:11,color:"#4DD0E1"},{lt:19,color:"#4CAF50"},{lt:28,color:"#8BC34A"},{lt:38,color:"#CDDC39"},{lt:49,color:"#FFEB3B"},{lt:61,color:"#FFC107"},{lt:74,color:"#FF9800"},{lt:88,color:"#FF5722"},{lt:102,color:"#F44336"},{lt:117,color:"#D32F2F"},{lt:999,color:"#B71C1C"}]},c=t=>String(t).padStart(2,"0"),h=(t,e,r)=>Math.min(r,Math.max(e,t)),d=t=>new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0),m=(t,e)=>{const r=new Date(t);return r.setTime(r.getTime()+3600*e*1e3),r},g=(t,e)=>{const r=new Date(t);return r.setDate(r.getDate()+e),r},u=(t,e)=>{const r=new Date(t);return r.setMonth(r.getMonth()+e),r},p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function b(t,e="eu"){return"intl"===e?`${t.getDate()}-${p[t.getMonth()]}`:`${t.getDate()}. ${t.getMonth()+1}.`}function _(t,e="eu"){return"intl"===e?`${t.getDate()}-${p[t.getMonth()]}-${t.getFullYear()}`:`${t.getDate()}. ${t.getMonth()+1}. ${t.getFullYear()}`}function f(t){return`${c(t.getHours())}:${c(t.getMinutes())}`}class y extends r{static get properties(){return{hass:{},_config:{},_data:{state:!0},_loading:{state:!0},_err:{state:!0},_hover:{state:!0},_size:{state:!0},_selection:{state:!0},_periodMode:{state:!0},__lastFetchKey:{state:!0}}}constructor(){super(),this._size={w:900,h:320},this._selection={startIso:"",endIso:"",wsPeriod:""},this._periodMode="month",this.__ro=null,this._energySubscription=null}static get styles(){return i`
      :host {
        display: block;
        color: var(--primary-text-color);
        --mmab-padding: 16px;
        --mmab-height: 320px;
        --mmab-grid: rgba(255, 255, 255, 0.1);
        --mmab-grid-strong: rgba(255, 255, 255, 0.2);
        --mmab-axis: var(--secondary-text-color);
        --mmab-fill-opacity: 0.3;
        --mmab-stroke-opacity: 1;
        --mmab-stroke-width: 2;
        --mmab-avg-stroke: #ffffff;
        --mmab-avg-shadow: rgba(0, 0, 0, 0.5);
        --mmab-bar-radius: 4;
        --mmab-font-tick: 11px;
        --mmab-font-x: 11px;
        --mmab-font-unit: 11px;
        --mmab-tooltip-bg: var(--card-background-color);
        --mmab-tooltip-border: var(--divider-color);
        --mmab-hover-line: var(--primary-color, #039be5); 
        --mdc-typography-font-family: var(--font-family, Roboto, sans-serif);
      }
      ha-card { height: 100%; display: flex; flex-direction: column; }
      .wrap { padding: var(--mmab-padding); flex: 1; box-sizing: border-box; }
      
      .head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 20px; }
      .title { font-weight: 500; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      
      .toggles { display: flex; background: rgba(120,120,120,0.2); border-radius: 16px; padding: 2px; }
      .toggle-btn { 
        padding: 4px 12px; 
        font-size: 12px; 
        font-weight: 500; 
        cursor: pointer; 
        border-radius: 14px; 
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
      }
      .toggle-btn.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }

      .chart { position: relative; height: var(--mmab-height); width: 100%; }
      
      svg { width: 100%; height: 100%; display: block; overflow: visible; }
      svg text, svg line, svg rect.barFill, svg rect.barStroke { pointer-events: none; }
      
      .tickText { fill: var(--mmab-axis); font-size: var(--mmab-font-tick); font-family: var(--mdc-typography-font-family); }
      .xText { fill: var(--mmab-axis); font-size: var(--mmab-font-x); font-family: var(--mdc-typography-font-family); }
      
      .gridH { stroke: var(--mmab-grid); stroke-width: 1px; shape-rendering: crispEdges; }
      .gridHStrong { stroke: var(--mmab-grid-strong); stroke-width: 1px; shape-rendering: crispEdges; }
      .gridV { stroke: var(--mmab-grid); stroke-width: 1px; shape-rendering: crispEdges; stroke-dasharray: 2 2; }
      
      .hoverLine {
        stroke: var(--mmab-hover-line);
        stroke-width: 1px;
        stroke-dasharray: 4 3;
        shape-rendering: crispEdges;
        opacity: 0.9;
      }

      .barFill { fill-opacity: var(--mmab-fill-opacity); transition: fill-opacity 0.2s; }
      .barStroke { stroke-opacity: var(--mmab-stroke-opacity); stroke-width: var(--mmab-stroke-width); }
      .barFill.active { fill-opacity: 0.5; } 
      
      .avgShadow { stroke: var(--mmab-avg-shadow); stroke-width: 3; opacity: 0.5; }
      .avgLine { stroke: var(--mmab-avg-stroke); stroke-width: 1.5; }
      
      .overlay { fill: transparent; cursor: crosshair; } 
      
      .yUnit { fill: var(--mmab-axis); font-size: var(--mmab-font-unit); font-weight: 500; }
      
      .tooltip {
        position: absolute;
        pointer-events: none;
        background: rgba(45, 45, 45, 0.95);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        border-radius: 4px;
        padding: 8px;
        min-width: 150px;
        transform: translate(-50%, -115%);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-size: 12px;
        z-index: 10;
      }
      .tt-title { font-weight: 500; margin-bottom: 4px; font-size: 13px; opacity: 0.9; }
      .tt-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 2px; }
      .tt-row .v { font-weight: 700; }
      .err { color: var(--error-color, #db4437); font-size: 14px; }
    `}static getStubConfig(){return{name:"Min/Max/Avg",entity:"sensor.temperature",height:320,decimals:1,y_padding_ratio:.08,show_x_labels:!0,show_y_labels:!0,show_y_unit:!0,thresholds:l.temperature,preset:"temperature",color_by:"max",listen_energy_date_selection:!0,default_ws_period:"day",use_trailing:!1,trailing_periods:null,debug:!1}}setConfig(t){if(!t||!t.entity)throw new Error("entity is required");if(this._config={...y.getStubConfig(),...t},!this._selection?.wsPeriod){const t=String(this._config.default_ws_period||"day").toLowerCase();this._selection={...this._selection||{},wsPeriod:["hour","day","week","month"].includes(t)?t:"day"}}this._data=null,this._err=null,this._loading=!1,this.__lastFetchKey="",this.hass&&this._subscribeToEnergy(),this._fetchStatsIfNeeded()}getCardSize(){return 4}_stateObj(t){return t?this.hass?.states?.[t]:null}_unit(t){return this._stateObj(t)?.attributes?.unit_of_measurement||""}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{const t=this.renderRoot?.querySelector(".chart");t&&!this.__ro&&(this.__ro=new ResizeObserver(t=>{const e=t?.[0]?.contentRect;if(!e)return;const r=Math.max(320,Math.round(e.width)),o=Math.max(240,Math.round(e.height));r===this._size.w&&o===this._size.h||(this._size={w:r,h:o})}),this.__ro.observe(t))}),this.hass&&this._subscribeToEnergy()}disconnectedCallback(){try{this.__ro?.disconnect()}catch{}this.__ro=null,this._energySubscription&&(this._energySubscription.then(t=>{"function"==typeof t&&t()}),this._energySubscription=null),super.disconnectedCallback()}updated(t){super.updated(t),(t.has("hass")||t.has("_config"))&&(this._subscribeToEnergy(),this._data||this._loading||this._fetchStatsIfNeeded())}async _subscribeToEnergy(){if(this.hass&&this._config?.listen_energy_date_selection&&!this._energySubscription)try{const t=(t=>{if(!t.connection)return null;if(t.connection._energy)return t.connection._energy;const e="_energy_minmax_subscription";return t.connection[e]||(t.connection[e]=t.connection.createCollection({key:"energy",fetch:t=>t.sendMessagePromise({type:"energy/get_prefs"}).catch(()=>null),subscribe:(t,e)=>t.subscribeMessage(e,{type:"energy/subscribe"}).catch(()=>null)})),t.connection[e]})(this.hass);if(!t)return;this._config.debug&&console.info("[MMAB] Subscribing to Energy Collection..."),this._energySubscription=t.subscribe(t=>this._handleEnergyChange(t))}catch(t){console.warn("[MMAB] Failed to subscribe:",t)}}_handleEnergyChange(t){if(!t)return;this._config.debug&&console.info("[MMAB] Energy Collection changed:",t);let e=null,r=null;if(t.start&&(e=t.start instanceof Date?t.start.toISOString():String(t.start)),t.end&&(r=t.end instanceof Date?t.end.toISOString():String(t.end)),!e||!r)return;const o=new Date(e),i=(new Date(r)-o)/36e5;let s="day";s=i<=48?"hour":i<=840?"day":"month";const a={startIso:e,endIso:r,wsPeriod:s};a.startIso===(this._selection?.startIso||"")&&a.endIso===(this._selection?.endIso||"")&&a.wsPeriod===(this._selection?.wsPeriod||"")||(this._selection=a,this.__lastFetchKey="",this._fetchStatsIfNeeded(),this.requestUpdate())}_setPeriodMode(t){this._periodMode!==t&&(this._periodMode=t,this.__lastFetchKey="",this._fetchStatsIfNeeded())}_generateTimeline(t,e,r,o){const i=[];let s=new Date(t);const a=new Date(e),n=[...o].sort((t,e)=>t.start-e.start);let l=0,c=0;for(;s<a&&c<1e3;){let t;c++,t="hour"===r?m(s,1):"month"===r?u(s,1):g(s,"week"===r?7:1);let e=null;for(;l<n.length&&n[l].start<s;)l++;if(l<n.length){const r=n[l];r.start<t&&(e=r,l++)}e?i.push({...e,start:new Date(s),isEmpty:!1}):i.push({start:new Date(s),min:null,max:null,mean:null,isEmpty:!0}),s=t}return i}async _fetchStatsIfNeeded(){const t=this._config||{},e=t.entity;if(!this.hass||!e)return;let r=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase(),o=r;"month"===r&&(o="week"===this._periodMode?"week":"month"),["hour","day","week","month"].includes(o)||(o="day");let i=String(this._selection?.startIso||""),s=String(this._selection?.endIso||"");const a=!0===t.use_trailing;if(a||!i||!s){const e=new Date;let r,n;if(a){const a={hour:24,day:7,week:4,month:12},l=Number(t.trailing_periods)||a[o]||7;if("hour"===o)n=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),0,0,0),r=m(n,-l);else if("month"===o)n=new Date(e.getFullYear(),e.getMonth(),1),r=u(n,-l);else if("week"===o){const t=e.getDay();n=d(g(e,-(0===t?6:t-1))),r=g(n,7*-l)}else n=d(e),r=g(n,-l);n=e,i=r.toISOString(),s=n.toISOString()}else r=new Date(e.getFullYear(),e.getMonth(),1),i=r.toISOString(),s=new Date(e.getFullYear(),e.getMonth()+1,1).toISOString()}const n=`${e}|${o}|${i}|${s}`;if(!(this.__lastFetchKey===n&&Array.isArray(this._data)&&this._data.length>0)){this.__lastFetchKey=n,this._loading=!0,this._err=null;try{t.debug&&console.info(`[MMAB] Fetching ${o} for ${i} -> ${s}`);const r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:i,end_time:s,statistic_ids:[e],period:o,types:["mean","min","max"]}),a=(r?.[e]||[]).map(t=>({start:new Date(t.start),min:isFinite(t.min)?Number(t.min):null,max:isFinite(t.max)?Number(t.max):null,mean:isFinite(t.mean)?Number(t.mean):null,isEmpty:!1})).filter(t=>t.start instanceof Date&&!isNaN(t.start));let n=new Date(i);const l=this._generateTimeline(n,s,o,a);this._data=l,this._loading=!1,this.requestUpdate()}catch(t){this._loading=!1,this._err=String(t?.message||t),console.warn("[MMAB] fetch error",t),this.requestUpdate()}}}_computePlotGeometry(t,e){const r=Math.max(10,t-40-10),o=Math.max(10,e-10-30),i=Math.max(1,(this._data||[]).length),s=r/i;let a=.65;i>40&&(a=.8);const n=Math.max(1,s*a);return{x0:40,y0:10,plotW:r,plotH:o,n:i,barStep:s,barW:n,barXPad:(s-n)/2}}_onMove(t,e){if(!e||!Array.isArray(this._data)||!this._data.length)return;const r=t.clientX-e.left,o=t.clientY-e.top,i=Math.max(500,this._size?.w||e.width),s=r*(i/e.width),a=this._computePlotGeometry(i,Math.max(240,this._size?.h||e.height)),{x0:n,plotW:l,n:c,barStep:d}=a;if(s<n||s>n+l)return void(this._hover=null);const m=h(Math.floor((s-n)/d),0,c-1);this._hover={idx:m,px:r,py:o}}_onLeave(){this._hover=null}render(){const t=this._config||{},e=(t.language||"cs").toLowerCase(),r=(t.date_format||"eu").toLowerCase(),i=n[e]||n.cs;if(!t.entity)return o`<ha-card><div class="wrap"><div class="err">${i.missing}</div></div></ha-card>`;const d=this._stateObj(t.entity),p=this._unit(t.entity),y=t.name||(d?.attributes?.friendly_name??t.entity),x=Number(t.height||320),v=Number.isFinite(Number(t.decimals))?Number(t.decimals):1,w=Array.isArray(this._data)?this._data:[],$=String(this._selection?.wsPeriod||t.default_ws_period||"day").toLowerCase();let M=$;"month"===$&&(M="week"===this._periodMode?"week":"month");const k="month"===$;let S=1/0,F=-1/0,D=!1;for(const t of w)!t.isEmpty&&isFinite(t.min)&&isFinite(t.max)&&(S=Math.min(S,t.min),F=Math.max(F,t.max),D=!0);D||(S=0,F=1);const C=Number(t.y_padding_ratio??.08),E=F-S||1;S-=E*C,F+=E*C;const T=Math.max(500,this._size?.w||900),A=Math.max(240,this._size?.h||320),N=this._computePlotGeometry(T,A),{x0:I,y0:P,plotW:z,plotH:B,n:L,barStep:O,barW:H,barXPad:Y}=N,j=function(t,e,r=6){if(!isFinite(t)||!isFinite(e)||t===e){const e=isFinite(t)?t:0;return{min:e-1,max:e+1,step:1,ticks:[e-1,e,e+1]}}const o=(e-t)/Math.max(1,r-1),i=Math.pow(10,Math.floor(Math.log10(o))),s=o/i;let a;a=s>=7.5?10*i:s>=3.5?5*i:s>=1.5?2*i:1*i;const n=Math.floor(t/a)*a,l=Math.ceil(e/a)*a,c=[];for(let t=n;t<=l+.5*a;t+=a)c.push(t);return{min:n,max:l,step:a,ticks:c}}(S,F,h(Math.round(B/50)+1,4,8)),W=t=>P+(j.max-t)*(B/(j.max-j.min)),R=(()=>{const t=j.step;return isFinite(t)?Math.abs(t-Math.round(t))<1e-9?0:t>=.5?1:Math.min(3,v):v})(),K=!1!==t.show_x_labels,q=!1!==t.show_y_labels,U=!1!==t.show_y_unit,J="hour"===M||"day"===M?4:"month"===M?1:"week"===M?L>20?4:1:4,G=this._hover,X=G&&w[G.idx]?w[G.idx]:null,V=X&&!X.isEmpty,Q=V?function(t,e,r){const o=t[e];if(!o?.start)return null;if(e<t.length-1&&t[e+1]?.start)return t[e+1].start;const i=o.start;return"hour"===r?m(i,1):"day"===r?g(i,1):"week"===r?g(i,7):"month"===r?u(i,1):g(i,1)}(w,G.idx,M):null,Z=V?function(t,e,r,o="eu",i="en"){if(!t)return"";if(!e)return _(t,o);if("hour"===r)return t.toDateString()===e.toDateString()?`${b(t,o)} ${f(t)}–${f(e)}`:`${_(t,o)} ${f(t)} – ${_(e,o)} ${f(e)}`;if("day"===r)return _(t,o);if("month"===r)try{return new Intl.DateTimeFormat(i,{month:"long",year:"numeric"}).format(t)}catch{return _(t,o)}return t.toDateString()===e.toDateString()?_(t,o):`${b(t,o)}–${b(e,o)}`}(X.start,Q,M,r,e):"",tt=t=>isFinite(t)?Number(t).toFixed(v):"–",et=Array.isArray(t.thresholds)?t.thresholds:l.temperature,rt=["max","average","min"].includes(t.color_by)?t.color_by:"max";return o`
      <ha-card>
        <div class="wrap" style="--mmab-height:${x}px;">
          <div class="head">
            <div class="title" title="${y}">${y}</div>
            
            ${k?o`
              <div class="toggles">
                <div class="toggle-btn ${"month"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("month")}>${i.months}</div>
                <div class="toggle-btn ${"week"===this._periodMode?"active":""}" 
                     @click=${()=>this._setPeriodMode("week")}>${i.weeks}</div>
              </div>
            `:o`<div></div>`}
          </div>
          
          ${this._err?o`<div class="err">${this._err}</div>`:a}
          
          <div class="chart"
               @mousemove=${t=>this._onMove(t,t.currentTarget.getBoundingClientRect())}
               @mouseleave=${()=>this._onLeave()}>
            <svg viewBox="0 0 ${T} ${A}" role="img" aria-label="Min max avg bar chart">
              ${U&&p?s`<text class="yUnit" x="${I-5}" y="${P-6}" text-anchor="end">${p}</text>`:a}
              
              ${j.ticks.map((t,e)=>{const r=W(t),o=0===e||e===j.ticks.length-1;return s`
                  <line class="${o?"gridHStrong":"gridH"}" x1="${I}" y1="${r}" x2="${I+z}" y2="${r}"></line>
                  ${q?s`<text class="tickText" x="${I-8}" y="${r+4}" text-anchor="end">${Number(t).toFixed(R)}</text>`:a}
                `})}
              ${(()=>{const t=[];for(let e=0;e<=L;e++)if(e%J===0){const r=I+e*O+O/2;t.push(s`<line class="gridV" x1="${r}" y1="${P}" x2="${r}" y2="${P+B}"></line>`)}return t})()}
              
              ${w.map((e,r)=>{if(e.isEmpty)return a;const o=isFinite(e.min)?e.min:null,i=isFinite(e.max)?e.max:null,n=isFinite(e.mean)?e.mean:null;if(null==o||null==i)return a;const c=I+r*O+Y,h=function(t,e){if(!isFinite(t))return"var(--disabled-text-color)";const r=(Array.isArray(e)&&e.length?e:l.temperature).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt);for(const e of r)if(t<e.lt)return e.color;return r.length?r[r.length-1].color:"var(--primary-color)"}("min"===rt?o:"average"===rt?n??i:i,et),d=W(i),m=W(o),g=Math.max(2,m-d),u=Number(t.bar_radius??4),p=null==n?null:W(n),b=G&&G.idx===r;return s`
                  <rect class="barFill ${b?"active":""}" x="${c}" y="${d}" width="${H}" height="${g}" fill="${h}" rx="${u}" ry="${u}"></rect>
                  <rect class="barStroke" x="${c}" y="${d}" width="${H}" height="${g}" fill="none" stroke="${h}" rx="${u}" ry="${u}"></rect>
                  ${null==p?a:s`
                    <line class="avgShadow" x1="${c+2}" y1="${p}" x2="${c+H-2}" y2="${p}"></line>
                    <line class="avgLine" x1="${c+2}" y1="${p}" x2="${c+H-2}" y2="${p}"></line>
                  `}
                `})}

              ${K?w.map((t,o)=>{if(o%J!==0)return a;return s`<text class="xText" x="${I+o*O+O/2}" y="${P+B+16}" text-anchor="middle">${function(t,e,r,o="cs",i="eu"){if(!t)return"";if("month"===e){const e=0===r||0===t.getMonth();try{return e?new Intl.DateTimeFormat(o,{month:"long",year:"numeric"}).format(t):new Intl.DateTimeFormat(o,{month:"long"}).format(t)}catch(e){return`${c(t.getMonth()+1)}/${String(t.getFullYear()).slice(-2)}`}}return"hour"===e?`${c(t.getHours())}:00`:b(t,i)}(t.start,M,o,e,r)}</text>`}):a}
              
              ${G?(()=>{const t=I+G.idx*O+O/2;return s`<line class="hoverLine" x1="${t}" y1="${P}" x2="${t}" y2="${P+B}"></line>`})():a}

              <rect class="overlay" x="${I}" y="${P}" width="${z}" height="${B}"></rect>
            </svg>

            ${V?o`
              <div class="tooltip" style="left:${G.px}px; top:${G.py}px">
                <div class="tt-title">${Z}</div>
                <div class="tt-row"><span class="k">${i.max}</span><span class="v">${tt(X.max)}${p?` ${p}`:""}</span></div>
                <div class="tt-row"><span class="k">${i.avg}</span><span class="v">${tt(X.mean)}${p?` ${p}`:""}</span></div>
                <div class="tt-row"><span class="k">${i.min}</span><span class="v">${tt(X.min)}${p?` ${p}`:""}</span></div>
              </div>
            `:a}
          </div>
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("minmax-avg-bar-card-editor")}}customElements.define("minmax-avg-bar-card-editor",class extends r{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config={...t||{}},Array.isArray(this._config.thresholds)||(this._config.thresholds=l.temperature),void 0===this._config.listen_energy_date_selection&&(this._config.listen_energy_date_selection=!0)}_valueChanged(t){t.stopPropagation();let e=t.detail.value;const r=this._config?.preset,o=e?.preset;if(o&&o!==r){const t=l[o]||l.temperature;e={...e,thresholds:t.map(t=>({...t}))}}this._config=e,x(this,"config-changed",{config:e})}_setThresholds(t){const e=(t||[]).map(t=>({lt:Number(t.lt),color:String(t.color??"")})).filter(t=>isFinite(t.lt)&&t.color).sort((t,e)=>t.lt-e.lt),r={...this._config||{}};r.thresholds=e.length?e:l.temperature,this._config=r,x(this,"config-changed",{config:r})}_updateThreshold(t,e){const r=(this._config.thresholds||[]).map(t=>({...t}));r[t]={...r[t]||{},...e||{}},this._setThresholds(r)}_addThreshold(){const t=(this._config.thresholds||[]).map(t=>({...t}));t.push({lt:(Number(t[t.length-1]?.lt)||0)+10,color:"#ffffff"}),this._setThresholds(t)}_removeThreshold(t){const e=(this._config.thresholds||[]).map(t=>({...t}));e.splice(t,1),this._setThresholds(e.length?e:l.temperature)}static get styles(){return i`:host { display:block; padding: 8px 0; } .section { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; } .th-head { display:flex; align-items:center; justify-content: space-between; margin-bottom: 8px; } .th-title { font-weight: 600; } .rows { display:flex; flex-direction: column; gap: 10px; } .row { display:grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: center; } .colorwrap { display:flex; align-items:center; gap: 10px; } .colorbox { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.16); } input[type="color"] { width: 46px; height: 34px; padding: 0; border: none; background: transparent; }`}get _schema(){return[{name:"name",selector:{text:{}}},{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"height",selector:{number:{min:240,max:600,step:10,mode:"box"}}},{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"temperature",label:"Temperature (C)"},{value:"temperature_f",label:"Temperature (F)"},{value:"beaufort",label:"Wind (Beaufort)"}]}}},{name:"color_by",selector:{select:{mode:"dropdown",options:[{value:"max",label:"Maximum"},{value:"average",label:"Average"},{value:"min",label:"Minimum"}]}}},{name:"decimals",selector:{number:{min:0,max:3,step:1,mode:"box"}}},{name:"y_padding_ratio",selector:{number:{min:0,max:.25,step:.01,mode:"box"}}},{name:"date_format",selector:{select:{mode:"dropdown",options:[{value:"eu",label:"European (26. 1.)"},{value:"intl",label:"International (26-Jan)"}]}}},{name:"show_x_labels",selector:{boolean:{}}},{name:"show_y_labels",selector:{boolean:{}}},{name:"show_y_unit",selector:{boolean:{}}},{name:"listen_energy_date_selection",selector:{boolean:{}}},{name:"default_ws_period",selector:{select:{mode:"dropdown",options:[{value:"hour",label:"hourly bins"},{value:"day",label:"daily bins"},{value:"week",label:"weekly bins"},{value:"month",label:"monthly bins"}]}}},{name:"use_trailing",selector:{boolean:{}}},{name:"trailing_periods",selector:{number:{min:1,max:365,step:1,mode:"box"}}},{name:"debug",selector:{boolean:{}}}]}render(){if(!this.hass||!this._config)return a;const t=n[this._config.language||"cs"]||n.cs,e=this._config.thresholds||l.temperature,r=!!customElements.get("ha-color-picker"),i=this._config.color_by||"max",s="min"===i?t.color_by_min:"average"===i?t.color_by_average:t.color_by_max;return o`
        <ha-form .hass=${this.hass} .data=${this._config} .schema=${this._schema} @value-changed=${this._valueChanged}></ha-form>
        <div class="section">
            <div class="th-head"><div class="th-title">${t.thresholds} (${t.thresholds_by} ${s})</div><mwc-button @click=${()=>this._addThreshold()}>${t.add}</mwc-button></div>
            <div class="rows">
                ${e.map((e,i)=>{const s=e.color||"",a=function(t,e){try{const r=document.createElement("span");r.style.position="absolute",r.style.left="-9999px",r.style.top="-9999px",r.style.opacity="0",r.style.color=String(t||""),(e?.shadowRoot||document.body).appendChild(r);const o=getComputedStyle(r).color;r.remove();const i=o.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!i)return"";const s=t=>String(t.toString(16)).padStart(2,"0");return`#${s(Number(i[1]))}${s(Number(i[2]))}${s(Number(i[3]))}`}catch{return""}}(s,this)||"#3f51b5";return o`
                        <div class="row">
                            <ha-textfield label="${t.lt}" type="number" .value=${String(e.lt)} @change=${t=>this._updateThreshold(i,{lt:Number(t.target.value)})}></ha-textfield>
                            <div class="colorwrap">
                                <div class="colorbox" style="background:${s};"></div>
                                ${r?o`<ha-color-picker .value=${a} @value-changed=${t=>this._updateThreshold(i,{color:t.detail?.value||a})}></ha-color-picker>`:o`<input type="color" .value=${a} @input=${t=>this._updateThreshold(i,{color:t.target.value})} />`}
                                <ha-textfield label="${t.color}" .value=${s} @change=${t=>this._updateThreshold(i,{color:t.target.value})}></ha-textfield>
                            </div>
                            <ha-icon-button icon="mdi:delete" @click=${()=>this._removeThreshold(i)}></ha-icon-button>
                        </div>`})}
            </div>
        </div>`}});const x=(t,e,r={},o={})=>{const i=new Event(e,{bubbles:o?.bubbles??!0,cancelable:o?.cancelable??!1,composed:o?.composed??!0});return i.detail=r,t.dispatchEvent(i),i};window.customCards=window.customCards||[],window.customCards.push({type:"minmax-avg-bar-card",name:"Min/Max/Avg Bar Card (Energy-style)",preview:!0,description:"Matches HA Energy Dashboard look."}),customElements.get("minmax-avg-bar-card")||customElements.define("minmax-avg-bar-card",y);