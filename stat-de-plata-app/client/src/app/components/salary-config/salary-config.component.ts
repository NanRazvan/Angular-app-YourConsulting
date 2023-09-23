import { Component, OnInit } from '@angular/core';
import { faChevronUp, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SalaryConfigModalComponent } from './salary-config-modal/salary-config-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';

@Component({
  selector: 'app-salary-config',
  templateUrl: './salary-config.component.html',
  styleUrls: ['./salary-config.component.scss']
})
export class SalaryConfigComponent implements OnInit {

  showBackTop: string = ''
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  salaryConfigs: any[] = [];
  filteredSalaryConfigs: any[] = [];
  limit: number = 70;
  
  nameSearch: any;


  normalSearch: undefined;
  totalSearch: undefined;
  categorySearch: any; 
  clasEconSearch: any;




  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._spinner.show();
    axios.get('/api/salaryConfig').then(({ data }) => {

      this.salaryConfigs = data;
      this.filteredSalaryConfigs = data;

      this._spinner.hide();

    }).then(() => console.log("salary configs: ", this.salaryConfigs))
      .catch(() => this.toastr.error('Eroare la preluarea salary-config urilor din baza de date!'));
  }

  addEdit = (id_salaryConfig?: number): void => {

    const modalRef = this._modal.open(SalaryConfigModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.id_salaryConfig = id_salaryConfig;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
    console.log("Add/Edit Function ...")
  }

  delete = (salaryConfig: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = `Ștergere cheltuiala`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți salary-configul  având numele: <b>${salaryConfig.name}</b> ?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/salaryConfig/${salaryConfig.id}`).then(() => {

        this.toastr.success('Salary-config-ul a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea Salary-config-ului!'));
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-salaryConfig')[0].scrollTop > 500) {
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
    SCROLL_TOP('view-scroll-salary-config', 0);
    this.limit = 70;
    console.log("onScrollTop Function ...")

  }

  trueCheckedNormal: boolean = false;
  falseCheckedNormal: boolean = false;

  onCheckboxChange(checkedCheckbox: string): void {
    if (checkedCheckbox === 'true' && this.trueCheckedNormal) {
      
      this.falseCheckedNormal = false;
    } 
    if (checkedCheckbox === 'false' && this.falseCheckedNormal) {
      
      this.trueCheckedNormal = false;
    }
    this.filterData();
  }
  
  

  filterData(): void {
    this.filteredSalaryConfigs = this.salaryConfigs.filter((salaryConfig: {
      name: string;
      category: string;
      normal: boolean | undefined;
      
    }) => {
     
      const nameMatch = !this.nameSearch || salaryConfig.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const clasEconMatch = !this.clasEconSearch || salaryConfig.category.toLowerCase().includes(this.clasEconSearch.toLowerCase());
     // clasEcon nu e bine facut
    


      const normalMatch = (this.trueCheckedNormal && salaryConfig.normal === true) ||
                           (this.falseCheckedNormal && salaryConfig.normal === false) ||
                           (!this.trueCheckedNormal && !this.falseCheckedNormal);
      
      

      return nameMatch && clasEconMatch && normalMatch;
    });
  }

  onSearchChange(): void {
    this.filterData();
  }
}
