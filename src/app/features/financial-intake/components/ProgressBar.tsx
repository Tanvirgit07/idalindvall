import type { FinancialSection } from "../types/financialIntake.types";

type Props = {
  progress: number;
  currentSection: FinancialSection;
  currentProgress?: number;
};

const sectionLabels: Record<FinancialSection, string> = {
  income: "Income",
  essentials: "Essentials",
  committed_money: "Committed Money",
  irregular_expense: "Irregular Expenses",
  net_position: "Net Position",
};

export default function ProgressBar({
  progress,
  currentSection,
  currentProgress = 0,
}: Props) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const safeCurrentProgress = Math.min(Math.max(currentProgress, 0), 100);
  const sections = Object.entries(sectionLabels) as [
    FinancialSection,
    string,
  ][];
  const currentSectionIndex = Math.max(
    sections.findIndex(([section]) => section === currentSection),
    0,
  );

  return (
    <div className="w-full px-2 pb-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[15px] font-semibold leading-none text-[#8B4A3A]">
          Step {currentSectionIndex + 1} of {sections.length} -{" "}
          {sectionLabels[currentSection].toUpperCase()}
          {safeCurrentProgress > 0 ? ` (${safeCurrentProgress}%)` : ""}
        </p>

        <p className="rounded-full bg-[#F3EEE8] px-3 py-1 text-[13px] font-semibold leading-none text-[#8B4A3A]">
          {safeProgress}%
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#C8C2BB]">
        <div
          className="h-full rounded-full bg-[#8B4A3A] transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
