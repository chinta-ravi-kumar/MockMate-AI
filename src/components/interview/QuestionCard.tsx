import { MessageSquare } from "lucide-react";

interface QuestionCardProps {
  question: string;
  questionNumber: number;
}

export const QuestionCard = ({ question, questionNumber }: QuestionCardProps) => {
  return (
    <div className="w-full animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-hero">
          <MessageSquare className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber}
        </span>
      </div>
      <div className="p-6 bg-card rounded-lg border border-border shadow-card">
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {question}
        </p>
      </div>
    </div>
  );
};
