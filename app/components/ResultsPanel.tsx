import { useState } from "react"
import type { Path } from "../../utils/algorithms"
import { Button } from "@/components/ui/button"

interface ResultsPanelProps {
  maxFlow: number | null
  minCostFlow: { flow: number; cost: number } | null
  allPaths: Path[]
  optimizedPath: Path | null
  minFlowPath: Path | null
  onPathClick: (pathIds: string[]) => void
}

export default function ResultsPanel({
  maxFlow,
  minCostFlow,
  allPaths,
  optimizedPath,
  minFlowPath,
  onPathClick,
}: ResultsPanelProps) {
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null)

  const handlePathClick = (index: number) => {
    if (selectedPathIndex === index) {
      setSelectedPathIndex(null)
      onPathClick([])
    } else {
      setSelectedPathIndex(index)
      onPathClick(allPaths[index].pathIds)
    }
  }

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Results</h2>
      {maxFlow !== null && (
        <div>
          <h3 className="font-medium">Maximum Flow:</h3>
          <p>{maxFlow}</p>
        </div>
      )}
      {allPaths.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">All Paths:</h3>
          {allPaths.map((path, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded cursor-pointer ${
                selectedPathIndex === index
                  ? "bg-blue-100"
                  : optimizedPath === path
                    ? "text-green-600 font-bold"
                    : minFlowPath === path
                      ? "text-orange-600 font-bold"
                      : ""
              }`}
              onClick={() => handlePathClick(index)}
            >
              <p>Path {index + 1}:</p>
              <p>Flow: {path.flow}</p>
              <p>Cost: {path.cost}</p>
              <p>Edges: {path.pathIds.join(" -> ")}</p>
            </div>
          ))}
        </div>
      )}
      {optimizedPath && (
        <div className="mt-4 text-green-600">
          <h3 className="font-medium">Most Optimized Path (Maximum Flow):</h3>
          <p>Flow: {optimizedPath.flow}</p>
          <p>Cost: {optimizedPath.cost}</p>
          <p>Path: {optimizedPath.pathIds.join(" -> ")}</p>
        </div>
      )}
      {minFlowPath && (
        <div className="mt-4 text-orange-600">
          <h3 className="font-medium">Minimum Flow Path:</h3>
          <p>Flow: {minFlowPath.flow}</p>
          <p>Cost: {minFlowPath.cost}</p>
          <p>Path: {minFlowPath.pathIds.join(" -> ")}</p>
        </div>
      )}
      {minCostFlow !== null && (
        <div className="mt-4">
          <h3 className="font-medium">Minimum Cost Flow:</h3>
          <p>Flow: {minCostFlow.flow}</p>
          <p>Cost: {minCostFlow.cost}</p>
        </div>
      )}
      <Button
        className="mt-4"
        onClick={() => {
          setSelectedPathIndex(null)
          onPathClick([])
        }}
      >
        Clear Highlighted Path
      </Button>
    </div>
  )
}

