import Chart from 'chart.js';
//
// Chart extension for making the bars rounded
// Code from: https://codepen.io/jedtrow/full/ygRYgo
//

Chart.elements.Rectangle.prototype.draw = function() {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 6;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [[left, bottom], [left, top], [right, top], [right, bottom]];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    // let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];
    // eslint-disable-next-line
    var radius: any = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

var mode = 'light';//(themeMode) ? themeMode : 'light';
var fonts = {
  base: 'Open Sans'
}

// Colors
var colors = {
  gray: {
    100: '#f6f9fc',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#8898aa',
    700: '#525f7f',
    800: '#32325d',
    900: '#212529'
  },
  theme: {
    'default': '#172b4d',
    'primary': '#5e72e4',
    'secondary': '#f4f5f7',
    'info': '#11cdef',
    'success': '#2dce89',
    'danger': '#f5365c',
    'warning': '#fb6340'
  },
  black: '#12263F',
  white: '#FFFFFF',
  transparent: 'transparent',
};

export function chartOptions() {

  // Options
  var options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: (mode == 'dark') ? colors.gray[700] : colors.gray[600],
        defaultFontColor: (mode == 'dark') ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16
          }
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme['primary']
          },
          line: {
            tension: .4,
            borderWidth: 4,
            borderColor: colors.theme['primary'],
            backgroundColor: colors.transparent,
            borderCapStyle: 'rounded'
          },
          rectangle: {
            backgroundColor: colors.theme['warning']
          },
          arc: {
            backgroundColor: colors.theme['primary'],
            borderColor: (mode == 'dark') ? colors.gray[800] : colors.white,
            borderWidth: 4
          }
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false,
        }
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function(chart) {
          var data = chart.data;
          var content = '';

          data.labels.forEach(function(label, index) {
            var bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content += '<i class="chart-legend-indicator" style="background-color: ' + bgColor + '"></i>';
            content += label;
            content += '</span>';
          });

          return content;
        }
      }
    }
  }

  // yAxes
  Chart.scaleService.updateScaleDefaults('linear', {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: (mode == 'dark') ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 0,
      zeroLineWidth: 0,
      zeroLineColor: (mode == 'dark') ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2]
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function(value) {
        if (!(value % 10)) {
          return value
        }
      }
    }
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults('category', {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false
    },
    ticks: {
      padding: 20
    },
    maxBarThickness: 10
  });

  return options;

}

export const parseOptions = (parent, options) => {
		for (var item in options) {
			if (typeof options[item] !== 'object') {
				parent[item] = options[item];
			} else {
				parseOptions(parent[item], options[item]);
			}
		}
	}

  export const chartPercentData = {
    options: {
      scales: {
        yAxes: [{
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900]
          },
          ticks: {
            callback: function(value) {
              if (!(value % 10)) {
                return '' + value + '%';
              }
            }
          }
        }]
      },
      stacked: true
    },
    data: {
      labels: ['20AE','20AH','20K5','20YR','20YS','4368','4705'],
      datasets: [{
          // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
          label: '% Pago/Emp 2019',
          data: [100, 100, 0, 100, 0, 100],
          backgroundColor: [
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
          ],
          borderColor: [
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
            'rgba(05, 63, 91, 1)',
          ],
          borderWidth: 1
        }
      ]
    }
  }  

