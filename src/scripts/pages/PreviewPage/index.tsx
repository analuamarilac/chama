import { Link } from "@tanstack/react-router";
import { Card, CardDescription, CardTitle } from "#/components/ui/card";
import { PreviewRoutes } from "./routes";
import { previewPage } from "./styles";

function PreviewPage() {
	const styles = previewPage();

	return (
		<div className={styles.root()}>
			<header className={styles.header()}>
				<h1 className={styles.title()}>Previews</h1>
				<p className={styles.subtitle()}>
					Escolha um fluxo abaixo para navegar até ele.
				</p>
			</header>

			<div className={styles.grid()}>
				{PreviewRoutes.map(({ path, title, description, image }) => (
					<Link key={path} to={path} className="block">
						<Card className={styles.card()}>
							<div className={styles.thumbnailWrapper()}>
								<img
									src={image}
									alt={`Preview da tela ${title}`}
									className={styles.thumbnail()}
									loading="lazy"
								/>
							</div>
							<div className={styles.body()}>
								<CardTitle>{title}</CardTitle>
								<CardDescription>{description}</CardDescription>
							</div>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

export default PreviewPage;
