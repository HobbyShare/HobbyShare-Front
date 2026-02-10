import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from "chart.js/auto";
import { EventsService } from '../../core/services/events.service';
@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css',
})
export class PieChartComponent implements AfterViewInit {

  eventsService = inject(EventsService)


  @ViewChild('pieCanvas') pieCanvas!: {nativeElement: any};
  pieChart: any

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
    const data = this.eventsService.getEventsByHobby()
    const hobbies = Object.keys(data)
    const counts = Object.values(data)



    const ctx = this.pieCanvas.nativeElement.getContext('2d')

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data:{
        labels: hobbies,
        datasets: [
          {
            backgroundColor: [
              '#3498db', '#e74c3c', '#2ecc71',
              '#f39c12', '#9b59b6', '#1abc9c',
              '#e67e22', '#34495e'
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
            text: 'Events per Hobby'
          }
        }
      }
    })
  }
}
