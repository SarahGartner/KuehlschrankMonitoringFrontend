import { Component, } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Color } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fridge-sensordata',
  templateUrl: './fridge-sensordata.component.html',
  styleUrls: ['./fridge-sensordata.component.scss']
})

export class FridgeSensordataComponent {
  url = `https://temperaturmonitoring-api.azurewebsites.net/`;
  id = "";
  sensordata = [];
  temp = [];
  hum = [];
  time = [];
  //Chart
  lineChartOptionsHum = {
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 100
        }
      }],
      xAxes: [{
        ticks: {
          display: true,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }]
    }
  };

  lineChartOptionsTemp = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          display: true,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }]
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(115, 160, 243)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';


  constructor(private _Activatedroute: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    const mac = { sensorMac: this.id };
    this.http.post(this.url + 'sensordata/ByMac', mac).toPromise().then(data => {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          this.time.push((data[key]['_id']['timestamp']).substring(0, 10) + " " + (data[key]['_id']['timestamp']).substring(11, 19));
          this.temp.push(data[key]['temperature']['$numberDecimal']);
          this.hum.push(data[key]['humidity']['$numberDecimal']);
          this.sensordata.push({
            time: (data[key]['_id']['timestamp']).substring(0, 10) + " " + (data[key]['_id']['timestamp']).substring(11, 19),
            temp: data[key]['temperature']['$numberDecimal'],
            hum: data[key]['humidity']['$numberDecimal']
          })
        }
      }
    });
  }

  pdf() {
    let pdf = new jspdf('p', 'cm', 'a4');
    pdf.text("Sensordaten zu Kühlgerät: " + this.id, 1.5, 2);
    autoTable(pdf, { html: '#table', startY: 3});
    pdf.save(this.id+'Sensordata.pdf');
  }

  setMac(){
    this.router.navigate(['/einzelansicht/' + (<HTMLInputElement>document.getElementById('mac')).value]);
  }
}
