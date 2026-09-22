import { FileText } from "lucide-react";

import { PrototypeSettings } from "./components/PrototypeSettings/index.tsx";

/**
 * Seção Configurações do painel.
 *
 * "Acessar configurações relevantes do protótipo" é requisito do Admin. Aqui
 * elas ganham uma página própria em vez de disputar espaço com a tabela.
 */
function AdminSettingsPage() {
	return (
		<div className="flex max-w-3xl flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
					Configurações
				</h1>
				<p className="text-muted-foreground text-sm">
					Parâmetros em vigor nesta sessão do protótipo.
				</p>
			</div>

			<PrototypeSettings />

			<div className="flex gap-3 rounded-xl border border-border border-dashed bg-card/50 p-4">
				<FileText
					aria-hidden="true"
					className="mt-0.5 size-4 shrink-0 text-muted-foreground"
				/>
				<p className="text-muted-foreground text-sm leading-relaxed">
					As decisões por trás de cada parâmetro — e as pendências que seriam
					levadas para Produto, Operações e Engenharia — estão registradas no
					arquivo{" "}
					<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
						regras.md
					</code>{" "}
					do repositório.
				</p>
			</div>
		</div>
	);
}

export default AdminSettingsPage;
