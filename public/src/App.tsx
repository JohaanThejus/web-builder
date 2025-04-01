import Workspace from './components/Workspace';
import Tree from './components/Tree';

function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Tree />
        <Workspace />
      </div>
  );
}

export default App;
