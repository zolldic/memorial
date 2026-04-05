interface ShareMemoryProgressProps {
  currentStep: number;
  selectedMartyrId: string | null;
  memoryType: string | null;
  onStepClick: (step: number) => void;
}

export function ShareMemoryProgress({ 
  currentStep, 
  selectedMartyrId, 
  memoryType,
  onStepClick 
}: ShareMemoryProgressProps) {
  return (
    <div className="flex items-center gap-0 mb-12 max-w-lg">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center flex-1">
          <button
            onClick={() => {
              if (s === 1) onStepClick(1);
              if (s === 2 && selectedMartyrId) onStepClick(2);
              if (s === 3 && selectedMartyrId && memoryType) onStepClick(3);
            }}
            disabled={
              (s === 2 && !selectedMartyrId) ||
              (s === 3 && (!selectedMartyrId || !memoryType))
            }
            className={`w-10 h-10 flex items-center justify-center font-body text-sm border transition-colors ${
              currentStep >= s 
                ? "bg-foreground text-background border-foreground" 
                : "bg-background text-muted-foreground border-border"
            } disabled:cursor-not-allowed`}
          >
            {s}
          </button>
          {s < 3 && (
            <div className={`flex-1 h-px ${currentStep > s ? "bg-foreground" : "bg-border-light"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
