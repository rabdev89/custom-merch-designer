
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



function HeroPage({ onStartCreating }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white bg-[url('/assets/dae7e448-1ba3-40af-b251-fe5fa4982896.jpeg')] bg-cover bg-center">
      <header className="flex items-center justify-center bg-black py-4 border-b border-neutral-800 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/assets/images.jpg" alt="Aptos Logo" className="w-7 h-7" />
        </div>
      </header>
      <section className="relative flex flex-col items-center justify-center flex-1 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('/assets/meta.avif')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0" />
        <div className="relative z-10 px-6 mt-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-wide">APTOS LABS</h2>
          <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6 max-w-md mx-auto shadow-xl">
            <h3 className="text-lg md:text-xl font-semibold mb-4">MAKE YOUR NEXT CAREER MOVE</h3>
            <button
              onClick={onStartCreating}
              className="w-full py-3 text-sm md:text-base tracking-widest uppercase border border-neutral-500 bg-neutral-800 hover:bg-neutral-700 transition rounded-md"
            >
              Start Create
            </button>
          </div>
        </div>
      </section>
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-black border-t border-neutral-800">
        <div className="bg-neutral-900 border border-neutral-700 p-4 text-center rounded-lg">
          <h4 className="font-semibold mb-1">Explore Products</h4>
          <p className="text-xs text-neutral-400">Discover what’s next on Aptos Labs</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 p-4 text-center rounded-lg">
          <h4 className="font-semibold mb-1">Build on Aptos</h4>
          <p className="text-xs text-neutral-400">Start creating your decentralized future</p>
        </div>
      </footer>
    </div>
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
    <div className="mb-12 px-4">
      <div className="relative flex items-center justify-between">
        {/* background track */}
        <div className="absolute left-[5%] right-[5%] top-5 h-[2px] bg-gray-200 z-0" />
        {/* progress fill - width computed by inline style for percent */}
        <div
          className="absolute left-[5%] top-5 h-[2px] bg-slate-800 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 4) * 90}%` }}
        />

        {items.map(s => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex flex-col items-center flex-1 cursor-pointer z-10"
            >
              <div
                className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-slate-800 text-white' : 'bg-white text-gray-400'}`}
                style={{ border: isCompleted ? 'none' : isActive ? '3px solid #1e293b' : '2px solid #e2e8f0' }}
              >
                {isCompleted ? '✓' : s.num}
              </div>

              <div className={`text-center whitespace-nowrap ${isActive ? 'text-sm font-semibold text-slate-800' : 'text-xs text-gray-500'}`}>
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
      className={`flex flex-col w-full h-full min-h-[280px] transition-all duration-200 cursor-pointer rounded-lg ${selected ? 'border-2 border-slate-800 bg-slate-50 shadow-md' : 'border-2 border-gray-200 bg-white'}`}
    >
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center rounded-t-lg min-h-[200px] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          className={`w-full h-full max-h-[220px] object-contain transition-transform duration-200 transform ${selected ? 'scale-105' : 'scale-100'}`}
        />
      </div>

      <div className="p-3 border-t border-gray-200 rounded-b-lg bg-white">
        <h3 className="font-semibold text-slate-800 text-sm truncate">{p.name}</h3>
        <p className="text-sm text-gray-500 capitalize truncate">{p.type}</p>
      </div>
    </div>
  );
}

function ProductGrid({ products, selectedId, onSelect, columns }) {
  // If explicit columns provided, use responsive fixed columns; otherwise use auto-fit minmax
  const explicitCols = typeof columns === 'number' ? `md:grid-cols-${columns}` : '';
  // Use Tailwind arbitrary grid columns for auto-fit minmax at md+ (requires JIT)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${explicitCols} md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 w-full px-2 box-border`}>
      {products.map(p => (
        <ProductCard key={p.id} p={p} selected={p.id === selectedId} onSelect={onSelect} />
      ))}
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
    <div className="bg-white border-2 border-gray-200 rounded-md p-2">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-md flex items-center justify-center">
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
    <div className="bg-white border-2 border-gray-200 rounded-md p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Print Queue</h3>

      <div className="flex flex-col gap-3">
        {queue.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No queued designs</p>
          </div>
        )}

        {queue.map(j => (
          <div key={j.id} className="flex gap-3 items-center p-3 rounded-md bg-slate-50 border border-gray-200">
            <div className="flex-none w-[72px]">
              <img src={
                (PRODUCTS.find(p => p.id === j.productId)?.customizablePositions?.find(p => p.id === j.position)?.previewImage)
                || (PRODUCTS.find(p => p.id === j.productId)?.customizablePositions?.find(p => p.id === j.position)?.image)
                || PRODUCTS.find(p => p.id === j.productId)?.image
              } alt={j.product} className="w-[72px] h-[72px] object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            <div className="flex-1">
              <div className="font-semibold">{j.product}</div>
              <div className="text-xs text-gray-500">{j.color || '—'} • {j.size || '—'}</div>
              <div className="text-xs text-gray-400">{new Date(j.createdAt).toLocaleString()}</div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSelectedJob(j)} className="px-3 py-1 rounded-md border border-gray-200 bg-white">View</button>
              <button onClick={() => {
                if (!confirm('Remove this job from the queue?')) return;
                onClearQueue && onClearQueue();
              }} className="px-3 py-1 rounded-md bg-red-500 text-white">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {queue.length > 0 && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => { if (confirm('Clear entire queue?')) onClearQueue && onClearQueue(); }} className="flex-1 px-3 py-2 rounded-md border-2 border-gray-200 bg-white">Clear Queue</button>
        </div>
      )}

      {/* Details panel */}
      {selectedJob && (
        <div className="mt-4 p-3 rounded-md bg-white border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold">{selectedJob.product} — Details</div>
            <div className="flex gap-2">
              <button onClick={() => { generateAndDownload(selectedJob); }} disabled={downloading} className="px-3 py-1 rounded-md bg-slate-800 text-white">{downloading ? 'Generating…' : 'Download Final Image'}</button>
              <button onClick={() => setSelectedJob(null)} className="px-3 py-1 rounded-md border border-gray-200 bg-white">Close</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs text-gray-500 mb-2">Product Details</h4>
              <div className="bg-slate-50 p-3 rounded-md">
                <div><strong>{selectedJob.product}</strong></div>
                <div className="text-sm text-gray-500">ID: {selectedJob.productId}</div>
                <div className="mt-2">Color: {selectedJob.color || '—'}</div>
                <div>Size: {selectedJob.size || '—'}</div>
                <div>Position: {selectedJob.position || '—'}</div>
                <div>Template: {selectedJob.template || '—'}</div>
                <div className="mt-2">Text: {selectedJob.personalText || '—'}</div>
                <div>Icon: {selectedJob.selectedIcon || '—'}</div>
              </div>

              <h4 className="text-xs text-gray-500 mt-3 mb-2">Customer Details</h4>
              <div className="bg-slate-50 p-3 rounded-md">
                <div><strong>{selectedJob.customer?.name}</strong></div>
                <div className="text-sm text-gray-500">{selectedJob.customer?.email}</div>
                <div className="mt-2">{selectedJob.customer?.notes || '—'}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs text-gray-500 mb-2">Final Product</h4>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-md flex items-center justify-center">
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
      <label className="block text-sm font-medium text-slate-800 mb-3">Color</label>
      <div className="flex flex-wrap gap-3">
        {product.variants.colors.map(col => (
          <button
            key={col.id}
            onClick={() => setColor(col.id)}
            title={col.name}
            className={`w-12 h-12 rounded-md cursor-pointer`}
            style={{
              background: toDisplayColor(product, col.id),
              border: color === col.id ? '4px solid #1e293b' : '2px solid #e2e8f0'
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SizePicker({ product, size, setSize }) {
  if (!product.variants.sizes) return null;
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 mb-3">Size</label>
      <div className="flex flex-wrap gap-2">
        {product.variants.sizes.map(s => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-3 py-2 rounded-md font-medium ${size === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 border border-gray-200'}`}
          >
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
      <label className="block text-sm font-medium text-slate-800 mb-3">Design Position</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {product.customizablePositions.map(pos => {
          const thumb = pos.previewImage || pos.image || null;
          const selected = position === pos.id;
          return (
            <button
              key={pos.id}
              onClick={() => setPosition(pos.id)}
              title={pos.name}
              aria-pressed={selected}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg text-center cursor-pointer ${selected ? 'border-2 border-slate-800 bg-slate-50' : 'border-2 border-gray-200 bg-white'}`}
            >
              <div className="w-full h-22 rounded-md bg-white flex items-center justify-center overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
                {thumb ? (
                  <img src={thumb} alt={pos.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="text-xs text-gray-400">{pos.name}</div>
                )}
              </div>
              <div className="text-sm text-slate-800 font-semibold">{pos.name}</div>
              {pos.maxWidth && (
                <div className="text-xs text-gray-500">{pos.maxWidth}×{pos.maxHeight}</div>
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
    <div onClick={() => onSelect(t.id)} className={`rounded-lg pb-2 cursor-pointer ${selected ? 'border-2 border-slate-800 bg-slate-50' : 'border-2 border-gray-200 bg-white'}`}>
      <div className="w-full h-[140px] flex items-center justify-center p-4">
        {t.image ? (
          <img src={t.image} alt={t.name} className="w-full h-full object-contain" />
        ) : (
          t.svg && t.svg(t.canColor ? accent : '#222')
        )}
      </div>
      <div className="p-3">
        <div className="font-semibold text-slate-800">{t.name}</div>
        <div className="text-xs text-gray-500">{t.event}</div>
      </div>
    </div>
  );
}

function TemplateGallery({ templates, templateId, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {templates.map(t => {
        const thumbH = t.previewHeight || 96;
        const coords = t.previewCoords || { x: 50, y: 50 };
        const selected = templateId === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex flex-col items-center gap-2 p-2 rounded-lg text-center cursor-pointer ${selected ? 'bg-slate-50 border-2 border-slate-800' : 'bg-white border border-gray-200'}`}
            title={t.name || t.image?.split('/').pop() || 'Template'}
          >
            <div className="w-full" style={{ height: thumbH }}>
              <div className="w-full h-full rounded-md overflow-hidden bg-white flex items-center justify-center relative">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="text-xs text-gray-400">No preview</div>
                )}

                <div className="absolute" style={{ left: `${coords.x}%`, top: `${coords.y}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: 9999, background: 'rgba(30,41,59,0.9)', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
              </div>
            </div>

            <div className="text-sm font-semibold text-slate-800 w-full">{t.name || (t.image && t.image.split('/').pop())}</div>
            {(t.maxWidth || t.maxHeight) && <div className="text-xs text-gray-500">{t.maxWidth || '—'}×{t.maxHeight || '—'}</div>}
          </button>
        );
      })}
    </div>
  );
}


function PersonalizeForm({ personalText, setPersonalText, font, setFont, accent, setAccent }) {
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
  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-2">Name / Initials / Text</label>
        <input
          value={personalText}
          onChange={e => setPersonalText(e.target.value)}
          placeholder="Enter your text"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-2">Font Style</label>
        <select value={font} onChange={e => setFont(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-md">
          <option>Inter</option>
          <option>Georgia</option>
          <option>Monospace</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-2">Accent Color</label>
        <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="h-12 w-24 rounded-md border-2 border-gray-200 cursor-pointer" />
      </div>
    </div>
  );
}

function ReviewPanel({ product, color, size, position, chosenTemplate, personalText, selectedIcon, onEdit, onSubmit }) {
  return (
    <div className="grid gap-3">
      <div className="bg-slate-50 p-6 rounded-lg flex flex-col gap-3">
        <div className="flex justify-between"><span className="text-sm text-gray-500">Product:</span><span className="font-semibold text-slate-800">{product.name}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Color:</span><span className="font-semibold text-slate-800">{color}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Size:</span><span className="font-semibold text-slate-800">{size}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Position:</span><span className="font-semibold text-slate-800">{position || '—'}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Template:</span><span className="font-semibold text-slate-800">{chosenTemplate?.name}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Text:</span><span className="font-semibold text-slate-800">{personalText || '—'}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">Icon:</span><span className="font-semibold text-slate-800">{selectedIcon || '—'}</span></div>
      </div>
      <div className="flex gap-3">
        <button onClick={onEdit} className="text-gray-700 flex-1 px-4 py-3 rounded-md border-2 border-gray-200 bg-white">Edit Design</button>
      </div>
    </div>
  );
}


function QueuePage({ queue, onClearQueue, onBack }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-800">Print Queue</h2>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-3 py-2 rounded-md border border-gray-200 bg-white">← Continue Designing</button>
          <button onClick={onClearQueue} className="px-3 py-2 rounded-md bg-red-600 text-white">Clear All</button>
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
      <div className="grid gap-2">
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="p-3 rounded-md border border-gray-200" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="p-3 rounded-md border border-gray-200" />
        <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="p-3 rounded-md border border-gray-200" rows={3} />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white">Submit &amp; Queue</button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-1 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Aptos Lab Merch designer</h1>
            <button
              onClick={() => setShowHero(true)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Home
            </button>
          </div>

          <StepProgress step={step} setStep={setStep} />

          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-8">
               {step !== 1 &&
              <div className="preview-sidebar flex flex-col gap-9">
                <SidebarPreview product={product} color={color} position={position} chosenTemplate={chosenTemplate} accent={accent} selectedIcon={selectedIcon} personalText={personalText} font={font} />
              </div>
              }

              <div className="main-content-area">
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Your Product</h2>
                    <ProductGrid products={PRODUCTS} selectedId={productId} onSelect={(id) => { setProductId(id); }} columns={4} />
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => {
                          if (!productId) {
                            alert('Please select a product first');
                            return;
                          }
                          setStep(2);
                        }}
                        disabled={!productId}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${productId ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        Next: Color &amp; Size
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customize Options</h2>
                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                      <ColorPicker product={product} color={color} setColor={setColor} />
                      <div className="h-3" />
                      <SizePicker product={product} size={size} setSize={setSize} />
                      <div className="h-3" />
                      <PositionPicker product={product} position={position} setPosition={setPosition} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={goPrev} className="px-6 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold">Back</button>
                      <button onClick={goNext} className="px-6 py-2 rounded-lg bg-gray-800 text-white font-semibold">Next: Templates</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose a Template</h2>
                    {!position && (
                      <div className="mb-4 text-gray-400">Select a design position first to see templates.</div>
                    )}
                    {filteredTemplates.length === 0 ? (
                      <div className="p-5 rounded-xl bg-white border border-dashed border-gray-200 text-gray-400">No templates available for this product / position.</div>
                    ) : (
                      <TemplateGallery templates={filteredTemplates} templateId={templateId} onSelect={setTemplateId} accent={accent} />
                    )}
                    <div className="flex gap-3 mt-3">
                      <button onClick={goPrev} className="px-6 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold">Back</button>
                      <button
                        onClick={() => {
                          if (!templateId) return alert('Pick a template first');
                          const tpl = templatesForProduct.find(t => t.id === templateId);
                          if (tpl && tpl.canAddText === false) {
                            setStep(5);
                          } else {
                            setStep(4);
                          }
                        }}
                        disabled={!templateId}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${templateId ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalize Your Design</h2>
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add Text</label>
                        <input
                          value={personalText}
                          onChange={e => setPersonalText(e.target.value)}
                          placeholder="Enter your text"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                        <select
                          value={font}
                          onChange={e => setFont(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          {['Inter', 'Georgia', 'Montserrat', 'Pacifico'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="w-20 h-10 border-none p-0 bg-transparent" />
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button onClick={goPrev} className="px-6 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold">Back</button>
                        <button
                          onClick={() => setStep(5)}
                          className="px-6 py-2 rounded-lg bg-gray-800 text-white font-semibold"
                        >
                          Next: Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review &amp; Confirm</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <ReviewPanel product={product} color={color} size={size} position={position} chosenTemplate={chosenTemplate} personalText={personalText} selectedIcon={selectedIcon} onEdit={() => setStep(4)} onSubmit={() => {}} />
                      </div>
                      <div>
                        <div className="p-3 rounded-lg bg-white border border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Info</h3>
                          <CustomerForm onSubmit={(customer) => {
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
                            setStep(6);
                          }} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <PrintQueue queue={queue} onClearQueue={() => setQueue([])} />
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
        <div className="text-center text-sm text-gray-400 mt-6">
          <p>Aptos Lab Merch designer • Create personalized products in minutes</p>
        </div>
      </div>
    </div>
  );
}
