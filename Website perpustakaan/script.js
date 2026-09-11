/* =========================================
   LIBRA - LIBRARY MANAGEMENT SYSTEM
========================================= */

const defaultBooks = [
    {
        id: 1,
        title: "Dasar Pemrograman Web",
        author: "Budi Raharjo",
        isbn: "9786021234567",
        category: "Teknologi",
        year: 2024,
        stock: 5,
        borrowed: 2
    },
    {
        id: 2,
        title: "Belajar JavaScript Modern",
        author: "Andi Wijaya",
        isbn: "9786022345678",
        category: "Teknologi",
        year: 2023,
        stock: 4,
        borrowed: 1
    },
    {
        id: 3,
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        isbn: "9786023456789",
        category: "Novel",
        year: 2005,
        stock: 6,
        borrowed: 3
    },
    {
        id: 4,
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        isbn: "9786024567890",
        category: "Pendidikan",
        year: 2018,
        stock: 5,
        borrowed: 1
    },
    {
        id: 5,
        title: "Sejarah Indonesia",
        author: "R. Soekmono",
        isbn: "9786025678901",
        category: "Sejarah",
        year: 2020,
        stock: 3,
        borrowed: 1
    },
    {
        id: 6,
        title: "Ensiklopedia Sains",
        author: "John Smith",
        isbn: "9786026789012",
        category: "Sains",
        year: 2022,
        stock: 4,
        borrowed: 0
    }
];

const defaultMembers = [
    {
        id: "M001",
        name: "Ahmad Fauzan",
        className: "X RPL 1",
        phone: "081234567890"
    },
    {
        id: "M002",
        name: "Budi Santoso",
        className: "X RPL 2",
        phone: "082345678901"
    },
    {
        id: "M003",
        name: "Citra Lestari",
        className: "X RPL 1",
        phone: "083456789012"
    },
    {
        id: "M004",
        name: "Dimas Pratama",
        className: "XI RPL 1",
        phone: "084567890123"
    }
];

const defaultBorrowings = [
    {
        id: 1,
        memberId: "M001",
        bookId: 3,
        borrowDate: "2026-09-01",
        returnDate: "2026-09-08",
        returned: false
    },
    {
        id: 2,
        memberId: "M002",
        bookId: 1,
        borrowDate: "2026-09-02",
        returnDate: "2026-09-09",
        returned: false
    },
    {
        id: 3,
        memberId: "M003",
        bookId: 4,
        borrowDate: "2026-08-28",
        returnDate: "2026-09-04",
        returned: false
    }
];

/* =========================================
   STORAGE
========================================= */

let books = JSON.parse(localStorage.getItem("libraBooks")) || defaultBooks;
let members = JSON.parse(localStorage.getItem("libraMembers")) || defaultMembers;
let borrowings = JSON.parse(localStorage.getItem("libraBorrowings")) || defaultBorrowings;

function saveData() {
    localStorage.setItem("libraBooks", JSON.stringify(books));
    localStorage.setItem("libraMembers", JSON.stringify(members));
    localStorage.setItem("libraBorrowings", JSON.stringify(borrowings));
}

/* =========================================
   ELEMENTS
========================================= */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");

const toast = document.getElementById("toast");

const bookModal = document.getElementById("bookModal");
const memberModal = document.getElementById("memberModal");

const bookForm = document.getElementById("bookForm");
const memberForm = document.getElementById("memberForm");
const borrowForm = document.getElementById("borrowForm");

/* =========================================
   DATE
========================================= */

function updateDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("id-ID", options);
}

updateDate();

/* =========================================
   NAVIGATION
========================================= */

const titles = {
    dashboard: "Dashboard",
    books: "Data Buku",
    members: "Anggota",
    borrow: "Peminjaman",
    history: "Riwayat"
};

function showSection(sectionName) {

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const target = document.getElementById(sectionName);
    const nav = document.querySelector(
        `.nav-item[data-section="${sectionName}"]`
    );

    if (target) {
        target.classList.add("active-section");
    }

    if (nav) {
        nav.classList.add("active");
    }

    pageTitle.textContent = titles[sectionName] || "Dashboard";

    if (window.innerWidth <= 800) {
        document.getElementById("sidebar").classList.remove("open");
    }

    if (sectionName === "dashboard") {
        renderDashboard();
    }

    if (sectionName === "books") {
        renderBooks();
    }

    if (sectionName === "members") {
        renderMembers();
    }

    if (sectionName === "borrow") {
        renderBorrowOptions();
        renderActiveBorrowings();
    }

    if (sectionName === "history") {
        renderHistory();
    }
}

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const section = item.dataset.section;

        showSection(section);

    });

});

