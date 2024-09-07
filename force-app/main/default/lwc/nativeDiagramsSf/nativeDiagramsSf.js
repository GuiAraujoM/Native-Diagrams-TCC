import { LightningElement, api, wire } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import getDiagram from "@salesforce/apex/NativeDiagramsController.getDiagram";
import promptGpt from "@salesforce/apex/NativeDiagramsController.promptGpt";

import GOJS_RESOURCE from "@salesforce/resourceUrl/gojs";
var $, diagram;

export default class NativeDiagramsSf extends LightningElement {
    @api recordId;
    isLoading = true;
    diagramSobject;

    renderedCallback() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        loadScript(this, GOJS_RESOURCE)
            .then(() => {
                this.initialize();
            })
            .catch((error) => {
                console.log(JSON.stringify(error));                
            });
    }

    async initialize(){
        console.log("initialize NativeDiagramsSf");

        try {
            const result  = await getDiagram({ diagramId: this.recordId })
            console.log(result.Model__c)
            if (result) {
                this.diagramSobject = result

                this.header.diagramSobject = this.diagramSobject;
                
                //initialize canvas
                this.canvas.diagramSobject = this.diagramSobject; 
                this.canvas.initialize();

                //get generated canvas after initialize
                diagram = this.canvas.diagram;

                this.header.diagram = this.canvas.diagram;
                //initialize toolbox
                this.toolbox.initialize(diagram);
            }

        } catch (error) {
            console.log(error);
        } finally {
            this.isLoading = false;
        }
    }

    handleSave(event) {
        this.isLoading = true;
        this.canvas.save(this.recordId)
            .then((result) => {      
                this.header.showSave();          
                this.isLoading = false;
            })
            .catch((error) => {
                this.isLoading = false;
            });
    }

    handleTogglepanel(event) {
        this.toolbox.togglePanel();
    }

    handleUndo(event) {
        diagram.commandHandler.undo()
    }

    handleRedo(event) {
        diagram.commandHandler.redo()
    }

    handleSelectedLink(event){
        this.header.selectedLink = event.detail;
    }

    async handleGenerateWithGpt(event){
        this.isLoading = true;
        let result;
        const { Id } = this.diagramSobject;
        const { value, includeContext } = event.detail;
        try{
            result = await promptGpt({ userMessage: value, diagramId: Id, includeContext: includeContext })
        }catch(error){
            console.log(error);
        }
        const content = result.choices[0].message.content.toString();
        console.log('content', content);
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}") + 1;

        diagram.model = go.Model.fromJson(content.slice(start, end));

        console.log('content',content.slice(start, end));
        this.isLoading = false;
    }

    get queryParameters() {
        return new URLSearchParams(window.location.search);
    }

    get recordId() {
        return this.queryParameters.get("recordId");
    }

    get canvas() {
        return this.template.querySelector("c-native-diagrams-canvas");
    }

    get toolbox() {
        return this.template.querySelector("c-navite-diagrams-toolbox");
    }

    get header(){        
        return this.template.querySelector("c-native-diagrams-header");
    }

}

export { $, diagram };