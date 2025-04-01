import React from 'react';
import Workspace from './components/Workspace';
import Tree from './components/Tree';

function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <div style={{width: '30vw', height: '100vh', backgroundColor: '#ebebeb', padding: '20px' }}>
        <Tree />
      </div>
      <div style={{ width: '70vw', height: '100vh' }}>
        <Workspace />
      </div>
    </div>
  );
}

export default App;
