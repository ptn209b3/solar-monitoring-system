import logo from "../images/logo.svg";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.Loading}>
      <img src={logo} className={styles.Spinner} alt="logo" />
      <div>Loading...</div>
    </div>
  );
}
