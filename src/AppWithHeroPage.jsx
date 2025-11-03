
import React, { useState, useEffect } from "react";
import productData from "./data/aptos_products.json";
import templateData from "./data/aptos_template.json";
import { motion } from "framer-motion";
// ensure build tools that check for 'unused' detect runtime usage in JSX
void motion;

// --- Data definitions ---
const PRODUCTS = productData.products;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const EVENT_TYPES = ["All", "Festival", "Corporate", "Wedding", "Sports", "Casual"];

// helper to get templates for a product
function getTemplatesForProduct(productId, positionId = null) {
  const list = templateData?.templatesByProduct?.[productId] || [];
  if (!positionId) return list;
  return list.filter(t => {
    // support templates without positions (treat as global) or with explicit positions array
    if (!t.positions || t.positions.length === 0) return false;
    return t.positions.includes(positionId);
  });
}

function toDisplayColor(product, colId) {
  const found = product?.variants?.colors?.find(c => c.id === colId);
  return found?.hex || colId;
}

function contrastColor(hex) {
  if (!hex) return '#111';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.65 ? '#111' : '#fff';
}

const ICON_LIBRARY = [
  { id: 'star', label: 'Star', svg: <svg viewBox="0 0 24 24" style={{ width: 40, height: 40 }} xmlns="http://www.w3.org/2000/svg"><path d="M12 2 L15 9 L22 9 L17 14 L19 21 L12 17 L5 21 L7 14 L2 9 L9 9 Z" fill="currentColor" /></svg> },
  { id: 'heart', label: 'Heart', svg: <svg viewBox="0 0 24 24" style={{ width: 40, height: 40 }} xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-4.35-9-7.05C-1.1 8.9 4 3.5 8.5 6.5 10.2 7.7 12 9.2 12 9.2s1.8-1.5 3.5-2.7C20 3.5 25.1 8.9 21 13.95 19 16.65 12 21 12 21z" fill="currentColor" /></svg> },
  { id: 'leaf', label: 'Leaf', svg: <svg viewBox="0 0 24 24" style={{ width: 40, height: 40 }} xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-4 4-8 8-12 12 1-7 7-11 12-12z" fill="currentColor" /></svg> },
];


// --- Small components ---
function HeroPag2({ onStartCreating }) {
  return (
    <div style={{
      minHeight: '100vh',
      // combine decorative radial gradient with a full-bleed background image
      background: `radial-gradient(ellipse at top, #0f172a 0%, #1e293b 50%, #0f172a 100%), url('/assets/1714677703-meta.avif') center/cover no-repeat`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced animated elements */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

        .hero-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .hero-glow.g1 { width: 600px; height: 600px; left: -200px; top: -200px; background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%); animation: pulse 8s ease-in-out infinite; }
        .hero-glow.g2 { width: 500px; height: 500px; right: -150px; bottom: -150px; background: radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%); animation: pulse 10s ease-in-out infinite 2s; }
        .hero-glow.g3 { width: 400px; height: 400px; left: 50%; top: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%); animation: pulse 12s ease-in-out infinite 4s; }

        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }

        /* Animated grid background */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }

        /* Responsive hero container */
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        /* Logo animation */
        @keyframes logoReveal { 
          0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hero-logo { font-size: 56px; font-weight: 900; letter-spacing: -3px; display: inline-flex; align-items: center; gap: 6px; }
        .hero-sub { font-size: 14px; font-weight: 500; color: rgba(139,92,246,0.8); text-transform: uppercase; letter-spacing: 4px; margin-top: 8px; }

        /* Heading and copy responsive sizes */
        .hero-heading { font-size: 64px; font-weight: 800; line-height: 1.08; margin-bottom: 24px; }
        .hero-subcopy { font-size: 20px; color: rgba(255,255,255,0.75); margin-bottom: 48px; max-width: 680px; margin-left: auto; margin-right: auto; }

        /* CTA button enhanced and responsive */
        .cta-modern {
          position: relative;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          border: none;
          padding: 20px 56px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0 0 rgba(139, 92, 246, 0), 0 10px 40px -10px rgba(139, 92, 246, 0.5);
          transform: translateY(0);
        }
        .cta-modern::before { content: ''; position: absolute; inset: -2px; border-radius: 999px; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s; }
        .cta-modern:hover { transform: translateY(-2px); box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2), 0 20px 60px -10px rgba(139, 92, 246, 0.6); }
        .cta-modern:hover::before { opacity: 1; }

        /* Feature cards */
        .feature-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; transition: all 0.3s ease; }
        .feature-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(139,92,246,0.3); transform: translateY(-4px); }

        .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 900px; margin: 0 auto; }

        /* Tablet/iPad */
        @media (max-width: 1024px) {
          .hero-heading { font-size: 48px; }
          .hero-logo { font-size: 48px; }
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .hero-heading { font-size: 28px; }
          .hero-subcopy { font-size: 16px; padding: 0 8px; }
          .cta-modern { padding: 14px 28px; font-size: 16px; }
          .hero-logo { font-size: 36px; }
          .feature-grid { grid-template-columns: 1fr; gap: 12px; }
          .hero-container { padding: 28px 16px; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="hero-glow g1" />
      <div className="hero-glow g2" />
      <div className="hero-glow g3" />

      <div className="hero-container">
        {/* Modern Logo */}
        <div style={{
          marginBottom: 48,
          animation: 'logoReveal 0.8s ease-out'
        }}>
          <div className="hero-logo" style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            APT
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ margin: '0 -8px' }}>
              <circle cx="12" cy="12" r="10" stroke="url(#grad1)" strokeWidth="2" />
              <path d="M8 12h8M12 8v8" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            S
          </div>
          <div className="hero-sub">Design Studio</div>
        </div>

        {/* Hero Content */}
        <h1 className="hero-heading">
          <span style={{ color: 'white' }}>Create </span>
          <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stunning</span>
          <br />
          <span style={{ color: 'white' }}> Aptos Lab Merch</span>
        </h1>

        <p className="hero-subcopy">Professional design tools meet intuitive customization. Create unique apparel and accessories that stand out.</p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          marginBottom: 80
        }}>
          <button
            onClick={onStartCreating}
            className="cta-modern"
          >
            Start Creating
          </button>

        </div>

        {/* Feature Cards */}
        <div className="feature-grid">
          {[
            { icon: '🎨', label: 'Premium Templates', value: '50+' },
            { icon: '👕', label: 'Product Types', value: '10+' },
            { icon: '🎯', label: 'Custom Positions', value: 'Unlimited' },
            { icon: '⚡', label: 'Instant Preview', value: 'Real-time' }
          ].map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 }}>
                {feature.value}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroPage({ onStartCreating }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col"  style={{
        // set the hero background image with a dark fallback color
        backgroundImage: "url('/assets/dae7e448-1ba3-40af-b251-fe5fa4982896.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a'
      }}>
      {/* HEADER */}
      <header className="flex items-center justify-center bg-black py-4 border-b border-neutral-800 shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/images.jpg" // your Aptos logo symbol
            alt="Aptos Logo"
            className="w-7 h-7"
          />
         
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center flex-1 overflow-hidden text-center">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 bg-[url('/assets/meta.avif')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 mesh-overlay"></div>

        {/* Main Content */}
        <div className="relative z-10 px-6 mt-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-wide">
           APTOS LABS
          </h2>

          {/* Dark Box with CTA */}
          <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6 max-w-md mx-auto shadow-xl">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              MAKE YOUR NEXT CAREER MOVE
            </h3>
            <button
              onClick={onStartCreating}
              className="w-full py-3 text-sm md:text-base tracking-widest uppercase border border-neutral-500 bg-neutral-800 hover:bg-neutral-700 transition rounded-md"
            >
              Start Create
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-black border-t border-neutral-800">
        <div className="bg-neutral-900 border border-neutral-700 p-4 text-center rounded-lg">
          <h4 className="font-semibold mb-1">Explore Products</h4>
          <p className="text-xs text-neutral-400">
            Discover what’s next on Aptos Labs
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 p-4 text-center rounded-lg">
          <h4 className="font-semibold mb-1">Build on Aptos</h4>
          <p className="text-xs text-neutral-400" >
            Start creating your decentralized future
          </p>
        </div>
      </footer>
    </div>
  
  );
}

