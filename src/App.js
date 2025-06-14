import React from 'react';
import Form from './components/Form';
// import FormReduce from './components/reducers/FormReduce';
import { ShortcutProvider } from "./components/context/ShortcutContext";


import "./App.css"


function App() {
  return (
    <div className="App">
      <ShortcutProvider>
      <Form />
      </ShortcutProvider>
      {/* <FormReduce/> */}
    </div>
  );
}

export default App;
