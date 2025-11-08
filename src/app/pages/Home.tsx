import photo from "@/app/assets/photo.png";
import Link from "@/app/components/Link";
import styles from "@/app/styles/Home.module.css";
import { github, linkedin, source } from "@/shared/constants";

export default function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <nav>
          <a href={source}>Código fuente</a>
          <a href={github}>Github</a>
          <a href={linkedin}>LinkedIn</a>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.photo}>
          <img src={photo} alt="Foto" />
        </section>
        <section className={styles.title}>
          <h1>Bienvenido A Mi Portafolio Universitario</h1>
        </section>
        <p>Para ver el contenido, haz click en el botón de abajo</p>
        <Link to="/contenido" className={styles.link}>
          Continuar
        </Link>
      </main>
    </div>
  );
}
