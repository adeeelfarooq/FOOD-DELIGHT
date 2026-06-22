"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" }

const ChartContext = React.createContext({})

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({ className, payload, ...props }, ref) {
  const { config } = useChart()

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    >
      {payload.map((item, index) => {
        const itemConfig = getPayloadConfigFromPayload(config, item, item.dataKey)

        return (
          <div
            key={index}
            className="flex items-center gap-2"
            style={{
              color: item.color,
            }}
          >
            {itemConfig.icon && (
              <itemConfig.icon className="h-4 w-4" />
            )}
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />
              <span>{itemConfig.label || item.value}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
ChartLegendContent.displayName = "ChartLegendContent"

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({ className, payload, label, ...props }, ref) {
  const { config } = useChart()

  if (!payload || !payload.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex flex-col gap-1">
        {payload.map((item, index) => {
          const itemConfig = getPayloadConfigFromPayload(
            config,
            item,
            item.dataKey
          )

          return (
            <div
              key={index}
              className="flex items-center gap-2"
              style={{
                color: item.color,
              }}
            >
              {itemConfig.icon && (
                <itemConfig.icon className="h-4 w-4" />
              )}
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                <span className="font-medium">{item.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
ChartTooltipContent.displayName = "ChartTooltipContent"

function getPayloadConfigFromPayload(config, payload, key) {
  const itemConfig = config[key]
  return itemConfig || {}
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
