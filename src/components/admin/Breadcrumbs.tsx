import {type FC, Fragment} from "react";

const Breadcrumbs: FC<{
  segments: string[];
  onCrumbClick: (idx: number) => void
}> = ({
        segments,
        onCrumbClick,
      }) => (
  <div className="flex items-center gap-1 text-sm">
    {segments.map((seg, idx) => (
      <Fragment key={`${seg}-${idx}`}>
        <button
          onClick={() => {
            onCrumbClick(idx)
          }}
          className="underline cursor-pointer"
        >
          {seg === '' ? '/' : seg}
        </button>
        {idx < segments.length - 1 && <span>/</span>}
      </Fragment>
    ))}
  </div>
);

export default Breadcrumbs;