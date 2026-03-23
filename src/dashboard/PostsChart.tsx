import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartDatum = { label: string; value: number };

type Props = {
  data: ChartDatum[];
  title?: string;
};

const MAX_BARS = 8;
const BAR_FILL = "#525252";

export const PostsChart = memo(function PostsChart({ data, title }: Props) {
  const chartRows = useMemo(() => {
    return [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_BARS)
      .map((row) => ({
        name: row.label,
        posts: row.value,
      }));
  }, [data]);

  if (chartRows.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
        No data for chart (adjust filters).
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      {title ? (
        <h2 className="mb-2 text-sm font-semibold text-neutral-800">{title}</h2>
      ) : null}
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartRows}
            margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={88}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #e5e5e5",
              }}
            />
            <Bar dataKey="posts" name="Posts" fill={BAR_FILL} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
