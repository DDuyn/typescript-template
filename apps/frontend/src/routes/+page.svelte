<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		const unsubscribe = authStore.subscribe(({ isAuthenticated, isLoading }) => {
			if (!isLoading) {
				if (isAuthenticated) {
					goto('/dashboard');
				} else {
					goto('/login');
				}
			}
		});

		return unsubscribe;
	});
</script>

<!-- Loading mientras verificamos auth -->
<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600"
>
	<div class="text-center text-white">
		<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
		<p>Loading...</p>
	</div>
</div>
