import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from "lightning/uiRecordApi";

import ID_FIELD from "@salesforce/schema/Diagram__c.Id";
import MODEL_FIELD from "@salesforce/schema/Diagram__c.Model__c";

import { addDefaultTemplate, addEntityRelationshipTemplate, addUseCaseTemplate, addFlowchartTemplate, addLinkTemplate } from './_templates';
import { addActorFigure, addTerminatorFigure, addDocumentFigure, addParallelogramFigure, addDatabaseFigure } from './_figures';

var $, diagram;

export default class NativeDiagramsCanvas extends LightningElement {
    @api diagramSobject;
    initialized;
    _selectedLink;

    @api initialize() {
        console.log('initialize NativeDiagramsCanvas');
        $ = go.GraphObject.make;
        this.diagram =
            $(go.Diagram, this.diagramDiv,
                {
                    allowDelete: true,
                    allowCopy: true,
                    allowGroup: true,
                    allowInsert: true,
                    allowDrop: true,
                    allowLink: true,
                    "undoManager.isEnabled": true                       
                }
            );    

        this.diagram.addDiagramListener("ChangedSelection", e => {
            var sel = e.diagram.selection;

            if (sel.count == 0) {
                this.selectedLink = null;
            }

            sel.each(part => {
                if (part instanceof go.Link) {
                    this.selectedLink = part;
                } else {
                    this.selectedLink = null;
                }
            });
        });

        document.addEventListener("keydown", e => {
            if (e.ctrlKey && e.key === "s") {                
                e.preventDefault();
                this.save(this.diagramSobject.Id);
            }
        });

        
        this.diagram.nodeTemplateMap = new go.Map();
        this.setDiagramTemplate();

        this.diagram.model = go.Model.fromJson(this.diagramSobject.Model__c || {});
    }

    handleDragover(event){
        event.preventDefault();
        console.log('drag over')
    }    

    handleDrop(event) {
        event.preventDefault();
        console.log('drop')
        const can = event.target;
        const pixelratio = diagram.computePixelRatio();

        const bbox = can.getBoundingClientRect();
        const mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbox.width);
        const my = event.clientY - bbox.top * ((can.height / pixelratio) / bbox.height);
        const point = diagram.transformViewToDoc(new go.Point(mx, my));

        const { data, type } = JSON.parse(event.dataTransfer.getData("data"));

        console.log(data, type);

        if(type == 'node'){
            diagram.startTransaction("add node");
            diagram.model.addNodeData({ ...data, location: point });
            diagram.commitTransaction("add node");
        }else if(type == 'link'){
            diagram.startTransaction("add link");
            diagram.model.addLinkData({ ...data, location: point });
            diagram.commitTransaction("add link");
        }

        this.diagramDiv.querySelector('canvas').focus();
    }

    @api save(recordId) {
        console.log('save');
        const model = diagram.model.toJson();

        const fields = {};

        fields[ID_FIELD.fieldApiName] = recordId;
        fields[MODEL_FIELD.fieldApiName] = model;

        const recordInput = { fields }

        return updateRecord(recordInput);            
    }

    setDiagramTemplate() {
        const diagramType = this.diagramSobject.Type__c || "default";
        
        addDefaultTemplate();
        
        switch (diagramType) {
            case 'Entity Relationship':
                addLinkTemplate("BackwardOpenTriangle", "OpenTriangle", "from", "to", "", go.Link.Normal);
                addEntityRelationshipTemplate();
                return;

            case 'Use Case':
                addLinkTemplate("", "OpenTriangle", "", "", "text", go.Link.Normal);
                addActorFigure();
                addUseCaseTemplate();
                return;

            case 'Flowchart':
                addLinkTemplate("", "OpenTriangle", "", "", "text", go.Link.Orthogonal);
                addTerminatorFigure();
                addDocumentFigure();
                addParallelogramFigure();
                addDatabaseFigure();
                addFlowchartTemplate();
                return;

            default:
                return;
        }
    }

    get diagramDiv(){
        return this.template.querySelector('.c-canvas-board');
    }

    set diagram(value){
        diagram = value;
    }

    @api get diagram(){
        return diagram;
    }

    get selectedLink(){
        return this._selectedLink;
    }

    set selectedLink(value) {
        this._selectedLink = value;
        this.dispatchEvent(
            new CustomEvent('selectedlink', { detail: value })
        );
    }

}

export { $, diagram };