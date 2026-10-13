import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_VEHICLES,
  GET_BOOKINGS,
  GET_ADMIN_OVERVIEW,
  GET_KAFKA_AUDIT_EVENTS,
  GET_USERS,
  CREATE_VEHICLE,
  APPROVE_VEHICLE_LISTING,
  REJECT_VEHICLE_LISTING,
  SUBMIT_KYC,
  CREATE_BOOKING,
  RELEASE_SECURITY_DEPOSIT,
} from './graphql/operations';

import Navbar from './components/Navbar';
import HeroSection from './components/LandingPage/HeroSection';
import HostEarningsCalculator from './components/LandingPage/HostEarningsCalculator';
import RegulatoryComplianceBanner from './components/LandingPage/RegulatoryComplianceBanner';
import VehicleCategories from './components/LandingPage/VehicleCategories';
import HowItWorksSection from './components/LandingPage/HowItWorksSection';
import TestimonialsAndFAQ from './components/LandingPage/TestimonialsAndFAQ';
import Footer from './components/LandingPage/Footer';

import AddListingModal from './components/HostPortal/AddListingModal';
import HostDashboard from './components/HostPortal/HostDashboard';
import DashboardPage from './components/Dashboard/DashboardPage';

import VehicleCatalog from './components/RenterPortal/VehicleCatalog';
import VehicleDetailModal from './components/RenterPortal/VehicleDetailModal';
import RenterKYCModal from './components/RenterPortal/RenterKYCModal';
import BookingPaymentModal from './components/RenterPortal/BookingPaymentModal';
import BookingSuccessModal from './components/RenterPortal/BookingSuccessModal';

