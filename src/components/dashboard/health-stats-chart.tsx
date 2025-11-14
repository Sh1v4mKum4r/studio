
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { HealthStat } from "@/lib/types";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  systolic: {
    label: "Systolic (mmHg)",
    color: "hsl(var(--primary))",
  },
  diastolic: {
    label: "Diastolic (mmHg)",
    color: "hsl(var(--accent))",
  },
  sugarLevel: {
    label: "Sugar (mg/dL)",
    color: "hsl(var(--chart-2))",
  }
};

type HealthStatsChartProps = {
  stats: HealthStat[];
};

export function HealthStatsChart({ stats }: HealthStatsChartProps) {
  const chartData = stats.map(stat => ({
    date: format(new Date(stat.timestamp), "MMM d"),
    systolic: stat.bloodPressure.systolic,
    diastolic: stat.bloodPressure.diastolic,
    sugarLevel: stat.sugarLevel,
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Health Trends</CardTitle>
        <CardDescription>Your health statistics over the last 15 days.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 pl-2">
        <div>
          <h3 className="mb-2 text-sm font-medium text-center">Blood Pressure</h3>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={2} dot={false} />
              <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>
         <div>
          <h3 className="mb-2 text-sm font-medium text-center">Sugar Levels</h3>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={['dataMin - 20', 'dataMax + 20']}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sugarLevel" fill="var(--color-sugarLevel)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