function HeroPage1({ onStartCreating }) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white"
      style={{
        // set the hero background image with a dark fallback color
        backgroundImage: "url('/assets/dae7e448-1ba3-40af-b251-fe5fa4982896.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a'
      }}
    >
      {/* Gradient background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* APTOS Logo */}
        <motion.img
          src="/assets/Aptos_Logo.png"
          alt="Aptos Logo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-[300px] mb-10 drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]"
        />

        {/* Subtitle */}
        <p className="uppercase tracking-[0.3em] text-gray-300 text-sm mb-3">
          Labs Studio
        </p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl font-extrabold mb-4"
        >
          Create{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Aptos Lab Merch
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl text-gray-300 text-lg mb-10"
        >
          Design, customize, and preview your apparel in real-time with our
          intuitive editor.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onStartCreating}
            className="px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-pink-500 hover:to-violet-500 transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Start Creating
          </button>
        </motion.div>

      
      </div>

   
    </section>
  );
}

function StepProgress({ step, setStep }) {
  const items = [
    { num: 1, label: 'Select Product' },
    { num: 2, label: 'Color & Size' },
    { num: 3, label: 'Pick Template' },
    { num: 4, label: 'Personalize' },
    { num: 5, label: 'Review' }
  ];
  return (
    <div style={{ marginBottom: 48, padding: '0 16px' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: '5%',
          right: '5%',
          height: 2,
          background: '#e2e8f0',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          top: 20,
          left: '5%',
          width: `${((step - 1) / 4) * 90}%`,
          height: 2,
          background: '#1e293b',
          zIndex: 0,
          transition: 'width 0.3s'
        }} />
        {items.map(s => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div key={s.num} onClick={() => setStep(s.num)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, cursor: 'pointer', zIndex: 1 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: isCompleted ? '#16a34a' : isActive ? '#1e293b' : 'white',
                border: isCompleted ? 'none' : isActive ? '3px solid #1e293b' : '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted || isActive ? 'white' : '#94a3b8',
                marginBottom: 8
              }}>
                {isCompleted ? '✓' : s.num}
              </div>
              <div style={{
                fontSize: isActive ? 13 : 12,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#1e293b' : '#64748b',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({ p, selected, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(p.id)} 
      style={{
        borderRadius: 12,
        border: selected ? '2px solid #1e293b' : '2px solid #e2e8f0',
        background: selected ? '#f8fafc' : 'white',
        boxShadow: selected ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 280 // Ensure consistent minimum height
      }}
    >
      <div style={{
        flex: '1 1 auto',
        background: 'linear-gradient(to bottom right,#f8fafc,#f1f5f9)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        minHeight: 200, // Ensure minimum image container height
        overflow: 'hidden'
      }}>
        <img 
          src={p.image} 
          alt={p.name} 
          style={{ 
            width: '100%',
            height: '100%',
            maxHeight: 220,
            objectFit: 'contain',
            transition: 'transform 0.2s ease',
            transform: selected ? 'scale(1.05)' : 'scale(1)'
          }} 
        />
      </div>
      <div style={{ 
        padding: '12px 16px',
        borderTop: '1px solid #e2e8f0',
        background: selected ? '#f8fafc' : 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
      }}>
        <h3 style={{ 
          fontWeight: 600, 
          color: '#1e293b', 
          marginBottom: 4,
          fontSize: '15px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{p.name}</h3>
        <p style={{ 
          fontSize: '13px', 
          color: '#64748b', 
          textTransform: 'capitalize',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{p.type}</p>
      </div>
    </div>
  );
}

function ProductGrid({ products, selectedId, onSelect, columns }) {
  // Enhanced responsive grid that adapts to screen size
  const gridTemplate = typeof columns === 'number'
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`;  // Improved minmax with min() function

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: gridTemplate,
      gap: '24px',
      width: '100%',
      maxWidth: '100%',
      padding: '0 8px', // Add some breathing room on very small screens
      boxSizing: 'border-box'
    }}>
      {products.map(p => <ProductCard key={p.id} p={p} selected={p.id === selectedId} onSelect={onSelect} />)}
    </div>
  );
}



function ProductPreview({ product, color, position, chosenTemplate, accent, selectedIcon, personalText, font, width, height = 300 }) {
  // compute responsive width: if width provided use it, otherwise use 75% for small screens (<1200) or 50% for larger

  let computedHeight = height;
  if (chosenTemplate?.previewHeight) {
    computedHeight = chosenTemplate.previewHeight;
  }

  let computedWidth = width;
  if (!computedWidth) {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      const fraction = vw < 1200 ? 0.75 : 0.5;
      // subtract some margin to avoid overflow
      computedWidth = Math.max(320, Math.min((fraction * vw) - 80, 900));
    } else {
      computedWidth = 480;
    }
  }

  // prefer position-specific preview image when available (e.g. back-full)
  const pos = product?.customizablePositions?.find(p => p.id === position) || null;
  // include both pos.image and pos.previewImage support
  const posPreviewSrc = pos?.previewImage || pos?.image || null;

  // pick color-specific product image if available
  const colorImg = product?.variants?.colors?.find(c => c.id === color)?.image;
  // prefer pos preview image, then color image, then base product image
  const imgSrc = posPreviewSrc || colorImg || product.image;

  // compute overlay coords: template previewCoords overrides position coords when present
  const overlayCoords = chosenTemplate?.previewCoords || pos?.previewCoords || { x: 50, y: 50 };

  // compute overlay W/H: template maxWidth/Height override position when present
  const srcMaxW = chosenTemplate?.maxWidth ?? pos?.maxWidth ?? 12;
  const srcMaxH = chosenTemplate?.maxHeight ?? pos?.maxHeight ?? 12;
  const overlayPctW = Math.min(80, Math.max(12, srcMaxW * 4));
  const overlayPctH = Math.min(80, Math.max(12, srcMaxH * 4));

  const textColor = contrastColor((product?.variants?.colors?.find(c => c.id === color)?.hex || '#ffffff').replace(/\s+/g, ''));
  const personalTextColor = accent || textColor;

  return (
    <div style={{
      width: computedWidth,
      height: computedHeight,
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: Math.round(computedWidth * 0.82),
        height: Math.round(computedHeight * 0.86),
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        // use background color only if there's no image to display
        background: imgSrc ? 'transparent' : toDisplayColor(product, color),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {imgSrc && (
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
              opacity: 0.98
            }}
            onError={(e) => {
              // hide broken image and restore color background
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) parent.style.background = toDisplayColor(product, color);
            }}
          />
        )}

        <div style={{
          position: 'absolute',
          left: `${overlayCoords.x ?? 50}%`,
          top: `${overlayCoords.y ?? 50}%`,
          transform: 'translate(-50%,-50%)',
          width: `${overlayPctW}%`,
          height: `${overlayPctH}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ width: '85%', height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: '100%' }}>
                {chosenTemplate?.image ? (
                  <img src={chosenTemplate.image} alt={chosenTemplate.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  (chosenTemplate?.svg && chosenTemplate.svg(chosenTemplate.canColor ? accent : '#222')) || null
                )}
              </div>
            </div>

            {selectedIcon && (
              <div style={{ marginTop: 6, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ICON_LIBRARY.find(ic => ic.id === selectedIcon)?.svg}
              </div>
            )}

            {personalText && (
              <div style={{
                marginTop: 8,
                fontFamily: font,
                fontWeight: 700,
                fontSize: Math.max(10, Math.round(overlayPctW / 3)) + 'px',
                color: personalTextColor,
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

    </div>
  );
}

function SidebarPreview({ product, color, position, chosenTemplate, accent, selectedIcon, personalText, font }) {
  return (
    <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: 12, padding: 2 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12 }}>
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
          height={420}
        />
      </div>
    </div>
  );
}

function PrintQueue({ queue, onClearQueue }) {
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [downloading, setDownloading] = React.useState(false);

  async function generateAndDownload(job) {
    try {
      setDownloading(true);
      const product = PRODUCTS.find(p => p.id === job.productId) || {};
      const templates = getTemplatesForProduct(job.productId) || [];
      const tpl = templates.find(t => t.id === job.template) || null;

      // choose product base image (position preview -> color image -> base image)
      const pos = product?.customizablePositions?.find(p => p.id === job.position) || null;
      const baseSrc = pos?.previewImage || pos?.image || product?.image || null;
      const templateSrc = tpl?.image || null;

      // load images
      const loadImage = (src) => new Promise((res) => {
            if (!src) return res(null);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => res(img);
            img.onerror = () => res(null);
            img.src = src;
          });

      const [baseImg, tplImg] = await Promise.all([loadImage(baseSrc), loadImage(templateSrc)]);

      // canvas dimensions
      const cw = Math.max(800, baseImg?.naturalWidth || 1000);
      const ch = Math.max(800, baseImg?.naturalHeight || 1000);
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');

      // draw base
      if (baseImg) {
        ctx.drawImage(baseImg, 0, 0, cw, ch);
      } else {
        // fallback background
        ctx.fillStyle = toDisplayColor(product, job.color) || '#fff';
        ctx.fillRect(0, 0, cw, ch);
      }

      // compute overlay rect from template/position metadata (uses previewCoords and maxWidth/maxHeight)
      const coords = (tpl?.previewCoords) || (pos?.previewCoords) || { x: 50, y: 50 };
      const srcMaxW = tpl?.maxWidth ?? pos?.maxWidth ?? 12;
      const srcMaxH = tpl?.maxHeight ?? pos?.maxHeight ?? 12;
      const overlayPctW = Math.min(80, Math.max(12, srcMaxW * 4)); // same logic as preview
      const overlayPctH = Math.min(80, Math.max(12, srcMaxH * 4));

      const ow = Math.round((overlayPctW / 100) * cw);
      const oh = Math.round((overlayPctH / 100) * ch);
      const ox = Math.round((coords.x / 100) * cw - ow / 2);
      const oy = Math.round((coords.y / 100) * ch - oh / 2);

      // draw template image centered into overlay box
      if (tplImg) {
        // preserve aspect fit
        const ar = tplImg.width / tplImg.height;
        let dw = ow, dh = oh;
        if (dw / dh > ar) {
          dw = Math.round(dh * ar);
        } else {
          dh = Math.round(dw / ar);
        }
        const dx = ox + Math.round((ow - dw) / 2);
        const dy = oy + Math.round((oh - dh) / 2);
        ctx.drawImage(tplImg, dx, dy, dw, dh);
      }

      // draw icon (if any) - simple placeholder: draws the icon svg as text label (icons are inline SVGS in ICON_LIBRARY)
      if (job.selectedIcon) {
        ctx.fillStyle = job.accent || '#111';
        ctx.font = `${Math.max(24, Math.round(Math.min(ow, oh) * 0.16))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(job.selectedIcon, ox + ow / 2, oy + oh * 0.25);
      }

      // draw personal text
      if (job.personalText) {
        ctx.fillStyle = job.accent || contrastColor(toDisplayColor(product, job.color) || '#fff');
        const fontSize = Math.max(20, Math.round(ow / 6));
        ctx.font = `700 ${fontSize}px ${job.font || 'sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // wrap long text
        const lines = String(job.personalText).split('\n');
        const startY = oy + oh / 2 - ((lines.length - 1) * fontSize) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, ox + ow / 2, startY + i * fontSize);
        });
      }

      // convert to blob and trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
          setDownloading(false);
          alert('Unable to generate image.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const niceName = `${job.productId || 'product'}_${job.id}.png`;
        a.download = niceName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, 'image/png', 0.92);
    } catch (err) {
      setDownloading(false);
      alert('Failed to generate image');
      console.error(err);
    }
  }

  return (
    <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12 }}>
        Print Queue
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {queue.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 14 }}>No queued designs</p>
          </div>
        )}

        {queue.map(j => (
          <div key={j.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: '0 0 72px' }}>
              <img src={
                // try to show position preview or product image
                (PRODUCTS.find(p => p.id === j.productId)?.customizablePositions?.find(p => p.id === j.position)?.previewImage)
                || (PRODUCTS.find(p => p.id === j.productId)?.customizablePositions?.find(p => p.id === j.position)?.image)
                || PRODUCTS.find(p => p.id === j.productId)?.image
              } alt={j.product} style={{ width: 72, height: 72, objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{j.product}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{j.color || '—'} • {j.size || '—'}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(j.createdAt).toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelectedJob(j)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white' }}>
                View
              </button>
              <button onClick={() => {
                // remove this job
                if (!confirm('Remove this job from the queue?')) return;
                onClearQueue && onClearQueue(); // if clearing all is desired call parent; otherwise remove single
                // If parent wants finer control, you can expose remove function instead.
              }} style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: 'white', border: 'none' }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {queue.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => { if (confirm('Clear entire queue?')) onClearQueue && onClearQueue(); }} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '2px solid #e2e8f0', background: 'white' }}>
            Clear Queue
          </button>
        </div>
      )}

      {/* Details panel */}
      {selectedJob && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #e6eef6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{selectedJob.product} — Details</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { generateAndDownload(selectedJob); }} disabled={downloading} style={{ padding: '8px 12px', borderRadius: 8, background: '#1e293b', color: 'white', border: 'none' }}>
                {downloading ? 'Generating…' : 'Download Final Image'}
              </button>
              <button onClick={() => setSelectedJob(null)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white' }}>Close</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
            <div>
              <h4 style={{ margin: '6px 0', fontSize: 13, color: '#64748b' }}>Product Details</h4>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <div><strong>{selectedJob.product}</strong></div>
                <div style={{ fontSize: 13, color: '#64748b' }}>ID: {selectedJob.productId}</div>
                <div style={{ marginTop: 8 }}>Color: {selectedJob.color || '—'}</div>
                <div>Size: {selectedJob.size || '—'}</div>
                <div>Position: {selectedJob.position || '—'}</div>
                <div>Template: {selectedJob.template || '—'}</div>
                <div style={{ marginTop: 8 }}>Text: {selectedJob.personalText || '—'}</div>
                <div>Icon: {selectedJob.selectedIcon || '—'}</div>
              </div>

              <h4 style={{ margin: '12px 0 6px 0', fontSize: 13, color: '#64748b' }}>Customer Details</h4>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <div><strong>{selectedJob.customer?.name}</strong></div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selectedJob.customer?.email}</div>
                <div style={{ marginTop: 8 }}>{selectedJob.customer?.notes || '—'}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '6px 0', fontSize: 13, color: '#64748b' }}>Final Product</h4>
              <div style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProductPreview
                  product={PRODUCTS.find(p => p.id === selectedJob.productId)}
                  color={selectedJob.color}
                  position={selectedJob.position}
                  chosenTemplate={
                    (getTemplatesForProduct(selectedJob.productId) || []).find(t => t.id === selectedJob.template) || null
                  }
                  accent={selectedJob.accent}
                  selectedIcon={selectedJob.selectedIcon}
                  personalText={selectedJob.personalText}
                  font={selectedJob.font}
                  width={320}
                  height={320}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPicker({ product, color, setColor }) {
  if (!product?.variants?.colors || product.variants.colors.length === 0) return null;
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12 }}>
        Color
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {product.variants.colors.map(col => (
          <button key={col.id} onClick={() => setColor(col.id)} title={col.name} style={{
            background: toDisplayColor(product, col.id),
            width: 48,
            height: 48,
            borderRadius: 8,
            border: color === col.id ? '4px solid #1e293b' : '2px solid #e2e8f0',
            cursor: 'pointer'
          }} />
        ))}
      </div>
    </div>
  );
}

