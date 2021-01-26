import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

//import mxClient from "script-loader!mxgraph/javascript/mxClient";
import {
  mxGraph,
  mxGraphModel,
  mxParallelEdgeLayout,
  mxConstants,
  mxEdgeStyle,
  mxLayoutManager,
  mxCell,
  mxGeometry,
  mxRubberband,
  mxDragSource,
  mxKeyHandler,
  mxCodec,
  mxClient,
  mxConnectionHandler,
  mxUtils,
  mxEditor,
  mxToolbar,
  mxEvent,
  mxImage,
  mxFastOrganicLayout,
  mxDefaultToolbar,
  mxGraphHandler,
  mxGuide,
  mxEdgeHandler,
  mxUndoManager,
  mxObjectCodec,
  mxHierarchicalLayout,
  mxConnectionConstraint,
  mxCellState,
  mxPoint,
  mxRectangle,
  mxPerimeter,
  mxCompactTreeLayout,
  mxCellOverlay,
  mxConstraintHandler 
} from "mxgraph-js";

import JsonCodec from '../../../API/Modules/MxGraph/Extensions/JsonCodec';
import MxCellAttributeChange from '../../../API/Modules/MxGraph/Extensions/MxCellAttributeChange';
import GraphEventHandler from '../../../API/Modules/MxGraph/Eventhandling/GraphEventHandler';
import MxGraphUtilities from '../../../API/Modules/MxGraph/Extensions/MxGraphUtilities';

class MxGraphContainer extends Component {

  constructor(props) {
    super(props);
    this.graphEventHandler = new GraphEventHandler();
    let model = this.props.model;
    this.state = {
     // graph: this.props.graph,
      layout: {},
      json: "",
      dragElt: null,
      createVisible: false,
      currentNode: null,
      currentTask: "",
      model:model,
    };
    this.initGraph = this.initGraph.bind(this);
   /*  if(model)
      this.loadModel(this.props.graph,model); */
 
  }

  componentDidMount() {
    //if(this.state.graph)

    let graph = this.initGraph(null,null);
   // let graph = this.initGraph(this.state.graph,this.state.model);

   if(this.state.model)
   {
    //let parsedModel = JSON.parse(this.state.model);
    //if(parsedModel)
      this.renderJSON(this.state.model, graph);
   }
 
  /*   if(this.state.model)
      this.loadModel(graph,this.state.model); */
  } 

 /*  loadModel(graph,model){
    if(graph)
    {
      this.graphEventHandler.ClearGraph(graph);
      
      //graph.model.beginUpdate();
      let doc = mxUtils.parseXml(model[0]);
      let codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());
      let newModel = graph.getModel();
      this.setState({
        graph: graph,
        model:newModel
      });
      this.initGraph(graph,newModel);
      //graph.model.endUpdate();
    }
 
  } */
  
  componentWillReceiveProps(nextProps){
/*     let graph = this.state.graph;
    this.setState({ graph:  nextProps.graph });
    graph = nextProps.graph; */
    let model = nextProps.model
    if(!model || !Array.isArray(model))
    {
      model = [];
    }
    this.setState({ model:  model });
    this.renderJSON(nextProps.model, this.state.graph);
  
  }

