import { useEffect, useRef, useCallback } from 'react';

const MarginDoodles = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  const setupDoodles = useCallback((container: HTMLDivElement | null) => {
    if (!container) return { container: null, doodles: [] as HTMLDivElement[] };
    const doodles = Array.from(container.querySelectorAll('.doodle')) as HTMLDivElement[];

    doodles.forEach(d => {
      const paths = d.querySelectorAll('.draw') as NodeListOf<SVGPathElement>;
      let total = 0;
      const lengths: number[] = [];
      paths.forEach(p => {
        let len = 100;
        try { len = p.getTotalLength() || 100; } catch(e) { /* fallback */ }
        lengths.push(len);
        total += len;
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });
      (d as any)._paths = paths;
      (d as any)._lengths = lengths;
      (d as any)._total = total;
    });

    return { container, doodles };
  }, []);

  const layoutDoodles = useCallback((container: HTMLDivElement | null, doodles: HTMLDivElement[]) => {
    if (!container || doodles.length === 0) return;
    const gap = 2;
    const topPad = 6;

    doodles.forEach(d => {
      d.style.position = 'static';
      d.style.left = '';
      d.style.top = '';
    });

    const heights = doodles.map(d => d.offsetHeight);

    let y = topPad;
    doodles.forEach((d, i) => {
      d.style.position = 'absolute';
      d.style.left = '2px';
      d.style.right = '2px';
      d.style.top = y + 'px';
      y += heights[i] + gap;
    });
  }, []);

  const updateDoodles = useCallback((leftData: ReturnType<typeof setupDoodles>, rightData: ReturnType<typeof setupDoodles>) => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? Math.max(0, Math.min(1, window.scrollY / docH)) : 0;

    function paintColumn(doodles: HTMLDivElement[]) {
      const n = doodles.length;
      doodles.forEach((d, i) => {
        const start = i / n;
        const end = (i + 1) / n;
        let p = (progress - start) / (end - start);
        p = Math.max(0, Math.min(1, p));

        const total = (d as any)._total || 0;
        const targetDrawn = p * total;
        let cumulative = 0;

        const paths = (d as any)._paths as NodeListOf<SVGPathElement>;
        const lengths = (d as any)._lengths as number[];

        if (paths && lengths) {
          paths.forEach((path, k) => {
            const len = lengths[k];
            const sCum = cumulative;
            const eCum = cumulative + len;
            let pp: number;
            if (targetDrawn <= sCum) pp = 0;
            else if (targetDrawn >= eCum) pp = 1;
            else pp = (targetDrawn - sCum) / len;
            path.style.strokeDashoffset = String(len * (1 - pp));
            cumulative = eCum;
          });
        }

        if (p >= 0.92) d.classList.add('complete');
        else d.classList.remove('complete');
      });
    }

    paintColumn(leftData.doodles);
    paintColumn(rightData.doodles);
  }, []);

  useEffect(() => {
    const leftData = setupDoodles(leftRef.current);
    const rightData = setupDoodles(rightRef.current);

    const relayout = () => {
      layoutDoodles(leftData.container, leftData.doodles);
      layoutDoodles(rightData.container, rightData.doodles);
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          updateDoodles(leftData, rightData);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    const onResize = () => {
      relayout();
      updateDoodles(leftData, rightData);
    };

    relayout();
    updateDoodles(leftData, rightData);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, [setupDoodles, layoutDoodles, updateDoodles]);

  return (
    <>
      {/* Fixed blueprint backgrounds */}
      <div className="margin-bg margin-bg--left hidden min-[800px]:block">
        <span className="margin-corner tl" /><span className="margin-corner tr" />
        <span className="margin-corner bl" /><span className="margin-corner br" />
      </div>
      <div className="margin-bg margin-bg--right hidden min-[800px]:block">
        <span className="margin-corner tl" /><span className="margin-corner tr" />
        <span className="margin-corner bl" /><span className="margin-corner br" />
      </div>

      {/* Fixed doodle layers */}
      <div ref={leftRef} className="margin-doodles margin-doodles--left hidden min-[800px]:block">

  <div className="doodle">
    <svg viewBox="0 0 200 80" fill="none">
      <text x="6" y="18" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">Newton II</text>
      <text x="6" y="46" fontSize="22" fill="hsl(36, 37%, 96%)" className="fade label" fontStyle="italic">F = m·a</text>
      <path className="draw" d="M6 54 Q80 54 180 54" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <text x="6" y="70" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">the foundation</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">RC low-pass</text>
      <path className="draw" d="M12 42 Q22 41.5 32 42.3" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round"/>
      <path className="draw" d="M32 42 L36 32 L42 53 L48 30 L54 54 L60 31 L66 52 L70 42 Q78 42.5 88 42" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path className="draw" d="M88 42 Q88.5 50 88 58" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round"/>
      <path className="draw" d="M76 58 Q88 57.5 100 58.2" stroke="hsl(36, 37%, 96%)" strokeWidth="2" strokeLinecap="round"/>
      <path className="draw" d="M76 63 Q88 62.5 100 63.5" stroke="hsl(36, 37%, 96%)" strokeWidth="2" strokeLinecap="round"/>
      <path className="draw" d="M88 64 Q88.5 72 88 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round"/>
      <path className="draw" d="M76 80 Q88 79.5 100 80.3" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round"/>
      <path className="draw" d="M80 84 Q88 83.5 96 84.2" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" strokeLinecap="round"/>
      <path className="draw" d="M84 88 Q88 87.8 92 88.2" stroke="hsl(36, 37%, 96%)" strokeWidth="1" strokeLinecap="round"/>
      <path className="draw" d="M12 42 Q11.5 60 12 80 Q44 79.5 76 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <text x="44" y="26" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade">R</text>
      <text x="105" y="64" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade">C</text>
      <text x="6" y="105" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">τ = RC</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Maxwell</text>
      <text x="6" y="34" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">∇·E = ρ/ε₀</text>
      <text x="6" y="54" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">∇·B = 0</text>
      <text x="6" y="74" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">∇×E = -∂B/∂t</text>
      <text x="6" y="94" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">∇×B = μ₀J + μ₀ε₀∂E/∂t</text>
      <path className="draw" d="M6 100 Q80 99 180 100" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="6" y="116" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">EM = light</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">inverting amp</text>
      <path className="draw" d="M52 28 Q51 50 53 78 Q80 64 110 53 Q82 40 52 28 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <text x="58" y="46" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">−</text>
      <text x="58" y="68" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">+</text>
      <path className="draw" d="M14 40 Q32 40.5 52 41" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeLinecap="round"/>
      <path className="draw" d="M14 65 Q32 65.5 52 66" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeLinecap="round"/>
      <path className="draw" d="M110 53 Q140 53 180 54" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeLinecap="round"/>
      <path className="draw" d="M52 41 Q52 22 60 20 L66 16 L70 24 L74 16 L78 24 L82 16 L86 24 L92 20 Q108 22 108 41 Q108 47 110 53" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="70" y="14" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Rf</text>
      <text x="6" y="100" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Vo = -Rf/Rin · Vin</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">free body</text>
      <path className="draw" d="M50 50 Q70 49 92 50 Q93 65 92 80 Q70 81 50 80 Q49 65 50 50 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5" fill="none"/>
      <text x="65" y="70" fontSize="16" fill="hsl(36, 37%, 96%)" className="fade label" fontStyle="italic">m</text>
      <path className="draw" d="M71 50 Q71 35 70 22" stroke="hsl(38, 60%, 52%)" strokeWidth="1.5" strokeLinecap="round"/>
      <path className="draw" d="M67 28 L70 20 L73 28" stroke="hsl(38, 60%, 52%)" strokeWidth="1.5" fill="none"/>
      <text x="76" y="28" fontSize="13" fill="hsl(38, 60%, 52%)" className="fade">N</text>
      <path className="draw" d="M71 80 Q71 95 70 108" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5" strokeLinecap="round"/>
      <path className="draw" d="M67 102 L70 110 L73 102" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5" fill="none"/>
      <text x="76" y="108" fontSize="13" fill="hsl(0, 84%, 60%)" className="fade label">mg</text>
      <path className="draw" d="M92 65 Q120 64 148 65" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" strokeLinecap="round"/>
      <path className="draw" d="M142 61 L150 65 L142 69" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <text x="138" y="58" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade">F</text>
      <path className="draw" d="M50 65 Q35 64 22 65" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeDasharray="3 2"/>
      <path className="draw" d="M28 61 L20 65 L28 69" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <text x="6" y="60" fontSize="11" fill="hsl(36, 37%, 96%)" className="fade label">μN</text>
      <text x="6" y="125" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">ΣF = ma</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Navier-Stokes</text>
      <text x="6" y="40" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">ρ(∂v/∂t + v·∇v)</text>
      <text x="6" y="58" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">= -∇p + μ∇²v + f</text>
      <path className="draw" d="M6 64 Q80 63 180 64" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="6" y="80" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">$1M Millennium prize</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">| H(jω) |</text>
      <path className="draw" d="M22 92 Q90 91 182 93" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M22 22 Q21 55 22 92" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M24 38 Q60 38 84 40 Q94 42 102 52 Q116 65 130 78 Q150 86 178 90" stroke="hsl(190, 40%, 65%)" strokeWidth="1.8" fill="none"/>
      <path className="draw" d="M96 44 Q95 70 96 92" stroke="hsl(0, 84%, 60%)" strokeWidth="0.9" strokeDasharray="2 3"/>
      <text x="90" y="106" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade">ωc</text>
      <text x="6" y="42" fontSize="10" fill="hsl(36, 37%, 96%)" className="fade label">0dB</text>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">-20 dB/dec</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">m-c-k system</text>
      <path className="draw" d="M14 26 Q14 60 15 100" stroke="hsl(36, 37%, 96%)" strokeWidth="2"/>
      <path className="draw" d="M9 32 L14 28" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 42 L14 38" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 52 L14 48" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 62 L14 58" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 72 L14 68" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 82 L14 78" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M9 92 L14 88" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M14 42 Q22 42 28 42 L34 32 L42 53 L50 31 L58 53 L66 31 L72 42 Q78 42 84 42" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <text x="42" y="26" fontSize="14" fill="hsl(38, 60%, 52%)" className="fade label" fontStyle="italic">k</text>
      <path className="draw" d="M14 76 Q22 76 30 76" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <path className="draw" d="M30 68 Q42 67 56 68 Q57 76 56 84 Q42 85 30 84 Q29 76 30 68 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <path className="draw" d="M56 76 Q72 76 84 76" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <text x="38" y="92" fontSize="14" fill="hsl(38, 60%, 52%)" className="fade label" fontStyle="italic">c</text>
      <path className="draw" d="M84 36 Q104 35 124 36 Q125 60 124 86 Q104 87 84 86 Q83 60 84 36 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.6" fill="none"/>
      <text x="98" y="68" fontSize="20" fill="hsl(36, 37%, 96%)" className="fade label" fontStyle="italic">m</text>
      <path className="draw" d="M124 60 Q150 60 180 60" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5"/>
      <path className="draw" d="M174 56 L182 60 L174 64" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <text x="156" y="54" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade">F(t)</text>
      <text x="6" y="120" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">mẍ + cẋ + kx = F</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Cauchy stress</text>
      <text x="6" y="36" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">  ⎡ σxx τxy τxz ⎤</text>
      <text x="6" y="54" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">σ=⎢ τyx σyy τyz ⎥</text>
      <text x="6" y="72" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">  ⎣ τzx τzy σzz ⎦</text>
      <path className="draw" d="M6 78 Q80 77 180 78" stroke="hsl(36, 37%, 96%)" strokeWidth="0.6"/>
      <text x="6" y="94" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">symmetric: τij=τji</text>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">σv = √(½[(σ₁-σ₂)²+...])</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Pratt truss</text>
      <path className="draw" d="M20 80 Q60 79 100 80 Q140 81 180 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5"/>
      <path className="draw" d="M20 80 Q35 60 50 40" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5"/>
      <path className="draw" d="M50 40 Q90 39 130 40" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5"/>
      <path className="draw" d="M130 40 Q155 60 180 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5"/>
      <path className="draw" d="M50 40 Q60 60 70 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M90 40 Q95 60 100 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M130 40 Q135 60 140 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M50 40 Q70 60 70 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeDasharray="3 2"/>
      <path className="draw" d="M90 40 Q110 60 100 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeDasharray="3 2"/>
      <path className="draw" d="M130 40 Q150 60 140 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" strokeDasharray="3 2"/>
      <path className="draw" d="M70 22 Q70 32 70 38" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5"/>
      <path className="draw" d="M67 34 L70 40 L73 34" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5" fill="none"/>
      <text x="74" y="28" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade">P</text>
      <path className="draw" d="M16 86 L12 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M22 86 L18 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M178 86 L174 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M184 86 L180 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">method of joints</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Fourier transform</text>
      <text x="6" y="40" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">F(ω) = ∫f(t)e^(-iωt)dt</text>
      <path className="draw" d="M6 50 Q14 40 22 50 Q30 60 38 50 Q46 40 54 50 Q62 60 70 50 Q78 40 86 50 Q94 60 102 50" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <path className="draw" d="M118 50 Q120 50 122 50" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M114 47 L122 50 L114 53" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M130 60 Q140 30 150 60 Q160 50 170 60" stroke="hsl(38, 60%, 52%)" strokeWidth="1.2" fill="none"/>
      <text x="6" y="80" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">time → frequency</text>
      <text x="6" y="94" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">DSP foundation</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">deep groove brg</text>
      <path className="draw" d="M105 30 Q75 32 60 60 Q55 88 80 105 Q108 115 135 100 Q155 80 150 55 Q140 32 115 28 Q110 28 105 30 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M105 56 Q92 58 88 70 Q90 82 102 86 Q114 86 120 76 Q122 64 112 58 Q108 56 105 56 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" fill="none"/>
      <path className="draw" d="M106 38 Q100 40 100 46 Q102 50 108 48 Q112 46 110 40 Q108 38 106 38 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M128 44 Q122 46 122 52 Q124 56 130 54 Q134 52 132 46 Q130 44 128 44 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M138 64 Q132 66 132 72 Q134 76 140 74 Q144 72 142 66 Q140 64 138 64 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M128 86 Q122 88 122 94 Q124 98 130 96 Q134 94 132 88 Q130 86 128 86 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M90 92 Q84 94 84 100 Q86 104 92 102 Q96 100 94 94 Q92 92 90 92 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M72 70 Q66 72 66 78 Q68 82 74 80 Q78 78 76 72 Q74 70 72 70 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M78 46 Q72 48 72 54 Q74 58 80 56 Q84 54 82 48 Q80 46 78 46 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <text x="6" y="125" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">6205-2RS · L₁₀=10⁶</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Schrödinger</text>
      <text x="6" y="40" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">iℏ ∂Ψ/∂t = ĤΨ</text>
      <path className="draw" d="M6 48 Q80 47 180 48" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="6" y="66" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">quantum state evolution</text>
      <text x="6" y="80" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">|Ψ|² = probability</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">4-bar linkage</text>
      <path className="draw" d="M14 88 Q90 87 180 88" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9" strokeDasharray="3 3"/>
      <path className="draw" d="M22 90 L17 96" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <path className="draw" d="M32 90 L27 96" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <path className="draw" d="M150 90 L145 96" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <path className="draw" d="M160 90 L155 96" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <path className="draw" d="M28 88 Q44 60 60 38" stroke="hsl(190, 40%, 65%)" strokeWidth="1.8"/>
      <path className="draw" d="M60 38 Q90 36 140 32" stroke="hsl(38, 60%, 52%)" strokeWidth="1.8"/>
      <path className="draw" d="M140 32 Q146 60 154 88" stroke="hsl(190, 40%, 65%)" strokeWidth="1.8"/>
      <path className="draw" d="M25 88 Q28 85 31 88 Q31 91 28 91 Q25 91 25 88 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="hsl(220, 60%, 23%)"/>
      <path className="draw" d="M57 38 Q60 35 63 38 Q63 41 60 41 Q57 41 57 38 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="hsl(220, 60%, 23%)"/>
      <path className="draw" d="M137 32 Q140 29 143 32 Q143 35 140 35 Q137 35 137 32 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="hsl(220, 60%, 23%)"/>
      <path className="draw" d="M151 88 Q154 85 157 88 Q157 91 154 91 Q151 91 151 88 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="hsl(220, 60%, 23%)"/>
      <path className="draw" d="M28 76 Q34 68 42 60" stroke="hsl(0, 84%, 60%)" strokeWidth="0.9" fill="none"/>
      <text x="34" y="74" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade label">θ</text>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Grashof: s+l ≤ p+q</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">PID controller</text>
      <text x="6" y="34" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">u = Kpe + Ki∫e + Kdė</text>
      <path className="draw" d="M8 56 Q40 54 70 56" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M70 56 Q88 46 88 66 Q88 76 70 66" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M88 66 Q120 66 152 64" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M146 60 L154 64 L146 68" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M152 64 Q170 76 130 86 Q60 88 8 84 Q4 66 8 56" stroke="hsl(38, 60%, 52%)" strokeWidth="0.9" strokeDasharray="3 3" fill="none"/>
      <text x="78" y="56" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">G(s)</text>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Ziegler-Nichols tune</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 120" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Mohr's circle</text>
      <path className="draw" d="M14 64 Q90 63 180 65" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M96 22 Q95 60 97 108" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M105 32 Q70 35 60 65 Q65 95 100 100 Q135 98 140 68 Q135 36 105 32 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.6" fill="none"/>
      <path className="draw" d="M68 48 Q100 65 132 82" stroke="hsl(0, 84%, 60%)" strokeWidth="1" strokeDasharray="3 2"/>
      <text x="48" y="44" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade label">σx,τ</text>
      <text x="134" y="78" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">σy</text>
      <text x="6" y="115" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">principal stresses</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">cantilever</text>
      <path className="draw" d="M18 38 Q18 60 19 80" stroke="hsl(36, 37%, 96%)" strokeWidth="2"/>
      <path className="draw" d="M14 42 L18 38" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M14 50 L18 46" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M14 58 L18 54" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M14 66 L18 62" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M14 74 L18 70" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M19 50 Q70 51 120 56 Q150 60 180 70" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M19 58 Q70 59 120 64 Q150 68 180 78" stroke="hsl(36, 37%, 96%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M176 56 Q176 66 176 76" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5"/>
      <path className="draw" d="M172 70 L176 78 L180 70" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5" fill="none"/>
      <text x="170" y="50" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade">P</text>
      <text x="6" y="96" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">δ = PL³/3EI</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Carnot cycle</text>
      <path className="draw" d="M22 92 Q90 91 182 93" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M22 22 Q21 55 22 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M40 36 Q60 32 90 30 Q120 32 140 36" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M140 36 Q150 50 160 70" stroke="hsl(38, 60%, 52%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M160 70 Q120 76 60 78 Q40 76 30 70" stroke="hsl(0, 84%, 60%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M30 70 Q34 56 40 36" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <text x="46" y="28" fontSize="10" fill="hsl(190, 40%, 65%)" className="fade label">T_hot</text>
      <text x="20" y="76" fontSize="10" fill="hsl(0, 84%, 60%)" className="fade label">T_cold</text>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">η = 1 - Tc/Th</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">NPN BJT</text>
      <path className="draw" d="M88 30 Q60 32 56 60 Q60 88 90 90 Q120 88 122 60 Q118 30 90 30 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <path className="draw" d="M70 44 Q70 60 70 76" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4"/>
      <path className="draw" d="M14 60 Q42 60 70 60" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3"/>
      <path className="draw" d="M70 50 Q88 42 100 36 Q102 26 102 18" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M70 70 Q88 78 100 84 Q102 92 102 98" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M93 80 L102 84 L96 88" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <text x="6" y="56" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">B</text>
      <text x="106" y="22" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">C</text>
      <text x="106" y="96" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">E</text>
      <text x="130" y="60" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">Ic = β·Ib</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Lagrangian mech</text>
      <text x="6" y="40" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">L = T - V</text>
      <text x="6" y="62" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">d/dt(∂L/∂q̇) = ∂L/∂q</text>
      <path className="draw" d="M6 70 Q80 69 180 70" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="6" y="86" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Euler-Lagrange eq.</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">hydraulics</text>
      <path className="draw" d="M16 50 Q16 65 17 80 Q40 81 60 80 Q61 65 60 50 Q40 49 16 50 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" fill="none"/>
      <path className="draw" d="M22 50 Q22 60 22 70" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <path className="draw" d="M22 36 Q22 42 22 50" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <path className="draw" d="M16 36 Q22 35 28 36" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4"/>
      <path className="draw" d="M60 65 Q100 64 130 65" stroke="hsl(190, 40%, 65%)" strokeWidth="1.3"/>
      <path className="draw" d="M130 30 Q130 60 131 90 Q170 91 188 90 Q189 60 188 30 Q170 29 130 30 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" fill="none"/>
      <path className="draw" d="M148 30 Q148 60 148 80" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <path className="draw" d="M148 16 Q148 22 148 30" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2"/>
      <path className="draw" d="M138 16 Q148 15 158 16" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4"/>
      <text x="6" y="96" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">F₂/F₁ = A₂/A₁</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 80" fill="none">
      <text x="6" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Reynolds number</text>
      <text x="6" y="38" fontSize="16" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">Re = ρvL/μ</text>
      <path className="draw" d="M6 44 Q80 43 180 44" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="6" y="60" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Re &lt; 2300 → laminar</text>
      <text x="6" y="74" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade label">Re &gt; 4000 → turbulent</text>
    </svg>
  </div>
      </div>
      <div ref={rightRef} className="margin-doodles margin-doodles--right hidden min-[800px]:block">

  <div className="doodle">
    <svg viewBox="0 0 200 80" fill="none">
      <text x="6" y="18" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">NPV</text>
      <text x="6" y="46" fontSize="18" fill="hsl(36, 37%, 96%)" className="fade label" fontStyle="italic">Σ CFt/(1+r)ᵗ</text>
      <path className="draw" d="M6 54 Q80 54 180 54" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <text x="6" y="70" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">money has time value</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 120" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">revenue</text>
      <path className="draw" d="M22 96 Q90 95 188 97" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M22 22 Q21 60 22 96" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M30 76 Q36 75 42 76 Q42 86 42 96 Q36 96 30 96 Q30 86 30 76 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M55 64 Q61 63 67 64 Q67 80 67 96 Q61 96 55 96 Q55 80 55 64 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M80 54 Q86 53 92 54 Q92 75 92 96 Q86 96 80 96 Q80 75 80 54 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M105 60 Q111 59 117 60 Q117 78 117 96 Q111 96 105 96 Q105 78 105 60 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M130 42 Q136 41 142 42 Q142 70 142 96 Q136 96 130 96 Q130 70 130 42 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M155 30 Q161 29 167 30 Q167 64 167 96 Q161 96 155 96 Q155 64 155 30 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.4" fill="none"/>
      <path className="draw" d="M36 76 Q61 64 86 54 Q111 60 136 42 Q150 36 161 30" stroke="hsl(38, 60%, 52%)" strokeWidth="1.2" strokeDasharray="3 2" fill="none"/>
      <text x="8" y="115" fontSize="13" fill="hsl(38, 60%, 52%)" className="fade">CAGR ~34%</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Black-Scholes</text>
      <text x="8" y="38" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">C = SN(d₁) - Ke^(-rT)N(d₂)</text>
      <text x="8" y="58" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">d₁ = [ln(S/K)+(r+σ²/2)T] / σ√T</text>
      <text x="8" y="74" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade label">d₂ = d₁ - σ√T</text>
      <path className="draw" d="M8 80 Q80 79 180 80" stroke="hsl(36, 37%, 96%)" strokeWidth="0.6"/>
      <text x="8" y="96" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">Nobel '97 · option pricing</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">funnel</text>
      <path className="draw" d="M20 26 Q90 24 180 26 Q160 48 140 50 Q90 51 50 50 Q30 48 20 26 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M50 52 Q90 51 140 52 Q124 74 110 76 Q90 77 60 76 Q52 74 50 52 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M60 78 Q90 77 110 78 Q102 100 96 102 Q90 103 74 102 Q66 100 60 78 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M74 104 Q90 103 96 104 Q92 122 90 124 Q88 124 80 122 Q76 120 74 104 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <text x="70" y="40" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">12.4K</text>
      <text x="74" y="68" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">4.2K</text>
      <text x="78" y="92" fontSize="11" fill="hsl(36, 37%, 96%)" className="fade">890</text>
      <text x="78" y="118" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">312</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">CAPM</text>
      <text x="8" y="40" fontSize="16" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">E(R) = Rf + β(Rm - Rf)</text>
      <path className="draw" d="M8 48 Q80 47 180 48" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="64" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">β &gt; 1: more volatile</text>
      <text x="8" y="80" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">premium = risk · price</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 160" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">user flow</text>
      <path className="draw" d="M40 22 Q90 20 150 22 Q152 32 150 42 Q90 44 40 42 Q38 32 40 22 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <text x="68" y="36" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">landing</text>
      <text x="155" y="36" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">100%</text>
      <path className="draw" d="M95 44 Q95 50 95 56" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M92 53 L95 58 L98 53" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M40 60 Q90 58 150 60 Q152 70 150 80 Q90 82 40 80 Q38 70 40 60 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <text x="68" y="74" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">sign up</text>
      <text x="155" y="74" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">34%</text>
      <path className="draw" d="M95 82 Q95 88 95 94" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M92 91 L95 96 L98 91" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M40 98 Q90 96 150 98 Q152 108 150 118 Q90 120 40 118 Q38 108 40 98 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.2" fill="none"/>
      <text x="60" y="112" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">onboard</text>
      <text x="155" y="112" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">22%</text>
      <path className="draw" d="M95 120 Q95 126 95 132" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M92 129 L95 134 L98 129" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M40 136 Q90 134 150 136 Q152 146 150 156 Q90 158 40 156 Q38 146 40 136 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.6" fill="none"/>
      <text x="62" y="150" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade">activated ★</text>
      <text x="155" y="150" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">12%</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">impact / effort</text>
      <path className="draw" d="M22 22 Q21 60 22 110" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M22 110 Q90 109 180 110" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M100 24 Q99 60 100 108" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8" strokeDasharray="3 3"/>
      <path className="draw" d="M24 66 Q90 65 178 66" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8" strokeDasharray="3 3"/>
      <text x="36" y="44" fontSize="13" fill="hsl(190, 40%, 65%)" className="fade">quick wins</text>
      <text x="110" y="44" fontSize="13" fill="hsl(38, 60%, 52%)" className="fade">big bets ★</text>
      <text x="40" y="92" fontSize="12" fill="hsl(36, 12%, 60%)" className="fade">fill-in</text>
      <text x="116" y="92" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade">avoid</text>
      <path className="draw" d="M58 38 Q62 36 64 40 Q62 44 58 42 Q56 40 58 38 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1" fill="hsl(190, 40%, 65%)"/>
      <path className="draw" d="M68 48 Q72 46 73 50 Q71 53 68 51 Q66 50 68 48 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1" fill="hsl(190, 40%, 65%)"/>
      <path className="draw" d="M130 36 Q135 34 137 39 Q135 44 130 42 Q127 40 130 36 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.2" fill="hsl(38, 60%, 52%)"/>
      <path className="draw" d="M145 80 Q148 78 150 82 Q148 85 145 83 Q143 82 145 80 Z" stroke="hsl(0, 84%, 60%)" strokeWidth="1" fill="hsl(0, 84%, 60%)"/>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Porter's 5 forces</text>
      <path className="draw" d="M85 50 Q70 52 70 65 Q72 78 85 80 Q100 78 100 65 Q98 52 85 50 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" fill="none"/>
      <text x="68" y="68" fontSize="9" fill="hsl(36, 37%, 96%)" className="fade label">rivalry</text>
      <path className="draw" d="M84 22 Q86 36 85 50" stroke="hsl(190, 40%, 65%)" strokeWidth="1"/>
      <text x="60" y="20" fontSize="10" fill="hsl(190, 40%, 65%)" className="fade label">new entrants</text>
      <path className="draw" d="M70 65 Q40 65 14 64" stroke="hsl(190, 40%, 65%)" strokeWidth="1"/>
      <text x="6" y="56" fontSize="10" fill="hsl(190, 40%, 65%)" className="fade label">suppliers</text>
      <path className="draw" d="M100 65 Q140 65 180 64" stroke="hsl(190, 40%, 65%)" strokeWidth="1"/>
      <text x="146" y="56" fontSize="10" fill="hsl(190, 40%, 65%)" className="fade label">buyers</text>
      <path className="draw" d="M85 80 Q86 96 85 110" stroke="hsl(190, 40%, 65%)" strokeWidth="1"/>
      <text x="64" y="120" fontSize="10" fill="hsl(190, 40%, 65%)" className="fade label">substitutes</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 120" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">OKRs Q3</text>
      <path className="draw" d="M8 20 Q90 19 188 20" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="36" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">→ scale to 1M</text>
      <text x="14" y="54" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">DAU → 250K</text>
      <path className="draw" d="M14 58 Q90 57 168 58" stroke="hsl(36, 12%, 60%)" strokeWidth="1"/>
      <path className="draw" d="M14 58 Q56 57 110 58" stroke="hsl(190, 40%, 65%)" strokeWidth="2.5"/>
      <text x="172" y="62" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">72%</text>
      <text x="14" y="78" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">churn &lt; 3%</text>
      <path className="draw" d="M14 82 Q90 81 168 82" stroke="hsl(36, 12%, 60%)" strokeWidth="1"/>
      <path className="draw" d="M14 82 Q78 81 142 82" stroke="hsl(190, 40%, 65%)" strokeWidth="2.5"/>
      <text x="172" y="86" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">88%</text>
      <text x="14" y="102" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">NPS &gt; 60</text>
      <path className="draw" d="M14 106 Q90 105 168 106" stroke="hsl(36, 12%, 60%)" strokeWidth="1"/>
      <path className="draw" d="M14 106 Q44 105 86 106" stroke="hsl(0, 84%, 60%)" strokeWidth="2.5"/>
      <text x="172" y="110" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade">54%</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">WACC</text>
      <text x="8" y="38" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">= (E/V)Re + (D/V)Rd(1-T)</text>
      <path className="draw" d="M8 46 Q80 45 180 46" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="62" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">cost of capital</text>
      <text x="8" y="78" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">discount rate hurdle</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">market mix</text>
      <path className="draw" d="M100 30 Q70 32 60 60 Q59 88 85 100 Q113 104 135 88 Q147 60 130 38 Q115 28 100 30 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.4" fill="none"/>
      <path className="draw" d="M100 65 Q101 50 101 30" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M100 65 Q117 56 135 47" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M100 65 Q117 80 131 92" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M100 65 Q81 78 65 88" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <text x="107" y="46" fontSize="12" fill="hsl(190, 40%, 65%)" className="fade">35</text>
      <text x="117" y="74" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade">25</text>
      <text x="93" y="92" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade">22</text>
      <text x="73" y="68" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">18</text>
      <text x="8" y="118" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">share by line</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">unit econ</text>
      <path className="draw" d="M8 20 Q90 19 188 20" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="38" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade label">LTV $4,280</text>
      <text x="8" y="54" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade label">CAC $890</text>
      <text x="8" y="72" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade">ratio 4.8× ✓</text>
      <path className="draw" d="M8 78 Q80 77 160 78" stroke="hsl(36, 37%, 96%)" strokeWidth="0.6"/>
      <text x="8" y="94" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">payback 6.2mo</text>
      <text x="8" y="108" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">margin 72%</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">competitive map</text>
      <path className="draw" d="M18 22 Q17 60 18 110" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <path className="draw" d="M18 110 Q90 109 188 110" stroke="hsl(36, 37%, 96%)" strokeWidth="1"/>
      <text x="74" y="124" fontSize="11" fill="hsl(36, 37%, 96%)" className="fade label">price →</text>
      <path className="draw" d="M48 78 Q40 80 40 88 Q44 96 52 92 Q58 86 54 78 Q50 76 48 78 Z" stroke="hsl(36, 12%, 60%)" strokeWidth="1" fill="none"/>
      <text x="42" y="90" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">A</text>
      <path className="draw" d="M125 40 Q112 42 110 56 Q114 70 128 68 Q142 64 140 50 Q134 38 125 40 Z" stroke="hsl(36, 12%, 60%)" strokeWidth="1" fill="none"/>
      <text x="122" y="58" fontSize="12" fill="hsl(36, 12%, 60%)" className="fade">B</text>
      <path className="draw" d="M92 64 Q86 66 86 72 Q90 78 96 76 Q100 70 98 66 Q96 62 92 64 Z" stroke="hsl(36, 12%, 60%)" strokeWidth="1" fill="none"/>
      <text x="88" y="74" fontSize="10" fill="hsl(36, 12%, 60%)" className="fade">C</text>
      <path className="draw" d="M62 38 Q50 40 48 52 Q52 64 64 64 Q76 60 76 48 Q72 38 62 38 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.5" fill="none"/>
      <text x="56" y="56" fontSize="13" fill="hsl(38, 60%, 52%)" className="fade">us ★</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">Metcalfe's law</text>
      <text x="8" y="40" fontSize="16" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">V ∝ n²</text>
      <path className="draw" d="M8 48 Q80 47 180 48" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="66" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">value scales w/ users²</text>
      <text x="8" y="82" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">moat = network density</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">roadmap</text>
      <text x="30" y="28" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">Q1</text>
      <text x="72" y="28" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">Q2</text>
      <text x="114" y="28" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">Q3</text>
      <text x="156" y="28" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade">Q4</text>
      <path className="draw" d="M8 32 Q90 31 188 32" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M22 40 Q70 39 92 40 Q93 46 92 52 Q70 53 22 52 Q21 46 22 40 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M114 40 Q140 39 152 40 Q153 46 152 52 Q140 53 114 52 Q113 46 114 40 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M50 60 Q100 59 130 60 Q131 66 130 72 Q100 73 50 72 Q49 66 50 60 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M22 80 Q42 79 56 80 Q57 86 56 92 Q42 93 22 92 Q21 86 22 80 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M86 80 Q140 79 178 80 Q179 86 178 92 Q140 93 86 92 Q85 86 86 80 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M82 32 Q81 60 82 100" stroke="hsl(0, 84%, 60%)" strokeWidth="1.3"/>
      <text x="74" y="108" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade">now</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">cap table</text>
      <path className="draw" d="M8 20 Q90 19 188 20" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="36" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">founders  52%</text>
      <path className="draw" d="M8 40 Q80 39 168 40" stroke="hsl(36, 12%, 60%)" strokeWidth="0.8"/>
      <path className="draw" d="M8 40 Q50 39 96 40" stroke="hsl(190, 40%, 65%)" strokeWidth="2"/>
      <text x="8" y="56" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">seed       18%</text>
      <path className="draw" d="M8 60 Q80 59 168 60" stroke="hsl(36, 12%, 60%)" strokeWidth="0.8"/>
      <path className="draw" d="M8 60 Q22 59 38 60" stroke="hsl(190, 40%, 65%)" strokeWidth="2"/>
      <text x="8" y="76" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">series A   22%</text>
      <path className="draw" d="M8 80 Q80 79 168 80" stroke="hsl(36, 12%, 60%)" strokeWidth="0.8"/>
      <path className="draw" d="M8 80 Q26 79 46 80" stroke="hsl(190, 40%, 65%)" strokeWidth="2"/>
      <text x="8" y="96" fontSize="12" fill="hsl(38, 60%, 52%)" className="fade label">ESOP        8%</text>
      <path className="draw" d="M8 100 Q80 99 168 100" stroke="hsl(36, 12%, 60%)" strokeWidth="0.8"/>
      <path className="draw" d="M8 100 Q14 99 24 100" stroke="hsl(38, 60%, 52%)" strokeWidth="2"/>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 120" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">prisoner's dilemma</text>
      <path className="draw" d="M50 24 Q100 23 170 24 Q171 50 170 76 Q171 100 170 110 Q100 111 50 110 Q49 80 50 50 Q49 36 50 24 Z" stroke="hsl(36, 37%, 96%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M50 50 Q110 49 170 50" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M50 80 Q110 79 170 80" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <path className="draw" d="M110 24 Q109 60 110 110" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <text x="60" y="42" fontSize="9" fill="hsl(36, 12%, 60%)" className="fade label">B coop</text>
      <text x="118" y="42" fontSize="9" fill="hsl(36, 12%, 60%)" className="fade label">B defect</text>
      <text x="20" y="68" fontSize="9" fill="hsl(36, 12%, 60%)" className="fade label">A coop</text>
      <text x="20" y="98" fontSize="9" fill="hsl(36, 12%, 60%)" className="fade label">A def</text>
      <text x="76" y="70" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">-1,-1</text>
      <text x="130" y="70" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade">-3, 0</text>
      <text x="76" y="100" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade"> 0,-3</text>
      <text x="130" y="100" fontSize="11" fill="hsl(0, 84%, 60%)" className="fade">-2,-2</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 100" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">AARRR ⚓</text>
      <path className="draw" d="M8 20 Q90 19 188 20" stroke="hsl(36, 37%, 96%)" strokeWidth="0.7"/>
      <text x="8" y="36" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">acquisition  12K</text>
      <text x="8" y="50" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">activation   68%</text>
      <text x="8" y="64" fontSize="12" fill="hsl(0, 84%, 60%)" className="fade label">retention    42%</text>
      <text x="8" y="78" fontSize="12" fill="hsl(36, 37%, 96%)" className="fade label">revenue    $89K</text>
      <text x="8" y="92" fontSize="12" fill="hsl(190, 40%, 65%)" className="fade label">referral    1.4×</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">TAM·SAM·SOM</text>
      <path className="draw" d="M100 26 Q40 30 35 70 Q40 110 95 116 Q150 112 158 72 Q150 30 105 26 Q103 26 100 26 Z" stroke="hsl(36, 12%, 60%)" strokeWidth="1" fill="none"/>
      <path className="draw" d="M100 44 Q66 46 60 70 Q64 92 96 96 Q124 94 132 72 Q126 46 102 44 Q101 44 100 44 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M98 64 Q86 66 84 76 Q88 86 98 86 Q108 84 110 74 Q106 64 98 64 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.4" fill="none"/>
      <text x="56" y="38" fontSize="11" fill="hsl(36, 12%, 60%)" className="fade">14B</text>
      <text x="68" y="56" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade">3.1B</text>
      <text x="86" y="78" fontSize="11" fill="hsl(190, 40%, 65%)" className="fade">420M</text>
      <text x="8" y="125" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">addressable: SOM</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 90" fill="none">
      <text x="8" y="20" fontSize="14" fill="hsl(36, 37%, 96%)" className="fade">rule of 40</text>
      <path className="draw" d="M8 26 Q90 25 188 26" stroke="hsl(36, 37%, 96%)" strokeWidth="0.8"/>
      <text x="8" y="48" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade label" fontStyle="italic">growth + margin ≥ 40</text>
      <text x="8" y="68" fontSize="14" fill="hsl(38, 60%, 52%)" className="fade">28 + 18 = 46 ✓</text>
      <text x="8" y="84" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">SaaS health metric</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 110" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">cohort retention</text>
      <path className="draw" d="M22 92 Q90 91 188 93" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M22 22 Q21 55 22 92" stroke="hsl(36, 37%, 96%)" strokeWidth="0.9"/>
      <path className="draw" d="M24 28 Q44 50 64 64 Q90 76 120 82 Q150 86 182 88" stroke="hsl(190, 40%, 65%)" strokeWidth="1.5" fill="none"/>
      <path className="draw" d="M24 36 Q44 56 64 70 Q90 80 120 84 Q150 87 182 89" stroke="hsl(38, 60%, 52%)" strokeWidth="1.3" fill="none"/>
      <path className="draw" d="M24 46 Q44 64 64 76 Q90 84 120 87 Q150 89 182 90" stroke="hsl(0, 84%, 60%)" strokeWidth="1.1" fill="none"/>
      <text x="6" y="106" fontSize="11" fill="hsl(38, 60%, 52%)" className="fade label">D1, D7, D30 cohorts</text>
    </svg>
  </div>
  <div className="doodle">
    <svg viewBox="0 0 200 130" fill="none">
      <text x="8" y="14" fontSize="13" fill="hsl(36, 37%, 96%)" className="fade">SWOT</text>
      <path className="draw" d="M14 24 Q50 23 92 24 Q93 50 92 76 Q50 77 14 76 Q13 50 14 24 Z" stroke="hsl(190, 40%, 65%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M100 24 Q140 23 184 24 Q185 50 184 76 Q140 77 100 76 Q99 50 100 24 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M14 84 Q50 83 92 84 Q93 100 92 120 Q50 121 14 120 Q13 100 14 84 Z" stroke="hsl(38, 60%, 52%)" strokeWidth="1.1" fill="none"/>
      <path className="draw" d="M100 84 Q140 83 184 84 Q185 100 184 120 Q140 121 100 120 Q99 100 100 84 Z" stroke="hsl(0, 84%, 60%)" strokeWidth="1.1" fill="none"/>
      <text x="46" y="48" fontSize="14" fill="hsl(190, 40%, 65%)" className="fade">S</text>
      <text x="138" y="48" fontSize="14" fill="hsl(38, 60%, 52%)" className="fade">W</text>
      <text x="46" y="106" fontSize="14" fill="hsl(38, 60%, 52%)" className="fade">O</text>
      <text x="138" y="106" fontSize="14" fill="hsl(0, 84%, 60%)" className="fade">T</text>
    </svg>
  </div>
      </div>
    </>
  );
};

export default MarginDoodles;
