import type { Node, Edge } from "reactflow"

interface FlowEdge extends Edge {
  data: {
    capacity: number
    flow: number
    cost: number
  }
}

interface Path {
  pathIds: string[]
  flow: number
  cost: number
}

function findAllPaths(
  nodes: Node[],
  edges: FlowEdge[],
  source: string,
  sink: string,
  visited: Set<string> = new Set(),
  path: string[] = [],
  currentFlow: number = Number.POSITIVE_INFINITY,
  currentCost = 0,
): Path[] {
  if (source === sink) {
    return [{ pathIds: [...path], flow: currentFlow, cost: currentCost }]
  }

  visited.add(source)
  let paths: Path[] = []

  for (const edge of edges) {
    if (edge.source === source && !visited.has(edge.target) && edge.data.capacity > edge.data.flow) {
      const newFlow = Math.min(currentFlow, edge.data.capacity - edge.data.flow)
      const newCost = currentCost + edge.data.cost
      const newPaths = findAllPaths(
        nodes,
        edges,
        edge.target,
        sink,
        new Set(visited),
        [...path, edge.id],
        newFlow,
        newCost,
      )
      paths = paths.concat(newPaths)
    }
  }

  return paths
}

export function calculateMaxFlow(nodes: Node[], edges: FlowEdge[], source: string, sink: string) {
  let maxFlow = 0
  const residualEdges: FlowEdge[] = JSON.parse(JSON.stringify(edges))
  const allPaths: Path[] = []
  const bottlenecks: Set<string> = new Set()

  while (true) {
    const paths = findAllPaths(nodes, residualEdges, source, sink)
    if (paths.length === 0) break

    for (const path of paths) {
      const { pathIds, flow } = path
      maxFlow += flow

      for (const edgeId of pathIds) {
        const edge = residualEdges.find((e) => e.id === edgeId)
        if (edge) {
          edge.data.flow += flow
          if (edge.data.flow === edge.data.capacity) {
            bottlenecks.add(edgeId)
          }
          const reverseEdge = residualEdges.find((e) => e.source === edge.target && e.target === edge.source)
          if (reverseEdge) {
            reverseEdge.data.flow -= flow
          } else {
            residualEdges.push({
              id: `reverse-${edge.id}`,
              source: edge.target,
              target: edge.source,
              data: { capacity: edge.data.capacity, flow: -flow, cost: -edge.data.cost },
            })
          }
        }
      }

      allPaths.push(path)
    }
  }

  const flowEdges = edges.map((edge) => {
    const residualEdge = residualEdges.find((e) => e.id === edge.id)
    return {
      ...edge,
      data: { ...edge.data, flow: residualEdge ? residualEdge.data.flow : 0 },
    }
  })

  // Find the most optimized path (the path with the highest flow)
  const optimizedPath =
    allPaths.length > 0
      ? allPaths.reduce((max, current) => (current.flow > max.flow ? current : max), allPaths[0])
      : null

  // Find the minimum flow path
  const minFlowPath =
    allPaths.length > 0
      ? allPaths.reduce((min, current) => (current.flow < min.flow ? current : min), allPaths[0])
      : null

  return { maxFlow, flowEdges, bottlenecks: Array.from(bottlenecks), allPaths, optimizedPath, minFlowPath }
}

export function calculateMinCostFlow(
  nodes: Node[],
  edges: FlowEdge[],
  source: string,
  sink: string,
  requiredFlow: number,
) {
  // Placeholder for min cost flow algorithm
  return { flow: requiredFlow, cost: 0, flowEdges: edges.map((e) => e.id) }
}

