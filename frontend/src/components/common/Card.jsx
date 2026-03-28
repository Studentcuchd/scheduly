const Card = ({
  children,
  className = "",
  hover = false,
  noPadding = false,
}) => {
  return (
    <div
      className={`
        glass-panel rounded-lg
        ${!noPadding ? "p-4 md:p-6" : ""}
        ${hover ? "hover:shadow-lg transition-shadow duration-200 cursor-pointer" : ""}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
