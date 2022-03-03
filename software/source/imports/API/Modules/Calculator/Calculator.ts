import ICalculator from "./ICalculator";
import RectangleInfoModel from "../../Models/ModelTemplates/RectangleInfoModel/RectangleInfoModel";
import LogInfoModel from "../../Models/ModelTemplates/LogInfoModel/LogInfoModel";
import TypeScriptHelper from "../Utilities/TypeScriptHelper";
import Login from "../../../ui/views/Pages/Login/Login";
//var PD = require("probability-distributions");
var Abba = require("abbajs");

enum Dim {
    X,
    Y
}

export default class Calculator implements ICalculator{
 
       
    	/// <summary>
		/// CleanData:
		/// This method takes a list of rectangles and converts the outliers position respectively to the given delta distances.
		/// </summary>
		/// <param name="logInfo">The loginformation of a certain node that contains the rectangle list.</param>
		/// <param name="pX">The percentage of outliers on the X-axis (between 0 and 1).</param>
		/// <param name="pY">The percentage of outliers on the Y-axis (between 0 and 1).</param>
		/// <param name="deltaXLow">The distance to correct lower outliers on the X-axis.</param>
		/// <param name="deltaXHigh">The distance to correct upper outliers on the X-axis.</param>
		/// <param name="deltaYLow">The distance to correct lower outliers on the Y-axis.</param>
		/// <param name="deltaYHigh">The distance to correct upper outliers on the Y-axis.</param>
		/// <returns>LogInfo that contains corrected rectangles.</returns>
        public static CleanDataWithDelta(logInfo : LogInfoModel, pX : number, pY : number, deltaXLow : number, deltaXHigh : number, deltaYLow : number, deltaYHigh : number,
            graphWidth:number,graphHeight:number){
        
        //deep copy of editable rectInfos:
        let cleanedInfo : LogInfoModel = new LogInfoModel(logInfo.GetNodeName());
        cleanedInfo.SetGridInfo(logInfo.GetGridInfo());
        cleanedInfo.SetOriginRectInfos(logInfo.GetOriginRectInfos());
        let editableRectinfos : Array<RectangleInfoModel> = new Array<RectangleInfoModel>();
        
        let editRectInfosIterate = logInfo.GetEditableRectInfos();
        editRectInfosIterate.forEach(info => {
            let rectInfo : RectangleInfoModel = new RectangleInfoModel(info.GetPosX(), info.GetPosY(), info.GetWidth(), info.GetHeight(),/*  info.GetTimeStamp() */graphWidth,graphHeight);
            rectInfo.SetDescription(info.GetDescription());
            editableRectinfos.push(rectInfo); 
        });
        
        cleanedInfo.SetEditableRectInfos(editableRectinfos);
        
        let amountOfOpinions  : number= cleanedInfo.GetEditableRectInfos().length;  // = N
        
        let amountOfDeviantsX : number = parseInt(Math.round(amountOfOpinions * pX)); // m for dim X
        let amountOfDeviantsY : number = parseInt(Math.round(amountOfOpinions * pY)); // m for dim Y
        
        let amountOfNonDeviantsX : number = amountOfOpinions - (2 * amountOfDeviantsX); // N - 2m for dim X
        let amountOfNonDeviantsY : number = amountOfOpinions - (2 * amountOfDeviantsY); // N - 2m for dim Y
    
        let lowerDeviantsLimit : number = amountOfDeviantsX;
        let upperDeviantsLimit : number = (amountOfOpinions - amountOfDeviantsX) + 1;
        
        let gridInfo = logInfo.GetGridInfo();
        deltaXLow = gridInfo.GetGridWidth() * deltaXLow;
        deltaXHigh = gridInfo.GetGridWidth() * deltaXHigh;
        //Switching Y-low and Y-high for manual set delta because drawing the Y-Axis starts from top and ends at bottom of the window:
        let deltaYTemp : number = deltaYLow;
        deltaYLow = gridInfo.GetGridHeight() * deltaYHigh; 
        deltaYHigh = gridInfo.GetGridHeight() * deltaYTemp;
        
        let cleanedData : Array<RectangleInfoModel> = new Array<RectangleInfoModel>();
 
        if(amountOfDeviantsX > 0 && amountOfNonDeviantsX > 0){
            //cleanedData = cleanedInfo.GetEditableRectInfos().OrderBy(o => o.GetMuX()).ToList();
            cleanedData = logInfo.GetEditableRectInfos().sort((a, b) => (a.GetMuX() > b.GetMuX()) ? 1 : -1);
            cleanedData = Calculator.CorrectDataByDelta(cleanedData, Dim.X, deltaXLow, deltaXHigh, lowerDeviantsLimit, upperDeviantsLimit); 
        }else{
            cleanedData = cleanedInfo.GetEditableRectInfos();
        }
        
        if(amountOfDeviantsY > 0 && amountOfNonDeviantsY > 0){
            lowerDeviantsLimit = amountOfDeviantsY;
            upperDeviantsLimit = (amountOfOpinions - amountOfDeviantsY) + 1;
            //cleanedData = cleanedData.OrderBy(o => o.GetMuY()).ToList();
            cleanedData = logInfo.GetEditableRectInfos().sort((a, b) => (a.GetMuY() > b.GetMuY()) ? 1 : -1);
            cleanedData = Calculator.CorrectDataByDelta(cleanedData, Dim.Y, deltaYLow, deltaYHigh, lowerDeviantsLimit, upperDeviantsLimit); 
        }
        
        cleanedInfo.SetEditableRectInfos(cleanedData);
        
        return cleanedInfo;
    }
    
