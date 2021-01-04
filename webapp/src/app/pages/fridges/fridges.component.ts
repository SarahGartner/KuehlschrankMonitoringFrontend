import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';
// import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-fridges',
  templateUrl: './fridges.component.html',
  styleUrls: ['./fridges.component.scss']
})
export class FridgesComponent implements OnInit {
  url = `https://kuehlschrankmonitoringapi.azurewebsites.net/`;
  fridgeNames = [];
  userId = { userId: 3 };
  constructor(private http: HttpClient) {
    this.http.post(this.url + 'fridges/ByUser', this.userId).toPromise().then(data => {
      console.log(data);
      for (let key in data)
        if (data.hasOwnProperty(key)) {
          const fridge = {
            name: data[key]['name'],
            configured: data[key]['name'] != null ? true : false,
            open: false,
            mac: data[key]['_id'],
            fridgeId: data[key]['fridgeId'],
            minTemp: data[key]['minTemperature']['$numberDecimal'],
            maxTemp: data[key]['maxTemperature']['$numberDecimal'],
            minHum: data[key]['minHumidity']['$numberDecimal'],
            maxHum: data[key]['maxHumidity']['$numberDecimal']
          }
          this.fridgeNames.push(fridge);
        }
    })
    console.log(this.fridgeNames);
  }

  ngOnInit() {
  }

}
