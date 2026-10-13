# 🚗 VahaanRent — India-Compliant Peer-to-Peer & Fleet Vehicle Rental Platform

> A full-stack vehicle rental marketplace designed specifically for the **Indian transport ecosystem**, compliant with the **Motor Vehicles Act 1988**, **Rent-a-Motorcycle Scheme 1997**, **Rent-a-Cab Scheme 1989**, and Central Motor Vehicles Rules (CMVR).
> Built with **NestJS**, **MongoDB 7.0**, **GraphQL (Apollo Server)**, **Apache Kafka (KRaft mode)**, **React 19**, and **Docker**.
> **Zero mock data** — backed by real database persistence and distributed event streaming.

---

## 🇮🇳 Indian Regulatory & RTO Compliance Features

1. **Vehicle Registration & Legal Plates**:
   - Supports **Commercial Yellow Plates** (self-drive permits), **Black-Yellow Plates** (Rent-a-cab / Rent-a-motorcycle permits), and **Private Plates** with digital mutual bailment leases under the *Indian Contract Act 1872*.
   - Central **Parivahan Vahan** Registration Certificate (RC) validation.
2. **Statutory Document Validation**:
   - Comprehensive commercial insurance with active validity checks.
   - Central Motor Vehicles Rules (CMVR) **Pollution Under Control (PUC)** certificate validity (mandatory for non-EVs).
   - **NPCI FASTag** ID barcode tracking for 4-wheelers with automated toll reconciliation.
3. **Renter Verification (e-KYC)**:
   - **DigiLocker & UIDAI**: Masked Aadhaar authentication (`XXXX-XXXX-1234`).
   - **Parivahan Sarathi Driving License (DL)**: Vehicle class matching:
     - `MCWOG` (Motorcycle Without Gear) for scooties (Honda Activa, TVS Jupiter).
     - `MCWG` (Motorcycle With Gear) for motorcycles (Royal Enfield, Yamaha).
     - `LMV` (Light Motor Vehicle) for passenger cars (Swift, Thar, Nexon EV).
4. **Road Safety & Speed Governance**:
   - **Dual Helmet Mandate**: Mandatory provision of up to 2 ISI-certified helmets (BIS 4151) for two-wheelers under Section 129 of the Motor Vehicles Act.
   - **Speed Governor Compliance**: 80 km/h commercial limiter badge and GPS tracking.
5. **Invoicing & Escrow Deposits**:
   - Itemized GST (5% rental service tax).
   - Security deposits held in escrow with automated UPI refund release upon trip completion.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Apollo Client.
- **Backend API**: Node.js NestJS framework, TypeScript, Apollo Server (`@nestjs/graphql`).
- **Database**: MongoDB 7.0 (`@nestjs/mongoose`, Mongoose ODM) with automated seeding of real Indian vehicles.
- **Event Bus**: Apache Kafka 3.7 (KRaft mode, no Zookeeper required) via `KafkaJS`.
- **Containers**: Multi-service `docker-compose.yml` for MongoDB, Kafka, NestJS, and React.

---

## 🚀 Quick Start (Docker)

To run the complete platform inside Docker containers:

```bash
# 1. Clone repository & build all services
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **GraphQL API Playground**: `http://localhost:4000/graphql`
- **MongoDB 7.0**: `localhost:27017`
- **Apache Kafka Cluster**: `localhost:9092` / `localhost:9094`

---

## 💻 Local Development Setup

If running locally:

```bash
# 1. Start MongoDB and Kafka in Docker
docker compose up -d mongodb kafka

# 2. Start NestJS Backend
cd backend
npm install
npm run start:prod
# Backend runs at http://localhost:4000/graphql

# 3. Start React Frontend
cd ../frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📡 Live Kafka Event Stream Topics

All major lifecycle events publish messages to the `vahaan.events` Kafka topic:

| Event Type | Description |
| :--- | :--- |
| `vehicle.created` | Emitted when a host submits a new vehicle with RTO RC & PUC details |
| `vehicle.approved` | Emitted when an Admin reviews and approves the listing |
| `renter.kyc_submitted` | Emitted when a renter authenticates DL & DigiLocker Aadhaar |
| `booking.created` | Emitted when a reservation is confirmed with a 4-digit handover OTP |
| `payment.completed` | Emitted upon UPI transaction confirmation and escrow deposit hold |
| `deposit.refunded` | Emitted when the host/admin inspects vehicle and releases deposit |

You can view the real-time event audit stream directly inside the web UI by clicking the **Live Kafka Stream** pulse button in the top navigation bar!
