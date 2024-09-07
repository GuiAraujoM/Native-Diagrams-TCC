import { $, diagram } from "./nativeDiagramsCanvas";
import { addLinkToTemplate, addNodeToTemplate, makePort, showPorts, createDefaultNode, createContextMenuButton } from "./_utils";

import { SALESFORCE_FONT_HEADER_TITLE, SALESFORCE_FONT_HEADER_SUBTITLE, SALESFORCE_FONT_BODY, STROKE_COLOR } from "./_consts";

const addDefaultTemplate = () => {
    const textTemplate = 
        $(go.Node, "Auto", 
            new go.Binding("location", "location").makeTwoWay(),
            $(go.Panel, "Vertical",
                $(go.TextBlock,
                    { font: SALESFORCE_FONT_BODY, stroke: "#000000", text: "Editable text", editable: true },
                    new go.Binding("text", "text", text => text?.length > 0 ? text : "Editable text").makeTwoWay(),
                    new go.Binding("font", "font").makeTwoWay()
                ),
                {
                    toolTip:
                        $("ToolTip",
                            $(go.TextBlock, { margin: 4 },
                                new go.Binding("text", "text"))
                        )
                }
            )
        );
       
    addNodeToTemplate(textTemplate, "textTemplate", "Text", "utility:text");

    diagram.nodeTemplateMap.add("", diagram.nodeTemplate);
    diagram.linkTemplateMap.add("", diagram.linkTemplate);
}

const addEntityRelationshipTemplate = () => {
    // the template for each attribute in a node's array of item data
    const itemTempl =
        $(go.Panel, "Horizontal",             
            {   
                stretch: go.GraphObject.Horizontal,
                minSize: new go.Size(100, 22),
                mouseEnter: function (e, obj) { obj.findObject("DELETE").visible = true; },
                mouseLeave: function (e, obj) { obj.findObject("DELETE").visible = false; },
            },
            $(go.TextBlock, 
                { font: SALESFORCE_FONT_BODY, stroke: "#000000", text: "•", alignment: go.Spot.Left, width: 15 },
                new go.Binding("text", "isKey", isKey => isKey ? "#" : "•")
            ),
            $(go.TextBlock,
                { font: SALESFORCE_FONT_BODY, stroke: "#000000", text: "Attribute", editable: true },
                new go.Binding("text", "name", text => text?.length > 0 ? text : "Attribute").makeTwoWay()
            ),
            $("Button",
                {
                    name: "DELETE",
                    "ButtonBorder.fill": "transparent",
                    "ButtonBorder.strokeWidth": 0,
                    visible: false,
                    alignment: go.Spot.Right,
                    click: function (e, obj) { 
                        const node = obj.part;
                        const attributes = obj.part.data.attributes;
                        const index = obj.panel.itemIndex;
                        node.diagram.model.commit(m =>
                            m.removeArrayItem(attributes, index)
                        );
                    }
                },
                $(go.TextBlock, "x", { stroke: "red", textAlign: "right", font: "14px" })
            )
        );

    const addNewRow = (obj, isKey) => {
        const node = obj.part;
        const attributes = obj.part.data.attributes;

        const newItem = { name: `Attribute ${attributes.length}`, isKey: isKey }

        node.diagram.model.commit(m =>
            m.insertArrayItem(attributes, -1, newItem)
        );
    };

    const entityNode =
        $(go.Node, "Auto",
            //general properties
            new go.Binding("label", "Entity"),
            new go.Binding("icon", "standard:entity"),
            //define location (position) property
            new go.Binding("location", "location").makeTwoWay(),
            new go.Binding("desiredSize", "visible", v => new go.Size(NaN, NaN)).ofObject("LIST"),
            //panel properties
            {
                selectionAdorned: true,
                resizable: true,
                isShadowed: true,
                shadowOffset: new go.Point(2, 2),
                shadowColor: "#919cab",
                width: 160,
                mouseEnter: (e, node) => showPorts(node, true),
                mouseLeave: (e, node) => showPorts(node, false),
            },
            //define node outer shape
            $(go.Shape, "RoundedRectangle",
                { stroke: STROKE_COLOR, fill: "white", strokeWidth: 2},
            ),            
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true),
            $(go.Panel, "Table",
                {
                    stretch: go.GraphObject.Horizontal
                },
                $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
                // the table header
                $(go.Panel, "Table",
                    {
                        stretch: go.GraphObject.Horizontal,
                        margin: 8,
                    },
                    $(go.TextBlock,
                        {
                            text: "Header",
                            row: 0, alignment: go.Spot.Left,
                            margin: new go.Margin(0, 24, 0, 2),  // leave room for Button
                            stroke: "#000000",
                            editable: true,
                            font: SALESFORCE_FONT_HEADER_TITLE
                        },
                        new go.Binding("text", "headerTitle", text => text?.length > 0 ? text : "Header").makeTwoWay(),
                    ),
                    $(go.TextBlock,
                        {
                            text: "Subtitle",
                            row: 1, alignment: go.Spot.TopLeft,
                            margin: new go.Margin(0, 24, 4, 2),  // leave room for Button
                            stroke: "#000000",
                            editable: true,
                            font: SALESFORCE_FONT_HEADER_SUBTITLE
                        },
                        new go.Binding("text", "headerSubTitle", text => text?.length > 0 ? text : "Subtitle").makeTwoWay(),
                    ),
                    // the collapse/expand button
                    $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
                        { row: 0, alignment: go.Spot.TopRight },
                        new go.Binding("ButtonIcon.stroke", "", n => "#000000")),
                ),
                // the list of attributes           
                $(go.Panel, "Table",
                    { name: "LIST", row: 1, stretch: go.GraphObject.Horizontal, margin: new go.Margin(0, 8, 8, 8),  },
                    $(go.Panel, "Vertical",
                        {
                            name: "attributePanel",
                            alignment: go.Spot.TopLeft,
                            defaultAlignment: go.Spot.Left,
                            itemTemplate: itemTempl,
                            stretch: go.GraphObject.Horizontal,
                            row: 1
                        },
                        
                        new go.Binding("itemArray", "attributes"),
                    )                  
                )
            ),// end Table Panel 
            { 
                contextMenu: // define a context menu for each node
                    $("ContextMenu",
                        createContextMenuButton("Add new attribute", (e, obj) => {
                            addNewRow(obj, false);                            
                        }),
                        createContextMenuButton("Add new key", (e, obj) => {
                            addNewRow(obj, true);
                        })
                        // more ContextMenuButtons would go here
                    )  // end Adornment
            }
        );
    
    addNodeToTemplate(entityNode, "entity", "Entity", "standard:entity");
}

