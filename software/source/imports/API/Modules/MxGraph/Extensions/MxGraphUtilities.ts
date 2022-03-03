import {
  mxPoint
} from "mxgraph-js";

export default class MxGraphUtilities {
   
    constructor() {
     
    }

    public CombineCellsIntoGraph(cellArray)
    {
      let combinedGraph = null;
      if(cellArray && cellArray.length >0)
      {
        combinedGraph.importCells(cellArray, 0, 0, combinedGraph.defaultParent);
      }
       /*  cellArray.forEach(graph => {
          //let cells = graph.getCells();
          //et exportCells = graph.getExportableCells(cells);
          combinedGraph.importCells(cellArray, 0, 0, combinedGraph.defaultParent);
        }); */
      return combinedGraph;
    }

     // Returns the relative position of the given child
    public getRelativePosition(graph,state, dx, dy)
    {
      if (state != null)
      {
        var model = graph.getModel();
        var geo = model.getGeometry(state.cell);
        
        if (geo != null && geo.relative && !model.isEdge(state.cell))
        {
          var parent = model.getParent(state.cell);
          
          if (model.isVertex(parent))
          {
            var pstate = graph.view.getState(parent);
            
            if (pstate != null)
            {
              var scale = graph.view.scale;
              var x = state.x + dx;
              var y = state.y + dy;
              
              if (geo.offset != null)
              {
                x -= geo.offset.x * scale;
                y -= geo.offset.y * scale;
              }
              
              x = (x - pstate.x) / pstate.width;
              y = (y - pstate.y) / pstate.height;
              
              if (Math.abs(y - 0.5) <= Math.abs((x - 0.5) / 2))
              {
                x = (x > 0.5) ? 1 : 0;
                y = Math.min(1, Math.max(0, y));
              }
              else
              {
                x = Math.min(1, Math.max(0, x));
                y = (y > 0.5) ? 1 : 0;
              }
              
              return new mxPoint(x, y);
            }
          }
        }
      }
      
      return null;
    };
 
  }