export default function Counter({
  label,
  value,
  setValue,
  min = 0,
}) {
  const subtitle =
    label === "Adults"
      ? "Ages 13+"
      : label === "Children"
      ? "Ages 2–12"
      : "Under 2";

  const canDecrease = value > min;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {label}
          </h4>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!canDecrease}
            onClick={() => setValue(Math.max(min, value - 1))}
            className={`
              w-10 h-10 rounded-full border
              flex items-center justify-center
              text-lg font-medium
              transition-all
              ${
                canDecrease
                  ? "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
              }
            `}
          >
            −
          </button>

          <span className="w-8 text-center text-base font-semibold text-gray-900 dark:text-white">
            {value}
          </span>

          <button
            type="button"
            onClick={() => setValue(value + 1)}
            className="
              w-10 h-10 rounded-full border
              border-gray-300 dark:border-gray-600
              flex items-center justify-center
              text-lg font-medium
              text-gray-800 dark:text-white
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-all
            "
          >
            +
          </button>
        </div>
      </div>

      <hr className="mt-4 border-gray-200 dark:border-gray-700" />
    </div>
  );
}