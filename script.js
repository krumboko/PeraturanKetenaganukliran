// URL publik CSV dari Google Sheets Anda
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDUwM2xouQloZl9eAALhKO5Wc14X9FuUKuwuQdFzCsotEE2FYOCTVcPngQRvoB6z830v025D5twlnS/pub?output=csv';

// Fungsi untuk mengambil data dari Google Sheets
async function fetchData() {
    const response = await fetch(sheetUrl);
    const data = await response.text();
    const rows = data.split('\n'); // Pisahkan baris CSV

    // Proses data CSV menjadi objek
    const regulations = rows.slice(1).map(row => {
        const columns = row.split(','); // Pisahkan kolom CSV
        return {
            judul: columns[0], // Judul peraturan
            link: columns[1], // Link ke peraturan
            kategori: columns[2], // Kategori peraturan
        };
    });

    return regulations;
}

// Fungsi untuk menampilkan peraturan
function displayRegulations() {
    fetchData().then((regulations) => {
        const regulationListElement = document.getElementById('peraturan-list');
        regulationListElement.innerHTML = ''; // Clear list

        regulations.forEach((regulation) => {
            const regulationElement = document.createElement('div');
            regulationElement.classList.add('regulation-item');
            regulationElement.innerHTML = `
                <a href="${regulation.link}" target="_blank">${regulation.judul}</a>
                <br><small>Kategori: ${regulation.kategori}</small>
            `;
            regulationListElement.appendChild(regulationElement);
        });
    }).catch((error) => {
        document.getElementById('peraturan-list').innerHTML = 'Error loading data';
        console.error('Error loading Google Sheets data:', error);
    });
}

// Menampilkan peraturan saat halaman dimuat
window.onload = displayRegulations;
