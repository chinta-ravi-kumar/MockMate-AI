import { CheckCircle2, AlertCircle, Lightbulb, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
  onNextQuestion: () => void;
  isLoading: boolean;
}

export const FeedbackCard = ({ feedback, onNextQuestion, isLoading }: FeedbackCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-accent";
    if (score >= 5) return "text-primary";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent!";
    if (score >= 7) return "Good job!";
    if (score >= 5) return "Fair attempt";
    return "Needs improvement";
  };

  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Score Section */}
      <div className="p-6 bg-card rounded-lg border border-border shadow-card text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className={`w-6 h-6 ${getScoreColor(feedback.score)}`} />
          <span className={`text-4xl font-bold ${getScoreColor(feedback.score)}`}>
            {feedback.score}/10
          </span>
        </div>
        <p className="text-muted-foreground font-medium">
          {getScoreLabel(feedback.score)}
        </p>
      </div>

      {/* Strengths */}
      <div className="p-6 bg-card rounded-lg border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">What You Did Well</h3>
        </div>
        <ul className="space-y-2">
          {feedback.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-accent mt-1">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="p-6 bg-card rounded-lg border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Areas to Improve</h3>
        </div>
        <ul className="space-y-2">
          {feedback.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              <span>{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sample Answer */}
      <div className="p-6 bg-secondary/50 rounded-lg border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Sample Answer</h3>
        </div>
        <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
          {feedback.sampleAnswer}
        </p>
      </div>

      {/* Next Question Button */}
      <Button
        onClick={onNextQuestion}
        disabled={isLoading}
        className="w-full h-12 gradient-success text-accent-foreground font-medium shadow-soft hover:shadow-glow transition-all"
      >
        Next Question
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
