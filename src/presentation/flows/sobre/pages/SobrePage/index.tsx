import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, PhoneOff, ShieldCheck } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { SiteFooter } from "#/presentation/components/chama/SiteFooter/index.tsx";
import { SiteHeader } from "#/presentation/components/chama/SiteHeader/index.tsx";
import { Brand } from "#/presentation/constants/brand.ts";
import { Routes } from "#/presentation/constants/routes.ts";

import { AboutSection } from "./components/AboutSection/index.tsx";
import { DecisionCard } from "./components/DecisionCard/index.tsx";

const Problems = [
	{
		title: "Expõe um dado pessoal",
		description:
			"O celular particular do entregador circula entre lojas parceiras, sem controle de quem guarda ou repassa o número.",
	},
	{
		title: "Tira a operação do circuito",
		description:
			"A conversa acontece entre duas pessoas e ninguém mais sabe que ela existiu — nem que ficou sem resposta.",
	},
	{
		title: "Não deixa rastro",
		description:
			"Sem registro, não há status, histórico nem qualquer métrica de quanto tempo a loja espera por um retorno.",
	},
] as const;

const Steps = [
	{
		title: "A loja pede contato",
		description:
			"Informa o código do pedido, o próprio telefone e o motivo. Recebe um protocolo na hora.",
	},
	{
		title: "O entregador é notificado",
		description:
			"A solicitação chega no app com o telefone da loja e a mensagem. Abrir o card registra a visualização.",
	},
	{
		title: "A operação acompanha",
		description:
			"O Admin vê tudo: status, horário de criação, de visualização e de atendimento.",
	},
] as const;

const Decisions = [
	{
		code: "P01",
		question: "O que define uma solicitação como atendida?",
		decision: "A declaração explícita do entregador.",
		rationale:
			"Um toque em “Falei com a loja” encerra a solicitação. Visualizar não conclui — e essa separação é o que torna a pendência acionável: “viu há 8 minutos e não atendeu” é um sinal para a operação agir.",
	},
	{
		code: "P02",
		question: "Quais filtros ajudam o Admin?",
		decision: "Status, busca por código e ordenação — todos na URL.",
		rationale:
			"A operação trabalha por exceção: ou abre direto em pendentes, ou procura um caso específico. Manter os filtros na URL torna a lista compartilhável por link, que é como um coordenador repassa um problema para o turno seguinte.",
	},
	{
		code: "P03",
		question: "Qual deve ser o estado vazio do entregador?",
		decision: "Dois estados diferentes, não um genérico.",
		rationale:
			"“Nunca chegou nada” precisa prometer que a tela vai avisar. “Você atendeu tudo” precisa confirmar trabalho concluído. Um vazio ambíguo faria o entregador duvidar do app — e duvidar do app é o que o traz de volta para o telefone pessoal.",
	},
	{
		code: "P04",
		question: "Qual canal de notificação representar?",
		decision: "Push no app do entregador.",
		rationale:
			"WhatsApp foi descartado justamente por exigir um telefone do entregador: ou recriaria a exposição que o produto resolve, ou obrigaria a WeFind a manter uma linha por entregador. Push custa zero por mensagem e é rastreável.",
	},
] as const;

const OutOfScope = [
	"Autenticação real",
	"Banco de dados",
	"Persistência entre sessões",
	"Envio real de push, SMS ou WhatsApp",
	"Confirmação automática de atendimento",
	"Avaliação, mapa ou rastreamento",
] as const;

