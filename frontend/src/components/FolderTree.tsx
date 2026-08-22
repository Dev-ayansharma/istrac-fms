import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
} from 'lucide-react'

import { type TreeNode } from '../hooks/useFolderTree'

interface FolderTreeProps {
  nodes: TreeNode[]
  activeFolderId: string | null
  onSelect: (folderId: string | null) => void
  depth?: number
}

export function FolderTree({
  nodes,
  activeFolderId,
  onSelect,
  depth = 0,
}: FolderTreeProps) {
  return (
    <ul
      className={
        depth > 0
          ? 'ml-3.5 border-l border-border-subtle pl-1.5'
          : ''
      }
    >
      {nodes.map((node) => (
        <FolderTreeItem
          key={node.id}
          node={node}
          activeFolderId={activeFolderId}
          onSelect={onSelect}
          depth={depth}
        />
      ))}
    </ul>
  )
}

interface FolderTreeItemProps {
  node: TreeNode
  activeFolderId: string | null
  onSelect: (folderId: string | null) => void
  depth: number
}

function FolderTreeItem({
  node,
  activeFolderId,
  onSelect,
  depth,
}: FolderTreeItemProps) {
  const [expanded, setExpanded] = useState(depth === 0)

  const hasChildren = node.children.length > 0
  const isActive = activeFolderId === node.id

  function handleSelect() {
    onSelect(node.id)
  }

  function toggleExpanded(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setExpanded((current) => !current)
  }

  return (
    <li>
      {/* The disclosure toggle and the row are siblings, so both are reachable
          by keyboard — a row inside a row can't be. */}
      <div className="flex items-center gap-0.5">
        {hasChildren ? (
          <button
            type="button"
            onClick={toggleExpanded}
            className="shrink-0 rounded-xs p-0.5 text-text-dim transition-colors duration-150 hover:text-text-primary"
            aria-label={
              expanded
                ? `Collapse ${node.name}`
                : `Expand ${node.name}`
            }
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown size={13} strokeWidth={2} />
            ) : (
              <ChevronRight size={13} strokeWidth={2} />
            )}
          </button>
        ) : (
          <span className="w-[18px] shrink-0" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={handleSelect}
          aria-current={isActive ? 'true' : undefined}
          className={`flex min-w-0 flex-1 items-center gap-2 border-l-2 py-1.5 pr-2 pl-2 text-left text-[13px] transition-colors duration-150 ${
            isActive
              ? 'border-l-accent bg-accent/[0.07] text-accent-light'
              : 'border-l-transparent text-text-secondary hover:bg-card-hover hover:text-text-primary'
          }`}
        >
          <Folder
            size={13}
            strokeWidth={1.7}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <FolderTree
          nodes={node.children}
          activeFolderId={activeFolderId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      )}
    </li>
  )
}
