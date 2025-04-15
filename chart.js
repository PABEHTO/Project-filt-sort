let groupObj = {};

function createArrGraph(data, key) {
    if (!data || data.length === 0) return [];
    groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];
    for (let entry of groupObj) {
        let lengths = entry[1].map(d => Number(d['Длина']));
        let widths = entry[1].map(d => Number(d['Ширина']));
        let averageLength = d3.mean(lengths) || 0;
        let averageWidth = d3.mean(widths) || 0;
        let riverCount = entry[1].length;

        arrGraph.push({
            labelX: entry[0],
            averageLength: averageLength,
            averageWidth: averageWidth,
            riverCount: riverCount
        });
    }
    return arrGraph;
}

function drawGraph(data) {
    const keyX = d3.select('input[name="xAxis"]:checked').property("value");
    const graphType = d3.select('#type').property("value");
    const showAvgLength = d3.select('#avg_length').property("checked");
    const showAvgWidth = d3.select('#avg_width').property("checked");
    const showRiverCount = d3.select('#river_count').property("checked");

    if (!showAvgLength && !showAvgWidth && !showRiverCount) {
        alert("Выберите хотя бы одну метрику для оси Y");
        return;
    }

    const arrGraph = createArrGraph(data, keyX);
    if (arrGraph.length === 0) {
        alert("Нет данных для построения графика");
        return;
    }

    let svg = d3.select("svg");
    svg.selectAll('*').remove();

    let attr_area = {
        width: parseFloat(svg.attr('width')) || 600,
        height: parseFloat(svg.attr('height')) || 400,
        marginX: 50,
        marginY: 50
    };

    const [scX, scY] = createAxis(svg, arrGraph, attr_area, showAvgLength, showAvgWidth, showRiverCount);

    if (graphType === "dotted") {
        createChart(svg, arrGraph, scX, scY, attr_area, showAvgLength, showAvgWidth, showRiverCount);
    } else if (graphType === "histogram") {
        createBars(svg, arrGraph, scX, scY, attr_area, showAvgLength, showAvgWidth, showRiverCount);
    } else if (graphType === "line") {
        createLineChart(svg, arrGraph, scX, scY, attr_area, showAvgLength, showAvgWidth, showRiverCount);
    }
}

function createAxis(svg, data, attr_area, showAvgLength, showAvgWidth, showRiverCount) {
    let extent = [Infinity, -Infinity];
    if (showAvgLength) {
        let lengthExtent = d3.extent(data.map(d => d.averageLength));
        extent[0] = Math.min(extent[0], lengthExtent[0]);
        extent[1] = Math.max(extent[1], lengthExtent[1]);
    }
    if (showAvgWidth) {
        let widthExtent = d3.extent(data.map(d => d.averageWidth));
        extent[0] = Math.min(extent[0], widthExtent[0]);
        extent[1] = Math.max(extent[1], widthExtent[1]);
    }
    if (showRiverCount) {
        let countExtent = d3.extent(data.map(d => d.riverCount));
        extent[0] = Math.min(extent[0], countExtent[0]);
        extent[1] = Math.max(extent[1], countExtent[1]);
    }
    if (extent[0] === Infinity) extent = [0, 1];

    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.1);

    let scaleY = d3.scaleLinear()
        .domain([Math.max(0, extent[0] * 0.8), extent[1] * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-20)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

function createChart(svg, data, scaleX, scaleY, attr_area, showAvgLength, showAvgWidth, showRiverCount) {
    const r = 4;

    if (showAvgLength) {
        svg.selectAll(".dot-length")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.averageLength))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "red");
    }

    if (showAvgWidth) {
        svg.selectAll(".dot-width")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.averageWidth))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }

    if (showRiverCount) {
        svg.selectAll(".dot-count")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.riverCount))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "green");
    }
}

function createBars(svg, data, scaleX, scaleY, attr_area, showAvgLength, showAvgWidth, showRiverCount) {
    const count = (showAvgLength + showAvgWidth + showRiverCount) || 1;
    const columnWidth = scaleX.bandwidth() / count;
    const innerHeight = attr_area.height - 2 * attr_area.marginY;

    let offset = 0;
    if (showAvgLength) {
        svg.selectAll(".bar-length")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(d.labelX) + offset)
            .attr("y", d => scaleY(d.averageLength))
            .attr("width", columnWidth * 0.95)
            .attr("height", d => innerHeight - scaleY(d.averageLength))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "red");
        offset += columnWidth;
    }
    if (showAvgWidth) {
        svg.selectAll(".bar-width")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(d.labelX) + offset)
            .attr("y", d => scaleY(d.averageWidth))
            .attr("width", columnWidth * 0.95)
            .attr("height", d => innerHeight - scaleY(d.averageWidth))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
        offset += columnWidth;
    }
    if (showRiverCount) {
        svg.selectAll(".bar-count")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(d.labelX) + offset)
            .attr("y", d => scaleY(d.riverCount))
            .attr("width", columnWidth * 0.95)
            .attr("height", d => innerHeight - scaleY(d.riverCount))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "green");
    }
}


function createLineChart(svg, data, scaleX, scaleY, attr_area, showAvgLength, showAvgWidth, showRiverCount) {
    const lineGenerator = d3.line()
        .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d.value))
        .defined(d => !isNaN(d.value));
    
    
    if (showAvgLength) {
        const lengthData = data.map(d => ({ labelX: d.labelX, value: d.averageLength }));
        svg.append("path")
            .datum(lengthData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`);
    }

    if (showAvgWidth) {
        const widthData = data.map(d => ({ labelX: d.labelX, value: d.averageWidth }));
        svg.append("path")
            .datum(widthData)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`);
    }

    if (showRiverCount) {
        const countData = data.map(d => ({ labelX: d.labelX, value: d.riverCount }));
        svg.append("path")
            .datum(countData)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`);
    }
}