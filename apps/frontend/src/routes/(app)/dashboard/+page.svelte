<!-- src/routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';

	async function handleLogout() {
		await authStore.logout();
		// Forzar redirect inmediatamente
		goto('/login');
	}
</script>

<svelte:head>
	<title>Dashboard - Game Template</title>
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

				<div class="flex items-center space-x-4">
					{#if $authStore.user}
						<span class="text-gray-600">Welcome, {$authStore.user.email}</span>
						{#if $authStore.user.isAdmin}
							<span class="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
								>Admin</span
							>
						{/if}
					{/if}

					<button
						on:click={handleLogout}
						class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Welcome Card -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-2 text-lg font-semibold text-gray-900">🎮 Welcome to your Game</h3>
				<p class="text-gray-600">
					Your adventure starts here. This is your dashboard where you can manage everything.
				</p>
			</div>

			<!-- Stats Card -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-2 text-lg font-semibold text-gray-900">📊 Stats</h3>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span class="text-gray-600">Level:</span>
						<span class="font-semibold">1</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Experience:</span>
						<span class="font-semibold">0 / 100</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Gold:</span>
						<span class="font-semibold text-yellow-600">1000</span>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-semibold text-gray-900">⚡ Quick Actions</h3>
				<div class="space-y-3">
					<button
						class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
					>
						Start Game
					</button>
					<button
						class="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
					>
						View Profile
					</button>
					<button
						class="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
					>
						Settings
					</button>
				</div>
			</div>
		</div>
	</main>
</div>
