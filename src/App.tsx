import { useState, useEffect, useCallback } from 'react';
import { Analytics } from "@vercel/analytics/next"
import { 
  MousePointer2, 
  HelpCircle, 
  Loader2, 
  Clock, 
  Crosshair, 
  Type, 
  Ban, 
  ArrowUpDown, 
  ArrowLeftRight, 
  MoveDiagonal, 
  MoveDiagonal2, 
  Move, 
  Pointer,
  Copy,
  Check,
  Code2
} from 'lucide-react';
import { toast } from 'sonner';

interface CursorType {
  id: string;
  name: string;
  cssValue: string;
  icon: React.ReactNode;
  description: string;
}

const cursorTypes: CursorType[] = [
  { id: 'default', name: '通常の選択', cssValue: 'default', icon: <MousePointer2 className="w-6 h-6" />, description: '標準的なマウスカーソル' },
  { id: 'pointer', name: 'リンクの選択', cssValue: 'pointer', icon: <Pointer className="w-6 h-6" />, description: 'クリックできることを示す' },
  { id: 'text', name: 'テキスト選択', cssValue: 'text', icon: <Type className="w-6 h-6" />, description: 'テキストを選択できることを示す' },
  { id: 'move', name: '移動', cssValue: 'move', icon: <Move className="w-6 h-6" />, description: '移動できることを示す' },
  { id: 'crosshair', name: '領域選択', cssValue: 'crosshair', icon: <Crosshair className="w-6 h-6" />, description: '精密な選択ができるようにする' },
  { id: 'help', name: 'ヘルプの選択', cssValue: 'help', icon: <HelpCircle className="w-6 h-6" />, description: 'ヘルプ情報があることを示す' },
  { id: 'progress', name: 'バックグラウンドで作業中', cssValue: 'progress', icon: <Loader2 className="w-6 h-6" />, description: '処理中だが操作できることを示す' },
  { id: 'wait', name: '待ち状態', cssValue: 'wait', icon: <Clock className="w-6 h-6" />, description: '処理待ちで操作できないことを示す' },
  { id: 'not-allowed', name: '利用不可', cssValue: 'not-allowed', icon: <Ban className="w-6 h-6" />, description: '操作できないことを示す' },
  { id: 'ns-resize', name: '上下に拡大/縮小', cssValue: 'ns-resize', icon: <ArrowUpDown className="w-6 h-6" />, description: '垂直にリサイズできることを示す' },
  { id: 'ew-resize', name: '左右に拡大/縮小', cssValue: 'ew-resize', icon: <ArrowLeftRight className="w-6 h-6" />, description: '水平にリサイズできることを示す' },
  { id: 'nesw-resize', name: '斜めに拡大/縮小 1', cssValue: 'nesw-resize', icon: <MoveDiagonal className="w-6 h-6" />, description: '右上・左下にリサイズできることを示す' },
  { id: 'nwse-resize', name: '斜めに拡大/縮小 2', cssValue: 'nwse-resize', icon: <MoveDiagonal2 className="w-6 h-6" />, description: '左上・右下にリサイズできることを示す' },
];

function CursorCard({ cursor }: { cursor: CursorType }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  }, []);

  const copyToClipboard = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`cursor: ${cursor.cssValue};`);
    setCopied(true);
    toast.success('CSSコードをコピーしました！', {
      description: `cursor: ${cursor.cssValue};`,
      descriptionClassName: "!text-white/60",
    });
    setTimeout(() => setCopied(false), 2000);
  }, [cursor.cssValue]);

  return (
    <div
      className={`cursor-card group relative overflow-hidden rounded-2xl transition-all duration-500 ${cursor.id}`}
      style={{ cursor: cursor.cssValue }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Spotlight effect */}
      <div
        className="spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Glass background */}
      <div className="glass-card absolute inset-0 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[180px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="icon-wrapper p-3 rounded-xl bg-white/5 text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-all duration-300">
            {cursor.icon}
          </div>
          <button
            onClick={copyToClipboard}
            className="copy-btn p-2 rounded-lg bg-white/5 text-white/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
            title="CSSコードをコピー"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
            {cursor.name}
          </h3>
          <p className="text-xs text-white/40 mt-1 group-hover:text-white/60 transition-colors">
            {cursor.description}
          </p>
        </div>

        {/* CSS Code preview */}
        <div className="mt-4 flex items-center gap-2 text-xs text-white/30 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Code2 className="w-3 h-3" />
          <span>cursor: {cursor.cssValue};</span>
        </div>

        {/* Hotspot indicator */}
        {isHovered && (
          <div
            className="hotspot absolute w-3 h-3 pointer-events-none z-20"
            style={{
              left: mousePos.x - 6,
              top: mousePos.y - 6,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/60 border border-cyan-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
          </div>
        )}

        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple-effect absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-cyan-500/30 transition-colors duration-500 pointer-events-none" />
    </div>
  );
}

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Global spotlight that follows cursor */}
      <div
        className="fixed pointer-events-none z-0 transition-transform duration-100 ease-out"
        style={{
          left: mousePos.x - 400,
          top: mousePos.y - 400,
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-16 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-thin text-white py-2 sm:pt-12 mb-6 animate-fade-in-up">
              マウスカーソル
              <br className="sm:hidden" />チェッカー
            </h1>

            {/* Description */}
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              マウスカーソルの見た目とホットスポットをWEB上で簡単に確認できるツールです。
              <br className="hidden md:block" />
              各カードにマウスをかざして、カーソルの変化を確認してください。
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/50 text-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>13種類のカーソルを確認</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/50 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>ホットスポットを表示</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/50 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>CSSコードをコピー</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cursor Grid */}
        <main className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cursorTypes.map((cursor, index) => (
                <div
                  key={cursor.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <CursorCard cursor={cursor} />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/5 bg-black/30">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Hato. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
