<script>
    import { onMount } from 'svelte';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log(API_BASE_URL);

    let name = '';
    let address = '';
    let isLoading = false;
    let errorMessage = '';
  
    async function generatePDF() {
      isLoading = true;
      errorMessage = '';
  
      const data = { name, address };
  
      try {
        const response = await fetch(`${API_BASE_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        // Create a link to download the PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      } catch (error) {
        errorMessage = error.message || 'An error occurred during PDF generation.';
        console.error(error);
      } finally {
        isLoading = false;
      }
    }
  </script>
  
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
  </div>
