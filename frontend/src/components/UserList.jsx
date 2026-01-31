import { useState, useEffect } from 'react';

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
