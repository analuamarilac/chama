import { useQuery } from "@tanstack/react-query";

import { chamaMockService } from "#/domain/chama/services/chamaMockService.ts";
import { QueryKeys } from "#/presentation/constants/query-enum.ts";

/**
 * Fonte única das solicitações para os três perfis (RN03).
 *
 * Solicitante, Entregador e Admin consomem esta mesma chave de cache, então
 * qualquer mutation invalida e atualiza as outras visões.
 *
 * Desvio consciente de `.ai/frontend/INTEGRATION.md`, que orienta expor
 * `isLoading || isFetching` como um único sinal: aqui os dois são separados.
 * Toda mutation invalida esta query, e um `isFetching` colapsado em `isLoading`
 * trocaria a lista inteira por esqueletos a cada atendimento — fechando o card
 * que o entregador acabou de abrir. `isLoading` cobre a primeira carga (quando
 * não há o que mostrar) e `isRefreshing` sinaliza a atualização sem destruir a tela.
 */
function useListContactRequests() {
	const { data, isLoading, isFetching, isError, refetch } = useQuery({
		queryKey: [QueryKeys.ContactRequests],
		queryFn: () => chamaMockService.listContactRequests(),
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		contactRequests: data ?? [],
		isLoading,
		isRefreshing: isFetching && !isLoading,
		isError,
		refetch,
	};
}

export { useListContactRequests };
