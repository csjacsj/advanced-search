'use client';
import axios from "axios";

export interface ResultRecord {
  lineNumber: number;
  line: string;
  filePath: string;
}

interface ReturnValue {
  code: number;
  result_record_list: ResultRecord[];
};

export default function SearchButton(props: {
  setResults: (results: ResultRecord[]) => void
  setProjectDir: (projectDir: string) => void
}) {
  const onClickSearch = async () => {
    const projdir = (document.getElementById('projdir_input') as HTMLInputElement).value;
    const findstr = (document.getElementById('findstr_input') as HTMLInputElement).value;
    const range = parseInt((document.getElementById('range_input') as HTMLInputElement).value, 10);
    const sidestr = (document.getElementById('sidestr_input') as HTMLInputElement).value;
    const sidestr2 = (document.getElementById('sidestr2_input') as HTMLInputElement).value;
    const sidestr3 = (document.getElementById('sidestr3_input') as HTMLInputElement).value;
    const sidestr4 = (document.getElementById('sidestr4_input') as HTMLInputElement).value;

    props.setProjectDir(projdir);

    let ret;
    try {
      ret = await axios.post('/search', {
        projdir,
        findstr,
        sidestr,
        range,
        sidestr2,
        sidestr3,
        sidestr4
      });
    } catch (e) {
      console.log(e);
      return;
    }
    if (!ret) {
      return;
    }

    const result: ReturnValue = ret.data;
    console.log(result);
    if (result.code === 0) {
      console.log('result.result_record_list', result.result_record_list);
      props.setResults(result.result_record_list);
    }
  };

  return (
    <button style={{ marginLeft: 8, paddingLeft: 4, paddingRight: 4 }} onClick={onClickSearch}>
      Search
    </button>
  );
}