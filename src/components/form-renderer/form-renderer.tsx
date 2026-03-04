"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  FormWithQuestions,
  QuestionWithParsedProperties,
  WelcomeScreenProperties,
  TextProperties,
  MultipleChoiceProperties,
  RatingProperties,
  ThankYouScreenProperties,
} from "@/types/form";
import { ProgressBar } from "./progress-bar";
import { NavigationFooter } from "./navigation-footer";
import { WelcomeScreen } from "./question-types/welcome-screen";
import { ShortText } from "./question-types/short-text";
import { LongText } from "./question-types/long-text";
import { EmailInput } from "./question-types/email-input";
import { MultipleChoice } from "./question-types/multiple-choice";
import { YesNo } from "./question-types/yes-no";
import { Rating } from "./question-types/rating";
import { ThankYouScreen } from "./question-types/thank-you-screen";

interface FormRendererProps {
  form: FormWithQuestions;
}

export function FormRenderer({ form }: FormRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const questions = form.questions;
  const currentQuestion = questions[currentIndex];

  // Questions that count for progress (exclude welcome + thank you)
  const answerableQuestions = questions.filter(
    (q) => q.type !== "welcome_screen" && q.type !== "thank_you_screen"
  );
  const currentAnswerableIndex = answerableQuestions.findIndex((q) => q.id === currentQuestion?.id);

  // Question number for display
  let questionNumber = 0;
  if (currentAnswerableIndex >= 0) {
    questionNumber = currentAnswerableIndex + 1;
  }

  const isWelcome = currentQuestion?.type === "welcome_screen";
  const isThankYou = currentQuestion?.type === "thank_you_screen";
  const isLastAnswerable =
    currentIndex === questions.length - 2 && questions[questions.length - 1]?.type === "thank_you_screen";

  const goNext = useCallback(async () => {
    if (isSubmitting) return;

    // If we're on the last answerable question, submit first
    if (isLastAnswerable && !submitted) {
      setIsSubmitting(true);
      try {
        const currentAnswers = answersRef.current;
        const answerPayload = answerableQuestions
          .map((q) => ({ questionId: q.id, value: currentAnswers[q.id] || "" }))
          .filter((a) => a.value.trim());

        const res = await fetch(`/api/forms/${form.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answerPayload }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Failed to submit");
          setIsSubmitting(false);
          return;
        }

        setSubmitted(true);
      } catch {
        alert("Network error. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, isLastAnswerable, submitted, isSubmitting, answerableQuestions, form.id]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0 && !isThankYou) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, isThankYou]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const canGoNext = () => {
    if (isWelcome) return true;
    if (isThankYou) return false;
    if (currentQuestion?.required) {
      const val = answers[currentQuestion.id];
      return !!val && val.trim().length > 0;
    }
    return true;
  };

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 80 : -80, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const renderQuestion = (q: QuestionWithParsedProperties) => {
    const val = answers[q.id] || "";
    const change = (v: string) => setAnswer(q.id, v);

    switch (q.type) {
      case "welcome_screen":
        return (
          <WelcomeScreen
            title={q.title}
            description={q.description}
            properties={q.properties as WelcomeScreenProperties}
            onNext={goNext}
          />
        );
      case "short_text":
        return (
          <ShortText
            title={q.title}
            description={q.description}
            properties={q.properties as TextProperties}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "long_text":
        return (
          <LongText
            title={q.title}
            description={q.description}
            properties={q.properties as TextProperties}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "email":
        return (
          <EmailInput
            title={q.title}
            description={q.description}
            properties={q.properties as TextProperties}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "multiple_choice":
        return (
          <MultipleChoice
            title={q.title}
            description={q.description}
            properties={q.properties as MultipleChoiceProperties}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "yes_no":
        return (
          <YesNo
            title={q.title}
            description={q.description}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "rating":
        return (
          <Rating
            title={q.title}
            description={q.description}
            properties={q.properties as RatingProperties}
            value={val}
            onChange={change}
            onSubmit={goNext}
            questionNumber={questionNumber}
          />
        );
      case "thank_you_screen":
        return (
          <ThankYouScreen
            title={q.title}
            description={q.description}
            properties={q.properties as ThankYouScreenProperties}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: form.theme.backgroundColor,
        color: form.theme.textColor,
      }}
    >
      {form.settings.showProgressBar && !isWelcome && !isThankYou && (
        <ProgressBar current={currentAnswerableIndex + 1} total={answerableQuestions.length} />
      )}

      <div className="flex flex-1 items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion?.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-center">
              {currentQuestion && renderQuestion(currentQuestion)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {!isWelcome && !isThankYou && (
        <NavigationFooter
          onPrev={goPrev}
          onNext={goNext}
          canGoPrev={currentIndex > 0}
          canGoNext={canGoNext()}
          isSubmitting={isSubmitting}
          isLastQuestion={isLastAnswerable}
        />
      )}
    </div>
  );
}
