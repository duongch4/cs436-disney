class Legend {
    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 300,
            containerHeight: _config.containerHeight || 120,
        };
        this.config.margin = _config.margin || { top: 0, right: 0, bottom: 0, left: 0 };
    }

    initVis(movies, columns, labels) {
        this.setWidthHeight();
        this.movies = movies;
        this.columns = columns;
        this.labels = labels;
        this.setColours();
        this.setMarksClassname();
        this.setValues();
        this.setScales();
        this.svg = d3.select(this.config.parentElement)
            .style("height", `${this.config.containerHeight}px`)
            .style("width", `${this.config.containerWidth}px`);
        this.chart = this.svg.append("g").attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);
    }

    setMarksClassname() {
        this.classname_mark_size = "legend-mark-size";
        this.classname_mark_node = "legend-mark-node";

        this.classname_mark_label_size = "legend-mark-label-size";
        this.classname_mark_label_node = "legend-mark-label-size";

    }

    setColours() {
        this.colour_normal = "#000000";
        this.colour_hover = "#f2bf33";
        this.colour_select = "#dea814";
    }

    setWidthHeight() {
        this.width = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.height = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;
    }

    setValues() {
        // Methods to set values 
        this.value_size = d => d[`${this.columns.size}`];
        // this.value_colour_era = d => d[`${this.columns.era}`];
    }

    setScales() {
        this.setScaleSize();
        this.setScaleNode();
    }

    setScaleSize() {
        const domain_size = d3.extent(this.movies, this.value_size);
        const range_size = [1, 8];
        this.scale_size = this.getScaleSqrt(domain_size, range_size);
    }

    setScaleColourEra() {
        const domain_colour = DataProcessor.movieEras;
        const range_colour = DataProcessor.movieColourEras;
        this.scale_colour_era = this.getScaleOrdinal(domain_colour, range_colour);
    }

    setScaleNode() {
        const domain_node = ["movie", "actor", "movie-award", "actor-award"];
        const range_node = [this.getPath("movie"), this.getPath("actor"), this.getPath("movie"), this.getPath("actor")];
        this.scale_node = this.getScaleOrdinal(domain_node, range_node);
    }

    getPath(type) {
        if (type === "movie") {
            // mickey path
            return "M88 41.5C88 42.9981 87.9158 44.4777 87.7517 45.9347C93.998 44.0266 100.629 43 107.5 43C114.371 43 121.002 44.0266 127.248 45.9347C127.084 44.4777 127 42.9981 127 41.5C127 18.5802 146.699 0 171 0C195.301 0 215 18.5802 215 41.5C215 64.4198 195.301 83 171 83C170.379 83 169.761 82.9879 169.146 82.9638C172.908 91.3728 175 100.692 175 110.5C175 147.779 144.779 178 107.5 178C70.2208 178 40 147.779 40 110.5C40 100.692 42.0918 91.3728 45.8536 82.9638C45.2389 82.9879 44.621 83 44 83C19.6995 83 0 64.4198 0 41.5C0 18.5802 19.6995 0 44 0C68.3005 0 88 18.5802 88 41.5Z"
        } else {
            // star path
            return "M83.2937 7.56232C85.0898 2.03445 92.9102 2.03444 94.7063 7.5623L111.227 58.4073C112.03 60.8794 114.334 62.5532 116.933 62.5532H170.395C176.207 62.5532 178.624 69.9909 173.922 73.4073L130.67 104.831C128.567 106.359 127.687 109.067 128.491 111.539L145.011 162.384C146.807 167.912 140.48 172.509 135.778 169.093L92.5267 137.669C90.4238 136.141 87.5762 136.141 85.4733 137.669L42.222 169.093C37.5197 172.509 31.1928 167.912 32.9889 162.384L49.5094 111.539C50.3127 109.067 49.4327 106.359 47.3298 104.831L4.07847 73.4073C-0.623809 69.9909 1.79283 62.5532 7.60517 62.5532H61.0668C63.6661 62.5532 65.9699 60.8795 66.7731 58.4073L83.2937 7.56232Z"
        }
    }

    getNodeStrokeWidth(type) {
        return (type.includes("award")) ? 10 : 0;
    }

    getScaleSqrt(domain, range) {
        return d3.scaleSqrt()
            .domain(domain)
            .range(range);
    }

    getScaleOrdinal(domain, range) {
        return d3.scaleOrdinal()
            .domain(domain)
            .range(range);
    }

    render() {
        this.renderLegends();
    }

    // Legends
    renderLegends() {
        this.renderLegendSize();
        this.renderLegendNode();
    }

    renderLegendSize() {
        const x_mark_pos = 50;
        const x_mark_label_pos = x_mark_pos + 20;
        const x_feat_label_pos = x_mark_pos + 35;
        const y_first_mark_pos = 50;
        const y_offset_mark_pos = 25;
        const feature_title_font_size = "0.8em";
        const feature_item_font_size = "0.8em";

        // Legend: Size feature
        const size_domain = this.scale_size.domain();
        const show_sizes = [size_domain[0], (size_domain[0] + size_domain[1]) / 2, size_domain[1]]
        this.chart.selectAll(`.${this.classname_mark_size}`).data(show_sizes)
            .enter().append("circle")
            .attr("class", this.classname_mark_size)
            .attr("cx", x_mark_pos)
            .attr("cy", (d, i) => { return y_first_mark_pos + i * (y_offset_mark_pos) })
            .attr("r", (d) => this.scale_size(d))
            .attr("fill", "none")
            .attr("stroke", "black");
        this.chart.selectAll(`.${this.classname_mark_label_size}`).data(show_sizes)
            .enter().append("text")
            .attr("class", this.classname_mark_label_size)
            .attr("x", x_mark_label_pos)
            .attr("y", (d, i) => { return y_first_mark_pos + i * (y_offset_mark_pos) + 2 })
            .text((d) => { return `$${this.formatThousandCommas(d)}` })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", feature_item_font_size);
        this.chart.append("text")
            .attr("x", x_feat_label_pos)
            .attr("y", y_first_mark_pos - 20)
            .text(this.labels.size)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", feature_title_font_size);
    }

    renderLegendNode() {
        const x_mark_pos = 50;
        const x_mark_label_pos = x_mark_pos;
        const x_feat_label_pos = x_mark_pos + 35;
        const y_first_mark_pos = 50;
        const y_offset_mark_pos = 25;
        const x_offset_mark_pos = 120;
        const feature_title_font_size = "0.8em";
        const feature_item_font_size = "0.8em";

        // Legend: Mark feature
        this.chart.selectAll(`.${this.classname_mark_node}`).data(this.scale_node.domain())
            .enter().append("path")
            .attr("class", this.classname_mark_node)
            .attr("d", d => this.scale_node(d))
            .attr("fill", "grey")
            .attr("stroke-width", d => this.getNodeStrokeWidth(d))
            .attr("stroke", "black")
            .attr("transform", (d, i) => `translate(${(x_mark_pos + x_offset_mark_pos * 2.5) + i * (x_offset_mark_pos)}, ${y_first_mark_pos}), scale(0.15,0.15)`);
        this.chart.selectAll(this.classname_mark_label_node).data(this.scale_node.domain())
            .enter().append("text")
            .attr("class", this.classname_mark_label_node)
            .attr("x", (d, i) => {
                let pos = (x_mark_pos + x_offset_mark_pos * 2.5) + i * (x_offset_mark_pos);
                return (d.length > 5) ? (pos - 20) : pos;
            })
            .attr("y", y_first_mark_pos + 50)
            .text(d => (d.includes("award")) ? "oscar winner" : d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", feature_item_font_size);
        this.chart.append("text")
            .attr("x", x_feat_label_pos + x_offset_mark_pos * 2)
            .attr("y", y_first_mark_pos - 20)
            .text("Node")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", feature_title_font_size);
    }

    formatThousandCommas(number) {
        return d3.format(".2s")(number);
    }
}
