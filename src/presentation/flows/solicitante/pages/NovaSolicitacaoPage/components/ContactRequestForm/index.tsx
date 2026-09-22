import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "#/components/ui/button.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "#/components/ui/form.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { cn } from "#/lib/utils.ts";
import { FieldError } from "#/presentation/components/chama/FieldError/index.tsx";
import { formatPhone } from "#/presentation/utils/phone.ts";

import {
	type ContactRequestSchema,
	contactRequestSchema,
	MESSAGE_MAX_LENGTH,
} from "../../schema.ts";
import type { ContactRequestFormProps } from "./types.ts";

const EmptyForm: ContactRequestSchema = {
	orderCode: "",
	requesterPhone: "",
	message: "",
};

const MESSAGE_WARNING_THRESHOLD = 0.9;

function ContactRequestForm({
	isPending,
	isSent,
	onSubmit,
}: ContactRequestFormProps) {
	const form = useForm<ContactRequestSchema>({
		resolver: zodResolver(contactRequestSchema),
		defaultValues: EmptyForm,
		mode: "onSubmit",
		reValidateMode: "onChange",
	});

	// Estado derivado calculado no render — sem efeito espelhando o valor do campo.
	const messageLength = form.watch("message").length;
	const isMessageNearLimit =
		messageLength >= MESSAGE_MAX_LENGTH * MESSAGE_WARNING_THRESHOLD;

	const isLocked = isPending || isSent;

	async function handleSubmit(values: ContactRequestSchema) {
		try {
			await onSubmit(values);
		} catch {
			// O erro já é comunicado pelo hook (toast). Preservamos o preenchimento
			// para que a pessoa possa tentar de novo sem digitar tudo outra vez.
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col gap-5"
				noValidate
			>
				<FormField
					control={form.control}
					name="orderCode"
					render={({ field, fieldState }) => (
						<FormItem className="gap-2">
							<FormLabel>Código do pedido</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="WF-48291"
									autoComplete="off"
									autoCapitalize="characters"
									disabled={isLocked}
									className="h-11"
								/>
							</FormControl>
							<FieldError hasError={Boolean(fieldState.error)} />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="requesterPhone"
					render={({ field, fieldState }) => (
						<FormItem className="gap-2">
							<FormLabel>Seu telefone</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={(event) =>
										field.onChange(formatPhone(event.target.value))
									}
									inputMode="tel"
									placeholder="(11) 99842-1170"
									autoComplete="tel-national"
									disabled={isLocked}
									className="h-11"
								/>
							</FormControl>
							<FieldError hasError={Boolean(fieldState.error)} />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="message"
					render={({ field, fieldState }) => (
						<FormItem className="gap-2">
							<FormLabel>Mensagem</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={4}
									maxLength={MESSAGE_MAX_LENGTH}
									placeholder="Preciso confirmar o horário da entrega."
									disabled={isLocked}
									className="min-h-24 resize-none"
								/>
							</FormControl>

							<div className="flex items-start justify-between gap-3">
								<FieldError hasError={Boolean(fieldState.error)} />
								<span
									aria-hidden="true"
									className={cn(
										"ml-auto shrink-0 text-muted-foreground text-xs tabular-nums",
										isMessageNearLimit && "text-status-pending",
									)}
								>
									{messageLength}/{MESSAGE_MAX_LENGTH}
								</span>
							</div>
						</FormItem>
					)}
				/>

				{/* Reafirma a promessa central do produto no momento da ação. */}
				<p className="flex items-center gap-2 text-muted-foreground text-xs">
					<Lock aria-hidden="true" className="size-3.5 shrink-0" />O telefone do
					entregador permanece protegido.
				</p>

				<Button type="submit" disabled={isLocked} className="h-11 w-full gap-2">
					{isPending ? (
						<Loader2 aria-hidden="true" className="size-4 animate-spin" />
					) : null}
					{isSent && !isPending ? (
						<Check aria-hidden="true" className="size-4" />
					) : null}
					{isPending ? "Enviando..." : null}
					{isSent && !isPending ? "Solicitação enviada" : null}
					{!isPending && !isSent ? "Solicitar contato" : null}
				</Button>
			</form>
		</Form>
	);
}

export { ContactRequestForm };
