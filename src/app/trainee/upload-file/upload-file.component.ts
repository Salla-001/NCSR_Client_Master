import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { traineeService } from 'src/app/data-model/trainee.service';
import { traineeProfile } from 'src/app/data-model/trainee.entity';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  trnProfile!: traineeProfile;
  data!: any;
  trnArray: Array<object> = [];
  emailArray: Array<string> = [];
  arrayForDuplicate: Array<string> = [];
  buttonStatus: boolean = false;
  constructor(private trnService: traineeService) { }


  fileUpload(event: any) {
    console.log(event.target.files)
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      console.log(event)
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      console.log(workbook)

      this.data = workbook.SheetNames.reduce((initial: any, name: string) => {
        const sheet = workbook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log(this.data)
      this.data.Sheet1.forEach((trn: any) => {
        this.trnArray.push(trn);
        this.emailArray.push(trn['Email ID of Trainee'])
      })
      this.emailArray.forEach((email) => {
        console.log(email)
        this.findDuplicate(email);
  
      })
      console.log(this.data.Sheet1[0])
    }

    fileReader.readAsBinaryString(selectedFile);
  }



  findDuplicate(email: string) {
    this.trnService.getDuplicateProfile(email).subscribe(
      (result: any) => {
        if (result.status === 'pass' && result.data.length > 0) {
          console.log(typeof (result.data))
          console.log(result.data[0].email_ID)

          this.arrayForDuplicate.push(result.data[0].email_ID);
        }
        console.log(this.arrayForDuplicate.length)
      })

  }

  register() {  
    this.buttonStatus = true
    if (this.arrayForDuplicate.length > 0) {
      alert('Duplicate email id found!! please delete and reupload the document')
      return
    } else {
      if (this.trnArray.length > 0) {
        this.trnArray.forEach((trn:any)=>{
          this.trnProfile.name_of_the_trainee = trn['Name of the Student (LMS)'];
          this.trnProfile.email_ID = trn['Email ID of Trainee'];
          this.trnService.registerTrainee(this.trnProfile).subscribe(
            (res: any) => {
              console.log("this is response", res)
            }
          )
        })  

      } else {
           alert("Sheet should not be empty")
           return
      }
    }
    
  }
  ngOnInit(): void {
    this.trnProfile = new traineeProfile
    //this.getProfile()
    //this.findDuplicate('aaaa.com')
  }

  getProfile() {
    this.trnService.getAllTraineeProfiles().subscribe((data) => {
      console.log("this is data", data)
    })
  }

}
