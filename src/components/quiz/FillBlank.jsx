import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function FillBlank({ question, onAnswer, showFeedback }) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || submitted) return
    setSubmitted(true)

    const isCorrect = input.trim() === question.correct_answer ||
                      input.trim().toLowerCase() === question.correct_answer?.toLowerCase()
    onAnswer(isCorrect ? 0 : 1)
  }

  return (
    <div className="card p-6 bg-surface border border-border shadow-card">
      {/* Question with blank */}
      <div className="text-center mb-6">
        <p className="text-xl text-foreground font-jp leading-relaxed">
          {question.question.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="inline-block border-b-2 border-red-500 min-w-[80px]
                                 mx-1 text-red-600 dark:text-red-400 font-bold">
                  {submitted ? question.correct_answer : '____'}
                </span>
              )}
            </span>
          ))}
        </p>
        {question.hint && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer in Japanese..."
          className="w-full px-4 py-3 border-2 border-border bg-surface text-foreground font-jp rounded-xl text-lg
                     text-center focus:outline-none focus:border-red-500 transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-muted-foreground"
          autoFocus
        />

        {!submitted && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold
                       transition-colors disabled:opacity-40 shadow-sm"
          >
            Submit Answer
          </button>
        )}
      </form>

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-sm ${
            input.trim() === question.correct_answer
              ? 'bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60'
              : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60'
          }`}
        >
          <p className={`font-bold mb-1 ${
            input.trim() === question.correct_answer
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {input.trim() === question.correct_answer
              ? '✓ Correct!'
              : `✗ The answer is: ${question.correct_answer}`}
          </p>
          {question.explanation && (
            <p className="text-muted-foreground">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}