import { AppPath } from "../routes";
import styles from "@/app/styles/Card.module.css";
import Link from "./Link";

type Props = {
  title: string;
  description?: string;
  href: AppPath;
};

export default function Card({ title, description, href }: Props) {
  return (
    <div className={styles.card}>
      <Link to={href}>
        <h2>{title}</h2>
      </Link>
      {description && <p>{description}</p>}
    </div>
  );
}
