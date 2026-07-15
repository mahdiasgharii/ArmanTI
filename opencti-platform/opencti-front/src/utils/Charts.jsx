import { resolveLink } from './Entity';
import { truncate } from './String';
import { isColorCloseToWhite } from './Colors';
import { alpha } from '@mui/material/styles';
import { shouldOpenInNewTabMouseEvent } from './domEvent';

export const colors = (temp) => [
  '#29CCB1', // electric blue
  '#860EFE', // violet accent
  '#F20F0F', // signal red
  '#00BD94', // turquoise
  '#F2933A', // orange
  '#F2BE3A', // yellow
  '#7FE0CC', // light blue
  '#B88DFF', // light violet
  '#FF6B6B', // light red
  '#41E149', // green
  '#7587FF', // periwinkle
  '#00F1BD', // teal
  '#E6700F', // dark orange
  '#17AB1F', // dark green
  '#D6C2FA', // pale violet
  '#B2ECFF', // pale blue
  '#848592', // grey
  '#4A08A0', // dark violet
  '#3A3A3A', // dark grey
];

const toolbarOptions = {
  show: false,
  export: {
    csv: {
      columnDelimiter: ',',
      headerCategory: 'category',
      headerValue: 'value',

      dateFormatter(timestamp) {
        return new Date(timestamp).toDateString();
      },
    },
  },
};

const handleNavigate = (event, navigate, link) => {
  if (!link) return;
  event.preventDefault();
  event.stopPropagation();

  if (shouldOpenInNewTabMouseEvent(event)) {
    window.open(link, '_blank');
  } else {
    navigate(link);
  }
};

/**
 * A custom tooltip for ApexChart.
 * This tooltip only display the label of the data it hovers.
 *
 * Why custom tooltip? To manage text color of the tooltip that cannot be done by
 * the ApexChart API by default.
 *
 * @param {Theme} theme
 */
const simpleLabelTooltip = (theme) => ({ seriesIndex, w }) => (`
  <div style="background: ${theme.palette.background.nav}; color: ${theme.palette.text.primary}; padding: 2px 6px; font-size: 12px">
    ${w.config.labels[seriesIndex]}
  </div>
`);

/**
 * @param {Theme} theme
 * @param {boolean} isTimeSeries
 * @param {function} xFormatter
 * @param {function} yFormatter
 * @param {number | 'dataPoints'} tickAmount
 * @param {boolean} dataLabels
 * @param {boolean} legend
 */
