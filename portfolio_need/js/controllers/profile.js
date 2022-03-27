 
import { ProfileView } from "../view/profileView.js";

 
class ProfileController {


    constructor() {

        this.profileView = new ProfileView(this); 
 
    }

    buildProfile() {
    
        this.profileView.buildProfileFields();
    }
    
    listenProfileButton() {

       this.profileView.listenProfileButton(this.prettify.bind(this));

    }

    prettify() {

        this.prettifyProfile();
        this.profileView.hideRawElements();
        this.profileView.showHiddenFromRawElements();
    }


    addAgeToProfile() {

        const myAge = moment("26-11-2003", "DD-MM-YYYY").fromNow().substring(0, 2);
        
        this.profileView.addFieldToProfile("age", myAge);
        

    }


    

    prettifyProfile() {
        
        this.profileView.prettifyProfile();

       
    }


 
}

 

let profileController = new ProfileController();

profileController.addAgeToProfile();
profileController.buildProfile();
profileController.listenProfileButton();





