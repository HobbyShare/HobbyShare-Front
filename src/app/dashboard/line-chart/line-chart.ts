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
            text: 'New Users by Month'
          }
        }
      }
    })
  }


}