export const lineChartOptions = (
  theme,
  isTimeSeries = false,
  xFormatter = null,
  yFormatter = null,
  tickAmount = undefined,
  dataLabels = false,
  legend = true,
) => ({
  chart: {
    type: 'line',
    background: theme.palette.background.secondary,
    toolbar: toolbarOptions,
    foreColor: theme.palette.text.secondary,
    width: '100%',
    height: '100%',
  },
  theme: {
    mode: theme.palette.mode,
  },
  dataLabels: {
    enabled: dataLabels,
  },
  colors: [
    theme.palette.primary.main,
    ...colors(theme.palette.mode === 'dark' ? 400 : 600),
  ],
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  grid: {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .1)'
        : 'rgba(0, 0, 0, .1)',
    strokeDashArray: 3,
  },
  legend: {
    show: legend,
    itemMargin: {
      horizontal: 5,
      vertical: 20,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  tooltip: {
    theme: theme.palette.mode,
  },
  xaxis: {
    type: isTimeSeries ? 'datetime' : 'category',
    tickAmount,
    tickPlacement: 'on',
    labels: {
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
      style: {
        fontSize: '12px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => (yFormatter ? yFormatter(value) : value),
      style: {
        fontSize: '14px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
});

/**
 * @param {Theme} theme
 * @param {boolean} isTimeSeries
 * @param {function} xFormatter
 * @param {function} yFormatter
 * @param {number | 'dataPoints'} tickAmount
 * @param {boolean} isStacked
 * @param {boolean} legend
 */
export const areaChartOptions = (
  theme,
  isTimeSeries = false,
  xFormatter = null,
  yFormatter = null,
  tickAmount = undefined,
  isStacked = false,
  legend = true,
) => ({
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: toolbarOptions,
    foreColor: theme.palette.text.secondary,
    stacked: isStacked,
    width: '100%',
    height: '100%',
  },
  theme: {
    mode: theme.palette.mode,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  colors: [
    '#29CCB1',
    ...colors(theme.palette.mode === 'dark' ? 400 : 600).slice(1),
  ],
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  grid: {
    borderColor: theme.palette.mode === 'dark' ? '#27272A' : '#E4E4E7',
    strokeDashArray: 3,
  },
  legend: {
    show: legend,
    itemMargin: {
      horizontal: 5,
      vertical: 20,
    },
  },
  tooltip: {
    theme: theme.palette.mode,
    cssClass: 'ravin-chart-tooltip',
    marker: {
      show: false,
    },
    onDatasetHover: {
      highlightDataSeries: true,
    },
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const data = w.config.series;
      const isDark = theme.palette.mode === 'dark';
      const bg = isDark ? 'rgba(15, 15, 15, 0.82)' : 'rgba(255, 255, 255, 0.82)';
      const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      const titleBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
      const titleBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
      const textColor = isDark ? '#FAFAFA' : '#09090B';
      const mutedColor = isDark ? '#A1A1AA' : '#71717A';
      const shadow = isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)';

      // Get x value from categories or time series
      const xValue = w.globals.categoryLabels?.[dataPointIndex]
        ?? w.globals.labels?.[dataPointIndex]
        ?? '';
      const formattedX = xFormatter ? xFormatter(xValue) : xValue;

      // Build series rows
      const rows = data.map((s, i) => {
        const val = s.data?.[dataPointIndex]?.y ?? s.data?.[dataPointIndex] ?? 0;
        const formattedVal = yFormatter ? yFormatter(val) : val;
        const seriesColor = w.globals.colors?.[i] ?? '#29CCB1';
        const isHovered = i === seriesIndex;
        const opacity = isHovered ? 1 : 0.5;
        const weight = isHovered ? 600 : 400;

        return `
          <div style="display:flex;align-items:center;gap:8px;padding:3px 0;opacity:${opacity};transition:opacity 150ms ease;">
            <span style="width:8px;height:8px;border-radius:50%;background:${seriesColor};flex-shrink:0;"></span>
            <span style="font-family:'Peyda',sans-serif;font-size:12px;color:${mutedColor};flex:1;">${s.name ?? ''}</span>
            <span style="font-family:'Peyda',sans-serif;font-size:13px;font-weight:${weight};color:${textColor};font-variant-numeric:tabular-nums;">${formattedVal}</span>
          </div>`;
      }).join('');

      return `
        <div style="
          background:${bg};
          backdrop-filter:blur(14px) saturate(160%);
          -webkit-backdrop-filter:blur(14px) saturate(160%);
          border:1px solid ${border};
          border-radius:8px;
          box-shadow:${shadow};
          padding:0;
          min-width:160px;
          overflow:hidden;
          font-family:'Peyda',sans-serif;
        ">
          ${formattedX ? `
          <div style="
            background:${titleBg};
            border-bottom:1px solid ${titleBorder};
            padding:6px 12px 5px;
            font-family:'Peyda',sans-serif;
            font-size:11px;
            font-weight:500;
            color:${mutedColor};
            letter-spacing:0.02em;
          ">${formattedX}</div>` : ''}
          <div style="padding:6px 12px;">
            ${rows}
          </div>
        </div>`;
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: theme.palette.mode,
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      gradientToColors: ['#29CCB1', '#29CCB1'],
    },
  },
  xaxis: {
    type: isTimeSeries ? 'datetime' : 'category',
    tickAmount,
    tickPlacement: 'on',
    labels: {
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
      style: {
        fontSize: '12px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => (yFormatter ? yFormatter(value) : value),
      style: {
        fontSize: '12px',
        fontFamily: '"Peyda", sans-serif',
        colors: ['#29CCB1'],
      },
    },
    axisBorder: {
      show: false,
    },
  },
  markers: {
    size: 0,
    hover: {
      size: 5,
      sizeOffset: 3,
    },
  },
});

/**
 * @param {Theme} theme
 * @param {function} xFormatter
 * @param {function} yFormatter
 * @param {boolean} distributed
 * @param {boolean} isTimeSeries
 * @param {boolean} isStacked
 * @param {boolean} legend
 * @param {number | 'dataPoints'} tickAmount
 */
export const verticalBarsChartOptions = (
  theme,
  xFormatter,
  yFormatter,
  distributed = false,
  isTimeSeries = false,
  isStacked = false,
  legend = false,
  tickAmount = undefined,
) => ({
  chart: {
    type: 'bar',
    background: theme.palette.background.secondary,
    toolbar: toolbarOptions,
    foreColor: theme.palette.text.secondary,
    stacked: isStacked,
    width: '100%',
    height: '100%',
  },
  theme: {
    mode: theme.palette.mode,
  },
  dataLabels: {
    enabled: false,
  },
  colors: [
    theme.palette.primary.main,
    ...colors(theme.palette.mode === 'dark' ? 400 : 600),
  ],
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  grid: {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .1)'
        : 'rgba(0, 0, 0, .1)',
    strokeDashArray: 3,
  },
  legend: {
    show: legend,
    itemMargin: {
      horizontal: 5,
      vertical: 20,
    },
  },
  tooltip: {
    theme: theme.palette.mode,
  },
  xaxis: {
    type: isTimeSeries ? 'datetime' : 'category',
    tickAmount,
    tickPlacement: 'on',
    labels: {
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
      style: {
        fontSize: '12px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => (yFormatter ? yFormatter(value) : value),
      style: {
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      barHeight: '30%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      distributed,
    },
  },
});

/**
 * @param {Theme} theme
 * @param {boolean} adjustTicks
 * @param {function} xFormatter
 * @param {function} yFormatter
 * @param {boolean} distributed
 * @param {function} navigate
 * @param {object[]} redirectionUtils
 * @param {boolean} stacked
 * @param {boolean} total
 * @param {string[]} categories
 * @param {boolean} legend
 * @param {string} stackType
 */
export const horizontalBarsChartOptions = (
  theme,
  adjustTicks = false,
  xFormatter = null,
  yFormatter = null,
  distributed = false,
  navigate = undefined,
  redirectionUtils = null,
  stacked = false,
  total = false,
  categories = null,
  legend = false,
  stackType = 'normal',
) => ({
  events: ['xAxisLabelClick'],
  chart: {
    type: 'bar',
    background: theme.palette.background.secondary,
    toolbar: toolbarOptions,
    foreColor: theme.palette.text.secondary,
    stacked,
    stackType,
    width: '100%',
    height: '100%',
    events: {
      xAxisLabelClick: (event, chartContext, config) => {
        if (redirectionUtils) {
          const { labelIndex } = config;
          if (redirectionUtils[labelIndex].name === 'Restricted') {
            return;
          }
          const entityType = redirectionUtils[labelIndex].entity_type;
          const link = resolveLink(entityType);
          if (link) {
            const entityId = redirectionUtils[labelIndex].id;
            handleNavigate(event, navigate, `${link}/${entityId}`);
          }
        }
      },
      mouseMove: (event, chartContext, config) => {
        const { dataPointIndex, seriesIndex } = config;
        if (redirectionUtils
          && (
            (dataPointIndex >= 0 // case click on a bar
              && (
                (seriesIndex >= 0 && redirectionUtils[dataPointIndex]?.series // case multi bars
                  && redirectionUtils[dataPointIndex].series[seriesIndex]?.entity_type
                  && resolveLink(redirectionUtils[dataPointIndex].series[seriesIndex]?.entity_type)
                )
                || (
                  !(seriesIndex >= 0 && redirectionUtils[dataPointIndex]?.series) // case not multi bars
                  && redirectionUtils[dataPointIndex]?.entity_type
                  && resolveLink(redirectionUtils[dataPointIndex].entity_type)
                )
              )
            )
            || event.target.parentNode.className.baseVal === 'apexcharts-text apexcharts-yaxis-label ' // case click on a label
          )
        ) {
          // for clickable parts of the graphs

          event.target.style.cursor = 'pointer';

          event.target.classList.add('noDrag');
        }
      },
      click: (event, chartContext, config) => {
        if (redirectionUtils) {
          const { dataPointIndex, seriesIndex } = config;
          if (dataPointIndex >= 0) {
            // click on a bar
            if (
              seriesIndex >= 0
              && redirectionUtils[dataPointIndex].series
            ) {
              // for multi horizontal bars representing entities
              if (redirectionUtils[dataPointIndex].series[seriesIndex]?.entity_type) {
                // for series representing a single entity
                const link = resolveLink(redirectionUtils[dataPointIndex].series[seriesIndex].entity_type);
                if (link) {
                  const entityId = redirectionUtils[dataPointIndex].series[seriesIndex].id;
                  handleNavigate(event, navigate, `${link}/${entityId}`);
                }
              }
            } else {
              if (redirectionUtils[dataPointIndex].name === 'Restricted') {
                return;
              }
              const link = resolveLink(redirectionUtils[dataPointIndex].entity_type);
              if (link) {
                const entityId = redirectionUtils[dataPointIndex].id;
                handleNavigate(event, navigate, `${link}/${entityId}`);
              }
            }
          }
        }
      },
    },
  },
  theme: {
    mode: theme.palette.mode,
  },
  dataLabels: {
    enabled: stackType === '100%',
  },
  colors: [
    theme.palette.primary.main,
    ...colors(theme.palette.mode === 'dark' ? 400 : 600),
  ],
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  grid: {
    show: stackType !== '100%',
    borderColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.1)
        : alpha(theme.palette.common.black, 0.1),
    strokeDashArray: 3,
    padding: {
      right: 20,
    },
  },
  legend: {
    show: legend,
    showForSingleSeries: true,
    itemMargin: {
      horizontal: 5,
    },
  },
  tooltip: {
    theme: theme.palette.mode,
    x: {
      show: stackType !== '100%',
    },
  },
  xaxis: {
    categories: categories ?? [],
    labels: {
      show: stackType !== '100%',
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
      style: {
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: stackType !== '100%',
    },
    tickAmount: adjustTicks ? 1 : undefined,
  },
  yaxis: {
    show: stackType !== '100%',
    labels: {
      show: stackType !== '100%',
      formatter: (value) => (yFormatter ? yFormatter(value) : value),
      style: {
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '30%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      distributed,
      dataLabels: {
        total: {
          enabled: total,
          offsetX: 0,
          style: {
            fontSize: '13px',
            fontWeight: 900,
            fontFamily: '"Peyda", sans-serif',
          },
        },
      },
    },
  },
});

/**
 * @param {Theme} theme
 * @param {function} xFormatter
 * @param {string[]} labels
 * @param {string[]} chartColors
 * @param {boolean} legend
 * @param {string} background
 * @param {int} size
 * @param {function} handleClick
 */
export const radarChartOptions = (
  theme,
  labels,
  xFormatter = null,
  chartColors = [],
  legend = false,
  background = theme.palette.background.secondary,
  size = undefined,
  handleClick = undefined,
) => ({
  chart: {
    type: 'radar',
    background,
    toolbar: toolbarOptions,
    width: '100%',
    height: '100%',
    events: {
      click: () => handleClick(),
      markerClick: () => handleClick(),
    },
  },
  theme: {
    mode: theme.palette.mode,
  },
  labels,
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  legend: {
    show: legend,
    itemMargin: {
      horizontal: 5,
      vertical: 5,
    },
  },
  tooltip: {
    theme: theme.palette.mode,
    x: {
      formatter: (value) => value,
    },
  },
  fill: {
    opacity: 0.2,
    colors: [theme.palette.primary.main],
  },
  stroke: {
    show: true,
    width: 1,
    colors: [theme.palette.primary.main],
    dashArray: 0,
  },
  markers: {
    shape: 'circle',
    strokeColors: [theme.palette.primary.main],
    colors: [theme.palette.primary.main],
  },
  xaxis: {
    labels: {
      show: legend,
      formatter: (value) => truncate(value, 25),
      style: {
        fontFamily: '"Peyda", sans-serif',
        colors: chartColors,
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    labels: {
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
    },
  },
  plotOptions: {
    radar: {
      size,
      polygons: {
        strokeColors:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .1)'
            : 'rgba(0, 0, 0, .1)',
        connectorColors:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .1)'
            : 'rgba(0, 0, 0, .1)',
        fill: { colors: [theme.palette.background.secondary] },
      },
    },
  },
});

/**
 * @param {Theme} theme
 * @param {string[]} labels
 * @param {function} formatter
 * @param {string} legendPosition
 * @param {string[]} chartColors
 */
export const polarAreaChartOptions = (
  theme,
  labels,
  formatter = null,
  legendPosition = 'bottom',
  chartColors = [],
) => {
  const temp = theme.palette.mode === 'dark' ? 400 : 600;
  let chartFinalColors = chartColors;
  if (chartFinalColors.length === 0) {
    chartFinalColors = colors(temp);
    if (labels.length === 2 && labels[0] === 'true') {
      chartFinalColors = ['#17AB1F', '#F20F0F'];
    } else if (labels.length === 2 && labels[0] === 'false') {
      chartFinalColors = ['#F20F0F', '#17AB1F'];
    }
  }
  return {
    chart: {
      type: 'polarArea',
      background: theme.palette.background.secondary,
      toolbar: toolbarOptions,
      foreColor: theme.palette.text.secondary,
      width: '100%',
      height: '100%',
    },
    theme: {
      mode: theme.palette.mode,
    },
    colors: chartFinalColors,
    labels,
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.05,
        },
      },
    },
    legend: {
      show: true,
      position: legendPosition,
      floating: false,
      fontFamily: '"Peyda", sans-serif',
      markers: { strokeWidth: 0 },
    },
    tooltip: {
      theme: theme.palette.mode,
      custom: simpleLabelTooltip(theme),
    },
    fill: {
      opacity: 0.5,
    },
    yaxis: {
      labels: {
        formatter: (value) => (formatter ? formatter(value) : value),
        style: {
          fontFamily: '"Peyda", sans-serif',
        },
      },
      axisBorder: {
        show: false,
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, .1)'
              : 'rgba(0, 0, 0, .1)',
        },
        spokes: {
          strokeWidth: 1,
          connectorColors:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, .1)'
              : 'rgba(0, 0, 0, .1)',
        },
      },
    },
  };
};

/**
 * @param {Theme} theme
 * @param {string[]} labels
 * @param {string} legendPosition
 * @param {boolean} reversed
 * @param {string[]} chartColors
 * @param {boolean} displayLegend
 * @param {boolean} displayLabels
 * @param {boolean} displayValue
 * @param {boolean} displayTooltip
 * @param {number} size
 * @param {boolean} withBackground
 * @returns ApexOptions
 */
export const donutChartOptions = (
  theme,
  labels,
  legendPosition = 'bottom',
  reversed = false,
  chartColors = [],
  displayLegend = true,
  displayLabels = true,
  displayValue = true,
  displayTooltip = true,
  size = 70,
  withBackground = true,
) => {
  const temp = theme.palette.mode === 'dark' ? 400 : 600;
  let dataLabelsColors = labels.map(() => theme.palette.text.primary);
  if (chartColors.length > 0) {
    dataLabelsColors = chartColors.map((n) => (n === '#ffffff' ? '#000000' : theme.palette.text.primary));
  }
  let chartFinalColors = chartColors;
  if (chartFinalColors.length === 0) {
    chartFinalColors = colors(temp);
    if (labels.length === 2 && labels[0] === 'true') {
      if (reversed) {
        chartFinalColors = ['#F20F0F', '#17AB1F'];
      } else {
        chartFinalColors = ['#17AB1F', '#F20F0F'];
      }
    } else if (labels.length === 2 && labels[0] === 'false') {
      if (reversed) {
        chartFinalColors = ['#17AB1F', '#F20F0F'];
      } else {
        chartFinalColors = ['#F20F0F', '#17AB1F'];
      }
    }
  }
  return {
    chart: {
      type: 'donut',
      background: withBackground ? theme.palette.background.secondary : 'transparent',
      toolbar: toolbarOptions,
      foreColor: theme.palette.text.secondary,
      width: '100%',
      height: '100%',
    },
    theme: {
      mode: theme.palette.mode,
    },
    colors: chartFinalColors,
    labels,
    fill: {
      opacity: 1,
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.05,
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: [theme.palette.background.secondary],
    },
    tooltip: {
      enabled: displayTooltip,
      theme: theme.palette.mode,
      custom: simpleLabelTooltip(theme),
    },
    legend: {
      show: displayLegend,
      position: legendPosition,
      fontFamily: '"Peyda", sans-serif',
    },
    dataLabels: {
      enabled: displayLabels,
      style: {
        fontSize: '10px',
        fontFamily: '"Peyda", sans-serif',
        fontWeight: 600,
        colors: dataLabelsColors,
      },
      background: {
        enabled: false,
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          value: {
            show: displayValue,
          },
          background: theme.palette.background.secondary,
          size: `${size}%`,
        },
      },
    },
  };
};

/**
 *
 * @param {Theme} theme
 * @param {function} formatter
 * @param {string} legendPosition
 * @param {boolean} distributed
 */
export const treeMapOptions = (
  theme,
  formatter = null,
  legendPosition = 'bottom',
  distributed = false,
) => {
  return {
    chart: {
      type: 'treemap',
      background: theme.palette.background.secondary,
      toolbar: toolbarOptions,
      foreColor: theme.palette.text.secondary,
      width: '100%',
      height: '100%',
    },
    theme: {
      mode: theme.palette.mode,
    },
    colors: distributed
      ? colors(theme.palette.mode === 'dark' ? 400 : 600).filter((c) => !isColorCloseToWhite(c))
      : [theme.palette.primary.main, ...colors(theme.palette.mode === 'dark' ? 400 : 600)],
    fill: {
      opacity: 1,
    },
    yaxis: {
      labels: {
        formatter: (value) => (formatter ? formatter(value) : value),
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.05,
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: [theme.palette.background.secondary],
    },
    legend: {
      show: true,
      position: legendPosition,
      fontFamily: '"Peyda", sans-serif',
    },
    tooltip: {
      theme: theme.palette.mode,
    },
    dataLabels: {
      style: {
        fontFamily: '"Peyda", sans-serif',
        fontWeight: 600,
        colors: [theme.palette.text.primary, theme.palette.text.secondary],
      },
      background: {
        enabled: false,
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      treemap: {
        distributed,
      },
    },
  };
};

/**
 * @param {Theme} theme
 * @param {boolean} isTimeSeries
 * @param {function} xFormatter
 * @param {function} yFormatter
 * @param {number | 'dataPoints'} tickAmount
 * @param {boolean} isStacked
 * @param {object[]} ranges
 */
export const heatMapOptions = (
  theme,
  isTimeSeries = false,
  xFormatter = null,
  yFormatter = null,
  tickAmount = undefined,
  isStacked = false,
  ranges = [],
) => ({
  chart: {
    type: 'heatmap',
    background: theme.palette.background.secondary,
    toolbar: toolbarOptions,
    foreColor: theme.palette.text.secondary,
    stacked: isStacked,
  },
  theme: {
    mode: theme.palette.mode,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    colors: [theme.palette.background.secondary],
    width: 1,
  },
  states: {
    hover: {
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  grid: {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .1)'
        : 'rgba(0, 0, 0, .1)',
    strokeDashArray: 3,
  },
  legend: {
    show: false,
  },
  tooltip: {
    theme: theme.palette.mode,
  },
  xaxis: {
    type: isTimeSeries ? 'datetime' : 'category',
    tickAmount,
    tickPlacement: 'on',
    labels: {
      formatter: (value) => (xFormatter ? xFormatter(value) : value),
      style: {
        fontSize: '12px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => (yFormatter ? yFormatter(value) : value),
      style: {
        fontSize: '14px',
        fontFamily: '"Peyda", sans-serif',
      },
    },
    axisBorder: {
      show: false,
    },
  },
  plotOptions: {
    heatmap: {
      enableShades: false,
      distributed: false,
      colorScale: {
        ranges,
      },
    },
  },
});
