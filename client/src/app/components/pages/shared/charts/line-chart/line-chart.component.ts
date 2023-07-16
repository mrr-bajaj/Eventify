import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit{
  chart: any;
	@Input() registeredData : {
    label:string,
    y: number
  }[] = [];
  @Input() attendedData : {
    label:string,
    y: number
  }[] = [];
  chartOptions = {};
  ngOnInit(){
    //TOFIX
      setTimeout(()=>{
        this.chartOptions = {
          animationEnabled: true,
          theme: "light2",
          title:{
          text: "Attendance vs Registration"
          },
          axisX:{
          valueFormatString: "string"
          },
          axisY: {
          title: "Number of Employees"
          },
          toolTip: {
          shared: true
          },
          legend: {
          cursor: "pointer",
          itemclick: function (e: any) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            } 
            e.chart.render();
          }
          },
          data: [{
          type: "line",
          showInLegend: true,
          name: "Registration",
          dataPoints: this.registeredData
          }, {
          type: "line",
          showInLegend: true,
          name: "Attendance",
          dataPoints: this.attendedData
          }]
        }
      },1000);
  }
}
