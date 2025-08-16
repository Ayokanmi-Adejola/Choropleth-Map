import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface EducationData {
  fips: number;
  state: string;
  area_name: string;
  bachelorsOrHigher: number;
}

interface CountyData {
  type: string;
  objects: {
    counties: {
      type: string;
      geometries: Array<{
        type: string;
        id: number;
        properties?: any;
      }>;
    };
    states: any;
  };
}

const ChoroplethMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<{
    education: EducationData[];
    counties: CountyData | null;
  }>({ education: [], counties: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [educationResponse, countiesResponse] = await Promise.all([
          fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'),
          fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
        ]);

        const educationData = await educationResponse.json();
        const countiesData = await countiesResponse.json();

        setData({
          education: educationData,
          counties: countiesData
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.education.length || !data.counties || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 960;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    // Create education data map for quick lookup
    const educationMap = new Map(
      data.education.map(d => [d.fips, d])
    );

    // Color scale
    const minEducation = d3.min(data.education, d => d.bachelorsOrHigher) || 0;
    const maxEducation = d3.max(data.education, d => d.bachelorsOrHigher) || 100;

    const colorScale = d3.scaleThreshold<number, string>()
      .domain([15, 30, 45, 60])
      .range(['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b']);

    // Create path generator
    const path = d3.geoPath();

    // Convert TopoJSON to GeoJSON
    const counties = topojson.feature(data.counties, data.counties.objects.counties);
    const states = topojson.mesh(data.counties, data.counties.objects.states, (a, b) => a !== b);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('font-size', '14px')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Draw counties
    svg.selectAll('.county')
      .data(counties.features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
      .attr('data-fips', (d: any) => d.id)
      .attr('data-education', (d: any) => {
        const county = educationMap.get(d.id);
        return county ? county.bachelorsOrHigher : 0;
      })
      .style('fill', (d: any) => {
        const county = educationMap.get(d.id);
        return county ? colorScale(county.bachelorsOrHigher) : '#ccc';
      })
      .style('stroke', '#fff')
      .style('stroke-width', '0.5px')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        const county = educationMap.get(d.id);
        if (county) {
          d3.select(this)
            .style('stroke', '#333')
            .style('stroke-width', '2px');

          tooltip
            .style('opacity', 1)
            .attr('data-education', county.bachelorsOrHigher)
            .html(`
              <div>
                <strong>${county.area_name}, ${county.state}</strong><br/>
                <span>Education: ${county.bachelorsOrHigher}%</span><br/>
                <span>FIPS: ${county.fips}</span>
              </div>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('stroke', '#fff')
          .style('stroke-width', '0.5px');

        tooltip.style('opacity', 0);
      });

    // Draw state borders
    svg.append('path')
      .datum(states)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', '1px')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);

    // Create legend
    const legendWidth = 400;
    const legendHeight = 20;
    const legendX = (width - legendWidth) / 2;
    const legendY = height - 60;

    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    // Create legend with discrete color rectangles
    const legendData = [
      { min: 0, max: 15, color: '#f7fbff', label: '< 15%' },
      { min: 15, max: 30, color: '#c6dbef', label: '15% - 30%' },
      { min: 30, max: 45, color: '#6baed6', label: '30% - 45%' },
      { min: 45, max: 60, color: '#2171b5', label: '45% - 60%' },
      { min: 60, max: 100, color: '#08306b', label: '> 60%' }
    ];

    const legendItemWidth = legendWidth / legendData.length;

    // Create legend rectangles
    legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('class', 'legend-item')
      .attr('x', (d, i) => i * legendItemWidth)
      .attr('y', 0)
      .attr('width', legendItemWidth)
      .attr('height', legendHeight)
      .style('fill', d => d.color)
      .style('stroke', '#fff')
      .style('stroke-width', '1px');

    // Add legend labels
    legend.selectAll('.legend-label')
      .data(legendData)
      .enter()
      .append('text')
      .attr('class', 'legend-label')
      .attr('x', (d, i) => i * legendItemWidth + legendItemWidth / 2)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .style('font-size', '12px')
      .style('fill', '#333')
      .text(d => d.label);

    // Cleanup function
    return () => {
      d3.selectAll('#tooltip').remove();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading choropleth map...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 id="title" className="text-4xl font-bold text-gray-800 mb-4">
          United States Educational Attainment
        </h1>
        <p id="description" className="text-lg text-gray-600 max-w-3xl mx-auto">
          Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-5xl bg-gray-50 rounded-lg p-4">
          <svg ref={svgRef} className="w-full h-auto"></svg>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Hover over counties to see detailed information
      </div>
    </div>
  );
};

export default ChoroplethMap;