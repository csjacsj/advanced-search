"use client"

import styles from "./page.module.css";
import Image from 'next/image';
import SearchButton, { ResultRecord } from './SearchButton';
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [projectDir, setProjectDir] = useState('');
  console.log('results', results);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>Project path:<input id='projdir_input' style={{ minWidth: 480 }}></input></div>
        <div>Main search:
          <input id='findstr_input' style={{ minWidth: 130 }}></input>
          <span style={{ marginLeft: 12 }}></span>
        Around <input id='range_input' style={{ width: 32, marginLeft: 2 }}></input> Rows
        <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
        <input id='sidestr_input'></input>
        </div>
        <div>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 35 }}></Image>
          <input id='sidestr2_input'></input>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
          <input id='sidestr3_input'></input>
          <Image src={'/ui/right-svgrepo-com.svg'} alt={'->'} width={18} height={18} style={{ verticalAlign: 'bottom', marginLeft: 8 }}></Image>
          <input id='sidestr4_input'></input>
          <SearchButton setResults={setResults} setProjectDir={setProjectDir}/>
          <div className={styles.loadingSpin} style={{ display: "inline-block", marginLeft: 4, marginTop: 0, verticalAlign: 'bottom' }}></div>
        </div>
        <div>
          {results.map((result, i) => (
            <div key={i}>
              <div>
                {result.filePath.startsWith(projectDir) ? (
                  <>
                    <span style={{ color: 'gray' }}>[Project path]</span>
                    {result.filePath.substring(projectDir.length)}
                  </>
                ) : (
                  result.filePath
                )}
              </div>
              <div>:{result.lineNumber}</div>
              <div>{result.line}</div>
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <div>Advanced Search UI</div>
      </footer>
    </div>
  );
}