document.querySelectorAll("[data-section-target]").forEach(button => {

    button.addEventListener("click", () => {

        showSection(button.dataset.sectionTarget);

    });

});

/* =========================================
   MOBILE SIDEBAR
========================================= */

document.getElementById("mobileMenu").addEventListener("click", () => {

    document.getElementById("sidebar").classList.toggle("open");

});

/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const totalBooks = books.reduce(
        (total, book) => total + Number(book.stock),
        0
    );

    const totalBorrowed = books.reduce(
        (total, book) => total + Number(book.borrowed || 0),
        0
    );

    const available = totalBooks - totalBorrowed;

    document.getElementById("totalBooks").textContent = totalBooks;
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("totalBorrowed").textContent = totalBorrowed;
    document.getElementById("totalAvailable").textContent = available;

    renderRecentBorrowings();
    renderPopularBooks();
}

/* =========================================
   RECENT BORROWING
========================================= */

function getBook(bookId) {
    return books.find(book => Number(book.id) === Number(bookId));
}

function getMember(memberId) {
    return members.find(member => member.id === memberId);
}

function formatDate(dateString) {

    if (!dateString) return "-";

    return new Date(dateString + "T00:00:00")
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}

function renderRecentBorrowings() {

    const container = document.getElementById("recentBorrowings");

    const recent = [...borrowings]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Belum ada aktivitas peminjaman.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ANGGOTA</th>
                    <th>BUKU</th>
                    <th>TANGGAL</th>
                    <th>STATUS</th>
                </tr>
            </thead>

            <tbody>

                ${recent.map(item => {

                    const member = getMember(item.memberId);
                    const book = getBook(item.bookId);

                    return `
                        <tr>

                            <td>
                                ${member ? member.name : "Unknown"}
                            </td>

                            <td>
                                <div class="book-name">
                                    ${book ? book.title : "Unknown"}
                                </div>
                            </td>

                            <td>
                                ${formatDate(item.borrowDate)}
                            </td>

                            <td>
                                <span class="badge ${item.returned ? "available" : "borrowed"}">
                                    ${item.returned ? "Dikembalikan" : "Dipinjam"}
                                </span>
                            </td>

                        </tr>
                    `;

                }).join("")}

            </tbody>
        </table>
    `;
}

/* =========================================
   POPULAR BOOKS
========================================= */

function renderPopularBooks() {

    const container = document.getElementById("popularBooks");

    const popular = [...books]
        .sort((a, b) => b.borrowed - a.borrowed)
        .slice(0, 5);

    container.innerHTML = popular.map((book, index) => {

        return `
            <div class="popular-item">

                <div class="book-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="book-cover">
                    ${book.title.charAt(0)}
                </div>

                <div class="popular-info">

                    <strong>${book.title}</strong>

                    <span>
                        ${book.borrowed} kali dipinjam
                    </span>

                </div>

            </div>
        `;

    }).join("");
}

/* =========================================
   BOOKS
========================================= */

function renderBooks() {

    const container = document.getElementById("booksTable");

    const search =
        document.getElementById("bookSearch").value.toLowerCase();

    const category =
        document.getElementById("categoryFilter").value;

    const filtered = books.filter(book => {

        const matchSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search) ||
            book.isbn.toLowerCase().includes(search);

        const matchCategory =
            category === "all" ||
            book.category === category;

        return matchSearch && matchCategory;

    });

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Buku tidak ditemukan.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <table>

            <thead>
                <tr>
                    <th>BUKU</th>
                    <th>ISBN</th>
                    <th>KATEGORI</th>
                    <th>TAHUN</th>
                    <th>STOK</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                </tr>
            </thead>

            <tbody>

                ${filtered.map(book => {

                    const available =
                        Number(book.stock) - Number(book.borrowed || 0);

                    return `
                        <tr>

                            <td>
                                <div class="book-name">
                                    ${book.title}
                                </div>

                                <div class="book-author">
                                    ${book.author}
                                </div>
                            </td>

                            <td>${book.isbn}</td>

                            <td>
                                <span class="badge">
                                    ${book.category}
                                </span>
                            </td>

                            <td>${book.year}</td>

                            <td>${available} / ${book.stock}</td>

                            <td>
                                <span class="badge ${
                                    available > 0
                                    ? "available"
                                    : "borrowed"
                                }">
                                    ${
                                        available > 0
                                        ? "Tersedia"
                                        : "Habis"
                                    }
                                </span>
                            </td>

                            <td>

                                <div class="action-buttons">

                                    <button
                                        class="icon-btn"
                                        onclick="editBook(${book.id})"
                                        title="Edit"
                                    >
                                        ✎
                                    </button>

                                    <button
                                        class="icon-btn delete"
                                        onclick="deleteBook(${book.id})"
                                        title="Hapus"
                                    >
                                        ×
                                    </button>

                                </div>

                            </td>

                        </tr>
                    `;

                }).join("")}

            </tbody>

        </table>
    `;
}

