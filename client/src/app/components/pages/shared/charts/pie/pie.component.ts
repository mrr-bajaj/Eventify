import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnChanges{
  chart: any;
  @ViewChild('pieChart', { static: true }) pieChart: ElementRef;
  @Input() pieData:{
    key:string[],
    value:number[]
  };
  ngOnChanges(changes: SimpleChanges) {
    if(changes['pieData']){
      setTimeout(()=>{this.renderChart();},1000)
    }
  }

  private renderChart() {
    if (this.pieData && this.pieChart && this.pieData.key.length === this.pieData.value.length) {
      const ctx = this.pieChart.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.pieData.key,
          datasets: [{
            data: this.pieData.value,
            backgroundColor: ['green', 'orange', 'blue']
          }]
        },
        options: {
          // Chart options and configurations
        }
      });
    }
  }
}
