// URL Google Sheets yang di-publikasikan sebagai CSV
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDUwM2xouQloZl9eAALhKO5Wc14X9FuUKuwuQdFzCsotEE2FYOCTVcPngQRvoB6z830v025D5twlnS/pub?output=csv';
//const googleSheetURL = 'https://drive.google.com/file/d/1EU9xeogE6mjTkYFNhiOzECw3mTQ_-yfx/view?usp=sharing'
let allRegulations = [];

// Fungsi untuk memuat peraturan dari Google Sheets
function fetchRegulations() {
    fetch(googleSheetURL)
        .then(response => response.text())
        .then(data => {
            allRegulations = parseCSV(data);
            buildUI(allRegulations);
        });
}
/*
// Fungsi untuk memuat peraturan dari Google Sheets
function fetchRegulations() {
    fetch(googleSheetURL)
        .then(response => response.text())
        .then(data => {
            const regulations = parseCSV(data);
            buildUI(regulations);
        });
}
*/
// Fungsi untuk memparsing data CSV
function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Mengabaikan header
    return rows.map(row => {
        const cols = row.split(',');
        return {
            title: cols[0].trim(),
            url: cols[1].trim(),
            type: cols[2].trim(),
            year: cols[3].trim(),
            theme: cols[4].trim()
        };
    });
}

// Fungsi untuk membuat UI secara dinamis
function buildUI(regulations) {
    
    // Tambahkan section lain sesuai kebutuhan
    
    const regulationListDiv = document.getElementById('regulation-list');
    regulationListDiv.innerHTML = ''; // Bersihkan konten sebelumnya
    // Buat section untuk UU
    const uuSection = createSection('I. Undang-Undang', regulations.filter(reg => reg.type === 'UU'));
    regulationListDiv.appendChild(uuSection);

    // Buat section untuk PP
    const ppSection = createSection('II. Peraturan Pemerintah', regulations.filter(reg => reg.type === 'PP'));
    regulationListDiv.appendChild(ppSection);
    
    // Buat section untuk Perpres
    const perpresSection = createSection('III. Peraturan Presiden', regulations.filter(reg => reg.type === 'PERPRES'|| reg.type === 'KEPPRES'));
    regulationListDiv.appendChild(perpresSection);

    // Buat section untuk Perba
    //const perbaSection = createSection('IV. Peraturan Bapeten', regulations.filter(reg => reg.type === 'Perba'));
    //regulationListDiv.appendChild(perbaSection);

    // Buat section untuk Perba dengan sub-section per tahun
    const perbaSection = createSectionByYear('IV. Peraturan Bapeten', regulations.filter(reg => reg.type === 'Perba'));
    regulationListDiv.appendChild(perbaSection);

}

// Fungsi untuk membuat section dengan daftar peraturan
function createSection(title, regulations) {
    const section = document.createElement('div');

    // Buat judul section
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    // Buat daftar peraturan
    const list = document.createElement('ol');
    regulations.forEach(reg => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = reg.url;
        link.target = '_blank';
        link.textContent = reg.title;
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
    section.appendChild(list);

    return section;
}

// Fungsi untuk membuat section dengan daftar peraturan berdasarkan tahun
function createSectionByYear(title, regulations) {
    const section = document.createElement('div');

    // Buat judul section
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    // Kelompokkan peraturan berdasarkan tahun
    const regulationsByYear = regulations.reduce((acc, reg) => {
        const year = reg.year; // Asumsikan `year` ada di data peraturan
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(reg);
        return acc;
    }, {});

    // Urutkan tahun dari terbaru ke terdahulu
    const sortedYears = Object.keys(regulationsByYear).sort((a, b) => b - a);

    // Buat sub-section untuk setiap tahun
   sortedYears.forEach(year=> {
        const yearTitle = document.createElement('h3');
        yearTitle.textContent = `Tahun ${year}`;
        section.appendChild(yearTitle);

        const list = document.createElement('ol');
        regulationsByYear[year].forEach(reg => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = reg.url;
            link.target = '_blank';
            link.textContent = reg.title;
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        section.appendChild(list);
    })

    return section;
}

// Fungsi filter berdasarkan jenis peraturan
function filterByType(type) {
    // Fungsi ini bisa memfilter daftar peraturan berdasarkan tipe dan menampilkan ulang UI
    const filteredRegulations = allRegulations.filter(reg => reg.type === type);
    buildUI(filteredRegulations);
}

// Fungsi filter berdasarkan tema peraturan
function filterByTheme(theme) {
    // Fungsi ini bisa memfilter daftar peraturan berdasarkan tema dan menampilkan ulang UI
    const filteredRegulations = allRegulations.filter(reg => reg.theme === theme);
    buildUI(filteredRegulations);
}

// Panggil fungsi fetchRegulations saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchRegulations);
