import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { Mic, MicOff, CheckSquare, ChevronRight, AlertTriangle, AlertCircle, Bot } from 'lucide-react';
import QuestionCard from '../../components/interview/QuestionCard';
import Timer from '../../components/common/Timer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Audio mock voice states
  const [isRecording, setIsRecording] = useState(false);
  const [waveformBars, setWaveformBars] = useState([20, 40, 20, 50, 30, 60, 40, 20]);

  // Load session metadata on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await interviewService.getInterviewSession(sessionId);
        if (!res) {
          throw new Error('Interview room does not exist');
        }
        if (res.status === 'Completed') {
          navigate(`/candidate/results/${sessionId}`, { replace: true });
          return;
        }
        setSession(res);
        setActiveIdx(res.currentQuestionIndex || 0);
        // Pre-fill answer if already exists
        setAnswer(res.answers[res.currentQuestionIndex || 0]?.answer || '');
      } catch (err) {
        console.error('Failed to load session info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  // Handle live waveform animation during voice simulation
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformBars(prev => prev.map(() => Math.floor(Math.random() * 50) + 15));
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech-to-text insertion
      setTimeout(() => {
        const sampleTexts = [
          " From an architectural perspective, this represents a core mechanism that helps reduce layout thrashing and increases overall system throughput. ",
          " In my previous role, we configured a similar distributed queue to handle millions of asynchronous updates safely. ",
          " We must perform regular memory audits and look for leaks or unclosed socket connections to keep components light. "
        ];
        const randomSentence = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setAnswer(prev => prev + (prev ? ' ' : '') + randomSentence);
        setIsRecording(false);
      }, 4000);
    } else {
      setIsRecording(false);
    }
  };

  const handleNext = async () => {
    if (!session) return;
    setSubmitLoading(true);
    try {
      // Save progress to service layer
      await interviewService.submitAnswer(sessionId, activeIdx, answer);

      const isLastQuestion = activeIdx === session.answers.length - 1;
      if (isLastQuestion) {
        // Evaluate all answers and finish exam
        setGrading(true);
        const finalResults = await interviewService.finishSession(sessionId);
        navigate(`/candidate/results/${finalResults.id}`, { replace: true });
      } else {
        // Advance question index
        const nextIdx = activeIdx + 1;
        setActiveIdx(nextIdx);
        // Load existing answer for next question or empty
        setAnswer(session.answers[nextIdx]?.answer || '');
      }
    } catch (err) {
      console.error('Failed to save answer progress', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Timer Timeout callback
  const handleTimeout = () => {
    // Automatically triggers next page progress
    handleNext();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg text-white">
        <Loader size="large" label="Configuring secure interview portal..." />
      </div>
    );
  }

  if (grading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-brand-bg text-white p-6 radial-mesh">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary animate-pulse">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-display">Algora AI Evaluation Engine</h1>
          <p className="text-xs text-brand-text-inactive leading-relaxed">
            Please wait while our models parse your transcript solutions, match runtime keywords, and structure your diagnostic dashboard report...
          </p>
          <div className="py-4">
            <Loader size="large" label="Compiling feedback statistics..." />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Invalid Interview Session</h2>
        <p className="text-xs text-brand-text-inactive">
          This session either does not exist or has been completed.
        </p>
        <Link to="/candidate/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const activeQuestionText = session.answers[activeIdx]?.question;
  const isFinalStep = activeIdx === session.answers.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 flex-grow w-full text-left">
      
      {/* Top Session metadata bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-white truncate max-w-sm sm:max-w-md">
            {session.title}
          </h1>
          <p className="text-[10px] text-brand-muted uppercase tracking-wider">
            Exam Mode &bull; Candidate: {session.candidateName}
          </p>
        </div>

        {/* Timer component */}
        <Timer 
          duration={session.timeLimit} 
          onTimeout={handleTimeout}
          resetKey={activeIdx}
        />
      </div>

      {/* Main Question Panel */}
      <QuestionCard 
        questionText={activeQuestionText}
        currentIndex={activeIdx}
        totalQuestions={session.answers.length}
        category={session.role}
      />

      {/* Response input canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            Your Response
          </label>
          <span className="text-[10px] text-brand-muted">
            Word count: {answer ? answer.trim().split(/\s+/).length : 0} words
          </span>
        </div>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your structured answer here. Include internal variables, complexity discussions, or real-life application experiences..."
            className="glass-input w-full min-h-[200px] p-5 rounded-2xl text-sm text-white focus:outline-none placeholder-brand-muted leading-relaxed font-sans"
            disabled={submitLoading}
          />

          {/* Ambient Warning for empty submissions */}
          {answer.length > 0 && answer.length < 15 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" />
              Response is too short to be processed by AI. Expand your answer.
            </div>
          )}
        </div>
      </div>

      {/* Interactive voice mock recorder */}
      <div className="glass-panel border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-3.5 rounded-xl border flex-shrink-0 cursor-pointer transition-all duration-300
              ${isRecording 
                ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                : 'bg-brand-surface border-white/5 text-brand-primary hover:border-brand-primary/30'
              }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">
              {isRecording ? 'Listening...' : 'Simulate Voice Input'}
            </span>
            <p className="text-[10px] text-brand-text-inactive leading-relaxed">
              {isRecording ? 'Speaking... Transcribing audio directly in real time.' : 'Click mic to mock a 4-second speech transcription.'}
            </p>
          </div>
        </div>

        {/* Custom Visual Waveform Animation */}
        {isRecording && (
          <div className="flex items-end gap-1.5 h-6">
            {waveformBars.map((h, i) => (
              <div 
                key={i} 
                className="w-1 bg-brand-primary rounded-full transition-all duration-150"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submission trigger actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-2 text-[10px] text-brand-muted">
          <AlertCircle className="w-3.5 h-3.5 text-brand-primary" />
          Answers save automatically when you click the proceed key.
        </div>
        <Button
          variant="primary"
          onClick={handleNext}
          loading={submitLoading}
          disabled={submitLoading}
          icon={isFinalStep ? CheckSquare : ChevronRight}
          className={isFinalStep ? '!from-emerald-600 !to-emerald-500 border-emerald-500/30' : ''}
        >
          {isFinalStep ? 'Finish & Grade Exam' : 'Save & Next Question'}
        </Button>
      </div>

    </div>
  );
};

export default InterviewRoom;
