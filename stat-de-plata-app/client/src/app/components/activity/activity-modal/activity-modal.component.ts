import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss']
})
export class ActivityModalComponent implements OnInit {
  @Input() id_activity: number | undefined;
  modal = {} as any;
  activitiesNotChild: any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.loadSuperiorNotLastChild();
    
    if (this.id_activity) {
      this.loadDataById();
    }
  }

  loadSuperiorNotLastChild = (): void => {
    
    this._spinner.show();
    axios.get(`/api/activity/findNotLastChild`).then(({ data }) => {
      
      this.activitiesNotChild = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea activitatilor last_child in outgoings-modal!'));
  }

  loadDataById = (): void => {

    this._spinner.show();
    axios.get(`/api/activity/${this.id_activity}`).then(({ data }) => {
      this.modal = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea activitatii in activity-modal!'));

  }

  postData = (): void => {
    axios.post('/api/activity', this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Cheltuiala a fost salvată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea activitatilor in activity-modal!'));
  }

  updateData = (): void => {
    axios.put(`/api/activity`, this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Cheltuiala a fost modificată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea activitatilor in activity-modal!'));
  }

  save(): void {

    if (this.validate()) {
      this._spinner.show();

      if (this.id_activity) {
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
    if (!this.modal.code) {
      this.toastr.error('Campul cod este gol');
      return false;
    }

    return true;
  }
}
