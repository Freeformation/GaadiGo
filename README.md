# 🚗 GaadiGo (VahaanRent) — India Vehicle Rental Marketplace

> Full-stack peer-to-peer and self-drive vehicle rental marketplace engineered for the **Indian transport ecosystem**, compliant with the **Motor Vehicles Act 1988**, **Rent-a-Motorcycle Scheme 1997**, **Rent-a-Cab Scheme 1989**, and Central Motor Vehicles Rules (CMVR).
>
> Built with **Node.js NestJS**, **MongoDB 7.0**, **GraphQL (Apollo Server)**, **Apache Kafka (KRaft mode)**, **React 19 + Tailwind v4**, and **Docker**.
>
> **100% Real API & Database-Backed** — Zero static mock data. Backed by live MongoDB persistence, distributed Kafka audit events, and role-based access control (RBAC).

---

## 👥 Pre-Seeded Test User Credentials

Use these credentials to sign in directly through the UI or API:

| Role | Email | Password | Full Name | Phone | Permissions / Access |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@vahaanrent.in` | `password123` | VahaanRent Compliance Officer | `+91 99000 11223` | Full control: RTO reviews, verify/reject vehicles, release UPI escrow deposits, audit all users, bookings & Kafka stream |
| **HOST** | `vikram.host@vahaanrent.in` | `password123` | Vikramaditya Rao | `+91 98450 12345` | Host Portal: List scooty/bike/car, view registered fleet, inspect earnings & UPI payout summaries |
| **RENTER** | `priya.renter@vahaanrent.in` | `password123` | Priya Sundaram | `+91 98860 98765` | Renter Portal: Explore fleet, instant DigiLocker e-KYC, book rides with 4-digit pickup OTP, track escrow refund status |

> **Note**: You can also register a brand new account of any role (`RENTER` or `HOST`) via the **Sign In / Create Account** modal on the website.

---

## 🚀 How to Run the Project

You can run the application either with **Docker Compose** (recommended for production-like multi-container execution) or with **Local Development Mode**.

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker & Docker Desktop](https://www.docker.com/) (with Docker Compose v2)
- Git

---

### Option A: Complete Docker Setup (One-Click)

This command boots MongoDB 7.0, Apache Kafka 3.7 (KRaft), the NestJS backend, and the Vite frontend simultaneously:

```bash
# 1. Clone repository (if not already done)
git clone <repo-url>
cd rent-out-as-new

# 2. Start all services via Docker Compose
docker compose up --build
```

#### Running Endpoints:
- **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Apollo GraphQL Playground**: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- **MongoDB 7.0**: `localhost:27017`
- **Apache Kafka (KRaft Broker)**: `localhost:9092` / `localhost:9094`

To stop all services:
```bash
docker compose down
```

---

### Option B: Local Development Setup (Step-by-Step)

#### 1. Start Database & Kafka Containers
```bash
docker compose up -d mongodb kafka
```

Verify containers are healthy:
```bash
docker ps
# Ensure 'vahaan-mongodb' and 'vahaan-kafka' are running
```

#### 2. Start NestJS Backend
Open a terminal:
```bash
cd backend
npm install
npm run build
npm run start:prod
# Backend listening on http://localhost:4000
```
*(On initial startup, MongoDB automatically seeds initial vehicles, KYC records, FAQs, reviews, and test users if the collections are empty.)*

#### 3. Start React Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend dev server running on http://localhost:5173
```
Open your browser at **http://localhost:5173**.

#### 4. Run Automated RBAC Test Suite
To verify end-to-end security, role-based access control, and live database queries:
```bash
node scratch/test-rbac-enforcement.mjs
# Runs all 16 automated tests (RBAC validation, REST & GraphQL endpoint tests)
```

---

## 🏛️ System Architecture & Technical Documentation

### High-Level Architecture Diagram

```
       ┌────────────────────────────────────────────────────────┐
       │                   React 19 Frontend                    │
       │     (Tailwind CSS v4, Apollo Client, Vite Proxy)      │
       └───────────────────────────┬────────────────────────────┘
                                   │ HTTP / GraphQL (Bearer Token)
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                NestJS Backend Engine                   │
       │       (Controllers, Resolvers, RolesGuard RBAC)        │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
        Mongoose ODM  │                          │ KafkaJS Producer
                      ▼                          ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │      MongoDB 7.0       │      │   Apache Kafka 3.7     │
       │ (Users, Fleet, KYC,    │      │  (KRaft Mode Topic:    │
       │  Bookings, Content)    │      │    'vahaan.events')    │
       └────────────────────────┘      └────────────────────────┘
```

---

### 1. Indian Regulatory & Transport Compliance Model

The platform integrates statutory transport requirements under the **Motor Vehicles Act 1988** and **Ministry of Road Transport and Highways (MoRTH)**:

