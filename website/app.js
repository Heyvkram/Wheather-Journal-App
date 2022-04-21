
class WeatherApp {
    constructor() {
        this.apiKey = "bf5896126169a699ba63a4fbf1e7672a"
        this.apiUrl = "https://api.openweathermap.org/data/2.5/weather?zip="
        this.dataStorage = null;
        this.newDate = null;
        this.warningState = null;

        this.init();
    }

    getDate() {
        let d = new Date();
        this.newDate = d.getMonth()+ 1 + '.'+ d.getDate()+'.'+ d.getFullYear();
    }

    setDOMRefereces() {
        this.entryDate = document.getElementById('date');
        this.temp = document.getElementById('temp');
        this.content = document.getElementById('content');
        this.feelings_container = document.getElementById('feelings_container');
        this.button = document.getElementById('generate');
        this.zipContainer = document.getElementById('zip_container');

    }

    createNewDOMElements() {
        this.feelings = document.createElement('textarea');
        this.feelings.className = "app__feelings-input";
        this.feelings.id = "feelings";
        this.feelings.placeholder = "Enter your feelings here";
        this.feelings.rows = "9";
        this.feelings.cols = "50";
        this.feelings_container.appendChild(this.feelings);
        this.zipCode = document.createElement('input');
        this.zipCode.type = 'text';
        this.zipCode.id = 'zip';
        this.zipCode.className = "app__zip_code-input";
        this.zipCode.placeholder = "enter zip code here";
        this.zipContainer.appendChild(this.zipCode);
    }

    setListeners() {
        this.button.addEventListener('click', (event) => {
            event.preventDefault();

            if ( !this.checkWarnings( { "case": "zip", "value": this.zipCode.value } ) ){
                this.requestWeatherData();        
            }
            
        });
    }

   checkWarnings (params) {

    if ( this.warningState ) {
        this.zipCode.classList.remove('app__zipcode--warning');
        this.zipContainer.removeChild(this.warningText);               
    }

        if ( (params.case == "zip" && params.value == "") || params.case == "api" ) {
            this.createWarningMessage(params.case);
            return true;
        } else {
            this.warningState = false;
            return false;
        }

    }

    createWarningMessage(warningCase) {

        this.warningState = true;
        this.zipCode.classList.add('app__zipcode--warning');
        this.warningText = document.createElement('span');
        this.warningText.className = 'app__zipcode--warning-text';
        this.zipContainer.appendChild(this.warningText);

        if ( warningCase == "zip") {
            this.warningText.innerText = 'You need to enter the zipcode';      
        } else if ( warningCase == "api") {
            this.warningText.innerText = "Couldn't get any data with the provided input";
        }
    }

    async getData(apiUrl) {
        let response = await fetch(apiUrl);
        try{
            this.serverResponse = await response.json()
            this.dataStorage = {
                temp: this.serverResponse.main.temp,
                date: this.newDate,
                content: this.feelings.value
            }
            await this.postDataToServer('/add', this.dataStorage);
            this.updateContent();
        }
        catch(error){
            console.log("error", error);
            this.checkWarnings({"case": "api"})
        }
    }

    async requestWeatherData() {
        let url = this.apiUrl + this.zipCode.value + ',us' + '&appid=' + this.apiKey;
        await this.getData(url); 
    }

    getTemperatureInCelsius(temp) {
        let celsius = (temp - 32) / 1.8;
        let floatComma = (celsius / 10).toFixed(2);
        return floatComma;
    }


    updateContent() {
        this.temp.innerHTML = this.getTemperatureInCelsius(Math.round(this.serverResponse.main.temp)) + ' Cº';
        this.entryDate.innerHTML = this.newDate;
        this.content.innerHTML = this.feelings.value;
    }

    async postDataToServer (url, data) {

        const response = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        try {
            const newData = await response.json();
            console.log(newData);
            return newData;
          }catch(error) {
          console.log("error", error);
          }
      }

    init() {
        this.setDOMRefereces();
        this.createNewDOMElements();
        this.getDate();
        this.setListeners();
    }
}

let weatherApp = new WeatherApp();