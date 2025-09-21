<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { z } from 'zod';

	let email = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	const loginSchema = z.object({
		email: z.string().email('Please enter a valid email'),
		password: z.string().min(8, 'Password must be at least 8 characters')
	});

	$: emailValid = email === '' || z.string().email().safeParse(email).success;
	$: passwordValid = password === '' || password.length >= 8;
	$: formValid = emailValid && passwordValid && email !== '' && password !== '';

	async function handleSubmit() {
		if (!formValid) return;

		// Validate with Zod
		const validation = loginSchema.safeParse({ email, password });
		if (!validation.success) {
			errorMessage = validation.error.message;
			return;
		}
		isLoading = true;
		errorMessage = '';
		const result = await authStore.login(email, password);
		isLoading = false;

		if (result.success) {
			goto('/dashboard');
		} else {
			errorMessage = result.error || 'Login failed';
		}

		isLoading = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && formValid && !isLoading) {
			handleSubmit();
		}
	}
</script>

<svelte:head>
	<title>Login - Game Template</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
>
	<!-- Background animation -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animate-blob animation-delay-4000 absolute left-40 top-40 h-80 w-80 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	<div
		class="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
	>
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold text-white">Welcome Back</h1>
			<p class="text-blue-100">Sign in to continue your adventure</p>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<!-- Email Field -->
			<div class="space-y-2">
				<label for="email" class="block text-sm font-medium text-white"> Email Address </label>
				<input
					id="email"
					type="email"
					bind:value={email}
					on:keypress={handleKeyPress}
					class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-400"
					class:border-red-400={!emailValid}
					class:ring-2={!emailValid}
					class:ring-red-400={!emailValid}
					placeholder="Enter your email"
					disabled={isLoading}
				/>
				{#if !emailValid && email !== ''}
					<p class="text-sm text-red-300">Please enter a valid email</p>
				{/if}
			</div>

			<!-- Password Field -->
			<div class="space-y-2">
				<label for="password" class="block text-sm font-medium text-white"> Password </label>
				<input
					id="password"
					type="password"
					bind:value={password}
					on:keypress={handleKeyPress}
					class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-400"
					class:border-red-400={!passwordValid}
					class:ring-2={!passwordValid}
					class:ring-red-400={!passwordValid}
					placeholder="Enter your password"
					disabled={isLoading}
				/>
				{#if !passwordValid && password !== ''}
					<p class="text-sm text-red-300">Password must be at least 8 characters</p>
				{/if}
			</div>

			<!-- Error Message -->
			{#if errorMessage}
				<div class="rounded-lg border border-red-400/50 bg-red-500/20 p-3">
					<p class="text-sm text-red-200">{errorMessage}</p>
				</div>
			{/if}

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={!formValid || isLoading}
				class="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
			>
				{#if isLoading}
					<span class="flex items-center justify-center">
						<svg class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Signing in...
					</span>
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<!-- Links -->
		<div class="mt-6 space-y-3 text-center">
			<a href="/signup" class="block font-medium text-blue-200 transition-colors hover:text-white">
				Don't have an account? Sign up
			</a>

			<a
				href="/recover-password"
				class="block text-sm text-blue-300 transition-colors hover:text-blue-100"
			>
				Forgot your password?
			</a>
		</div>
	</div>
</div>

<style>
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}

	.animate-blob {
		animation: blob 7s infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
