$(document).ready(function () {
    if ($("#Chartmix").length) {
        var ctx = document.getElementById("Chartmix").getContext('2d');

        var gradient2 = ctx.createLinearGradient(0, 500, 100, 0);
        gradient2.addColorStop(0, 'rgba(89,124,149 , 0.2)');
        gradient2.addColorStop(1, 'rgba(140,214,246 , 1)');
        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontStyle = "600";
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["F&F", "Launch", "Tr Price Yr1", "Tr Price Yr2", "Tr Price Yr3"],
                datasets: [{
                        data: [1, 1.5, 1.5, 4.24, 7.2],
                        label: 'Data 1',
                        labels: ["100", "150", "150", "424", "720"],
                        pointBackgroundColor: "#fff",
                        backgroundColor: "rgba(255,255,255 , .1)",
                        pointBorderColor: "rgba(165,203,222 , 1)",
                        borderColor: [

                            'rgba(165,203,222 , 1)'

                        ],
                        borderWidth: 0,
                        pointBorderWidth: 3,
                        pointBackgroundColor: "rgba(91,95,106 , .5)"
                    },
                    {
                        data: [0, 0, 1.04, 12.74, 21.6],
                        label: 'Data 2',
                        labels: ["0", "0", "1,044,579", "12,741,031", "21,601,100"],
                        pointBackgroundColor: "#fff",
                        backgroundColor: "rgba(255,255,255 , .5)",
                        pointBorderColor: "rgba(255,0,30 , 1)",
                        borderColor: [

                            'rgba(255,0,30 , 1)'

                        ],
                        borderWidth: 0,
                        pointBorderWidth: 3,
                        pointBackgroundColor: "rgba(2,95,106 , .5)"
                    }
                ]
            },
            options: {
                responsive: true,
                responsiveAnimationDuration: 20,
                maintainAspectRatio: false,

                tooltips: {
                    enabled: true,
                    mode: 'single',
                    displayColors: false,
                    callbacks: {
                        label: function (item, data) {
                            var label = data.datasets[item.datasetIndex].labels[item.index];
                            var value = data.datasets[item.datasetIndex].data[item.index];
                            return "£ " + label;
                        }

                    }
                },
                elements: {
                    point: {
                        radius: 2,
                        hitRadius: 4,
                        hoverRadius: 4,
                    },

                },
                legend: {
                    display: false

                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            tickMarkLength: 0,
                            color: "rgb(0,0,0, .2)",
                            drawBorder: true,
                        },
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1,
                            min: 0,
                            max: 22,
                            padding: 10,
                            callback: function (value, index, values) {
                                if (value != 0) {
                                    return "£ " + value;
                                } else {
                                    return "£ " + value;
                                }

                            }

                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            color: "rgb(0,0,0, .2)",
                            drawBorder: true,
                        },

                        ticks: {
                            autoSkip: true,
                            stepSize: 1
                        },
                    }]
                }
            }
        });
        if ($(window).width() < 767)
            myChart.canvas.parentNode.style.height = '300px';
        else
            myChart.canvas.parentNode.style.height = '500px';
        $(window).resize(function () {
            if ($(window).width() < 767)
                myChart.canvas.parentNode.style.height = '300px';
            else
                myChart.canvas.parentNode.style.height = '500px';
        });
    }
});