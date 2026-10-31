import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { fetchKanjiStrokes } from "../../services/kanjiStrokeService";

// ── Stroke Data ───────────────────────────────────────────────────
const KANJI_STROKES = {
  一: { strokes: ["M 20 50 L 80 50"], tips: ["Single horizontal stroke from left to right"] },
  二: { strokes: ["M 25 35 L 75 35", "M 20 65 L 80 65"], tips: ["Top horizontal stroke", "Bottom horizontal stroke (longer)"] },
  三: { strokes: ["M 30 25 L 70 25", "M 20 50 L 80 50", "M 25 75 L 75 75"], tips: ["Top short stroke", "Middle longer stroke", "Bottom stroke"] },
  四: { strokes: ["M 25 20 L 75 20", "M 25 20 L 25 80", "M 75 20 L 75 80", "M 25 80 L 75 80", "M 45 20 L 45 80"], tips: ["Top horizontal", "Left vertical", "Right vertical", "Bottom horizontal", "Inner vertical divider"] },
  五: { strokes: ["M 25 20 L 75 20", "M 30 20 L 30 55", "M 30 55 L 70 55", "M 70 55 L 70 75 L 30 75", "M 20 75 L 80 75"], tips: ["Top horizontal", "Left vertical down", "Middle horizontal", "Right curve and bottom", "Final horizontal"] },
  六: { strokes: ["M 50 15 L 50 30", "M 30 30 L 70 30", "M 30 50 L 20 80", "M 70 50 L 80 80"], tips: ["Top dot/short stroke", "Horizontal stroke", "Left diagonal down", "Right diagonal down"] },
  七: { strokes: ["M 20 35 L 75 35", "M 60 35 L 45 80"], tips: ["Horizontal stroke left to right", "Diagonal stroke curving down-left"] },
  八: { strokes: ["M 45 20 L 25 75", "M 55 20 L 75 75"], tips: ["Left diagonal stroke", "Right diagonal stroke"] },
  九: { strokes: ["M 45 20 L 60 50", "M 60 20 L 60 55 L 30 80"], tips: ["Short diagonal stroke", "Curved stroke going down and left"] },
  十: { strokes: ["M 20 50 L 80 50", "M 50 15 L 50 85"], tips: ["Horizontal stroke", "Vertical stroke through center"] },
  百: { strokes: ["M 40 15 L 60 15", "M 20 30 L 80 30", "M 20 30 L 20 80", "M 80 30 L 80 80", "M 20 55 L 80 55", "M 20 80 L 80 80"], tips: ["Top short horizontal", "Long horizontal", "Left vertical", "Right vertical", "Middle horizontal", "Bottom horizontal"] },
  千: { strokes: ["M 30 25 L 70 25", "M 20 45 L 80 45", "M 50 45 L 50 85"], tips: ["Short top horizontal", "Long middle horizontal", "Vertical stroke down"] },
  万: { strokes: ["M 25 25 L 75 25", "M 50 25 L 35 55", "M 35 55 L 70 70 L 55 85"], tips: ["Top horizontal", "Left diagonal", "Curved stroke to bottom"] },
  年: { strokes: ["M 35 15 L 50 30", "M 20 30 L 80 30", "M 50 15 L 50 85", "M 20 50 L 80 50", "M 20 70 L 80 70", "M 20 85 L 80 85"], tips: ["Top left diagonal", "First horizontal", "Center vertical", "Second horizontal", "Third horizontal", "Bottom horizontal"] },
  月: { strokes: ["M 35 15 L 35 85", "M 35 15 L 65 25", "M 65 25 L 65 85", "M 35 85 L 65 85", "M 35 45 L 65 45", "M 35 65 L 65 65"], tips: ["Left vertical", "Top curve right", "Right vertical", "Bottom horizontal", "First inner horizontal", "Second inner horizontal"] },
  日: { strokes: ["M 30 15 L 70 15", "M 70 15 L 70 85", "M 70 85 L 30 85", "M 30 85 L 30 15", "M 30 50 L 70 50"], tips: ["Top horizontal", "Right vertical down", "Bottom horizontal left", "Left vertical up", "Middle horizontal"] },
  時: { strokes: ["M 15 20 L 15 80", "M 15 50 L 35 50", "M 35 15 L 35 85", "M 45 25 L 85 25", "M 55 25 L 55 45", "M 45 45 L 85 45", "M 45 60 L 85 60", "M 85 25 L 85 80", "M 45 80 L 85 80", "M 65 60 L 65 80"], tips: ["Left radical vertical", "Left radical horizontal", "Left radical right vertical", "Top horizontal of 寺", "Middle vertical of 寺", "Second horizontal", "Third horizontal", "Right vertical", "Bottom horizontal", "Inner vertical"] },
  分: { strokes: ["M 35 15 L 50 35", "M 65 15 L 50 35", "M 50 35 L 50 85", "M 25 60 L 75 60"], tips: ["Left top diagonal", "Right top diagonal", "Center vertical down", "Horizontal through center"] },
  山: { strokes: ["M 50 20 L 50 80", "M 20 50 L 20 80", "M 80 50 L 80 80", "M 15 80 L 85 80"], tips: ["Center vertical (tallest peak)", "Left vertical (shorter)", "Right vertical (shorter)", "Bottom horizontal base"] },
  川: { strokes: ["M 25 15 L 20 85", "M 50 10 L 50 90", "M 75 15 L 80 85"], tips: ["Left flowing stroke", "Center straight stroke", "Right flowing stroke"] },
  木: { strokes: ["M 20 40 L 80 40", "M 50 15 L 50 85", "M 50 60 L 25 85", "M 50 60 L 75 85"], tips: ["Horizontal stroke", "Vertical stroke through center", "Left diagonal root", "Right diagonal root"] },
  火: { strokes: ["M 50 15 L 50 55", "M 30 35 L 20 70", "M 70 35 L 80 70", "M 35 65 L 50 85 L 65 65"], tips: ["Center vertical stroke", "Left diagonal stroke", "Right diagonal stroke", "Bottom flame stroke"] },
  水: { strokes: ["M 50 15 L 50 85", "M 50 40 L 25 65", "M 50 40 L 75 65", "M 35 25 L 50 40", "M 65 25 L 50 40"], tips: ["Central vertical stroke", "Lower-left diagonal", "Lower-right diagonal", "Upper-left short stroke", "Upper-right short stroke"] },
  土: { strokes: ["M 25 40 L 75 40", "M 50 40 L 50 80", "M 20 80 L 80 80"], tips: ["Top horizontal", "Vertical stroke down", "Bottom horizontal (longer)"] },
  金: { strokes: ["M 50 10 L 50 35", "M 25 35 L 75 35", "M 35 35 L 20 55", "M 65 35 L 80 55", "M 20 60 L 80 60", "M 35 60 L 35 85", "M 65 60 L 65 85", "M 35 85 L 65 85"], tips: ["Top point stroke", "Wide horizontal", "Left diagonal", "Right diagonal", "Middle horizontal", "Lower-left vertical", "Lower-right vertical", "Bottom horizontal"] },
  空: { strokes: ["M 30 15 L 70 15", "M 50 15 L 50 40", "M 25 30 L 75 30", "M 20 50 L 80 50", "M 35 50 L 20 75", "M 50 50 L 50 85", "M 65 50 L 80 75", "M 20 85 L 80 85"], tips: ["Top horizontal of 穴", "Center vertical", "Second horizontal", "Main horizontal of 工", "Left diagonal", "Center vertical of 工", "Right diagonal", "Bottom horizontal of 工"] },
  雨: { strokes: ["M 20 20 L 80 20", "M 20 20 L 20 80", "M 80 20 L 80 80", "M 20 40 L 80 40", "M 35 55 L 35 65", "M 55 55 L 55 65", "M 35 70 L 35 80", "M 55 70 L 55 80"], tips: ["Top horizontal", "Left vertical", "Right vertical", "Horizontal divider", "First drop left", "First drop right", "Second drop left", "Second drop right"] },
  花: { strokes: ["M 50 10 L 50 30", "M 30 20 L 70 20", "M 20 35 L 80 35", "M 35 35 L 35 60", "M 50 35 L 50 85", "M 65 35 L 65 60", "M 35 60 L 65 60"], tips: ["Top vertical of 艹", "Horizontal of 艹", "Second horizontal", "Left inner vertical", "Center vertical", "Right inner vertical", "Bottom connector"] },
  人: { strokes: ["M 50 15 L 30 75", "M 50 15 L 75 85"], tips: ["Left diagonal stroke", "Right diagonal stroke"] },
  子: { strokes: ["M 50 15 L 50 50 L 30 75", "M 25 35 L 75 35", "M 50 60 L 50 85"], tips: ["Main curve stroke", "Horizontal through top", "Bottom short vertical"] },
  女: { strokes: ["M 65 20 L 35 55", "M 20 40 L 80 55", "M 50 55 L 50 85 L 20 85"], tips: ["Top diagonal", "Crossing horizontal", "Bottom vertical and base"] },
  男: { strokes: ["M 25 15 L 75 15", "M 25 15 L 25 50", "M 75 15 L 75 50", "M 25 35 L 75 35", "M 25 50 L 75 50", "M 50 50 L 50 65", "M 25 65 L 75 65"], tips: ["Top of 田 horizontal", "Left of 田", "Right of 田", "Inner horizontal of 田", "Bottom of 田", "Top of 力", "Main of 力"] },
  目: { strokes: ["M 25 15 L 75 15", "M 75 15 L 75 85", "M 75 85 L 25 85", "M 25 85 L 25 15", "M 25 40 L 75 40", "M 25 60 L 75 60"], tips: ["Top horizontal", "Right vertical", "Bottom horizontal", "Left vertical", "First inner horizontal", "Second inner horizontal"] },
  口: { strokes: ["M 25 20 L 75 20", "M 75 20 L 75 80", "M 75 80 L 25 80", "M 25 80 L 25 20"], tips: ["Top horizontal", "Right vertical", "Bottom horizontal", "Left vertical (closes the box)"] },
  手: { strokes: ["M 20 25 L 80 25", "M 20 45 L 80 45", "M 50 10 L 50 60", "M 50 60 L 30 85"], tips: ["Top horizontal", "Middle horizontal", "Vertical through center", "Curved base stroke"] },
  足: { strokes: ["M 25 15 L 75 15", "M 25 15 L 25 45", "M 75 15 L 75 45", "M 25 30 L 75 30", "M 25 45 L 75 45", "M 50 45 L 50 65", "M 25 65 L 75 65"], tips: ["Top horizontal", "Left vertical", "Right vertical", "Inner horizontal", "Bottom of box", "Connecting vertical", "Base horizontal"] },
  耳: { strokes: ["M 25 15 L 75 15", "M 25 15 L 25 85", "M 25 35 L 70 35", "M 25 55 L 70 55", "M 70 15 L 70 55", "M 25 85 L 75 85"], tips: ["Top horizontal", "Left vertical", "First inner horizontal", "Second inner horizontal", "Right vertical (short)", "Bottom horizontal"] },
  上: { strokes: ["M 50 15 L 50 65", "M 25 65 L 75 65", "M 20 85 L 80 85"], tips: ["Vertical stroke up", "Middle horizontal", "Bottom horizontal (longer)"] },
  下: { strokes: ["M 20 25 L 80 25", "M 50 25 L 50 65", "M 35 65 L 65 65", "M 50 65 L 50 85"], tips: ["Top horizontal", "Vertical down", "Short horizontal", "Final vertical dot"] },
  中: { strokes: ["M 25 15 L 75 15", "M 25 15 L 25 85", "M 75 15 L 75 85", "M 25 85 L 75 85", "M 50 10 L 50 90"], tips: ["Top horizontal", "Left vertical", "Right vertical", "Bottom horizontal", "Center vertical through"] },
  右: { strokes: ["M 35 15 L 75 35", "M 20 35 L 80 35", "M 35 35 L 35 85", "M 35 60 L 75 60", "M 75 35 L 75 85", "M 35 85 L 75 85"], tips: ["Top diagonal", "Horizontal", "Left vertical", "Inner horizontal", "Right vertical", "Bottom horizontal"] },
  左: { strokes: ["M 25 15 L 60 35", "M 20 35 L 80 35", "M 35 35 L 35 85", "M 35 60 L 65 60", "M 65 35 L 65 85", "M 35 85 L 65 85"], tips: ["Top left diagonal", "Horizontal", "Left vertical", "Inner horizontal", "Right vertical", "Bottom horizontal"] },
  学: { strokes: ["M 30 15 L 50 30", "M 70 15 L 50 30", "M 35 25 L 65 25", "M 50 30 L 50 50", "M 25 50 L 75 50", "M 35 50 L 35 85", "M 50 50 L 50 85", "M 65 50 L 65 85"], tips: ["Left top of 爻", "Right top of 爻", "Horizontal connector", "Center vertical", "Wide horizontal of 子", "Left vertical", "Center vertical", "Right vertical"] },
  本: { strokes: ["M 20 40 L 80 40", "M 50 15 L 50 85", "M 50 65 L 25 85", "M 50 65 L 75 85", "M 35 55 L 65 55"], tips: ["Main horizontal", "Vertical through center", "Left root diagonal", "Right root diagonal", "Short horizontal mark (origin)"] },
  車: { strokes: ["M 50 10 L 50 30", "M 20 30 L 80 30", "M 20 30 L 20 70", "M 80 30 L 80 70", "M 20 50 L 80 50", "M 20 70 L 80 70", "M 50 70 L 50 90"], tips: ["Top vertical", "Top horizontal", "Left vertical", "Right vertical", "Middle horizontal", "Bottom horizontal", "Bottom vertical"] },
  円: { strokes: ["M 25 15 L 75 15", "M 25 15 L 25 85", "M 75 15 L 75 85", "M 25 85 L 75 85", "M 35 45 L 65 45"], tips: ["Top horizontal", "Left vertical", "Right vertical", "Bottom horizontal", "Inner horizontal (yen mark)"] },
  白: { strokes: ["M 50 10 L 50 25", "M 25 25 L 75 25", "M 25 25 L 25 80", "M 75 25 L 75 80", "M 25 80 L 75 80", "M 25 52 L 75 52"], tips: ["Top dot", "Horizontal", "Left vertical", "Right vertical", "Bottom horizontal", "Inner horizontal"] },
  大: { strokes: ["M 20 40 L 80 40", "M 50 15 L 50 85", "M 50 60 L 20 85", "M 50 60 L 80 85"], tips: ["Horizontal stroke", "Vertical through center", "Left diagonal", "Right diagonal"] },
  小: { strokes: ["M 50 15 L 50 85", "M 50 45 L 25 70", "M 50 45 L 75 70"], tips: ["Center vertical", "Left diagonal stroke", "Right diagonal stroke"] },
  今: { strokes: ["M 35 15 L 50 30", "M 65 15 L 50 30", "M 25 40 L 75 40", "M 50 40 L 50 60", "M 35 60 L 65 60", "M 35 60 L 35 85"], tips: ["Left top diagonal", "Right top diagonal", "Horizontal", "Short vertical", "Short horizontal", "Final vertical"] },
  天: { strokes: ["M 30 25 L 70 25", "M 20 45 L 80 45", "M 50 45 L 30 80", "M 50 45 L 70 80"], tips: ["Short top horizontal", "Long horizontal", "Left diagonal", "Right diagonal"] },
}

