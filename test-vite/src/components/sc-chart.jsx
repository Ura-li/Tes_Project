"use client"
import {useState, useMemo, useEffect, } from "react"
import { Archive, AreaChartIcon, BarChart3, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import ApiCustomer from "@/api"


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 214, mobile: 140 },
  { month: "August", desktop: 114, mobile: 140 },
  { month: "September", desktop: 214, mobile: 140 },
  { month: "October", desktop: 134, mobile: 140 },
  { month: "November", desktop: 164, mobile: 140 },
  { month: "December", desktop: 144, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "open",
    color: "oklch(0.65 0.1352 218.54)",
  },
  mobile: {
    label: "closed",
    color: "oklch(0.65 0.1845 292.66)",
  },
} 



export function ChartArea({data}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Open And Closed Case</CardTitle>
        <CardDescription>
          Showing total Cases for 1 year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="closed"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="open"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Area Chart of Cases <AreaChartIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - December 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export function ChartBar({data, month}) {
  const monthName = new Date().toLocaleString('default', { month: 'long' });
  console.log("data",data)
console.log("tes",chartData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Open And Closed Case</CardTitle>
        <CardDescription>{monthName} 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="open" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="closed" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Bar Chart Of Cases <BarChart3 className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Cases for 1 Week in a month
        </div>
      </CardFooter>
    </Card>
  )
}


export function ChartPie() {
  const [caseData, setCaseData] = useState([])
  console.log(caseData);
  const fetchCaseData = async () => {
    try{
      const response = await ApiCustomer.get("/api/case-information")
      if (response.data.data){
          setCaseData(response.data.value)
      } else {
        console.log("something error when fetching data");
      }
    } catch (err) {
      console.log(err,"error this")
    }
  }
  useEffect(() => {
    fetchCaseData();
  },[]);
  
  const chartData2 = [
    { browser: "Close", visitors: caseData.open, fill: "oklch(0.7 0.1722 30.07)" },
    { browser: "Open", visitors: caseData.closed, fill: "oklch(0.7 0.1524 133.84)" },
    // { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    // { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    // { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ]
  
  const chartConfig2 = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    // firefox: {
    //   label: "Firefox",
    //   color: "hsl(var(--chart-3))",
    // },
    // edge: {
    //   label: "Edge",
    //   color: "hsl(var(--chart-4))",
    // },
    // other: {
    //   label: "Other",
    //   color: "hsl(var(--chart-5))",
    // },
  } 
  const totalVisitors = useMemo(() => {
    return chartData2.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [caseData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Open And Closed Case</CardTitle>
        <CardDescription>Open & Close</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig2}
          className="mx-auto aspect-square max-h-[205px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData2}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Cases
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend></ChartLegend>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Created Case All Time <Archive className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Case that Open and closed
        </div>
      </CardFooter>
    </Card>
  )
}