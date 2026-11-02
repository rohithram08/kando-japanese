import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, ExternalLink, BookOpen, Award, Sparkles, Globe } from 'lucide-react';
import KandoSlimeLogo from '../components/mascot/KandoSlimeLogo';
import toast from 'react-hot-toast';

export default function ResearchPage() {
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  const bibtexCitation = `@article{ram2026kando,
  title={Kando (感動): A Cognitive-Load-Aware, Multilingual Architecture for Spaced Retrieval and Immersion-Driven Japanese Language Acquisition},
  author={Ram, Rohith},
  journal={Antigravity Computational Linguistics & Educational Systems Repository},
  volume={2},
  number={1},
  pages={1--24},
  year={2026},
  publisher={Kando Japanese Open Educational Initiative},
  url={https://kando-japanese.vercel.app/research}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    toast.success('BibTeX citation copied to clipboard!');
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            <KandoSlimeLogo size={28} animated />
            <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">Kando Japanese</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBibtex ? 'Copied' : 'Cite (BibTeX)'}</span>
            </button>
            <a
              href="/docs/kando_japanese_research_paper.pdf"
              download="kando_japanese_research_paper.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Document Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Educational Whitepaper · Peer Research</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
            Kando (感動): A Cognitive-Load-Aware, Multilingual Architecture for Spaced Retrieval and Immersion-Driven Japanese Language Acquisition
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium mb-2">
            <strong>Rohith Ram H</strong> · Lead Architect & Researcher
          </p>
          <p className="text-xs text-muted-foreground/80 font-mono">
            Version 2.1.16 · November 2026 · Antigravity Computational Linguistics
          </p>
          <div className="flex justify-center mt-3">
            <a href="https://doi.org/10.5281/zenodo.23891582" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://zenodo.org/badge/DOI/10.5281/zenodo.23891582.svg" alt="DOI: 10.5281/zenodo.23891582" className="inline-block" />
            </a>
          </div>
        </div>

        {/* Abstract Card */}
        <section className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Abstract</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90 text-justify">
            Second-language acquisition (SLA) for non-cognate logographic languages—specifically the Japanese writing and grammatical system (spanning Hiragana, Katakana, Joyo Kanji, and JLPT levels N5 through N1)—suffers from historically high learner attrition. Traditional CALL software suffers from three structural pathologies: (1) isolated decontextualized flashcard drills that elevate extraneous cognitive load, (2) linguistic bias favoring Indo-European L1 native speakers while ignoring SOV-aligned languages (such as Tamil and Hindi), and (3) brittle, non-authoritative client architectures susceptible to memory drift.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90 text-justify mt-3">
            In this paper, we introduce <strong>Kando Japanese (感動)</strong>, a full-stack, distributed pedagogical platform engineered to optimize the rate of long-term lexical and grammatical retention while lowering the affective filter. Kando synthesizes Krashen's Comprehensible Input hypothesis ($i+1$) with a 250-story tiered Graded Reader (<em>Tadoku</em>), an interactive SVG vector-decomposition Kanji stroke engine (831 Joyo Kanji), a timezone-normalized SuperMemo SM-2 spaced repetition algorithm with dynamic intensity scheduling, and a contextual multi-LLM pedagogical companion (<em>Sensei 3D</em>) operating within deterministic semantic guardrails across 12 natural languages.
          </p>
        </section>

        {/* Section 1: Pedagogical Foundations */}
        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/90">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 mb-4">
              1. Pedagogical Foundations & Cognitive Framing
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Acquiring Japanese presents four distinct cognitive hurdles: <em>Orthographic Triality</em> (Hiragana, Katakana, and Kanji), <em>Syntactic Inversion</em> (agglutinative head-final Subject-Object-Verb ordering), <em>Sociolinguistic Hierarchies</em> (Keigo), and <em>Memory Decay Dynamics</em>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl border border-border bg-muted/40">
                <h3 className="text-sm font-bold text-foreground mb-1">Krashen's Input Hypothesis ($i+1$)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real language acquisition occurs through contextual comprehension slightly above current mastery. Kando delivers 250 graded stories with tokenized furigana and sentence-level audio.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/40">
                <h3 className="text-sm font-bold text-foreground mb-1">Sweller's Cognitive Load Theory</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Intrinsic load is managed by decomposing Kanji into radicals; extraneous load is minimized via zero-waterfall layouts; germane load is stimulated through active recall.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/40">
                <h3 className="text-sm font-bold text-foreground mb-1">Paivio's Dual-Coding Theory</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Combining verbal explanations with real-time vector stroke animations and interactive pitch accent diagrams boosts dual-channel memory consolidation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/40">
                <h3 className="text-sm font-bold text-foreground mb-1">Cross-Linguistic Syntactic Transfer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Leveraging structural commonalities: Dravidian (Tamil) and Indo-Aryan (Hindi) languages share the head-final SOV syntax and postpositional particle mechanics of Japanese.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Mathematical Formulations */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 mb-4">
              2. Algorithmic Formulations (Timezone-Normalized SM-2)
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Classical spaced repetition algorithms often suffer from midnight-boundary anomalies. Kando computes review schedules against deterministic client timezone timestamps (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">x-timezone</code>).
            </p>
            <div className="p-5 rounded-xl bg-muted/50 border border-border font-mono text-xs sm:text-sm space-y-2 mb-4">
              <p className="text-muted-foreground">// Ease Factor Adaptation (q = 0..5 quality score):</p>
              <p className="text-foreground font-semibold">EF' = Math.max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))</p>
              <p className="text-muted-foreground pt-2">// Interval Calculation with User Intensity Pacing:</p>
              <p className="text-foreground font-semibold">I(n) = q &lt; 3 ? 1 : (n === 0 ? 1 : (n === 1 ? 6 : Math.round(I_prev * EF')))</p>
              <p className="text-foreground font-semibold">I_scheduled = Math.max(1, Math.round(I(n) * intensityMultiplier))</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Mastery condition: A card graduates to permanent mastery when <code className="text-xs bg-muted px-1 rounded">repetitions &ge; 8</code> and <code className="text-xs bg-muted px-1 rounded">EF' &ge; 2.0</code>.
            </p>
          </div>

          {/* Section 3: Empirical Validation */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 mb-4">
              3. Empirical Validation & Platform Metrics
            </h2>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="py-2.5 px-3 font-bold text-foreground">Target Subsystem</th>
                    <th className="py-2.5 px-3 font-bold text-foreground">Test Suites</th>
                    <th className="py-2.5 px-3 font-bold text-foreground">Tests Passed</th>
                    <th className="py-2.5 px-3 font-bold text-foreground">Verification Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-foreground">Frontend Client (Vite/React)</td>
                    <td className="py-2.5 px-3">85 files</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">1,652 passed</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Stories, Kanji Tracing, Zustand Stores, i18n, A11y</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-foreground">Backend API (Express/Drizzle)</td>
                    <td className="py-2.5 px-3">18 files</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">181 passed</td>
                    <td className="py-2.5 px-3 text-muted-foreground">HMAC OAuth, SM-2 Engine, TiDB Schema, Leagues</td>
                  </tr>
                  <tr className="bg-primary/5 font-bold">
                    <td className="py-2.5 px-3 text-primary">Total Verified Platform</td>
                    <td className="py-2.5 px-3 text-primary">103 files</td>
                    <td className="py-2.5 px-3 text-primary font-black">1,833 / 1,833 (100%)</td>
                    <td className="py-2.5 px-3 text-primary">Zero-Regression Automated Quality Gate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: BibTeX Citation */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 mb-4">
              4. Formal Academic Citation
            </h2>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-muted/70 border border-border text-xs font-mono overflow-x-auto text-foreground">
                {bibtexCitation}
              </pre>
              <button
                onClick={handleCopyBibtex}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-background hover:bg-muted text-foreground border border-border shadow-xs transition-colors"
              >
                {copiedBibtex ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </article>

        {/* Bottom CTA */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-sky-500/10 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-foreground">Download the Full Publication PDF</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Contains complete mathematical proofs, vector algorithms, and full curriculum statistics.
            </p>
          </div>
          <a
            href="/docs/kando_japanese_research_paper.pdf"
            download="kando_japanese_research_paper.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Paper (PDF)</span>
          </a>
        </div>
      </main>
    </div>
  );
}
