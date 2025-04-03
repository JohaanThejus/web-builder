import "../../sass/toggle.scss";

function Toggle(props: { theme: boolean; onClick: () => void;}) {
  return (
    <button
      className={`toggle-btn ${props.theme ? "dark active" : ""}`}
      onClick={props.onClick}
    >
      <span className="toggle-circle"></span>
    </button>
  );
}

export default Toggle;
