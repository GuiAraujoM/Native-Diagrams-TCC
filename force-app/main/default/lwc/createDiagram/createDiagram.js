import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';


export default class CreateDiagram extends LightningElement {
    _recordId;
    @api objectApiName;
    defaultDocumentationValue = '';
    disableButtons = false;
    loading = true;

    @api set recordId(value) {
        this._recordId = value;
        this.defaultDocumentationValue = this._recordId;
    }

    get recordId() {
        return this._recordId;
    }

    handleSuccess(event) {
        console.log('handleSuccess')
        console.log(JSON.stringify(event.detail))
        const recordId = event.detail.id;
        const documentId = event.detail.fields.Documentation__r.value?.id;
        window.open(`/c/nativeDiagramsSfApp.app?recordId=${recordId}&documentation=${documentId}`, "_self");
    }

    handleSubmit(event){
        event.preventDefault();
        this.loading = true;
        this.disableButtons = true;
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleCancel(event) {
        console.log('handleCancel')
        if(this._recordId){            
            this.closeQuickAction();
        }else{
            window.open("./home", "_self");
        }
    }

    handleLoad(event){
        console.log('handleLoad')
        this.loading = false;
    }

    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}