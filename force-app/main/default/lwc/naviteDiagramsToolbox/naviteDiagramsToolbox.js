import { LightningElement, api, track } from 'lwc';
import { defaultValues } from "./consts";

export default class NaviteDiagramsToolbox extends LightningElement {
    @track nodes = [];
    @track links = [];
    isPanelOpen = true;

    @api initialize(diagram) {
        const nodeIterator = diagram.nodeTemplateMap.iterator;
        nodeIterator.each(({ key, value }) => {
            if (key) {
                const { name, label, icon } = value;
                this.nodes.push({
                    key: name,
                    label: label,
                    icon: icon, 
                    data: defaultValues[name] ?? { category: name }
                })
            }
        });
        
        // const linkIterator = diagram.linkTemplateMap.iterator;
        // linkIterator.each(({ key, value }) => {
        //     if (key) {
        //         const { name, label } = value;
        //         this.links.push({
        //             key: name,
        //             label: label,
        //             icon: 'utility:forward',
        //             data: defaultValues[name] ?? { category: name }
        //         })
        //     }
        // });
    }

    handleDragStart(event){
        const type = event.target.dataset.type;
        let data;
        if (type == 'node') {
            data = this.nodes.find(node => node.key == event.target.dataset.key).data;
        } else {
            data = this.links.find(link => link.key == event.target.dataset.key).data;
        }
        event.dataTransfer.setData('data', JSON.stringify({data, type}));
    }

    @api togglePanel() {
        const panel = this.template.querySelector('.slds-panel');
        if (this.isPanelOpen){
            panel.classList.remove('slds-is-open');
        }else{
            panel.classList.add('slds-is-open');
        }
        this.isPanelOpen = !this.isPanelOpen;
    }
}