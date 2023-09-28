import { Component, OnInit } from '@angular/core';
import { faChevronUp, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SalaryModalComponent } from './salary-modal/salary-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { DatePipe } from '@angular/common';

interface GroupedSalaries {
  [month: string]: any[];
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})

export class SalaryComponent implements OnInit {

  showBackTop: string = ''
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  salaries: any[] = [];
  filteredSalaries: any[] = [];
  limit: number = 70;

  lunaSearch: string = '';
  denumireSearch: any;
  clasificatieSearch: any;
  dataObligatieSearch: any;
  dataAvansSearch: any;
  dataViramentSearch: any;
  dataNumerarSearch: any;
  dataContributiiSearch: any;

  groupedSalaries: GroupedSalaries = {};

  constructor(private datePipe: DatePipe, private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._spinner.show();
    axios.get('/api/salary').then(({ data }) => {

      this.salaries = data;
      this.filteredSalaries = data;
      this.groupedSalaries = this.groupSalariesByMonth(this.filteredSalaries);

      this._spinner.hide();

    }).then(() => console.log("salaries: ", this.salaries))
      .catch(() => this.toastr.error('Eroare la preluarea salariilor din baza de date!'));
  }

  groupSalariesByMonth(salaries: any[]): { [month: string]: any[] } {
    return salaries.reduce((acc, salary) => {
      const month = salary.month;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(salary);
      return acc;
    }, {});
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  getGroupedSalariesKeys(): string[] {
    return Object.keys(this.groupedSalaries);
  }

  addEdit = (id_salary?: number): void => {

    const modalRef = this._modal.open(SalaryModalComponent, { size: 'xl', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.id_salary = id_salary;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
    console.log("Add/Edit Function ...")
  }

  delete = (salary: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, { size: 'xl', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = `Ștergere salariu`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți salariul având numele: <b>${salary.name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/salary/${salary.id}`).then(() => {

        this.toastr.success('Salariul a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea salariului!'));
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-salary')[0].scrollTop > 500) {
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
    SCROLL_TOP('view-scroll-salary', 0);
    this.limit = 70;
    console.log("onScrollTop Function ...")

  }


  filterData(): void {

    this.filteredSalaries = this.salaries.filter((salary:
      {
        month: string;
        name : string;
        id_activity: number| undefined; 
        obligation_date: string;
        advances_date: string;
        date: string;
        cash_date: string;
        contributions_date: string;

      }) => {

      const lunaMatch = !this.lunaSearch || (salary.month && salary.month.toLowerCase().includes(this.lunaSearch.toLowerCase()));
      const denumireMatch = !this.denumireSearch || (salary.name && salary.name.toLowerCase().includes(this.denumireSearch.toLowerCase()));
      const clasificatieMatch = !this.clasificatieSearch || salary.id_activity?.toString().includes(this.clasificatieSearch);
      const dataObligatieMatch = !this.dataObligatieSearch || (salary.obligation_date && salary.obligation_date.toLowerCase().includes(this.dataObligatieSearch.toLowerCase()));

      const dataAvansMatch = !this.dataAvansSearch || (salary.advances_date && salary.advances_date.toLowerCase().includes(this.dataAvansSearch.toLowerCase()));
      
      const dataViramentMatch = !this.dataViramentSearch || (salary.date && salary.date.toLowerCase().includes(this.dataViramentSearch.toLowerCase()));
      const dataNumerarMatch = !this.dataNumerarSearch || (salary.cash_date && salary.cash_date.toLowerCase().includes(this.dataNumerarSearch.toLowerCase()));
      const dataContributiiMatch = !this.dataContributiiSearch || (salary.contributions_date && salary.contributions_date.toLowerCase().includes(this.dataContributiiSearch.toLowerCase()));

      return lunaMatch && denumireMatch && clasificatieMatch &&  dataObligatieMatch && dataViramentMatch && dataNumerarMatch && dataContributiiMatch && dataAvansMatch;
      
    });
  }

  onSearchChange(): void {
    this.filterData();
    this.groupedSalaries = this.groupSalariesByMonth(this.filteredSalaries);

  }
}
