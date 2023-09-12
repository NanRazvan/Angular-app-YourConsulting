import { Component, OnInit } from '@angular/core';
import { faChevronUp, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OutgoingsModalComponent } from './outgoings-modal/outgoings-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';

@Component({
  selector: 'app-outgoings',
  templateUrl: './outgoings.component.html',
  styleUrls: ['./outgoings.component.scss']
})
export class OutgoingsComponent implements OnInit {

  showBackTop: string = ''
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  outgoings: any[] = [];
  filteredOutgoings: any[] = [];
  limit: number = 70;
  superiorSearch: any;
  nameSearch: any;
  paragraphSearch: any;
  lastChildSearch: undefined;



  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._spinner.show();
    axios.get('/api/outgoings').then(({ data }) => {

      this.outgoings = data;
      this.filteredOutgoings = data;

      this._spinner.hide();

    }).then(() => console.log("outgoings: ", this.outgoings))
      .catch(() => this.toastr.error('Eroare la preluarea cheltuieilor din baza de date!'));
  }

  addEdit = (id_outgoing?: number): void => {

    const modalRef = this._modal.open(OutgoingsModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.id_outgoing = id_outgoing;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
    console.log("Add/Edit Function ...")
  }

  delete = (outgoing: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.title = `Ștergere cheltuiala`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți chelutiala având numele: <b>${outgoing.name}</b>, superior: <b>${outgoing.id_superior}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/outgoings/${outgoing.id}`).then(() => {

        this.toastr.success('Cheltuiala a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea cheltuielii!'));
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-outgoing')[0].scrollTop > 500) {
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
    SCROLL_TOP('view-scroll-outgoings', 0);
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
    this.filteredOutgoings = this.outgoings.filter((outgoing: {
      id_superior: number | undefined;
      name: string;
      paragraph: number;
      last_child: boolean | undefined;
    }) => {
      const idSuperiorMatch = !this.superiorSearch || outgoing.id_superior?.toString().includes(this.superiorSearch);
      const nameMatch = !this.nameSearch || outgoing.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const paragraphMatch = !this.paragraphSearch || outgoing.paragraph.toString().includes(this.paragraphSearch);
      const lastChildMatch = (this.trueChecked && outgoing.last_child === true) ||
                           (this.falseChecked && outgoing.last_child === false) ||
                           (!this.trueChecked && !this.falseChecked);
  
      return idSuperiorMatch && nameMatch && paragraphMatch && lastChildMatch;
    });
  }
  
  
  

  onSearchChange(): void {
    this.filterData();
  }
}