1. **Vehicle Plate & Registration Classifications**:
   - `YELLOW_COMMERCIAL`: State commercial self-drive permit plate.
   - `BLACK_YELLOW_RENTAL`: Rent-a-Cab Scheme 1989 / Rent-a-Motorcycle Scheme 1997.
   - `PRIVATE_P2P_LEASE`: Peer-to-peer compliant community sharing backed by statutory mutual bailment contract deeds under the *Indian Contract Act 1872*.
   - Parivahan Vahan Registration Certificate (RC) status verification.

2. **Mandatory Road Safety Standards**:
   - **Dual Helmet Mandate**: Two-wheelers mandate provision of up to 2 ISI-certified helmets (BIS standard 4151) under Section 129 of the Motor Vehicles Act.
   - **Speed Governor & Tracking**: 80 km/h commercial limiter badge and GPS tracking.
   - **CMVR Pollution (PUC) & FASTag**: Active PUC center code check (non-EVs) and NPCI FASTag toll pass-through for 4-wheelers.

3. **DigiLocker & DL Class Verification (e-KYC)**:
   - Masked Aadhaar authentication (`XXXX-XXXX-1234`).
   - Parivahan Driving License class validation:
     - `MCWOG`: Motorcycle Without Gear (Activa, Jupiter).
     - `MCWG`: Motorcycle With Gear (Royal Enfield, Yamaha).
     - `LMV`: Light Motor Vehicle (Cars & SUVs).

4. **Escrow Security Deposit & Invoicing**:
   - Automated itemized 5% GST calculation.
   - Refundable security deposits safely held in escrow during the rental period.
   - Admin-controlled UPI escrow release upon trip inspection (supporting partial deductions for challans or tolls).

---

### 2. Role-Based Access Control (RBAC) & Post-Login Flow

Authentication uses Bearer token authorization parsed by `RolesGuard` for both REST endpoints and GraphQL resolvers:

- **GUEST**:
  - Public landing page, dynamic vehicle catalog, live category rates, FAQs, and testimonials.
  - No access to administration or host tools.
- **RENTER**:
  - Automatically redirects to **My Dashboard** upon login.
  - Views personal booking history, 4-digit vehicle pickup OTP, trip voucher, and deposit status.
  - Blocked from administrative approval and deposit release endpoints (HTTP 403 Forbidden).
- **HOST**:
  - Automatically redirects to **Host Dashboard** upon login.
  - Real-time fleet management, submission of new vehicles with RC/PUC, estimated net earnings.
  - Blocked from admin regulatory controls (HTTP 403 Forbidden).
- **ADMIN**:
  - Master administrative portal with complete data control:
    - **Pending Approvals Queue**: Review RTO compliance documents and approve or reject submissions.
    - **Fleet Management**: Search, filter, and inspect all vehicles across India.
    - **Users & Roles**: View all platform users, roles, phone numbers, and KYC verification states.
    - **Bookings & Escrow**: Manage all reservations and release 100% or partial security deposit escrow refunds via UPI.
    - **KYC Records**: Review DigiLocker e-KYC submissions, Parivahan DL classifications, and masked Aadhaar records.
    - **Live Kafka Audit Stream**: Inspect live domain events emitted into Kafka.

---

### 3. Kafka Distributed Event Bus

Major lifecycle operations emit domain events to the `vahaan.events` topic:

| Event Name | Trigger Source | Payload Details |
| :--- | :--- | :--- |
| `user.registered` | Auth Module | `userId`, `name`, `email`, `role`, `city` |
| `user.logged_in` | Auth Module | `userId`, `name`, `email`, `role` |
| `vehicle.created` | Vehicle / Host Module | `vehicleId`, `title`, `registrationNumber`, `category`, `hostName` |
| `vehicle.approved` | Admin Module | `vehicleId`, `registrationNumber`, `approvedAt` |
| `vehicle.rejected` | Admin Module | `vehicleId`, `registrationNumber`, `reason`, `rejectedAt` |
| `renter.kyc_submitted`| KYC Module | `kycId`, `userName`, `dlNumber`, `verificationStatus` |
| `booking.created` | Bookings Module | `bookingId`, `vehicleTitle`, `renterName`, `totalAmount`, `pickupOtp` |
| `security_deposit.released` | Bookings Module | `bookingId`, `refundAmount`, `refundTxnId`, `deductionReason` |

*Admins can monitor these events in real time by clicking the **Kafka Stream** button in the dashboard or navbar.*

---

### 4. GraphQL Schema & Key Operations

The Apollo Server exposes the following core operations:

#### Queries
- `getVehicles(filter: VehicleFilterInput): [VehicleModel!]!` — Filter by city, category, status.
- `getBookings: [BookingModel!]!` — Retrieve reservations.
- `getUsers: [UserModel!]!` — All users (Admin only).
- `getAdminOverview: AdminOverviewModel!` — Platform KPI metrics.
- `getKafkaAuditEvents: [KafkaAuditEventModel!]!` — Live event log.
- `getFaqs: [FaqModel!]!` — Dynamic FAQs from MongoDB.
- `getReviews: [ReviewModel!]!` — Dynamic verified customer reviews.
- `getTransactionHistory(filter: TransactionFilterInput): [TransactionModel!]!` — Real financial ledger (rentals, escrow holds, refunds, host earnings payouts).
- `getFinanceSummary: FinanceSummaryModel!` — Financial breakdown (total spent, earnings, escrow held, refunded).

