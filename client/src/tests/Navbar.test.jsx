import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from '../../components/Navbar';

// Helper to render the Navbar inside a router (required by <Link>)
const renderNavbar = (darkMode = false, setDarkMode = jest.fn()) =>
  render(
    <MemoryRouter>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    </MemoryRouter>
  );

// ─── Brand / Logo ─────────────────────────────────────────────────────────────
describe('Navbar – Brand', () => {
  it('✅ renders the MediCampus brand name', () => {
    renderNavbar();
    expect(screen.getByText('MediCampus')).toBeInTheDocument();
  });

  it('✅ renders the tagline "Smart Health Platform"', () => {
    renderNavbar();
    expect(screen.getByText('Smart Health Platform')).toBeInTheDocument();
  });
});

// ─── Navigation Links ─────────────────────────────────────────────────────────
describe('Navbar – Navigation Links', () => {
  it('✅ renders the Home navigation link', () => {
    renderNavbar();
    // At least one "Home" link should exist (desktop nav)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });

  it('✅ renders the Appointments navigation link', () => {
    renderNavbar();
    expect(screen.getAllByText('Appointments').length).toBeGreaterThan(0);
  });

  it('✅ renders the Medical navigation link', () => {
    renderNavbar();
    expect(screen.getAllByText('Medical').length).toBeGreaterThan(0);
  });
});

// ─── Dark-mode toggle ─────────────────────────────────────────────────────────
describe('Navbar – Dark Mode Toggle', () => {
  it('✅ shows "🌙 Dark" toggle button when in light mode', () => {
    renderNavbar(false);
    // Desktop dark mode button contains "Dark"
    expect(screen.getByText('🌙 Dark')).toBeInTheDocument();
  });

  it('✅ shows "☀️ Light" toggle button when in dark mode', () => {
    renderNavbar(true);
    expect(screen.getByText('☀️ Light')).toBeInTheDocument();
  });

  it('✅ calls setDarkMode when the desktop dark-mode button is clicked', () => {
    const setDarkMode = jest.fn();
    renderNavbar(false, setDarkMode);
    fireEvent.click(screen.getByText('🌙 Dark'));
    expect(setDarkMode).toHaveBeenCalledTimes(1);
    expect(setDarkMode).toHaveBeenCalledWith(true);
  });
});

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
describe('Navbar – Mobile Hamburger Menu', () => {
  it('✅ mobile dropdown is NOT visible by default', () => {
    renderNavbar();
    // "Quick Actions" heading only appears inside the dropdown
    expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
  });

  it('✅ mobile dropdown becomes visible after clicking the menu button (☰)', () => {
    renderNavbar();
    const menuBtn = screen.getByText('☰');
    fireEvent.click(menuBtn);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('✅ mobile dropdown hides after clicking the close button (✕)', () => {
    renderNavbar();
    const openBtn = screen.getByText('☰');
    fireEvent.click(openBtn);
    // The button now shows ✕
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
  });

  it('✅ dropdown shows all quick actions', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('☰'));
    expect(screen.getByText('Book Appointment')).toBeInTheDocument();
    expect(screen.getByText('Check Queue Status')).toBeInTheDocument();
    expect(screen.getByText('Apply Medical')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
  });

  it('✅ Navigation section shows all 6 menu items in dropdown', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('☰'));
    const items = ['Home', 'Appointments', 'Live Queue', 'Medical Records', 'Medical Certificate', 'Emergency'];
    items.forEach(item => {
      // Use getAllByText because desktop nav may also have some of these
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ─── Profile Section ──────────────────────────────────────────────────────────
describe('Navbar – Profile Section', () => {
  it('✅ shows "Student User" inside the open dropdown', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('☰')); // open menu
    expect(screen.getByText('Student User')).toBeInTheDocument();
  });

  it('✅ profile settings panel appears after clicking the ⚙️ button', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('☰'));  // open menu
    fireEvent.click(screen.getByText('⚙️')); // open profile
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
