import React, { useState } from 'react';
import css from './App.module.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/theme-dracula';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [code, setCode] = useState(
    currentLanguage == 'python' ? '# Write Code Here' : '// Write Code Here'
  );
  const currentLanguageHandler = (e) => {
    setCurrentLanguage(e.target.value);
  };
  const codeHandler = (newValue) => {
    setCode(newValue);
  };
  const runCode = async () => {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language: currentLanguage }),
    };
    let response = await fetch('http://localhost:3500/api/run-code', config);
    response = await response.text();
  };
  return (
    <div className={css.main}>
      <div className={css.headerOptions}>
        <select
          id={css.selectOptions}
          value={currentLanguage}
          onChange={currentLanguageHandler}>
          <option id={css.option} value='python'>
            Python
          </option>
          <option id={css.option} value='javascript'>
            Javascript
          </option>
        </select>
        <button id={css.runCode} onClick={runCode}>
          Run
        </button>
      </div>
      <AceEditor
        placeholder={code}
        mode={currentLanguage}
        onChange={codeHandler}
        theme='dracula'
        name='codeEditor'
        height='300px'
        width='100%'
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}
      />
    </div>
  );
}
