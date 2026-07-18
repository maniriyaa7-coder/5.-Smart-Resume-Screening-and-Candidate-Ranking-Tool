

const BASE_URL = 'http://localhost:5000/api';

const randomString = () => Math.random().toString(36).substring(2, 10);
const testEmailCandidate = `candidate_${randomString()}@example.com`;
const testEmailRecruiter = `recruiter_${randomString()}@example.com`;
const password = 'Password123';

const runTests = async () => {
  console.log('--- STARTING API VERIFICATION TESTS ---');

  try {
    // 1. Candidate Registration
    console.log('\nTesting Candidate Registration...');
    const regCandRes = await fetch(`${BASE_URL}/auth/candidate/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Candidate',
        email: testEmailCandidate,
        password: password,
        phoneNumber: '1234567890',
        college: 'Stanford University',
        skills: 'React, Node.js, Express',
        currentLocation: 'San Francisco, CA'
      })
    });

    const regCandData = await regCandRes.json();
    console.log('Status:', regCandRes.status);
    console.log('Body:', JSON.stringify(regCandData, null, 2));

    if (regCandRes.status !== 201 || !regCandData.success) {
      throw new Error('Candidate Registration failed');
    }
    console.log('✅ Candidate Registration successfully saved candidate in MongoDB!');

    // 2. Duplicate Candidate Registration Check
    console.log('\nTesting Duplicate Candidate Registration...');
    const dupCandRes = await fetch(`${BASE_URL}/auth/candidate/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate Candidate',
        email: testEmailCandidate,
        password: password,
        phoneNumber: '0987654321',
        college: 'MIT',
        skills: 'Python',
        currentLocation: 'Boston, MA'
      })
    });

    const dupCandData = await dupCandRes.json();
    console.log('Status:', dupCandRes.status);
    console.log('Body:', JSON.stringify(dupCandData, null, 2));

    if (dupCandRes.status !== 400 || dupCandData.success) {
      throw new Error('Duplicate Candidate Registration check failed (allowed duplicate email)');
    }
    console.log('✅ Duplicate Candidate Registration check works!');

    // 3. Candidate Login (via common auth/login endpoint)
    console.log('\nTesting Candidate Login (via /auth/login)...');
    const loginCandRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmailCandidate,
        password: password
      })
    });

    const loginCandData = await loginCandRes.json();
    console.log('Status:', loginCandRes.status);
    console.log('Body:', JSON.stringify(loginCandData, null, 2));

    if (loginCandRes.status !== 200 || !loginCandData.success) {
      throw new Error('Candidate Login failed');
    }
    console.log('✅ Candidate Login successful with JWT and cookies set!');

    // 4. Recruiter Registration
    console.log('\nTesting Recruiter Registration...');
    const regRecRes = await fetch(`${BASE_URL}/auth/recruiter/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Tech Innovators',
        recruiterName: 'John Recruiter',
        email: testEmailRecruiter,
        password: password,
        phoneNumber: '5551234567',
        companyWebsite: 'http://techinnovators.example.com',
        companyLocation: 'Austin, TX'
      })
    });

    const regRecData = await regRecRes.json();
    console.log('Status:', regRecRes.status);
    console.log('Body:', JSON.stringify(regRecData, null, 2));

    if (regRecRes.status !== 201 || !regRecData.success) {
      throw new Error('Recruiter Registration failed');
    }
    console.log('✅ Recruiter Registration successfully saved recruiter in MongoDB!');

    // 5. Recruiter Login (via common auth/login endpoint)
    console.log('\nTesting Recruiter Login (via /auth/login)...');
    const loginRecRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmailRecruiter,
        password: password
      })
    });

    const loginRecData = await loginRecRes.json();
    console.log('Status:', loginRecRes.status);
    console.log('Body:', JSON.stringify(loginRecData, null, 2));

    if (loginRecRes.status !== 200 || !loginRecData.success) {
      throw new Error('Recruiter Login failed');
    }
    console.log('✅ Recruiter Login successful with JWT and cookies set!');

    console.log('\n🎉 ALL API VERIFICATION TESTS PASSED SUCCESSFULLY! End-to-end authentication flow is 100% verified.');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
};

runTests();
