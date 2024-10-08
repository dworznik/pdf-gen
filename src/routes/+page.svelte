<script>
	import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
	import { onMount } from 'svelte';

	let name = '';
	let address = '';
	let pdfUrl = null;
	let isLoading = false;
	let errorMessage = '';

	const pdfTemplateUrl = '/lorem_ipsum_letter.pdf';

	async function generatePDF() {
		try {
			isLoading = true;
			errorMessage = '';

			const existingPdfBytes = await fetch(pdfTemplateUrl).then((res) => {
				if (!res.ok) {
					throw new Error('Failed to fetch PDF template');
				}
				return res.arrayBuffer();
			});

			const pdfDoc = await PDFDocument.load(existingPdfBytes);
			const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

			const pages = pdfDoc.getPages();
			const firstPage = pages[0];

			const textSize = 12;
			const textColor = rgb(0, 0, 0);
			const { width, height } = firstPage.getSize();

			firstPage.drawText(name, {
				x: 40,
				y: height - 40,
				size: textSize,
				font,
				color: textColor
			});

			firstPage.drawText(address, {
				x: 40,
				y: height - 70,
				size: textSize,
				font,
				color: textColor
			});

			const pdfBytes = await pdfDoc.save();

			const blob = new Blob([pdfBytes], { type: 'application/pdf' });
			pdfUrl = URL.createObjectURL(blob);

			isLoading = false;
		} catch (error) {
			isLoading = false;
			errorMessage = error.message || 'An error occurred during PDF generation.';
			console.error(error);
		}
	}

	function downloadPDF() {
		const link = document.createElement('a');
		link.href = pdfUrl;
		link.download = 'document.pdf';
		link.click();
	}
</script>

<div class="form-container">
	<form on:submit|preventDefault={generatePDF}>
		<label>
			Name:
			<input type="text" bind:value={name} required />
		</label>
		<label>
			Address:
			<textarea bind:value={address} required></textarea>
		</label>
		<button type="submit" disabled={isLoading}>Generate PDF</button>
	</form>

	{#if isLoading}
		<p class="loading">Generating PDF, please wait...</p>
	{/if}

	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	{#if pdfUrl}
		<button on:click={downloadPDF}>Download PDF</button>
	{/if}
</div>

<style>
	.form-container {
		max-width: 400px;
		margin: 20px auto;
	}

	label {
		display: block;
		margin-bottom: 10px;
	}

	input,
	textarea {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
		margin-bottom: 15px;
	}

	button {
		padding: 10px 15px;
		font-size: 16px;
		cursor: pointer;
	}

	.error {
		color: red;
	}

	.loading {
		font-style: italic;
	}
</style>
