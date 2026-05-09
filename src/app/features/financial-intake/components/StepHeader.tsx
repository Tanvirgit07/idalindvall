type Props = {
  currentStep: number;
  totalSteps: number;
  title: string;
};

export default function StepHeader({
  currentStep,
  totalSteps,
  title,
}: Props) {
  return (
    <div className="flex items-center justify-between px-6 pt-5">
      <div>
        <h1 className="text-[15px] font-semibold text-[#2f2926]">
          Financial Intake
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-6 items-center justify-center rounded-sm bg-[#9b5948] px-3 text-[10px] font-medium uppercase tracking-wide text-white transition hover:bg-[#874b3d]">
          Save
        </button>

        <button className="flex h-6 items-center justify-center rounded-sm border border-[#d8ccc3] px-3 text-[10px] font-medium uppercase tracking-wide text-[#9b5948] transition hover:bg-[#efe7df]">
          Exit
        </button>
      </div>
    </div>
  );
}