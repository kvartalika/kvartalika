import React, {type FC} from "react";

const Breadcrumbs: FC<{
  segments: string[];
  onCrumbClick: (index: number) => void
}> = ({
        segments,
        onCrumbClick,
      }) => (
  <div className="flex items-center gap-1 text-sm">
    {segments.map((seg, idx) => (
      <React.Fragment key={idx}>
        <button
          onClick={() => onCrumbClick(idx)}
          className="underline"
        >
          {seg === 'root' ? '/' : seg}
        </button>
        {idx < segments.length - 1 && <span>/</span>}
      </React.Fragment>
    ))}
  </div>
);

export default Breadcrumbs;