  renderJSON = (dataModel, graph) => {
    const jsonEncoder = new JsonCodec();
    let vertices = {};

    graph.getModel().clear();
    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate(); // Adds cells to the model in a single step
    try {
      dataModel && dataModel.map(node => {
          if (node.value) {
            if (typeof node.value === "object") {
              const xmlNode = jsonEncoder.encode(node.value);
              vertices[node.id] = graph.insertVertex(
                parent,
                null,
                xmlNode,
                node.geometry.x,
                node.geometry.y,
                node.geometry.width,
                node.geometry.height,
                node.style
              );
            } else if (node.value === "Edge") {
              graph.insertEdge(
                parent,
                null,
                "Edge",
                vertices[node.source],
                vertices[node.target],
                node.style
              );
            }
          }
        });
    } finally {
      graph.getModel().endUpdate(); // Updates the display
    }
  };

/*   getJsonModel = graph => {
    const encoder = new JsonCodec();
    const jsonModel = encoder.decode(graph.getModel());
    return {
      graph: jsonModel
    };
  }; */


/*   addOverlays = (graph, cell) => {
    var overlay = new mxCellOverlay(
      new mxImage(
        "https://uploads.codesandbox.io/uploads/user/4bf4b6b3-3aa9-4999-8b70-bbc1b287a968/jEU_-add.png",
        16,
        16
      ),
      "load more"
    );
    console.log("overlay");
    overlay.cursor = "hand";
    overlay.align = mxConstants.ALIGN_CENTER;
    overlay.offset = new mxPoint(0, 10);
    overlay.addListener(
      mxEvent.CLICK,
      mxUtils.bind(this, function(sender, evt) {
        console.log("load more");
        // addChild(graph, cell);
      })
    );

    graph.addCellOverlay(cell, overlay);
  }; */
  handleCancel = () => {
    this.setState({ createVisible: false });
    this.state.graph.removeCells([this.state.currentNode]);
  };
  handleConfirm = fields => {
    const { graph } = this.state;
    const cell = graph.getSelectionCell();
    this.applyHandler(graph, cell, "text", fields.taskName);
    this.applyHandler(graph, cell, "desc", fields.taskDesc);
    cell.setId(fields.id || 100);
    this.setState({ createVisible: false });
  };
  applyHandler = (graph, cell, name, newValue) => {
    graph.getModel().beginUpdate();
    try {
      const edit = new MxCellAttributeChange(cell, name, newValue);
      // console.log(edit)
      graph.getModel().execute(edit);
      // graph.updateCellSize(cell);
    } finally {
      graph.getModel().endUpdate();
    }
  };
  graphF = evt => {
    const { graph } = this.state;
    var x = mxEvent.getClientX(evt);
    var y = mxEvent.getClientY(evt);
    var elt = document.elementFromPoint(x, y);
    if (mxUtils.isAncestorNode(graph.container, elt)) {
      return graph;
    }
    return null;
  };
  loadGlobalSetting = () => {
    // Enable alignment lines to help locate
    mxGraphHandler.prototype.guidesEnabled = true;
    // Alt disables guides
    mxGuide.prototype.isEnabledForEvent = function(evt) {
      return !mxEvent.isAltDown(evt);
    };
    // Specifies if waypoints should snap to the routing centers of terminals
    mxEdgeHandler.prototype.snapToTerminals = true;
    mxConstraintHandler.prototype.pointImage = new mxImage(
      "https://uploads.codesandbox.io/uploads/user/4bf4b6b3-3aa9-4999-8b70-bbc1b287a968/-q_3-point.gif",
      5,
      5
    );
  };
  getEditPreview = () => {
    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width = "120px";
    dragElt.style.height = "40px";
    return dragElt;
  };
 /*  createDragElement = () => {
    const { graph } = this.state;
    const tasksDrag = ReactDOM.findDOMNode(
      this.refs.mxSidebar
    ).querySelectorAll(".task");
    Array.prototype.slice.call(tasksDrag).forEach(ele => {
      const value = ele.getAttribute("data-value");
      let ds = mxUtils.makeDraggable(
        ele,
        this.graphF,
        (graph, evt, target, x, y) =>
          this.funct(graph, evt, target, x, y, value),
        this.dragElt,
        null,
        null,
        graph.autoscroll,
        true
      );
      ds.isGuidesEnabled = function() {
        return graph.graphHandler.guidesEnabled;
      };
      ds.createDragElement = mxDragSource.prototype.createDragElement;
    });
  }; */
/*   selectionChanged = (graph, value) => {
    console.log("visible");
    this.setState({
      createVisible: true,
      currentNode: graph.getSelectionCell(),
      currentTask: value
    });
  };   */
 /*  createPopupMenu = (graph, menu, cell, evt) => {
    if (cell) {
      if (cell.edge === true) {
        menu.addItem("Delete connection", null, function() {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      } else {
        menu.addItem("Edit child node", null, function() {
          // mxUtils.alert('Edit child node: ');
          // selectionChanged(graph)
        });
        menu.addItem("Delete child node", null, function() {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      }
    }
  }; */
  initGraph  (graph,model)  {

    //let container = $("#mxGraphDiv").first();

    //let container = document.getElementById("mxGraphDiv");
    let container =  $("#mxGraphDiv")[0];

    //let container = ReactDOM.findDOMNode(this.refs.mxGraphDiv);
    //var zoomPanel = ReactDOM.findDOMNode(this.refs.divZoom);

    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
      return;
    }
    
