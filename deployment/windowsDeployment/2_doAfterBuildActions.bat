cd "..\..\software\source"
COPY startServerDep.bat "..\..\deployment\deployedApp\RiskEstimationRecorder\bundle\startServerDep.bat
cd "..\..\deployment"
COPY .\dockerFiles\.dockerignore "C:\RiskEstimationRecorder\deployment\deployedApp\RiskEstimationRecorder\bundle\.dockerignore"
COPY .\dockerFiles\docker_deployed.env "C:\RiskEstimationRecorder\deployment\deployedApp\RiskEstimationRecorder\bundle\docker_deployed.env"
COPY .\dockerFiles\docker-compose.yml "C:\RiskEstimationRecorder\deployment\deployedApp\RiskEstimationRecorder\bundle\docker-compose.yml"
COPY .\dockerFiles\dockerfile "C:\RiskEstimationRecorder\deployment\deployedApp\RiskEstimationRecorder\bundle\dockerfile"
cd ".\deployedApp\RiskEstimationRecorder\bundle\programs\server"
npm install


 