const FALLBACK_STROKES = {
  strokes: ["M 20 50 L 80 50"],
  tips: ["Horizontal stroke — trace following stroke order guide"],
}

const StrokeOrder = ({ character = "日", onComplete, isDark = true }) => {
  const canvasRef     = useRef(null)
  const drawCanvasRef = useRef(null)
  const animationRef  = useRef(null)
  const isDrawingRef  = useRef(false)
  const lastPosRef    = useRef({ x: 0, y: 0 })

  const [activeStrokeData, setActiveStrokeData] = useState(() => KANJI_STROKES[character] || FALLBACK_STROKES)
  const [loadingKanji, setLoadingKanji] = useState(false)

  const strokeData   = activeStrokeData
  const totalStrokes = strokeData.strokes.length
  const canvasSize   = 240
  const isKvg        = strokeData.viewBox === '0 0 109 109' || strokeData.numbers?.length > 0
  const scale        = canvasSize / (isKvg ? 109 : 100)

  const [currentStroke,  setCurrentStroke]  = useState(0)
  const [isAnimating,    setIsAnimating]    = useState(false)
  const [isAutoPlaying,  setIsAutoPlaying]  = useState(false)
  const isAutoPlayingRef = useRef(false)
  const autoPlayTimerRef = useRef(null)
  const [animSpeed,      setAnimSpeed]      = useState(1)
  const [mode,           setMode]           = useState("watch")
  const [userStrokes,    setUserStrokes]    = useState([])
  const [showGuide,      setShowGuide]      = useState(true)
  const [completed,      setCompleted]      = useState(false)
  const [strokeProgress, setStrokeProgress] = useState(0)
  const [practiceResult, setPracticeResult] = useState(null)

  // ── Reset when character changes ─────────────────────────────
  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    isAutoPlayingRef.current = false;
    setIsAutoPlaying(false);
    setIsAnimating(false);
    setCurrentStroke(0);
    setStrokeProgress(0);
    setCompleted(false);
    setUserStrokes([]);
    setPracticeResult(null);
  }, [character]);

  // ── Dynamically load authentic KanjiVG stroke data for any Joyo Kanji ──
  useEffect(() => {
    let isMounted = true
    if (KANJI_STROKES[character]) {
      setActiveStrokeData(KANJI_STROKES[character])
      return
    }

    setLoadingKanji(true)
    fetchKanjiStrokes(character).then((data) => {
      if (!isMounted) return
      if (data && data.strokes && data.strokes.length > 0) {
        setActiveStrokeData(data)
      } else {
        setActiveStrokeData(FALLBACK_STROKES)
      }
    }).catch(() => {
      if (isMounted) setActiveStrokeData(FALLBACK_STROKES)
    }).finally(() => {
      if (isMounted) setLoadingKanji(false)
    })

    return () => { isMounted = false }
  }, [character])

  // ── Draw guide numbers ────────────────────────────────────────
  const drawGuideNumbers = useCallback((ctx) => {
    if (!showGuide) return

    if (strokeData.numbers && strokeData.numbers.length > 0) {
      strokeData.numbers.forEach((n, i) => {
        const x = n.x * scale
        const y = n.y * scale
        ctx.fillStyle =
          i < currentStroke   ? "rgba(239,68,68,0.9)"  :
          i === currentStroke ? "rgba(59,130,246,0.9)"  :
                                "rgba(100,116,139,0.5)"
        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "bold 9px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(String(n.num), x, y)
      })
      return
    }

    strokeData.strokes.forEach((stroke, i) => {
      const coords = stroke.match(/\d+/g)?.map(Number) || [50, 50]
      const x = (coords[0] / 100) * canvasSize
      const y = (coords[1] / 100) * canvasSize
      ctx.fillStyle =
        i < currentStroke   ? "rgba(239,68,68,0.9)"  :
        i === currentStroke ? "rgba(59,130,246,0.9)"  :
                              "rgba(100,116,139,0.5)"
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "white"
      ctx.font = "bold 9px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(String(i + 1), x, y)
    })
  }, [currentStroke, showGuide, strokeData, canvasSize, scale])

  // ── Render strokes ────────────────────────────────────────────
  const renderStrokes = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Grid lines
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(55,65,81,0.35)"
    ctx.lineWidth = 0.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(canvasSize / 2, 0)
    ctx.lineTo(canvasSize / 2, canvasSize)
    ctx.moveTo(0, canvasSize / 2)
    ctx.lineTo(canvasSize, canvasSize / 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Completed strokes
    ctx.save()
    ctx.scale(scale, scale)
    strokeData.strokes.forEach((stroke, i) => {
      if (i >= currentStroke) return
      ctx.beginPath()
      ctx.strokeStyle = "rgba(239,68,68,0.9)"
      ctx.lineWidth = 4 / scale
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      try {
        if (typeof Path2D !== 'undefined') {
          ctx.stroke(new Path2D(stroke))
          return
        }
      } catch {
        // fallback
      }
      const coords = stroke.match(/\d+/g)?.map(Number) || []
      for (let j = 0; j < coords.length; j += 2) {
        if (j === 0) {
          ctx.moveTo(coords[j], coords[j + 1])
        } else {
          ctx.lineTo(coords[j], coords[j + 1])
        }
      }
      ctx.stroke()
    })
    ctx.restore()

    // Animated current stroke
    if (isAnimating && currentStroke < totalStrokes) {
      const stroke = strokeData.strokes[currentStroke]
      ctx.save()
      ctx.scale(scale, scale)
      ctx.strokeStyle = "rgba(59,130,246,0.95)"
      ctx.lineWidth = 5 / scale
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      let drawn = false
      try {
        if (typeof Path2D !== 'undefined') {
          const p = new Path2D(stroke)
          const approxLen = 140
          ctx.setLineDash([approxLen * strokeProgress, approxLen])
          ctx.stroke(p)
          drawn = true
        }
      } catch {
        drawn = false
      }

      if (!drawn) {
        const coords = stroke.match(/\d+/g)?.map(Number) || []
        const pairs = []
        for (let i = 0; i < coords.length; i += 2) {
          pairs.push([coords[i], coords[i + 1]])
        }

        if (pairs.length > 0) {
          const totalPairs  = Math.max(pairs.length - 1, 1)
          const progressIdx = strokeProgress * totalPairs
          const pairIdx     = Math.floor(progressIdx)
          const t           = progressIdx - pairIdx

          ctx.beginPath()
          ctx.moveTo(pairs[0][0], pairs[0][1])

          for (let i = 1; i <= Math.min(pairIdx + 1, totalPairs); i++) {
            if (i <= pairIdx) {
              ctx.lineTo(pairs[i][0], pairs[i][1])
            } else {
              const x = pairs[i-1][0] + (pairs[i][0] - pairs[i-1][0]) * t
              const y = pairs[i-1][1] + (pairs[i][1] - pairs[i-1][1]) * t
              ctx.lineTo(x, y)
            }
          }
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    drawGuideNumbers(ctx)
  }, [
    currentStroke, isAnimating, strokeProgress,
    totalStrokes, strokeData, drawGuideNumbers, canvasSize, isDark, scale
  ])

  useEffect(() => { renderStrokes() }, [renderStrokes])

  // ── Animation loop ────────────────────────────────────────────
  useEffect(() => {
    if (!isAnimating) return;
    let start = null;
    const duration = 1000 / animSpeed;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setStrokeProgress(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setStrokeProgress(0);
        const next = currentStroke + 1;
        if (next < totalStrokes) {
          setCurrentStroke(next);
          if (isAutoPlayingRef.current) {
            autoPlayTimerRef.current = setTimeout(() => {
              if (isAutoPlayingRef.current) {
                setIsAnimating(true);
              }
            }, 250 / animSpeed);
            setIsAnimating(false);
          } else {
            setIsAnimating(false);
          }
        } else {
          setCurrentStroke(totalStrokes);
          setIsAnimating(false);
          setIsAutoPlaying(false);
          isAutoPlayingRef.current = false;
          setCompleted(true);
          onComplete?.();
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAnimating, animSpeed, currentStroke, totalStrokes, onComplete]);

  // ── Controls ──────────────────────────────────────────────────
  const playNext = () => {
    if (currentStroke < totalStrokes && !isAnimating) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false);
      setIsAnimating(true);
    }
  };

  const playAll = () => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    if (currentStroke >= totalStrokes) {
      setCurrentStroke(0);
      setCompleted(false);
    }
    isAutoPlayingRef.current = true;
    setIsAutoPlaying(true);
    setIsAnimating(true);
  };

  const pause = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    isAutoPlayingRef.current = false;
    setIsAutoPlaying(false);
    setIsAnimating(false);
  };

  const reset = () => {
    pause();
    setCurrentStroke(0);
    setStrokeProgress(0);
    setCompleted(false);
    setUserStrokes([]);
    setPracticeResult(null);
  };

  // ── Practice drawing ──────────────────────────────────────────
  const getPos = (e, canvas) => {
    const rect    = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width)  * canvasSize,
      y: ((clientY - rect.top)  / rect.height) * canvasSize,
    }
  }

  const startDraw = (e) => {
    if (mode !== "practice") return
    e.preventDefault()
    isDrawingRef.current = true
    const pos = getPos(e, drawCanvasRef.current)
    lastPosRef.current = pos
    setUserStrokes(prev => [...prev, [pos]])
  }

  const draw = (e) => {
    if (!isDrawingRef.current || mode !== "practice") return
    e.preventDefault()
    const canvas = drawCanvasRef.current
    const ctx    = canvas.getContext("2d")
    const pos    = getPos(e, canvas)

    ctx.beginPath()
    ctx.strokeStyle = "#60a5fa"
    ctx.lineWidth   = 3
    ctx.lineCap     = "round"
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()

    lastPosRef.current = pos
    setUserStrokes(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = [...updated[updated.length - 1], pos]
      return updated
    })
  }

  const endDraw = () => { isDrawingRef.current = false }

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvasSize, canvasSize)
    setUserStrokes([])
    setPracticeResult(null)
  }

  // ✅ Check practice result
  const checkPractice = () => {
    if (userStrokes.length === 0) {
      setPracticeResult('empty')
      setTimeout(() => setPracticeResult(null), 2000)
      return
    }
    const isGood = userStrokes.length >= totalStrokes
    setPracticeResult(isGood ? 'good' : 'try-again')
    setTimeout(() => setPracticeResult(null), 3000)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-foreground font-bold text-lg">Stroke Order</h3>
          <p className="text-muted-foreground text-sm">
            {character} — {totalStrokes} stroke{totalStrokes !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode("watch"); reset() }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-medium transition-colors ${
              mode === "watch"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Watch
          </button>
          <button
            onClick={() => { setMode("practice"); clearDrawing() }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-xs font-medium transition-colors ${
              mode === "practice"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Practice
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative w-60 h-60 mx-auto">

        {/* Loading overlay */}
        {loadingKanji && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl backdrop-blur-xs z-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Ghost character */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center
                          pointer-events-none">
            <span className="text-[140px] text-foreground/10 font-bold
                             select-none leading-none">
              {character}
            </span>
          </div>
        )}

        {/* Stroke canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="absolute inset-0 rounded-xl"
        />

        {/* Drawing canvas */}
        <canvas
          ref={drawCanvasRef}
          width={canvasSize}
          height={canvasSize}
          className={`absolute inset-0 rounded-xl ${
            mode === "practice" ? "cursor-crosshair" : "pointer-events-none"
          }`}
          style={{ touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />

        {/* Watch mode complete overlay */}
        <AnimatePresence>
          {completed && mode === "watch" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center
                         bg-green-500/20 rounded-xl backdrop-blur-sm"
            >
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold text-sm">Complete!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Practice result overlay on canvas */}
        <AnimatePresence>
          {practiceResult && practiceResult !== 'empty' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center
                         rounded-xl pointer-events-none ${
                practiceResult === 'good'
                  ? 'bg-green-500/20'
                  : 'bg-orange-500/10'
              }`}
            >
              <span className="text-6xl drop-shadow-lg">
                {practiceResult === 'good' ? '⭐' : '💪'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stroke progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Stroke {Math.min(currentStroke + 1, totalStrokes)} of {totalStrokes}
          </span>
          <span>{Math.round((currentStroke / totalStrokes) * 100)}%</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStrokes }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating) {
                  setCurrentStroke(i)
                  setCompleted(false)
                }
              }}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < currentStroke   ? "bg-red-500"               :
                i === currentStroke ? "bg-blue-500 animate-pulse" :
                                      "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stroke tip */}
      {currentStroke < totalStrokes && (
        <div className="bg-blue-500/10 border border-blue-500/20
                        rounded-xl px-4 py-2.5">
          <p className="text-xs text-blue-400 font-semibold mb-0.5">
            Stroke {currentStroke + 1} tip:
          </p>
          <p className="text-sm text-foreground/80">
            {strokeData.tips[currentStroke]}
          </p>
        </div>
      )}

      {/* ── Controls ── */}
      {mode === "watch" ? (

        // Watch mode controls
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                pause();
                if (currentStroke > 0) {
                  setCurrentStroke(currentStroke - 1);
                  setCompleted(false);
                }
              }}
              disabled={currentStroke === 0 || isAnimating || isAutoPlaying}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70
                         disabled:opacity-40 flex items-center justify-center
                         text-foreground/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(isAnimating || isAutoPlaying) ? pause : playAll}
              className="flex items-center gap-2 px-5 py-2.5
                         bg-gradient-to-r from-blue-500 to-blue-600
                         text-white rounded-xl font-semibold text-sm
                         shadow-lg shadow-blue-500/20 hover:opacity-90
                         transition-opacity"
            >
              {(isAnimating || isAutoPlaying)
                ? <><Pause className="w-4 h-4" /> Pause</>
                : <><Play  className="w-4 h-4" /> Play All</>
              }
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={playNext}
              disabled={currentStroke >= totalStrokes || isAnimating || isAutoPlaying}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70
                         disabled:opacity-40 flex items-center justify-center
                         text-foreground/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={reset}
              className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70
                         flex items-center justify-center text-foreground/80
                         transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-muted-foreground">Speed:</span>
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setAnimSpeed(speed)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium
                            transition-colors ${
                  animSpeed === speed
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Guide toggle */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs text-muted-foreground hover:text-foreground
                         flex items-center gap-1.5 transition-colors"
            >
              {showGuide
                ? <><Eye    className="w-3.5 h-3.5" /> Hide guide numbers</>
                : <><EyeOff className="w-3.5 h-3.5" /> Show guide numbers</>
              }
            </button>
          </div>
        </div>

      ) : (

        // ✅ Practice mode controls
        <div className="space-y-3">

          {/* Instruction banner */}
          <div className="bg-purple-500/10 border border-purple-500/20
                          rounded-xl px-4 py-2.5">
            <p className="text-xs text-purple-400 font-semibold mb-0.5">
              ✏️ Draw in the box above
            </p>
            <p className="text-sm text-foreground/80">
              {totalStrokes === 1
                ? "Draw 1 stroke following the guide."
                : `Draw ${totalStrokes} strokes in order. Lift between each stroke.`
              }
            </p>
          </div>

          {/* Stroke tip scroll (multi-stroke only) */}
          {totalStrokes > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {strokeData.tips.map((tip, i) => (
                <div key={i}
                  className="flex-shrink-0 bg-muted rounded-lg
                             px-2.5 py-1.5 text-xs text-foreground/80 max-w-[140px]">
                  <span className="text-blue-400 font-bold mr-1">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* 3 buttons */}
          <div className="grid grid-cols-3 gap-2">

            {/* Clear */}
            <button
              onClick={clearDrawing}
              className="flex items-center justify-center gap-1.5 py-3
                         bg-muted hover:bg-muted/70 text-foreground/80
                         rounded-xl text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>

            {/* Watch */}
            <button
              onClick={() => { clearDrawing(); setMode("watch"); reset() }}
              className="flex items-center justify-center gap-1.5 py-3
                         bg-purple-500/20 hover:bg-purple-500/30
                         text-purple-400 border border-purple-500/30
                         rounded-xl text-xs font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Watch
            </button>

            {/* ✅ Check */}
            <button
              onClick={checkPractice}
              className="flex items-center justify-center gap-1.5 py-3
                         bg-gradient-to-r from-green-500 to-emerald-600
                         text-white rounded-xl text-xs font-semibold
                         shadow-lg shadow-green-500/20 hover:opacity-90
                         transition-opacity"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Check ✓
            </button>
          </div>

          {/* ✅ Feedback message */}
          <AnimatePresence>
            {practiceResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                  practiceResult === 'good'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : practiceResult === 'empty'
                    ? 'bg-muted border border-border text-muted-foreground'
                  : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                }`}
              >
                {practiceResult === 'good'      && '⭐ Great job! Keep practicing!'}
                {practiceResult === 'empty'     && '✏️ Draw something first!'}
                {practiceResult === 'try-again' &&
                  `💪 Try drawing all ${totalStrokes} stroke${totalStrokes > 1 ? 's' : ''}!`
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default StrokeOrder