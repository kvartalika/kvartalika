import React, {type FC} from "react";

const Panel: FC<React.PropsWithChildren<{ title: string }>> = ({
                                                                 title,
                                                                 children
                                                               }) => (
  <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
    {children}
  </div>
);

export default Panel;