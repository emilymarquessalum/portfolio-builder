import configuration from '../models/systemConfigurationsModel.js';
import languageConfigurations from './languageConfigurationsController.js';
import SystemConfigurationsView from '../view/systemConfigurationsView.js';
import mainController from "../classes/mainController.js";
import Controller from "../classes/controller.js";

class SystemConfigurationsController extends Controller<SystemConfigurationsView> {

    constructor() {

        super(SystemConfigurationsView, 50);  
       
    }

    startBehaviour() {
   
        this.buildSystemConfigurations();
        
    }

    buildSystemConfigurations() {

        let loadedConfigurations = this.attemptLoadConfigurations();

        if (!loadedConfigurations) {

            let systemConfigurationsHTML = this.view.template(configuration.getLanguageTranslations());
            
            let configurationsDiv = document.getElementById("configurations-div") as HTMLElement

            configurationsDiv.innerHTML = systemConfigurationsHTML;
            
            

            mainController.mainEventController.emit("startedConfigurations");

            this.view.listenForm(
                (event)=>{this.submitConfigurations(event)});
        
             
        }

    }


    attemptLoadConfigurations() {

        const savedSelectedLanguage =
            sessionStorage.getItem("language") || localStorage.getItem("language");

        if (!savedSelectedLanguage) {
            return false;
        }


        // load right away if page is completely loaded
        /* Note that this code is always the one that runs in the current version of the system, 
        but if we wanted to preload the loadCoonfigurations or something, the code would break
        Consider making some "dist" solution for this one?  */
        if(document.readyState === "complete") {

            this.loadConfigurations(savedSelectedLanguage);
            return true;
        }

        window.addEventListener("load", () => {
             
            this.loadConfigurations(savedSelectedLanguage);

        });

        return true;
    }

    private loadConfigurations(savedSelectedLanguage: string) {
        languageConfigurations.loadLanguage(savedSelectedLanguage, true);
        this.view.loadedConfigurations(true);

        mainController.mainEventController.emit("finishedConfigurations");
    }


    submitConfigurations(event: Event) {



        let selectedLanguage = languageConfigurations.getLanguage();

        let saveConfigurationsSelect = this.view.configurationForm.querySelector(
            "#configuration-form-save-select") as HTMLSelectElement;


        this.saveConfigurations(selectedLanguage,
            saveConfigurationsSelect);


        languageConfigurations.loadLanguage(selectedLanguage);

        this.view.loadedConfigurations(false);

        mainController.mainEventController.emit("finishedConfigurations");


  

    }
 

    saveConfigurations(selectedLanguage: string, saveConfigurationsSelect: HTMLSelectElement) {

        let saveOption = saveConfigurationsSelect.value;

        this.saveConfiguration("language", selectedLanguage, saveOption);

    }



    saveConfiguration(key: string, value: any, saveOption: string) {

        if (saveOption == "session") {
            sessionStorage.setItem(key, value);
            return;
        }

        if (saveOption == 'local') {
            localStorage.setItem(key, value);
            return;
        }
    }






}



const systemConfigurationsController = new SystemConfigurationsController();

