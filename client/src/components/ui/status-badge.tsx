import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Available":
        return "bg-success/10 text-success";
      case "Maintenance":
        return "bg-error/10 text-error";
      case "Loaned":
        return "bg-warning/10 text-warning";
      case "Reserved":
        return "bg-info/10 text-info";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-1 text-xs rounded-full font-medium",
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
}
