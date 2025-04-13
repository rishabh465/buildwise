import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEstimator } from "@/contexts/EstimatorContext";
import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
} from "recharts";

const CustomContent = (props) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      )}
    </g>
  );
};

const ProjectOverview = () => {
  const { state } = useEstimator();

  if (!state.breakdown) {
    return <p>No data available.</p>;
  }

  const data = [
    {
      name: "Total Project Cost",
      children: [
        {
          name: "Materials",
          size: state.breakdown.materials.total,
        },
        {
          name: "Labor",
          size: state.breakdown.labor.total,
        },
        {
          name: "Overhead",
          size: state.breakdown.overhead.total,
        },
      ],
    },
  ];

  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Project Cost Overview</CardTitle>
        <CardDescription>
          Visual breakdown of project costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={data}
            dataKey="size"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomContent />}
            colors={colors}
          >
            <Tooltip />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
