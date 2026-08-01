import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import {
  type FinancialMovement,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({
    default: module.IncomeOutcomeChart,
  })),
);

const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({
    default: module.ProfitPercentChart,
  })),
);

function ChartFallback() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="mb-3 h-5 w-40 animate-pulse rounded-md bg-accent" />
      <div className="h-[280px] w-full animate-pulse rounded-lg bg-accent" />
    </div>
  );
}

function ChartsPlaceholder() {
  return (
    <>
      <ChartFallback />
      <ChartFallback />
    </>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo(
    () => (movements.length ? computeKPIs(movements) : null),
    [movements],
  );

  const monthlyData = useMemo(() => computeMonthlyData(movements), [movements]);

  useEffect(() => {
    fetchFinancialData()
      .then((apiMovements) => {
        setMovements(apiMovements);
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        aria-busy={loading}
        className="dark min-h-screen bg-background text-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <DashboardHeader period="2024 - Full Year" />

            <div className="min-h-[3.5rem]" aria-live="assertive" aria-atomic="true">
              {error ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/40 bg-destructive/15 p-4 text-sm text-destructive"
                >
                  {error}
                </div>
              ) : null}
            </div>

            <section aria-label="Key performance indicators" aria-live="polite">
              <KPIRow metrics={metrics} loading={loading} />
            </section>

            <section
              aria-label="Financial charts"
              className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            >
              {loading ? (
                <ChartsPlaceholder />
              ) : (
                <>
                  <Suspense fallback={<ChartFallback />}>
                    <IncomeOutcomeChart data={monthlyData} loading={loading} />
                  </Suspense>
                  <Suspense fallback={<ChartFallback />}>
                    <ProfitPercentChart data={monthlyData} loading={loading} />
                  </Suspense>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
