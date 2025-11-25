import React, { useState } from "react";
import styles from "./Modal.module.css"; 

export function LoginForm({ onLogin }: { onLogin: (data: {username: string, password: string}) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={e => { e.preventDefault(); onLogin({ username, password }) }}>
      <h2>Login</h2>
      <div className={styles.inputs}>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={styles.input}
        />
      </div>
      <div className={styles.buttons}>
        <button type="submit">Log in</button>
      </div>
    </form>
  );
}
