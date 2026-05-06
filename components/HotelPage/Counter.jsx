export default function Counter({ label, value, setValue, min = 0 }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500">
          {label === "Adults" && "Ages 13+"}
          {label === "Children" && "Ages 2–12"}
          {label === "Infants" && "Under 2"}
        </p>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
      </div>
      
      <div className="flex items-center gap-3">
        
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border flex items-center justify-center 
          hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          −
        </button>
   
        <span className="w-5 text-center">{value}</span>

        <button
          onClick={() => setValue(value + 1)}
          className="w-8 h-8 rounded-full border flex items-center justify-center 
          hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          +
        </button>
        
      </div>
      
    </div>
  );
}