import AdminDashboard from './components/AdminPortal/AdminDashboard';
import LiveKafkaStream from './components/LiveKafkaStream';
import AuthModal from './components/AuthModal';
import RenterBookingsView from './components/RenterPortal/RenterBookingsView';
import { useAuth } from './context/AuthContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useEffect } from 'react';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('landing'); // landing, renter, dashboard
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [cities, setCities] = useState(['All Cities']);

  useEffect(() => {
    fetch('/api/vehicles/cities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCities(data);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic cities:', err));
  }, []);

  // Modals state
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [kycBookingData, setKycBookingData] = useState(null);
  const [paymentBookingData, setPaymentBookingData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isKafkaDrawerOpen, setIsKafkaDrawerOpen] = useState(false);

  // Real GraphQL Queries to MongoDB
  const {
    data: vehiclesData,
    loading: vehiclesLoading,
    refetch: refetchVehicles,
  } = useQuery(GET_VEHICLES, {
    pollInterval: 5000,
  });

  const {
    data: bookingsData,
    refetch: refetchBookings,
  } = useQuery(GET_BOOKINGS, {
    pollInterval: 5000,
  });

  const {
    data: adminOverviewData,
    refetch: refetchAdmin,
  } = useQuery(GET_ADMIN_OVERVIEW, {
    pollInterval: 5000,
  });

  const {
    data: kafkaData,
    refetch: refetchKafka,
  } = useQuery(GET_KAFKA_AUDIT_EVENTS, {
    pollInterval: 3000,
  });

  const {
    data: usersData,
    refetch: refetchUsers,
  } = useQuery(GET_USERS, {
    skip: user?.role !== 'ADMIN',
    pollInterval: 5000,
  });

  const [kycRecords, setKycRecords] = useState([]);
  const fetchKycRecords = () => {
    if (user?.role === 'ADMIN') {
      fetch('/api/kyc')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setKycRecords(data);
        })
        .catch((err) => console.warn('Could not fetch KYC records:', err));
    }
  };

  useEffect(() => {
    fetchKycRecords();
  }, [user]);

  // Real GraphQL Mutations to MongoDB
  const [createVehicleMutation, { loading: isCreatingVehicle }] = useMutation(CREATE_VEHICLE, {
    onCompleted: () => {
      refetchVehicles();
      refetchKafka();
      refetchAdmin();
    },
  });

  const [approveVehicleMutation, { loading: isApprovingVehicle }] = useMutation(APPROVE_VEHICLE_LISTING, {
    onCompleted: () => {
      refetchVehicles();
      refetchKafka();
      refetchAdmin();
    },
  });

  const [rejectVehicleMutation, { loading: isRejectingVehicle }] = useMutation(REJECT_VEHICLE_LISTING, {
    onCompleted: () => {
      refetchVehicles();
      refetchKafka();
      refetchAdmin();
    },
  });

  const [submitKycMutation, { loading: isSubmittingKyc }] = useMutation(SUBMIT_KYC, {
    onCompleted: () => {
      refetchKafka();
      fetchKycRecords();
    },
  });

  const [createBookingMutation, { loading: isCreatingBooking }] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      refetchBookings();
      refetchVehicles();
      refetchKafka();
      refetchAdmin();
    },
  });

  const [releaseDepositMutation, { loading: isReleasingDeposit }] = useMutation(RELEASE_SECURITY_DEPOSIT, {
    onCompleted: () => {
      refetchBookings();
      refetchKafka();
      refetchAdmin();
    },
  });

  const vehicles = vehiclesData?.getVehicles || [];
  const bookings = bookingsData?.getBookings || [];
  const users = usersData?.getUsers || [];
  const adminOverview = adminOverviewData?.getAdminOverview || null;
  const kafkaEvents = kafkaData?.getKafkaAuditEvents || [];

  // Handlers
  const handleListingSubmit = async (input) => {
    try {
      await createVehicleMutation({ variables: { input } });
      setIsAddListingOpen(false);
      setActiveTab('dashboard');
    } catch (err) {
      alert('Error creating listing: ' + err.message);
    }
  };

  const handleApproveVehicle = async (id) => {
    try {
      await approveVehicleMutation({ variables: { id } });
    } catch (err) {
      alert('Error approving listing: ' + err.message);
    }
  };

  const handleRejectVehicle = async (id, reason) => {
    try {
      await rejectVehicleMutation({ variables: { id, reason } });
    } catch (err) {
      alert('Error rejecting listing: ' + err.message);
    }
  };

  const handleReleaseDeposit = async (id, refundAmount, deductionReason) => {
    try {
      await releaseDepositMutation({
        variables: { id, refundAmount, deductionReason },
      });
    } catch (err) {
      alert('Error releasing deposit: ' + err.message);
    }
  };

  const renterBookingsCount = bookings.filter((b) => {
    if (!user) return false;
    return b.renterPhone === user.phone || b.renterEmail === user.email || b.renterName === user.name;
  }).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        onOpenAddListing={() => {
          if (!isAuthenticated) {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          } else {
            setIsAddListingOpen(true);
          }
        }}
        onOpenKafkaDrawer={() => setIsKafkaDrawerOpen(true)}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        kafkaEventCount={kafkaEvents.length}
        renterBookingsCount={renterBookingsCount}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {/* 1. Landing Page View */}
        {activeTab === 'landing' && (
          <div>
            <HeroSection
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              cities={cities}
              onSearchVehicles={(filter) => {
                if (filter.city) setSelectedCity(filter.city);
                setActiveTab('renter');
              }}
              onOpenAddListing={() => setIsAddListingOpen(true)}
            />

            <HostEarningsCalculator
              onOpenAddListing={() => setIsAddListingOpen(true)}
            />

            <RegulatoryComplianceBanner />

            <VehicleCategories
              vehicles={vehicles}
              onSelectVehicle={(v) => setDetailVehicle(v)}
              onExploreCategory={() => setActiveTab('renter')}
            />

            <HowItWorksSection
              onOpenAddListing={() => setIsAddListingOpen(true)}
              onExploreRenter={() => setActiveTab('renter')}
            />

            <TestimonialsAndFAQ />
          </div>
        )}

        {/* 2. Renter Portal View */}
        {activeTab === 'renter' && (
          <VehicleCatalog
            vehicles={vehicles}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            onSelectVehicle={(v) => setDetailVehicle(v)}
          />
        )}

        {/* 3. Post-Login Dedicated Dashboard (Role-Aware: RENTER, HOST, ADMIN) */}
        {activeTab === 'dashboard' && (
          !isAuthenticated ? (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground font-display">
                Sign In to Access Your Dashboard
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                Please sign in to view your bookings, fleet listings, escrow deposits, or platform admin controls.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow hover:opacity-95 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('renter')}
                  className="px-5 py-2.5 rounded-xl bg-muted border border-border text-foreground font-bold text-xs hover:bg-muted/80 transition cursor-pointer"
                >
                  Explore Fleet
                </button>
              </div>
            </div>
          ) : (
            <DashboardPage
              vehicles={vehicles}
              bookings={bookings}
              users={users}
              kycRecords={kycRecords}
              adminOverview={adminOverview}
              onApproveVehicle={handleApproveVehicle}
              onRejectVehicle={handleRejectVehicle}
              onReleaseDeposit={handleReleaseDeposit}
              onRefreshData={() => {
                refetchVehicles();
                refetchBookings();
                refetchAdmin();
                refetchKafka();
                if (user?.role === 'ADMIN') {
                  refetchUsers();
                  fetchKycRecords();
                }
              }}
              onViewKafkaEvents={() => setIsKafkaDrawerOpen(true)}
              onOpenAddListing={() => setIsAddListingOpen(true)}
              onExploreVehicles={() => setActiveTab('renter')}
              onViewVoucher={(b) => setConfirmedBooking(b)}
              isActionLoading={isApprovingVehicle || isRejectingVehicle || isReleasingDeposit}
            />
          )
        )}

        {/* 4. Backward Compatibility: Direct Bookings view */}
        {activeTab === 'bookings' && (
          <RenterBookingsView
            bookings={bookings}
            onExploreVehicles={() => setActiveTab('renter')}
            onViewVoucher={(b) => setConfirmedBooking(b)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals */}
      {/* 1. Add Listing Modal (5-Step India RTO Compliance) */}
      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
        onSubmitListing={handleListingSubmit}
        isSubmitting={isCreatingVehicle}
      />

      {/* 2. Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={detailVehicle}
        isOpen={Boolean(detailVehicle)}
        onClose={() => setDetailVehicle(null)}
        onProceedToKyc={(bookingData) => {
          setDetailVehicle(null);
          setKycBookingData(bookingData);
        }}
      />

      {/* 3. Renter DigiLocker & DL KYC Modal */}
      <RenterKYCModal
        isOpen={Boolean(kycBookingData)}
        bookingData={kycBookingData}
        onClose={() => setKycBookingData(null)}
        onSubmitKycMutation={async (kycInput) => {
          const res = await submitKycMutation({ variables: { input: kycInput } });
          return res.data?.submitKyc;
        }}
        isSubmitting={isSubmittingKyc}
        onKycVerified={(verifiedBookingData) => {
          setKycBookingData(null);
          setPaymentBookingData(verifiedBookingData);
        }}
      />

      {/* 4. Booking & UPI Payment Checkout Modal */}
      <BookingPaymentModal
        isOpen={Boolean(paymentBookingData)}
        bookingData={paymentBookingData}
        onClose={() => setPaymentBookingData(null)}
        onSubmitBookingMutation={async (bookingInput) => {
          const res = await createBookingMutation({ variables: { input: bookingInput } });
          return res.data?.createBooking;
        }}
        isSubmitting={isCreatingBooking}
        onBookingSuccess={(bookingRecord) => {
          setPaymentBookingData(null);
          setConfirmedBooking(bookingRecord);
        }}
      />

      {/* 5. Booking Success Voucher Modal */}
      <BookingSuccessModal
        isOpen={Boolean(confirmedBooking)}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewKafkaEvents={() => {
          setConfirmedBooking(null);
          setIsKafkaDrawerOpen(true);
        }}
      />

      {/* 6. Live Kafka Event Stream Drawer */}
      <LiveKafkaStream
        isOpen={isKafkaDrawerOpen}
        onClose={() => setIsKafkaDrawerOpen(false)}
        events={kafkaEvents}
        onRefresh={() => refetchKafka()}
        loading={false}
      />

      {/* 7. Auth Modal (Sign In / Create Account with Lovable styling) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}
