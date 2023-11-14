import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import data from './rapid.csv'

const BarChart = () => {
    const chartRef = useRef();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        // Load data from CSV
        d3.csv(data).then(data => {
            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .domain(data.map(d => d.Abando))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d.Abando)])
                .nice()
                .range([height, 0]);

            svg.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.Abando))
                .attr('y', d => y(+d.Abando))
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(+d.Abando))
                .attr('fill', 'steelblue');

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append('g')
                .call(d3.axisLeft(y));
        });
    }, []);

    return <div ref={chartRef}></div>;
};

export default BarChart;
