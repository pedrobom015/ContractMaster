// components/Layout.js
import React from 'react';
import Head from 'next/head';
import AdminMenu from './AdminMenu'; // Import the AdminMenu

const Layout = ({ children, title = 'Neumorphic Admin' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* Apply a wrapper to center the layout for demo on wider screens */}
      <div style={{
        display: 'flex',
        flexDirection: 'column', /* Stack header and main content vertically */
        alignItems: 'center', /* Center children horizontally */
        width: '100%'
      }}>
        {/* Optional: Header can go here if needed later */}
        {/* <header style={{ width: '100%', maxWidth: '1200px', padding: '20px', marginBottom: '20px', textAlign: 'center' }} className="neumorphic-container">
          <h1>Neumorphic Admin System</h1>
        </header> */}

        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '1200px', /* Max width for the content area */
          minHeight: 'calc(100vh - 40px)', /* Adjust if header added and considering body's paddingTop */
          backgroundColor: '#e0e0e0' /* Ensure layout container has base color */
        }}>
          <aside style={{
              width: '280px', /* Slightly wider menu */
              minHeight: '100%', /* Make sidebar take full height of its container */
              padding: '25px 20px',
              // Using neumorphic-container style for the sidebar itself
              // but with potentially different shadow direction or intensity if desired.
              // For now, let's give it a slightly different look to distinguish from main content cards.
              // Or, make it flat and part of the background. Let's try flat first.
              backgroundColor: '#e0e0e0', // same as body
              // borderRight: '1px solid #cccccc' // Removed for cleaner Neumorphic look
           }}
           className="neumorphic-container-inset" // Making the menu container inset
           >
            <AdminMenu />
          </aside>
          <main style={{
              flexGrow: 1,
              padding: '25px', /* Consistent padding */
              // The main content itself does not need to be a neumorphic container by default
              // Individual pages/cards within main will be.
            }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
