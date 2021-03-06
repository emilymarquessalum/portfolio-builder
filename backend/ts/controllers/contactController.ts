import ContactView from "../view/contactView.js";
import popupView from "../view/popupView.js";
import Controller from "../classes/controller.js";

class ContactController extends Controller<ContactView>{
 
  constructor() {
    super(ContactView, 3000);
     
  }
 
  startBehaviour(): void {
    this.listenContacts(); 
  }
 
  sendEmail(event: Event, data: FormData) {

    if (!this.submitInfoValidated(data)) {

      return;
    }


    this.view.emailSent();
 

    fetch("https://formspree.io/f/mdobzrbv", {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        popupView.makePopup("email_sent", "thank_you");

      } else {
        response.json().then(data => {
          if (data.hasOwnProperty('errors')) {
            popupView.makePopup("oh_no", "email_not_sent");
          }


        })
      }
    }).catch(error => {
      popupView.makePopup("oh_no", "email_not_sent");
      throw error;
    });

    return false;
  }




  submitInfoValidated(submitInfo: FormData) {

    let name = submitInfo.get('name') as string | undefined;
    
    if(name === undefined) {
      throw new Error("name is undefined");
    }
    
    if (name.length < 3) {
      popupView.makePopup("name_problem", "short_name");
      return false;
    }

    let email = submitInfo.get('email') as string | undefined;

    if (email === undefined) {
      throw new Error("email is undefined");
    }

    if (!this.validateEmail(email)) {
      popupView.makePopup("email_problem", "bad_email");
      return false;
    }


    return true;
  }


  listenContacts() {

    this.view.listenForContactForm(
      (event, submitInfo)=>{
        this.sendEmail(event, submitInfo)
      });

  }

  validateEmail(emailAdress: string) {
    let regexEmail = /^\S+@\S+\.\S+$/;
    if (emailAdress.match(regexEmail)) {
      return true;
    } else {
      return false;
    }
  }

}


let contactController = new ContactController();
 
