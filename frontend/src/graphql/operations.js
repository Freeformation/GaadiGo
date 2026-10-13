import { gql } from '@apollo/client';

export const GET_VEHICLES = gql`
  query GetVehicles($filter: VehicleFilterInput) {
    getVehicles(filter: $filter) {
      id
      title
      category
      brand
      modelName
      year
      fuelType
      transmission
      seatingCapacity
      registrationNumber
      plateType
      rcStatus
      rcDocumentUrl
      insurancePolicyNumber
      insuranceCompany
      insuranceExpiry
      pucExpiry
      fastagId
      speedGovernorFitted
      helmetsProvided
      gpsTracked
      city
      areaHub
      address
      doorstepDeliveryAvailable
      doorstepDeliveryFee
      hourlyRate
      dailyRate
      securityDeposit
      kmLimitPerDay
      extraKmCharge
      fuelPolicy
      images
      status
      adminRemarks
      rating
      tripCount
      hostName
      hostPhone
    }
  }
`;

export const GET_VEHICLE_STATS = gql`
  query GetVehicleStats {
    getVehicleStats {
      totalVehicles
      activeListings
      pendingApprovals
      scootyCount
      bikeCount
      carCount
      evCount
    }
  }
`;

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      id
      title
      category
      registrationNumber
      status
      city
      dailyRate
      securityDeposit
    }
  }
`;

export const SUBMIT_KYC = gql`
  mutation SubmitKyc($input: SubmitKycInput!) {
    submitKyc(input: $input) {
      id
      userName
      userPhone
      dlNumber
      dlCategory
      aadhaarMasked
      verificationStatus
      isDigiLockerVerified
      helmetDeclarationAccepted
    }
  }
`;

export const GET_KYC_BY_PHONE = gql`
  query GetKycByPhone($phone: String!) {
    getKycByPhone(phone: $phone) {
      id
      userName
      userPhone
      dlNumber
      dlCategory
      aadhaarMasked
      verificationStatus
      isDigiLockerVerified
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      vehicleTitle
      vehicleRegistrationNumber
      vehicleCategory
      renterName
      renterPhone
      startDate
      endDate
      totalDays
      basePrice
      deliveryFee
      securityDeposit
      gstAmount
      convenienceFee
      totalAmount
      pickupOtp
      paymentStatus
      paymentMethod
      paymentTransactionId
      tripStatus
      depositStatus
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetBookings {
    getBookings {
      id
      vehicleTitle
      vehicleRegistrationNumber
      vehicleCategory
      vehicleImage
      renterName
      renterPhone
      startDate
      endDate
      totalDays
      pickupType
      totalAmount
      securityDeposit
      pickupOtp
      paymentStatus
      paymentMethod
      paymentTransactionId
      tripStatus
      depositStatus
      depositDeductionReason
      createdAt
    }
  }
`;

export const RELEASE_SECURITY_DEPOSIT = gql`
  mutation ReleaseSecurityDeposit($id: ID!, $refundAmount: Float!, $deductionReason: String) {
    releaseSecurityDeposit(id: $id, refundAmount: $refundAmount, deductionReason: $deductionReason) {
      id
      depositStatus
      depositRefundTxnId
      depositDeductionReason
    }
  }
`;

export const GET_ADMIN_OVERVIEW = gql`
  query GetAdminOverview {
    getAdminOverview {
      totalVehicles
      pendingApprovals
      activeRentals
      totalRevenue
      securityDepositInEscrow
      totalVerifiedRenters
    }
  }
`;

export const APPROVE_VEHICLE_LISTING = gql`
  mutation ApproveVehicleListing($id: ID!) {
    approveVehicleListing(id: $id) {
      id
      status
      rcStatus
    }
  }
`;

export const REJECT_VEHICLE_LISTING = gql`
  mutation RejectVehicleListing($id: ID!, $reason: String!) {
    rejectVehicleListing(id: $id, reason: $reason) {
      id
      status
      adminRemarks
    }
  }
`;

export const GET_KAFKA_AUDIT_EVENTS = gql`
  query GetKafkaAuditEvents {
    getKafkaAuditEvents {
      id
      topic
      eventType
      payload
      timestamp
      status
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
        city
        aadhaarMasked
        dlNumber
        isKycVerified
        avatarUrl
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
        city
        aadhaarMasked
        dlNumber
        isKycVerified
        avatarUrl
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      phone
      role
      city
      isKycVerified
      avatarUrl
      createdAt
    }
  }
`;

export const GET_FAQS = gql`
  query GetFaqs {
    getFaqs {
      id
      question
      answer
      category
      order
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews {
    getReviews {
      id
      name
      role
      quote
      rating
      vehicleTitle
      city
    }
  }
`;


