import { LightningElement, api } from 'lwc';
import { toArrowComboboxOptions, fromArrowComboboxOptions } from './_consts';

export default class NativeDiagramsHeader extends LightningElement {
    @api diagramSobject;
    @api diagram;
    showSaved;
    toArrowComboboxOptions = toArrowComboboxOptions;
    fromArrowComboboxOptions = fromArrowComboboxOptions;
    fromArrowValue;
    toArrowValue;
    showArrowCombobox = false;
    showGptModal;
    _selectedLink;

    @api showSave() {
        this.showSaved = true;
        setTimeout(() => {
            this.showSaved = false;
        }, 3000);
    }

    handleClickTogglePanel(event){
        event.target.variant = event.target.variant == 'brand' ? 'border' : 'brand';
        this.dispatchEvent(new CustomEvent('togglepanel'));
    }

    handleSave(event) {
        this.dispatchEvent(new CustomEvent('save'));
    }

    handleUndo(event){
        this.dispatchEvent(new CustomEvent('undo'));
    }

    handleRedo(event) {
        this.dispatchEvent(new CustomEvent('redo'));
    }

    handleBack(event) {
        window.open(`/${this.diagramSobject.Id}`, '_self');
    }

    handleChangeFromArrow(event) {
        this.diagram.startTransaction("change arrow");
        this._selectedLink.findObject("FROM_ARROW").fromArrow = event.detail.value;
        this.diagram.commitTransaction("change arrow");
    }

    handleChangeToArrow(event) {
        this.diagram.commit(d =>
            this._selectedLink.findObject("TO_ARROW").toArrow = event.detail.value
        );
    }

    handleGenerateWithGpt(event) {
        this.showGptModal = true;
    }

    handleClickCancel(event) {
        this.showGptModal = false;
    }

    handleConfirmGeneration(event){
        this.showGptModal = false;
        const value = this.template.querySelector("lightning-textarea").value;
        const includeContext = this.template.querySelector(".include-context").checked;
        this.dispatchEvent(new CustomEvent('generatewithgpt', { detail: {value, includeContext} }));        
    }

    get diagramName() {
        if (this.diagramSobject?.Name && this.diagramSobject?.DiagramName__c){
            const title = `${this.diagramSobject?.Name}: ${this.diagramSobject?.DiagramName__c}`;
            document.title = title;
            return title;
        }
        
        return "Loading...";
    }

    @api set selectedLink(value) {
        if (value) {
            this._selectedLink = value;
            this.fromArrowValue = value.findObject("FROM_ARROW").fromArrow;
            this.toArrowValue = value.findObject("TO_ARROW").toArrow;
            this.showArrowCombobox = true;
        } else {
            this._selectedLink = value;
            this.fromArrowValue = null;
            this.toArrowValue = null;
            this.showArrowCombobox = false;
        }        
    }

    get selectedLink() {
        return this._selectedLink;
    }
}