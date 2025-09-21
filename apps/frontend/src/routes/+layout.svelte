<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import '../app.css';

	// Verificar auth al cargar la app
	onMount(() => {
		authStore.checkAuth();
	});
</script>

<main>
	<slot />
</main>