function SizePicker({ product, size, setSize }) {
  if (!product.variants.sizes) return null;
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12 }}>
        Size
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {product.variants.sizes.map(s => (
          <button key={s} onClick={() => setSize(s)} style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: size === s ? '#1e293b' : 'white',
            color: size === s ? 'white' : '#334155',
            border: size === s ? 'none' : '1px solid #e2e8f0'
          }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function PositionPicker({ product, position, setPosition }) {
  // don't render if no customizable positions
  if (!product?.customizablePositions || product.customizablePositions.length === 0) return null;

  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 12 }}>Design Position</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        {product.customizablePositions.map(pos => {
          const thumb = pos.previewImage || pos.image || null;
          const selected = position === pos.id;
          return (
            <button
              key={pos.id}
              onClick={() => setPosition(pos.id)}
              title={pos.name}
              aria-pressed={selected}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 8,
                borderRadius: 10,
                border: selected ? '2px solid #1e293b' : '2px solid #e2e8f0',
                background: selected ? '#f8fafc' : 'white',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '100%',
                height: 88,
                borderRadius: 8,
                background: '#fbfdff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.03)'
              }}>
                {thumb ? (
                  <img src={thumb} alt={pos.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{pos.name}</div>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{pos.name}</div>
              {pos.maxWidth && (
                <div style={{ fontSize: 12, color: '#64748b' }}>{pos.maxWidth}×{pos.maxHeight}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TemplateCard({ t, selected, onSelect, accent }) {
  return (
    <div onClick={() => onSelect(t.id)} style={{
      borderRadius: 12,
      border: selected ? '2px solid #1e293b' : '2px solid #e2e8f0',
      background: selected ? '#f8fafc' : 'white',
      cursor: 'pointer',
      paddingBottom: 8
    }}>
      <div style={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        {t.image ? (
          <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          t.svg && t.svg(t.canColor ? accent : '#222')
        )}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{t.name}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{t.event}</div>
      </div>
    </div>
  );
}

function TemplateGallery({ templates, templateId, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {templates.map(t => {
        const thumbH = t.previewHeight || 96;
        const coords = t.previewCoords || { x: 50, y: 50 };
        const selected = templateId === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              background: selected ? '#f8fafc' : 'white',
              border: selected ? '2px solid #1e293b' : '1px solid #e6eef6',
              borderRadius: 10,
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center'
            }}
            title={t.name || t.image?.split('/').pop() || 'Template'}
          >
            <div style={{ width: '100%', height: thumbH, borderRadius: 8, overflow: 'hidden', background: '#fbfdff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {t.image ? (
                <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: 12 }}>No preview</div>
              )}

              {/* small position marker inside thumbnail if coords provided */}
              <div style={{
                position: 'absolute',
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%,-50%)',
                width: 10,
                height: 10,
                borderRadius: 10,
                background: 'rgba(30,41,59,0.9)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }} />
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', textAlign: 'center', width: '100%' }}>{t.name || (t.image && t.image.split('/').pop())}</div>
            {(t.maxWidth || t.maxHeight) && <div style={{ fontSize: 12, color: '#64748b' }}>{t.maxWidth || '—'}×{t.maxHeight || '—'}</div>}
          </button>
        );
      })}
    </div>
  );
}


function PersonalizeForm({ personalText, setPersonalText, font, setFont, accent, setAccent }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
          Name / Initials / Text
        </label>
        <input
          value={personalText}
          onChange={e => setPersonalText(e.target.value)}
          placeholder="Enter your text"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: 8
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
          Font Style
        </label>
        <select
          value={font}
          onChange={e => setFont(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: 8
          }}
        >
          <option>Inter</option>
          <option>Georgia</option>
          <option>Monospace</option>
        </select>
      </div>
      {/* <div>
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
                cursor: 'pointer'
              }}
              title={ic.label}
            >
              {ic.svg}
            </button>
          ))}
        </div>
      </div> */}
      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
          Accent Color
        </label>
        <input
          type="color"
          value={accent}
          onChange={e => setAccent(e.target.value)}
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
  );
}

function ReviewPanel({ product, color, size, position, chosenTemplate, personalText, selectedIcon, onEdit, onSubmit }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Product:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{product.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Color:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{color}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Size:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{size}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Position:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{position || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Template:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{chosenTemplate?.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Text:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{personalText || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500, color: '#64748b' }}>Icon:</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{selectedIcon || '—'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onEdit} style={{ flex: 1, padding: '12px 24px', borderRadius: 8, border: '2px solid #cbd5e1', background: 'white' }}>
          Edit Design
        </button>
        <button onClick={onSubmit} style={{ flex: 1, padding: '12px 24px', borderRadius: 8, background: '#16a34a', color: 'white' }}>
          Confirm & Submit
        </button>
      </div>
    </div>
  );
}


function QueuePage({ queue, onClearQueue, onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Print Queue</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onBack} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white' }}>← Continue Designing</button>
          <button onClick={onClearQueue} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white' }}>Clear All</button>
        </div>
      </div>

      <PrintQueue queue={queue} onClearQueue={onClearQueue} />
    </div>
  );
}

function CustomerForm({ onSubmit }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!name || !email) {
        alert('Please enter name and email');
        return;
      }
      onSubmit({ name, email, notes });
    }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e6eef6' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e6eef6' }} />
        <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e6eef6' }} rows={3} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#16a34a', color: 'white', border: 'none' }}>Submit & Queue</button>
        </div>
      </div>
    </form>
  );
}

