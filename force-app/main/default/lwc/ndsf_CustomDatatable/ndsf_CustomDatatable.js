import { LightningElement, api, track } from "lwc";

export default class Ndsf_CustomDatatable extends LightningElement {
    @api recordId;
    @api keyfield;
    @api draftvalues;
    @api columns = [];
    @api loading;
    @api sortby;
    @api sortdirection;
    @track displayedRecords = [];
    @track filteredRecords = []; 
    _records = []; 
    recordsPerPage = 5;
    totalRecords = 0;
    currentPage = 1;
    totalPages = 1;    
    recordsPerPageOptions = recordsPerPageOptions;
    rowNumberOffset = 1;
    

    connectedCallback(){
        if(this._records && this.columns){
            this.handleChangeRecords();
            this.sortData(this.sortby, this.sortdirection);
        }
    }

    handleRowAction(event){
        const e = new CustomEvent('rowaction', event);
        this.dispatchEvent(e);
    }

    handleSaveDatatable(event){
        const e = new CustomEvent('save', event);
        this.dispatchEvent(e);
    }

    handleChangeRecordsPerPage(event){
        if(this.totalRecords > 0){
            this.recordsPerPage = event.detail.value;
            this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
            this.currentPage = 1;
            this.paginate();
        }        
    }

    handleClickNextPage(event){
        this.currentPage += 1;
        this.paginate();
    }

    handleClickPreviousPage(event){
        this.currentPage -= 1;
        this.paginate();
    }

    handleSearch(event){
        this.filteredRecords = this._records.filter(registro => {
            return Object.keys(registro).find(key => registro[key].toString().toLowerCase().includes(event.detail.value.toLowerCase()));
        });
        this.totalRecords = this.filteredRecords?.length;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
        this.paginate();
    }

    handleChangeRecords(){
        this.totalRecords = this._records?.length;
        this.currentPage = 1;
        if(!this.recordsPerPage) this.recordsPerPage = 5;
        this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
        this.filteredRecords = this._records;
        this.paginate();
    }

    handleSort(event){
        this.sortby = event.detail.fieldName;
        this.sortdirection = event.detail.sortDirection;
        this.sortData(this.sortby, this.sortdirection);
    }
    
    sortData(fieldname, direction) {
        let parseData = [...this.records];
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? String(keyValue(x)).toLowerCase() : ''; // handling null values
            y = keyValue(y) ? String(keyValue(y)).toLowerCase() : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
    }

    paginate(){
        let inicio = (this.currentPage - 1) * parseInt(this.recordsPerPage);
        let fim = parseInt(inicio) + parseInt(this.recordsPerPage);
        this.rowNumberOffset = inicio;
        
        this.displayedRecords = this.filteredRecords.slice(inicio, fim);
    }

    set records(value) {
        this._records = value;
        this.handleChangeRecords();
    }

    @api get records() {
        return this._records;
    }

    get disablePreviousPage(){
        return this.currentPage == 1;
    }

    get disableNextPage(){
        return this.totalPages == 0 || this.currentPage == this.totalPages;
    }

    get noRecords(){
        return !this._records || !this._records?.length > 0;
    }
}

const recordsPerPageOptions = [
    {"label" : 5, "value" : 5},
    {"label" : 10, "value" : 10},
    {"label" : 15, "value" : 15},
    {"label" : 20, "value" : 20},
    {"label" : 30, "value" : 30}
];