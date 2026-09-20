# StudyPlanner v2
## By SEM2 Programming Project 1 - Group 62
### Original version made by previous capstone team, with Syed Shahariar Hossain



## Step 1: Download Files

The repo must be downloaded to local system, a way is through either:
* downloading as archive:  \<Code\> --> Download ZIP
* cloning the github repo

## Step 2: Launch Program

In the project file, exists three batch files to start the program locally on windows computer. </br><br>

```
start.bat
startfrontlayer.bat
startmiddlelayer.bat
```

`start.bat` combines these terminal scripts to launch the program.<br>

### First time Launch:
**An internet connection is needed for the initial launch**<br>
The first time launch of `start.bat` will install dependent node modules, please wait a few minutes for the installation. Future launches will not have this delay and will launch quickly.

### Program Behaviour:

Upon launch, 4 terminal windows open;
- launch sequencer `start.bat`
- mysql server `sql/startsqlserver.bat`
- middle layer handling `startmiddlelayer.bat`
- frontend user interface `startfrontlayer.bat`

 **do not** close any of these while the program is running. To close the program, it is safe to just end all the terminal windows, the order is not neccesary.



## Step 3: Access the Application

* Upon a successful launch of `start.bat`, the website will automatically launch the localhost frontend.
* **Student Portal:** [http://localhost:3001/](http://localhost:3001/)

