import Link from "../components/Link";

type Props = {
  projects: string[];
};

export async function getServerProps(): Promise<Props> {
  return {
    projects: ["Project1", "Project2", "Project3"],
  };
}

export default function Projects(props: Props) {
  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {props.projects.map((p) => (
          <li key={p}>
            <Link to="/projects/:id" params={{ id: p }}>
              {p}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/">Home</Link>
    </div>
  );
}
