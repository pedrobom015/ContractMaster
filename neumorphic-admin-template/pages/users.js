// pages/users.js
import React from 'react';
// We'll use classNames from globals.css for styling

const UsersPage = () => {
  // Sample static data for the user list
  const sampleUsers = [
    { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer' },
  ];

  const tableHeaderStyle = {
    padding: '10px 15px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '1px solid #d1d1d1', // Subtle separator
    // Neumorphic header cells could be slightly raised or normal text
  };

  const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #e7e7e7', // Very light separator for rows
  };

  return (
    <div>
      <div className="neumorphic-container" style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '20px' }}>User Management</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          This is a sample page demonstrating Neumorphic UI elements for managing users.
          Functionality is for display purposes only.
        </p>
        <button className="neumorphic-button" style={{ marginRight: '15px' }}>Add New User</button>
        <button className="neumorphic-button">Refresh List</button>
      </div>

      {/* Sample Table in a Neumorphic Container */}
      <div className="neumorphic-container">
        <h2 style={{ marginBottom: '20px' }}>User List</h2>
        <div style={{ overflowX: 'auto' }}> {/* For responsive tables */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e0e0e0' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map(user => (
                <tr key={user.id}>
                  <td style={tableCellStyle}>{user.id}</td>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={tableCellStyle}>{user.role}</td>
                  <td style={{...tableCellStyle, display: 'flex', gap: '10px' }}>
                    <button
                      className="neumorphic-button"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      className="neumorphic-button"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Sample Form in a Neumorphic Container */}
      <div className="neumorphic-container" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Add / Edit User Form</h2>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent actual submission */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
            <input type="text" id="name" className="neumorphic-input" placeholder="Enter full name" />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
            <input type="email" id="email" className="neumorphic-input" placeholder="Enter email address" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Role:</label>
            {/* A Neumorphic select would require more custom styling, using input for now */}
            <input type="text" id="role" className="neumorphic-input" placeholder="Assign role (e.g., Admin, Editor)" />
            {/* For a real select:
            <select id="role" className="neumorphic-input">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            */}
          </div>
          <button type="submit" className="neumorphic-button">Save User</button>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;
