import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const AnswerInput = ({ value, onChange, onSubmit, isLoading, disabled }: AnswerInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isLoading && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Your Answer
        </label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer here... Be thorough and specific. You can use examples from your experience."
          className="min-h-[180px] text-base bg-card border-border shadow-card focus:border-primary focus:ring-primary/20 resize-none"
          disabled={disabled || isLoading}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Press Ctrl+Enter to submit
        </p>
      </div>
      <Button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading || disabled}
        className="w-full sm:w-auto h-12 px-8 gradient-hero text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Answer
          </>
        )}
      </Button>
    </div>
  );
};
