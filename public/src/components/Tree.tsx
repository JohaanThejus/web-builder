import '../../sass/tree.scss';

function Tree(props: {theme: boolean}) {
  return (
    <div className={`tree ${props.theme ? 'dark' : ''}`}>
        <div className='search'>
            <input type="text" />
        </div>
    </div>
  );
}

export default Tree;