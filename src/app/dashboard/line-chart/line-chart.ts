import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from "chart.js/auto";
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChartComponent implements AfterViewInit {

   usersService = inject(UsersService)


  @ViewChild('lineCanvas') lineCanvas!: {nativeElement: any};
  lineChart: any

  constructor() {
    Chart.register(...registerables);
  }


  ngAfterViewInit(): void {

    this.usersService.loadUsers()

    setTimeout(() => {
      this.createChart()
    }, 1000)
  }

  createChart(): void {
    const data = this.usersService.getNewUsersByMonth()
    const months = Object.keys(data)
    const counts = Object.values(data)



    const ctx = this.lineCanvas.nativeElement.getContext('2d')

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data:{
        labels: months,
        datasets: [
          {
            backgroundColor: '#6366f1',
            hoverBackgroundColor: '#4f46e5',
            data: counts,
            label: 'Núm. nuevos usuarios'
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
