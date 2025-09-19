# Learn Vite, React.js & ShaCDN UI  

A project dedicated to learning and exploring modern web development technologies, including React.js, Vite, Tailwind CSS, and ShadCN UI.  

## 📌 Technologies Covered  
- **React 19** – Latest version of React for building interactive UIs.  
- **Vite 6** – Fast and modern frontend tooling for React applications.  
- **Tailwind CSS v4** – Utility-first CSS framework for styling.  
- **ShaCDN UI** – A collection of beautifully designed components for React.  
- **Next.js 15** – Powerful React framework for server-side rendering and API handling.  
- **Express.js** – Lightweight and flexible backend framework for Node.js.  

## 🚀 Getting Started  
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Tes_Project.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Tes_Project
   ```
3. Install dependencies for each workspace:
   ```bash
   npm install --prefix test-vite
   npm install --prefix server
   npm install --prefix next-api
   ```
4. Start the development services (use separate terminals as needed):
   - Launch the SQL Server container:
     ```bash
     docker compose up -d
     ```
   - Run the Next.js API:
     ```bash
     cd next-api
     npm run dev
     ```
   - Start the Socket.IO server:
     ```bash
     cd server
     npm start
     ```
   - Start the Vite frontend:
     ```bash
     cd test-vite
     npm run dev
     ```
