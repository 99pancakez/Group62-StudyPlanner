![Build Status](https://github.com/99pancakez/Group62-StudyPlanner/actions/workflows/build.yml/badge.svg)
![Test Status](https://github.com/99pancakez/Group62-StudyPlanner/actions/workflows/tests.yml/badge.svg)

# StudyPlanner v2

## By SEM2 Programming Project 1 - Group 62

### Original version made by previous capstone team, with Syed Shahariar Hossain

## Step 1: Download Files

The repo must be downloaded to local system, a way is through either: <br>

#### Windows

- Downloading as archive: \<Code\> --> `Download ZIP` --> unzip folder
- Cloning the GitHub repository

#### Mac

- Download latest release (`tar.gz`, for mac file format)
- Cloning the GitHub repository (no need for firewall interaction)

### Step 1.5: _Importing and Exporting the database_

---

The database of this program is able to be imported and exported by filesharing. <br>

The location of the data is found in the path: `/middlelayer/src/database/seed/data/`. The json files such as: <br>

```
- admin.json
    ***
    ***
- course_availability.json
```

are where the information is stored.

#### Exporting:

To export the database to share to another user, either the **data** folder, or the **contents** of the folder can be shared, or archived and shared as a zip file or tar.gz file.

#### Importing:

Very similarly to the export process, just replace the contents of that file/directory with what is shared.

## Step 2: Launch Program

In the project file, exists three batch files to start the program locally on windows computer. </br><br>

```
start.bat
startfrontlayer.bat
startmiddlelayer.bat
```

<br>

**WIN:** `start.bat` <br>

```
start.command
startfrontlayer.sh
startmiddlelayer.sh
```

**MAC:** `start.command` <br>
_if blocked by quarantine, Settings / Privacy & Security / `start.command` / Open Anyway_

combines these terminal scripts to launch the program.<br>

### First time Launch:

**An internet connection is needed for the initial launch**<br>
The first time launch of `start` will install dependent node modules, and on mac, extract the node executable, please wait a few minutes for the installation. Future launches will not have this delay and will launch quickly.

### Program Behaviour:

The program launch sequence is the same across the two versions, just with different filenames;

Upon launch, 4 terminal windows open;

- launch sequencer `start.bat`, `start.command`
- mysql server `sql/startsqlserver.bat`, `sql/startsqlserver.bat`
- middle layer handling `startmiddlelayer.bat`, `startmiddlelayer.bat`
- frontend user interface `startfrontlayer.bat`, `startfrontlayer.bat`

### Closing the program:

**do not** close any of these while the program is running, **especially on first time setup**. <br>
To close the program, it is safe to just end all the terminal windows, with at least **middlelayer** as first to save any admin changes.

## Step 3: Access the Application

- Upon the successful use of appropriate `start` script, the website will automatically launch the localhost frontend.
- **Student Portal:** [http://localhost:3001/](http://localhost:3001/)
