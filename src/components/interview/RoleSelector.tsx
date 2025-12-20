import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  { value: "software-developer", label: "Software Developer" },
  { value: "ai-ml", label: "AI/ML Engineer" },
  { value: "embedded-systems", label: "Embedded Systems Engineer" },
];

interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const RoleSelector = ({ value, onValueChange, disabled }: RoleSelectorProps) => {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Select Job Role
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full h-12 text-base bg-card border-border shadow-card hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Choose a role..." />
        </SelectTrigger>
        <SelectContent className="bg-card border-border shadow-soft">
          {roles.map((role) => (
            <SelectItem 
              key={role.value} 
              value={role.value}
              className="cursor-pointer hover:bg-secondary"
            >
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
