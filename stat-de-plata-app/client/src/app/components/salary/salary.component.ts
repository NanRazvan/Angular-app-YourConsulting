import { Component, OnInit } from '@angular/core';
import { faChevronUp, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { SalaryModalComponent } from './salary-modal/salary-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  showBackTop: string = ''
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  salary: any;
  filteredSalary: any;



  constructor(private _modal: NgbModal,private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._spinner.show();
    axios.get('/api/salary').then(({ data }) => {

      this.salary = data;
      this.filteredSalary = data; 
      
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea cheltuieilor din baza de date!'));
  }
  
  addEdit = (id_outgoing?: number): void => { 

    // const modalRef = this._modal.open(SalaryModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    // modalRef.componentInstance.id_cars = id_outgoing;
    // modalRef.closed.subscribe(() => {
    //   this.loadData();
    // });
    // console.log("Add/Edit Function ...")
  }

  showTopButton(): void {
    // if (document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500) {
    //   this.showBackTop = 'show';
    // } else {
    //   this.showBackTop = '';
    // }
    console.log("showTopButton Function ...")

  }
  onScrollDown(): void {
    // this.limit += 20;
    console.log("onScrollDown Function ...")

  }

  onScrollTop(): void {
    // SCROLL_TOP('view-scroll-cars', 0);
    // this.limit = 70;
    console.log("onScrollTop Function ...")

  }

}
