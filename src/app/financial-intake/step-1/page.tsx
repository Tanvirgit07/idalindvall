import FinancialStepPage from "@/app/features/financial-intake/components/FinancialStepPage";
import { step1Data } from "@/app/features/financial-intake/data/step1.data";

export default function StepOnePage() {
  return <FinancialStepPage data={step1Data} />;
}