// --- Main App (uses components above) ---
export default function AppWithHeroPage() {
  const [showHero, setShowHero] = useState(true);
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find(p => p.id === productId);

  const [templateId, setTemplateId] = useState('');

  const [color, setColor] = useState(() => product?.variants?.colors?.[0]?.id || '');
  const [size, setSize] = useState(() => product?.variants?.sizes?.[0] || 'N/A');
  const [position, setPosition] = useState(() => product?.customizablePositions?.[0]?.id || '');

  const [eventFilter, _setEventFilter] = useState('All');
  const [personalText, setPersonalText] = useState('');
  const [font, setFont] = useState('Inter');
  const [selectedIcon, _setSelectedIcon] = useState(null);
  const [accent, setAccent] = useState('#3b82f6');

  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const availableColorIds = product?.variants?.colors?.map(c => c.id) || [];
    if (!availableColorIds.includes(color)) setColor(availableColorIds[0] || '');

    if (!product?.variants?.sizes) setSize('N/A');
    else if (!product.variants.sizes.includes(size)) setSize(product.variants.sizes[0]);

    const availablePositions = product?.customizablePositions?.map(p => p.id) || [];
    if (!availablePositions.includes(position)) setPosition(availablePositions[0] || '');

    // ensure templateId belongs to this product (clear if not)
    const templatesForProductAll = getTemplatesForProduct(productId);
    if (templateId && !templatesForProductAll.find(t => t.id === templateId)) {
      setTemplateId('');
    }
  }, [productId, product, color, size, position, templateId]);

  // clear template selection whenever position changes (templates are position-specific)
  useEffect(() => {
    setTemplateId('');
  }, [position]);

  // per-product templates and chosen template
  const templatesForProduct = getTemplatesForProduct(productId, position);
  const filteredTemplates = templatesForProduct.filter(t => eventFilter === 'All' ? true : t.event === eventFilter);
  const chosenTemplate = templateId ? templatesForProduct.find(t => t.id === templateId) : null;

  function goNext() {
    if (step === 1 && !productId) return alert('Pick a product');
    if (step === 2 && product.type === 'apparel' && !size) return alert('Choose a size');
    setStep(s => Math.min(5, s + 1));
  }
  function goPrev() { setStep(s => Math.max(1, s - 1)); }



  if (showHero) {
    return <HeroPage onStartCreating={() => setShowHero(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      padding: 24
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: 32,
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: '#1e293b' }}>
              Aptos Lab Merch designer
            </h1>
            <button
              onClick={() => setShowHero(true)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              ← Home
            </button>
          </div>

          <StepProgress step={step} setStep={setStep} />

          <div style={{ gridTemplateColumns: '1fr', gap: 32 }}>
            <div style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32
            }}>

              <div className="preview-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                {step !== 1 && <SidebarPreview product={product} color={color} position={position} chosenTemplate={chosenTemplate} accent={accent} selectedIcon={selectedIcon} personalText={personalText} font={font} />}
                {/* PrintQueue removed from sidebar */}
              </div>

              <div className="main-content-area">
                {step === 1 && (
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24 }}>
                      Choose Your Product
                    </h2>
                    {/* Force 4 columns on large screens by passing columns=4 */}
                    <ProductGrid products={PRODUCTS} selectedId={productId} onSelect={(id) => { setProductId(id); }} columns={4} />

                    {/* Centered Next button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                      <button
                        onClick={() => {
                          if (!productId) {
                            alert('Please select a product first');
                            return;
                          }
                          setStep(2);
                        }}
                        disabled={!productId}
                        style={{
                          padding: '10px 24px',
                          borderRadius: 8,
                          background: productId ? '#1e293b' : '#e6eef6',
                          color: productId ? 'white' : '#94a3b8',
                          border: 'none',
                          cursor: productId ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Next: Color & Size
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24 }}>
                      Customize Options
                    </h2>
                    <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, marginBottom: 24 }}>
                      <ColorPicker product={product} color={color} setColor={setColor} />
                      <div style={{ height: 12 }} />
                      <SizePicker product={product} size={size} setSize={setSize} />
                      <div style={{ height: 12 }} />
                      <PositionPicker product={product} position={position} setPosition={setPosition} />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={goPrev} style={{ padding: '8px 24px', borderRadius: 8, border: '2px solid #cbd5e1' }}>
                        Back
                      </button>
                      <button onClick={goNext} style={{ padding: '8px 24px', borderRadius: 8, background: '#1e293b', color: 'white' }}>
                        Next: Templates
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24 }}>
                      Choose a Template
                    </h2>

                    {!position && (
                      <div style={{ marginBottom: 16, color: '#64748b' }}>Select a design position first to see templates.</div>
                    )}

                    {filteredTemplates.length === 0 ? (
                      <div style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px dashed #e2e8f0', color: '#64748b' }}>
                        No templates available for this product / position.
                      </div>
                    ) : (
                      <TemplateGallery templates={filteredTemplates} templateId={templateId} onSelect={setTemplateId} accent={accent} />
                    )}

                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <button onClick={goPrev} style={{ padding: '8px 24px', borderRadius: 8, border: '2px solid #cbd5e1' }}>Back</button>
                      <button
                        onClick={() => {
                          if (!templateId) return alert('Pick a template first');
                          // find the chosen template from the filtered set
                          const tpl = templatesForProduct.find(t => t.id === templateId);
                          if (tpl && tpl.canAddText === false) {
                            // skip Personalize step and go straight to Review & Confirm
                            setStep(5);
                          } else {
                            setStep(4);
                          }
                        }}
                        disabled={!templateId}
                        style={{
                          padding: '8px 24px',
                          borderRadius: 8,
                          background: templateId ? '#1e293b' : '#e6eef6',
                          color: templateId ? 'white' : '#94a3b8',
                          border: 'none'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: '#0f172a',         // improved heading contrast
                      marginBottom: 24
                    }}>
                      Personalize Your Design
                    </h2>

                    <div style={{ display: 'grid', gap: 12 }}>
                      {/* Text input */}
                      <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
                          Add Text
                        </label>
                        <input
                          value={personalText}
                          onChange={e => setPersonalText(e.target.value)}
                          placeholder="Enter your text"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: '1px solid #e6eef6',
                            color: '#0f172a',      // ensure input text is high contrast
                            background: 'white'
                          }}
                        />
                      </div>

                      {/* Font picker */}
                      <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
                          Font
                        </label>
                        <select value={font} onChange={e => setFont(e.target.value)} style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid #e6eef6',
                          color: '#0f172a',      // ensure option text is readable
                          background: 'white'
                        }}>
                          {['Inter', 'Georgia', 'Montserrat', 'Pacifico'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>

                      {/* Color/Accent */}
                      <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
                          Accent Color
                        </label>
                        <input type="color" value={accent} onChange={e => setAccent(e.target.value)} style={{ width: 72, height: 40, border: 'none', padding: 0, background: 'transparent' }} />
                      </div>

                      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <button onClick={goPrev} style={{ padding: '8px 24px', borderRadius: 8, border: '2px solid #cbd5e1' }}>Back</button>
                        <button
                          onClick={() => {
                            // proceed to Review & Confirm
                            setStep(5);
                          }}
                          style={{
                            padding: '8px 24px',
                            borderRadius: 8,
                            background: '#1e293b',
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          Next: Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1e293b', marginBottom: 24 }}>
                      Review & Confirm
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
                      <div>
                        <ReviewPanel product={product} color={color} size={size} position={position} chosenTemplate={chosenTemplate} personalText={personalText} selectedIcon={selectedIcon} onEdit={() => setStep(4)} onSubmit={() => { /* no-op here; submission handled below */ }} />
                      </div>

                      <div>


                        {/* Customer info form */}
                        <div style={{ padding: 12, borderRadius: 8, background: 'white', border: '1px solid #e6eef6' }}>
                          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Your Info</h3>

                          <CustomerForm onSubmit={(customer) => {
                            // construct queue job
                            const job = {
                              id: `${Date.now()}`,
                              product: product?.name || productId,
                              productId: product?.id || productId,
                              color: color || null,
                              size: size || null,
                              position: position || null,
                              template: chosenTemplate?.id || templateId || null,
                              personalText: personalText || '',
                              selectedIcon: selectedIcon || null,
                              customer,
                              createdAt: new Date().toISOString()
                            };
                            setQueue(prev => [job, ...prev]);
                            // go to queue page
                            setStep(6);
                          }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <PrintQueue
                        queue={queue}
                        onClearQueue={() => setQueue([])}
                      />
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <QueuePage
                      queue={queue}
                      onClearQueue={() => setQueue([])}
                      onBack={() => setStep(1)}
                    />
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
          <p>Aptos Lab Merch designer • Create personalized products in minutes</p>
        </div>
      </div>
    </div>
  );
}