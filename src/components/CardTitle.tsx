interface CardTitleProps {
  title?: string;
  icon?: JSX.Element;
}

const CardTitle = ({ title, icon }: CardTitleProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon}
      <span style={{ color: "rgb(140 140 140)" }}>{title}</span>
    </div>
  );
};

export default CardTitle;
