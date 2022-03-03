declare var logger: any;
import JsonCodec from '../Extensions/JsonCodec';
import IStorageHandler from '../../StorageHandling/IStorageHandler';
import MxGraphUtilities from '../Extensions/MxGraphUtilities';

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
    mxPerimeter,
    mxCompactTreeLayout,
    mxCellOverlay,
    mxConstraintHandler 
  } from "mxgraph-js";
import Calculator from '../../Calculator/Calculator';
import SurveyModel from '../../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import LogInfoModel from '../../../Models/ModelTemplates/LogInfoModel/LogInfoModel';

declare var storageHandlerInstance: IStorageHandler;

class GraphEventHandler {
  gradientReaderInstance:any;

  constructor( ) {

  }

  GradientReader(colorStops) {
 
    let hiddenCanvas = $("#hiddenCanvas")[0];
    let mxGraphDiv =  $("#mxGraphDiv")[0];

    hiddenCanvas.width = mxGraphDiv.getBoundingClientRect().width;
    hiddenCanvas.height = mxGraphDiv.getBoundingClientRect().height;

    let ctx = hiddenCanvas.getContext('2d');
    let gradient = ctx.createLinearGradient(0, hiddenCanvas.width*0.3 , hiddenCanvas.height*0.3  , 0);
    
    let i = 0;
    let cs = null;

    for(; cs = colorStops[i++];)  // add color stops
      gradient.addColorStop(cs.stop, cs.color);

    ctx.fillStyle = gradient; // set as fill style
    ctx.fillRect(0, 0, hiddenCanvas.width,hiddenCanvas.height);  // draw a single line

    // method to get color of gradient at % position [0, 100]
    this.getColor = function(pstX,pstY) {
        return ctx.getImageData(pstX,pstY, 1, 1).data;
    };
  }

    public RedrawRiskRectangle(graph,changedCell)
    {
 
 
      /* this.InitateGradient();

      let cellWidth = changedCell.geometry.width;
      let cellHeight = changedCell.geometry.height;
      let cellX = changedCell.geometry.x;
      let cellY = changedCell.geometry.y;

      let style=graph.getModel().getStyle(changedCell);

      let hiddenCanvas = $("#hiddenCanvas")[0];
      // x,y are position in the original canvas you want to take part of the image
      // desiredWidth,desiredHeight is the size of the image you want to have
      // get raw image data
      let imageContentRaw = hiddenCanvas.getContext('2d').getImageData(cellX,cellY,cellWidth,cellHeight);
      // create new canvas
      let tempCanvas = document.createElement('canvas');
      // with the correct size
      tempCanvas.width = cellWidth;
      tempCanvas.height = cellHeight;
      // put there raw image data
      // expected to be faster as tere are no scaling, etc
      tempCanvas.getContext('2d').putImageData(imageContentRaw, 0, 0);
      // get image data (encoded as bas64)
      let dataUrl =  tempCanvas.toDataURL("image/png", 1.0)
      dataUrl = dataUrl.replace(";base64", "");

      let newStyle=mxUtils.setStyle(style,mxConstants.STYLE_IMAGE,dataUrl); 

      let cs= new Array();
      cs[0]=changedCell;
      graph.setCellStyle(newStyle,cs); */
    }

    public InitateGradient(selectedSurveyNode)
    {

      let convertedColorStops = 
      [{stop: 0.0, color: Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[0]},
      {stop: 1.0, color: Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[1]}];

      if(selectedSurveyNode && selectedSurveyNode.gridConfigModel && selectedSurveyNode.gridConfigModel.colorStops)
      {
        let colorStops = selectedSurveyNode.gridConfigModel.colorStops;
        convertedColorStops = [];
        let count = 0.0;
        for(let stop of colorStops)
        {
          convertedColorStops.push({stop: count, color: stop});
          count = count + 1.0;
        }
      }

      let gradientReaderInstance = new this.GradientReader(convertedColorStops);
    }

