import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SCROLL_TOP } from 'src/app/utils/utils-table';

@Component({
  selector: 'app-salary-modal',
  templateUrl: './salary-modal.component.html',
  styleUrls: ['./salary-modal.component.scss']
})
export class SalaryModalComponent implements OnInit {
  @Input() id_salary: number | undefined;
  modal = {} as any;
  activitiesNotChild: any;
  activities: any[] = [];
  limit: number = 70;
  changed: any = false;
  months: string[] = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  totals: any[] = [];
  salaryConfigs: any[] = [];
  filteredSalaryConfigs: any[] = [];
  clasEconSearch: any;
  nameSearch: any;
  date: any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {


    this.loadActivities();
    this.loadSalaryConfigs();

    if (this.id_salary) {
      this.loadDataById();
      this.getSalaryData(this.id_salary);
    }
    this.calculateCategoryTotals();

  }

  loadSalaryConfigs(): void {

    this._spinner.show();
    axios.get('/api/salaryConfig').then(({ data }) => {

      this.salaryConfigs = data;
      this.filteredSalaryConfigs = data;

      this._spinner.hide();

    }).then(() => this.loadOutgoingsParapraph())
      .then(() => this.totalAndNonTotal())
      .then(() => console.log("totals: ", this.totals))
      .then(() => console.log("salary configs: ", this.salaryConfigs))
      .catch(() => this.toastr.error('Eroare la preluarea salary-config urilor din baza de date in salary component!'));
  }

  totalAndNonTotal() {
    this.totals = this.salaryConfigs.filter(item => item.total === true);
    this.salaryConfigs = this.salaryConfigs.filter(item => item.total === false);
    this.filteredSalaryConfigs = this.salaryConfigs;
  }


  loadOutgoingsParapraph() {

    for (const salaryConfig of this.salaryConfigs) {
      if (salaryConfig.id_outgoing) {

        this._spinner.show();
        const id_outgoing = salaryConfig.id_outgoing;

        axios.get(`/api/outgoings/${id_outgoing}`).then(({ data }) => {

          salaryConfig.id_outgoingParagraph = data.paragraph;

          this._spinner.hide();
        })
          .catch(() => this.toastr.error('Eroare la preluarea cheltuielii ului in salary component'));
      }
    }

  }

  get salaryConfigsNotInTotals(): any[] {
    return this.filteredSalaryConfigs.filter(sc =>
      !this.totals.some(t => t.category === sc.category)
    );
  }

