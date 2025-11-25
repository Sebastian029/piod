import React, { useState } from "react";
import styles from "./Modal.module.css"; 

export function RegisterForm({ onRegister }: { onRegister: (data: {username: string, email: string, password: string}) => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onRegister({ username, email, password });
    }}>
      <h2>Register</h2>
      <div className={styles.inputs}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={styles.input}
        />
      </div>
      <div className={styles.buttons}>
        <button type="submit">Sign Up</button>
      </div>
    </form>
  );
}
