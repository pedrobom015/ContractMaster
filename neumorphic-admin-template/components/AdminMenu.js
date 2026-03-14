// components/AdminMenu.js
import React, { useState } from 'react';
import Link from 'next/link'; // Using Next.js Link for client-side navigation

// Define a reusable MenuItem component
const MenuItem = ({ href, children, isActive, onClick }) => {
  // Basic styling for menu items, can be enhanced with CSS classes from globals.css or a module
  const itemStyle = {
    display: 'block',
    padding: '12px 18px',
    margin: '8px 0',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#555',
    fontWeight: 500,
    backgroundColor: '#e0e0e0', // Base color
    transition: 'all 0.15s ease-in-out',
  };

  // Apply Neumorphic styles based on active state
  const activeStyle = isActive ? {
    boxShadow: 'inset 4px 4px 8px #bcbcbc, inset -4px -4px 8px #ffffff', // Pressed-in look
    color: '#333', // Darker text for active item
  } : {
    boxShadow: '4px 4px 8px #bcbcbc, -4px -4px 8px #ffffff', // Extruded look
  };

  // Hover style (can be managed with CSS :hover as well if preferred)
  // For simplicity in JS, we might add a class on hover or handle it purely in CSS.
  // Let's assume globals.css will have a .neumorphic-menu-item:hover if needed.

  return (
    <Link href={href} passHref>
      <a style={{ ...itemStyle, ...activeStyle }} onClick={onClick} className="neumorphic-menu-item">
        {children}
      </a>
    </Link>
  );
};

const AdminMenu = () => {
  const [activeItem, setActiveItem] = useState(''); // To track the active menu item

  const menuItems = [
    { id: 'dashboard', href: '/', label: 'Dashboard' },
    { id: 'users', href: '/users', label: 'Users' }, // We'll create a sample /users page
    { id: 'groups', href: '#', label: 'Groups' },
    { id: 'programs', href: '#', label: 'Programs' },
    { id: 'permissions', href: '#', label: 'Permissions (Program Groups)' },
  ];

  return (
    <nav style={{ width: '100%' }}>
      <h2 style={{ color: '#484848', marginBottom: '20px', fontWeight: '600' }}>Admin Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map(item => (
          <li key={item.id}>
            <MenuItem
              href={item.href}
              isActive={activeItem === item.id}
              onClick={() => setActiveItem(item.id)}
            >
              {item.label}
            </MenuItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminMenu;