/* SEARCH BOOK */

document.getElementById("bookSearch").addEventListener(
    "input",
    renderBooks
);

document.getElementById("categoryFilter").addEventListener(
    "change",
    renderBooks
);

/* =========================================
   ADD BOOK
========================================= */

document.getElementById("addBookBtn").addEventListener(
    "click",
    () => {

        bookForm.reset();

        document.getElementById("bookId").value = "";

        document.getElementById("bookModalTitle").textContent =
            "Tambah Buku";

        bookModal.classList.add("show");

    }
);

/* =========================================
   SAVE BOOK
========================================= */

bookForm.addEventListener("submit", event => {

    event.preventDefault();

    const id = document.getElementById("bookId").value;

    const data = {

        id: id
            ? Number(id)
            : Date.now(),

        title:
            document.getElementById("bookTitle").value.trim(),

        author:
            document.getElementById("bookAuthor").value.trim(),

        isbn:
            document.getElementById("bookISBN").value.trim(),

        category:
            document.getElementById("bookCategory").value,

        year:
            Number(document.getElementById("bookYear").value),

        stock:
            Number(document.getElementById("bookStock").value),

        borrowed: 0

    };

    if (id) {

        const index = books.findIndex(
            book => Number(book.id) === Number(id)
        );

        if (index !== -1) {

            data.borrowed = books[index].borrowed || 0;

            books[index] = data;

        }

        showToast("Data buku berhasil diperbarui.");

    } else {

        books.push(data);

        showToast("Buku berhasil ditambahkan.");

    }

    saveData();

    bookModal.classList.remove("show");

    renderBooks();
    renderDashboard();

});

/* =========================================
   EDIT BOOK
========================================= */

function editBook(id) {

    const book = books.find(
        book => Number(book.id) === Number(id)
    );

    if (!book) return;

    document.getElementById("bookId").value = book.id;
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookISBN").value = book.isbn;
    document.getElementById("bookCategory").value = book.category;
    document.getElementById("bookYear").value = book.year;
    document.getElementById("bookStock").value = book.stock;

    document.getElementById("bookModalTitle").textContent =
        "Edit Buku";

    bookModal.classList.add("show");
}

/* =========================================
   DELETE BOOK
========================================= */

function deleteBook(id) {

    const book = getBook(id);

    if (!book) return;

    const activeLoan = borrowings.some(
        borrowing =>
            Number(borrowing.bookId) === Number(id) &&
            !borrowing.returned
    );

    if (activeLoan) {

        showToast(
            "Buku masih sedang dipinjam dan tidak bisa dihapus."
        );

        return;
    }

    const confirmDelete =
        confirm(`Hapus buku "${book.title}"?`);

    if (!confirmDelete) return;

    books = books.filter(
        book => Number(book.id) !== Number(id)
    );

    saveData();

    renderBooks();
    renderDashboard();

    showToast("Buku berhasil dihapus.");

}

/* =========================================
   MEMBERS
========================================= */

