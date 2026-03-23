import { useState } from "react";
import {
  MultiLevelMultiSelectAccordion,
  type TreeNode,
} from "../components/MultiLevelMultiSelectAccordion";

const SAMPLE_TREE: TreeNode[] = [
  {
    id: "1",
    label: "Frontend",
    children: [
      {
        id: "1-1",
        label: "React",
        children: [
          { id: "1-1-1", label: "Hooks" },
          { id: "1-1-2", label: "context API" },
        ],
      },
      {
        id: "1-2",
        label: "Vue",
      },
    ],
  },
  {
    id: "2",
    label: "Backend",
    children: [
      { id: "2-1", label: "Node.js" },
      { id: "2-2", label: "Python" },
    ],
  },
];

export function MultiselectDemoPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-lg font-semibold text-neutral-800">
        Multi-level multiselect
      </h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
        <MultiLevelMultiSelectAccordion
          nodes={SAMPLE_TREE}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </div>
  );
}
