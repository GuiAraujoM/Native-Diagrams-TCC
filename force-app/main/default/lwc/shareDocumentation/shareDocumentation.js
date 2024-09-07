import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import shareDocumentation from '@salesforce/apex/ShareDocumentationController.shareDocumentation';
import unshareDocumentation from '@salesforce/apex/ShareDocumentationController.unshareDocumentation';
import getRecordShare from '@salesforce/apex/ShareDocumentationController.getRecordShare';
import { refreshApex } from '@salesforce/apex';

const FIELDS = [
    'User.Name', 'Group.Name'
]

const typeComboboxOptions = [
    { value: 'User', label: 'User' },
    { value: 'Group', label: 'Group' },
]

const accessLevelOptions = [
    { value: 'Read', label: 'Read Only' },
    { value: 'Edit', label: 'Read/Write' },
]

const tableColumns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Access Level', fieldName: 'AccessLevel' },
    {
        type: 'button-icon',
        fixedWidth: 50,
        typeAttributes:
        {
            iconName: 'utility:close',
            name: 'delete',
            disabled: { fieldName: 'Disabled' },
            variant: 'bare'
        }
    }
];

export default class ShareDocumentation extends LightningElement {
    _recordId;
    typeComboboxValue = 'User';
    typeComboboxOptions = typeComboboxOptions;
    accessLevelOptions = accessLevelOptions;
    tableColumns = tableColumns;
    pickedValues = [];
    pickedValueId;
    disableInputs;
    accessLevelValue = 'Read';
    filter;
    loading;
    wiredRecordShareResult;

    tableData = [];
    
    handleChangeTypeCombobox(event){
        this.typeComboboxValue = event.detail.value;
        this.setFilter();
        this.pickedValueId = null;
    }

    handleChangeRecordPicker(event){
        if (event.detail.recordId) {
            this.disableInputs = true;
            this.pickedValueId = event.detail.recordId;
        }
    }

    handleRemove(event){
        this.pickedValues = this.pickedValues.filter(pickedValue => pickedValue.Id != event.target.dataset.id);
        this.setFilter();
    }

    handleChangeAccessLevel(event){
        this.accessLevelValue = event.detail.value;
    }

    handleCancel(event) {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleSave(event){
        this.loading = true;
        shareDocumentation({
            recordId: this.recordId,
            userOrGroupIdsList: this.pickedValues.map(pickedValue => pickedValue.Id),
            accessLevel: this.accessLevelValue,
        })
        .then(result => {
            if (result.status == 'success') {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Document shared successfully',
                    variant: 'success'
                }));
                refreshApex(this.wiredRecordShareResult);
                this.dispatchEvent(new CloseActionScreenEvent());
            }else{
                console.log('error');
                console.log(result.message); 
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Error sharing: ' + result.message,
                    variant: 'error'
                }));
            }
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            }));
        })
        .finally(() => {
            this.loading = false;
        })
    }

    handleTableAction(event){
        console.log(event.detail.row.Id);
        const id = event.detail.row.Id;
        if (event.detail.action.name === 'delete') {
            unshareDocumentation({ recordId: this.recordId, userOrGroupId: id})
            .then(result => {
                if(result.status == 'error'){
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: 'You cannot delete this',
                        variant: 'error'
                    }));
                }
                refreshApex(this.wiredRecordShareResult);
                this.setFilter();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            })
        }
    }


    @wire(getRecord, { recordId: '$pickedValueId', fields: FIELDS })
    execute({ error, data }) {
        if (error) {
            console.log(error);
            this.disableInputs = false;
        } else if (data) {
            if (this.pickedValueId) {
                this.disableInputs = true;
                this.pickedValues.push({
                    Id: this.pickedValueId,
                    Name: data.fields.Name.value,
                    Icon: this.typeComboboxValue == 'User' ? 'standard:user' : 'standard:orders'
                });
                this.pickedValueId = null;
                this.template.querySelector('lightning-record-picker').clearSelection();
                this.setFilter();
                this.disableInputs = false;
            }            
        }
    }

    @wire(getRecordShare, { recordId: '$recordId' })
    getShare(result) {
        this.wiredRecordShareResult = result;
        if (result.error) {
            console.log('wire error');
            console.error(result.error);
        } else if (result.data) {
            console.log('wire data');
            console.log(JSON.stringify(result.data));
            this.tableData = result.data.map(item => {
                return {...item, Disabled: item.AccessLevel == 'All'}
            });
            this.setFilter();

        }
    }
    
    setFilter(){
        switch (this.typeComboboxValue) {
            case 'User':
                const criteriaUser = [
                    {
                        fieldPath: 'IsActive',
                        operator: 'eq',
                        value: true,
                    }, 
                    {
                        fieldPath: 'UserType',
                        operator: 'eq',
                        value: 'standard',
                    }
                ];

                if (this.pickedValues.length > 0){
                    criteriaUser.push({
                        fieldPath: 'Id',
                        operator: 'nin',
                        value: this.pickedValues.map(pickedValue => pickedValue.Id),
                    })
                }

                if (this.tableData.length > 0) {
                    criteriaUser.push({
                        fieldPath: 'Id',
                        operator: 'nin',
                        value: this.tableData.map(item => item.Id),
                    })
                }

                this.filter = {
                    criteria: criteriaUser
                };
                break;

            case 'Group':
                const criteriaGroup = [
                    {
                        fieldPath: 'Type',
                        operator: 'eq',
                        value: 'Regular',
                    }
                ];

                if (this.pickedValues.length > 0) {
                    criteriaGroup.push({
                        fieldPath: 'Id',
                        operator: 'nin',
                        value: this.pickedValues.map(pickedValue => pickedValue.Id),
                    })
                }

                if (this.tableData.length > 0) {
                    criteriaGroup.push({
                        fieldPath: 'Id',
                        operator: 'nin',
                        value: this.tableData.map(item => item.Id),
                    })
                }

                this.filter = {
                    criteria: criteriaGroup
                }
                break;
        
            default:
                break;
        }
    }

    get pickerPlaceholder() {
        return `Search ${this.typeComboboxValue}...`
    }

    get showPickedValues(){
        return this.pickedValues;
    }

    get disableSave(){
        return this.pickedValues.length == 0;
    }

    @api set recordId(value) {
        this._recordId = value;
    }

    get recordId() {
        return this._recordId;
    }
}