import LightningDatatable from "lightning/datatable";
import customTextAreaTemplate from "./ndsf_CustomTextArea.html";
import customTextAreaEditTemplate from "./ndsf_CustomTextAreaEdit.html";

/**
 * Custom datatable com custom types: customTextArea 
 */
export default class Ndsf_CustomDatatable extends LightningDatatable {
  static customTypes = {
    customTextArea: {
      template: customTextAreaTemplate,
      editTemplate:customTextAreaEditTemplate,
      standardCellLayout: true,
      typeAttributes: ["placeholder", "name", "length"],
    }
  };
}