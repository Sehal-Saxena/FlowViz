"use client"

import { useState, useRef, useCallback } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  type NodeChange,
  type NodeTypes,
  type EdgeTypes,
  getBezierPath,
  type EdgeProps,
  ReactFlowProvider,
  MarkerType,
} from "reactflow"
import CustomNode from "./CustomNode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import "reactflow/dist/style.css"
import "./NetworkGraph.css"

interface NetworkGraphProps {
  nodes: Node[]
  edges: Edge[]
  highlightedEdges: string[]
  bottlenecks: string[]
  onNodesChange: (changes: NodeChange[]) => void
  pathLabels: { [key: string]: number[] }
  optimizedPathIds: string[]
  minFlowPathIds: string[]
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data, style }: EdgeProps) {
  const edgePathParams = { sourceX, sourceY, targetX, targetY }
  const [edgePath, labelX, labelY] = getBezierPath(edgePathParams)
  const [, labelX2, labelY2] = getBezierPath({
    ...edgePathParams,
    curvature: -0.5,
  })

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        style={style}
        markerEnd="url(#arrowhead)"
      />
      <foreignObject
        width={100}
        height={60}
        x={labelX2 - 50}
        y={labelY2 - 30}
        className="edge-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="edge-text">
          {`${data.flow}/${data.capacity}`}
          <div>Cost: {data.cost}</div>
          {data.pathLabels && (
            <div className="path-label">
              Path{data.pathLabels.length > 1 ? "s" : ""} {data.pathLabels.join(", ")}
            </div>
          )}
        </div>
      </foreignObject>
    </>
  )
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export default function NetworkGraph({
  nodes,
  edges,
  highlightedEdges,
  bottlenecks,
  onNodesChange,
  pathLabels,
  optimizedPathIds,
  minFlowPathIds,
}: NetworkGraphProps) {
  const [guidePosition, setGuidePosition] = useState({ x: 20, y: 20 })
  const [showGuide, setShowGuide] = useState(true)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX - guidePosition.x, y: e.clientY - guidePosition.y }
    },
    [guidePosition],
  )

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      const newX = e.clientX - dragStartRef.current.x
      const newY = e.clientY - dragStartRef.current.y
      setGuidePosition({ x: newX, y: newY })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const edgesWithStyles = edges.map((edge) => ({
    ...edge,
    type: "custom",
    data: {
      ...edge.data,
      pathLabels: pathLabels[edge.id],
    },
    style: {
      stroke: highlightedEdges.includes(edge.id)
        ? "#ff0000"
        : optimizedPathIds.includes(edge.id)
          ? "#00ff00"
          : minFlowPathIds.includes(edge.id)
            ? "#ff9900"
            : bottlenecks.includes(edge.id)
              ? "#ff00ff"
              : "#000000",
      strokeWidth:
        highlightedEdges.includes(edge.id) ||
        optimizedPathIds.includes(edge.id) ||
        minFlowPathIds.includes(edge.id) ||
        bottlenecks.includes(edge.id)
          ? 3
          : 1,
    },
    animated:
      highlightedEdges.includes(edge.id) || optimizedPathIds.includes(edge.id) || minFlowPathIds.includes(edge.id),
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: highlightedEdges.includes(edge.id)
        ? "#ff0000"
        : optimizedPathIds.includes(edge.id)
          ? "#00ff00"
          : minFlowPathIds.includes(edge.id)
            ? "#ff9900"
            : bottlenecks.includes(edge.id)
              ? "#ff00ff"
              : "#000000",
    },
  }))

  const nodesWithType = nodes.map((node) => ({
    ...node,
    type: "custom",
  }))

  return (
    <ReactFlowProvider>
      <div
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <ReactFlow
          nodes={nodesWithType}
          edges={edgesWithStyles}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
          <svg>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
        {showGuide && (
          <Card
            className="absolute shadow-md cursor-move"
            style={{
              top: guidePosition.y,
              left: guidePosition.x,
              userSelect: "none",
              touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FlowViz Guide</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowGuide(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span>Maximum Flow Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                  <span>Minimum Flow Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2"></div>
                  <span>Current Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-fuchsia-500 mr-2"></div>
                  <span>Bottleneck</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ReactFlowProvider>
  )
}