    public AddNewRiskRectangle(graph,insertX,insertY,width,height,selectedSurveyNode)
    {
      let parent = graph.getDefaultParent();
      var doc = mxUtils.createXmlDocument();
  
      if(!width)
        width = 150;

      if(!height)
        height = 50;  
  
        this.InitateGradient(selectedSurveyNode);
        
 
        insertX = insertX-width;
        insertY = insertY-height;

        //let obj = doc.createElement("div");  
        let obj = {};

        obj.userId = Session.get('userId');
        
        let riskRectangleColor =  Meteor.settings.public.defaultGraphConfigurations.gridConfig.riskRectangleColor;

        if(selectedSurveyNode && selectedSurveyNode.gridConfigModel && selectedSurveyNode.gridConfigModel.riskRectangleColor)
        {
          riskRectangleColor = selectedSurveyNode.gridConfigModel.riskRectangleColor;
        }

        let cell = graph.insertVertex(
          parent,
          null,
          obj,
          insertX,
          insertY,
          width,
          height,
          'defaultVertex;strokeColor='+riskRectangleColor+';fillColor='+riskRectangleColor
        ); 
/* 
      let hiddenCanvas = $("#hiddenCanvas")[0];
      // x,y are position in the original canvas you want to take part of the image
      // desiredWidth,desiredHeight is the size of the image you want to have
      // get raw image data
      let imageContentRaw = hiddenCanvas.getContext('2d').getImageData(insertX,insertY,width,height);
      // create new canvas
      let tempCanvas = $("#tempCanvas")[0];

      if(!tempCanvas)
      {
        tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute("id", "tempCanvas");
      }
      

      // with the correct size
      tempCanvas.width = width;
      tempCanvas.height = height;
      // put there raw image data
      // expected to be faster as tere are no scaling, etc
      tempCanvas.getContext('2d').putImageData(imageContentRaw, 0, 0);
      // get image data (encoded as bas64)
      let dataUrl =  tempCanvas.toDataURL("image/png", 1.0)
      dataUrl = dataUrl.replace(";base64", "");

      let cell = graph.insertVertex(
        parent,
        null,
        obj,
        insertX,
        insertY,
        width,
        height,
        "shape=image;image="+dataUrl+";imageWidth="+width+";imageHeight:"+height+";"
      ); */
      
    }

    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    public CombineModelElements(modelArray1,modelArray2)
    {
        let combModelArray = [];
        if(Array.isArray(modelArray1) && Array.isArray(modelArray2))
        {
          combModelArray = modelArray1.concat(modelArray2);
        }
        else
        {
          return modelArray2;
        }
    
        return combModelArray;
    }


    public ZoomIn(graph)
    {
      graph.zoomIn();
    }

    public ZoomOut(graph)
    {
      graph.zoomOut();
    }

    public ClearGraph(graph)
    {
      //graph.getModel().clear();
      graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    }

    

    public axisGridLineReset()
    {
      try{
     /*    $('#yAxisHighSeparator').css('visibility','hidden');
        $('#yAxisMediumSeparator').css('visibility','hidden');
        $('#yAxisHighDiagramSeparator').css('visibility','hidden');
        $('#yAxisMediumDiagramSeparator').css('visibility','hidden');

        $('#xAxisHighSeparator').css('visibility','hidden');
        $('#xAxisMediumSeparator').css('visibility','hidden');
        $('#xAxisHighDiagramSeparator').css('visibility','hidden');
        $('#xAxisMediumDiagramSeparator').css('visibility','hidden');

        $('#xAxisMediumPercent').css('visibility','hidden');
        $('#xAxisHighPercent').css('visibility','hidden');
        $('#yAxisMediumPercent').css('visibility','hidden');
        $('#yAxisHighPercent').css('visibility','hidden'); */

        $('.xAxisDiagramSep').css('visibility','hidden');
        $('.xAxisPercentText').css('visibility','hidden');
        
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
      }
    }

    public yAxisGridLineRemove(currentCount)
    {
      try{
        currentCount = currentCount-1;

        $('#yAxisSeparator-'+currentCount).css({visibility:'hidden'}); 
        $('#yAxisPercent-'+currentCount).css({visibility:'hidden'}); 
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
      }
    }

    public yAxisGridLineAdd(currentCount)
    {
      try{
 
        $('#yAxisSeparator-'+currentCount).css({visibility:'visible'}); 
        $('#yAxisPercent-'+currentCount).css({visibility:'visible'}); 

        let mxGraphOuterContainer = $("#mxGraphOuterContainer").first();
        let impactDescriptionContainer = $("#impactDescriptionContainer").first();

        let mxGraphOuterContainerWidth = mxGraphOuterContainer.width();
        let impactDescriptionContainerWidth = impactDescriptionContainer.width();
        let width =mxGraphOuterContainerWidth+impactDescriptionContainerWidth;
        $('.yAxisSeparator').css({"min-width":width+"px"});
        $('.yAxisSeparator').css({"max-width":width+"px"});
        $('.yAxisSeparator').width(width);
        /* diagramSeparator */
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
      }
    }

