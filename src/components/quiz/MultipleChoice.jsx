import React from "react";
import { motion } from 'framer-motion'
import AudioButton from '../common/AudioButton'

export default function MultipleChoice({
  question, onAnswer, selectedAnswer, showFeedback
}) {
  const getOptionStyle = (index) => {
    if (!showFeedback) {
      return selectedAnswer === index
        ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-foreground'
        : 'border-border bg-surface hover:border-gray-300 dark:hover:border-gray-600 hover:bg-muted/40 cursor-pointer text-foreground'
    }
    if (index === question.correct) {
      return 'border-green-500 bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-200'
    }
    if (index === selectedAnswer && index !== question.correct) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
    }
    return 'border-border bg-surface opacity-40 text-muted-foreground'
  }

  const getOptionIcon = (index) => {
    if (!showFeedback) return null
    if (index === question.correct) return '✓'
    if (index === selectedAnswer && index !== question.correct) return '✗'
    return null
  }

  return (
    <div className="card p-6 bg-surface border border-border shadow-card">
      {/* Question */}
      <div className="mb-6">
        {question.question_jp && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl font-bold text-foreground font-jp">
              {question.question_jp}
            </span>
            <AudioButton text={question.question_jp} lang="ja-JP" size="lg" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground/90 text-center">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            type="button"
            whileHover={!showFeedback ? { scale: 1.01 } : {}}
            whileTap={!showFeedback ? { scale: 0.99 } : {}}
            onClick={() => !showFeedback && onAnswer(index)}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all
                        flex items-center justify-between font-medium ${getOptionStyle(index)}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full border-2 flex items-center
                               justify-center text-sm font-bold flex-shrink-0 ${
                showFeedback && index === question.correct
                  ? 'border-green-500 bg-green-500 text-white'
                  : showFeedback && index === selectedAnswer
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-border text-muted-foreground'
              }`}>
                {getOptionIcon(index) || String.fromCharCode(65 + index)}
              </span>
              <span className="text-foreground">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-sm ${
            selectedAnswer === question.correct
              ? 'bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200'
          }`}
        >
          <p className="font-bold mb-1">
            {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-muted-foreground">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  )
}