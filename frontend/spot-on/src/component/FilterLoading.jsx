/** @format */

import { use } from "react";
import { useAuth } from "./AuthContext";
const FilterLoading = () => {
  const { loading } = useAuth();
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="space-x-z">
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="flex items-center gap-z animate-pulse">
              <div className="w-4 h-4 bg-gray-300 rounded-full" />
              <div className="w-12 h-3 bg-gray-300 rounded" />
            </div>
          ))}
      </div>
    </div>
  );
};
export default FilterLoading;
