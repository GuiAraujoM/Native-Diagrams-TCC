var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);

const addActorFigure = () => {
    go.Shape.defineFigureGenerator("Actor", function (shape, w, h) {
        var geo = new go.Geometry();
        var radiusw = .2;
        var radiush = .1;
        var offsetw = KAPPA * radiusw;
        var offseth = KAPPA * radiush;
        var centerx = .5;
        var centery = .1;
        var fig = new go.PathFigure(centerx * w, (centery + radiush) * h, true);
        geo.add(fig);

        // Head
        fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radiusw) * w, centery * h, (centerx - offsetw) * w, (centery + radiush) * h,
            (centerx - radiusw) * w, (centery + offseth) * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radiush) * h, (centerx - radiusw) * w, (centery - offseth) * h,
            (centerx - offsetw) * w, (centery - radiush) * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radiusw) * w, centery * h, (centerx + offsetw) * w, (centery - radiush) * h,
            (centerx + radiusw) * w, (centery - offseth) * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radiush) * h, (centerx + radiusw) * w, (centery + offseth) * h,
            (centerx + offsetw) * w, (centery + radiush) * h));
        var r = .05;
        var cpOffset = KAPPA * r;
        centerx = .05;
        centery = .25;
        var fig2 = new go.PathFigure(.5 * w, .2 * h, true);
        geo.add(fig2);
        // Body
        fig2.add(new go.PathSegment(go.PathSegment.Line, .95 * w, .2 * h));
        centerx = .95;
        centery = .25;
        // Right arm
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + r) * w, centery * h, (centerx + cpOffset) * w, (centery - r) * h,
            (centerx + r) * w, (centery - cpOffset) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, .6 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .85 * w, .6 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .85 * w, .35 * h));
        r = .025;
        cpOffset = KAPPA * r;
        centerx = .825;
        centery = .35;
        // Right under arm
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
            (centerx + cpOffset) * w, (centery - r) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
            (centerx - r) * w, (centery - cpOffset) * h));
        // Right side/leg
        fig2.add(new go.PathSegment(go.PathSegment.Line, .8 * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .55 * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .55 * w, .7 * h));
        // Right in between
        r = .05;
        cpOffset = KAPPA * r;
        centerx = .5;
        centery = .7;
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
            (centerx + cpOffset) * w, (centery - r) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
            (centerx - r) * w, (centery - cpOffset) * h));
        // Left side/leg
        fig2.add(new go.PathSegment(go.PathSegment.Line, .45 * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .2 * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .2 * w, .35 * h));
        r = .025;
        cpOffset = KAPPA * r;
        centerx = .175;
        centery = .35;
        // Left under arm
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
            (centerx + cpOffset) * w, (centery - r) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
            (centerx - r) * w, (centery - cpOffset) * h));
        // Left arm
        fig2.add(new go.PathSegment(go.PathSegment.Line, .15 * w, .6 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0, .6 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0, .25 * h));
        r = .05;
        cpOffset = KAPPA * r;
        centerx = .05;
        centery = .25;
        // Left shoulder
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx - r) * w, (centery - cpOffset) * h,
            (centerx - cpOffset) * w, (centery - r) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, .5 * w, .2 * h));
        geo.spot1 = new go.Spot(.2, .2);
        geo.spot2 = new go.Spot(.8, .65);
        return geo;
    });
}

const addTerminatorFigure = () => {
    go.Shape.defineFigureGenerator("Terminator", function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(.25 * w, 0, true);
        geo.add(fig);

        fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, .75 * w, 0.5 * h, .25 * w, .5 * h));
        fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, .25 * w, 0.5 * h, .25 * w, .5 * h));
        geo.spot1 = new go.Spot(.23, 0);
        geo.spot2 = new go.Spot(.77, 1);
        return geo;
    });
}

const addDocumentFigure = () => {
    go.Shape.defineFigureGenerator("Document", function (shape, w, h) {
        var geo = new go.Geometry();
        h = h / .8;
        var fig = new go.PathFigure(0, .7 * h, true);
        geo.add(fig);

        fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, .7 * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, .7 * h, .5 * w, .4 * h, .5 * w, h).close());
        geo.spot1 = go.Spot.TopLeft;
        geo.spot2 = new go.Spot(1, .6);
        return geo;
    });
}

const addParallelogramFigure = () => {
    go.Shape.defineFigureGenerator("Parallelogram", function (shape, w, h) {
        var param1 = shape ? shape.parameter1 : NaN; // indent's x distance
        if (isNaN(param1)) param1 = 10;
        else if (param1 < -w) param1 = -w;
        else if (param1 > w) param1 = w;
        var indent = Math.abs(param1);

        if (param1 === 0) {
            var geo = new go.Geometry(go.Geometry.Rectangle);
            geo.startX = 0;
            geo.startY = 0;
            geo.endX = w;
            geo.endY = h;
            return geo;
        } else {
            var geo = new go.Geometry();
            if (param1 > 0) {
                geo.add(new go.PathFigure(indent, 0)
                    .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                    .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                    .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
            } else {  // param1 < 0
                geo.add(new go.PathFigure(0, 0)
                    .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                    .add(new go.PathSegment(go.PathSegment.Line, w, h))
                    .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()));
            }
            if (indent < w / 2) {
                geo.setSpots(indent / w, 0, (w - indent) / w, 1);
            }
            return geo;
        }
    });
}

const addDatabaseFigure = () => {
    go.Shape.defineFigureGenerator("Database", function (shape, w, h) {
        var geo = new go.Geometry();
        var cpxOffset = KAPPA * .5;
        var cpyOffset = KAPPA * .1;
        var fig = new go.PathFigure(w, .1 * h, true);
        geo.add(fig);

        // Body
        fig.add(new go.PathSegment(go.PathSegment.Line, w, .9 * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, h, w, (.9 + cpyOffset) * h,
            (.5 + cpxOffset) * w, h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, .9 * h, (.5 - cpxOffset) * w, h,
            0, (.9 + cpyOffset) * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, .1 * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, 0, 0, (.1 - cpyOffset) * h,
            (.5 - cpxOffset) * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, w, .1 * h, (.5 + cpxOffset) * w, 0,
            w, (.1 - cpyOffset) * h));
        var fig2 = new go.PathFigure(w, .1 * h, false);
        geo.add(fig2);
        // Rings
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .2 * h, w, (.1 + cpyOffset) * h,
            (.5 + cpxOffset) * w, .2 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .1 * h, (.5 - cpxOffset) * w, .2 * h,
            0, (.1 + cpyOffset) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Move, w, .2 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .3 * h, w, (.2 + cpyOffset) * h,
            (.5 + cpxOffset) * w, .3 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .2 * h, (.5 - cpxOffset) * w, .3 * h,
            0, (.2 + cpyOffset) * h));
        fig2.add(new go.PathSegment(go.PathSegment.Move, w, .3 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, .5 * w, .4 * h, w, (.3 + cpyOffset) * h,
            (.5 + cpxOffset) * w, .4 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, .3 * h, (.5 - cpxOffset) * w, .4 * h,
            0, (.3 + cpyOffset) * h));
        geo.spot1 = new go.Spot(0, .4);
        geo.spot2 = new go.Spot(1, .9);
        return geo;
    });
}

export { addActorFigure, addTerminatorFigure, addDocumentFigure, addParallelogramFigure, addDatabaseFigure };