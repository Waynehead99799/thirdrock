import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

function collectLeafIds(node: TreeNode): string[] {
  if (!node.children?.length) return [node.id];
  return node.children.flatMap(collectLeafIds);
}

function collectSubtreeLeafIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap(collectLeafIds);
}

function idsWithChildren(nodes: TreeNode[]): string[] {
  const out: string[] = [];
  function walk(n: TreeNode) {
    if (n.children?.length) {
      out.push(n.id);
      n.children.forEach(walk);
    }
  }
  nodes.forEach(walk);
  return out;
}

export type MultiLevelMultiSelectAccordionProps = {
  nodes: TreeNode[];
  selectedIds: string[];
  onSelectionChange: (nextSelectedIds: string[]) => void;
  className?: string;
  defaultExpandAll?: boolean;
  defaultExpandedIds?: string[];
  idPrefix?: string;
};

type CheckboxState = "checked" | "unchecked" | "indeterminate";

function leafSelectionState(
  node: TreeNode,
  selected: ReadonlySet<string>,
): CheckboxState {
  const leaves = collectLeafIds(node);
  if (leaves.length === 0) return "unchecked";
  let selectedCount = 0;
  for (const id of leaves) {
    if (selected.has(id)) selectedCount += 1;
  }
  if (selectedCount === 0) return "unchecked";
  if (selectedCount === leaves.length) return "checked";
  return "indeterminate";
}

function BranchRow({
  node,
  depth,
  selected,
  onToggleNode,
  expanded,
  onToggleExpand,
  idPrefix,
}: {
  node: TreeNode;
  depth: number;
  selected: ReadonlySet<string>;
  onToggleNode: (node: TreeNode) => void;
  expanded: ReadonlySet<string>;
  onToggleExpand: (id: string) => void;
  idPrefix: string;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = !hasChildren || expanded.has(node.id);
  const state = leafSelectionState(node, selected);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.indeterminate = state === "indeterminate";
  }, [state]);

  const checkboxId = `${idPrefix}-cb-${node.id}`;
  const regionId = `${idPrefix}-region-${node.id}`;

  return (
    <li className="list-none" role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
      <div
        className="flex min-h-9 items-center gap-1 rounded-md px-1 py-0.5 hover:bg-neutral-100"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="grid size-7 shrink-0 place-items-center rounded border border-transparent text-neutral-600 hover:bg-neutral-200/80"
            aria-expanded={isOpen}
            aria-controls={regionId}
            onClick={() => onToggleExpand(node.id)}
            title={isOpen ? "Collapse" : "Expand"}
          >
            <span
              className={`inline-block transition-transform ${isOpen ? "rotate-90" : ""}`}
              aria-hidden
            >
              ▶
            </span>
          </button>
        ) : (
          <span className="inline-block w-7 shrink-0" aria-hidden />
        )}
        <input
          ref={inputRef}
          id={checkboxId}
          type="checkbox"
          className="size-4 shrink-0 rounded border-neutral-400 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
          checked={state === "checked"}
          onChange={() => onToggleNode(node)}
          aria-controls={hasChildren ? regionId : undefined}
        />
        <label
          htmlFor={checkboxId}
          className="flex-1 cursor-pointer select-none text-sm text-neutral-900"
        >
          {node.label}
        </label>
      </div>
      {hasChildren && isOpen ? (
        <ul
          id={regionId}
          role="group"
          className="border-l border-neutral-200"
          style={{ marginLeft: `${depth * 12 + 18}px` }}
        >
          {node.children!.map((child) => (
            <BranchRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              onToggleNode={onToggleNode}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              idPrefix={idPrefix}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function MultiLevelMultiSelectAccordion({
  nodes,
  selectedIds,
  onSelectionChange,
  className = "",
  defaultExpandAll = true,
  defaultExpandedIds,
  idPrefix: idPrefixProp,
}: MultiLevelMultiSelectAccordionProps) {
  const reactId = useId();
  const idPrefix = idPrefixProp ?? `mlms-${reactId.replace(/:/g, "")}`;

  const initialExpanded = useMemo(() => {
    if (defaultExpandAll) return new Set(idsWithChildren(nodes));
    return new Set(defaultExpandedIds ?? []);
  }, [nodes, defaultExpandAll, defaultExpandedIds]);

  const [expanded, setExpanded] = useState<Set<string>>(() => initialExpanded);

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleNode = useCallback(
    (node: TreeNode) => {
      const leaves = collectLeafIds(node);
      if (leaves.length === 0) return;
      const allSelected = leaves.every((id) => selected.has(id));
      const next = new Set(selectedIds);
      if (allSelected) {
        for (const id of leaves) next.delete(id);
      } else {
        for (const id of leaves) next.add(id);
      }
      onSelectionChange([...next]);
    },
    [selected, selectedIds, onSelectionChange],
  );

  return (
    <ul
      role="tree"
      aria-multiselectable
      className={`m-0 list-none p-0 ${className}`}
    >
      {nodes.map((node) => (
        <BranchRow
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          onToggleNode={toggleNode}
          expanded={expanded}
          onToggleExpand={toggleExpand}
          idPrefix={idPrefix}
        />
      ))}
    </ul>
  );
}

export function getAllLeafIds(nodes: TreeNode[]): string[] {
  return collectSubtreeLeafIds(nodes);
}

export function getLeafIdsUnderNode(node: TreeNode): string[] {
  return collectLeafIds(node);
}
