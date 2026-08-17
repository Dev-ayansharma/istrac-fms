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
          ? 'ml-4 border-l border-border-subtle pl-2'
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
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm cursor-pointer ${
          isActive
            ? 'bg-accent/10 text-accent-light'
            : 'text-text-secondary hover:bg-card'
        }`}
        onClick={handleSelect}
      >
        {/* Expand / collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={toggleExpanded}
            className="text-text-muted hover:text-text-primary shrink-0"
            aria-label={
              expanded
                ? `Collapse ${node.name}`
                : `Expand ${node.name}`
            }
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" aria-hidden="true" />
        )}

        {/* Folder icon */}
        <Folder
          size={14}
          className="shrink-0"
          aria-hidden="true"
        />

        {/* Folder name */}
        <span className="truncate">{node.name}</span>
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