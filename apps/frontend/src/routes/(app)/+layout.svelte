<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let isChecking = true;

	onMount(() => {
		console.log('🛡️ Protected layout checking auth...');

		const unsubscribe = authStore.subscribe(({ isAuthenticated, isLoading }) => {
			console.log('Auth state:', { isAuthenticated, isLoading });

			isChecking = isLoading;

			if (!isLoading && !isAuthenticated) {
				console.log('❌ Not authenticated, redirecting to login');
				goto('/login');
			} else if (!isLoading && isAuthenticated) {
				console.log('✅ Authenticated, showing protected content');
			}
		});

		return unsubscribe;
	});
</script>

{#if isChecking}
	<!-- Loading mientras verificamos autenticación -->
	<div class="flex min-h-screen items-center justify-center bg-gray-100">
		<div class="text-center">
			<div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
			<p class="text-gray-600">Verifying authentication...</p>
		</div>
	</div>
{:else if $authStore.isAuthenticated}
	<!-- Usuario autenticado, mostrar contenido protegido -->
	<slot />
{:else}
	<!-- Fallback (no debería llegar aquí por el redirect) -->
	<div class="flex min-h-screen items-center justify-center bg-gray-100">
		<p class="text-gray-600">Redirecting to login...</p>
	</div>
{/if}