export const chartExample1 = {
  options: {
    scales: {
      yAxes: [{
        gridLines: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900]
        },
        ticks: {
          callback: function(value) {
            if (!(value % 10) && value > 0) {
              return 'R$ ' + Math.round(value/1000) + 'k';
            }
          }
        }
      }]
    },
    stacked: true
  },
  data: {
    labels: ['20AE','20AH','20K5','20YR','20YS','4368','4705'],
    datasets: [{
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Dotação Atualizada',
        data: [1810000000, 88728508, 0, 2040000000, 562353000, 333000000, 5535000000],
        backgroundColor: [
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
          'rgba(05, 63, 91, 0.3)',
        ],
        borderColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20AH - Organização dos serviços de assistência farmacêutica no SUS
        label: 'Empenhado',
        data: [504282824.58, 0, 0, 586211380.38, 140702249.16, 21468296.91, 1752881924.67],
        backgroundColor: [
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
          'rgba(88, 82, 139, 0.3)',
        ],
        borderColor: [
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20K5 - Apoio ao uso de plantas medicinais e fitoterápicos no SUS
        label: 'Liquidado',
        data: [385928659.66, 0, 0, 586125835.98, 140697803.39, 21468296.91, 298213837.88],
        backgroundColor: [
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
          'rgba(186, 83, 143, 0.3)',
        ],
        borderColor: [
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
          'rgba(186, 83, 143, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20YR - Manutenção e funcionamento do programa de farmácia popular no Brasil pelo sistema de gratuidade
        label: 'Pago',
        data: [385928659.66, 0, 0, 586125835.98, 140697803.39, 21468296.91, 247413593.42],
        backgroundColor: [
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
          'rgba(252, 100, 101, 0.3)',
        ],
        borderColor: [
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
          'rgba(252, 100, 101, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20YS - Manutenção e funcionamento do programa de farmácia popular no Brasil pelo sistema de co-pagamento
        label: 'Disponível',
        data: [1305717175.42, 88728508, 0, 1445789218.62, 421650750.84, 239770445.76, 3490720529.31],
        backgroundColor: [
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
          'rgba(251, 99, 64, 0.3)',
        ],
        borderColor: [
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
          'rgba(251, 99, 64, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20YS - Manutenção e funcionamento do programa de farmácia popular no Brasil pelo sistema de co-pagamento
        label: 'RAP Acumulado',
        data: [1305717175.42, 88728508, 0, 1445789218.62, 421650750.84, 239770445.76, 3490720529.31],
        backgroundColor: [
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
          'rgba(253, 165, 40, 0.3)',
        ],
        borderColor: [
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
        ],
        borderWidth: 1
      },
    ]
  }
}

export const chartCommittedPercentageData = {
  options: {
    scales: {
      yAxes: [{
        gridLines: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900]
        },
        ticks: {
          callback: function(value) {
            if (!(value % 10)) {
              return '' + value + '%';
            }
          }
        }
      }]
    },
    stacked: true
  },
  data: {
    labels: ['20AE','20AH','20K5','20YR','20YS','4368','4705'],
    datasets: [{
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: '% Empenhado',
        data: [44.59, 33.48, 0, 68.58, 58.31, 0, 3.95],
        backgroundColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

export const chartCommittedHistoryData = {
  options: {
    scales: {
      yAxes: [{
        gridLines: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900]
        },
        ticks: {
          callback: function(value) {
            if (!(value % 10)) {
              return '$' + value + 'k';
            }
          }
        }
      }]
    },
    stacked: true
  },
  data: {
    labels: ['20AE','20AH','20K5','20YR','20YS','4368','4705'],
    datasets: [{
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Empenhado 2019',
        data: [640108729.68, 29701948.00, 0, 1399025416.94, 327917322.01, 0, 215061077.87],
        backgroundColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Empenhado 2018',
        data: [550108729.68, 12701948.00, 0, 999025416.94, 256817322.01, 0, 365061077.87],
        backgroundColor: [
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
        ],
        borderColor: [
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Empenhado 2017',
        data: [218108729.68, 33701948.00, 0, 1119025416.94, 126917322.01, 0, 155061077.87],
        backgroundColor: [
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
        ],
        borderColor: [
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

export const chartCommittedEvolutionData = {
  options: {
    scales: {
      yAxes: [{
        gridLines: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900]
        },
        ticks: {
          callback: function(value) {
            if (!(value % 10)) {
              return '$' + value + 'k';
            }
          }
        }
      }]
    },
    stacked: true
  },
  data: {
    labels: ['20AE','20AH','20K5','20YR','20YS','4368','4705'],
    datasets: [{
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Dotação 2019',
        data: [1435676100.25, 88728508.00, 0, 2040000000.00, 562353000.00, 330742306.14, 5443281270.99],
        backgroundColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderColor: [
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
          'rgba(05, 63, 91, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Dotação 2018',
        data: [550108729.68, 12701948.00, 0, 999025416.94, 256817322.01, 100100550, 365061077.87],
        backgroundColor: [
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
        ],
        borderColor: [
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
          'rgba(88, 82, 139, 1)',
        ],
        borderWidth: 1
      },
      {
        // 20AE - Promoção da assistência farmacêutica e insumos estratégicos na atenção basica em saúde
        label: 'Dotação 2017',
        data: [518108729.68, 22705548.00, 0, 160025416.94, 555557322.01, 0, 1122261077.87],
        backgroundColor: [
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
        ],
        borderColor: [
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
          'rgba(253, 165, 40, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

export const chartExample2 = {
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function(value) {
              if (!(value % 10)) {
                //return '$' + value + 'k'
                return value;
              }
            }
          },
          stacked: true
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: function(item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += yLabel;
          return content;
        }
      }
    }
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29]
      }
    ]
  }
}
