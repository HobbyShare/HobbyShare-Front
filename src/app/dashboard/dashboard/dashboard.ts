import { Component } from '@angular/core';
import { PieChartComponent } from '../pie-chart/pie-chart';
import { BarChartComponent } from '../bar-chart/bar-chart';
import { LineChartComponent } from '../line-chart/line-chart';

@Component({
  selector: 'app-dashboard',
  imports: [PieChartComponent, BarChartComponent, LineChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