    public xAxisGridLineAdd(currentCount,borders)
    {
 
      try{
        let likeliHoodDescriptionContainerHeight = $("#likeliHoodDescriptionContainer").outerHeight();
        let likeliHoodHeaderTextContainer = $("#likeliHoodHeaderTextContainer").outerHeight();
        let appFooterHeight = $("#app-footer").outerHeight();      

        let addHeight = (likeliHoodDescriptionContainerHeight-appFooterHeight-likeliHoodHeaderTextContainer)/4;
      
 
        let sepPercentPos = $("#xAxisLevelName-"+(currentCount).toString()).offset();
 

        let dashboardTopPos =  $("#dashboardTop").offset();
        let likeliHoodHeaderTextContainerPos = $("#likeliHoodHeaderTextContainer").offset();
        if (!$( "#xAxisDiagramSeparator"+currentCount).length) {
          $('#root').append('<div  class="xAxisDiagramSep" id="xAxisDiagramSeparator'+currentCount+'"/>');
        }

        let height = likeliHoodHeaderTextContainerPos.top-dashboardTopPos.top;

        $("#xAxisDiagramSeparator"+currentCount).height(height);
        $("#xAxisDiagramSeparator"+currentCount).width("1px");
        $("#xAxisDiagramSeparator"+currentCount).css({visibility:'visible',background:'white',top: dashboardTopPos.top, left: sepPercentPos.left+$("#xAxisLevelName-"+(currentCount).toString()).width(), position:'absolute'});
 
        if (!$("#xAxisDiagramPercent"+currentCount).length) {

          $('#root').append('<p id="xAxisDiagramPercent'+currentCount+'" class="xAxisPercentText">'+borders[currentCount].description+'</p> ');
        }

        let xAxisPercentWidth = $("#xAxisDiagramPercent"+currentCount).outerHeight();
        let yPos = sepPercentPos.top+addHeight-(xAxisPercentWidth/2);
       // let yPos = sepPercentPos.top +(xAxisPercentWidth/2) ;

        $("#xAxisDiagramPercent"+currentCount).css({visibility:'visible',top: yPos, left: sepPercentPos.left+$("#xAxisLevelName-"+(currentCount).toString()).width(), position:'absolute'});
  
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
      }
    }
 
    public xAxisGridLineRemove(currentCount)
    {
      try{
        currentCount = currentCount-1;

        $('#xAxisDiagramSeparator'+currentCount).css({visibility:'hidden'}); 
        $('#xAxisDiagramPercent'+currentCount).css({visibility:'hidden'}); 
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
      }
 
    }

    public async ClearLogOfSurveyNode(survey,surveyNode)
    {
      try{
 
        //surveyNode.logInfoModel = null;
        surveyNode.logInfoModel = new LogInfoModel(surveyNode.name); 
        let surveyNodeDict = survey.GetSurveyNodeDict();
 
        surveyNodeDict.set(surveyNode._id,surveyNode);
        survey.surveyNodeDict = surveyNodeDict;
        if(await storageHandlerInstance.SaveSurvey(survey) != false)
        {
          alert(i18n.getTranslation("common.graphContainer.events.logClearedSuccess"));
        }
        else
        {
          alert(i18n.getTranslation("common.graphContainer.events.logClearedFailure"));
        }
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.logClearedFailure")+" \n "+exception.message); 
      }
      return surveyNode;
    }

/*     public GetLogGraph()
    {
      let combinedGraph = null;
      try{
        let logModels = storageHandlerInstance.GetLogModels();
        let utilities = new MxGraphUtilities(); 
        combinedGraph = utilities.CombineGraphs(logModels);
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.logGraphFailure")+" \n "+exception.message); 
      }
     
      return combinedGraph;
    } */
 
