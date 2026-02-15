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
            backgroundColor: '#6366f1',
            hoverBackgroundColor: '#4f46e5',
            borderRadius: 6,
            data: counts,
            label: 'Núm. eventos'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio:false,
        plugins: {
      legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: { family: 'sans-serif', size: 12 },
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      titleFont: { family: 'sans-serif', size: 14 },
      bodyFont: { family: 'sans-serif', size: 13 },
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false,

      },
      ticks: {
        font: { family: 'sans-serif' },
        color: '#64748b'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9',

      },
      ticks: {
        font: { family: 'sans-serif' },
        color: '#64748b',
        maxTicksLimit: 5
      },
      border: { display: false }
    }
        }
      }
    })
  }

}
