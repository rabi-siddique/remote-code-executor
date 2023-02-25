import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-dracula';
import css from './App.module.css';

const languageComments = {
  python: '# Write Code Here',
  golang: '// Write Code Here',
};

const CodeEditor = () => {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [code, setCode] = useState(languageComments[currentLanguage]);
  const [terminalOutput, setTerminalOutput] = useState('');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
      setCode(languageComments[currentLanguage]);
    }
  }, []);

  useEffect(() => {
    setCode(languageComments[currentLanguage]);
  }, [currentLanguage]);

  const currentLanguageHandler = (e) => {
    setCurrentLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
    setCode(languageComments[currentLanguage]);
  };

  const codeHandler = (newValue) => {
    setCode(newValue);
  };

  const runCode = async () => {
    setTerminalOutput('Executing...');
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language: currentLanguage }),
    };

    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/run-code`,
      config
    );
    response = await response.text();
    response = JSON.parse(response);
    if (response.output) {
      setTerminalOutput(response.output);
    } else {
      setTerminalOutput(response.error);
    }
  };

  const editorMode = currentLanguage;

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
          <option id={css.option} value='golang'>
            Go
          </option>
        </select>
        <button id={css.runCode} onClick={runCode}>
          Run
        </button>
      </div>
      <AceEditor
        placeholder={code}
        mode={editorMode}
        onChange={codeHandler}
        theme='dracula'
        name='codeEditor'
        height='70%'
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
      <div className={css.terminalContainer}>
        <pre>{terminalOutput}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
