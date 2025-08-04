import React, {type FC} from "react";

const Alert: FC<{
  type?: 'error' | 'info';
  children: React.ReactNode
}> = ({type = 'info', children}) => (
  <div
    className={`px-4 py-3 rounded ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-gray-50 border border-gray-200 text-gray-700'
    }`}
  >
    {children}
  </div>
);

export default Alert;