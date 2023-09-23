import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-config-modal',
  templateUrl: './salary-config-modal.component.html',
  styleUrls: ['./salary-config-modal.component.scss']
})
export class SalaryConfigModalComponent implements OnInit {
  @Input() id_salaryConfig: number | undefined;
  modal = {} as any;

  salaryItems: string[] = [
    "Drepturi salariale in bani",
    "Retineri asigurati",
    "Alte retineri salariale",
    "Rest de plata - virament",
    "Carduri",
    "Rest de plata - in numerar",
    "Drepturi salariale in natura",
    "Contributii angajator"
  ];

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }


  ngOnInit(): void {

    if (this.id_salaryConfig) {

      this.loadDataById();

    }
    console.log("ngOnInit", this.modal);
  }

  loadDataById = (): void => {

    this._spinner.show();
    axios.get(`/api/salaryConfig/${this.id_salaryConfig}`).then(({ data }) => {
      this.modal = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea salary-configurilor in salary-config-modal!'));

  }

  postData = (): void => {
    axios.post('/api/salaryConfig', this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Salary-configul a fost salvată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea salary-configurilor in salary-config-modal!'));
  }

  updateData = (): void => {
    axios.put(`/api/salaryConfig`, this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Salary-configul a fost modificată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea cheltuielii in salary-config-modal!'));
  }

  save(): void {

    if (this.validate()) {
      this._spinner.show();

      if (this.id_salaryConfig) {
        this.updateData();
      }
      else {
        if (!this.modal.normal)
          this.modal.normal = false;

        if (!this.modal.total)
          this.modal.total = false;

        this.postData();
      }
      console.log("Datele urmatoare au fost salvate: ", this.modal);


    }
    else
      console.log("Datele nu au fost salvate");
  }

  validate = (): boolean => {

    if (!this.modal.name) {
      this.toastr.error('Campul Denumire este gol');
      return false;
    }
    if (!this.modal.category) {
      this.toastr.error('Selectati o categorie!');
      return false;
    }

    return true;
  }

}
