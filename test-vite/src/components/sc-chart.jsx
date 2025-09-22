"use client"
import {useState, useMemo, useEffect, } from "react"
import { Archive, AreaChartIcon, BarChart3, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
  { month: "January", open: 186, closed: 80 },
  { month: "February", open: 305, closed: 200 },
  { month: "March", open: 237, closed: 120 },
  { month: "April", open: 73, closed: 190 },
  { month: "May", open: 209, closed: 130 },
  { month: "June", open: 214, closed: 140 },
  { month: "July", open: 214, closed: 140 },
  { month: "August", open: 114, closed: 140 },
  { month: "September", open: 214, closed: 140 },
  { month: "October", open: 134, closed: 140 },
  { month: "November", open: 164, closed: 140 },
  { month: "December", open: 144, closed: 140 },
]

const chartConfig = {
  open: {
    label: "open",
    color: "oklch(0.65 0.1352 218.54)",
  },
  closed: {
    label: "closed",
    color: "oklch(0.65 0.1845 292.66)",
  },
  inActive: {
    label: "inActive",
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
              // bottom:12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={18}
              tickFormatter={(value) => value.slice(0, 3)}
              height={'50'}
            />
            <YAxis domain={[0, 3]} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="closed"
              type="natural"
              fill="var(--chart-close)"
              fillOpacity={0.4}
              stroke="var(--chart-close)"
              stackId="a"
            />
            <Area
              dataKey="open"
              type="natural"
              fill="var(--chart-open)"
              fillOpacity={0.4}
              stroke="var(--chart-open)"
              stackId="a"
            />
            <Area
              dataKey="inActive"
              type="natural"
              fill="var(--chart-inactive)"
              fillOpacity={0.4}
              stroke="var(--chart-inactive)"
              stackId="a"
            />
          <ChartLegend ></ChartLegend>

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
            <Bar dataKey="open" fill="var(--chart-open)" radius={4} />
            <Bar dataKey="closed" fill="var(--chart-close)" radius={4} />
            <Bar dataKey="inActive" fill="var(--chart-inactive)" radius={4} />
          <ChartLegend ></ChartLegend>
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
    { browser: "Close", visitors: caseData.closed, fill: "var(--chart-close)" },
    { browser: "Open", visitors: caseData.open, fill: "var(--chart-open)" },
    { browser: "InActive", visitors: caseData.inActive, fill: "var(--chart-inactive)" },
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
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
   
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
          className=""
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
              innerRadius={50}
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


export const description = "A radial chart with text"


export function ChartRadialText({
  radialchartdata
}) {
  const total = radialchartdata.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="flex   p-0 m-0 gap-0 h-fit shadow-none border-0 ring-0 ">
      {/* <CardHeader className="items-center pb-0 bg-amber-100">
        <CardTitle>Cases Overview</CardTitle>
        <CardDescription>Today’s activity</CardDescription>
      </CardHeader> */}

      <CardContent className="pb-0 flex flex-col lg:flex-row justify-center m-0 p-0 gap-2">
        <RadialBarChart
          width={220}
          height={190}
          data={radialchartdata}
          startAngle={90}
          endAngle={-270}
          innerRadius={60}
          outerRadius={100}
        >
          <RadialBar dataKey="value" background cornerRadius={6} />
          <PolarRadiusAxis tick={false} axisLine={false}>
            <Label
              content={({ viewBox }) =>
                viewBox && "cx" in viewBox && (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      Total Cases
                    </tspan>
                  </text>
                )
              }
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      <CardFooter className="grid  items-center justify-center gap-2 text-xs text-gray-600">
        {radialchartdata.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: d.fill }}
            ></span>
            {d.name}: <span className="font-semibold">{d.value}</span>
          </div>
        ))}
      </CardFooter>
      </CardContent>

    </Card>
  );
}