    /// <summary>
    /// CleanData:
    /// This method takes a list of rectangles and converts the outliers position respectively to the given delta distances.
    /// </summary>
    /// <param name="logInfo">The loginformation of a certain node that contains the rectangle list.</param>
    /// <param name="pX">The percentage of outliers on the X-axis (between 0 and 1).</param>
    /// <param name="pY">The percentage of outliers on the Y-axis (between 0 and 1).</param>
    /// <returns>LogInfo that contains corrected rectangles.</returns>
    public static CleanData(logInfo:LogInfoModel, pX : number, pY : number,graphWidth:number,graphHeight:number)
    {
        let cleanedInfo : LogInfoModel = new LogInfoModel(logInfo.GetNodeName());
        cleanedInfo.SetGridInfo(logInfo.GetGridInfo());
        cleanedInfo.SetOriginRectInfos(logInfo.GetOriginRectInfos());
        
        //deep copy of editable rectInfos:
        let editableRectinfos : Array<RectangleInfoModel> = new Array<RectangleInfoModel>();
        
        logInfo.GetEditableRectInfos().forEach(info => {
            let rectInfo : RectangleInfoModel = new RectangleInfoModel(info.GetPosX(), info.GetPosY(), info.GetWidth(), info.GetHeight()/* , info.GetTimeStamp() */,graphWidth,graphHeight);
            rectInfo.SetDescription(info.GetDescription());
            editableRectinfos.push(rectInfo);
        });
        
        
        cleanedInfo.SetEditableRectInfos(editableRectinfos);
        
        
        let amountOfOpinions : number = cleanedInfo.GetEditableRectInfos().length;  // = N
        
        let amountOfDeviantsX : number = parseInt(Math.round(amountOfOpinions * pX)); // m for dim X
        let amountOfDeviantsY : number = parseInt(Math.round(amountOfOpinions * pY)); // m for dim Y
        
        let amountOfNonDeviantsX : number = amountOfOpinions - (2 * amountOfDeviantsX); // N - 2m for dim X
        let amountOfNonDeviantsY : number = amountOfOpinions - (2 * amountOfDeviantsY); // N - 2m for dim Y
        
        
        let cleanedDataX : Array<RectangleInfoModel> = new Array<RectangleInfoModel> ();
        if(amountOfDeviantsX > 0 && amountOfNonDeviantsX > 0){
            let c : number = Calculator.CalcCorrectionParam(amountOfOpinions, amountOfDeviantsX, pX);
            cleanedDataX = Calculator.OrderAndCleanByDimension(cleanedInfo.GetEditableRectInfos(), Dim.X, amountOfNonDeviantsX, amountOfDeviantsX, c);
        }else{
            cleanedDataX = cleanedInfo.GetEditableRectInfos();
        }
 
        let cleanedData : Array<RectangleInfoModel> = new Array<RectangleInfoModel> ();
        if(amountOfDeviantsY > 0 && amountOfNonDeviantsY > 0){
            let c : number = Calculator.CalcCorrectionParam(amountOfOpinions, amountOfDeviantsY, pY);
            cleanedData = Calculator.OrderAndCleanByDimension(cleanedDataX, Dim.Y, amountOfNonDeviantsY, amountOfDeviantsY, c);
        }else{
            cleanedData = cleanedDataX;
        }
        
        cleanedInfo.SetEditableRectInfos(cleanedData);
        
        return cleanedInfo;
        
    }

