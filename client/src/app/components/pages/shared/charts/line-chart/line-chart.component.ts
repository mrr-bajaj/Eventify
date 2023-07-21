import { Component, Input, OnChanges, SimpleChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Chart} from 'chart.js';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit{
  chart: any;
  @ViewChild('lineChart', { static: true }) lineChart: ElementRef;
	@Input() registeredData : {
    label:string,
    y: number
  }[] = [];
  @Input() attendedData : {
    label:string,
    y: number
  }[] = [];
  // chartOptions = {};
  // ngOnInit(){
  //   //TOFIX
  //     setTimeout(()=>{
  //       this.chartOptions = {
  //         animationEnabled: true,
  //         theme: "light2",
  //         title:{
  //         text: "Attendance vs Registration"
  //         },
  //         axisX:{
  //         valueFormatString: "string"
  //         },
  //         axisY: {
  //         title: "Number of Employees"
  //         },
  //         toolTip: {
  //         shared: true
  //         },
  //         legend: {
  //         cursor: "pointer",
  //         itemclick: function (e: any) {
  //           if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
  //             e.dataSeries.visible = false;
  //           } else {
  //             e.dataSeries.visible = true;
  //           } 
  //           e.chart.render();
  //         }
  //         },
  //         data: [{
  //         type: "line",
  //         showInLegend: true,
  //         name: "Registration",
  //         dataPoints: this.registeredData
  //         }, {
  //         type: "line",
  //         showInLegend: true,
  //         name: "Attendance",
  //         dataPoints: this.attendedData
  //         }]
  //       }
  //     },1000);
  // }

  constructor(private eventsService: EventsService){}
  ngOnInit(): void {
    this.eventsService.getLineDataEvent().subscribe(data => {
        this.destroyChart();
        this.renderChart();
    });
  }

  private renderChart(){ 
    if (this.registeredData && this.attendedData && this.lineChart) {
      const ctx = this.lineChart.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.registeredData.map(data => data.label),
          datasets: [
            {
              label: 'Registration',
              data: this.registeredData.map(data => data.y),
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false
            },
            {
              label: 'Attendance',
              data: this.attendedData.map(data => data.y),
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false
            }
          ]
        },
        options : {
          scales: {
            y: {
              title: {
                display: true,
                text: 'Number Of Employees',
                font: {
                  size: 20
                }
              },
            },
            x:{
              title:{
                display : true,
                text: 'Events',
                font: {
                  size: 20
                }
              }
            }
          },
          plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 24
                    }
                }
            }
        }     
        }
      });
    }
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
