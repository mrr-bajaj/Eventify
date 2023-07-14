import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit,
OnChanges, 
OnDestroy{
  chart: any;
  @ViewChild('pieChart', { static: true }) pieChart: ElementRef;
  @Input() pieData:{
    key:string[],
    value:number[]
  };

  constructor(private eventsService: EventsService){}
//HACK -- TOFIX
  ngOnInit(): void {
    this.eventsService.getPieDataEvent().subscribe(data => {
        this.destroyChart();
        this.renderChart();
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['pieData']){
      setTimeout(()=>{
        this.destroyChart();
        this.renderChart();
      },500)
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

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }
}
