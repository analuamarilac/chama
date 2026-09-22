import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { chamaMockService } from "#/domain/chama/services/chamaMockService.ts";
import type { CreateContactRequestInput } from "#/domain/chama/types.ts";
import { QueryKeys } from "#/presentation/constants/query-enum.ts";

/**
 * RN03: registra a solicitação no serviço mockado compartilhado.
 *
 * O toast representa a notificação do entregador (P04 — push no app). É disparado
 * no `onSuccess` da mutation, ou seja, como resposta a um evento do usuário —
 * nunca por efeito.
 */
function useCreateContactRequest() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, isError, isSuccess, data, reset } =
		useMutation({
			mutationFn: (input: CreateContactRequestInput) =>
				chamaMockService.createContactRequest(input),
			onSuccess: (createdRequest) => {
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.ContactRequests],
				});

				toast.success("Entregador notificado", {
					description: `Push enviado para ${createdRequest.courierName} sobre o pedido ${createdRequest.orderCode}.`,
				});
			},
			onError: () => {
				toast.error("Não foi possível enviar a solicitação", {
					description: "Tente novamente em alguns instantes.",
				});
			},
		});

	return {
		createContactRequest: mutateAsync,
		createdRequest: data ?? null,
		isPending,
		isError,
		isSuccess,
		reset,
	};
}

export { useCreateContactRequest };
