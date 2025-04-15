import styles from "./page.module.css";
import Image from 'next/image';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>Project path:<input style={{ minWidth: 480 }}></input></div>
        <div>Main search:
          <input style={{ minWidth: 130 }}></input>
          <span style={{ marginLeft: 12 }}></span>
        Around <input style={{ width: 32, marginLeft: 2 }}></input> Rows
        <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
        <input></input>
        </div>
        <div>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 35 }}></Image>
          <input></input>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
          <input></input>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
          <input></input>
          <button style={{ marginLeft: 8, paddingLeft: 4, paddingRight: 4 }}>Search</button>
          <div className={styles.loadingSpin} style={{ display: "inline-block", marginLeft: 4, marginTop: 0, verticalAlign: 'bottom' }}></div>
        </div>
      </main>
      <footer className={styles.footer}>
        <div>Advanced Search UI</div>
      </footer>
    </div>
  );
}
