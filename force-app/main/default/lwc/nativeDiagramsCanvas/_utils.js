import { diagram, $ } from './nativeDiagramsCanvas';
import { SALESFORCE_FONT_HEADER_TITLE, SALESFORCE_FONT_HEADER_SUBTITLE, SALESFORCE_FONT_BODY, STROKE_COLOR } from "./_consts";

const addNodeToTemplate = (part, name, label, icon) => {
    part.name = name;
    part.label = label;
    part.icon = icon;
    diagram.nodeTemplateMap.add(name, part);
}

const addLinkToTemplate = (part, name, label) => {
    part.name = name;
    part.label = label;
    diagram.linkTemplateMap.add(name, part);
}

const makePort = (name, spot, output, input) => {
    // the port is basically just a small transparent circle
    return $(go.Shape, "Circle",
        {
            name: name,
            fill: null,  // not seen, by default; set to a translucent gray by showPorts
            stroke: null,
            desiredSize: new go.Size(10, 10),
            alignment: spot,  // align the port on the main Shape
            alignmentFocus: spot,  // just inside the Shape
            portId: name,  // declare this object to be a "port"
            fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
            fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
            fromLinkableSelfNode: output, toLinkableSelfNode: input,
            cursor: "pointer"  // show a different cursor to indicate potential link point
        });
}

const showPorts = (node, show) => {
    node.ports.each(port => {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
            port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
    });
}

const createDefaultNode = (figure, label) => {
    return $(go.Node, "Auto",
        {
            selectionAdorned: false,
            resizable: true,
            resizeObjectName: figure,
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
                        name: figure,
                        width: 100,
                        height: 50,
                        strokeWidth: 2,
                        stroke: STROKE_COLOR,
                        fill: "transparent",
                        figure: figure,
                        geometryStretch: go.GraphObject.Fill,
                        portId: "",
                    },
                    new go.Binding("desiredSize", "desiredSize").makeTwoWay()
                ),
                $(go.TextBlock,
                    {
                        margin: 10, text: label, editable: true, font: SALESFORCE_FONT_BODY,
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
}

const createContextMenuButton = (label, clickFunction) => {
    return $("ContextMenuButton",
        {
            "ButtonBorder.fill": "white",
            "_buttonFillOver": "skyblue"
        },
        $(go.TextBlock, label),
        {
            click: (e, obj) => clickFunction(e, obj)
        }
    );
}

export { addNodeToTemplate, addLinkToTemplate, makePort, showPorts, createDefaultNode, createContextMenuButton };