import styles from "@/app/styles/Content.module.css";
import Card from "../components/Card";

export default function Content() {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h1>Contenido del sitio</h1>
      </div>

      <div className={styles.list}>
        <Card
          title="Sobre el proyecto"
          href="/contenido/sobre-el-proyecto"
          description="Descubre qué es este proyecto"
        />
        <Card
          title="Sobre mí"
          href="/contenido/sobre-mi"
          description="Conóceme"
        />
        <Card
          title="Proyectos"
          href="/contenido/proyectos"
          description="Explora mis proyectos"
        />
      </div>
    </div>
  );
}
