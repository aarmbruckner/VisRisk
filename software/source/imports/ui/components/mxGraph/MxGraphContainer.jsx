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
      layout: {},
      json: "",
      dragElt: null,
      createVisible: false,
      currentNode: null,
      currentTask: "",
      model:model,
      selectedSurveyNode:this.props.selectedSurveyNode
    };
    this.initGraph = this.initGraph.bind(this);
 
  }

  componentDidMount() {
    //if(this.state.graph)

    let graph = this.initGraph(null,null);
   // let graph = this.initGraph(this.state.graph,this.state.model);

   if(this.state.model)
   {
      this.renderJSON(this.state.model, graph);
   }
 
   let hiddenCanvas = $("#hiddenCanvas")[0];
   let mxGraphDiv =  $("#mxGraphDiv")[0];

   hiddenCanvas.width = mxGraphDiv.getBoundingClientRect().width;
   hiddenCanvas.height = mxGraphDiv.getBoundingClientRect().height;
 
   /* let mxGraphDivPosition = $("#mxGraphDiv").position(); */
   let mxGraphDivPosition = $("#mxGraphDiv").offset();
   $("#hiddenCanvas").css({top: mxGraphDivPosition.top, left:  mxGraphDivPosition.left, position:'fixed'});

   this.graphEventHandler.InitateGradient(this.state.selectedSurveyNode);
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
   
    this.setState({ 
      model:  model,
      selectedSurveyNode:nextProps.selectedSurveyNode
     });

    this.graphEventHandler.InitateGradient(nextProps.selectedSurveyNode);
    this.renderJSON(nextProps.model, this.state.graph);
 
  }

  renderJSON = (dataModel, graph) => {
    const jsonEncoder = new JsonCodec();
    let vertices = {};

    //graph.getModel().clear();
    this.graphEventHandler.ClearGraph(graph);

    if(this.rubberband)
      this.rubberband.setEnabled(true);

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

    let container =  $("#mxGraphDiv")[0];
 
    let height = $("#dashboardTop").height();

    let mainContainer = $(".mainContainer").first();
    let centerAxisBottom = $("#centerAxisBottom").first();

    let centerAxisBottomOuterHeight = centerAxisBottom.outerHeight();
    let graphHeight = mainContainer.height()-centerAxisBottomOuterHeight;
    $("#mxGraphDiv").width(graphHeight);
    $("#mxGraphDiv").height(graphHeight); 
 

    $("#diagramGrid").width(height);
    $("#diagramGrid").height(height);

    $('#diagramGrid').css({"min-width":height});
    $('#diagramGrid').css({"max-width":height});

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

    let boundRect = new mxRectangle(0,0,mxGraphDiv.getBoundingClientRect().width,mxGraphDiv.getBoundingClientRect().height);
    graph.maximumGraphBounds = boundRect;
 
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
        this.setGraphSetting();
        this.initToolbar();
        this.props.setGraphCallback(graph);
 
      }
    );

    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);
  
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
    let { graph } = this.state;

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
 
    if(this.props.editable === true)
      graph = this.MakeRubberBand(graph);

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

    MakeRubberBand(graph)
    {
      this.rubberband = new mxRubberband(graph);

      this.rubberband.defaultOpacity = 20;

      this.rubberband.setEnabled(true); 
  
      let rubberbandMouseDown = this.rubberband.mouseDown;
      this.rubberband.mouseDown = function(sender, me)
      {
        rubberbandMouseDown.apply(this, arguments);
      };

      this.rubberband.mouseUp = (sender, me) =>
      {
  
        let x = me.graphX;
        let y =  me.graphY;

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

          if(this.getEditAllowedState()===true)
          {
            this.graphEventHandler.AddNewRiskRectangle(this.state.graph,x,y,width,height,this.state.selectedSurveyNode);
            this.rubberband.setEnabled(false);
            this.rubberband.reset();
          }
        }


      
      };
      graph.rubberband = this.rubberband;  
      return graph;
    }

  render() {
    return (
      <div className="fillHeight">
         <div className="form-group row fillHeight mxGraphRow">
              <div className="col-md-12 fillHeight" id="mxGraphOuterContainer" >
                <div className="graph-container fillHeight mxGraphDiv" ref="mxGraphDiv" id="mxGraphDiv" />
                <canvas id='hiddenCanvas' className="hiddenCanvas" width='400' height='400'>
      
                </canvas>
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
         
       {/*  <canvas id='hiddenCanvas' className="hiddenCanvas" width='400' height='400'>
      
        </canvas> */}
       
      </div>
    )
  }
}
export default MxGraphContainer;