    public GetPoolGraph(surveyNode,graph)
    { 
        let logInfoModel = surveyNode.GetLogInfoModel();
        let graphWidth = graph.container.clientWidth;
        let graphHeight = graph.container.clientHeight;
        if(logInfoModel.logGraphModelElements && Array.isArray(logInfoModel.logGraphModelElements))
        {
          let logGraphModelElements = logInfoModel.logGraphModelElements;
          if(logGraphModelElements && logGraphModelElements.length>0)
          {
            let poolRectInfo = Calculator.PoolOpinions(logInfoModel,graphWidth,graphHeight);
 
            this.AddNewRiskRectangle(graph,poolRectInfo.GetPosX(),poolRectInfo.GetPosY(),poolRectInfo.GetWidth(),poolRectInfo.GetHeight(),surveyNode);
          }
        
        }

        return graph;
    }

    public async SaveGraphToLog(surveyJson,surveyNode,newGraph)
    {
      try{
        let survey = new SurveyModel(); 
        survey.LoadFromJSONModel(surveyJson);

        let newGraphElements = this.GetGraphModelElements(newGraph);
        if(!newGraphElements || newGraphElements.length <=0)
          return false;
        let logInfoModel = surveyNode.GetLogInfoModel();

        let exisitingLogGraphElements = logInfoModel.GetLogGraphModelElements();
        let combinedLogGraphElements = this.CombineModelElements(exisitingLogGraphElements,newGraphElements);
        logInfoModel.SetLogGraphModelElements(combinedLogGraphElements);
        
        surveyNode.SetLogInfoModel(logInfoModel);
        
        let surveyNodeDict = survey.GetSurveyNodeDict();
        surveyNodeDict.set(surveyNode._id,surveyNode);
        
        survey.SetSurveyNodeDict(surveyNodeDict);

        if(await storageHandlerInstance.SaveSurvey(survey) != false)
        {
          //alert(i18n.getTranslation("common.log.answerCommited"));
          if(Meteor.settings.public.surveyEditor.clearGraphAfterLogSave === true)
          {
            this.ClearGraph(newGraph);
          }
          return true;
        }
        else
        {
          alert(i18n.getTranslation("common.graphContainer.events.saveToLogFailure"));
          return false;
        }
      }
      catch(exception)
      {
        alert(i18n.getTranslation("common.graphContainer.events.logGraphSaveFailure")+" \n "+exception.message); 
      }
    }

    public GetNextSurveyNode(survey,currentSurveyNode)
    {
      if(!survey || !currentSurveyNode)
        return currentSurveyNode;

      let nextSurveyNode = currentSurveyNode;
      let surveyNodes = survey.surveyNodes;
      if(surveyNodes && surveyNodes.size >1)
      {
        let currentNodeFound = false;

        surveyNodes.forEach((searchSurveyNode)  => {
          if(currentNodeFound==true)
          {
            nextSurveyNode = searchSurveyNode; 
            currentNodeFound = false;
          }
          if(searchSurveyNode._id == currentSurveyNode._id)
          {
            currentNodeFound = true;
          }
        })
      }
      return nextSurveyNode;
    }

    public SaveGraph(graph)
    {
      const jsonNodes = this.GetGraphModelElements(graph);
      let jsonStr = JsonCodec.StringifyWithoutCircular(jsonNodes);
      storageHandlerInstance.SetLog(jsonStr);
      return jsonStr;
    }

    public GetGraphModelElements(graph) {
        const encoder = new JsonCodec();
        let jsonModel = encoder.decode(graph.getModel());

        if(jsonModel && jsonModel.length > 0)
        {
          let graphWidth = graph.container.clientWidth;
          let graphHeight = graph.container.clientHeight;

          jsonModel.forEach(node => {
            node.widthPercentage = parseFloat((node.geometry.width / graphWidth).toFixed(5));
            node.heightPercentage = parseFloat((node.geometry.height / graphHeight).toFixed(5));
 
            node.likeliHoodStartPercentage = parseFloat((node.geometry.x / graphWidth).toFixed(5));
            node.likeliHoodEndPercentage = parseFloat(((node.geometry.x+node.geometry.width) / graphWidth).toFixed(5));

            node.impactStartPercentage = parseFloat((node.geometry.y / graphHeight).toFixed(5));
            node.impactEndPercentage = parseFloat(((node.geometry.y+node.geometry.height) / graphHeight).toFixed(5));
 
          });
        }
    
        return jsonModel;
    };
}

export default GraphEventHandler;
   