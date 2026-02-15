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
              '#2b34d9', '#1a65f0', '#75a0f0', '#a1bced',
              '#cbd9f2', '#ebcee5', '#f0c5eb', '#f08be6',
              '#f25cf5', '#f02edc'
            ],

            data: counts,
          }
        ]
      },

      plugins: [
    {
      id: 'legendMargin',
      beforeInit: function(chart) {
        const originalFit = chart.legend!.fit;

        chart.legend!.fit = function fit() {

          originalFit.bind(chart.legend)();

          this.height += 60;
        }
      }
    }
  ],
      options: {
        responsive: true,
        layout: {
          padding: {
            top: 20,

          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { family: 'sans-serif', size: 12 },
              padding: 20,
            },
    },
        }

      }
    })
  }
}
