import './index.css';

function Tooltip() {
  return (
    <div
      className="change-log-tooltip change-log-tooltip_hide"
      id="esa-change-log-sentinel-tooltip"
    >
      <p className="change-log-tooltip-text">ChangeLogが入力されれば保存可能になります</p>
      <span className="change-log-tooltip-arrow"></span>
    </div>
  );
}

export default Tooltip;
