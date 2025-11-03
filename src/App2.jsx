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

// --- Data definitions ---
// removed inline PRODUCTS array — use JSON data
const PRODUCTS = productData.products;
const SIZES = ["XS","S","M","L","XL","XXL"];
const EVENT_TYPES = ["All","Festival","Corporate","Wedding","Sports","Casual"];
const TEMPLATES = [
  { id: 'fest1', name: 'Sunburst Fest', event: 'Festival', canColor:true, svg: (color)=> (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="40" fill={color} opacity="0.95" />
      {[...Array(12)].map((_,i)=> (
        <rect key={i} x="98" y="0" width="4" height="30" transform={`rotate(${30*i} 100 100)`} fill={color} opacity="0.6" />
      ))}
    </svg>
  )},
  { id: 'corp1', name: 'Corporate Badge', event: 'Corporate', canColor:false, svg: ()=> (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="140" height="120" rx="10" fill="#fff" stroke="#222" />
      <text x="100" y="95" textAnchor="middle" fontSize="20" fontWeight="700">COMPANY</text>
      <text x="100" y="125" textAnchor="middle" fontSize="12" fill="#555">2025 EVENT</text>
    </svg>
  )},
  { id: 'wedding1', name: 'Wedding Script', event: 'Wedding', canColor:true, svg: (color)=> (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="100" textAnchor="middle" fontSize="26" fontFamily="serif" fontWeight="600" fill={color}>A & J</text>
      <text x="100" y="130" textAnchor="middle" fontSize="10" fill="#333">June 12, 2026</text>
    </svg>
  )},
  { id: 'sports1', name: 'Team Shield', event: 'Sports', canColor:true, svg: (color)=> (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 L150 60 L140 140 L60 140 L50 60 Z" fill={color} opacity="0.95" />
      <text x="100" y="110" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">TEAM</text>
    </svg>
  )},
  { id: 'casual1', name: 'Simple Text', event: 'Casual', canColor:true, svg: (color)=> (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="105" textAnchor="middle" fontSize="32" fontWeight="700" fill={color}>HELLO</text>
    </svg>
  )},
];
const ICON_LIBRARY = [
  { id: 'star', label: 'Star', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M12 2 L15 9 L22 9 L17 14 L19 21 L12 17 L5 21 L7 14 L2 9 L9 9 Z" fill="currentColor"/></svg>},
  { id: 'heart', label: 'Heart', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-4.35-9-7.05C-1.1 8.9 4 3.5 8.5 6.5 10.2 7.7 12 9.2 12 9.2s1.8-1.5 3.5-2.7C20 3.5 25.1 8.9 21 13.95 19 16.65 12 21 12 21z" fill="currentColor"/></svg>},
  { id: 'leaf', label: 'Leaf', svg: <svg viewBox="0 0 24 24" style={{width: 40, height: 40}} xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-4 4-8 8-12 12 1-7 7-11 12-12z" fill="currentColor"/></svg>},
];

function toDisplayColor(product, colId){
  const found = product?.variants?.colors?.find(c => c.id === colId);
  return found?.hex || colId;
}

function contrastColor(hex){
  if(!hex) return '#111';
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const lum = (0.2126*r + 0.7152*g + 0.0722*b)/255;
  return lum > 0.65 ? '#111' : '#fff';
}

// Hero Homepage Component
function HeroPage({onStartCreating}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
      }} />
      
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo/Brand */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: 'white',
          marginBottom: 24,
          letterSpacing: -2
        }}>
          BOSS
        </div>
        
        {/* Tagline */}
        <h1 style={{
          fontSize: 42,
          fontWeight: 700,
          color: 'white',
          marginBottom: 16,
          lineHeight: 1.2
        }}>
          Custom Merch Designer
        </h1>
        
        <p style={{
          fontSize: 20,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: 48,
          maxWidth: 600,
          margin: '0 auto 48px'
        }}>
          Create personalized apparel and accessories in minutes. Choose your product, pick a template, add your text, and bring your design to life.
        </p>
        
        {/* Feature Pills */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 48
        }}>
          {['Easy Customization', 'Live Preview', 'Multiple Templates', 'Instant Design'].map(feature => (
            <div key={feature} style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 999,
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {feature}
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <button
          onClick={onStartCreating}
          style={{
            padding: '18px 48px',
            fontSize: 18,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #c69c6d 0%, #a8845f 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(198,156,109,0.4)',
            transition: 'all 0.3s',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(198,156,109,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(198,156,109,0.4)';
          }}
        >
          Start Creating
        </button>
        
        {/* Bottom Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 32,
          marginTop: 80,
          maxWidth: 800,
          margin: '80px auto 0'
        }}>
          {[
            {label: 'Products', value: '4+'},
            {label: 'Templates', value: '5+'},
            {label: 'Colors', value: '12+'},
            {label: 'Positions', value: 'Multiple'}
          ].map(stat => (
            <div key={stat.label}>
              <div style={{fontSize: 32, fontWeight: 700, color: '#c69c6d', marginBottom: 8}}>
                {stat.value}
              </div>
              <div style={{fontSize: 14, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1}}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate Preview Component
function ProductPreview({product, color, position, chosenTemplate, accent, selectedIcon, personalText, font, width=300, height=300}) {
  const bg = toDisplayColor(product, color);
  const imgSrc = product.image;
  const pos = product?.customizablePositions?.find(p=>p.id===position) || null;
  const textColor = contrastColor(bg.replace(/\s+/g,''));

  const overlayPctW = pos ? Math.min(60, Math.max(20, pos.maxWidth * 4)) : 50;
  const overlayPctH = pos ? Math.min(60, Math.max(20, pos.maxHeight * 4)) : 50;

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
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{width: '85%', height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '100%', height: '100%'}}>
                {chosenTemplate.svg(chosenTemplate.canColor ? accent : '#222')}
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

// Sidebar Preview Component (Desktop/Tablet)
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

export default function AppWithHeroPage (){
  const [showHero, setShowHero] = useState(true);
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find(p=>p.id===productId);

  const [color, setColor] = useState(()=> product?.variants?.colors?.[0]?.id || 'black');
  const [size, setSize] = useState(()=> product?.variants?.sizes?.[0] || 'N/A');
  const [position, setPosition] = useState(()=> product?.customizablePositions?.[0]?.id || '');

  const [eventFilter, setEventFilter] = useState('All');
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);

  const [personalText, setPersonalText] = useState('');
  const [font, setFont] = useState('Inter');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [accent, setAccent] = useState('#3b82f6');

  const [queue, setQueue] = useState([]);

  useEffect(()=> {
    const availableColorIds = product?.variants?.colors?.map(c=>c.id) || [];
    if(!availableColorIds.includes(color)) setColor(availableColorIds[0] || 'black');

    if(!product?.variants?.sizes) setSize('N/A');
    else if(!product.variants.sizes.includes(size)) setSize(product.variants.sizes[0]);

    const availablePositions = product?.customizablePositions?.map(p=>p.id) || [];
    if(!availablePositions.includes(position)) setPosition(availablePositions[0] || '');
  }, [productId]);

  const filteredTemplates = TEMPLATES.filter(t=> eventFilter==='All' ? true : t.event===eventFilter);
  const chosenTemplate = TEMPLATES.find(t=>t.id===templateId) || TEMPLATES[0];

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

  const stepButtonStyle = (isActive, isPast) => ({
    padding: '8px 16px',
    borderRadius: 8,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? '#1e293b' : isPast ? '#dcfce7' : '#f1f5f9',
    color: isActive ? 'white' : isPast ? '#166534' : '#64748b',
    boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
  });

  if (showHero) {
    return <HeroPage onStartCreating={() => setShowHero(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      padding: 24
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .preview-sidebar {
            order: -1 !important;
          }
          .main-content-area {
            order: 1 !important;
          }
        }
      `}</style>
      
      <div style={{maxWidth: 1280, margin: '0 auto'}}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: 32,
          marginBottom: 24
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
            <h1 style={{fontSize: 30, fontWeight: 700, color: '#1e293b', margin: 0}}>
              Custom Merch Designer
            </h1>
            <button
              onClick={() => setShowHero(true)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              ← Home
            </button>
          </div>

          {/* Elegant Step Progress */}
          <div style={{marginBottom: 48, padding: '0 16px'}}>
            <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {/* Progress Line Background */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: '5%',
                right: '5%',
                height: 2,
                background: '#e2e8f0',
                zIndex: 0
              }} />
              
              {/* Progress Line Fill */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: '5%',
                width: `${((step - 1) / 4) * 90}%`,
                height: 2,
                background: '#1e293b',
                transition: 'width 0.3s ease',
                zIndex: 0
              }} />

              {/* Step Items */}
              {[
                {num: 1, label: 'Select Product', short: 'Product'},
                {num: 2, label: 'Color & Size', short: 'Options'},
                {num: 3, label: 'Pick Template', short: 'Template'},
                {num: 4, label: 'Personalize', short: 'Customize'},
                {num: 5, label: 'Review', short: 'Review'}
              ].map((s, i) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                
                return (
                  <div 
                    key={s.num}
                    onClick={() => setStep(s.num)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {/* Circle */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: isCompleted ? '#16a34a' : isActive ? '#1e293b' : 'white',
                      border: isCompleted ? 'none' : isActive ? '3px solid #1e293b' : '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 16,
                      color: isCompleted || isActive ? 'white' : '#94a3b8',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(30,41,59,0.2)' : 'none',
                      marginBottom: 8
                    }}>
                      {isCompleted ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : s.num}
                    </div>
                    
                    {/* Label - full on desktop, short on mobile */}
                    <div style={{
                      fontSize: isActive ? 13 : 12,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#1e293b' : '#64748b',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{display: window.innerWidth >= 768 ? 'inline' : 'none'}}>
                        {s.label}
                      </span>
                      <span style={{display: window.innerWidth >= 768 ? 'none' : 'inline'}}>
                        {s.short}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 32}}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32
            }}>
              <div className="main-content-area" style={{gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1'}}>
                {step===1 && (
                  <div>
                    <h2 style={{fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24}}>
                      Choose Your Product
                    </h2>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24}}>
                      {PRODUCTS.map(p=> (
                        <div 
                          key={p.id} 
                          style={{
                            borderRadius: 12,
                            border: productId===p.id ? '2px solid #1e293b' : '2px solid #e2e8f0',
                            background: productId===p.id ? '#f8fafc' : 'white',
                            boxShadow: productId===p.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onClick={()=>{setProductId(p.id); setStep(2);}}
                        >
                          <div style={{
                            aspectRatio: '1',
                            background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            padding: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                          </div>
                          <div style={{padding: 16}}>
                            <h3 style={{fontWeight: 600, color: '#1e293b', marginBottom: 4}}>{p.name}</h3>
                            <p style={{fontSize: 14, color: '#64748b', textTransform: 'capitalize'}}>{p.type}</p>
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
                            <button 
                              key={col.id} 
                              onClick={()=>setColor(col.id)} 
                              title={col.name}
                              style={{
                                background: toDisplayColor(product, col.id),
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                border: color===col.id ? '4px solid #1e293b' : '2px solid #e2e8f0',
                                outline: color===col.id ? '2px solid white' : 'none',
                                outlineOffset: color===col.id ? 2 : 0,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                              }}
                            />
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
                        <div 
                          key={t.id} 
                          style={{
                            borderRadius: 12,
                            border: templateId===t.id ? '2px solid #1e293b' : '2px solid #e2e8f0',
                            background: templateId===t.id ? '#f8fafc' : 'white',
                            boxShadow: templateId===t.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onClick={()=>{ setTemplateId(t.id); setStep(4); }}
                        >
                          <div style={{
                            aspectRatio: '1',
                            background: 'white',
                            padding: 24,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{width: 120, height: 120}}>
                              {t.svg(t.canColor?accent:'#222')}
                            </div>
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

              <div className="preview-sidebar" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
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
          <p>Custom Merch Designer • Create personalized products in minutes</p>
        </div>
      </div>
    </div>
  );
}