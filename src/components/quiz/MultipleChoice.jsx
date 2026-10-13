import React from "react";
import { motion } from 'framer-motion'
import AudioButton from '../common/AudioButton'

export default function MultipleChoice({
  question, onAnswer, selectedAnswer, showFeedback
}) {
  const getOptionStyle = (index) => {
    if (!showFeedback) {
      return selectedAnswer === index
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
    }
    if (index === question.correct) return 'border-green-400 bg-green-50'
    if (index === selectedAnswer && index !== question.correct) {
      return 'border-red-400 bg-red-50'
    }
    return 'border-gray-200 opacity-50'
  }

  const getOptionIcon = (index) => {
    if (!showFeedback) return null
    if (index === question.correct) return '✓'
    if (index === selectedAnswer && index !== question.correct) return '✗'
    return null
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Question */}
      <div className="mb-6">
        {question.question_jp && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl font-bold text-gray-800">
              {question.question_jp}
            </span>
            <AudioButton text={question.question_jp} lang="ja-JP" size="lg" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-700 text-center">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
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
                  ? 'border-green-400 bg-green-400 text-white'
                  : showFeedback && index === selectedAnswer
                  ? 'border-red-400 bg-red-400 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {getOptionIcon(index) || String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700">{option}</span>
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
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <p className="font-bold mb-1">
            {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p>{question.explanation}</p>
        </motion.div>
      )}
    </div>
  )
}