# US Education Choropleth Map

A modern, interactive data visualization displaying educational attainment across US counties using D3.js and React. This project visualizes the percentage of adults (age 25+) with a bachelor's degree or higher from 2010-2014 census data.

## 🎯 Overview

This choropleth map provides an intuitive way to explore educational patterns across the United States at the county level. The visualization uses color-coding to represent different education levels, making it easy to identify regional trends and disparities in educational attainment.

## ✨ Features

- **Interactive Choropleth Map**: Hover over any county to see detailed information
- **Color-Coded Visualization**: Five distinct color ranges representing education levels
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Real-time Tooltips**: Dynamic information display with county name, state, and education percentage
- **Professional Styling**: Modern UI with clean typography and subtle animations
- **Accessibility**: High contrast colors and keyboard navigation support

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Visualization Library**: D3.js v7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Processing**: TopoJSON for geographic data
- **Font**: Inter (Google Fonts)

## 📊 Data Sources

- **Education Data**: FreeCodeCamp US Education Dataset (2010-2014)
- **Geographic Data**: US Counties TopoJSON from FreeCodeCamp
- **Coverage**: 3,142 US counties and county equivalents

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/Ayokanmi-Adejola/Choropleth-Map>
cd us-education-choropleth-map
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## 🎨 Design Philosophy

The visualization follows modern data visualization principles:

- **Clarity**: Clear color distinctions between education levels
- **Consistency**: Uniform styling and interaction patterns
- **Context**: Comprehensive legend and descriptive tooltips
- **Accessibility**: High contrast ratios and semantic HTML structure

## 📈 Education Level Ranges

The map uses five color-coded ranges to represent education levels:

- **< 15%**: Light blue (`#f7fbff`)
- **15% - 30%**: Medium light blue (`#c6dbef`)
- **30% - 45%**: Medium blue (`#6baed6`)
- **45% - 60%**: Dark blue (`#2171b5`)
- **> 60%**: Very dark blue (`#08306b`)

## 🧪 Testing

This project includes comprehensive testing to ensure data accuracy and visualization correctness:

```bash
npm run test
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [FreeCodeCamp](https://www.freecodecamp.org/) for providing the datasets and project requirements
- [D3.js](https://d3js.org/) community for excellent documentation and examples
- [US Census Bureau](https://www.census.gov/) for the original education data# Choropleth-Map
# Choropleth-Map