    if(!model)
    {
      model = new mxGraphModel();
    }
    
    if(!graph)
    {
      graph = new mxGraph(container, model);
    }

    // Enables moving of relative children
    graph.isCellLocked = function(cell)
    {
      return false;
    };

   /*  graph.autoExtend = false;
    graph.allowAutoPanning = false; */
    let boundRect   = new mxRectangle(0,0,mxGraphDiv.getBoundingClientRect().width,mxGraphDiv.getBoundingClientRect().height);
    graph.maximumGraphBounds = boundRect;
    // Replaces translation for relative children
/*     graph.translateCell = function(cell, dx, dy)
    {
      let utilities = new MxGraphUtilities(); 
      var rel = utilities.getRelativePosition(graph,this.view.getState(cell), dx * graph.view.scale, dy * graph.view.scale);
      
      if (rel != null)
      {
        var geo = this.model.getGeometry(cell);
        
        if (geo != null && geo.relative)
        {
          geo = geo.clone();
          geo.x = rel.x;
          geo.y = rel.y;
          
          this.model.setGeometry(cell, geo);
        }
      }
      else
      {
        mxGraph.prototype.translateCell.apply(this, arguments);
      }
    }; */

  /*   graph.translateCell = function(cell, dx, dy)
    {
      let x = graph.view.scale;
      var margin = 2;
      var max = 3;
      
      var bounds = graph.getGraphBounds();
      var cw = graph.container.clientWidth - margin;
      var ch = graph.container.clientHeight - margin;
      var w = bounds.width / graph.view.scale;
      var h = bounds.height / graph.view.scale;
      var s = Math.min(max, Math.min(cw / w, ch / h));
      
      graph.view.scaleAndTranslate(s,
        (margin + cw - w * s) / (2 * s) - bounds.x / graph.view.scale,
        (margin + ch - h * s) / (2 * s) - bounds.y / graph.view.scale); 
      mxGraph.prototype.translateCell.apply(this, arguments);
    };  */

    // Replaces move preview for relative children
  /*   graph.graphHandler.getDelta = function(me)
    {
      var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
      var delta = new mxPoint(point.x - this.first.x, point.y - this.first.y);
      
      if (this.cells != null && this.cells.length > 0 && this.cells[0] != null)
      {
        var state = this.graph.view.getState(this.cells[0]);
        let utilities = new MxGraphUtilities(); 
        var rel = utilities.getRelativePosition(this.graph,state, delta.x, delta.y);
        
        if (rel != null)
        {
          var pstate = this.graph.view.getState(this.graph.model.getParent(state.cell));
          
          if (pstate != null)
          {
            delta = new mxPoint(pstate.x + pstate.width * rel.x - state.getCenterX(),
                pstate.y + pstate.height * rel.y - state.getCenterY());
          }
        }
      }
      
      return delta;
    }; */

