import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder } from 'lucide-react'
import { type TreeNode } from '../hooks/useFolderTree'

interface FolderTreeProps {
  nodes: TreeNode[]
  activeFolderId: string | null
  onSelect: (folderId: string | null) => void
  depth?: number
}

export function FolderTree({ nodes, activeFolderId, onSelect, depth = 0 }: FolderTreeProps) {
  return (
    <ul className={depth > 0 ? 'ml-4 border-l border-border-subtle pl-2' : ''}>
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

function FolderTreeItem({ node, activeFolderId, onSelect, depth }: {
  node: TreeNode
  activeFolderId: string | null
  onSelect: (folderId: string | null) => void
  depth: number
}) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = node.children.length > 0
  const isActive = activeFolderId === node.id

  return (
    <li>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm cursor-pointer ${
          isActive ? 'bg-accent/10 text-accent-light' : 'text-text-secondary hover:bg-card'
        }`}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
            className="text-text-muted"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-3.5" />
        )}
        <Folder size={14} />
        <span className="truncate">{node.name}</span>
      </div>
      {hasChildren && expanded && (
        <FolderTree nodes={node.children} activeFolderId={activeFolderId} onSelect={onSelect} depth={depth + 1} />
      )}
    </li>
  )
}