function SobrePage() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteHeader hideAboutLink />

			<main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
				<div className="flex flex-col gap-4">
					<h1 className="font-heading font-bold text-3xl text-foreground leading-[1.15] tracking-tight sm:text-4xl">
						Sobre o Chama
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Um case de produto para a WeFind: como uma loja parceira fala com o
						entregador de um pedido sem que o telefone pessoal dele circule.
					</p>
				</div>

				<div className="mt-12 flex flex-col gap-12">
					<AboutSection
						id="problema"
						eyebrow="O problema"
						title="Hoje alguém liga para o celular pessoal"
					>
						<div className="flex flex-col gap-3">
							{Problems.map((problem) => (
								<div
									key={problem.title}
									className="flex gap-3 rounded-xl border border-border bg-card p-4"
								>
									<PhoneOff
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-brand-coral-text"
									/>
									<div className="flex flex-col gap-1">
										<p className="font-medium text-card-foreground">
											{problem.title}
										</p>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{problem.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</AboutSection>

					<AboutSection
						id="solucao"
						eyebrow="A solução"
						title="Uma solicitação registrada no lugar da ligação"
					>
						<ol className="flex flex-col gap-3">
							{Steps.map((step, index) => (
								<li
									key={step.title}
									className="flex gap-4 rounded-xl border border-border bg-card p-4"
								>
									<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-coral font-heading font-bold text-brand-navy text-sm">
										{index + 1}
									</span>
									<div className="flex flex-col gap-1">
										<p className="font-medium text-card-foreground">
											{step.title}
										</p>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{step.description}
										</p>
									</div>
								</li>
							))}
						</ol>
					</AboutSection>

					<AboutSection
						id="decisoes"
						eyebrow="Decisões de produto"
						title="As quatro escolhas que definiram o MVP"
					>
						<div className="grid gap-3 sm:grid-cols-2">
							{Decisions.map((decision) => (
								<DecisionCard key={decision.code} {...decision} />
							))}
						</div>
					</AboutSection>

					<AboutSection
						id="privacidade"
						eyebrow="A regra que mais pesou no código"
						title="Dois telefones que nunca podem se confundir"
					>
						<div className="flex gap-3 rounded-xl border border-border bg-card p-5">
							<ShieldCheck
								aria-hidden="true"
								className="mt-0.5 size-5 shrink-0 text-status-attended"
							/>
							<div className="flex flex-col gap-3 text-muted-foreground text-sm leading-relaxed">
								<p>
									O telefone da loja e a linha interna do entregador são dados
									diferentes, com públicos diferentes. O entregador vê o da
									loja. A linha interna só aparece para a operação.
								</p>
								<p>
									Isso não é só uma regra escrita: são dois componentes
									separados no código, com rótulo, ícone e tratamento visuais
									próprios. Não existe um campo genérico de telefone que alguém
									possa reaproveitar por engano.
								</p>
							</div>
						</div>
					</AboutSection>

					<AboutSection
						id="acessibilidade"
						eyebrow="Identidade e acessibilidade"
						title="Cada cor foi medida, não estimada"
					>
						<div className="flex flex-col gap-3 text-muted-foreground leading-relaxed">
							<p>
								A paleta vem da identidade do produto: azul profundo, coral,
								creme e um verde reservado ao atendimento. Todo par usado em
								texto foi calculado contra o seu fundo.
							</p>
							<p className="rounded-xl border border-border bg-card p-4 text-sm">
								O botão principal é coral com texto{" "}
								<strong className="text-foreground">azul profundo</strong>, e
								não branco. Coral com branco dá 3,10:1 e reprova no WCAG AA; com
								azul profundo dá 5,05:1 — além de ser a combinação que já existe
								no próprio logo.
							</p>
							<p>
								Status nunca dependem só de cor: combinam sempre cor, ícone e
								rótulo, para continuarem legíveis em daltonismo ou impressão em
								preto e branco.
							</p>
						</div>
					</AboutSection>

					<AboutSection
						id="escopo"
						eyebrow="Limites"
						title="O que ficou deliberadamente de fora"
					>
						<div className="flex flex-col gap-4">
							<p className="text-muted-foreground leading-relaxed">
								Este é um protótipo funcional com dados em memória: as três
								visões compartilham o mesmo serviço mockado, mas nada persiste
								entre sessões. Recarregar a página restaura os dados iniciais.
							</p>

							<ul className="flex flex-wrap gap-2">
								{OutOfScope.map((item) => (
									<li
										key={item}
										className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground text-xs"
									>
										{item}
									</li>
								))}
							</ul>

							<p className="text-muted-foreground text-sm leading-relaxed">
								O raciocínio completo — regras de negócio, hipóteses, decisões
								técnicas e as pendências que seriam levadas para Produto,
								Operações e Engenharia — está registrado no arquivo{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
									regras.md
								</code>{" "}
								do repositório.
							</p>
						</div>
					</AboutSection>

					<AboutSection
						id="autoria"
						eyebrow="Autoria"
						title={`Feito por ${Brand.authorName}`}
					>
						<div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-5">
							<p className="text-muted-foreground leading-relaxed">
								Estratégia de produto, UX, identidade visual, interface e
								prototipação funcional deste case.
							</p>

							<Button asChild className="gap-2">
								<a
									href={Brand.authorPortfolioUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									Ver portfólio
									<ArrowUpRight aria-hidden="true" className="size-4" />
									<span className="sr-only">(abre em nova aba)</span>
								</a>
							</Button>
						</div>
					</AboutSection>
				</div>

				<div className="mt-12 border-border border-t pt-6">
					<Button variant="outline" asChild className="gap-2">
						<Link to={Routes.Home}>
							<ArrowLeft aria-hidden="true" className="size-4" />
							Voltar e testar o protótipo
						</Link>
					</Button>
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}

export default SobrePage;
