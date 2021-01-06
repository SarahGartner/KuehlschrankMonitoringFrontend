import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fridges',
  templateUrl: './fridges.component.html',
  styleUrls: ['./fridges.component.scss']
})

export class FridgesComponent implements OnInit {
  url = `https://kuehlschrankmonitoringapi.azurewebsites.net/`;
  fridgeNames = [];
  userId = { userId: 201508 };

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
              fridgeId: data[key] != null && typeof data[key]['fridgeId'] !== 'undefined' ? data[key]['fridgeId'] : "",
              minTemp: data[key] != null && typeof data[key]['minTemperature'] !== 'undefined' ? data[key]['minTemperature']['$numberDecimal'] : "",
              maxTemp: data[key] != null && typeof data[key]['maxTemperature'] !== 'undefined' ? data[key]['maxTemperature']['$numberDecimal'] : "",
              minHum: data[key] != null && typeof data[key]['minHumidity'] !== 'undefined' ? data[key]['minHumidity']['$numberDecimal'] : "",
              maxHum: data[key] != null && typeof data[key]['maxHumidity'] !== 'undefined' ? data[key]['maxHumidity']['$numberDecimal'] : ""
            }
            this.fridgeNames.push(fridge);
            console.log("original befüllt");
          } catch (err) {
            console.log(err);
          }
        }
    })
  }

  ngOnInit() {
  }

  fridgeUpdate(item) {
    console.log("update");
    const name = (<HTMLInputElement>document.getElementById(item + '.name')).value;
    const fridgeId = (<HTMLInputElement>document.getElementById(item + '.fridgeId')).value;
    const minTemp = (<HTMLInputElement>document.getElementById(item + '.minTemp')).value;
    const maxTemp = (<HTMLInputElement>document.getElementById(item + '.maxTemp')).value;
    const minHum = (<HTMLInputElement>document.getElementById(item + '.minHum')).value;
    const maxHum = (<HTMLInputElement>document.getElementById(item + '.maxHum')).value;
    name != "" && (this.fridgeNames[item].name = name);
    fridgeId != "" && (this.fridgeNames[item].fridgeId = fridgeId);
    minTemp != "" && (this.fridgeNames[item].minTemp = minTemp);
    maxTemp != "" && (this.fridgeNames[item].maxTemp = maxTemp);
    minHum != "" && (this.fridgeNames[item].minHum = minHum);
    maxHum != "" && (this.fridgeNames[item].maxHum = maxHum);
    const kuehlschrank = {
      _id: this.fridgeNames[item]['mac'],
      name: this.fridgeNames[item].name,
      fridgeId: this.fridgeNames[item].fridgeId,
      minTemperature: this.fridgeNames[item].minTemp,
      maxTemperature: this.fridgeNames[item].maxTemp,
      minHumidity: this.fridgeNames[item].minHum,
      maxHumidity: this.fridgeNames[item].maxHum,
    }
    try{
    this.http.post(this.url + 'fridges/Update', kuehlschrank).toPromise().then(data => {
    });
  } catch (err){
    alert("Kühlschrank konnte nicht upgedated werden");
  }
  }
}
