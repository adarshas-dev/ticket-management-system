import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";

function ThemeTable({ children, ...props }) {
  const [dark, setDark] = useState(document.body.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Table
      striped
      hover
      responsive
      {...props}
      className={`table ${dark ? "table-dark" : "table-light"} ${props.className || ""}`}
    >
      {children}
    </Table>
  );
}

export default ThemeTable;
