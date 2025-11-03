/*
Made to Order - Single-file React component (App.jsx)

How to run:
1. Create a Vite React app:
   npm create vite@latest my-app -- --template react
   cd my-app
2. Install TailwindCSS (recommended):
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   Configure tailwind.config.js and add Tailwind directives to index.css.
   (Or remove Tailwind classes and use your own CSS.)
3. Replace src/App.jsx with this file content and run:
   npm install
   npm run dev

This single-file demo implements:
- Product selection
- Color & size (size only for apparel)
- Template gallery with event filters
- Personalization (text, font, placement) and patch/icon selection
- Live preview updating in real time
- Review & submit -> adds job to a print queue saved in localStorage

Note: This is a frontend-only demo and uses inline SVGs as templates/placeholders.
*/ 

import React, { useState, useEffect } from "react";
import productData from "./data/products.json";
import templateData from "./data/template.json";

// --- Data definitions ---
const PRODUCTS = productData.products;
const SIZES = ["XS","S","M","L","XL","XXL"];
const EVENT_TYPES = ["All","Festival","Corporate","Wedding","Sports","Casual"];
const ICON_LIBRARY = [
  { id: 'star', label: 'Star', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M12 2 L15 9 L22 9 L17 14 L19 21 L12 17 L5 21 L7 14 L2 9 L9 9 Z" fill="currentColor"/></svg>},
  { id: 'heart', label: 'Heart', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-4.35-9-7.05C-1.1 8.9 4 3.5 8.5 6.5 10.2 7.7 12 9.2 12 9.2s1.8-1.5 3.5-2.7C20 3.5 25.1 8.9 21 13.95 19 16.65 12 21 12 21z" fill="currentColor"/></svg>},
  { id: 'leaf', label: 'Leaf', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-4 4-8 8-12 12 1-7 7-11 12-12z" fill="currentColor"/></svg>},
];

// --- Helpers ---
function toDisplayColor(product, colId){
  const found = product?.variants?.colors?.find(c => c.id === colId);
  return found?.hex || colId;
}

// new helper: get color-specific thumbnail image (fallback to null)
function getColorImage(product, colorId){
  const found = product?.variants?.colors?.find(c => c.id === colorId);
  return found?.image || null;
}

// new helper: get position preview image (fallback to null)
function getPositionPreview(product, posId){
  const found = product?.customizablePositions?.find(p => p.id === posId);
  return found?.previewImage || null;
}

// existing getProductImage helper (unchanged)...


function contrastColor(hex){
  if(!hex) return '#111';
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const lum = (0.2126*r + 0.7152*g + 0.0722*b)/255;
  return lum > 0.65 ? '#111' : '#fff';
}

// Separate Preview Component
function ProductPreview({product, color, position, chosenTemplate, accent, selectedIcon, personalText, font, width=300, height=300}) {
  const bg = toDisplayColor(product, color);
  const imgSrc = product.image;
  const pos = product?.customizablePositions?.find(p=>p.id===position) || null;
  const textColor = contrastColor(bg.replace(/\s+/g,''));

  const overlayPctW = pos ? Math.min(60, Math.max(20, pos.maxWidth * 4)) : 50;
  const overlayPctH = pos ? Math.min(60, Math.max(20, pos.maxHeight * 4)) : 50;

  const posPreviewSrc = getPositionPreview(product, position);

  return (
    <div style={{
      width,
      height,
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: Math.round(width * 0.82),
        height: Math.round(height * 0.86),
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={imgSrc}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            opacity: 0.95
          }}
        />

        <div style={{
          position: 'absolute',
          left: pos ? `${pos.previewCoords.x}%` : '50%',
          top: pos ? `${pos.previewCoords.y}%` : '50%',
          transform: 'translate(-50%,-50%)',
          width: `${overlayPctW}%`,
          height: `${overlayPctH}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{width: '100%', height: '100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
            <div style={{width: '85%', height: '65%', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:'100%', height:'100%'}}>
                { posPreviewSrc ? (
                  <img src={posPreviewSrc} alt={pos?.name || 'position'} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                ) : (
                  <div style={{width:110, height:110, margin:'0 auto'}}>
                    { chosenTemplate?.image ? (
                        <img src={chosenTemplate.image} alt={chosenTemplate.name} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                      ) : (
                        chosenTemplate.svg(chosenTemplate.canColor ? accent : '#222')
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedIcon && (
              <div style={{marginTop: 6, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {ICON_LIBRARY.find(ic=>ic.id===selectedIcon)?.svg}
              </div>
            )}

            {personalText && (
              <div style={{
                marginTop: 8,
                fontFamily: font,
                fontWeight: 700,
                fontSize: Math.max(10, Math.round(overlayPctW/3)) + 'px',
                color: textColor,
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.05
              }}>
                {personalText}
              </div>
            )}
          </div>
        </div>
      </div>

      {product.id==='tote' && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: '40%',
          width: '20%',
          height: 35,
          borderTopLeftRadius: 999,
          borderTopRightRadius: 999,
          border: '3px solid rgba(0,0,0,0.15)'
        }} />
      )}
    </div>
  );
}

// Sidebar Preview Component
function SidebarPreview({product, color, position, chosenTemplate, accent, selectedIcon, personalText, font}) {
  return (
    <div style={{background: 'white', border: '2px solid #e2e8f0', borderRadius: 12, padding: 16}}>
      <h3 style={{fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12}}>
        Quick Preview
      </h3>
      <div style={{
        background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
        padding: 16,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ProductPreview 
          product={product}
          color={color}
          position={position}
          chosenTemplate={chosenTemplate}
          accent={accent}
          selectedIcon={selectedIcon}
          personalText={personalText}
          font={font}
          width={220}
          height={220}
        />
      </div>
    </div>
  );
}

// Print Queue Component
function PrintQueue({queue, onClearQueue}) {
  return (
    <div style={{background: 'white', border: '2px solid #e2e8f0', borderRadius: 12, padding: 16}}>
      <h3 style={{fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12}}>
        Print Queue
      </h3>
      <div style={{maxHeight: 384, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8}}>
        {queue.length===0 ? (
          <div style={{textAlign: 'center', padding: '32px 0', color: '#94a3b8'}}>
            <svg style={{width: 48, height: 48, margin: '0 auto 8px', opacity: 0.5}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{fontSize: 14}}>No queued designs</p>
          </div>
        ) : (
          queue.map(j=> (
            <div key={j.id} style={{padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0'}}>
              <div style={{fontWeight: 500, fontSize: 14, color: '#1e293b'}}>{j.product}</div>
              <div style={{fontSize: 12, color: '#64748b', marginTop: 4}}>
                {j.color} • {j.size}
              </div>
              <div style={{fontSize: 12, color: '#94a3b8', marginTop: 4}}>
                {new Date(j.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      {queue.length > 0 && (
        <button 
          onClick={onClearQueue} 
          style={{
            width: '100%',
            marginTop: 12,
            padding: '8px 16px',
            fontSize: 14,
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            fontWeight: 500,
            background: 'white',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          Clear Queue
        </button>
      )}
    </div>
  );
}

// helper: templates for product
function getTemplatesForProduct(productId) {
  return templateData?.templatesByProduct?.[productId] || [];
}

// --- Main App ---
export default function App(){
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find(p=>p.id===productId);

  // initialize templateId based on product
  const [templateId, setTemplateId] = useState(()=>{
    const initialTemplates = getTemplatesForProduct(PRODUCTS[0].id);
    return initialTemplates[0]?.id || '';
  });

  const [color, setColor] = useState(()=> product?.variants?.colors?.[0]?.id || 'black');
  const [size, setSize] = useState(()=> product?.variants?.sizes?.[0] || 'N/A');
  const [position, setPosition] = useState(()=> product?.customizablePositions?.[0]?.id || '');

  const [eventFilter, setEventFilter] = useState('All');
  const [personalText, setPersonalText] = useState('');
  const [font, setFont] = useState('Inter');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [accent, setAccent] = useState('#3b82f6');

  const [queue, setQueue] = useState([]);

  useEffect(()=> {
    // when product changes, reset color/size/position to available values
    const availableColorIds = product?.variants?.colors?.map(c=>c.id) || [];
    if(!availableColorIds.includes(color)) setColor(availableColorIds[0] || 'black');

    if(!product?.variants?.sizes) setSize('N/A');
    else if(!product.variants.sizes.includes(size)) setSize(product.variants.sizes[0]);

    const availablePositions = product?.customizablePositions?.map(p=>p.id) || [];
    if(!availablePositions.includes(position)) setPosition(availablePositions[0] || '');

    // reset templates for the new product
    const templatesForProduct = getTemplatesForProduct(productId);
    if(templatesForProduct.length && !templatesForProduct.find(t=>t.id===templateId)){
      setTemplateId(templatesForProduct[0].id);
    } else if(!templatesForProduct.length) {
      setTemplateId('');
    }
  }, [productId, product, color, size, position, templateId]);

  // use templates for current product
  const templatesForProduct = getTemplatesForProduct(productId);
  const filteredTemplates = templatesForProduct.filter(t=> eventFilter==='All' ? true : t.event===eventFilter);
  const chosenTemplate = templatesForProduct.find(t=>t.id===templateId) || templatesForProduct[0] || { id:'', name:'', image: null, canColor:false };

  function goNext(){
    if(step===1 && !productId) return alert('Pick a product');
    if(step===2 && product.type==='apparel' && !size) return alert('Choose a size');
    setStep(s=>Math.min(5, s+1));
  }
  function goPrev(){ setStep(s=>Math.max(1,s-1)); }

  function handleSubmit(){
    const job = {
      id: 'job_'+Date.now(),
      product: product.name,
      productId: product.id,
      color, size, position,
      templateId,
      personalText, font, selectedIcon, accent,
      createdAt: new Date().toISOString(),
    };
    setQueue(q=>[job,...q]);
    setStep(1);
    alert('Design queued for print!');
  }

  // stepButtonStyle removed — using Tailwind classes instead

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Made to Order</h1>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {['Select Product','Color & Size','Pick Template','Personalize','Review'].map((t,i)=> (
              <button 
                key={t} 
                onClick={()=>setStep(i+1)} 
                className={"whitespace-nowrap px-3 py-2 rounded-md font-medium text-sm " + (step===i+1 ? 'bg-slate-800 text-white shadow' : step > i+1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-500')}
              >
                {i+1}. {t}
              </button>
            ))}
          </div>

          <div className="grid gap-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {step===1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Choose Your Product</h2>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
                      {PRODUCTS.map(p=> (
                        <div 
                          key={p.id}
                          onClick={()=>{setProductId(p.id); setStep(2);}}
                          className={`rounded-lg transition-all cursor-pointer border ${productId===p.id ? 'border-slate-800 bg-slate-50 shadow' : 'border-gray-200 bg-white'} overflow-hidden flex flex-col`}
                        >
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="px-4 py-3 border-t">
                            <h3 className="font-semibold text-slate-900 truncate">{p.name}</h3>
                            <p className="text-sm text-slate-500 capitalize truncate">{p.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step===2 && (
                  <div>
                    <h2 style={{fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24}}>
                      Customize Options
                    </h2>
                    
                    <div style={{background: '#f8fafc', padding: 24, borderRadius: 12, marginBottom: 24}}>
                      <div style={{marginBottom: 24}}>
                        <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12}}>
                          Color
                        </label>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
                          {product.variants.colors.map(col=> (
                            getColorImage(product, col.id) ? (
                              <button key={col.id} onClick={()=>setColor(col.id)} title={col.name} className="group relative">
                                <img src={getColorImage(product, col.id)} alt={col.name} className={`w-12 h-12 rounded-lg object-contain transition-all ${color===col.id ? 'ring-4 ring-slate-800 ring-offset-2' : 'ring-2 ring-slate-200 hover:ring-slate-400'}`} />
                              </button>
                            ) : (
                              <button key={col.id} onClick={()=>setColor(col.id)} title={col.name} className="group relative">
                                <div style={{background: toDisplayColor(product, col.id)}} className={`w-12 h-12 rounded-lg transition-all ${color===col.id ? 'ring-4 ring-slate-800 ring-offset-2' : 'ring-2 ring-slate-200 hover:ring-slate-400'}`} />
                              </button>
                            )
                          ))}
                        </div>
                      </div>

                      {product.variants.sizes && (
                        <div style={{marginBottom: 24}}>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12}}>
                            Size
                          </label>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                            {product.variants.sizes.map(s=> (
                              <button 
                                key={s} 
                                onClick={()=>setSize(s)} 
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: 8,
                                  fontWeight: 500,
                                  transition: 'all 0.2s',
                                  cursor: 'pointer',
                                  background: size===s ? '#1e293b' : 'white',
                                  color: size===s ? 'white' : '#334155',
                                  border: size===s ? 'none' : '1px solid #e2e8f0',
                                  boxShadow: size===s ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                                }}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12}}>
                          Design Position
                        </label>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                          {product.customizablePositions.map(pos=> (
                            <button 
                              key={pos.id} 
                              onClick={()=>setPosition(pos.id)} 
                              style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                background: position===pos.id ? '#1e293b' : 'white',
                                color: position===pos.id ? 'white' : '#334155',
                                border: position===pos.id ? 'none' : '1px solid #e2e8f0',
                                boxShadow: position===pos.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                              }}
                            >
                              {pos.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: 12}}>
                      <button 
                        onClick={goPrev} 
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          border: '2px solid #cbd5e1',
                          fontWeight: 500,
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Back
                      </button>
                      <button 
                        onClick={goNext} 
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          background: '#1e293b',
                          color: 'white',
                          fontWeight: 500,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Next: Templates
                      </button>
                    </div>
                  </div>
                )}

                {step===3 && (
                  <div>
                    <h2 style={{fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24}}>
                      Choose a Template
                    </h2>
                    
                    <div style={{marginBottom: 24}}>
                      <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                        Filter by Event Type
                      </label>
                      <select 
                        value={eventFilter} 
                        onChange={(e)=>setEventFilter(e.target.value)} 
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: '2px solid #e2e8f0',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        {EVENT_TYPES.map(ev=> <option key={ev} value={ev}>{ev}</option>)}
                      </select>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24}}>
                      {filteredTemplates.map(t=> (
                        <div key={t.id} className={`p-3 border rounded ${templateId===t.id? 'border-slate-800':'border-gray-200'}`}>
                          <div style={{width:120, height:120, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            { t.image ? (
                              <img src={t.image} alt={t.name} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                            ) : (
                              t.svg(t.canColor?accent:'#222')
                            )}
                          </div>
                          <div style={{padding: 16}}>
                            <h3 style={{fontWeight: 600, color: '#1e293b', marginBottom: 4}}>{t.name}</h3>
                            <p style={{fontSize: 12, color: '#64748b'}}>{t.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{display: 'flex', gap: 12}}>
                      <button 
                        onClick={goPrev} 
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          border: '2px solid #cbd5e1',
                          fontWeight: 500,
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {step===4 && (
                  <div>
                    <h2 style={{fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24}}>
                      Personalize Your Design
                    </h2>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                            Name / Initials / Text
                          </label>
                          <input 
                            value={personalText} 
                            onChange={e=>setPersonalText(e.target.value)} 
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #e2e8f0',
                              borderRadius: 8,
                              fontSize: 14,
                              outline: 'none'
                            }}
                            placeholder="Enter your text" 
                          />
                        </div>

                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                            Font Style
                          </label>
                          <select 
                            value={font} 
                            onChange={e=>setFont(e.target.value)} 
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '2px solid #e2e8f0',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontSize: 14
                            }}
                          >
                            <option>Inter</option>
                            <option>Georgia</option>
                            <option>Monospace</option>
                          </select>
                        </div>

                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                            Add Patch / Icon
                          </label>
                          <div style={{display: 'flex', gap: 12}}>
                            {ICON_LIBRARY.map(ic=> (
                              <button 
                                key={ic.id} 
                                onClick={()=>setSelectedIcon(selectedIcon===ic.id? null: ic.id)} 
                                style={{
                                  padding: 12,
                                  borderRadius: 8,
                                  border: selectedIcon===ic.id ? '2px solid #1e293b' : '2px solid #e2e8f0',
                                  background: selectedIcon===ic.id ? '#f8fafc' : 'white',
                                  transition: 'all 0.2s',
                                  cursor: 'pointer'
                                }}
                                title={ic.label}
                              >
                                {ic.svg}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                            Accent Color
                          </label>
                          <input 
                            type="color" 
                            value={accent} 
                            onChange={e=>setAccent(e.target.value)} 
                            style={{
                              height: 48,
                              width: 96,
                              borderRadius: 8,
                              border: '2px solid #e2e8f0',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                          Live Preview
                        </label>
                        <div style={{
                          background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                          padding: 24,
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ProductPreview 
                            product={product}
                            color={color}
                            position={position}
                            chosenTemplate={chosenTemplate}
                            accent={accent}
                            selectedIcon={selectedIcon}
                            personalText={personalText}
                            font={font}
                            width={280}
                            height={280}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: 12, marginTop: 24}}>
                      <button 
                        onClick={goPrev} 
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          border: '2px solid #cbd5e1',
                          fontWeight: 500,
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Back
                      </button>
                      <button 
                        onClick={()=>setStep(5)} 
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          background: '#1e293b',
                          color: 'white',
                          fontWeight: 500,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Next: Review
                      </button>
                    </div>
                  </div>
                )}

                {step===5 && (
                  <div>
                    <h2 style={{fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24}}>
                      Review & Confirm
                    </h2>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                        <div style={{background: '#f8fafc', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12}}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Product:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{product.name}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Color:</span>
                            <span style={{fontWeight: 600, color: '#1e293b', textTransform: 'capitalize'}}>{color}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Size:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{size}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Position:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{position || '—'}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Template:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{chosenTemplate.name}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Text:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{personalText || '—'}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: 500, color: '#64748b'}}>Icon:</span>
                            <span style={{fontWeight: 600, color: '#1e293b'}}>{selectedIcon || '—'}</span>
                          </div>
                        </div>
                        
                        <div style={{display: 'flex', gap: 12}}>
                          <button 
                            onClick={goPrev} 
                            style={{
                              flex: 1,
                              padding: '12px 24px',
                              borderRadius: 8,
                              border: '2px solid #cbd5e1',
                              fontWeight: 500,
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            Edit Design
                          </button>
                          <button 
                            onClick={handleSubmit} 
                            style={{
                              flex: 1,
                              padding: '12px 24px',
                              borderRadius: 8,
                              background: '#16a34a',
                              color: 'white',
                              fontWeight: 500,
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                          >
                            Confirm & Submit
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8}}>
                          Final Preview
                        </label>
                        <div style={{
                          background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                          padding: 24,
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ProductPreview 
                            product={product}
                            color={color}
                            position={position}
                            chosenTemplate={chosenTemplate}
                            accent={accent}
                            selectedIcon={selectedIcon}
                            personalText={personalText}
                            font={font}
                            width={320}
                            height={320}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                <SidebarPreview 
                  product={product}
                  color={color}
                  position={position}
                  chosenTemplate={chosenTemplate}
                  accent={accent}
                  selectedIcon={selectedIcon}
                  personalText={personalText}
                  font={font}
                />

                <PrintQueue 
                  queue={queue}
                  onClearQueue={() => setQueue([])}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{textAlign: 'center', fontSize: 14, color: '#64748b'}}>
          <p>Made to Order • Create personalized products in minutes</p>
        </div>
      </div>
    </div>
  );
}