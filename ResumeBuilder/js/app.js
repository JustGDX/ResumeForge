(function(){
'use strict';

const S = {
    personal: {fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',github:'',photo:null,photoShape:'circle'},
    declaration: {enabled:true,text:'I hereby declare that all information in this curriculum vitae is true and correct to the best of my knowledge and belief.',place:'',signature:null,sigSize:100},
    sections: [],
    settings: {
        layout:'classic',
        accentColor:'#2563eb',
        fontColor:'#1f2937',
        fonts:{header:'Inter',sectionTitle:'Inter',body:'Inter',contact:'Inter',skills:'Inter',declaration:'Inter'},
        fontSizes:{header:'medium',sectionTitle:'medium',body:'medium'},
        fontColors:{header:null,sectionTitle:null,body:null,contact:null,skills:null,declaration:null},
        spacing:'normal',
        theme:'light'
    },
    badge: {target:null,temp:null}
};

let idc = 0;
const uid = () => `u${++idc}_${Date.now()}`;
const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
const esc = t => { if(!t) return ''; const d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
const show = e => e && e.classList.add('show');
const hide = e => e && e.classList.remove('show');

function toast(msg, type='inf') {
    const c = $('#toastBox');
    if (!c) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const ic = {ok:'fa-check-circle',err:'fa-exclamation-circle',inf:'fa-info-circle'};
    el.innerHTML = `<i class="fas ${ic[type]}"></i><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(()=>el.remove(), 3000);
}

function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return`${(n>>16)&255},${(n>>8)&255},${n&255}`}
function darken(h,p){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);r=Math.max(0,(r*(1-p))|0);g=Math.max(0,(g*(1-p))|0);b=Math.max(0,(b*(1-p))|0);return'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}
function lighten(h,p){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);r=Math.min(255,(r+(255-r)*p)|0);g=Math.min(255,(g+(255-g)*p)|0);b=Math.min(255,(b+(255-b)*p)|0);return'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}

const CFG = {
    summary:{i:'fa-align-left',t:'Summary',single:1,fields:[{k:'text',l:'Summary',ty:'ta',ph:'Professional summary...',f:1}]},
    experience:{i:'fa-briefcase',t:'Experience',fields:[{k:'title',l:'Title',ty:'t',ph:'Software Engineer'},{k:'company',l:'Company',ty:'t',ph:'Google'},{k:'startDate',l:'Start',ty:'t',ph:'Jan 2020'},{k:'endDate',l:'End',ty:'t',ph:'Present'},{k:'location',l:'Location',ty:'t',ph:'Mountain View',f:1},{k:'description',l:'Description',ty:'ta',ph:'• Led team\n• Built features',f:1}]},
    education:{i:'fa-graduation-cap',t:'Education',fields:[{k:'degree',l:'Degree',ty:'t',ph:'B.S. CS'},{k:'school',l:'School',ty:'t',ph:'MIT'},{k:'startDate',l:'Start',ty:'t',ph:'2016'},{k:'endDate',l:'End',ty:'t',ph:'2020'},{k:'description',l:'Details',ty:'ta',ph:'GPA, honors...',f:1}]},
    skills:{i:'fa-tools',t:'Skills',tag:1},
    certifications:{i:'fa-certificate',t:'Certifications',bdg:1,fields:[{k:'name',l:'Name',ty:'t',ph:'AWS Certified'},{k:'issuer',l:'Issuer',ty:'t',ph:'Amazon'},{k:'date',l:'Date',ty:'t',ph:'2023'},{k:'credentialId',l:'ID',ty:'t',ph:'ABC-123'}]},
    projects:{i:'fa-rocket',t:'Projects',fields:[{k:'name',l:'Project',ty:'t',ph:'App'},{k:'tech',l:'Tech',ty:'t',ph:'React, Node.js'},{k:'url',l:'URL',ty:'t',ph:'https://...',f:1},{k:'description',l:'Description',ty:'ta',ph:'Built...',f:1}]},
    languages:{i:'fa-globe-americas',t:'Languages',fields:[{k:'language',l:'Language',ty:'t',ph:'English'},{k:'level',l:'Level',ty:'s',opts:['Native','Fluent','Advanced','Intermediate','Beginner']}]},
    awards:{i:'fa-trophy',t:'Awards',fields:[{k:'title',l:'Award',ty:'t',ph:'Best Employee'},{k:'issuer',l:'By',ty:'t',ph:'Google'},{k:'date',l:'Date',ty:'t',ph:'2023'},{k:'description',l:'Description',ty:'ta',ph:'For...',f:1}]},
    volunteer:{i:'fa-hands-helping',t:'Volunteering',fields:[{k:'role',l:'Role',ty:'t',ph:'Tutor'},{k:'organization',l:'Org',ty:'t',ph:'Code.org'},{k:'startDate',l:'Start',ty:'t',ph:'2021'},{k:'endDate',l:'End',ty:'t',ph:'Present'},{k:'description',l:'Description',ty:'ta',ph:'Taught...',f:1}]},
    interests:{i:'fa-heart',t:'Interests',tag:1},
    references:{i:'fa-user-check',t:'References',fields:[{k:'name',l:'Name',ty:'t',ph:'Jane Smith'},{k:'title',l:'Title',ty:'t',ph:'Manager'},{k:'company',l:'Company',ty:'t',ph:'Google'},{k:'contact',l:'Contact',ty:'t',ph:'jane@google.com',f:1}]},
    custom:{i:'fa-puzzle-piece',t:'Custom',fields:[{k:'title',l:'Title',ty:'t',ph:'Title'},{k:'subtitle',l:'Subtitle',ty:'t',ph:'Sub'},{k:'date',l:'Date',ty:'t',ph:'Date'},{k:'description',l:'Description',ty:'ta',ph:'...',f:1}]}
};

const secCont = () => $('#secCont');
const rContent = () => $('#rContent');
const rPage = () => $('#rPage');

function init() {
    try {
        setTimeout(() => {
            const l = $('#loaderScr');
            if (l) l.classList.add('hidden');
        }, 900);
        const overlay = $('#layoutChooser');
        if (overlay) overlay.classList.remove('hidden');
        bindLayoutChooser();
        bindPersonal();
        bindDeclaration();
        bindPhoto();
        bindPhotoShape();
        bindSignature();
        bindTheme();
        bindHexPicker();
        bindFontPanel();
        bindDropdown();
        bindModals();
        bindHeader();
        bindZoom();
        bindCollapse();
        bindResponsive();
        bindDarkMode();
        bindEditorClicks();
        applyAccent();
        applyPhotoShape();
        render();
    } catch(e) {
        console.error('Init error:', e);
        const l = $('#loaderScr');
        if (l) l.classList.add('hidden');
    }
}

function bindLayoutChooser() {
    const overlay = $('#layoutChooser');
    if (!overlay) return;
    $$('.lc-card').forEach(c => {
        c.addEventListener('click', () => {
            $$('.lc-card').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
            S.settings.layout = c.dataset.layout;
            $$('.lpk').forEach(b => b.classList.toggle('active', b.dataset.layout === S.settings.layout));
            render();
        });
    });
    $('#lcConfirm').addEventListener('click', () => {
        overlay.classList.add('hidden');
        render();
        toast('Layout: ' + S.settings.layout.charAt(0).toUpperCase() + S.settings.layout.slice(1) + ' selected', 'ok');
    });
}

function bindPersonal() {
    $$('[data-p]').forEach(el => el.addEventListener('input', () => {
        S.personal[el.dataset.p] = el.value;
        render();
    }));
}

function bindDeclaration() {
    $('#declText').addEventListener('input', function(){S.declaration.text=this.value;render()});
    $('#declPlace').addEventListener('input', function(){S.declaration.place=this.value;render()});
    $('#declOn').addEventListener('change', function(){S.declaration.enabled=this.checked;render()});
    $('#sigSize').addEventListener('input', function(){
        S.declaration.sigSize=parseInt(this.value);
        $('#sigSizeVal').textContent=this.value;
        render();
    });
}

function bindPhoto() {
    const z=$('#pZone'),i=$('#pInput'),e=$('#pE'),f=$('#pF'),img=$('#pImg'),d=$('#pDel');
    z.addEventListener('click',ev=>{if(!ev.target.closest('.pzbt-del'))i.click()});
    z.addEventListener('dragover',ev=>ev.preventDefault());
    z.addEventListener('drop',ev=>{ev.preventDefault();const fl=ev.dataTransfer.files[0];if(fl&&fl.type.startsWith('image/'))lp(fl)});
    i.addEventListener('change',ev=>{if(ev.target.files[0])lp(ev.target.files[0])});
    d.addEventListener('click',ev=>{ev.stopPropagation();S.personal.photo=null;i.value='';e.style.display='';f.style.display='none';z.style.borderStyle='dashed';render()});
    function lp(fl){const r=new FileReader();r.onload=ev=>{S.personal.photo=ev.target.result;img.src=ev.target.result;e.style.display='none';f.style.display='';z.style.borderStyle='solid';render()};r.readAsDataURL(fl)}
}

function bindPhotoShape() {
    $$('.shape-btn').forEach(b=>{
        b.addEventListener('click',()=>{
            $$('.shape-btn').forEach(x=>x.classList.remove('active'));
            b.classList.add('active');
            S.personal.photoShape=b.dataset.shape;
            applyPhotoShape();
            render();
        });
    });
}

function applyPhotoShape() {
    const shape=S.personal.photoShape||'circle';
    const map={circle:'50%',rounded:'12px',square:'0',hex:'0'};
    const clipMap={circle:'none',rounded:'none',square:'none',hex:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'};
    document.documentElement.style.setProperty('--photo-shape',map[shape]);
    document.documentElement.style.setProperty('--photo-clip',clipMap[shape]);
}

function bindSignature() {
    const z=$('#sigZone'),i=$('#sigIn'),e=$('#sigE'),f=$('#sigF'),img=$('#sigImg'),sb=$('#sigSizeBox');
    z.addEventListener('click',ev=>{if(!ev.target.closest('#sigRm')&&!ev.target.closest('#sigChg'))i.click()});
    z.addEventListener('dragover',ev=>ev.preventDefault());
    z.addEventListener('drop',ev=>{ev.preventDefault();const fl=ev.dataTransfer.files[0];if(fl&&fl.type.startsWith('image/'))ls(fl)});
    i.addEventListener('change',ev=>{if(ev.target.files[0])ls(ev.target.files[0])});
    $('#sigChg').addEventListener('click',ev=>{ev.stopPropagation();i.click()});
    $('#sigRm').addEventListener('click',ev=>{ev.stopPropagation();S.declaration.signature=null;i.value='';e.style.display='';f.style.display='none';sb.style.display='none';z.style.borderStyle='dashed';render()});
    function ls(fl){const r=new FileReader();r.onload=ev=>{S.declaration.signature=ev.target.result;img.src=ev.target.result;e.style.display='none';f.style.display='';sb.style.display='';z.style.borderStyle='solid';render()};r.readAsDataURL(fl)}
}

function bindDarkMode() {
    function set(t){S.settings.theme=t;document.documentElement.dataset.theme=t;const i=$('#themeIcon');if(i)i.className=t==='dark'?'fas fa-sun':'fas fa-moon'}
    $('#themeToggle').addEventListener('click',()=>set(S.settings.theme==='dark'?'light':'dark'));
    const m=$('#themeToggleM');
    if(m)m.addEventListener('click',()=>set(S.settings.theme==='dark'?'light':'dark'));
}

function bindTheme() {
    $$('.lpk').forEach(b=>b.addEventListener('click',()=>{
        $$('.lpk').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        S.settings.layout=b.dataset.layout;
        $$('.lc-card').forEach(c=>c.classList.toggle('active',c.dataset.layout===b.dataset.layout));
        render();
    }));
    // Only accent color swatches now (font colors are handled in Font Settings panel)
    $$('.sw:not(.fc)').forEach(b=>b.addEventListener('click',()=>{
        $$('.sw:not(.fc)').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        S.settings.accentColor=b.dataset.lc;
        applyAccent();
        render();
    }));
    $('#spSel').addEventListener('change',function(){S.settings.spacing=this.value;render()});
}

function applyAccent() {
    const a=S.settings.accentColor;
    const s=document.documentElement.style;
    s.setProperty('--ac',a);
    s.setProperty('--acd',darken(a,.15));
    s.setProperty('--acl',lighten(a,.8));
    s.setProperty('--acll',lighten(a,.92));
    s.setProperty('--acr',hexToRgb(a));
    // Keep --fc as internal default for fallback
    s.setProperty('--fc', S.settings.fontColor || '#1f2937');
}

/* ================= HEX COLOR PICKER (accent only) ================= */
function positionPopover(wrap, pop) {
    const rect = wrap.getBoundingClientRect();
    const popWidth = 260;
    const popHeight = 150;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let left = rect.right - popWidth;
    let top = rect.bottom + 8;
    if (left < 8) left = rect.left;
    if (left < 8) left = 8;
    if (left + popWidth > viewportW - 8) left = viewportW - popWidth - 8;
    if (top + popHeight > viewportH - 8) {
        top = rect.top - popHeight - 8;
        if (top < 8) top = 8;
    }
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
}

function bindHexPicker() {
    $$('.cpk-wrap[data-picker]').forEach(wrap => {
        wrap.addEventListener('click', e => {
            if (e.target.closest('.cpk-pop')) return;
            const type = wrap.dataset.picker;
            const pop = $('#' + type + 'Pop');
            if (!pop) return;
            const isOpen = pop.classList.contains('show');
            $$('.cpk-pop').forEach(p => p.classList.remove('show'));
            $$('.cpk-wrap').forEach(w => w.classList.remove('open'));
            if (!isOpen) {
                positionPopover(wrap, pop);
                pop.classList.add('show');
                wrap.classList.add('open');
                const currentColor = S.settings.accentColor;
                const inp = $('#' + type + 'Hex');
                const pv = $('#' + type + 'Preview');
                if (inp) inp.value = currentColor.replace('#', '').toUpperCase();
                if (pv) pv.style.background = currentColor;
                if (inp) inp.classList.remove('err');
                setTimeout(() => inp && inp.focus(), 50);
            }
        });
    });

    $$('[data-close-picker]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            $$('.cpk-pop').forEach(p => p.classList.remove('show'));
            $$('.cpk-wrap').forEach(w => w.classList.remove('open'));
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.cpk-wrap') && !e.target.closest('.cpk-pop')) {
            $$('.cpk-pop').forEach(p => p.classList.remove('show'));
            $$('.cpk-wrap').forEach(w => w.classList.remove('open'));
        }
    });

    const reposition = () => {
        $$('.cpk-wrap.open').forEach(wrap => {
            const type = wrap.dataset.picker;
            const pop = $('#' + type + 'Pop');
            if (pop && pop.classList.contains('show')) positionPopover(wrap, pop);
        });
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    const accentInput = $('#accentHex');
    const accentPreview = $('#accentPreview');
    if (accentInput && accentPreview) {
        accentInput.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
            this.value = val;
            if (val.length === 6 || val.length === 3) {
                this.classList.remove('err');
                accentPreview.style.background = '#' + val;
            } else if (val.length === 0) {
                this.classList.remove('err');
            } else {
                this.classList.add('err');
            }
        });
        accentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); applyHexColor('accent'); }
        });
    }

    $$('[data-apply]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            applyHexColor(btn.dataset.apply);
        });
    });
}

function applyHexColor(type) {
    const input = $('#' + type + 'Hex');
    if (!input) return;
    let val = input.value.trim().replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (val.length !== 6 && val.length !== 3) {
        input.classList.add('err');
        toast('Invalid hex code', 'err');
        return;
    }
    if (val.length === 3) val = val.split('').map(c => c + c).join('');
    const hex = '#' + val;
    // Only accent — font colors handled in Font Settings panel
    S.settings.accentColor = hex;
    $$('.sw:not(.fc)').forEach(x => x.classList.remove('active'));
    applyAccent();
    render();
    input.classList.remove('err');
    $$('.cpk-pop').forEach(p => p.classList.remove('show'));
    $$('.cpk-wrap').forEach(w => w.classList.remove('open'));
    toast('Applied ' + hex, 'ok');
}

/* ================= FONT PANEL ================= */
function bindFontPanel() {
    const p=$('#fontPanel'),o=$('#fontOvl');
    $('#fontOpen').addEventListener('click',()=>{p.classList.add('show');o.classList.add('show');updateFcSwatches()});
    const cl=()=>{p.classList.remove('show');o.classList.remove('show');hideFcolorPop()};
    $('#fontClose').addEventListener('click',cl);
    o.addEventListener('click',cl);
    $$('.fcs').forEach(s=>s.addEventListener('change',()=>{S.settings.fonts[s.dataset.fa]=s.value;render()}));
    $$('.fcszs').forEach(s=>s.addEventListener('change',()=>{S.settings.fontSizes[s.dataset.sa]=s.value;render()}));
    $('#resetFonts').addEventListener('click',()=>{
        const d='Inter';
        S.settings.fonts={header:d,sectionTitle:d,body:d,contact:d,skills:d,declaration:d};
        S.settings.fontSizes={header:'medium',sectionTitle:'medium',body:'medium'};
        S.settings.fontColors={header:null,sectionTitle:null,body:null,contact:null,skills:null,declaration:null};
        $$('.fcs').forEach(s=>s.value=d);
        $$('.fcszs').forEach(s=>s.value='medium');
        updateFcSwatches();
        render();
        toast('Fonts & colors reset','inf');
    });
    bindFcolorPickers();
}

function updateFcSwatches() {
    const defaultColor = S.settings.fontColor || '#1f2937';
    ['header','sectionTitle','body','contact','skills','declaration'].forEach(area => {
        const sw = $('#fcSwatch_' + area);
        if (sw) sw.style.background = S.settings.fontColors[area] || defaultColor;
    });
}

let fcolorActiveArea = null;

function bindFcolorPickers() {
    $$('.fcolor-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const area = btn.dataset.fcolorArea;
            openFcolorPop(area, btn);
        });
    });
    $$('.fcp-sw').forEach(sw => {
        sw.addEventListener('click', e => {
            e.stopPropagation();
            const color = sw.dataset.fcp;
            $('#fcolorHex').value = color.replace('#', '').toUpperCase();
            $('#fcolorPreview').style.background = color;
            $$('.fcp-sw').forEach(x => x.classList.remove('active'));
            sw.classList.add('active');
            applyFcolor(color);
        });
    });
    const hexInput = $('#fcolorHex');
    hexInput.addEventListener('input', function() {
        let val = this.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
        this.value = val;
        if (val.length === 6 || val.length === 3) {
            this.classList.remove('err');
            let full = val.length === 3 ? val.split('').map(c => c + c).join('') : val;
            $('#fcolorPreview').style.background = '#' + full;
        } else if (val.length > 0) {
            this.classList.add('err');
        }
    });
    hexInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); applyFcolorFromInput(); }
    });
    $('#fcolorApply').addEventListener('click', e => { e.stopPropagation(); applyFcolorFromInput(); });
    $('#fcolorInherit').addEventListener('click', e => {
        e.stopPropagation();
        if (!fcolorActiveArea) return;
        S.settings.fontColors[fcolorActiveArea] = null;
        updateFcSwatches();
        render();
        hideFcolorPop();
        toast('Using default color', 'ok');
    });
    $('#fcolorClose').addEventListener('click', e => { e.stopPropagation(); hideFcolorPop(); });
    document.addEventListener('click', e => {
        if (!e.target.closest('.fcolor-pop') && !e.target.closest('.fcolor-btn')) {
            hideFcolorPop();
        }
    });
}

function openFcolorPop(area, btn) {
    const pop = $('#fcolorPop');
    if (fcolorActiveArea === area && pop.classList.contains('show')) {
        hideFcolorPop();
        return;
    }
    fcolorActiveArea = area;
    $$('.fcolor-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const labels = {
        header:'Header / Name Color',
        sectionTitle:'Section Titles Color',
        body:'Body Text Color',
        contact:'Contact Info Color',
        skills:'Skills / Tags Color',
        declaration:'Declaration Color'
    };
    $('#fcolorPopTitle').textContent = labels[area] || 'Color';
    const currentColor = S.settings.fontColors[area] || S.settings.fontColor || '#1f2937';
    $('#fcolorHex').value = currentColor.replace('#', '').toUpperCase();
    $('#fcolorPreview').style.background = currentColor;
    $('#fcolorHex').classList.remove('err');
    $$('.fcp-sw').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.fcp.toLowerCase() === currentColor.toLowerCase());
    });
    const rect = btn.getBoundingClientRect();
    const popWidth = 260;
    const popHeight = 220;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let left = rect.right - popWidth;
    let top = rect.bottom + 8;
    if (left < 8) left = rect.left;
    if (left < 8) left = 8;
    if (left + popWidth > viewportW - 8) left = viewportW - popWidth - 8;
    if (top + popHeight > viewportH - 8) top = rect.top - popHeight - 8;
    if (top < 8) top = 8;
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
    pop.classList.add('show');
    setTimeout(() => $('#fcolorHex').focus(), 50);
}

function hideFcolorPop() {
    $('#fcolorPop').classList.remove('show');
    $$('.fcolor-btn').forEach(b => b.classList.remove('active'));
    fcolorActiveArea = null;
}

function applyFcolor(hex) {
    if (!fcolorActiveArea) return;
    S.settings.fontColors[fcolorActiveArea] = hex;
    updateFcSwatches();
    render();
    toast('Applied ' + hex, 'ok');
}

function applyFcolorFromInput() {
    const input = $('#fcolorHex');
    let val = input.value.trim().replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (val.length !== 6 && val.length !== 3) {
        input.classList.add('err');
        toast('Invalid hex code', 'err');
        return;
    }
    if (val.length === 3) val = val.split('').map(c => c + c).join('');
    const hex = '#' + val;
    applyFcolor(hex);
    hideFcolorPop();
}

function bindZoom() {
    let mode='fit',pct=100;
    const lbl=$('#zVal');
    const pvBd=$('#pvBd');
    function fit(){
        if(!pvBd)return 100;
        const sw=pvBd.clientWidth-24,sh=pvBd.clientHeight-24;
        const pw=794,ph=1123;
        return Math.min(sw/pw,sh/ph)*100;
    }
    function apply(){
        const p=rPage();
        if(!p)return;
        let s;
        if(mode==='fit'){s=fit();lbl.textContent='Fit'}
        else{s=pct;lbl.textContent=Math.round(s)+'%'}
        p.style.transform=`scale(${s/100})`;
        updatePanCursor();
    }
    function updatePanCursor(){
        // Show grab cursor only when content overflows (i.e., zoomed in)
        if(!pvBd)return;
        const hasOverflow = pvBd.scrollWidth > pvBd.clientWidth || pvBd.scrollHeight > pvBd.clientHeight;
        pvBd.style.cursor = hasOverflow ? 'grab' : 'default';
    }
    try{new ResizeObserver(()=>{if(mode==='fit')apply();updatePanCursor()}).observe(pvBd)}catch(e){}
    $('#zIn').addEventListener('click',()=>{mode='m';pct=Math.min(200,(mode==='fit'?fit():pct)+10);apply()});
    $('#zOut').addEventListener('click',()=>{mode='m';pct=Math.max(30,(mode==='fit'?fit():pct)-10);apply()});
    $('#zFit').addEventListener('click',()=>{mode='fit';apply();pvBd.scrollTo({top:0,left:0,behavior:'smooth'})});
    setTimeout(apply,300);
    window.addEventListener('resize',()=>{if(mode==='fit')apply()});
    
    // ==================== DRAG TO PAN ====================
    let isDragging = false;
    let startX = 0, startY = 0;
    let scrollLeft = 0, scrollTop = 0;
    
    pvBd.addEventListener('mousedown', e => {
        // Only left mouse button, don't interfere with buttons/inputs
        if (e.button !== 0) return;
        // Check if there's overflow to pan
        const hasOverflow = pvBd.scrollWidth > pvBd.clientWidth || pvBd.scrollHeight > pvBd.clientHeight;
        if (!hasOverflow) return;
        
        isDragging = true;
        pvBd.classList.add('grabbing');
        startX = e.pageX - pvBd.offsetLeft;
        startY = e.pageY - pvBd.offsetTop;
        scrollLeft = pvBd.scrollLeft;
        scrollTop = pvBd.scrollTop;
        e.preventDefault();
    });
    
    pvBd.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            pvBd.classList.remove('grabbing');
        }
    });
    
    pvBd.addEventListener('mouseup', () => {
        isDragging = false;
        pvBd.classList.remove('grabbing');
    });
    
    pvBd.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - pvBd.offsetLeft;
        const y = e.pageY - pvBd.offsetTop;
        const walkX = (x - startX) * 1.5; // Sensitivity multiplier
        const walkY = (y - startY) * 1.5;
        pvBd.scrollLeft = scrollLeft - walkX;
        pvBd.scrollTop = scrollTop - walkY;
    });
    
    // Touch support for mobile / tablet
    pvBd.addEventListener('touchstart', e => {
        const hasOverflow = pvBd.scrollWidth > pvBd.clientWidth || pvBd.scrollHeight > pvBd.clientHeight;
        if (!hasOverflow || e.touches.length !== 1) return;
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.pageX - pvBd.offsetLeft;
        startY = touch.pageY - pvBd.offsetTop;
        scrollLeft = pvBd.scrollLeft;
        scrollTop = pvBd.scrollTop;
    }, { passive: true });
    
    pvBd.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    pvBd.addEventListener('touchmove', e => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const x = touch.pageX - pvBd.offsetLeft;
        const y = touch.pageY - pvBd.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        pvBd.scrollLeft = scrollLeft - walkX;
        pvBd.scrollTop = scrollTop - walkY;
    }, { passive: true });
    
    // Ctrl/Cmd + scroll wheel to zoom
    pvBd.addEventListener('wheel', e => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            mode = 'm';
            const currentPct = mode === 'fit' ? fit() : pct;
            if (e.deltaY < 0) {
                pct = Math.min(200, currentPct + 10);
            } else {
                pct = Math.max(30, currentPct - 10);
            }
            apply();
        }
    }, { passive: false });
}

function bindCollapse() {
    document.addEventListener('click',e=>{
        const h=e.target.closest('[data-col]');
        if(!h)return;
        if(e.target.closest('.tsw')||e.target.closest('.sec-acts'))return;
        const b=document.getElementById(h.dataset.col);
        if(!b)return;
        b.classList.toggle('open');
        h.classList.toggle('col');
    });
}

function bindResponsive() {
    const g=$('#mg');
    g.classList.add('ve');
    const fab = $('#backEditFab');
    if (fab) g.appendChild(fab);
    function switchView(view) {
        $$('.vtab').forEach(x=>x.classList.remove('active'));
        const activeTab = $(`.vtab[data-v="${view}"]`);
        if (activeTab) activeTab.classList.add('active');
        g.classList.remove('ve','vp');
        g.classList.add(view==='edit'?'ve':'vp');
        window.scrollTo({top:0, behavior:'smooth'});
    }
    $$('.vtab').forEach(t=>t.addEventListener('click',()=>{
        switchView(t.dataset.v);
    }));
    const backBtn = $('#pvBackBtn');
    if (backBtn) backBtn.addEventListener('click', () => switchView('edit'));
    const fabBtn = $('#backEditFab');
    if (fabBtn) fabBtn.addEventListener('click', () => switchView('edit'));
    $('#mobTog').addEventListener('click',()=>$('#mobNav').classList.toggle('show'));
}

function bindDropdown() {
    const b=$('#addBtn'),dd=$('#addDd');
    b.addEventListener('click',e=>{e.stopPropagation();dd.classList.toggle('show')});
    document.addEventListener('click',e=>{if(!dd.contains(e.target)&&e.target!==b)dd.classList.remove('show')});
    $$('button[data-sec]',dd).forEach(btn=>btn.addEventListener('click',()=>{
        dd.classList.remove('show');
        const t=btn.dataset.sec;
        if(t==='custom'){$('#cmIn').value='';show($('#customModal'))}
        else addSec(t);
    }));
}

function addSec(t,ct) {
    const c=CFG[t];
    if(!c)return;
    if(c.single&&S.sections.find(s=>s.type===t)){toast('Section already exists','err');return}
    const s={id:uid(),type:t,title:ct||c.t,entries:[],tags:[]};
    if(!c.tag&&!c.single)s.entries.push(mkEntry(t));
    S.sections.push(s);
    renderEditor();render();
    toast(s.title+' added','ok');
}

function mkEntry(t){const c=CFG[t],e={id:uid()};if(c.fields)c.fields.forEach(f=>e[f.k]='');if(c.bdg){e.badge=null;e.badgeUrl=''}return e}
function rmSec(id){S.sections=S.sections.filter(s=>s.id!==id);renderEditor();render();toast('Section removed','inf')}
function mvSec(id,d){const i=S.sections.findIndex(s=>s.id===id),n=i+d;if(n<0||n>=S.sections.length)return;[S.sections[i],S.sections[n]]=[S.sections[n],S.sections[i]];renderEditor();render()}
function addEnt(sid){const s=S.sections.find(x=>x.id===sid);if(s){s.entries.push(mkEntry(s.type));renderEditor();render()}}
function rmEnt(sid,eid){const s=S.sections.find(x=>x.id===sid);if(s){s.entries=s.entries.filter(e=>e.id!==eid);renderEditor();render()}}
function mvEnt(sid,eid,d){const s=S.sections.find(x=>x.id===sid);if(!s)return;const i=s.entries.findIndex(e=>e.id===eid),n=i+d;if(n<0||n>=s.entries.length)return;[s.entries[i],s.entries[n]]=[s.entries[n],s.entries[i]];renderEditor();render()}
function updEnt(sid,eid,k,v){const s=S.sections.find(x=>x.id===sid);if(!s)return;const e=s.entries.find(x=>x.id===eid);if(e){e[k]=v;render()}}
function updSec(sid,k,v){const s=S.sections.find(x=>x.id===sid);if(s){s[k]=v;render()}}
function addTag(sid,t){const s=S.sections.find(x=>x.id===sid);if(!s||!t.trim())return;s.tags.push(...t.split(',').map(x=>x.trim()).filter(Boolean));renderEditor();render()}
function rmTag(sid,i){const s=S.sections.find(x=>x.id===sid);if(s){s.tags.splice(i,1);renderEditor();render()}}

function renderEditor() {
    const cont=secCont();
    if(!cont)return;
    const fa=document.activeElement;
    let fi=null;
    if(fa&&fa.dataset&&(fa.dataset.sid||fa.dataset.ti)){
        fi={s:fa.dataset.sid,e:fa.dataset.eid,f:fa.dataset.fk,t:fa.dataset.ti,ss:fa.selectionStart,se:fa.selectionEnd};
    }
    let h='';
    S.sections.forEach(sec=>{
        const c=CFG[sec.type],bid=`sb_${sec.id}`;
        h+=`<div class="card"><div class="card-hd" data-col="${bid}"><span><i class="fas ${c.i}"></i><span>${esc(sec.title)}</span></span><div class="hd-r"><div class="sec-acts">`;
        if(!c.tag&&!c.single)h+=`<button class="sabt add" data-act="ae" data-sid="${sec.id}" title="Add"><i class="fas fa-plus"></i></button>`;
        h+=`<button class="sabt mv" data-act="ms" data-sid="${sec.id}" data-dir="-1" title="Up"><i class="fas fa-arrow-up"></i></button>`;
        h+=`<button class="sabt mv" data-act="ms" data-sid="${sec.id}" data-dir="1" title="Down"><i class="fas fa-arrow-down"></i></button>`;
        h+=`<button class="sabt del" data-act="rs" data-sid="${sec.id}" title="Delete"><i class="fas fa-trash"></i></button>`;
        h+=`</div><i class="fas fa-chevron-down chv"></i></div></div>`;
        h+=`<div class="card-bd open" id="${bid}">`;
        if(c.single){
            c.fields.forEach(f=>{
                h+=`<div class="ff full"><label>${f.l}</label><textarea class="fta" placeholder="${f.ph}" rows="3" data-sid="${sec.id}" data-fk="${f.k}" data-single="1">${esc(sec.text||'')}</textarea></div>`;
            });
        }else if(c.tag){
            h+=`<div class="tag-row"><input class="fin" placeholder="Type & Enter (comma OK)" data-ti="${sec.id}"><button class="btn btn-primary btn-sm" data-act="atb" data-sid="${sec.id}"><i class="fas fa-plus"></i></button></div>`;
            h+=`<div class="tags">${(sec.tags||[]).map((t,i)=>`<span class="tg">${esc(t)}<button data-act="rt" data-sid="${sec.id}" data-idx="${i}"><i class="fas fa-times"></i></button></span>`).join('')}</div>`;
        }else{
            sec.entries.forEach((en,ei)=>{
                const lb=en.title||en.name||en.degree||en.role||en.language||`Entry ${ei+1}`;
                h+=`<div class="entry"><div class="entry-hd"><div class="entry-nm"><i class="fas ${c.i}"></i><span>${esc(lb)}</span></div><div class="entry-btns">`;
                if(c.bdg)h+=`<button class="ebt bdg" data-act="ob" data-sid="${sec.id}" data-eid="${en.id}"><i class="fas fa-award"></i></button>`;
                h+=`<button class="ebt mv" data-act="me" data-sid="${sec.id}" data-eid="${en.id}" data-dir="-1"><i class="fas fa-arrow-up"></i></button>`;
                h+=`<button class="ebt mv" data-act="me" data-sid="${sec.id}" data-eid="${en.id}" data-dir="1"><i class="fas fa-arrow-down"></i></button>`;
                h+=`<button class="ebt del" data-act="re" data-sid="${sec.id}" data-eid="${en.id}"><i class="fas fa-trash"></i></button>`;
                h+=`</div></div><div class="ff-grid">`;
                c.fields.forEach(f=>{
                    const full=f.f?' full':'';
                    h+=`<div class="ff${full}"><label>${f.l}</label>`;
                    if(f.ty==='ta')h+=`<textarea class="fta" placeholder="${f.ph}" rows="2" data-sid="${sec.id}" data-eid="${en.id}" data-fk="${f.k}">${esc(en[f.k]||'')}</textarea>`;
                    else if(f.ty==='s'){h+=`<select class="fin" data-sid="${sec.id}" data-eid="${en.id}" data-fk="${f.k}"><option value="">Select...</option>`;f.opts.forEach(o=>h+=`<option${en[f.k]===o?' selected':''}>${o}</option>`);h+=`</select>`}
                    else h+=`<input class="fin" placeholder="${f.ph}" value="${esc(en[f.k]||'')}" data-sid="${sec.id}" data-eid="${en.id}" data-fk="${f.k}">`;
                    h+=`</div>`;
                });
                h+=`</div>`;
                if(c.bdg&&en.badge){
                    h+=`<div class="bdg-row"><img src="${en.badge}"><div class="bdg-meta"><strong>Badge</strong>${en.badgeUrl?`<br><a href="${esc(en.badgeUrl)}" target="_blank">Verify →</a>`:''}</div><button class="rm-bdg" data-act="rbd" data-sid="${sec.id}" data-eid="${en.id}"><i class="fas fa-times"></i></button></div>`;
                }
                h+=`</div>`;
            });
        }
        h+=`</div></div>`;
    });
    cont.innerHTML=h;
    $$('[data-sid][data-fk]',cont).forEach(el=>{
        const ev=el.tagName==='SELECT'?'change':'input';
        el.addEventListener(ev,()=>{
            if(el.dataset.single)updSec(el.dataset.sid,el.dataset.fk,el.value);
            else updEnt(el.dataset.sid,el.dataset.eid,el.dataset.fk,el.value);
        });
    });
    $$('[data-ti]',cont).forEach(inp=>{
        inp.addEventListener('keydown',e=>{
            if(e.key==='Enter'){e.preventDefault();if(inp.value.trim())addTag(inp.dataset.ti,inp.value)}
        });
    });
    if(fi){
        let t=null;
        if(fi.t)t=$(`[data-ti="${fi.t}"]`,cont);
        else if(fi.s&&fi.f){
            t=fi.e?$(`[data-sid="${fi.s}"][data-eid="${fi.e}"][data-fk="${fi.f}"]`,cont):$(`[data-sid="${fi.s}"][data-fk="${fi.f}"]`,cont);
        }
        if(t){t.focus();try{t.setSelectionRange(fi.ss,fi.se)}catch(e){}}
    }
}

function bindEditorClicks() {
    const cont=secCont();
    if(!cont)return;
    cont.addEventListener('click',e=>{
        const b=e.target.closest('[data-act]');
        if(b){
            e.stopPropagation();
            const a=b.dataset.act,sid=b.dataset.sid,eid=b.dataset.eid;
            const dir=parseInt(b.dataset.dir||'0'),idx=parseInt(b.dataset.idx||'0');
            switch(a){
                case'ae':addEnt(sid);break;
                case're':rmEnt(sid,eid);break;
                case'me':mvEnt(sid,eid,dir);break;
                case'rs':rmSec(sid);break;
                case'ms':mvSec(sid,dir);break;
                case'ob':openBadgeModal(sid,eid);break;
                case'rbd':rmBadge(sid,eid);break;
                case'rt':rmTag(sid,idx);break;
                case'atb':{const i=$(`[data-ti="${sid}"]`);if(i&&i.value.trim())addTag(sid,i.value);break}
            }
        }
    });
}

function bindModals() {
    const bm=$('#badgeModal'),bz=$('#bdZone'),bfi=$('#bdIn'),be=$('#bdE'),bp=$('#bdP'),bi=$('#bdImg');
    bz.addEventListener('click',e=>{if(!e.target.closest('#bdChg'))bfi.click()});
    $('#bdChg').addEventListener('click',()=>bfi.click());
    bz.addEventListener('dragover',e=>e.preventDefault());
    bz.addEventListener('drop',e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))lb(f)});
    bfi.addEventListener('change',e=>{if(e.target.files[0])lb(e.target.files[0])});
    function lb(f){const r=new FileReader();r.onload=ev=>{S.badge.temp=ev.target.result;bi.src=ev.target.result;be.style.display='none';bp.style.display=''};r.readAsDataURL(f)}
    $('#bmX').addEventListener('click',()=>hide(bm));
    $('#bmNo').addEventListener('click',()=>hide(bm));
    $('#bmYes').addEventListener('click',()=>{
        if(!S.badge.target||!S.badge.temp){toast('Upload badge first','err');return}
        const{sid,eid}=S.badge.target;
        const s=S.sections.find(x=>x.id===sid);if(!s)return;
        const en=s.entries.find(x=>x.id===eid);if(!en)return;
        en.badge=S.badge.temp;en.badgeUrl=$('#bdUrl').value.trim();
        hide(bm);renderEditor();render();toast('Badge saved','ok');
    });
    $('#cmX').addEventListener('click',()=>hide($('#customModal')));
    $('#cmNo').addEventListener('click',()=>hide($('#customModal')));
    $('#cmYes').addEventListener('click',()=>{
        const n=$('#cmIn').value.trim();
        if(!n){toast('Enter name','err');return}
        addSec('custom',n);hide($('#customModal'));
    });
}

function openBadgeModal(sid,eid){S.badge.target={sid,eid};S.badge.temp=null;$('#bdE').style.display='';$('#bdP').style.display='none';$('#bdUrl').value='';$('#bdIn').value='';show($('#badgeModal'))}
function rmBadge(sid,eid){const s=S.sections.find(x=>x.id===sid);if(!s)return;const e=s.entries.find(x=>x.id===eid);if(e){e.badge=null;e.badgeUrl='';renderEditor();render()}}

function bindHeader() {
    const save=()=>{try{localStorage.setItem('rf_data',JSON.stringify(S));toast('Saved!','ok')}catch(e){toast('Save failed','err')}};
    const load=()=>{try{
        const d=localStorage.getItem('rf_data');
        if(!d){toast('No saved data','err');return}
        const l=JSON.parse(d);
        Object.assign(S.personal,l.personal||{});
        Object.assign(S.declaration,l.declaration||{});
        if(S.declaration.sigSize===undefined)S.declaration.sigSize=100;
        if(!S.personal.photoShape)S.personal.photoShape='circle';
        S.sections=l.sections||[];
        Object.assign(S.settings,l.settings||{});
        if (!S.settings.fontColors) {
            S.settings.fontColors = {header:null,sectionTitle:null,body:null,contact:null,skills:null,declaration:null};
        }
        Object.keys(S.personal).forEach(k=>{
            const el=$(`[data-p="${k}"]`);
            if(el&&k!=='photo'&&k!=='photoShape')el.value=S.personal[k]||'';
        });
        $('#declText').value=S.declaration.text||'';
        $('#declPlace').value=S.declaration.place||'';
        $('#declOn').checked=S.declaration.enabled!==false;
        $('#sigSize').value=S.declaration.sigSize;
        $('#sigSizeVal').textContent=S.declaration.sigSize;
        if(S.personal.photo){$('#pImg').src=S.personal.photo;$('#pE').style.display='none';$('#pF').style.display='';$('#pZone').style.borderStyle='solid'}
        if(S.declaration.signature){$('#sigImg').src=S.declaration.signature;$('#sigE').style.display='none';$('#sigF').style.display='';$('#sigSizeBox').style.display='';$('#sigZone').style.borderStyle='solid'}
        $$('.shape-btn').forEach(b=>b.classList.toggle('active',b.dataset.shape===S.personal.photoShape));
        applyPhotoShape();
        restoreUI();applyAccent();
        document.documentElement.dataset.theme=S.settings.theme||'light';
        const ti=$('#themeIcon');if(ti)ti.className=S.settings.theme==='dark'?'fas fa-sun':'fas fa-moon';
        renderEditor();render();toast('Loaded!','ok');
    }catch(e){console.error(e);toast('Load failed','err')}};
    const reset=()=>{
        if(!confirm('Reset everything?'))return;
        S.personal={fullName:'',jobTitle:'',email:'',phone:'',location:'',linkedin:'',website:'',github:'',photo:null,photoShape:'circle'};
        S.declaration={enabled:true,text:'I hereby declare that all information in this curriculum vitae is true and correct to the best of my knowledge and belief.',place:'',signature:null,sigSize:100};
        S.sections=[];
        S.settings.fontColors={header:null,sectionTitle:null,body:null,contact:null,skills:null,declaration:null};
        $$('[data-p]').forEach(el=>el.value='');
        $('#declText').value=S.declaration.text;
        $('#declPlace').value='';
        $('#declOn').checked=true;
        $('#sigSize').value=100;$('#sigSizeVal').textContent=100;
        $('#pE').style.display='';$('#pF').style.display='none';$('#pZone').style.borderStyle='dashed';
        $('#sigE').style.display='';$('#sigF').style.display='none';$('#sigSizeBox').style.display='none';$('#sigZone').style.borderStyle='dashed';
        $$('.shape-btn').forEach(b=>b.classList.toggle('active',b.dataset.shape==='circle'));
        applyPhotoShape();updateFcSwatches();renderEditor();render();toast('Reset done','inf');
    };
    const pairs=[
        ['saveBtn','saveBtnM',save],
        ['loadBtn','loadBtnM',load],
        ['resetBtn','resetBtnM',reset],
        ['dlPdf','dlPdfM',downloadPDF],
        ['dlPrint','dlPrintM',doPrint],
        ['dlImg','dlImgM',downloadPNG]
    ];
    pairs.forEach(([a,b,fn])=>{const e1=$('#'+a),e2=$('#'+b);if(e1)e1.addEventListener('click',fn);if(e2)e2.addEventListener('click',fn)});
}

function restoreUI() {
    $$('.lpk').forEach(b=>b.classList.toggle('active',b.dataset.layout===S.settings.layout));
    $('#spSel').value=S.settings.spacing;
    Object.entries(S.settings.fonts).forEach(([a,f])=>{const s=$(`.fcs[data-fa="${a}"]`);if(s)s.value=f});
    Object.entries(S.settings.fontSizes).forEach(([a,sz])=>{const s=$(`.fcszs[data-sa="${a}"]`);if(s)s.value=sz});
    if (!S.settings.fontColors) {
        S.settings.fontColors = {header:null,sectionTitle:null,body:null,contact:null,skills:null,declaration:null};
    }
    updateFcSwatches();
}

function buildResumeHTML() {
    const p=S.personal,st=S.settings,lay=st.layout;
    const sbT=['skills','languages','interests'];
    const sbS=S.sections.filter(x=>sbT.includes(x.type));
    const mnS=lay==='modern'?S.sections.filter(x=>!sbT.includes(x.type)):S.sections;
    let inner='';
    if(lay==='modern'){inner+=rMod(p,sbS,mnS)}
    else{
        inner+=rHdr(p,lay);
        if(lay==='compact'){inner+=`<div class="rbd">${rSecs(mnS,lay)}${S.declaration.enabled?rDecl():''}</div>`}
        else{inner+=`<div class="rbd">${rSecs(mnS,lay)}</div>${S.declaration.enabled?rDecl():''}`}
    }
    return inner;
}

function render() {
    const rc=rContent();
    if(!rc)return;
    const st=S.settings;
    rc.className=`rcontent layout-${st.layout} spacing-${st.spacing}`;
    rc.innerHTML=buildResumeHTML();
    applyFontsToContent(rc);
    applyPhotoShapeToContent(rc);
}

function applyPhotoShapeToContent(rc) {
    const shape=S.personal.photoShape||'circle';
    const shapeMap={circle:'50%',rounded:'12px',square:'0',hex:'0'};
    rc.querySelectorAll('.rph').forEach(el=>{
        el.style.borderRadius=shapeMap[shape];
        el.style.clipPath=shape==='hex'?'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)':'none';
    });
}

function applyFontsToContent(rc) {
    const f=S.settings.fonts,fs=S.settings.fontSizes,fc=S.settings.fontColors||{};
    
    // Fonts
    rc.querySelectorAll('.rn,.rt').forEach(e=>e.style.fontFamily=`'${f.header}',sans-serif`);
    rc.querySelectorAll('.rst,.rdclt').forEach(e=>e.style.fontFamily=`'${f.sectionTitle}',sans-serif`);
    rc.querySelectorAll('.rtx,.redc,.res,.ret,.rcn,.rcm').forEach(e=>e.style.fontFamily=`'${f.body}',sans-serif`);
    rc.querySelectorAll('.rct,.ci').forEach(e=>e.style.fontFamily=`'${f.contact}',sans-serif`);
    rc.querySelectorAll('.rsk,.rint,.sbsk').forEach(e=>e.style.fontFamily=`'${f.skills}',sans-serif`);
    rc.querySelectorAll('.rdctx,.rdcm,.sign').forEach(e=>e.style.fontFamily=`'${f.declaration}',sans-serif`);
    
    // Colors per area (only apply if set)
    if (fc.header) {
        rc.querySelectorAll('.layout-elegant .rn, .layout-creative .rn').forEach(e=>{
            e.style.color = fc.header;
        });
    }
    if (fc.sectionTitle) {
        rc.querySelectorAll('.rst').forEach(e=>{
            e.style.color = fc.sectionTitle;
            e.style.borderBottomColor = fc.sectionTitle;
        });
        rc.querySelectorAll('.rdclt').forEach(e=>{
            e.style.color = fc.sectionTitle;
            e.style.borderBottomColor = fc.sectionTitle;
        });
    }
    if (fc.body) {
        rc.querySelectorAll('.rtx,.redc,.ret,.rcn,.rln').forEach(e=>{
            e.style.color = fc.body;
        });
    }
    if (fc.contact) {
        rc.querySelectorAll('.layout-elegant .rct, .layout-creative .rct').forEach(e=>{
            e.style.color = fc.contact;
            e.querySelectorAll('i').forEach(i => i.style.color = fc.contact);
        });
    }
    if (fc.skills) {
        rc.querySelectorAll('.rsk').forEach(e=>{
            e.style.color = fc.skills;
            e.style.borderColor = fc.skills;
            const rgb = fc.skills.replace('#','');
            const r = parseInt(rgb.slice(0,2),16), g = parseInt(rgb.slice(2,4),16), b = parseInt(rgb.slice(4,6),16);
            e.style.background = `rgba(${r},${g},${b},0.12)`;
        });
        rc.querySelectorAll('.rint').forEach(e=>{
            e.style.color = fc.skills;
        });
    }
    if (fc.declaration) {
        rc.querySelectorAll('.rdctx,.sign,.rdcm').forEach(e=>{
            e.style.color = fc.declaration;
        });
    }
    
    // Sizes
    const szm={small:.87,medium:1,large:1.13};
    rc.querySelectorAll('.rn').forEach(e=>{const o=parseFloat(getComputedStyle(e).fontSize);e.style.fontSize=`${o*(szm[fs.header]||1)}px`});
    rc.querySelectorAll('.rst,.rdclt').forEach(e=>{const o=parseFloat(getComputedStyle(e).fontSize);e.style.fontSize=`${o*(szm[fs.sectionTitle]||1)}px`});
    rc.querySelectorAll('.rtx,.redc,.ret,.res').forEach(e=>{const o=parseFloat(getComputedStyle(e).fontSize);e.style.fontSize=`${o*(szm[fs.body]||1)}px`});
}

function rCI(p){let h='';if(p.email)h+=`<span><i class="fas fa-envelope"></i> ${esc(p.email)}</span>`;if(p.phone)h+=`<span><i class="fas fa-phone"></i> ${esc(p.phone)}</span>`;if(p.location)h+=`<span><i class="fas fa-map-marker-alt"></i> ${esc(p.location)}</span>`;if(p.linkedin)h+=`<span><i class="fab fa-linkedin"></i> ${esc(p.linkedin)}</span>`;if(p.website)h+=`<span><i class="fas fa-globe"></i> ${esc(p.website)}</span>`;if(p.github)h+=`<span><i class="fab fa-github"></i> ${esc(p.github)}</span>`;return h}

function rHdr(p,l){
    let h=`<div class="rh">`;
    if(l==='compact'){
        if(p.photo)h+=`<img src="${p.photo}" class="rph">`;
        h+=`<div class="rhi"><div class="rn">${esc(p.fullName)||'Your Name'}</div>${p.jobTitle?`<div class="rt">${esc(p.jobTitle)}</div>`:''}<div class="rct">${rCI(p)}</div></div>`;
    }else if(l==='elegant'){
        if(p.photo)h+=`<img src="${p.photo}" class="rph">`;
        h+=`<div class="rn">${esc(p.fullName)||'Your Name'}</div>${p.jobTitle?`<div class="rt">${esc(p.jobTitle)}</div>`:''}<div class="rct">${rCI(p)}</div>`;
    }else{
        if(p.photo)h+=`<img src="${p.photo}" class="rph">`;
        h+=`<div><div class="rn">${esc(p.fullName)||'Your Name'}</div>${p.jobTitle?`<div class="rt">${esc(p.jobTitle)}</div>`:''}<div class="rct">${rCI(p)}</div></div>`;
    }
    return h+`</div>`;
}

function rMod(p,sb,mn){
    let h=`<div class="rsb">`;
    if(p.photo)h+=`<img src="${p.photo}" class="rph">`;
    h+=`<div class="rn">${esc(p.fullName)||'Your Name'}</div>${p.jobTitle?`<div class="rt">${esc(p.jobTitle)}</div>`:''}`;
    h+=`<div class="sbs"><div class="sbt">Contact</div>`;
    if(p.email)h+=`<div class="ci"><i class="fas fa-envelope"></i>${esc(p.email)}</div>`;
    if(p.phone)h+=`<div class="ci"><i class="fas fa-phone"></i>${esc(p.phone)}</div>`;
    if(p.location)h+=`<div class="ci"><i class="fas fa-map-marker-alt"></i>${esc(p.location)}</div>`;
    if(p.linkedin)h+=`<div class="ci"><i class="fab fa-linkedin"></i>${esc(p.linkedin)}</div>`;
    if(p.website)h+=`<div class="ci"><i class="fas fa-globe"></i>${esc(p.website)}</div>`;
    if(p.github)h+=`<div class="ci"><i class="fab fa-github"></i>${esc(p.github)}</div>`;
    h+=`</div>`;
    sb.forEach(s=>{
        h+=`<div class="sbs"><div class="sbt">${esc(s.title)}</div>`;
        if(s.type==='skills'||s.type==='interests')(s.tags||[]).forEach(t=>h+=`<span class="sbsk">${esc(t)}</span>`);
        else if(s.type==='languages')s.entries.forEach(e=>h+=`<div class="sblg"><strong>${esc(e.language||'')}</strong>${e.level?' — '+esc(e.level):''}</div>`);
        h+=`</div>`;
    });
    h+=`</div><div class="rmn"><div class="rbdi">${rSecs(mn,'modern')}</div>${S.declaration.enabled?rDecl():''}</div>`;
    return h;
}

function rSecs(secs,l){let h='';secs.forEach(s=>{const c=CFG[s.type];const fw=l==='compact'&&!['skills','interests','languages'].includes(s.type);h+=`<div class="rsc${fw?' fw':''}"><div class="rst"><i class="fas ${c.i}"></i> ${esc(s.title)}</div>${rSC(s)}</div>`});return h}

function rSC(s){
    const t=s.type;let h='';
    if(t==='summary')h+=`<div class="rtx">${esc(s.text||'')}</div>`;
    else if(t==='skills')h+=`<div class="rsg">${(s.tags||[]).map(x=>`<span class="rsk">${esc(x)}</span>`).join('')}</div>`;
    else if(t==='interests')h+=`<div class="rints">${(s.tags||[]).map(x=>`<span class="rint">${esc(x)}</span>`).join('')}</div>`;
    else if(t==='certifications')s.entries.forEach(e=>{h+=`<div class="rcert">${e.badge?`<img src="${e.badge}" class="rcb">`:''}<div><div class="rcn">${esc(e.name||'')}</div><div class="rcm">${esc([e.issuer,e.date,e.credentialId?'ID: '+e.credentialId:''].filter(Boolean).join(' • '))}</div>${e.badgeUrl?`<a href="${esc(e.badgeUrl)}" class="rcl">Verify →</a>`:''}</div></div>`});
    else if(t==='languages')h+=`<div class="rlgs">${s.entries.map(e=>`<div><span class="rln">${esc(e.language||'')}</span>${e.level?` <span class="rll">(${esc(e.level)})</span>`:''}</div>`).join('')}</div>`;
    else if(t==='experience')s.entries.forEach(e=>{const dt=[e.startDate,e.endDate].filter(Boolean).join(' – '),sb=[e.company,e.location].filter(Boolean).join(' • ');h+=`<div class="ren"><div class="reh"><span class="ret">${esc(e.title||'')}</span>${dt?`<span class="red">${esc(dt)}</span>`:''}</div>${sb?`<div class="res">${esc(sb)}</div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    else if(t==='education')s.entries.forEach(e=>{const dt=[e.startDate,e.endDate].filter(Boolean).join(' – ');h+=`<div class="ren"><div class="reh"><span class="ret">${esc(e.degree||'')}</span>${dt?`<span class="red">${esc(dt)}</span>`:''}</div>${e.school?`<div class="res">${esc(e.school)}</div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    else if(t==='projects')s.entries.forEach(e=>{h+=`<div class="ren"><div class="ret">${esc(e.name||'')}</div>${e.tech?`<div class="res">${esc(e.tech)}</div>`:''}${e.url?`<div><a href="${esc(e.url)}" class="relk">${esc(e.url)}</a></div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    else if(t==='awards')s.entries.forEach(e=>{h+=`<div class="ren"><div class="reh"><span class="ret">${esc(e.title||'')}</span>${e.date?`<span class="red">${esc(e.date)}</span>`:''}</div>${e.issuer?`<div class="res">${esc(e.issuer)}</div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    else if(t==='volunteer')s.entries.forEach(e=>{const dt=[e.startDate,e.endDate].filter(Boolean).join(' – ');h+=`<div class="ren"><div class="reh"><span class="ret">${esc(e.role||'')}</span>${dt?`<span class="red">${esc(dt)}</span>`:''}</div>${e.organization?`<div class="res">${esc(e.organization)}</div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    else if(t==='references')s.entries.forEach(e=>{const sb=[e.title,e.company].filter(Boolean).join(', ');h+=`<div class="ren"><div class="ret">${esc(e.name||'')}</div>${sb?`<div class="res">${esc(sb)}</div>`:''}${e.contact?`<div class="redc">${esc(e.contact)}</div>`:''}</div>`});
    else s.entries.forEach(e=>{h+=`<div class="ren"><div class="reh"><span class="ret">${esc(e.title||'')}</span>${e.date?`<span class="red">${esc(e.date)}</span>`:''}</div>${e.subtitle?`<div class="res">${esc(e.subtitle)}</div>`:''}${e.description?`<div class="redc">${esc(e.description)}</div>`:''}</div>`});
    return h;
}

function rDecl(){
    const d=S.declaration,p=S.personal;
    const sigSize=d.sigSize||100;
    let h=`<div class="rdcl">`;
    h+=`<div class="rdctx">${esc(d.text)}</div>`;
    h+=`<div class="rdcf">`;
    h+=`<div class="rdcm">${d.place?esc(d.place):''}</div>`;
    h+=`<div class="rdcs">`;
    if(d.signature){h+=`<img src="${d.signature}" alt="Signature" style="max-height:${sigSize*0.5}px;max-width:${sigSize*1.5}px">`}
    else{h+=`<div class="sigln" style="width:${sigSize*1.2}px"></div>`}
    h+=`<div class="sign">${esc(p.fullName||'Your Name')}</div>`;
    h+=`</div></div></div>`;
    return h;
}

/* ================= HELPER: Build offscreen render styles ================= */
function buildOffscreenStyles(prefix) {
    const ac = S.settings.accentColor;
    const acd = darken(ac, .15);
    const acl = lighten(ac, .8);
    const acll = lighten(ac, .92);
    const fc = S.settings.fontColor || '#1f2937';
    const fcolors = S.settings.fontColors || {};
    const f = S.settings.fonts;
    const sectionTitleColor = fcolors.sectionTitle || ac;
    const sectionTitleBorder = fcolors.sectionTitle || acl;
    const bodyColor = fcolors.body || fc;
    const skillsColor = fcolors.skills || ac;
    const declColor = fcolors.declaration || fc;
    const contactColor = fcolors.contact || '#6b7280';
    const headerColor = fcolors.header || fc;
    
    let skillsBg = acll, skillsBorder = acl;
    if (fcolors.skills) {
        const rgb = fcolors.skills.replace('#','');
        const r = parseInt(rgb.slice(0,2),16), g = parseInt(rgb.slice(2,4),16), b = parseInt(rgb.slice(4,6),16);
        skillsBg = `rgba(${r},${g},${b},0.12)`;
        skillsBorder = fcolors.skills;
    }
    
    return `
    .${prefix} * { box-sizing:border-box; margin:0; padding:0; }
    .${prefix} { width:794px; height:1123px; background:#fff; font-family:'${f.body}',sans-serif; color:${bodyColor}; }
    .${prefix} .rcontent { width:100%; height:100%; display:flex; flex-direction:column; font-size:12px; line-height:1.5; }
    .${prefix} .layout-classic .rh { background:linear-gradient(135deg, ${acd}, ${ac}); color:#fff; padding:38px 46px; display:flex; align-items:center; gap:28px; }
    .${prefix} .layout-classic .rph { width:95px; height:95px; object-fit:cover; border:2.5px solid rgba(255,255,255,.25); flex-shrink:0; }
    .${prefix} .layout-classic .rn { font-size:26px; font-weight:800; margin-bottom:2px; color:#fff; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-classic .rt { font-size:13px; opacity:.8; margin-bottom:10px; color:#fff; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-classic .rct { display:flex; flex-wrap:wrap; gap:6px 14px; font-size:10px; opacity:.85; color:#fff; font-family:'${f.contact}',sans-serif; }
    .${prefix} .layout-classic .rct span { display:flex; align-items:center; gap:4px; }
    .${prefix} .layout-classic .rbd { padding:30px 46px; flex:1; overflow:hidden; }
    .${prefix} .layout-modern { flex-direction:row !important; }
    .${prefix} .layout-modern .rsb { width:260px; background:linear-gradient(180deg, ${acd}, ${ac}); color:#fff; padding:38px 24px; flex-shrink:0; }
    .${prefix} .layout-modern .rsb .rph { width:130px; height:130px; object-fit:cover; margin:0 auto 20px; display:block; border:2.5px solid rgba(255,255,255,.2); }
    .${prefix} .layout-modern .rsb .rn { font-size:18px; font-weight:800; text-align:center; color:#fff; margin-bottom:2px; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-modern .rsb .rt { font-size:10px; text-align:center; opacity:.7; color:#fff; margin-bottom:24px; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-modern .rsb .sbs { margin-bottom:20px; }
    .${prefix} .layout-modern .rsb .sbt { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; opacity:.6; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,.15); color:#fff; font-family:'${f.sectionTitle}',sans-serif; }
    .${prefix} .layout-modern .rsb .ci { display:flex; align-items:flex-start; gap:6px; font-size:9.5px; margin-bottom:6px; opacity:.9; word-break:break-all; color:#fff; font-family:'${f.contact}',sans-serif; }
    .${prefix} .layout-modern .rsb .ci i { width:12px; text-align:center; font-size:10px; opacity:.6; margin-top:2px; flex-shrink:0; }
    .${prefix} .layout-modern .rsb .sbsk { display:inline-block; padding:2px 7px; background:rgba(255,255,255,.15); border-radius:3px; font-size:9px; margin:0 4px 4px 0; color:#fff; font-family:'${f.skills}',sans-serif; }
    .${prefix} .layout-modern .rsb .sblg { font-size:9.5px; margin-bottom:5px; opacity:.9; color:#fff; }
    .${prefix} .layout-modern .rmn { flex:1; padding:32px 26px; display:flex; flex-direction:column; overflow:hidden; }
    .${prefix} .layout-modern .rmn .rbdi { flex:1; }
    .${prefix} .layout-elegant .rh { text-align:center; padding:40px 60px 20px; border-bottom:2px solid ${ac}; }
    .${prefix} .layout-elegant .rph { width:100px; height:100px; object-fit:cover; margin:0 auto 14px; display:block; border:2.5px solid ${ac}; }
    .${prefix} .layout-elegant .rn { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; letter-spacing:1px; margin-bottom:4px; color:${headerColor}; }
    .${prefix} .layout-elegant .rt { font-size:11px; color:${ac}; font-weight:500; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-elegant .rct { display:flex; justify-content:center; flex-wrap:wrap; gap:5px 14px; font-size:9.5px; color:${contactColor}; font-family:'${f.contact}',sans-serif; }
    .${prefix} .layout-elegant .rct i { color:${contactColor}; }
    .${prefix} .layout-elegant .rbd { padding:30px 60px; flex:1; overflow:hidden; }
    .${prefix} .layout-compact .rh { background:${ac}; color:#fff; padding:20px 36px; display:flex; align-items:center; gap:20px; }
    .${prefix} .layout-compact .rph { width:62px; height:62px; object-fit:cover; border:2px solid rgba(255,255,255,.3); flex-shrink:0; }
    .${prefix} .layout-compact .rhi { flex:1; }
    .${prefix} .layout-compact .rn { font-size:19px; font-weight:800; color:#fff; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-compact .rt { font-size:10px; opacity:.8; color:#fff; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-compact .rct { display:flex; flex-wrap:wrap; gap:5px 10px; font-size:8.5px; opacity:.85; margin-top:3px; color:#fff; font-family:'${f.contact}',sans-serif; }
    .${prefix} .layout-compact .rct span { display:flex; align-items:center; gap:3px; }
    .${prefix} .layout-compact .rbd { padding:24px 36px; display:grid; grid-template-columns:1fr 1fr; gap:20px 28px; flex:1; overflow:hidden; }
    .${prefix} .layout-compact .rsc.fw { grid-column:1/-1; }
    .${prefix} .layout-creative { position:relative; }
    .${prefix} .layout-creative::before { content:''; position:absolute; left:0; top:0; bottom:0; width:6px; background:linear-gradient(180deg, ${ac}, ${acd}); }
    .${prefix} .layout-creative .rh { padding:38px 44px 30px 52px; display:flex; align-items:flex-end; gap:24px; border-bottom:1px solid #e5e7eb; }
    .${prefix} .layout-creative .rph { width:96px; height:96px; object-fit:cover; box-shadow:0 4px 12px rgba(0,0,0,.15); flex-shrink:0; }
    .${prefix} .layout-creative .rn { font-size:26px; font-weight:900; margin-bottom:2px; color:${headerColor}; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-creative .rt { font-size:12px; color:${ac}; font-weight:600; margin-bottom:10px; font-family:'${f.header}',sans-serif; }
    .${prefix} .layout-creative .rct { display:flex; flex-wrap:wrap; gap:6px 14px; font-size:10px; color:${contactColor}; font-family:'${f.contact}',sans-serif; }
    .${prefix} .layout-creative .rct span { display:flex; align-items:center; gap:4px; }
    .${prefix} .layout-creative .rct i { color:${ac}; }
    .${prefix} .layout-creative .rbd { padding:28px 44px 30px 52px; flex:1; overflow:hidden; }
    .${prefix} .rsc { margin-bottom:20px; }
    .${prefix} .rsc:last-child { margin-bottom:0; }
    .${prefix} .rst { font-size:11.5px; font-weight:800; color:${sectionTitleColor}; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:8px; padding-bottom:3px; border-bottom:2px solid ${sectionTitleBorder}; display:flex; align-items:center; gap:5px; font-family:'${f.sectionTitle}',sans-serif; }
    .${prefix} .rst i { font-size:10px; opacity:.6; }
    .${prefix} .rtx { font-size:10px; color:${bodyColor}; line-height:1.65; white-space:pre-line; opacity:.85; font-family:'${f.body}',sans-serif; }
    .${prefix} .ren { margin-bottom:14px; }
    .${prefix} .ren:last-child { margin-bottom:0; }
    .${prefix} .reh { display:flex; justify-content:space-between; align-items:baseline; gap:6px; margin-bottom:1px; }
    .${prefix} .ret { font-size:11px; font-weight:700; color:${bodyColor}; font-family:'${f.body}',sans-serif; }
    .${prefix} .red { font-size:9px; color:#9ca3af; white-space:nowrap; font-weight:500; }
    .${prefix} .res { font-size:10px; color:${ac}; font-weight:600; margin-bottom:2px; font-family:'${f.body}',sans-serif; }
    .${prefix} .redc { font-size:9.5px; color:${bodyColor}; line-height:1.55; white-space:pre-line; opacity:.85; font-family:'${f.body}',sans-serif; }
    .${prefix} .relk { font-size:9px; color:${ac}; text-decoration:none; }
    .${prefix} .rsg { display:flex; flex-wrap:wrap; gap:5px; }
    .${prefix} .rsk { padding:2px 8px; background:${skillsBg}; color:${skillsColor}; border-radius:3px; font-size:9.5px; font-weight:600; border:1px solid ${skillsBorder}; font-family:'${f.skills}',sans-serif; }
    .${prefix} .rcert { display:flex; align-items:center; gap:10px; margin-bottom:11px; }
    .${prefix} .rcert:last-child { margin-bottom:0; }
    .${prefix} .rcb { width:42px; height:42px; object-fit:contain; border-radius:3px; background:#fff; border:1px solid #e5e7eb; padding:2px; flex-shrink:0; }
    .${prefix} .rcn { font-size:10.5px; font-weight:700; color:${bodyColor}; }
    .${prefix} .rcm { font-size:9px; color:#6b7280; }
    .${prefix} .rcl { font-size:8.5px; color:${ac}; text-decoration:none; }
    .${prefix} .rlgs { display:flex; flex-wrap:wrap; gap:6px 22px; }
    .${prefix} .rln { font-size:10px; font-weight:700; color:${bodyColor}; }
    .${prefix} .rll { font-size:9px; color:#6b7280; }
    .${prefix} .rints { display:flex; flex-wrap:wrap; gap:5px; }
    .${prefix} .rint { padding:2px 9px; background:#f3f4f6; border-radius:100px; font-size:9.5px; color:${skillsColor}; font-weight:500; }
    .${prefix} .rdcl { margin-top:auto; padding:20px 46px 28px; border-top:1px solid #e5e7eb; }
    .${prefix} .layout-creative .rdcl { padding-left:52px; }
    .${prefix} .layout-elegant .rdcl { padding-left:60px; padding-right:60px; }
    .${prefix} .layout-compact .rdcl { padding:20px 36px 24px; grid-column:1/-1; }
    .${prefix} .layout-modern .rdcl { padding:20px 26px 24px; }
    .${prefix} .rdclt { font-size:10.5px; font-weight:800; color:${sectionTitleColor}; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:8px; padding-bottom:3px; border-bottom:2px solid ${sectionTitleBorder}; font-family:'${f.sectionTitle}',sans-serif; }
    .${prefix} .rdctx { font-size:9.5px; color:${declColor}; line-height:1.65; font-style:italic; margin-bottom:16px; opacity:.85; font-family:'${f.declaration}',sans-serif; }
    .${prefix} .rdcf { display:flex; justify-content:space-between; align-items:flex-end; gap:14px; }
    .${prefix} .rdcm { font-size:9px; color:${declColor}; flex-shrink:0; font-family:'${f.declaration}',sans-serif; }
    .${prefix} .rdcs { text-align:center; flex-shrink:0; }
    .${prefix} .rdcs img { max-height:60px; object-fit:contain; display:block; margin:0 auto 2px; }
    .${prefix} .rdcs .sigln { height:1px; background:#9ca3af; margin:0 auto 4px; }
    .${prefix} .rdcs .sign { font-size:10px; font-weight:700; color:${declColor}; font-family:'${f.declaration}',sans-serif; }`;
}

/* ================= PDF DOWNLOAD ================= */
async function downloadPDF() {
    toast('Generating PDF...', 'inf');
    const st = S.settings;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;top:0;left:-99999px;width:794px;height:1123px;background:#fff;z-index:-1;';
    wrap.className = 'pdfwrap';
    const styleTag = document.createElement('style');
    styleTag.textContent = buildOffscreenStyles('pdfwrap');
    document.head.appendChild(styleTag);
    wrap.innerHTML = `<div class="rcontent layout-${st.layout} spacing-${st.spacing}">${buildResumeHTML()}</div>`;
    document.body.appendChild(wrap);
    const shape = S.personal.photoShape || 'circle';
    const shapeMap = {circle:'50%',rounded:'12px',square:'0',hex:'0'};
    wrap.querySelectorAll('.rph').forEach(el => {
        el.style.borderRadius = shapeMap[shape];
        if (shape === 'hex') el.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
    });
    const imgs = wrap.querySelectorAll('img');
    await Promise.all([...imgs].map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = img.onerror = res; setTimeout(res, 2000); });
    }));
    await new Promise(r => setTimeout(r, 300));
    try {
        const canvas = await html2canvas(wrap, {
            scale: 2, useCORS: true, allowTaint: true, logging: false,
            backgroundColor: '#ffffff', width: 794, height: 1123
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save(`${S.personal.fullName || 'Resume'}_Resume.pdf`);
        toast('PDF downloaded!', 'ok');
    } catch(e) {
        console.error('PDF error:', e);
        toast('PDF failed - try Print instead', 'err');
    } finally {
        setTimeout(() => {
            if (wrap.parentNode) wrap.remove();
            if (styleTag.parentNode) styleTag.remove();
        }, 1000);
    }
}

/* ================= PRINT ================= */
function doPrint() {
    toast('Preparing print...', 'inf');
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    const stylesheets = [...document.styleSheets].filter(ss => {
        try { return ss.href && (ss.href.includes('font-awesome') || ss.href.includes('fonts.googleapis')); }
        catch(e) { return false; }
    }).map(ss => `<link rel="stylesheet" href="${ss.href}">`).join('');
    const resumeHTML = buildResumeHTML();
    const st = S.settings;
    const printDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Resume</title>
${stylesheets}
<style>
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }
html, body { width:210mm; height:297mm; background:#fff; }
.rpage { width:210mm; height:297mm; background:#fff; position:relative; overflow:hidden; }
${buildOffscreenStyles('rpage').replace(/\.rpage {[^}]+}/, '')}
</style>
</head>
<body>
<div class="rpage">
<div class="rcontent layout-${st.layout} spacing-${st.spacing}">${resumeHTML}</div>
</div>
</body>
</html>`;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(printDoc);
    doc.close();
    const shape = S.personal.photoShape || 'circle';
    const shapeMap = {circle:'50%',rounded:'12px',square:'0',hex:'0'};
    setTimeout(() => {
        try {
            doc.querySelectorAll('.rph').forEach(el => {
                el.style.borderRadius = shapeMap[shape];
                if (shape === 'hex') el.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
            });
        } catch(e){}
    }, 100);
    setTimeout(() => {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            toast('Print dialog opened', 'ok');
        } catch(e) {
            console.error(e);
            toast('Print failed', 'err');
        }
        setTimeout(() => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1500);
    }, 800);
}

/* ================= PNG ================= */
async function downloadPNG() {
    toast('Generating image...', 'inf');
    const st = S.settings;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;top:0;left:-99999px;width:794px;height:1123px;background:#fff;z-index:-1;';
    wrap.className = 'pngwrap';
    const styleTag = document.createElement('style');
    styleTag.textContent = buildOffscreenStyles('pngwrap');
    document.head.appendChild(styleTag);
    wrap.innerHTML = `<div class="rcontent layout-${st.layout} spacing-${st.spacing}">${buildResumeHTML()}</div>`;
    document.body.appendChild(wrap);
    const shape = S.personal.photoShape || 'circle';
    const shapeMap = {circle:'50%',rounded:'12px',square:'0',hex:'0'};
    wrap.querySelectorAll('.rph').forEach(el => {
        el.style.borderRadius = shapeMap[shape];
        if (shape === 'hex') el.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
    });
    const imgs = wrap.querySelectorAll('img');
    await Promise.all([...imgs].map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = img.onerror = res; setTimeout(res, 2000); });
    }));
    await new Promise(r => setTimeout(r, 300));
    try {
        const canvas = await html2canvas(wrap, {
            scale: 2, useCORS: true, allowTaint: true, logging: false,
            backgroundColor: '#ffffff', width: 794, height: 1123
        });
        canvas.toBlob(blob => {
            if (!blob) { toast('PNG failed', 'err'); return; }
            saveAs(blob, `${S.personal.fullName || 'Resume'}_Resume.png`);
            toast('Image downloaded!', 'ok');
        }, 'image/png', 1.0);
    } catch(e) {
        console.error('PNG error:', e);
        toast('PNG failed', 'err');
    } finally {
        setTimeout(() => {
            if (wrap.parentNode) wrap.remove();
            if (styleTag.parentNode) styleTag.remove();
        }, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
})();