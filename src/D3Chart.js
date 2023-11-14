import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import data from './players.json';
import usersData from './rapid.csv'

const BarChartRace = () => {

    const getUsers = () => {
        let usersArr = []
        d3.csv(usersData, data => usersArr.push(data))
        return usersArr
    }
    const svgRef = useRef();

    // Extracting only the necessary data (Name and Rating)
    const simplifiedData = data.map(({ Name, Rating }, index) => ({ Name, Rating, index: index + 1 }));

    const width = 600;
    const height = 400;

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const yScale = d3.scaleBand()
            .domain(simplifiedData.map(d => d.Name))
            .range([0, height])
            .padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(simplifiedData, d => d.Rating)])
            .range([0, width]);

        const updateChart = (frameData) => {
            const bars = svg.selectAll("g").data(frameData, d => d.Name);

            const barGroup = bars.enter()
                .append("g")
                .attr("transform", d => `translate(0, ${yScale(d.Name)})`);

            barGroup.append("text")
                .text(d => `${d.Name}`)
                .attr("x", 5)
                .attr("y", yScale.bandwidth() / 2)
                .attr("alignment-baseline", "middle")
                .attr("font-size", "10px");

            barGroup.append("text")
                .text(d => `Rank: ${d.index}`)
                .attr("x", d => xScale(d.Rating) + 5)
                .attr("y", yScale.bandwidth() / 2)
                .attr("alignment-baseline", "middle")
                .attr("font-size", "10px");

            barGroup.append("rect")
                .attr("x", 100)
                .attr("y", 0)
                .attr("width", d => xScale(d.Rating))
                .attr("height", yScale.bandwidth())
                .attr("fill", (d, i) => (i % 2 === 0 ? "blue" : "green")); // Alternating blue and green

            bars.exit().remove();
        };

        let currentFrame = 0;
        const frames = 50;
        const intervalDuration = 100;

        const interval = d3.interval(() => {
            updateChart(simplifiedData.slice(0, currentFrame + 1));

            currentFrame++;
            if (currentFrame >= frames) {
                interval.stop();
            }
        }, intervalDuration);

        return () => {
            interval.stop();
        };
    }, []);

    return (
        <div>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default BarChartRace;
