import React, { useState } from 'react';
import css from './App.module.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/theme-dracula';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const currentLanguageHandler = (e) => {
    setCurrentLanguage(e.target.value);
  };
  const runCode = () => {};
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
        placeholder={
          currentLanguage == 'python'
            ? '# Write Code Here'
            : '// Write Code Here'
        }
        mode={currentLanguage}
        theme='dracula'
        name='codeEditor'
        height='300px'
        width='100%'
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={
          currentLanguage == 'python'
            ? `def Solution:`
            : `function Solution(){}`
        }
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
