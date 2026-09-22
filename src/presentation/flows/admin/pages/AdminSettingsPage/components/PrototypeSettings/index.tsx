import { BellRing, Database, UserCheck } from "lucide-react";

import { ChamaPrototypeConfig } from "#/domain/chama/config.ts";
import { MockedCourier } from "#/domain/chama/services/seed.ts";
import { CourierInternalContact } from "#/presentation/components/chama/CourierInternalContact/index.tsx";

const SettingItems = [
	{
		icon: BellRing,
		label: "Canal de notificação",
		value: ChamaPrototypeConfig.notificationChannelLabel,
		note: ChamaPrototypeConfig.notificationChannelNote,
	},
	{
		icon: UserCheck,
		label: "Regra de atendimento",
		value: ChamaPrototypeConfig.attendanceRuleLabel,
		note: ChamaPrototypeConfig.attendanceRuleNote,
	},
	{
		icon: Database,
		label: "Persistência",
		value: ChamaPrototypeConfig.persistenceLabel,
		note: ChamaPrototypeConfig.persistenceNote,
	},
] as const;

/**
 * "Configurações relevantes do protótipo" na visão do Admin.
 *
 * São somente leitura de propósito: tornar editável exigiria decidir o que
 * acontece com as solicitações já criadas sob outra regra — discussão de
 * Produto que não cabe no MVP.
 */
function PrototypeSettings() {
	return (
		<section
			aria-labelledby="prototype-settings-title"
			className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
		>
			<div className="flex flex-col gap-1">
				<h2
					id="prototype-settings-title"
					className="font-heading font-semibold text-card-foreground text-lg"
				>
					Configurações do protótipo
				</h2>
				<p className="text-muted-foreground text-sm">
					Parâmetros em vigor nesta sessão. Somente leitura.
				</p>
			</div>

			<dl className="grid gap-4 md:grid-cols-3">
				{SettingItems.map(({ icon: Icon, label, value, note }) => (
					<div key={label} className="flex flex-col gap-1.5">
						<dt className="flex items-center gap-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
							<Icon aria-hidden="true" className="size-3.5" />
							{label}
						</dt>
						<dd className="font-medium text-foreground text-sm">{value}</dd>
						<p className="text-muted-foreground text-xs leading-relaxed">
							{note}
						</p>
					</div>
				))}
			</dl>

			{/* RN02: o entregador associado a toda solicitação vem do serviço mockado. */}
			<div className="flex flex-col gap-2 border-border border-t pt-4">
				<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
					Entregador associado às solicitações
				</p>
				<CourierInternalContact
					courierName={MockedCourier.name}
					courierPhoneInternal={MockedCourier.phoneInternal}
					className="max-w-md"
				/>
			</div>
		</section>
	);
}

export { PrototypeSettings };
