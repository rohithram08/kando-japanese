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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Question with blank */}
      <div className="text-center mb-6">
        <p className="text-xl text-gray-800 leading-relaxed">
          {question.question.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="inline-block border-b-2 border-red-400 min-w-[80px]
                                 mx-1 text-red-500 font-bold">
                  {submitted ? question.correct_answer : '　'}
                </span>
              )}
            </span>
          ))}
        </p>
        {question.hint && (
          <p className="text-sm text-gray-400 mt-2 italic">
            Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer in Japanese..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg
                     text-center focus:outline-none focus:border-red-400 transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed"
          autoFocus
        />

        {!submitted && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold
                       hover:bg-red-600 transition-colors disabled:opacity-40"
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
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`font-bold mb-1 ${
            input.trim() === question.correct_answer
              ? 'text-green-700'
              : 'text-red-700'
          }`}>
            {input.trim() === question.correct_answer
              ? '✓ Correct!'
              : `✗ The answer is: ${question.correct_answer}`}
          </p>
          {question.explanation && (
            <p className="text-gray-600">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}