    private static OrderAndCleanByDimension( rectList : Array<RectangleInfoModel>,   dim,   amountOfNonDeviants : number,   amountOfDeviants : number,   c : number)
    {
        
        //sort list by dim in ascending order:
        let sortedList : Array<RectangleInfoModel>;

        if (dim == Dim.X) {
            sortedList = rectList.sort((a, b) => (a.GetMuX() > b.GetMuX()) ? 1 : -1);
            //sortedList = rectList.OrderBy(o => o.GetMuX()).ToList();
        } else {
            sortedList = rectList.sort((a, b) => (a.GetMuY() > b.GetMuY()) ? 1 : -1);
            //sortedList = rectList.OrderBy(o => o.GetMuY()).ToList();
        }
        
        //calculate the average of the lower deviants, the non deviants and the upper deviants:			
        let i : number = 1;
        let lowerDeviantsLimit : number= amountOfDeviants;
        let upperDeviantsLimit : number= (sortedList.length - amountOfDeviants) + 1;
        let sumLowerDeviants : number= 0;
        let sumNonDeviants : number= 0;
        let sumUpperDeviants : number= 0;
        let mu : number;
 
        sortedList.forEach(info  => {
            if (dim == Dim.X) {
                mu = info.GetMuX();
            } else {
                mu = info.GetMuY();
            }
            
            if (i <= lowerDeviantsLimit) { //lower deviants
                sumLowerDeviants = sumLowerDeviants + mu;
            }
            if (i > lowerDeviantsLimit && i < upperDeviantsLimit) { //non deviants
                sumNonDeviants = sumNonDeviants + mu;
            } 
            if(i >= upperDeviantsLimit){ //upper deviants
                sumUpperDeviants = sumUpperDeviants + mu;
            }
            
            i++;
        });
        
        //calculate delta:
        let  deltaLow  : number = ((sumNonDeviants / amountOfNonDeviants) - (sumLowerDeviants / amountOfDeviants)) * c;
        let  deltaHigh : number = ((sumUpperDeviants / amountOfDeviants) - (sumNonDeviants / amountOfNonDeviants)) * c;
        //info on delta:
        /*
         * The drawing of the Y-axis starts at top but for the user it starts at the bottom so one might think deltaLow and deltaHigh must be switched
         * for the Y-axis. This must not be done because the deltaLow is actually the value of the upper(lower in C# Windows Form) rectangles and 
         * must be added and not subtracted to decrease the y position of the upper rectangles in the grid in the users perspective. 
         * Respectively the lower(upper in C# Windows Form) must be subtracted to increase them in the users perspective.
         * Only for the manual set delta in the clean data method above these values must be switched.
         */
        
        return Calculator.CorrectDataByDelta(sortedList, dim, deltaLow, deltaHigh, lowerDeviantsLimit, upperDeviantsLimit);
        
    }

    private static CorrectDataByDelta( sortedData : Array<RectangleInfoModel>,  dim, deltaLow : number,   deltaHigh : number,   lowerDeviantsLimit : number,   upperDeviantsLimit : number)
    {
			
        //add delta to lower deviants and subtract delta from upper deviants:
        let i : number = 1;
        
        sortedData.forEach(info => {
            if (i <= lowerDeviantsLimit) { //lower deviants
                if(dim == Dim.X) {
                    info.SetPosX(info.GetPosX() + deltaLow);
                } else {
                    info.SetPosY(info.GetPosY() + deltaLow);
                }
                
            }
            
            if (i >= upperDeviantsLimit) { //upper deviants
                if (dim == Dim.X) {
                    info.SetPosX(info.GetPosX() - deltaHigh);
                } else {
                    info.SetPosY(info.GetPosY() - deltaHigh);
                }
            }
            
            i++;
        });
 
        
        // return cleaned data:
        return sortedData;
    }

