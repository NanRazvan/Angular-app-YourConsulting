import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-outgoings-modal',
  templateUrl: './outgoings-modal.component.html',
  styleUrls: ['./outgoings-modal.component.scss']
})
export class OutgoingsModalComponent implements OnInit {
  @Input() id_outgoing: number | undefined;
  modal = {} as any;
  outgoingsNotChild: any = [];

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {


    this.loadSuperiorNotLastChild();

    if (this.id_outgoing) {

      this.loadDataById();

    }
  }

  loadSuperiorNotLastChild = (): void => {
    
    this._spinner.show();
    axios.get(`/api/outgoings/findNotLastChild`).then(({ data }) => {
      this.outgoingsNotChild = data;

      this._spinner.hide();

    }).catch(() => this.toastr.error('Eroare la preluarea cheltuielilor in outgoings-modal!'));
  }
  

  loadDataById = (): void => {

    this._spinner.show();
    axios.get(`/api/outgoings/${this.id_outgoing}`).then(({ data }) => {
      this.modal = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea cheltuielilor in outgoings-modal!'));

  }

  postData = (): void => {
    axios.post('/api/outgoings', this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Cheltuiala a fost salvată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea cheltuielilor in outgoings-modal!'));
  }

  updateData = (): void => {
    axios.put(`/api/outgoings`, this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Cheltuiala a fost modificată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea cheltuielii in outgoings-modal!'));
  }

  save(): void {

    if (this.validate()) {
      this._spinner.show();

      if (this.id_outgoing) {
        this.updateData();
      }
      else {
        if (!this.modal.last_child)
          this.modal.last_child = false;

        this.postData();
      }
      console.log("Datele urmatoare au fost salvate: ", this.modal);


    }
    else
      console.log("Datele nu au fost salvate");
  }

  validate = (): boolean => {

    if (!this.modal.name) {
      this.toastr.error('Campul Nume este gol');
      return false;
    }
    if (!this.modal.paragraph) {
      this.toastr.error('Campul paragraf este gol');
      return false;
    }

    return true;
  }
}
