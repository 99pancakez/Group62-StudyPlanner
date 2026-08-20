##  Step 1: Install Node.js


Download and install Node.js from: [https://nodejs.org/en/download](https://nodejs.org/en/download)
After installation, verify with:


```bash
node -v
npm -v
```


---


##  Step 2: Install and Configure MySQL


### Download MySQL for your OS:


Windows/macOS: [MySQL Installer (includes GUI installer)](https://dev.mysql.com/downloads/mysql/)


Linux: Use package manager (see below)




Windows/macOS:


1. Run the downloaded installer


2. During installation:


   -  Note down the root password you set (or choose "No password" if developing locally)


   - Keep "MySQL Server" and "MySQL Shell" selected


Linux (Debian/Ubuntu):


```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation  # Follow prompts to set root password
```


### Initial Setup (All OS):


After installation, verify MySQL is running, then access it:


```bash
mysql -u root -p
```


### If You Need to Reset Password (All OS):


```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```


---


##  Step 3: Set Up the Middle Layer


In your terminal (VS Code recommended):


```bash
cd middlelayer


npm install express cors argon2 mysql2 react-select sequelize uuid jspdf jspdf-autotable pdfkit


npm run db:import


node server.js
```


---


##  Step 3: Set Up the Frontend


In a new terminal:


```bash
cd frontend


npm install


npm start
```


> If asked “Something is already running on port 3000…”, press `y` to run on another port.


---


## Step 4: Access the Application


* **Student Portal:** [http://localhost:3001/](http://localhost:3001/)

