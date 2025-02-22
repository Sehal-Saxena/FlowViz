"use client"

import { useState, useCallback } from "react"
import NetworkGraph from "./components/NetworkGraph"
import InputForm from "./components/InputForm"
import ResultsPanel from "./components/ResultsPanel"
import type { Node, Edge } from "reactflow"
import { calculateMaxFlow, calculateMinCostFlow, type Path } from "../utils/algorithms"
import { applyNodeChanges, type NodeChange } from "reactflow"

export default function NetworkFlowSimulation() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [maxFlow, setMaxFlow] = useState<number | null>(null)
  const [minCostFlow, setMinCostFlow] = useState<{ flow: number; cost: number } | null>(null)
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([])
  const [bottlenecks, setBottlenecks] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<{ [key: string]: number[] }>({})
  const [allPaths, setAllPaths] = useState<Path[]>([])
  const [optimizedPath, setOptimizedPath] = useState<Path | null>(null)
  const [minFlowPath, setMinFlowPath] = useState<Path | null>(null)

  const addNode = (label: string) => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      data: { label },
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      type: "custom",
    }
    setNodes((prevNodes) => [...prevNodes, newNode])
  }

  const addEdge = (source: string, target: string, capacity: number, cost: number) => {
    const newEdge: Edge = {
      id: `edge-${source}-${target}-${Date.now()}`,
      source,
      target,
      data: { capacity, cost, flow: 0 },
    }
    setEdges((prevEdges) => [...prevEdges, newEdge])
  }

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const runMaxFlow = (source: string, sink: string) => {
    const { maxFlow, flowEdges, bottlenecks, allPaths, optimizedPath, minFlowPath } = calculateMaxFlow(
      nodes,
      edges,
      source,
      sink,
    )
    setMaxFlow(maxFlow)
    setEdges(flowEdges)
    setBottlenecks(bottlenecks)
    setAllPaths(allPaths)
    setOptimizedPath(optimizedPath)
    setMinFlowPath(minFlowPath)

    // Generate path labels
    const newPathLabels: { [key: string]: number[] } = {}
    allPaths.forEach((path, index) => {
      path.pathIds.forEach((edgeId) => {
        if (!newPathLabels[edgeId]) {
          newPathLabels[edgeId] = []
        }
        newPathLabels[edgeId].push(index + 1)
      })
    })
    setPathLabels(newPathLabels)

    // Highlight the optimized path if it exists
    setHighlightedEdges(optimizedPath ? optimizedPath.pathIds : [])
  }

  const runMinCostFlow = (source: string, sink: string, requiredFlow: number) => {
    const { flow, cost, flowEdges } = calculateMinCostFlow(nodes, edges, source, sink, requiredFlow)
    setMinCostFlow({ flow, cost })
    setHighlightedEdges(flowEdges)
  }

  const generateRandomGraph = (nodeCount: number, edgeProbability: number) => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        id: `node-${i + 1}`,
        data: { label: `Node ${i + 1}` },
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        type: "custom",
      })
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < edgeProbability) {
          const capacity = Math.floor(Math.random() * 10) + 1
          const cost = Math.floor(Math.random() * 10) + 1
          newEdges.push({
            id: `edge-${i + 1}-${j + 1}`,
            source: `node-${i + 1}`,
            target: `node-${j + 1}`,
            data: { capacity, cost, flow: 0 },
          })
        }
      }
    }

    setNodes(newNodes)
    setEdges(newEdges)
    setMaxFlow(null)
    setMinCostFlow(null)
    setHighlightedEdges([])
    setBottlenecks([])
    setAllPaths([])
    setOptimizedPath(null)
    setMinFlowPath(null)
    setPathLabels({})
  }

  const handlePathClick = useCallback((pathIds: string[]) => {
    setHighlightedEdges(pathIds)
  }, [])

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r overflow-y-auto">
        <InputForm
          addNode={addNode}
          addEdge={addEdge}
          runMaxFlow={runMaxFlow}
          runMinCostFlow={runMinCostFlow}
          generateRandomGraph={generateRandomGraph}
          nodes={nodes}
        />
        <ResultsPanel
          maxFlow={maxFlow}
          minCostFlow={minCostFlow}
          allPaths={allPaths}
          optimizedPath={optimizedPath}
          minFlowPath={minFlowPath}
          onPathClick={handlePathClick}
        />
      </div>
      <div className="w-2/3">
        <NetworkGraph
          nodes={nodes}
          edges={edges}
          highlightedEdges={highlightedEdges}
          bottlenecks={bottlenecks}
          onNodesChange={onNodesChange}
          pathLabels={pathLabels}
          optimizedPathIds={optimizedPath ? optimizedPath.pathIds : []}
          minFlowPathIds={minFlowPath ? minFlowPath.pathIds : []}
        />
      </div>
    </div>
  )
}

