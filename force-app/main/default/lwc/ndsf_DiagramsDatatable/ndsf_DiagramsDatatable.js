import { LightningElement, api, track, wire } from "lwc";
import getDiagramsByDocumentation from '@salesforce/apex/NativeDiagramsController.getDiagramsByDocumentation';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class Ndsf_DiagramsDatatable extends LightningElement {
    @api recordId;
    @track records = [];
    columns = columns;
    loading;
    disableMenu;
    wiredResult;

    @wire(getDiagramsByDocumentation, { documentationId: "$recordId" })
    wiredData(result) {
        this.loading = true;
        this.wiredResult = result;
        if (result.data) {
            this.records = [];
            result.data.forEach(record => {
                this.records.push({ ...record, url: `/${record.Id}` });
            })
        } else if (result.error) {
            console.error('Error:', error);
        }
        this.loading = false;
    }

    handleClickRefresh(event) {
        this.loading = true;
        refreshApex(this.wiredResult);
        this.loading = false;
    }

    handleRowAction(event){
        console.log("row action");
        const recordId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        
        if (actionName == "preview"){
            window.open(`/c/nativeDiagramsSfApp.app?recordId=${recordId}`, '_blank');
        }
    }
}

const columns = [
    { label: "Diagram", fieldName: "url", type: "url", hideDefaultActions: true, typeAttributes: { label: { fieldName: "DiagramName__c" } }, sortable: false },
    { label: "Type", fieldName: "Type__c", hideDefaultActions: true, sortable: false },
    { type: "button-icon", fixedWidth: 50, typeAttributes: { iconName: "utility:preview", label: "preview", title: "preview", name: "preview", value: "preview", disabled: { fieldName: "disabledPreview" } } },
]