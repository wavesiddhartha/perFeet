import { useEffect, useRef } from 'react'

interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

export function usePerformanceMonitor(operationName: string) {
  const metricsRef = useRef<PerformanceMetric[]>([])
  
  const startTiming = (metricName: string) => {
    const metric: PerformanceMetric = {
      name: `${operationName}:${metricName}`,
      startTime: performance.now()
    }
    metricsRef.current.push(metric)
    console.log(`⏱️ Started: ${metric.name}`)
    return metric
  }
  
  const endTiming = (metric: PerformanceMetric) => {
    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime
    console.log(`✅ Completed: ${metric.name} (${metric.duration.toFixed(1)}ms)`)
    return metric
  }
  
  const getMetrics = () => metricsRef.current
  
  const getTotalDuration = () => {
    const completedMetrics = metricsRef.current.filter(m => m.duration)
    return completedMetrics.reduce((total, metric) => total + (metric.duration || 0), 0)
  }
  
  useEffect(() => {
    return () => {
      // Log performance summary on cleanup
      const totalTime = getTotalDuration()
      if (totalTime > 0) {
        console.log(`📊 Performance Summary for ${operationName}: ${totalTime.toFixed(1)}ms total`)
      }
    }
  }, [operationName])
  
  return { startTiming, endTiming, getMetrics, getTotalDuration }
}