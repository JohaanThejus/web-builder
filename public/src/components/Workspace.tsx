import '../../sass/workspace.scss'

function Workspace(props: {theme: boolean}) {
  return (
    <div className={`workspace ${props.theme ? 'dark' : ''}`}>

    </div>
  );
}

export default Workspace;