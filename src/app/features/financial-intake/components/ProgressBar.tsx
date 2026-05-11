type Props = {
  step: number;
  id: string;
  progress: number;
  totalSteps?: number;
};

export default function ProgressBar({
  step,
  id,
  progress,
  totalSteps = 6,
}: Props) {
  const safeStep = Math.min(Math.max(step, 1), totalSteps);
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const filledStepCount = (safeProgress / 100) * totalSteps;

  return (
    <div className="w-full px-2 pb-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[15px] font-semibold leading-none text-[#8B4A3A]">
          Step {safeStep} of {totalSteps} - {id.toUpperCase()}
        </p>

        <p className="rounded-full bg-[#F3EEE8] px-3 py-1 text-[13px] font-semibold leading-none text-[#8B4A3A]">
          {safeProgress}%
        </p>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const fillWidth = Math.min(
            Math.max(filledStepCount - index, 0),
            1,
          ) * 100;

          return (
            <div key={index} className="h-2.5 overflow-hidden rounded-full bg-[#C8C2BB]">
              <div
                className="h-full rounded-full bg-[#8B4A3A] transition-all duration-500"
                style={{ width: `${fillWidth}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
