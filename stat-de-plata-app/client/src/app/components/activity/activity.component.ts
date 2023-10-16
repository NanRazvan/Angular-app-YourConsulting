import { Component, OnInit } from '@angular/core';
import { faChevronUp, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivityModalComponent } from './activity-modal/activity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  showBackTop: string = ''
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  activities: any[] = [];
  filteredActivities: any[] = [];
  limit: number = 70;
  nameSearch: any;
  lastChildSearch: undefined;
  codeSearch: any;
  superiorSearch: any;



  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._spinner.show();
    axios.get('/api/activity').then(({ data }) => {

      this.activities = data;
      this.filteredActivities = data;

      this._spinner.hide();

    }).then(() => console.log("activities: ", this.activities))
      .catch(() => this.toastr.error('Eroare la preluarea activitatilor din baza de date!'));
  }

  addEdit = (id_activity?: number): void => {

    const modalRef = this._modal.open(ActivityModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.id_activity = id_activity;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
    console.log("Add/Edit Function ...")
  }


  delete = (activity: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = `Ștergere cheltuiala`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți activitatea având numele: <b>${activity.name}</b>?`;
    modalRef.closed.subscribe(() => {
      
      axios.get(`/api/salary/findActivity/${activity.id}`)
        .then(response => {
          const hasMatchingRecords = response.data; 
          if (hasMatchingRecords.length != 0) {
            this.toastr.warning('Nu puteți șterge activitatea deoarece există înregistrări legate de această activitate intr un stat de plata.');
          } else {
            axios.delete(`/api/activity/${activity.id}`)
              .then(() => {
                this.toastr.success('Activitatea a fost ștearsă cu succes!');
                this.loadData();
              })
              .catch(() => {
                this.toastr.error('Eroare la ștergerea activității!');
              });
          }
        })
        .catch(() => {
          this.toastr.error('Eroare la verificarea activității!');
        });
    });
  }
  

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-activity')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
    console.log("showTopButton Function ...")

  }
  onScrollDown(): void {
    this.limit += 20;
    console.log("onScrollDown Function ...")

  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-activity', 0);
    this.limit = 70;
    console.log("onScrollTop Function ...")

  }

  trueChecked: boolean = false;
  falseChecked: boolean = false;

  onCheckboxChange(checkedCheckbox: string): void {
    if (checkedCheckbox === 'true' && this.trueChecked) {

      this.falseChecked = false;
    }
    if (checkedCheckbox === 'false' && this.falseChecked) {

      this.trueChecked = false;
    }
    this.filterData();
  }



  filterData(): void {
    this.filteredActivities = this.activities.filter((activity: {
      name: string;
      code: string;
      last_child: boolean | undefined;
      id_superior: number | undefined;

    }) => {
      const idSuperiorMatch = !this.superiorSearch || activity.id_superior?.toString().includes(this.superiorSearch);

      const nameMatch = !this.nameSearch || activity.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const codeMatch = !this.codeSearch || activity.code.toLowerCase().includes(this.codeSearch.toLowerCase());
      const lastChildMatch = (this.trueChecked && activity.last_child === true) ||
        (this.falseChecked && activity.last_child === false) ||
        (!this.trueChecked && !this.falseChecked);

      return nameMatch && codeMatch && lastChildMatch && idSuperiorMatch;
    });
  }




  onSearchChange(): void {
    this.filterData();
  }
}
