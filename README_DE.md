# Entwicklungsvorraussetzungen

Für die Entwicklung wird eine installierte aktuelle Meteor Version (ab Version 2.0), MongoDB vorausgesetzt (ab Version 4.2) und Node.js (ab Version 14.15.4). 
Als Entwicklungsumgebung wird Microsoft Visual Studio Code empfohlen, da im Projektverzeichnis bereits Einstellungsdateien für den Editor hinterlegt sind, um die Bedienung zu erleichtern.
Die Software wurde erfolgreich in folgender Konfiguration getestet:
•	MongoDB Version 4.2
•	Meteor Version 2.0
•	Node.js Version 14.15.4

# Ausführungsvorraussetzungen

Für die Ausführung wird eine MongoDB Installation (ab Version 4.2) vorausgesetzt sowie Node.js (ab Version 14.15.4).  Für eine Ausführung der erstellten Software wird keine installierte Meteor Version benötigt, diese ist nur zur Entwicklung notwendig.
Die Software wurde erfolgreich in folgender Konfiguration getestet:
•	MongoDB Version 4.2
•	Node.js Version 14.15.4
Die Anwendung selbst kann unter folgender URL bezogen werden: 


#Build Vorgang

Soll die Anwendung zu Entwicklungszwecken gestartet und debugged werden sind zuerst die Einstellungen in der settings.json Datei im \software\source Verzeichnis gegebenenfalls anzupassen.
Da nicht der in Meteor integrierte Minimongo Server für die Datenbank verwendet wird, sondern eine installierte MongoDB Instanz vorausgesetzt wird, muss zuerst der MongoDB Dienst gestartet werden.
Für die Datenbank wird standardmäßig der Port 27017 verwendet.
Unter Windows wird die Anwendung mittels der startServerDev.bat Datei im Projekthauptverzeichnis gestartet.
Innerhalb der Datei lassen sich diverse Umgebungsvariablen und Einstellungen anpassen, etwa zum E-Mail-Versand und Node.js Parameter sowie der verwendete Port der Anwendung (standardmäßig 3000).
Zum serverseitigen Debuggen genügt es die Anwendung aufzurufen (standardmäßig „localhost:3000“) und in einem weiteren Tab in Google Chrome die Adresse „chrome://inspect/#devices“ einzugeben.


#Deployment Vorgang

##Windows

Für ein Deployment unter Windows müssen zuerst die Einstellungen in der settings_deployed.json Einstellungsdatei im \software\source Verzeichnis gegebenenfalls angepasst werden.
Anschließend muss der Inhalt der settings_deployed.json Datei in die startServerDep.bat Datei im \software\source Verzeichnis kopiert werden als einzeiliger Text als Wert für die METEOR_SETTINGS Umgebungsvariable welche am Ende der Datei vorkommt. 

Anschließend müssen die 1_buildApp.bat und 2_doAfterBuildActions.bat im deployment\windowsDeployment Verzeichnis nacheinander ausgeführt werden als Administrator.
Diese erstellen die Anwendung und legen diese in deployment\deployedApp ab.
Um die Anwendung schließlich auszuführen, muss das Archiv nur entpackt und die enthaltene startServerDep.bat Datei ausgeführt werden.
Die Anwendung ist nun standardmäßig unter „localhost:3000“ verfügbar.

##Linux

Für die Ausführung unter Linux wird ein Docker Container zur Verfügung gestellt.
Hierfür müssen zuerst die Einstellungen in der settings_deployed.json Einstellungsdatei im /software/source Verzeichnis gegebenenfalls angepasst werden.
Anschließend muss der Inhalt der Datei in die docker_deployed.env Datei im deployment/dockerFiles Verzeichnis kopiert werden als einzeiliger Text als Wert für die METEOR_SETTINGS Umgebungsvariable.
Mittels Ausführung der Befehle docker-compose build und docker-compose run im Verzeichnis deployment/dockerFiles werden nun zwei Docker Images erstellt und ausgeführt.
Ein Image läuft dabei standardmäßig auf Port 3000 für den Meteor Server und eines auf Port 27017 für die MongoDB. Die Einstellungen und Ports der Images können dabei in der docker-compose.yml Datei im deployment/dockerFiles Verzeichnis angepasst werden.
Die Anwendung ist nun unter „localhost:3000“ verfügbar.
