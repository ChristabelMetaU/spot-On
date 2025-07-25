<!-- @format -->

# SpotOn – Real-Time Smart Parking Finder

SpotOn is a real-time smart parking web app that helps users find, reserve, and report parking spots with ease. Powered by WebSockets, Redis, and custom availability predictions, SpotOn ensures seamless parking discovery and decision-making—especially around high-demand zones like campus lots.

---

## 🔗 Links

- _Live App:_ [Insert in week 9](insert in week 9)
- _Demo Video:_ [Watch on Loom](Insert in week 9)
- _Final Presentation:_ [View Slides](Insert in week 9)
- 📁 _Backend Repo:_ [GitHub Backend](https://github.com/ChristabelMetaU/spot-On/tree/main/backend)
- 📁 _Frontend Repo:_ [GitHub Frontend](https://github.com/ChristabelMetaU/spot-On/tree/main/frontend/spot-on)

---

## Preview

## Links

**Project Plan**: [doc](<https://docs.google.com/document/d/1LkKYKh1WW_9y6B1muTMsE6WbKj9iHvFBQfIP3HhKDMA/edit?tab=t.0>)

---

## Features

- _Interactive Map_ with custom markers and custom SVG icons
- _User Reports_ for crowd-sourced data
- _Custom Prediction_ based on historical reports
- _Responsive Design_ for mobile and desktop
- _Real-Time Data_ updates with WebSockets
- _User Authentication_ with JWT
- _Real-time Parking Spot Availability_
- _Router-based Navigation_
- _Custom UI Filters_
- _Ranking Algorithm_
- _Multi-Device Sync_ using WebSockets + Redis Pub/Sub
- _Smart Predictions_ based on crowdsourced reports + time-series modeling
- _Custom Ranking Algorithm_ (Walk time, reliability, price)
- _Dynamic Map Filtering_ (Handicapped, Parking Lot, Open Spots, etc.)
- _Spot Locking + Reservations_
- _Real-Time + Local Notifications_
- _Real time Reservations_ (WebSockets + Redis Pub/Sub)
- _Location-Aware Search with Dynamic Radius Expansion_
- _Custom UI Filters with Animation_
- _Loading skeleton UI_
- _Background Cleanup for Stale Data_
- _and much more..._

---

## 🛠️ Tech Stack

_Frontend:_

- React + Vite
- Google Maps (Map)
- React Router (Routing)

_Backend:_

- Node.js + Express
- WebSockets (ws)
- Prisma + PostgreSQL
- Redis (Pub/Sub for session + spot sync)
- Node-cron (background stale cleanup)

---

## 🧪 Testing & QA

- Frontend: Jest + React Testing Library
- Backend: Jest + Supertest
- WebSockets: Simulated multi-user scenarios
- Integration: Manual testing across multiple devices
- Stale logic: Cron-based validation via Prisma queries

---

## ⚙️ Installation & Setup

1. _Clone Repos_

   ```bash
   git clone https://github.com/ChristabelMetaU/spot-On/tree/main/frontend/spot-on
   git clone https://github.com/ChristabelMetaU/spot-On/tree/main/backend
   Install Dependencies
   ```

2. _Install Dependencies_
   ```bash
   cd spot-on
   npm install
   cd ../backend
   npm install
   ```
   Environment Variables

### 🌐 Environment Variable

Create a _.env_ file in the root directory of the backend with the following variables:

Run App Locally

# Backend

cd backend
npm run dev

# Frontend

cd ../frontend/spot-on
npm run dev
🗂️ Optional File Structure

<details> <summary>Click to Expand</summary>

frontend/spot-on/
├── components/
│ ├── Map.jsx
│ ├── PredictionCard.jsx
│ ├── FilterBar.jsx
│ ├── and more
├── pages/
│ ├── Home.jsx
│ ├── Reserve.jsx
│ ├── and more
├── utils/
│ ├── haversine.js
│ ├── predictionFormatter.js
│ ├── and more
...

backend/
├── routes/
│ ├── predictions.js
│ ├── reports.js
├── utils/
│ ├── staleCleaner.js
│ ├── and more
├── index.js
├── app.js
...

</details>
 Author
Christabel Gosiorah Obi-Nwosu
Frontend + Backend(Full Stack) Developer | Real-time and Computer Systems | Machine Learning Enthusiast

LinkedIn <!--  -->
GitHub <!-- https://github.com/Christabel091 -->
Portfolio <!-- https://christabel091.github.io/christabel-portfolio/ -->

# License

This project is licensed under the MIT License.

---

## Resources

- Google Maps API: https://developers.google.com/maps/documentation/javascript/
- Redis: https://redis.io/
- Node.js: https://nodejs.org/en/
- Express: https://expressjs.com/
- Prisma: https://www.prisma.io/
- React Router: https://reactrouter.com/
- React Testing Library: https://testing-library.com/docs/react-testing-library/
- Jest: https://jestjs.io/
- Supertest: https://www.npmjs.com/package/supertest
- Node-cron: https://www.npmjs.com/package/node-cron
- and more...