function renderMembers() {

    const container =
        document.getElementById("membersTable");

    const search =
        document.getElementById("memberSearch")
        .value
        .toLowerCase();

    const filtered = members.filter(member => {

        return (
            member.id.toLowerCase().includes(search) ||
            member.name.toLowerCase().includes(search) ||
            member.className.toLowerCase().includes(search)
        );

    });

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Anggota tidak ditemukan.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAMA</th>
                    <th>KELAS / JURUSAN</th>
                    <th>TELEPON</th>
                    <th>AKSI</th>
                </tr>
            </thead>

            <tbody>

                ${filtered.map(member => {

                    return `
                        <tr>

                            <td>
                                <span class="badge">
                                    ${member.id}
                                </span>
                            </td>

                            <td>
                                <div class="book-name">
                                    ${member.name}
                                </div>
                            </td>

                            <td>
                                ${member.className}
                            </td>

                            <td>
                                ${member.phone || "-"}
                            </td>

                            <td>

                                <button
                                    class="icon-btn delete"
                                    onclick="deleteMember('${member.id}')"
                                >
                                    ×
                                </button>

                            </td>

                        </tr>
                    `;

                }).join("")}

            </tbody>

        </table>
    `;
}

document.getElementById("memberSearch").addEventListener(
    "input",
    renderMembers
);

/* =========================================
   ADD MEMBER
========================================= */

document.getElementById("addMemberBtn").addEventListener(
    "click",
    () => {

        memberForm.reset();

        memberModal.classList.add("show");

    }
);

/* =========================================
   SAVE MEMBER
========================================= */

memberForm.addEventListener("submit", event => {

    event.preventDefault();

    const id =
        document.getElementById("memberId").value
        .trim();

    const exists = members.some(
        member => member.id === id
    );

    if (exists) {

        showToast("ID anggota sudah digunakan.");

        return;
    }

    members.push({

        id,

        name:
            document.getElementById("memberName")
            .value
            .trim(),

        className:
            document.getElementById("memberClass")
            .value
            .trim(),

        phone:
            document.getElementById("memberPhone")
            .value
            .trim()

    });

    saveData();

    memberModal.classList.remove("show");

    renderMembers();
    renderDashboard();
    renderBorrowOptions();

    showToast("Anggota berhasil ditambahkan.");

});

/* =========================================
   DELETE MEMBER
========================================= */

function deleteMember(id) {

    const activeLoan = borrowings.some(
        borrowing =>
            borrowing.memberId === id &&
            !borrowing.returned
    );

    if (activeLoan) {

        showToast(
            "Anggota masih memiliki peminjaman aktif."
        );

        return;
    }

    const member = getMember(id);

    if (!member) return;

    if (!confirm(`Hapus anggota "${member.name}"?`)) {
        return;
    }

    members = members.filter(
        member => member.id !== id
    );

    saveData();

    renderMembers();
    renderDashboard();
    renderBorrowOptions();

    showToast("Anggota berhasil dihapus.");

}

/* =========================================
   BORROW OPTIONS
========================================= */

function renderBorrowOptions() {

    const memberSelect =
        document.getElementById("borrowMember");

    const bookSelect =
        document.getElementById("borrowBook");

    memberSelect.innerHTML = `
        <option value="">Pilih anggota</option>

        ${members.map(member => `
            <option value="${member.id}">
                ${member.id} - ${member.name}
            </option>
        `).join("")}
    `;

    const availableBooks = books.filter(book => {

        const available =
            Number(book.stock) -
            Number(book.borrowed || 0);

        return available > 0;

    });

    bookSelect.innerHTML = `
        <option value="">Pilih buku</option>

        ${availableBooks.map(book => `
            <option value="${book.id}">
                ${book.title}
            </option>
        `).join("")}
    `;

}

/* =========================================
   DEFAULT DATE
========================================= */

function setDefaultDates() {

    const today = new Date();

    const nextWeek = new Date();

    nextWeek.setDate(
        today.getDate() + 7
    );

    document.getElementById("borrowDate").value =
        today.toISOString().split("T")[0];

    document.getElementById("returnDate").value =
        nextWeek.toISOString().split("T")[0];
}

setDefaultDates();

/* =========================================
   CREATE BORROWING
========================================= */

borrowForm.addEventListener("submit", event => {

    event.preventDefault();

    const memberId =
        document.getElementById("borrowMember").value;

    const bookId =
        Number(document.getElementById("borrowBook").value);

    const borrowDate =
        document.getElementById("borrowDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const book = getBook(bookId);

    if (!book) {

        showToast("Buku tidak ditemukan.");

        return;
    }

    const available =
        Number(book.stock) -
        Number(book.borrowed || 0);

    if (available <= 0) {

        showToast("Stok buku sudah habis.");

        return;
    }

    book.borrowed =
        Number(book.borrowed || 0) + 1;

    borrowings.push({

        id: Date.now(),

        memberId,

        bookId,

        borrowDate,

        returnDate,

        returned: false

    });

    saveData();

    borrowForm.reset();

    setDefaultDates();

    renderBorrowOptions();
    renderActiveBorrowings();
    renderDashboard();

    showToast("Peminjaman berhasil dibuat.");

});

/* =========================================
   ACTIVE BORROWINGS
========================================= */

function renderActiveBorrowings() {

    const container =
        document.getElementById("activeBorrowings");

    const active = borrowings.filter(
        borrowing => !borrowing.returned
    );

    if (active.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Tidak ada buku yang sedang dipinjam.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <table>

            <thead>

                <tr>
                    <th>ANGGOTA</th>
                    <th>BUKU</th>
                    <th>TANGGAL PINJAM</th>
                    <th>BATAS KEMBALI</th>
                    <th>AKSI</th>
                </tr>

            </thead>

            <tbody>

                ${active.map(item => {

                    const member = getMember(item.memberId);
                    const book = getBook(item.bookId);

                    return `
                        <tr>

                            <td>
                                ${member ? member.name : "-"}
                            </td>

                            <td>
                                <div class="book-name">
                                    ${book ? book.title : "-"}
                                </div>
                            </td>

                            <td>
                                ${formatDate(item.borrowDate)}
                            </td>

                            <td>
                                ${formatDate(item.returnDate)}
                            </td>

                            <td>

                                <button
                                    class="secondary-btn"
                                    onclick="returnBook(${item.id})"
                                >
                                    Kembalikan
                                </button>

                            </td>

                        </tr>
                    `;

                }).join("")}

            </tbody>

        </table>
    `;
}