const addUseCaseTemplate = () => {
    const actorNode =
        $(go.Node, "Auto",
            {
                selectionAdorned: false,
                resizable: true,
                resizeObjectName: "ACTOR",
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                mouseEnter: (e, node) => showPorts(node, true),
                mouseLeave: (e, node) => showPorts(node, false),
            },
            new go.Binding("location", "location").makeTwoWay(),            
            $(go.Panel, "Vertical",
                $(go.Panel, "Spot",
                    $(go.Shape,
                        {
                            name: "ACTOR",
                            width: 40,
                            height: 70,
                            strokeWidth: 2,
                            stroke: STROKE_COLOR,
                            fill: "transparent",
                            figure: "Actor",
                            geometryStretch: go.GraphObject.Fill,
                            portId: "",
                        },
                        new go.Binding("desiredSize", "desiredSize").makeTwoWay()
                    ),
                    makePort("T", go.Spot.Top, true, true),
                    makePort("L", go.Spot.Left, true, true), 
                    makePort("R", go.Spot.Right, true, true), 
                    makePort("B", go.Spot.Bottom, true, true) 
                ),
                $(go.TextBlock, { margin: 10, text: "Actor", editable: true, font: SALESFORCE_FONT_BODY },
                    new go.Binding("text", "label").makeTwoWay()),
            )
        );

    const caseNode =
        $(go.Node, "Auto",
            {
                selectionAdorned: false,
                resizable: true,
                resizeObjectName: "CIRCLE",
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides,
                mouseEnter: (e, node) => showPorts(node, true),
                mouseLeave: (e, node) => showPorts(node, false),
            },
            new go.Binding("location", "location").makeTwoWay(),
            $(go.Panel, "Vertical",
                $(go.Panel, "Spot",
                    $(go.Shape,
                        {
                            name: "CIRCLE",
                            width: 100,
                            height: 50,
                            strokeWidth: 2,
                            stroke: STROKE_COLOR,
                            fill: "transparent",
                            figure: "Circle",
                            geometryStretch: go.GraphObject.Fill,
                            portId: "",
                        },
                        new go.Binding("desiredSize", "desiredSize").makeTwoWay()
                    ),
                    $(go.TextBlock,
                    {
                        margin: 10, text: "Use Case", editable: true, font: SALESFORCE_FONT_BODY,
                        alignment: go.Spot.Center, alignmentFocus: go.Spot.Center
                    },
                    new go.Binding("text", "label").makeTwoWay()),
                    makePort("T", go.Spot.Top, true, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, true)
                ),                
            )
        );

    
    addNodeToTemplate(actorNode, "actor", "Actor", "standard:user");
    addNodeToTemplate(caseNode, "case", "Use Case", "standard:quick_text");
}

