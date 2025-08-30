Project Title

Rainwater Harvesting  and Artificital Recharge Project

1. Project Overview

a) Designing and development of an application for on spot assessment of Roof Top Rain water harvesting and artificial recharge potential and size of the RTRWH and AR.

b) Rainwater harvesting is environmentally crucial as it reduces runoff, prevents soil erosion, and recharges depleted groundwater tables, directly combating water scarcity. Economically, it lowers water bills by providing a free, sustainable source for non-potable needs, decreasing the demand on municipal supplies. 

2. Objectives

a) The project's main objective is to create a user-friendly application for the on-spot assessment and design of rooftop rainwater harvesting (RTRWH) and artificial recharge (AR) systems.

b) It solves the critical problem of technical complexity and lack of awareness, which often prevent the adoption of these practices.

c) By providing instant, tailored calculations, the application empowers individuals and communities to efficiently collect rainwater, reduce urban runoff, and actively participate in replenishing local groundwater levels.

3. 🛠️ Features

a) This application's core feature is an on-spot assessment calculator that determines a rooftop's rainwater harvesting potential and suggests the optimal size for collection tanks and artificial recharge structures. I

b) It includes a cost estimation tool to provide an immediate budget for the proposed system. Additionally, the app features simple data visualization to present the potential water savings and system design in an easy-to-understand format.

4. 🗂️ Project Structure

Rainwater-Harvesting-Project/
│── client/                # Frontend application  
│   ├── node_modules/      # Project dependencies  
│   ├── public/            # Static assets (images, icons, etc.)  
│   ├── src/               # Source code (React components, pages, styles)  
│   ├── .gitignore         # Git ignored files configuration  
│   ├── eslint.config.js   # ESLint configuration for code linting  
│   ├── index.html         # Main HTML template  
│   ├── package.json       # Project metadata & dependencies  
│   ├── package-lock.json  # Auto-generated lock file for dependencies  
│   ├── README.md          # Project documentation  
│   └── vite.config.js     # Vite configuration for frontend build  
│
│── server/                # Backend application (API, database, logic)  


5. ⚙️ Installation / Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/rainwater-harvesting.git

cd rainwater-harvesting

2️⃣ Setup Client (Frontend)

cd client
npm install        # Install dependencies
npm run dev        # Start development server

3️⃣ Setup Server (Backend) 

cd ../server
npm install        # Install backend dependencies
npm start          # Start backend server

4️⃣ Environment Variables

a) Create a .env file in both client and server (if required).

b) Add keys like API endpoints, database URIs, authentication secrets, etc.

Example .env (server):

PORT=5000
MONGO_URI=your_database_url

6. 🚀 Usage

a) Start the backend server and frontend client as described in the setup section.

b) Open the app in your browser at http://localhost:5173
.

c) Navigate through the dashboard to:

    1) Simulate rainwater collection & storage.

    2) View water usage statistics.

    3) Analyze efficiency of the harvesting system.


7. 📊 Results / Output

a) Interactive dashboard showing collected vs. utilized water.

b) Graphs of storage levels, rainfall patterns, and usage efficiency.

c) Example Screenshots:
(Add your images here, e.g., system diagrams, app screenshots, simulation outputs).

8.📖 Documentation

a) Rainwater Harvesting Research (NCBI)

b) Ministry of Jal Shakti, Govt. of India – Rainwater Harvesting Guidelines

c) Detailed project report is available in the /docs folder.

9. 👥 Team Members / Contributors

a) Project Lead / Full-Stack Developer (Ramlal) – Coordinated the project, managed tasks, and contributed to both frontend & backend.

b) Frontend Developer (Riya Khandelwal) – Built the user form page using React + Vite, worked on dashboard, graphs.

c) Backend Developer(Bhumika Agrawal) – Developed APIs, handled database integration, and managed server-side logic.

d) Research & Documentation Lead(Nandini Gupta) – Collected data , prepared reports, and ensured project aligns with sustainability goals.

e) UI/UX Designer(– Designed landing page layouts, and improved user experience for the dashboard.

f) Testing & Deployment Engineer(Ramlalf) – Tested the system for bugs, optimized performance, and deployed project on hosting platforms.

10. 📜 License

a) This project is licensed under the MIT License – see the LICENSE.
