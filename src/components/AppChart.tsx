// import { ICountry } from "@/types/Country";
import { debounce } from "@/lib/debounce";
import { formatPopulation } from "@/lib/formatNumber";
import { PointTooltipProps, ResponsiveLine } from "@nivo/line";
import { useState } from "react";

interface IDataPoint {
    x: string;
    y: number;
}

interface IChartData {
    id: string;
    color?: string;
    data: IDataPoint[];
}

interface IClickedPointData {
    color: string;
    xFormatted: string;
    y: number;
    yFormatted: string;
    x: string;
    yStacked: number;
}
interface IClickedPoint {
    id: string;
    borderColor: string;
    color: string;
    index: number;
    serieColor: string;
    serieId: string;
    x: number;
    y: number;
    data: IClickedPointData;
}

interface IProps {
    data: {
        id: string;
        data?: IDataPoint[];
    };
    changeChartData?: string;
}

const AppChart = ({ data, changeChartData }: IProps) => {
    console.log({ data });

    const [selectedPoint, setSelectedPoint] = useState<IClickedPoint | null>(
        null
    );

    const handlePointClick = (point: IClickedPoint) => {
        console.log({ point });
        setSelectedPoint(point);
    };
    const CustomTooltip = ({ point }: PointTooltipProps) => (
        <div
            style={{
                background: "white",
                padding: "10px",
                border: "1px solid #ccc",
            }}
        >
            <div>Population: {point.data.xFormatted}</div>
            <div>Population: {point.data.yFormatted}</div>
        </div>
    );

    console.log({ selectedPoint });

    const debouncedHandlePointClick = debounce(handlePointClick, 250);
    return (
        <div className="h-56">
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 70, bottom: 15, left: 70 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                }}
                curve="cardinal"
                lineWidth={1}
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend:
                        changeChartData === "population"
                            ? "Population"
                            : "Area",
                    legendOffset: -60,
                    legendPosition: "middle",
                    truncateTickAt: 0,
                    format: (value) => formatPopulation(value),
                }}
                gridXValues={12}
                gridYValues={9}
                enableGridX={false}
                pointSize={5}
                pointColor="blue"
                pointBorderWidth={1}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                colors={{ scheme: "category10" }}
                useMesh={true}
                layers={[
                    "grid",
                    "markers",
                    "axes",
                    "areas",
                    "crosshair",
                    "lines",
                    "points",
                    ({ points }) => (
                        <g>
                            {points.map(
                                (point: {
                                    id: string;
                                    x: number;
                                    y: number;
                                }) => (
                                    <circle
                                        key={point.id}
                                        cx={point.x}
                                        cy={point.y}
                                        r={10}
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            debouncedHandlePointClick(
                                                point as IClickedPoint
                                            )
                                        }
                                    />
                                )
                            )}
                        </g>
                    ),
                ]}
                theme={{
                    crosshair: {
                        line: {
                            stroke: "#89a8ed",
                            strokeWidth: 1,
                            strokeDasharray: "2 2",
                        },
                    },
                    grid: {
                        line: {
                            strokeDasharray: "2 2",
                        },
                    },
                }}
                crosshairType="x"
                tooltip={CustomTooltip}
                // legends={[
                //     {
                //         anchor: "bottom-right",
                //         direction: "column",
                //         justify: false,
                //         translateX: 100,
                //         translateY: 0,
                //         itemsSpacing: 0,
                //         itemDirection: "left-to-right",
                //         itemWidth: 80,
                //         itemHeight: 20,
                //         itemOpacity: 0.75,
                //         symbolSize: 12,
                //         symbolShape: "circle",
                //         symbolBorderColor: "rgba(0, 0, 0, .5)",
                //         effects: [
                //             {
                //                 on: "hover",
                //                 style: {
                //                     itemBackground: "rgba(0, 0, 0, .03)",
                //                     itemOpacity: 1,
                //                 },
                //             },
                //         ],
                //     },
                // ]}
            />

            <div className="my-5 border border-teal-500">
                {selectedPoint && (
                    <div>
                        <h2>Data for Point</h2>
                        <p>X: {selectedPoint.data.x}</p>
                        <p>Y: {selectedPoint.data.y}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppChart;
