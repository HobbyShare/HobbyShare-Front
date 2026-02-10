import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from "chart.js/auto";
import { EventsService } from '../../core/services/events.service';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChartComponent implements AfterViewInit {

  eventsService = inject(EventsService)


  @ViewChild('barCanvas') barCanvas!: {nativeElement: any};
  barChart: any

  constructor() {
    Chart.register(...registerables);
  }


  ngAfterViewInit(): void {

    this.eventsService.loadEvents()

    setTimeout(() => {
      this.createChart()
    }, 1000)
  }

  createChart(): void {
    const data = this.eventsService.getEventsByMonth()
    const months = Object.keys(data)
    const counts = Object.values(data)



    const ctx = this.barCanvas.nativeElement.getContext('2d')

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data:{
        labels: months,
        datasets: [
          {
            backgroundColor: [
              '#3498db'
            ],

            data: counts,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Events per Month'
          }
        }
      }
    })
  }

}
