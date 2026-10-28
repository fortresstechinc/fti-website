import styles from "./Launch.module.css";

export function LaunchFoot() {
  return (
    <footer className={styles.foot}>
      <span className="label">© {new Date().getFullYear()} FTI. All rights reserved.</span>
    </footer>
  );
}
