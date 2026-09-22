import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { chamaMockService } from "#/domain/chama/services/chamaMockService.ts";
import { QueryKeys } from "#/presentation/constants/query-enum.ts";

/**
 * P01: o entregador declara explicitamente que falou com a loja.
 *
 * A invalidação é feita aqui, não nas páginas — é o que faz a visão do Admin
 * refletir a ação do Entregador.
 */
function useMarkContactRequestAsAttended() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, variables } = useMutation({
		mutationFn: (requestId: string) =>
			chamaMockService.markContactRequestAsAttended(requestId),
		onSuccess: (attendedRequest) => {
			queryClient.invalidateQueries({ queryKey: [QueryKeys.ContactRequests] });

			toast.success("Solicitação atendida", {
				description: `O pedido ${attendedRequest.orderCode} foi marcado como atendido.`,
			});
		},
		onError: () => {
			toast.error("Não foi possível concluir o atendimento", {
				description: "Tente novamente em alguns instantes.",
			});
		},
	});

	return {
		markAsAttended: mutateAsync,
		attendingRequestId: isPending ? (variables ?? null) : null,
		isPending,
	};
}

export { useMarkContactRequestAsAttended };
