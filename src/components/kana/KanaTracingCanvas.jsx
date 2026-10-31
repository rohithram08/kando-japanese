import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Eraser,
  Eye,
  EyeOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  PenTool,
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { getKanaStrokeData } from '../../data/kana/kanaStrokes';

export default function KanaTracingCanvas({
  kana,
  onCompletePractice,
  isDark = false,
}) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const strokesCount = useRef(0);
  const strokeHistory = useRef([]); // array of point arrays

  const [showGuide, setShowGuide] = useState(true);
  const [strokeFeedback, setStrokeFeedback] = useState(null);
  const [inkDrawn, setInkDrawn] = useState(false);

  const strokeData = getKanaStrokeData(kana?.kana);

  // Initialize and redraw grid lines
  const drawGrid = useCallback(
    (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height);

      // Japanese 4-quadrant dashed practice box
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);

      // Diagonal guides
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      ctx.setLineDash([]); // reset to solid
    },
    [isDark]
  );

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawGrid(ctx, canvas.width, canvas.height);

    ctx.strokeStyle = isDark ? '#f3f4f6' : '#111827';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokeHistory.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
    });
  }, [drawGrid, isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 320;
    redrawCanvas();
    setStrokeFeedback(null);
    setInkDrawn(false);
    strokeHistory.current = [];
    strokesCount.current = 0;
  }, [kana, redrawCanvas]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pt = getCanvasCoords(e);
    isDrawing.current = true;
    strokeHistory.current.push([pt]);
    strokesCount.current += 1;
    setInkDrawn(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pt = getCanvasCoords(e);
    const currentStroke = strokeHistory.current[strokeHistory.current.length - 1];
    if (currentStroke) {
      currentStroke.push(pt);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prevPt = currentStroke[currentStroke.length - 2] || pt;

    ctx.strokeStyle = isDark ? '#f3f4f6' : '#111827';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    strokeHistory.current = [];
    strokesCount.current = 0;
    setInkDrawn(false);
    setStrokeFeedback(null);
    redrawCanvas();
  };

  // Evaluate drawing (honest assessment)
  const handleCheckDrawing = () => {
    const expectedStrokes = kana.strokeCount || strokeData?.strokeCount || 1;
    const actualStrokes = strokeHistory.current.length;

    // Check pixel density in center quadrant
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let filledPixels = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 50) filledPixels++;
    }

    const hasEnoughInk = filledPixels > 1200;

    if (!hasEnoughInk) {
      setStrokeFeedback({
        status: 'warning',
        message: 'Canvas appears empty or stroke too brief. Follow the guide lines to practice!',
      });
      return;
    }

    if (actualStrokes === expectedStrokes) {
      setStrokeFeedback({
        status: 'success',
        message: `Great rhythm! You completed the expected ${expectedStrokes} stroke(s). Keep practicing to build muscle memory.`,
      });
      audioService.speak(kana.kana);
      onCompletePractice?.(kana);
    } else {
      setStrokeFeedback({
        status: 'info',
        message: `You drew ${actualStrokes} stroke(s), while standard ${kana.kana} has ${expectedStrokes} stroke(s). Practice lifting your pen between strokes!`,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Target Character Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-japanese font-bold text-foreground">
            {kana.kana}
          </span>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {kana.romaji}
            </span>
            <p className="text-xs text-muted-foreground">
              {kana.strokeCount || 1} stroke(s) &bull; {kana.script}
            </p>
          </div>
        </div>

        <button
          onClick={() => audioService.speak(kana.kana)}
          className="p-2 rounded-xl text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          title="Pronounce"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Drawing Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-muted/20 shadow-inner flex items-center justify-center">
        {/* Guide character underlay */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span
              style={{ fontSize: '200px', lineHeight: 1 }}
              className="font-japanese font-black text-foreground opacity-[0.07]"
            >
              {kana.kana}
            </span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="relative z-10 block touch-none cursor-crosshair"
          style={{ width: '320px', height: '320px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowGuide((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-muted text-muted-foreground transition-colors"
        >
          {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-muted text-muted-foreground transition-colors"
          >
            <Eraser className="w-3.5 h-3.5" /> Clear
          </button>

          <button
            onClick={handleCheckDrawing}
            disabled={!inkDrawn}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              inkDrawn
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow'
                : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Check Strokes
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {strokeFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
            strokeFeedback.status === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : strokeFeedback.status === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
          }`}
        >
          {strokeFeedback.status === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
          )}
          <div>{strokeFeedback.message}</div>
        </motion.div>
      )}

      {/* Honest validation disclaimer */}
      <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-4">
        <em>Note on Tracing Practice:</em> Canvas feedback verifies basic stroke count and shape coverage.
        True calligraphic mastery requires muscle memory and balance drills.
      </p>
    </div>
  );
}
