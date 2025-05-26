import React from 'react';
import { Helmet } from 'react-helmet-async';
import VendorRegistration from './pages/VendorRegistration';

function App() {
  return (
    <>
      <Helmet>
        <title>Vendor Registration - Rashmi Metaliks Limited</title>
        <meta name="description" content="Register as a vendor with Rashmi Metaliks, a leading DI pipe manufacturer. Submit your company profile for review by our procurement team." />
      </Helmet>
      <VendorRegistration />
    </>
  );
}

export default App; 