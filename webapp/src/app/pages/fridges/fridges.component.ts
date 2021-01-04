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
      for (let key in data)
        if (data.hasOwnProperty(key)) {
          try {
            const fridge = {
              name: data[key] === null || typeof data[key]['name'] === 'undefined' ? "" : data[key]['name'],
              configured: data[key]['name'] == "" || data[key]['name'] == null || typeof data[key]['name'] === 'undefined' ? false : true,
              open: false,
              mac: data[key]['_id'],
              fridgeId: data[key] != null && typeof data[key]['fridegeId'] !== 'undefined' ? data[key]['fridgeId'] : "",
              minTemp: data[key] != null && typeof data[key]['minTemperature'] !== 'undefined' ? data[key]['minTemperature']['$numberDecimal'] : "",
              maxTemp: data[key] != null && typeof data[key]['maxTemperature'] !== 'undefined' ? data[key]['maxTemperature']['$numberDecimal'] : "",
              minHum: data[key] != null && typeof data[key]['minHumidity'] !== 'undefined' ? data[key]['minHumidity']['$numberDecimal'] : null,
              maxHum: data[key] != null && typeof data[key]['maxHumidity'] !== 'undefined' ?['maxHumidity']['$numberDecimal'] : null
            }
            this.fridgeNames.push(fridge);
          } catch (err) {
            console.log(err);
          }
        }
    })
    console.log(this.fridgeNames);
  }

  ngOnInit() {
  }

}
