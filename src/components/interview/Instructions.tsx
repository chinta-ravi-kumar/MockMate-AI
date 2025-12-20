import { BookOpen, Target, Brain, MessageCircle } from "lucide-react";

export const Instructions = () => {
  const steps = [
    {
      icon: BookOpen,
      title: "Select Your Role",
      description: "Choose the job position you're preparing for",
    },
    {
      icon: MessageCircle,
      title: "Answer Questions",
      description: "Respond to AI-generated interview questions",
    },
    {
      icon: Brain,
      title: "Get Feedback",
      description: "Receive detailed scores and improvement tips",
    },
    {
      icon: Target,
      title: "Keep Practicing",
      description: "Continue with more questions to build confidence",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
        How It Works
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-4 bg-card rounded-lg border border-border shadow-card text-center hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-secondary">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">
              {step.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
