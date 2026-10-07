import "./ProgressComponent.css";

type ProgressItemProps = {
  label: string;
  valueText: string;
  percentage: number;
  over?: boolean;
  warning?: string;
  hideBar?: boolean;
};

function ProgressComponent({
  label,
  valueText,
  percentage,
  over = false,
  warning,
  hideBar = false,
}: ProgressItemProps) {
  const clamped = Number.isFinite(percentage)
    ? Math.min(100, Math.max(0, percentage))
    : 0;

  return (
    <div
      className={`progress-item${over ? " progress-item--over" : ""}${hideBar ? " progress-item--stacked" : ""}`}
    >
      <div className="progress-label">
        <span className="progress-name">{label}</span>
        <span className="progress-value">{valueText}</span>
      </div>
      {!hideBar ? (
        <div
          className="progress-bar"
          role="progressbar"
          aria-label={label}
          aria-valuenow={Math.round(clamped)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${clamped}%` }} />
        </div>
      ) : (
        <></>
      )}
      {over && warning ? (
        <span className="progress-warning">{warning}</span>
      ) : null}
    </div>
  );
}

export default ProgressComponent;