    public static  CalcCorrectionParam(trials : number,   successes : number,   probability : number){
        
        let binomial = new Abba.BinomialDistribution(trials,probability);
      
        // Array of 7 binomial variates based on 12 trials with probability 0.2 
        //let bin = PD.rbinom(successes, trials, probability)
        //let bin = new BinomialDistribution(trials, probability);
 
        // let ccdf : number = bin.ComplementaryDistributionFunction(successes); //P(X > successes)
        let ccdf : number = binomial.inverseCdf(successes);  

        let probSum : number = 0.0;
 

        for(let i = 0; i <= successes; i++){  // SUM_i = 0...successes ( i * (P(X = i) - P( X = trials - successes + i)))
     
            let probVLow : number = binomial.survival(i);  
            let probVHigh : number = binomial.survival(trials - successes + i);  
            /*     probVLow = bin.ProbabilityMassFunction(i);
            probVHigh = bin.ProbabilityMassFunction(trials - successes + i); */
            probSum = probSum + (i * (probVLow - probVHigh));
        }
        
        let c : number = 1 / (ccdf + probSum);
        
        return c;
        
    }
    /// PoolOpinions:
    /// This method takes a list of rectangles to merge them into one. Additionally params for decimal point accuracy and epsilon can be set.
    /// The height and width of a rectangle must not be zero!!! Else div by zero --> NaN!!!
    public static PoolOpinions(graphLogModel,graphWidth:number,graphHeight:number)
    {
        //ToDo get from settings
        let decimalPointAccuracy = 5;
        let epsilon =  0.1;

        let logGraphModelElements = graphLogModel.logGraphModelElements;
        let dimension : number = logGraphModelElements.length;
        
        let muPrevValuesX : number[] = new Array<number>(dimension);
        let sigmaSquarePrevValuesX : number[] = new Array<number>(dimension);
        let muPrevValuesY : number[] = new Array<number>(dimension);
        let sigmaSquarePrevValuesY : number[] = new Array<number>(dimension);
        
        
        //init mu and sigma-square vars:
        let i : number = 0;			

        logGraphModelElements.forEach(node => {
            muPrevValuesX[i] = node.geometry.x + (node.geometry.width / 2);
            sigmaSquarePrevValuesX[i] = Math.pow((node.geometry.width / 6), 2); 
            muPrevValuesY[i] = node.geometry.y + (node.geometry.height / 2);
            sigmaSquarePrevValuesY[i] = Math.pow((node.geometry.height/ 6), 2);
            i++;
        });
 
        
        //calc width and height calculation = 6 / sqrt(SUM_1..N(1/sigma²_i))
        let sumSigmaX : number = 0.0; // SUM_1..N(1/sigma²_i) for width
        let sumSigmaY : number = 0.0;	// SUM_1..N(1/sigma²_i) for height
        for (i = 0; i < dimension; i++) {
            sumSigmaX = sumSigmaX + 1 / sigmaSquarePrevValuesX[i];
            sumSigmaY = sumSigmaY + 1 / sigmaSquarePrevValuesY[i];
        }
        
        //calc x and y:
        let muAndSigmaX : number[] = Calculator.CalcAvgMuAndSigma(muPrevValuesX, sigmaSquarePrevValuesX, decimalPointAccuracy, epsilon);
        let muAndSigmaY : number[] = Calculator.CalcAvgMuAndSigma(muPrevValuesY, sigmaSquarePrevValuesY, decimalPointAccuracy, epsilon);
        let muX : number = muAndSigmaX[0];
        let muY : number = muAndSigmaY[0];
        let sigmaX : number = muAndSigmaX[1];
        let sigmaY : number = muAndSigmaY[1];
        
        let width : number = 6 * sigmaX;
        let height : number = 6 * sigmaY;
        let x : number = muX - (width / 2);
        let y : number = muY - (height / 2);	
        
       /*  string time = DateTime.Now.ToLongTimeString();
        string date = DateTime.Now.ToShortDateString(); */
        
        //string timeStamp = "[" + date + "]-[" + time + "]: ";	

        return new RectangleInfoModel(x, y, width, height,graphWidth,graphHeight);  
    }

    /// GetMaxDistance:
    /// Calculates the maximum distance between given values.
    public static GetMaxDistance(arr : number[])
    {
        
        let dim : number = arr.length;
        let min : number;
        let max : number; 
        
        if(arr.length > 0){
            max = arr[0];
            min = arr[0];
        }else{
            max = 0.0;
            min = 0.0;
        }
        
        for (let i = 0; i < dim; i++) {
            max = Math.max(max, arr[i]);
            min = Math.min(min, arr[i]);
        }
        
        return max - min;
    }

