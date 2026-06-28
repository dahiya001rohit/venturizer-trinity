import { useRef, useEffect, useReducer } from 'react'
import { API_URL } from '../config'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { OptionPills } from './OptionPills'
import { ChatInput } from './ChatInput'
import { TypingDots } from './TypingDots'
import { getFlow, resolvePrompt, getAcknowledgement } from './flowEngine'

const TYPING_DELAY = 420

const DIMENSION_LABELS = {
  Founder: ['Validation', 'Traction', 'Team', 'Market', 'Clarity'],
  Investor: ['Thesis', 'Stage fit', 'Cheque', 'Portfolio', 'Support'],
}

function initState() {
  return {
    phase: 'branch',
    flowType: null,
    flow: [],
    turnIndex: 0,
    messages: [{ role: 'bot', text: "Hey — are you a founder or an investor?" }],
    answers: {},
    typing: false,
    result: null,
    prevAnswer: null,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TYPING': return { ...state, typing: action.value }
    case 'ADD_MESSAGE': return { ...state, messages: [...state.messages, action.msg] }
    case 'SET_RESULT': return { ...state, result: action.result, phase: 'result' }
    case 'ADVANCE': return {
      ...state,
      turnIndex: action.nextIndex,
      answers: { ...state.answers, [action.turnId]: action.answer },
      prevAnswer: action.answer,
      typing: false,
    }
    case 'SET_FLOW': return { ...state, flow: action.flow, flowType: action.flowType, phase: 'chat' }
    case 'RESET': return initState()
    default: return state
  }
}

