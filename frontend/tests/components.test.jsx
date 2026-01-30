import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserList from '../src/components/UserList';
import Counter from '../src/components/Counter';
import Dashboard from '../src/components/Dashboard';

describe('UserList', () => {
  it('should render without crashing when users is undefined', () => {
    // This test will fail until the bug is fixed
    // Currently crashes because undefined.map() throws
    expect(() => render(<UserList users={undefined} />)).not.toThrow();
  });

  it('should render an empty list when users is an empty array', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText('User List')).toBeDefined();
  });

  it('should render users correctly', () => {
    const users = [
      { id: 1, name: 'Test User', email: 'test@example.com' }
    ];
    render(<UserList users={users} />);
    expect(screen.getByText(/Test User/)).toBeDefined();
  });
});

describe('Counter', () => {
  it('should render without crashing', () => {
    // This test will fail until the bug is fixed
    // Currently crashes because 'coutn' is not defined
    expect(() => render(<Counter />)).not.toThrow();
  });

  it('should display the initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByText(/0/)).toBeDefined();
  });
});

describe('Dashboard', () => {
  it('should render without crashing', () => {
    // This test will fail until the bug is fixed
    // Currently crashes because useEffect is not imported
    expect(() => render(<Dashboard />)).not.toThrow();
  });

  it('should show loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Loading/)).toBeDefined();
  });
});