const addFlowchartTemplate = () => {

    const terminatorNode = createDefaultNode("Terminator", "Start / End");
    const decisionNode = createDefaultNode("Diamond", "Decision");
    const processNode = createDefaultNode("Rectangle", "Process");
    const documentNode = createDefaultNode("Document", "Document");
    const dataNode = createDefaultNode("Parallelogram", "Data");
    const databaseNode = createDefaultNode("Database", "Database");

    addNodeToTemplate(terminatorNode, "terminator", "Terminator", "standard:choice");
    addNodeToTemplate(decisionNode, "diamond", "Decision", "standard:decision");
    addNodeToTemplate(processNode, "process", "Process", "standard:process");
    addNodeToTemplate(documentNode, "document", "Document", "standard:document");
    addNodeToTemplate(dataNode, "data", "Data", "standard:output");
    addNodeToTemplate(databaseNode, "database", "Database", "utility:database");
}

const addLinkTemplate = (fromArrow = "BackwardOpenTriangle", toArrow = "OpenTriangle", fromText, toText, centralText, routing) => {
    const linkTemplate =
        $(go.Link,
            {
                name: "link",
                selectionAdorned: true,
                layerName: "Background",
                reshapable: true,
                resegmentable: true,
                routing: routing,
                corner: 5,
                isShadowed: true,
                shadowOffset: new go.Point(1, 1),
                shadowColor: "#919cab",
            },
            $(go.Shape,  // the link shape
                { stroke: STROKE_COLOR, strokeWidth: 2 }
            ),
            $(go.Shape,  // the arrow to the link
                { toArrow: toArrow, stroke: STROKE_COLOR, fill: "white", strokeWidth: 1, scale: 1.4, segmentOffset: new go.Point(-1.5, 0), name: "TO_ARROW" },
                new go.Binding("toArrow", "toArrow").makeTwoWay()
            ),
            $(go.TextBlock,  // the "to" label
                {
                    text: toText,
                    textAlign: "center",
                    font: SALESFORCE_FONT_BODY,
                    stroke: "black",
                    background: "#C4C4C4",
                    editable: true,
                    segmentIndex: -1,
                    segmentOffset: new go.Point(-30, 0)
                },
                new go.Binding("text", "toText").makeTwoWay()
            ),
            $(go.TextBlock,  // the "central" label
                {
                    text: centralText,
                    textAlign: "center",
                    font: SALESFORCE_FONT_BODY,
                    stroke: "black",
                    background: "#C4C4C4",
                    editable: true,
                    segmentFraction: 0.5,
                },
                new go.Binding("text", "centralText").makeTwoWay()
            ),
            $(go.Shape,  // the arrow from the link
                { fromArrow: fromArrow, stroke: STROKE_COLOR, fill: "white", strokeWidth: 1, scale: 1.4, segmentOffset: new go.Point(1.5, 0), name: "FROM_ARROW" },
                new go.Binding("fromArrow", "fromArrow").makeTwoWay()
            ),
            $(go.TextBlock,  // the "from" label
                {
                    text: fromText,
                    textAlign: "center",
                    font: SALESFORCE_FONT_BODY,
                    stroke: "black",
                    background: "#C4C4C4",
                    editable: true,
                    segmentIndex: 0,
                    segmentOffset: new go.Point(30, 0),
                },
                new go.Binding("text", "fromText").makeTwoWay()
            ),
        )

    addLinkToTemplate(linkTemplate, "", ""); //default link
}


export { addDefaultTemplate, addEntityRelationshipTemplate, addUseCaseTemplate, addFlowchartTemplate, addLinkTemplate };