import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "@/components/interview/RoleSelector";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { AnswerInput } from "@/components/interview/AnswerInput";
import { FeedbackCard } from "@/components/interview/FeedbackCard";
import { Instructions } from "@/components/interview/Instructions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, RotateCcw, GraduationCap, Loader2 } from "lucide-react";

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

type InterviewState = "idle" | "questioning" | "answered";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [interviewState, setInterviewState] = useState<InterviewState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRoleLabel = (value: string) => {
    const labels: Record<string, string> = {
      "software-developer": "Software Developer",
      "ai-ml": "AI/ML Engineer",
      "embedded-systems": "Embedded Systems Engineer",
    };
    return labels[value] || value;
  };

  const startInterview = async () => {
    if (!selectedRole) {
      toast.error("Please select a job role first");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-ai", {
        body: {
          type: "question",
          role: getRoleLabel(selectedRole),
        },
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setInterviewState("questioning");
      setQuestionNumber(1);
      setAnswer("");
      setFeedback(null);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please enter your answer first");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-ai", {
        body: {
          type: "evaluate",
          role: getRoleLabel(selectedRole),
          question: currentQuestion,
          answer: answer,
        },
      });

      if (error) throw error;

      setFeedback(data);
      setInterviewState("answered");
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast.error("Failed to evaluate answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-ai", {
        body: {
          type: "question",
          role: getRoleLabel(selectedRole),
        },
      });

      if (error) throw error;

      setCurrentQuestion(data.question);
      setQuestionNumber((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      setInterviewState("questioning");
    } catch (error) {
      console.error("Error getting next question:", error);
      toast.error("Failed to get next question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setInterviewState("idle");
    setCurrentQuestion("");
    setQuestionNumber(1);
    setAnswer("");
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-hero shadow-soft">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AI Interview Practice</h1>
              <p className="text-xs text-muted-foreground">Master your next interview</p>
            </div>
          </div>
          {interviewState !== "idle" && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetInterview}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {interviewState === "idle" ? (
          <div className="space-y-10 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Practice Makes{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Perfect
                </span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Prepare for your dream job with AI-powered interview practice. 
                Get instant feedback and improve your answers.
              </p>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col items-center gap-6">
              <RoleSelector
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={isLoading}
              />
              <Button
                onClick={startInterview}
                disabled={!selectedRole || isLoading}
                className="h-14 px-10 text-lg gradient-hero text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>

            {/* Instructions */}
            <Instructions />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                Practicing for: <span className="font-medium text-foreground">{getRoleLabel(selectedRole)}</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Question <span className="font-medium text-foreground">{questionNumber}</span>
              </span>
            </div>

            {/* Question */}
            <QuestionCard question={currentQuestion} questionNumber={questionNumber} />

            {/* Answer Section */}
            {interviewState === "questioning" && (
              <AnswerInput
                value={answer}
                onChange={setAnswer}
                onSubmit={submitAnswer}
                isLoading={isLoading}
              />
            )}

            {/* Feedback Section */}
            {interviewState === "answered" && feedback && (
              <FeedbackCard
                feedback={feedback}
                onNextQuestion={nextQuestion}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            AI-powered interview practice for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