  loadActivities = (): void => {

    this._spinner.show();
    axios.get('/api/activity').then(({ data }) => {

      this.activities = data;
      this._spinner.hide();

    }).then(() => console.log("activities: ", this.activities))
      .catch(() => this.toastr.error('Eroare la preluarea activitatilor din baza de date in salary-modal!'));
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

  loadDataById = (): void => {

    this._spinner.show();
    axios.get(`/api/salary/${this.id_salary}`).then(({ data }) => {
      this.modal = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea salariului in salary-modal!'));

  }

  postData = (): void => {
    axios.post('/api/salary', this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Salariul a fost salvată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea salariilor in salary-modal!'));
  }

  updateData = (): void => {
    axios.put(`/api/salary`, this.modal).then(() => {
      this._spinner.hide();
      this.toastr.success('Salariul a fost modificată cu succes!');
      this.activeModal.close();
    }).catch(() => this.toastr.error('Eroare la salvarea salariilor in salary-modal!'));
  }

  save(): void {

    if (this.validate()) {
      this._spinner.show();

      if (this.id_salary) {
        this.modal.tableElements = this.filteredSalaryConfigs;
        this.modal.totals = this.totals;
        this.updateData();
      }
      else {
        this.modal.tableElements = this.filteredSalaryConfigs;
        this.modal.totals = this.totals;
        this.postData();
      }
      console.log("Datele urmatoare au fost salvate: ", this.modal);
    }
    else
      console.log("Datele nu au fost salvate");
  }


  getSalaryData(id_salary: any) {
    this._spinner.show();
    axios.get(`/api/salaryData/${id_salary}`).then(({ data }) => {
      console.log("data", data)
      console.log("totals",this.totals)
      for (const element of data) {

        this.totals.forEach((item) => {
          if (element.id_salary_config === item.id) {
            item.clerk = element.clerk;
            item.contract = element.contract;
            item.others = element.others;
          }
        })

        this.filteredSalaryConfigs.forEach((item) => {
          if (element.id_salary_config === item.id) {
            item.clerk = element.clerk;
            item.contract = element.contract;
            item.others = element.others;
          }
        })
      }

      this._spinner.hide();
    })
      .catch(() => this.toastr.error('Eroare la salaryData in salary-modal!'));
  }

  onActivityChange() {

    if (this.changed === true) {
      const confirmed = window.confirm('Vrei sa salvezi datele curente?');

      if (confirmed) {
        this.save();
      }
    }
  }

  validate = (): boolean => {
    if (!this.modal.name) {
      this.toastr.error('Campul Nume este gol');
      return false;
    }
    if (!this.modal.month) {
      this.toastr.error('Campul Luna este gol');
      return false;
    }


    for (const sc of this.filteredSalaryConfigs) {
      if (sc.clerk < 0) {
        this.toastr.error('Campul Functionari publici nu poate fi negativ');
        return false;
      }

      if (sc.contract < 0) {
        this.toastr.error('Campul Contractuali nu poate fi negativ');
        return false;
      }

      if (sc.others < 0) {
        this.toastr.error('Campul Alte categorii nu poate fi negativ');
        return false;
      }
    }

    return true;
  }


  filterData(): void {
    this.filteredSalaryConfigs = this.salaryConfigs.filter((salaryConfig: {
      name: string;
      id_outgoingParagraph: string;

    }) => {

      const nameMatch = !this.nameSearch || salaryConfig.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const clasEconMatch = !this.clasEconSearch || (salaryConfig.id_outgoingParagraph && salaryConfig.id_outgoingParagraph.toLowerCase().includes(this.clasEconSearch.toLowerCase()));

      return nameMatch && clasEconMatch;
    });
  }

  onSearchChange(): void {
    this.filterData();
  }


  calculateRowTotals(sc: any): void {
    sc.totalSuma = 0;

    if (!isNaN(sc.clerk) && sc.clerk !== null && sc.clerk !== '') {
      sc.totalSuma += Number(sc.clerk);
    }

    if (!isNaN(sc.contract) && sc.contract !== null && sc.contract !== '') {
      sc.totalSuma += Number(sc.contract);
    }

    if (!isNaN(sc.others) && sc.others !== null && sc.others !== '') {
      sc.totalSuma += Number(sc.others);
    }

  }
  onCellChange(sc: any): void {
    this.calculateCategoryTotals();
    this.calculateRowTotals(sc);
    this.changed = true;
  }

  calculateCategoryTotals(): void {

    this.totals.forEach((item) => {
      let clerkSum = 0;
      let contractSum = 0;
      let othersSum = 0;
      let totalCategories = 0;


      this.filteredSalaryConfigs.forEach((sc) => {
        if (sc.category === item.category) {

          if (!isNaN(sc.clerk) && sc.clerk !== null && sc.clerk !== '') {
            clerkSum += Number(sc.clerk);
            totalCategories += Number(sc.clerk);
          }
          if (!isNaN(sc.contract) && sc.contract !== null && sc.contract !== '') {
            contractSum += Number(sc.contract);
            totalCategories += Number(sc.contract);

          }
          if (!isNaN(sc.others) && sc.others !== null && sc.others !== '') {
            othersSum += Number(sc.others);
            totalCategories += Number(sc.others);

          }
        }
      });

      item.clerk = clerkSum;
      item.contract = contractSum;
      item.others = othersSum;
      item.totalCategories = totalCategories;
    });
  }

}
