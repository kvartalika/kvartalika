import {type FC} from "react";
import type {UserDto} from "../../services";

const UserList: FC<{
  items: UserDto[];
  onEdit: (u: UserDto) => void;
  onDelete: (u: UserDto) => void;
}> = ({items, onEdit, onDelete}) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div
        key={item.email}
        className="flex justify-between items-center p-3 border rounded"
      >
        <div>
          <div className="font-medium">{item.email}</div>
          <div className="text-sm text-gray-500">{item.role}</div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
    {items.length === 0 &&
      <div className="text-gray-500 text-center py-4">No records found</div>}
  </div>
);

export default UserList;