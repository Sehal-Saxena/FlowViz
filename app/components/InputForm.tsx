"use client"

import { useState } from "react"
import type { Node } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InputFormProps {
  addNode: (label: string) => void
  addEdge: (source: string, target: string, capacity: number, cost: number) => void
  runMaxFlow: (source: string, sink: string) => void
  runMinCostFlow: (source: string, sink: string, requiredFlow: number) => void
  generateRandomGraph: (nodeCount: number, edgeProbability: number) => void
  nodes: Node[]
}

export default function InputForm({
  addNode,
  addEdge,
  runMaxFlow,
  runMinCostFlow,
  generateRandomGraph,
  nodes,
}: InputFormProps) {
  const [nodeLabel, setNodeLabel] = useState("")
  const [edgeSource, setEdgeSource] = useState("")
  const [edgeTarget, setEdgeTarget] = useState("")
  const [edgeCapacity, setEdgeCapacity] = useState("")
  const [edgeCost, setEdgeCost] = useState("")
  const [maxFlowSource, setMaxFlowSource] = useState("")
  const [maxFlowSink, setMaxFlowSink] = useState("")
  const [minCostFlowSource, setMinCostFlowSource] = useState("")
  const [minCostFlowSink, setMinCostFlowSink] = useState("")
  const [minCostFlowRequired, setMinCostFlowRequired] = useState("")
  const [randomNodeCount, setRandomNodeCount] = useState("5")
  const [randomEdgeProbability, setRandomEdgeProbability] = useState("0.3")

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault()
    if (nodeLabel) {
      addNode(nodeLabel)
      setNodeLabel("")
    }
  }

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault()
    if (edgeSource && edgeTarget && edgeCapacity && edgeCost) {
      addEdge(edgeSource, edgeTarget, Number(edgeCapacity), Number(edgeCost))
      setEdgeSource("")
      setEdgeTarget("")
      setEdgeCapacity("")
      setEdgeCost("")
    }
  }

  const handleRunMaxFlow = (e: React.FormEvent) => {
    e.preventDefault()
    if (maxFlowSource && maxFlowSink) {
      runMaxFlow(maxFlowSource, maxFlowSink)
    }
  }

  const handleRunMinCostFlow = (e: React.FormEvent) => {
    e.preventDefault()
    if (minCostFlowSource && minCostFlowSink && minCostFlowRequired) {
      runMinCostFlow(minCostFlowSource, minCostFlowSink, Number(minCostFlowRequired))
    }
  }

  const handleGenerateRandomGraph = (e: React.FormEvent) => {
    e.preventDefault()
    const nodeCount = Number(randomNodeCount)
    const edgeProbability = Number(randomEdgeProbability)
    if (nodeCount > 0 && edgeProbability >= 0 && edgeProbability <= 1) {
      generateRandomGraph(nodeCount, edgeProbability)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerateRandomGraph} className="space-y-2">
        <h3 className="text-lg font-semibold">Generate Random Graph</h3>
        <Label htmlFor="randomNodeCount">Number of Nodes</Label>
        <Input
          id="randomNodeCount"
          value={randomNodeCount}
          onChange={(e) => setRandomNodeCount(e.target.value)}
          placeholder="Number of Nodes"
          type="number"
        />
        <Label htmlFor="randomEdgeProbability">Edge Probability (0-1)</Label>
        <Input
          id="randomEdgeProbability"
          value={randomEdgeProbability}
          onChange={(e) => setRandomEdgeProbability(e.target.value)}
          placeholder="Edge Probability (0-1)"
          type="number"
          step="0.1"
          min="0"
          max="1"
        />
        <Button type="submit">Generate Random Graph</Button>
      </form>

      <form onSubmit={handleAddNode} className="space-y-2">
        <Label htmlFor="nodeLabel">Add Node</Label>
        <Input
          id="nodeLabel"
          value={nodeLabel}
          onChange={(e) => setNodeLabel(e.target.value)}
          placeholder="Node Label"
        />
        <Button type="submit">Add Node</Button>
      </form>

      <form onSubmit={handleAddEdge} className="space-y-2">
        <Label htmlFor="edgeSource">Add Edge</Label>
        <Select onValueChange={setEdgeSource} value={edgeSource}>
          <SelectTrigger>
            <SelectValue placeholder="Source Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setEdgeTarget} value={edgeTarget}>
          <SelectTrigger>
            <SelectValue placeholder="Target Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={edgeCapacity}
          onChange={(e) => setEdgeCapacity(e.target.value)}
          placeholder="Capacity"
          type="number"
        />
        <Input value={edgeCost} onChange={(e) => setEdgeCost(e.target.value)} placeholder="Cost" type="number" />
        <Button type="submit">Add Edge</Button>
      </form>

      <form onSubmit={handleRunMaxFlow} className="space-y-2">
        <Label htmlFor="maxFlowSource">Run Max Flow</Label>
        <Select onValueChange={setMaxFlowSource} value={maxFlowSource}>
          <SelectTrigger>
            <SelectValue placeholder="Source Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setMaxFlowSink} value={maxFlowSink}>
          <SelectTrigger>
            <SelectValue placeholder="Sink Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Calculate Max Flow</Button>
      </form>

      <form onSubmit={handleRunMinCostFlow} className="space-y-2">
        <Label htmlFor="minCostFlowSource">Run Min Cost Flow</Label>
        <Select onValueChange={setMinCostFlowSource} value={minCostFlowSource}>
          <SelectTrigger>
            <SelectValue placeholder="Source Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setMinCostFlowSink} value={minCostFlowSink}>
          <SelectTrigger>
            <SelectValue placeholder="Sink Node" />
          </SelectTrigger>
          <SelectContent>
            {nodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={minCostFlowRequired}
          onChange={(e) => setMinCostFlowRequired(e.target.value)}
          placeholder="Required Flow"
          type="number"
        />
        <Button type="submit">Calculate Min Cost Flow</Button>
      </form>
    </div>
  )
}

