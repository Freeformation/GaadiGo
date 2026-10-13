// scratch/test-rbac-enforcement.mjs
const BASE_URL = 'http://localhost:4000';

async function runRbacTests() {
  console.log('===============================================================');
  console.log('🛡️  STARTING COMPREHENSIVE RBAC & REAL-DATA VERIFICATION TEST');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Unauthenticated checks (No Token)
  console.log('1. Testing Unauthenticated Request Restrictions...');
  const unauthedAdminRes = await fetch(`${BASE_URL}/api/admin/overview`);
  assert(
    unauthedAdminRes.status === 401,
    `Unauthenticated access to /api/admin/overview returns 401 Unauthorized (got ${unauthedAdminRes.status})`
  );

  const unauthedVehicleCreate = await fetch(`${BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Unauthorized Vehicle', dailyRate: 500 }),
  });
  assert(
    unauthedVehicleCreate.status === 401,
    `Unauthenticated access to POST /api/vehicles returns 401 Unauthorized (got ${unauthedVehicleCreate.status})`
  );

  // 2. Register RENTER
  console.log('\n2. Testing RENTER Permissions & Restrictions...');
  const renterEmail = `renter_${Date.now()}@vahaan.in`;
  const renterRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Sharma',
      email: renterEmail,
      password: 'password123',
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'RENTER',
      city: 'Bengaluru',
    }),
  });
  const renterReg = await renterRegRes.json();
  const renterToken = renterReg.token;
  assert(renterReg.user?.role === 'RENTER', `Registered user with role 'RENTER'`);

  // RENTER tries to access Admin overview -> 403 Forbidden
  const renterAdminRes = await fetch(`${BASE_URL}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${renterToken}` },
  });
  assert(
    renterAdminRes.status === 403,
    `RENTER blocked from /api/admin/overview with 403 Forbidden (got ${renterAdminRes.status})`
  );

  // RENTER tries to approve a vehicle -> 403 Forbidden
  const renterApproveRes = await fetch(`${BASE_URL}/api/vehicles/670bb1234567890123456789/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${renterToken}` },
  });
  assert(
    renterApproveRes.status === 403,
    `RENTER blocked from approving vehicle listings with 403 Forbidden (got ${renterApproveRes.status})`
  );

  // 3. Register HOST
  console.log('\n3. Testing HOST Permissions & Restrictions...');
  const hostEmail = `host_${Date.now()}@vahaan.in`;
  const hostRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Vikram Rajput',
      email: hostEmail,
      password: 'password123',
      phone: `+91 97${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: 'HOST',
      city: 'Goa',
    }),
  });
  const hostReg = await hostRegRes.json();
  const hostToken = hostReg.token;
  assert(hostReg.user?.role === 'HOST', `Registered user with role 'HOST'`);

  // HOST creates listing -> 201 Success
  const hostListingRes = await fetch(`${BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hostToken}`,
    },
    body: JSON.stringify({
      title: 'Ather 450X Gen 3',
      category: 'EV',
      brand: 'Ather',
      modelName: '450X',
      year: 2024,
      fuelType: 'ELECTRIC',
      transmission: 'AUTOMATIC',
      seatingCapacity: 2,
      registrationNumber: `GA 03 E ${Math.floor(1000 + Math.random() * 9000)}`,
      plateType: 'YELLOW_COMMERCIAL',
      insurancePolicyNumber: 'POL-ATH-88329',
      insuranceCompany: 'Digit General Insurance',
      insuranceExpiry: '2026-12-31',
      pucExpiry: '2026-12-31',
      speedGovernorFitted: false,
      helmetsProvided: 2,
      gpsTracked: true,
      city: 'Goa',
      areaHub: 'Panjim Waterfront',
      pincode: '403001',
      address: 'Shop 4, MG Road, Panjim, Goa',
      doorstepDeliveryAvailable: true,
      doorstepDeliveryFee: 150,
      hourlyRate: 80,
      dailyRate: 649,
      securityDeposit: 1000,
      kmLimitPerDay: 100,
      extraKmCharge: 4,
      fuelPolicy: 'SAME_TO_SAME',
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'],
      hostName: 'Vikram Rajput',
      hostPhone: hostReg.user.phone,
    }),
  });
  const createdVehicle = await hostListingRes.json();
  assert(
    hostListingRes.status === 201 && createdVehicle._id,
    `HOST successfully allowed to list vehicle (Status 201, ID: ${createdVehicle._id})`
  );

  // HOST tries to access Admin overview -> 403 Forbidden
  const hostAdminRes = await fetch(`${BASE_URL}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${hostToken}` },
  });
  assert(
    hostAdminRes.status === 403,
    `HOST blocked from /api/admin/overview with 403 Forbidden (got ${hostAdminRes.status})`
  );

  // HOST tries to release deposit -> 403 Forbidden
  const hostReleaseRes = await fetch(`${BASE_URL}/api/bookings/670bb1234567890123456789/release-deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hostToken}`,
    },
    body: JSON.stringify({ refundAmount: 1000 }),
  });
  assert(
    hostReleaseRes.status === 403,
    `HOST blocked from releasing deposit with 403 Forbidden (got ${hostReleaseRes.status})`
  );

  // 4. Login as ADMIN
  console.log('\n4. Testing ADMIN Permissions...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@vahaanrent.in',
      password: 'password123',
    }),
  });
  const adminLogin = await adminLoginRes.json();
  const adminToken = adminLogin.token;
  assert(adminLogin.user?.role === 'ADMIN', `Logged in as ADMIN (${adminLogin.user?.name})`);

  // ADMIN accesses /api/admin/overview -> 200 Success
  const adminOverviewRes = await fetch(`${BASE_URL}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminOverview = await adminOverviewRes.json();
  assert(
    adminOverviewRes.status === 200 && adminOverview.totalVehicles >= 1,
    `ADMIN allowed access to /api/admin/overview (Total vehicles: ${adminOverview.totalVehicles})`
  );

  // ADMIN approves the newly created host vehicle -> 200 Success
  const adminApproveRes = await fetch(`${BASE_URL}/api/vehicles/${createdVehicle._id}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const approvedVehicle = await adminApproveRes.json();
  assert(
    adminApproveRes.status === 200 && approvedVehicle.status === 'APPROVED',
    `ADMIN approved vehicle #${createdVehicle._id} (Status: ${approvedVehicle.status})`
  );

  // 5. Dynamic Content & Rates
  console.log('\n5. Verifying Dynamic Content & Rates (No Static Mock Data)...');
  const faqsRes = await fetch(`${BASE_URL}/api/content/faqs`);
  const faqs = await faqsRes.json();
  assert(faqs.length >= 5, `Fetched ${faqs.length} dynamic FAQs from MongoDB`);

  const reviewsRes = await fetch(`${BASE_URL}/api/content/reviews`);
  const reviews = await reviewsRes.json();
  assert(reviews.length >= 3, `Fetched ${reviews.length} dynamic Customer Reviews from MongoDB`);

  const ratesRes = await fetch(`${BASE_URL}/api/vehicles/category-rates`);
  const rates = await ratesRes.json();
  assert(
    rates.some((r) => r.category === 'SCOOTY' && r.averageDailyRate > 0),
    `Dynamic category rates calculated from live database vehicles`
  );

  const citiesRes = await fetch(`${BASE_URL}/api/vehicles/cities`);
  const cities = await citiesRes.json();
  assert(
    cities.includes('All Cities') && cities.includes('Bengaluru') && cities.includes('Goa'),
    `Dynamic cities served from distinct database listings: [${cities.join(', ')}]`
  );

  console.log('\n===============================================================');
  console.log(`📊 FINAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runRbacTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