    private static UpdateKernelWeightMatrix(muNextValues : number[], epsilon : number){
			
        let dimension = muNextValues.length;
        //let kernelWeightMatrix = [dimension][dimension];
 
        let kernelWeightMatrix: Array<Array<number>> = new Array<Array<number>>();
        kernelWeightMatrix = TypeScriptHelper.Inflate2DArray(kernelWeightMatrix,dimension,dimension,0);
   
        // calculate weights ( w_ij = 1 / (epsilon + |µ_i - µ_j|)):
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                kernelWeightMatrix[i][j] = 1 / (epsilon + Math.abs(muNextValues[i] - muNextValues[j]));
            }
        }
        
        //divide each entry by its row sum ( w_ij = w_ij / SUM j= 0..N (w_ij)):
        let sumJ : number;
        
        for (let i = 0; i < dimension; i++) {
            sumJ = 0;
            for (let j = 0; j < dimension; j++) {
                sumJ = sumJ + kernelWeightMatrix[i][j];
            }
            for (let j = 0; j < dimension; j++) {
                kernelWeightMatrix[i][j] = kernelWeightMatrix[i][j] / sumJ;
            }
        } 
            
        return kernelWeightMatrix;
    }

    private static  UpdateFinalWeightMatrix( finalWeightMatrix , kernelWeightMatrix,sigmaSquareNextValues : number [], sigmaSquarePrevValues : number []){
			
        let dimension = finalWeightMatrix[0].length; // finalWeightMatrix is of type n x n
 
        let tempWeightMatrix: Array<Array<number>> = new Array<Array<number>>();
        tempWeightMatrix = TypeScriptHelper.Inflate2DArray(tempWeightMatrix,dimension,dimension,0);

        for(let i = 0; i < dimension; i++){
            for(let j = 0; j < dimension; j++){
                //t_ij = sigma²_i_new * dimension * ( w_ij/ sigma²_j_origin):
                tempWeightMatrix[i][j] = sigmaSquareNextValues[i] * dimension * (kernelWeightMatrix[i][j] / sigmaSquarePrevValues[j]);
            }
        }
        
        //finalMatrix_next = tempMatrix * finalMatrix_prev
        return Calculator.MatrixMultiplication(tempWeightMatrix, finalWeightMatrix);
    }

    /// MatrixMultiplication:
    /// Multiplies two matrices A and B. Take care of the param order!
    /// resultMatrix = matrixA * matrixB.
    /// <param name="matrixA">A two dimensional array with dimensons: [M,N].</param>
    /// <param name="matrixB">A two dimensional array with dimensons: [N,P]. </param>
    /// <returns>A two dimensional array with dimensons: [M,P] or null if the input arrays are not compatible or not in correct order.</returns>
    public static  MatrixMultiplication(matrixA,matrixB){
        
        if(matrixA[1].length == matrixB[0].length){ //check compatibility
            let sameDimension : number = matrixB[0].length;
            let rowDim : number = matrixA[0].length;
            let colDim : number = matrixB[1].length;
            
            //let result =   [rowDim][colDim];
 
             
            let result: Array<Array<number>> = new Array<Array<number>>();
            result = TypeScriptHelper.Inflate2DArray(result,rowDim,colDim,0);

            for(let i = 0; i < rowDim; i++){
                for(let j = 0; j < colDim; j++){
                    for(let k = 0; k < sameDimension; k++){
                        result[i][j] = result[i][j] + matrixA[i][k] * matrixB[k][j];
                    }
                }
            }
            return result;
        }
        return null;
        
    }

    public static GetIdentityMatrix(dimension : number){
            
        let identityMatrix: Array<Array<number>> = new Array<Array<number>>();
        identityMatrix = TypeScriptHelper.Inflate2DArray(identityMatrix,dimension,dimension,0);

        for(let i = 0; i < dimension; i++){
            identityMatrix[i][i] = 1.0;
        }
        return identityMatrix;
    }

    private static UpdateMuAndSigmaSquareValues(kernelWeightMatrix, muPrevValues : number[], sigmaSquarePrevValues : number[]){
			
        //update sigmaSquare and mu values:
        let dimension :number = muPrevValues.length;
        let muNextValues : number []=  new Array<number>(dimension);
        let sigmaSquareNextValues : number [] = new Array<number>(dimension);
 
        let sigmaNew :number;
        let muNew :number;
        let sumSigma :number;
        let sumMu :number;
        
        for (let i = 0; i < dimension; i++) {
            sumSigma = 0.0;
            sumMu = 0.0;
            for (let j = 0; j < dimension; j++) {	
                //SUM_j(N * w_ij / sigma²_j_origin):
                sumSigma = sumSigma + (dimension * kernelWeightMatrix[i][j]) / sigmaSquarePrevValues[j];
                //SUM_j(N * w_ij * mu_j_origin / sigma²_j_origin):
                sumMu = sumMu + ((dimension * kernelWeightMatrix[i][j] * muPrevValues[j]) / sigmaSquarePrevValues[j]);
            }
            
            // sigma²_i_new = 1 / (SUM_j(N * w_ij / sigma²_j_origin)) :
            sigmaNew = 1 / sumSigma;

            // mu_i_new = (SUM_j(N * w_ij * mu_j_origin / sigma²_j_origin)) * sigma²_i_new :
            muNew = sumMu * sigmaNew;	
            
            sigmaSquareNextValues[i] = sigmaNew;
            muNextValues[i] = muNew;
        }
        
 
        let muAndSigmaSquareValues: Array<Array<number>> = new Array<Array<number>>();
        muAndSigmaSquareValues = TypeScriptHelper.Inflate2DArray(muAndSigmaSquareValues,2,0,0);

        muAndSigmaSquareValues[0] = muNextValues;
        muAndSigmaSquareValues[1] = sigmaSquareNextValues;
        return muAndSigmaSquareValues;
    }

	/// CalcAvgMu:
    /// Sub method for opinion pooling.
    private static CalcAvgMuAndSigma(muPrevValues : number[], sigmaSquarePrevValues : number[], decimalPointAccuracy : number, epsilon : number)
    {
        //init vars:
        let dimension : number = muPrevValues.length;
        let limit : number = Math.pow(10, (-1) * decimalPointAccuracy);
        //limit = 0.00001;
        let sumSigma: number = 0.0;
        
        let muNextValues : number[] = new Array<number>(dimension);
        let sigmaSquareOriginValues : number[] = new Array<number>(dimension);
 
        for(let i = 0; i < dimension; i++){
            muNextValues[i] = muPrevValues[i];
            sigmaSquareOriginValues[i] = sigmaSquarePrevValues[i];
        }
        
        let sigmaSquareNextValues : number[] = new Array<number>(dimension);

        //let kernelWeightMatrix  = [dimension][dimension];
   
        let kernelWeightMatrix: Array<Array<number>> = new Array<Array<number>>();
        kernelWeightMatrix = TypeScriptHelper.Inflate2DArray(kernelWeightMatrix,dimension,dimension,0);

        let finalWeightMatrix  = this.GetIdentityMatrix(dimension); //final weight matrix for final sigma
 
        // begin:
        let maxDistance: number = this.GetMaxDistance(muNextValues);		

        while (maxDistance > limit) {
            
            //update kernel weight matrix:
            kernelWeightMatrix = this.UpdateKernelWeightMatrix(muNextValues, epsilon);

            //update sigmaSquare and mu values:
            let UpdatedMuAndSigmaSquareValues = Calculator.UpdateMuAndSigmaSquareValues(kernelWeightMatrix, muPrevValues, sigmaSquarePrevValues);
            muNextValues = UpdatedMuAndSigmaSquareValues[0];
            sigmaSquareNextValues = UpdatedMuAndSigmaSquareValues[1];
            
            //update final weight matrix:
            finalWeightMatrix = Calculator.UpdateFinalWeightMatrix(finalWeightMatrix, kernelWeightMatrix, sigmaSquareNextValues, sigmaSquarePrevValues);
            
            //overwriting the previous mu values with the new ones for next iteration:
            // mu_i <-- mu_i+1 
            sumSigma = 0.0;
            for (let i = 0; i < dimension; i++) {
                muPrevValues[i] = muNextValues[i];
                sumSigma = sumSigma + sigmaSquareNextValues[i]; //calculate sum of sigma² values for normalizing before overwriting
            }
            
            //overwrite previous sigma² values with new ones and normalize them:
            //sigma²_i <-- sigma²_i+1 / SUM_i(sigma²_i+1)
            for (let i = 0; i < dimension; i++) {
                sigmaSquarePrevValues[i] = sigmaSquareNextValues[i] / sumSigma;
            }
            maxDistance = Calculator.GetMaxDistance(muNextValues);
        }
        
        //calculate final sigma:
        sumSigma = 0.0;
        for(let i = 0; i < dimension; i++){
            sumSigma = sumSigma + (sigmaSquareOriginValues[i] * (Math.pow(finalWeightMatrix[0][i],2)));
        }
        
        //return:
        let muAndSigma : number[] = new Array<number>(2);
        muAndSigma[0] = parseFloat(muNextValues[0].toFixed(decimalPointAccuracy));
        muAndSigma[1] = Math.sqrt(sumSigma); 
        return muAndSigma;
        
    }
}