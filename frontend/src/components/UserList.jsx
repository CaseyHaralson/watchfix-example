import { useState, useEffect } from 'react';

// BUG: This component assumes `users` prop is always an array
// but it might be undefined during initial render or when data loading fails
function UserList({ users }) {
  return (
    <div className="user-list">
      <h3>User List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
