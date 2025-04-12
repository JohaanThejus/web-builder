import { useRef, useState } from 'react';
import Widget from './Widget';
import '../../sass/workspace.scss';

function Workspace(props: { theme: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });

  return (
    <div
      ref={containerRef}
      className={`workspace ${props.theme ? 'dark' : ''}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Widget
        theme={props.theme}
        title="StatelessWidget"
        name="widget1"
        type="statelesswidget"
        position={position}
        dimensions={dimensions}
        onResize={setDimensions}
        onDrag={setPosition}
        containerRef={containerRef}
      />
    </div>
  );
}

export default Workspace;
