document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. LOGIKA THEME TOGGLE (DARK/LIGHT MODE)
    // ==========================================
    const themeBtn = document.getElementById("theme-btn");
    const themeIcon = themeBtn.querySelector("i");
    const body = document.body;

    const currentTheme = localStorage.getItem("theme");
    
    if (currentTheme === "light") {
        body.classList.add("light-mode");
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }

    themeBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        if (body.classList.contains("light-mode")) {
            themeIcon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        } else {
            themeIcon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        }
    });

    // ==========================================
    // 2. LOGIKA SEARCH ENGINE (JSON FETCH)
    // ==========================================
    const searchBtn = document.getElementById("search-btn");
    const searchModal = document.getElementById("search-modal");
    const closeSearchBtn = document.getElementById("close-search");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    searchBtn.addEventListener("click", () => {
        searchModal.classList.add("show");
        searchInput.focus(); 
    });

    const closeModal = () => {
        searchModal.classList.remove("show");
        searchInput.value = "";
        searchResults.innerHTML = "";
    };

    closeSearchBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === searchModal) {
            closeModal();
        }
    });

    // Deteksi tombol Enter pada kolom pencarian
    searchInput.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            const query = searchInput.value.toLowerCase().trim();
            
            searchResults.innerHTML = "<p style='color: #9ca3af; padding: 1rem;'>Searching...</p>";

            if (query === "") {
                searchResults.innerHTML = "";
                return;
            }

            try {
                // Mengambil data eksternal dari database JSON statis
                const response = await fetch('search.json');
                const siteData = await response.json();

                const results = siteData.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.snippet.toLowerCase().includes(query)
                );

                searchResults.innerHTML = ""; 

                if (results.length > 0) {
                    results.forEach(result => {
                        const link = document.createElement("a");
                        link.href = result.url;
                        link.className = "search-result-item";
                        link.innerHTML = `
                            <div class="search-result-title">${result.title}</div>
                            <div class="search-result-snippet">${result.snippet}</div>
                        `;
                        link.addEventListener("click", () => {
                            searchModal.classList.remove("show");
                        });
                        searchResults.appendChild(link);
                    });
                } else {
                    searchResults.innerHTML = `<p style="color: #9ca3af; padding: 1rem;">No results found for "<strong>${query}</strong>".</p>`;
                }
            } catch (error) {
                searchResults.innerHTML = `<p style="color: #ef4444; padding: 1rem;">Error loading search data.</p>`;
                console.error("Search error:", error);
            }
        }
    });
});

// Fungsi untuk buka-tutup (toggle) Abstrak Paper sekaligus mengubah arah panah
function toggleAbstract(id, buttonElement) {
    const abstractDiv = document.getElementById(id);
    const icon = buttonElement.querySelector("i");
    
    if (abstractDiv.style.display === "none" || abstractDiv.style.display === "") {
        abstractDiv.style.display = "block";
        // Ubah panah menjadi ke bawah saat abstrak terbuka
        icon.classList.replace("fa-chevron-right", "fa-chevron-down");
    } else {
        abstractDiv.style.display = "none";
        // Kembalikan panah menjadi ke kanan saat abstrak tertutup
        icon.classList.replace("fa-chevron-down", "fa-chevron-right");
    }
}