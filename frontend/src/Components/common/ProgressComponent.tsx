type ProgressItemProps = {
  label: string;
  valueText: string;
  percentage: number;
  over?: boolean;
  warning?: string;
};

function ProgressComponent({
  label,
  valueText,
  percentage,
  over = false,
  warning,
}: ProgressItemProps) {
  return (
    <div className="progress-item">
      <div className="progress-label">
        <span>{label} : </span>
        <span>{valueText}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressComponent;