    //this.props.setGraphCallback(graph);
    this.setState(
      {
        graph: graph,
        dragElt: this.getEditPreview()
      },
      () => {
        console.log(this);
        // layout
        const layout = new mxCompactTreeLayout(graph, false);
        this.setState({ layout });
        //this.setLayoutSetting(layout);
       // this.loadGlobalSetting();
        this.setGraphSetting();
        this.initToolbar();
       // this.settingConnection();
       // this.createDragElement();
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
      /*   graph.getModel().beginUpdate();
        graph.getModel().endUpdate(); */
        this.props.setGraphCallback(graph);
 
      }
    );

    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);

   /*  graph
    .getSelectionModel()
    .addListener(mxEvent.CHANGE, this.selectionChanged); */
  

    //graph.addListener(mxEvent.CLICK,  (sender, evt) => {

      /* if(this.getEditAllowedState()===true)
        this.addNewRiskRectangle(evt.properties.event.layerX,evt.properties.event.layerY) */

      /* let parent = graph.getDefaultParent();
      var doc = mxUtils.createXmlDocument();
      var obj = doc.createElement("RiskObject");

      let cell = graph.insertVertex(
        parent,
        null,
        obj,
        evt.properties.event.layerX,
        evt.properties.event.layerY,
        150,
        60,
        "strokeColor=#000000;strokeWidth=1;fillColor=white"
      );   */
 
    //  evt.consume();
  //});
  
    /* // Creates the graph inside the given container
    let config = mxUtils.load(Meteor.settings.public.graphEditor.editorTemplate).getDocumentElement();

    let editor = new mxEditor(config);
    // Adds active border for panning inside the container
    editor.graph.createPanningManager = function()
    {
      var pm = new mxPanningManager(this);
      pm.border = 30;
      
      return pm;
    };
 

    new mxRubberband(graph);
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    this.createDragElement();
    let parent = graph.getDefaultParent();
 
    // Adds cells to the model in a single step
    model.beginUpdate();
    let layout = new mxParallelEdgeLayout(graph);

    // Moves stuff wider apart than usual
    layout.forceConstant = 140;

    try {
        const v1 = graph.insertVertex(parent, null, "Hello", 20, 20, 80, 30);
        const v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
        graph.insertEdge(parent, null, "", v1, v2);

        layout.execute(parent);
    } catch (e) {
        console.error("An error has occurred.", e);
    } finally {
        model.endUpdate();
    }  */

    let cellMovedEvent = (graph, value) => {
      let movedCell = value.properties.cells[0];
      this.graphEventHandler.RedrawRiskRectangle(graph,movedCell);
    };

    let cellResizedEvent = (graph, value) => {
      let movedCell = value.properties.cells[0];
      this.graphEventHandler.RedrawRiskRectangle(graph,movedCell);
    };

    graph.addListener(mxEvent.CELLS_MOVED,cellMovedEvent);
    graph.addListener(mxEvent.CELLS_RESIZED,cellResizedEvent);
    return graph;
  }

 
 

  getEditAllowedState()
  {
    let parent = this.state.graph.getDefaultParent();
    let children = parent.children;
    if(children && children.length>0)
      return false;
    return true;
  }

  setLayoutSetting = layout => {
    layout.parallelEdgeSpacing = 10;
    layout.useBoundingBox = false;
    layout.edgeRouting = false;
    layout.levelDistance = 60;
    layout.nodeDistance = 16;
    layout.isVertexMovable = function(cell) {
      return true;
    };
/*     layout.localEdgeProcessing = function(node) {
      console.log(node);
    }; */
  };

  initToolbar = () => {
    const that = this;
    const { graph, layout } = this.state;
    // 放大按钮
   // var toolbar = ReactDOM.findDOMNode(this.refs.toolbar);
   /*  toolbar.appendChild(
      mxUtils.button("zoom(+)", function(evt) {
        graph.zoomIn();
      })
    );
    // 缩小按钮
    toolbar.appendChild(
      mxUtils.button("zoom(-)", function(evt) {
        graph.zoomOut();
      })
    );
    // 还原按钮
    toolbar.appendChild(
      mxUtils.button("restore", function(evt) {
        graph.zoomActual();
        const zoom = { zoomFactor: 1.2 };
        this.props.setGraphCallback(graph);
        that.setState({
          graph: { ...graph, ...zoom }
        });
      })
    ); */

    var undoManager = new mxUndoManager();
    var listener = function(sender, evt) {
      undoManager.undoableEditHappened(evt.getProperty("edit"));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

   /*  toolbar.appendChild(
      mxUtils.button("undo", function() {
        undoManager.undo();
      })
    );

    toolbar.appendChild(
      mxUtils.button("redo", function() {
        undoManager.redo();
      })
    );
    toolbar.appendChild(
      mxUtils.button("Automatic layout", function() {
        graph.getModel().beginUpdate();
        try {
          that.state.layout.execute(graph.getDefaultParent());
        } catch (e) {
          throw e;
        } finally {
          graph.getModel().endUpdate();
        }
      })
    ); */
/* 
    toolbar.appendChild(
      mxUtils.button("view XML", function() {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        mxUtils.popup(mxUtils.getXml(node), true);
      })
    );
    toolbar.appendChild(
      mxUtils.button("view JSON", function() {
        const jsonNodes = that.getJsonModel(graph);
        let jsonStr = that.stringifyWithoutCircular(jsonNodes);
        localStorage.setItem("json", jsonStr);
        that.setState({
          json: jsonStr
        });
        console.log(jsonStr);
      })
    );
    toolbar.appendChild(
      mxUtils.button("render JSON", function() {
        that.renderJSON(JSON.parse(that.state.json), graph);
      })
    ); */
  };

  setGraphSetting = () => {
    const { graph } = this.state;

    const that = this;
    graph.gridSize = 30;
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.setConnectable(false);
    graph.setCellsEditable(true);
    graph.setEnabled(true);
    // Enables HTML labels
    graph.setHtmlLabels(true);
    graph.centerZoom = true;
    // Autosize labels on insert where autosize=1
    graph.autoSizeCellsOnAdd = true;

    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindKey(46, function(evt) {
      if (graph.isEnabled()) {
        const currentNode = graph.getSelectionCell();
        if (currentNode.edge === true) {
          graph.removeCells([currentNode]);
        }
      }
    });
    keyHandler.bindKey(37, function() {
      console.log(37);
    });

    this.rubberband = new mxRubberband(this.state.graph);
  
    this.rubberband.defaultOpacity = 20;
    graph.rubberband = this.rubberband;  
    this.rubberband.setEnabled(true);
    this.rubberbandMouseUp = this.rubberband.mouseUp;

    this.rubberband.mouseDown = (sender, evt) =>
    {
    };

    this.rubberband.mouseUp = (sender, evt) =>
    {
        let x = evt.graphX;
        let y =  evt.graphY;

        let rubberBandDiv = $(".mxRubberband").get(0);

        let width = 150;
        let height = 50;

        if(rubberBandDiv)
        {
          width = rubberBandDiv.style.width;
          height = rubberBandDiv.style.height;
          width = width.replace("px", "");
          height = height.replace("px", "");

          width = parseInt(width);
          height = parseInt(height);
        }


        if(this.getEditAllowedState()===true)
        {
          this.graphEventHandler.AddNewRiskRectangle(this.state.graph,x,y,width,height);
          //$('.mxRubberband').hide();
          this.rubberband.setEnabled(false);
          this.rubberband.reset();
        }
        //mxEvent.consume(evt);
    };

    graph.getTooltipForCell = function(cell) {
      return cell.getAttribute("desc");
    };

    var style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_FILLCOLOR] = "#C3D9FF";
    style[mxConstants.STYLE_STROKECOLOR] = "#6482B9";
    style[mxConstants.STYLE_FONTCOLOR] = "#774400";
    style[mxConstants.HANDLE_FILLCOLOR] = "#80c6ee";
    graph.getStylesheet().putDefaultVertexStyle(style);
    style = [];
    style[mxConstants.STYLE_STROKECOLOR] = "#f90";
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    style[mxConstants.STYLE_FONTSIZE] = "10";
    style[mxConstants.VALID_COLOR] = "#27bf81";

    graph.getStylesheet().putDefaultEdgeStyle(style);
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
     // return that.createPopupMenu(graph, menu, cell, evt);
    };
    graph.convertValueToString = function(cell) {
      if (
        mxUtils.isNode(cell.value) &&
        cell.value.nodeName.toLowerCase() == "taskobject"
      ) {
        // Returns a DOM for the label
        var div = document.createElement("div");
        div.setAttribute("class", "taskWrapper");
        div.innerHTML = `<span className='riskTitle'>${cell.getAttribute(
          "text",
          ""
        )}</span>`; 
        mxUtils.br(div);

        var p = document.createElement("p");
        p.setAttribute("className", "taskName");
        p.innerHTML = cell.getAttribute("label");
        div.appendChild(p);

        return div;
      }
      return "";
    };
  };

  render() {
    return (
      <div className="fillHeight">
         <div className="form-group row fillHeight mxGraphRow">
              <div className="col-md-12 fillHeight" id="mxGraphOuterContainer" >
                <div className="graph-container fillHeight mxGraphDiv" ref="mxGraphDiv" id="mxGraphDiv" />
              </div>
              <div className="changeInput" style={{ zIndex: 10 }} />
              {this.state.createVisible && (
                <CreateTaskNode
                  currentTask={this.state.currentTask}
                  visible={this.state.createVisible}
                  handleCancel={this.handleCancel}
                  handleConfirm={this.handleConfirm}
                />
              )}
        </div>
        <linearGradient id="gradient">
          <stop offset="5%" stopColor="#FFC338" />
          <stop offset="95%" stopColor="#FFEA68" />
        </linearGradient>
         
        <canvas id='hiddenCanvas' className="hiddenCanvas" width='400' height='400'>
      
        </canvas>
       
      </div>
    )
  }
}
export default MxGraphContainer;