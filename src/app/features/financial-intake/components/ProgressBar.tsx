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
    <div className="w-full px-2 pb-3 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[20px] font-medium text-[#9b5948]">
          Step {safeStep} of {totalSteps} - {id.toUpperCase()}
        </p>

        <p className="text-[14px] font-medium text-[#8B4A3A] leading-[100%]">
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
            <div key={index} className="h-2 rounded-full bg-[#e3ddd5]">
              <div
                className="h-full rounded-full bg-[#d2b4aa] transition-all duration-500"
                style={{ width: `${fillWidth}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