export function ChatWidget({ mode = 'full', onClose }) {
  const [state, dispatch] = useReducer(reducer, null, initState)
  const bottomRef = useRef(null)
  const { phase, flow, turnIndex, messages, answers, typing, result, flowType } = state

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function pushMessage(msg) { dispatch({ type: 'ADD_MESSAGE', msg }) }

  function typeBot(text, cb) {
    dispatch({ type: 'SET_TYPING', value: true })
    setTimeout(() => {
      dispatch({ type: 'SET_TYPING', value: false })
      pushMessage({ role: 'bot', text })
      cb?.()
    }, TYPING_DELAY)
  }

  async function handleBranch(choice) {
    pushMessage({ role: 'user', text: choice })
    typeBot("Fetching questions...")
    
    try {
      const res = await fetch(`${API_URL}/api/flow/${choice.toLowerCase()}`)
      const data = await res.json()
      const selectedFlow = data.flow.questions
      
      // Remove the temporary "Fetching questions..." message and set state
      dispatch({ type: 'SET_FLOW', flow: selectedFlow, flowType: choice })
      
      typeBot(
        `${choice === 'Founder' ? "Founder — great." : "Investor — perfect."} I'll ask you ${selectedFlow.length} quick questions. Let's go.`,
        () => setTimeout(() => typeBot(selectedFlow[0].prompt), 180)
      )
    } catch (err) {
      console.error(err)
      typeBot("Error connecting to server. Please try again.")
    }
  }

  function handleAnswer(answer) {
    const turn = flow[turnIndex]
    pushMessage({ role: 'user', text: answer })
    const nextIndex = turnIndex + 1
    dispatch({ type: 'ADVANCE', nextIndex, turnId: turn.id, answer })

    if (nextIndex >= flow.length) {
      typeBot("Thanks — submitting your responses now…", async () => {
        try {
          const finalAnswers = { ...answers, [turn.id]: answer }
          const formattedAnswers = Object.entries(finalAnswers).map(([questionId, value]) => {
            // handle both simple string and complex object values just in case
            return {
              questionId,
              ...(typeof value === 'object' ? { values: value } : { value })
            }
          })
          
          const res = await fetch(`${API_URL}/api/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: flowType.toLowerCase(),
              answers: formattedAnswers
            })
          })
          
          if (res.ok) {
            dispatch({ type: 'SET_RESULT', result: { success: true } })
          } else {
            dispatch({ type: 'SET_RESULT', result: { error: true } })
          }
        } catch (e) {
          console.error("Submit failed", e)
          dispatch({ type: 'SET_RESULT', result: { error: true } })
        }
      })
      return
    }

    const nextTurn = flow[nextIndex]
    const ack = getAcknowledgement(turn.id, answer)
    if (ack) {
      typeBot(ack, () => setTimeout(() => typeBot(resolvePrompt(nextTurn, flow, answer)), 160))
    } else {
      typeBot(resolvePrompt(nextTurn, flow, answer))
    }
  }

  const currentTurn = phase === 'chat' ? flow[turnIndex] : null
  const isSelectTurn = currentTurn?.kind === 'select'
  const isBranchTurn = phase === 'branch'
  const showPills = !typing && (isBranchTurn || isSelectTurn) && phase !== 'result'
  const showInput = phase !== 'result'
  const progress = phase === 'chat' ? Math.min(turnIndex, flow.length) : 0
  const total = flow.length || 12
  const dimLabels = flowType ? (DIMENSION_LABELS[flowType] || DIMENSION_LABELS.Founder) : DIMENSION_LABELS.Founder

  if (mode === 'bubble') {
    return (
      <BubbleLayout
        state={state} dispatch={dispatch}
        showPills={showPills} showInput={showInput}
        isBranchTurn={isBranchTurn} currentTurn={currentTurn}
        handleBranch={handleBranch} handleAnswer={handleAnswer}
        typing={typing} result={result}
        progress={progress} total={total}
        bottomRef={bottomRef} onClose={onClose} phase={phase}
      />
    )
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Left sidebar */}
      <div className="w-56 shrink-0 border-r border-white/[0.06] bg-[#0D0D0D] flex flex-col">
        <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="font-display text-[11px] tracking-[-0.02em] text-white/60">Trinity</span>
        </div>

        <div className="px-4 py-4 flex-1 flex flex-col gap-5">
          <div>
            <div className="font-inter text-[10px] text-white/20 uppercase tracking-[0.06em] mb-2.5">Session</div>
            <div className="flex flex-col gap-2">
              <InfoRow label="Type" value={flowType || '—'} />
              <InfoRow label="Turn" value={phase === 'chat' ? `${progress} / ${total}` : '—'} />
              <InfoRow
                label="Status"
                value={phase === 'result' ? 'Complete' : phase === 'chat' ? 'Active' : 'Starting'}
                dot={phase === 'chat' ? '#22C55E' : phase === 'result' ? '#3B82F6' : '#444'}
              />
            </div>
          </div>

          {phase === 'chat' && (
            <div>
              <div className="font-inter text-[10px] text-white/20 uppercase tracking-[0.06em] mb-2.5">Progress</div>
              <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mb-1.5">
                <motion.div
                  className="h-full rounded-full bg-[#3B82F6]"
                  animate={{ width: `${(progress / total) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="font-inter text-[10px] text-white/20 tabular-nums">{progress} of {total} turns</div>
            </div>
          )}
        </div>
      </div>

      {/* Center — chat */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.05]">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center shrink-0">
          <div>
            <div className="font-display text-white" style={{ fontSize: '13px', letterSpacing: '-0.03em' }}>
              {flowType ? `${flowType} interview` : 'New session'}
            </div>
            <div className="font-inter text-[10px] text-white/30 tracking-[-0.01em]">
              {phase === 'chat' ? `Turn ${progress} of ${total}` : phase === 'result' ? 'Complete' : 'Waiting for you'}
            </div>
          </div>
        </div>

        {phase !== 'result' ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 min-h-0">
              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} text={msg.text} index={i} />
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center shrink-0">
                    <span className="font-display text-[#3B82F6]" style={{ fontSize: '9px' }}>T</span>
                  </div>
                  <TypingDots />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="shrink-0">
              <AnimatePresence>
                {showPills && (
                  <motion.div key="pills" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }}>
                    <OptionPills
                      options={isBranchTurn ? [{label: 'Founder', value: 'Founder'}, {label: 'Investor', value: 'Investor'}] : currentTurn.options}
                      onSelect={isBranchTurn ? handleBranch : handleAnswer}
                      disabled={typing}
                    />
                    <div className="h-3" />
                  </motion.div>
                )}
                {showInput && (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <ChatInput onSend={handleAnswer} disabled={typing || showPills} placeholder={showPills ? "Please select an option above..." : "Type your answer..."} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0F0F0F]">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-white text-2xl tracking-[-0.03em] mb-2">Thanks, submitted!</h2>
            <p className="font-inter text-[13px] text-white/50 tracking-[-0.01em] max-w-[280px]">
              The Venturizer team will review your responses and reach out shortly.
            </p>
          </div>
        )}
      </div>

      {/* Right panel — dimension labels only, bars fill on result */}
      <div className="w-52 shrink-0 bg-[#0D0D0D] p-4 flex flex-col gap-4 border-l border-white/[0.05]">
        <div className="font-inter text-[10px] text-white/20 uppercase tracking-[0.06em]">Breakdown</div>

        <div className="flex flex-col gap-3.5">
          {dimLabels.map((label, i) => {
            const filled = result !== null
            const pct = filled ? (result.score / 100) * (0.7 + Math.sin(i * 1.3) * 0.25) : 0
            const color = filled ? (pct >= 0.75 ? '#22C55E' : pct >= 0.55 ? '#F5A623' : pct >= 0.35 ? '#3B82F6' : '#6B7280') : '#333'
            const scoreVal = filled ? Math.round(pct * 20) : null

            return (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-inter text-[11px]" style={{ color: filled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}>{label}</span>
                  <span className="font-inter text-[10px] font-medium" style={{ color: filled ? color : '#333' }}>
                    {filled ? `${scoreVal}/20` : '—'}
                  </span>
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ width: filled ? `${pct * 100}%` : '0%' }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Breakdowns are now internal to the dashboard. */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="mt-auto rounded-[12px] p-3 text-center"
            style={{ backgroundColor: `rgba(34,197,94,0.1)`, border: `1px solid rgba(34,197,94,0.25)` }}
          >
            <div className="font-inter text-[10px] uppercase tracking-[0.04em] text-[#22C55E]">Completed</div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value, dot }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-[11px] text-white/25 tracking-[-0.01em]">{label}</span>
      <div className="flex items-center gap-1.5">
        {dot && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />}
        <span className="font-inter text-[11px] text-white/60 tracking-[-0.01em] tabular-nums">{value}</span>
      </div>
    </div>
  )
}

function BubbleLayout({ state, dispatch, showPills, showInput, isBranchTurn, currentTurn, handleBranch, handleAnswer, typing, result, progress, total, bottomRef, onClose, phase }) {
  const { messages } = state

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] overflow-hidden" style={{ borderRadius: '20px' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center">
            <span className="font-display text-[#3B82F6]" style={{ fontSize: '11px', letterSpacing: '-0.02em' }}>T</span>
          </div>
          <div>
            <div className="font-display italic" style={{ fontSize: '20px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #3B82F6, #93C5FD)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Trinity</div>
            <div className="font-inter text-[11px] text-[#555] tracking-[-0.01em]">by Venturizer</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[#555] hover:text-white hover:bg-white/[0.05] transition-colors bg-transparent border-0 cursor-pointer">
            <X size={13} />
          </button>
        )}
      </div>

      {phase === 'chat' && (
        <div className="px-4 py-2 border-b border-white/[0.05] flex items-center gap-2.5">
          <div className="flex-1 h-px bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#3B82F6] rounded-full" animate={{ width: `${(progress / total) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="font-inter text-[10px] text-[#444] tabular-nums shrink-0">{progress} / {total}</span>
        </div>
      )}

      {phase !== 'result' ? (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} text={msg.text} index={i} />
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center shrink-0">
                  <span className="font-display text-[#3B82F6]" style={{ fontSize: '9px' }}>T</span>
                </div>
                <TypingDots />
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="shrink-0">
            <AnimatePresence>
              {showPills && (
                <motion.div key="pills" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <OptionPills options={isBranchTurn ? [{label: 'Founder', value: 'Founder'}, {label: 'Investor', value: 'Investor'}] : currentTurn.options} onSelect={isBranchTurn ? handleBranch : handleAnswer} disabled={typing} />
                  <div className="h-3" />
                </motion.div>
              )}
              {showInput && (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <ChatInput onSend={handleAnswer} disabled={typing || showPills} placeholder={showPills ? "Please select an option above..." : "Type your answer..."} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-white text-2xl tracking-[-0.03em] mb-2">Thanks, submitted!</h2>
          <p className="font-inter text-[13px] text-white/50 tracking-[-0.01em] max-w-[280px]">
            The Venturizer team will review your responses and reach out shortly.
          </p>
        </div>
      )}
    </div>
  )
}
