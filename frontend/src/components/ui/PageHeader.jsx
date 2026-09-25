const PageHeader = ({
  title,
  description,
  eyebrow,
  children,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-blue-600">
            {eyebrow}
          </p>
        )}

        <h1
          className={
            eyebrow
              ? "mt-1 text-2xl font-bold text-slate-900 sm:text-3xl"
              : "text-2xl font-bold text-slate-900 sm:text-3xl"
          }
        >
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="w-full lg:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;