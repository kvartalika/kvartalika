import React, {type FC} from "react";

const Panel: FC<React.PropsWithChildren<{ title: string }>> = ({
                                                                 title,
                                                                 children
                                                               }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

export default Panel;