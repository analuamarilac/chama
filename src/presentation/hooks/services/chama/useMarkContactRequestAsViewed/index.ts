import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chamaMockService } from "#/domain/chama/services/chamaMockService.ts";
import { QueryKeys } from "#/presentation/constants/query-enum.ts";

/**
 * P01: registra a abertura da solicitação pelo entregador.
 *
 * Silencioso de propósito — visualizar não é atender, e um toast aqui competiria
 * com a leitura da mensagem. O Admin é quem consome esse dado.
 */
function useMarkContactRequestAsViewed() {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (requestId: string) =>
			chamaMockService.markContactRequestAsViewed(requestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QueryKeys.ContactRequests] });
		},
	});

	return { markAsViewed: mutate };
}

export { useMarkContactRequestAsViewed };