/* =========================================
   RETURN BOOK
========================================= */

function returnBook(id) {

    const borrowing = borrowings.find(
        item => Number(item.id) === Number(id)
    );

    if (!borrowing) return;

    borrowing.returned = true;

    const book = getBook(borrowing.bookId);

    if (book && book.borrowed > 0) {
        book.borrowed--;
    }

    saveData();

    renderActiveBorrowings();
    renderBorrowOptions();
    renderDashboard();
    renderHistory();

    showToast("Buku berhasil dikembalikan.");

}

/* =========================================
   HISTORY
========================================= */

function renderHistory() {

    const container =
        document.getElementById("historyTable");

    const sorted = [...borrowings]
        .sort((a, b) => b.id - a.id);

    if (sorted.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Belum ada riwayat peminjaman.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <table>

            <thead>

                <tr>
                    <th>ANGGOTA</th>
                    <th>BUKU</th>
                    <th>PINJAM</th>
                    <th>BATAS KEMBALI</th>
                    <th>STATUS</th>
                </tr>

            </thead>

            <tbody>

                ${sorted.map(item => {

                    const member = getMember(item.memberId);
                    const book = getBook(item.bookId);

                    return `
                        <tr>

                            <td>
                                ${member ? member.name : "-"}
                            </td>

                            <td>
                                <div class="book-name">
                                    ${book ? book.title : "-"}
                                </div>
                            </td>

                            <td>
                                ${formatDate(item.borrowDate)}
                            </td>

                            <td>
                                ${formatDate(item.returnDate)}
                            </td>

                            <td>

                                <span class="badge ${
                                    item.returned
                                    ? "available"
                                    : "borrowed"
                                }">

                                    ${
                                        item.returned
                                        ? "Dikembalikan"
                                        : "Dipinjam"
                                    }

                                </span>

                            </td>

                        </tr>
                    `;

                }).join("")}

            </tbody>

        </table>
    `;
}

/* =========================================
   CLEAR HISTORY
========================================= */

document.getElementById("clearHistoryBtn")
    .addEventListener("click", () => {

        if (borrowings.length === 0) {

            showToast("Riwayat sudah kosong.");

            return;
        }

        const active = borrowings.filter(
            item => !item.returned
        );

        if (active.length > 0) {

            showToast(
                "Tidak bisa menghapus karena masih ada peminjaman aktif."
            );

            return;
        }

        if (!confirm("Hapus semua riwayat peminjaman?")) {
            return;
        }

        borrowings = [];

        books.forEach(book => {
            book.borrowed = 0;
        });

        saveData();

        renderHistory();
        renderDashboard();

        showToast("Riwayat berhasil dihapus.");

    });

/* =========================================
   CLOSE MODALS
========================================= */

document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", () => {

        const modalId =
            button.dataset.close;

        document.getElementById(modalId)
            .classList.remove("show");

    });

});

/* Klik area luar modal */

document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });

});

/* ESC */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document.querySelectorAll(".modal")
            .forEach(modal => {
                modal.classList.remove("show");
            });

    }

});

/* =========================================
   INITIAL RENDER
========================================= */

saveData();

renderDashboard();
renderBooks();
renderMembers();
renderBorrowOptions();
renderActiveBorrowings();
renderHistory();