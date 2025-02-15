# Leftover Love

**Sharing More Than Just Food**  
Leftover Love is a heartfelt initiative bringing together restaurants and charities to reduce food waste while helping those in need. We believe every meal has the potential to make a difference, turning surplus into smiles and waste into warmth. Our platform makes it easy to donate, collect, and track your impact in creating a more sustainable and caring community.

---

## Project Overview
**Leftover Love** is a web application designed to connect restaurants with surplus food to charities and local food banks that can distribute it to those in need. The platform allows restaurants to list available food items, and charities can accept or schedule pickups, track donations, and view their impact.

---

## **Features**
- Restaurant Dashboard to manage food donations, active pickups, and track impact (Wasted saved in KG, etc...)
- Charity Dashboard to browse available food, schedule pickups, and provide feedback.
- Impact tracking, including food saved, donations made, and people helped.

---

## **Tech Stack**
### Frontend:
- **Next.js**

### Backend:
- **FastAPI**
- **PostgreSQL**

---

## **Setup Instructions**

### Prerequisites:
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/leftover-love.git
cd leftover-love
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Access the frontend at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd backend
python -m venv env
source env/bin/activate  # For Mac/Linux
# or
env\Scripts\activate    # For Windows
pip install -r requirements.txt
```

- Create a `.env` file in the `backend` folder with database connection details:
```env
DATABASE_URL=postgresql://username:password@localhost/dbname
```

- Run the backend server:
```bash
uvicorn app.main:app --reload
```
- Access the API at `http://localhost:8000`.

---

## **Future Plans**
- Add real-time notifications for new food listings.
- Implement geolocation and route planning for pickups.
- Integrate a messaging system between restaurants and charities.
- Include analytics dashboards for tracking overall impact.

---

**Made with ❤️ by the Leftover Love Team**

