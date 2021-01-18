import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { interval, timer, Subscription } from 'rxjs';
import { keyframes } from '@angular/animations';

@Component({
  selector: 'app-fridges',
  templateUrl: './fridges.component.html',
  styleUrls: ['./fridges.component.scss']
})


export class FridgesComponent implements OnInit {
  url = `https://kuehlschrankmonitoringapi.azurewebsites.net/`;
  // url = 'http://localhost:3000/';
  fridgeNames = [];
  sensordata = [];
  sensordataFilter = [];
  singleData = [];
  user = "";
  subscription: Subscription;
  bot = false;


  constructor(private http: HttpClient) {

  }


  ngOnInit() {
    const source = interval(20000);
    // this.subscription = source.subscribe(val => this.getData());

    var input = document.getElementById("selectUser");
    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("okButton").click();
      }
    });
  }

  setUser() {
    this.fridgeNames = [];
    this.user = (<HTMLInputElement>document.getElementById('selectUser')).value;
    const userId = {
      userId: this.user
    }

    try {
      this.http.post(this.url + 'users/ById', userId).toPromise().then(data => {
        if (data[0] == undefined) {
          alert("User " + this.user + " nicht gefunden!");
          this.user = "";
        }
        for (let key in data)
          if (data.hasOwnProperty(key)) {
            if (data[key]['telegramId'] != 0) this.bot = true;
            else this.bot = false;
            this.http.post(this.url + 'fridges/ByUser', userId).toPromise().then(data => {
              for (let key in data)
                if (data.hasOwnProperty(key)) {
                  try {
                    const fridge = {
                      name: data[key] === null || typeof data[key]['name'] === 'undefined' ? "" : data[key]['name'],
                      configured: data[key]['name'] == "" || data[key]['name'] == null || typeof data[key]['name'] === 'undefined' ? false : true,
                      openConfig: false,
                      openData: false,
                      mac: data[key]['_id'],
                      tempOk: data[key]['tempOK'],
                      humOk: data[key]['humOK'],
                      fridgeId: data[key] != null && typeof data[key]['fridgeId'] !== 'undefined' ? data[key]['fridgeId'] : "",
                      minTemp: data[key] != null && typeof data[key]['minTemperature'] !== 'undefined' ? data[key]['minTemperature']['$numberDecimal'] : 0,
                      maxTemp: data[key] != null && typeof data[key]['maxTemperature'] !== 'undefined' ? data[key]['maxTemperature']['$numberDecimal'] : 0,
                      minHum: data[key] != null && typeof data[key]['minHumidity'] !== 'undefined' ? data[key]['minHumidity']['$numberDecimal'] : 0,
                      maxHum: data[key] != null && typeof data[key]['maxHumidity'] !== 'undefined' ? data[key]['maxHumidity']['$numberDecimal'] : 0
                    }
                    this.fridgeNames.push(fridge);
                  } catch (err) {
                  }
                }
            })
          }
      });

    } catch (err) {
      alert("Fehler: Datenbank nicht erreichbar.");
    }
  }

  fridgeUpdate(item) {
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
    try {
      this.http.post(this.url + 'fridges/Update', kuehlschrank).toPromise().then(data => {
        alert("Kühlschrank bearbeitet");
        this.setUser();
      });
    } catch (err) {
      alert("Fehler: Kühlschrank konnte nicht upgedated werden");
    }
  }

  showData(item) {
    this.getData();
    this.fridgeNames[item].openData = !this.fridgeNames[item].openData;
    this.fridgeNames[item].openConfig = false;
  }

  filter(item) {
    const von = (<HTMLInputElement>document.getElementById(item + ".von")).value + 'T00:00:00.000Z';
    const bis = (<HTMLInputElement>document.getElementById(item + ".bis")).value + 'T23:59:59.000Z';
    this.sensordataFilter[item] = [];
    this.sensordata[item].forEach(e => {
      if (e['timestampFull'] >= von && e['timestampFull'] <= bis) {
        this.sensordataFilter[item].push(e);
      }
    });
    console.log(this.sensordataFilter[item]);
  }

  getData() {
    this.sensordata = [];
    this.sensordataFilter = [];
    this.fridgeNames.forEach(e => {
      try {
        const mac = { sensorMac: e.mac };
        this.http.post(this.url + 'sensordata/ByMac', mac).toPromise().then(data => {
          var fridgesensordata = [];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              var time = (data[key]['_id']['timestamp']).substring(0, 10) + " " + (data[key]['_id']['timestamp']).substring(11, 19);
              const singleSensordata = {
                timestamp: time,
                day: (data[key]['_id']['timestamp']).substring(0, 10),
                timestampFull: data[key]['_id']['timestamp'],
                temp: data[key]['temperature']['$numberDecimal'],
                hum: data[key]['humidity']['$numberDecimal']
              }
              fridgesensordata.push(singleSensordata);
            }
          }
          this.sensordata.push(JSON.parse(JSON.stringify(fridgesensordata)));
          this.sensordataFilter.push(JSON.parse(JSON.stringify(fridgesensordata)));
        });
      } catch (err) {
        alert("Fehler: Datenbank konnte nicht erreicht werden");
      }
    })
  }

  deleteFridge(macAdresse) {
    var conf = confirm("Kühlgerät wirklich löschen? Du kannst denSchritt nicht rückgängig machen.");
    if (conf) {
      try {
        const mac = { _id: macAdresse };
        this.http.post(this.url + 'fridges/DeleteById', mac).toPromise().then(data => {
          alert("Kühlschrank gelöscht");
          this.setUser();
        });
      } catch (err) {
        alert("Fehler: Datenbank konnte nicht erreicht werden");
      }
    }
  }
}