#### Mutations
- `registerUser(input: RegisterInput!): AuthPayloadModel!`
- `loginUser(input: LoginInput!): AuthPayloadModel!`
- `updateUserProfile(input: UpdateProfileInput!): UserModel!` — Update legal name, phone, city, avatar, DL & Aadhaar.
- `changePassword(input: ChangePasswordInput!): Boolean!` — Authenticated bcrypt-hashed password change.
- `requestPasswordReset(input: ForgotPasswordInput!): ForgotPasswordPayloadModel!` — 6-digit OTP generation (simulated in demo mode, SMS/SMTP in live mode).
- `resetPasswordWithOtp(input: ResetPasswordInput!): AuthPayloadModel!` — Verifies OTP, updates bcrypt hash, and returns active session JWT.
- `createVehicle(input: CreateVehicleInput!): VehicleModel!` *(HOST / ADMIN only)*
- `approveVehicleListing(id: ID!): VehicleModel!` *(ADMIN only)*
- `rejectVehicleListing(id: ID!, reason: String!): VehicleModel!` *(ADMIN only)*
- `submitKyc(input: SubmitKycInput!): KycModel!`
- `createBooking(input: CreateBookingInput!): BookingModel!`
- `releaseSecurityDeposit(id: ID!, refundAmount: Float!, deductionReason: String): BookingModel!` *(ADMIN only)*

---

### 5. REST API Endpoints Reference

| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Sign in and receive bearer token |
| `GET` | `/api/auth/users` | Public / Admin | List all registered platform users |
| `GET` | `/api/vehicles` | Public | List vehicles (supports `city`, `category`, `status` filters) |
| `GET` | `/api/vehicles/cities` | Public | Get distinct cities with active vehicles |
| `GET` | `/api/vehicles/category-rates` | Public | Compute live category daily averages |
| `POST` | `/api/vehicles` | HOST, ADMIN | Submit new vehicle listing |
| `PATCH`| `/api/vehicles/:id/approve` | ADMIN | Approve vehicle listing |
| `PATCH`| `/api/vehicles/:id/reject` | ADMIN | Reject vehicle listing |
| `POST` | `/api/kyc/verify` | Public | Submit DigiLocker Aadhaar & DL KYC |
| `GET` | `/api/kyc` | Public / Admin | List all KYC records |
| `GET` | `/api/bookings` | Public / Auth | List bookings |
| `POST` | `/api/bookings` | Public / Auth | Create new booking |
| `POST` | `/api/bookings/:id/release-deposit` | ADMIN | Release escrow deposit |
| `GET` | `/api/admin/overview` | ADMIN | Retrieve regulatory & financial KPIs |
| `GET` | `/api/content/faqs` | Public | Fetch dynamic FAQs |
| `GET` | `/api/content/reviews` | Public | Fetch dynamic verified reviews |

---

## 💳 Razorpay Sandbox & Payment Integration

The checkout flow integrates **Razorpay Standard Checkout** (`https://checkout.razorpay.com/v1/checkout.js`) with support for test UPI VPAs (`success@razorpay`), test credit/debit cards, and NetBanking:
- **Sandbox Test Key**: Pre-configured with default sandbox test key (`rzp_test_1DP5mmOlF5G5ag`) or custom key via `VITE_RAZORPAY_KEY_ID`.
- **Payment Verification**: Captures `razorpay_payment_id` as the transaction reference and generates an instant compliant tax invoice & booking voucher.
- **Fail-safe Fallback**: In case the client browser blocks external third-party scripts or adblockers are active, a direct UPI simulation handler is provided to prevent booking abandonment.

---

## 🎛️ Demo Mode vs Live Mode (OTP & Notifications)

The application includes an environment flag:
```env
DEMO_MODE=true  # Default: true
```

- **When `DEMO_MODE=true` (or unset)**:
  - The 6-digit OTP generated for the **Forgot Password** self-service recovery is returned directly in the GraphQL payload (`simulatedOtp`).
  - The frontend UI displays a notification banner showing the valid OTP code for testing.
  - No external SMS gateway (Twilio, Gupshup, Fast2SMS) or SMTP gateway (SendGrid, AWS SES) credentials are required.

- **When `DEMO_MODE=false`**:
  - The API does **not** return the OTP in the GraphQL response (`simulatedOtp: null`).
  - The backend dispatches the OTP via the configured external SMS/SMTP provider.
  - The user enters the OTP received on their verified mobile number or email to complete the password reset.

---

## 🔒 Security & Code Standards

- **Password Hashing**: Passwords are encrypted with `bcryptjs` salt rounds before database storage.
- **RBAC Security Guard**: Global `RolesGuard` inspects `Authorization: Bearer <token>` on all guarded routes.
- **Vite Reverse Proxy**: All `/api` and `/graphql` calls are proxied locally to prevent CORS issues.
- **Dynamic Data Integrity**: No hardcoded mock vehicles, rates, FAQs, reviews, or cities.

