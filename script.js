// ======================================
// HOTELFLOW - HOTEL MANAGEMENT SYSTEM
// ======================================

// ข้อมูลตัวอย่างสำหรับทดลองระบบ
let guests = [
    { id: "G001", name: "สมชาย ใจดี", phone: "0812345678", email: "somchai@email.com" },
    { id: "G002", name: "สมหญิง รักดี", phone: "0898765432", email: "somying@email.com" },
    { id: "G003", name: "John Smith", phone: "0822222222", email: "john@email.com" },
    { id: "G004", name: "นภัสสร แสงทอง", phone: "0865555555", email: "napat@email.com" }
];

let rooms = [
    { id: "R001", number: "101", type: "Standard", price: 1200, status: "Available" },
    { id: "R002", number: "102", type: "Standard", price: 1200, status: "Occupied" },
    { id: "R003", number: "103", type: "Standard", price: 1200, status: "Cleaning" },
    { id: "R004", number: "201", type: "Deluxe", price: 1800, status: "Available" },
    { id: "R005", number: "202", type: "Deluxe", price: 1800, status: "Occupied" },
    { id: "R006", number: "203", type: "Deluxe", price: 1800, status: "Available" },
    { id: "R007", number: "301", type: "Suite", price: 3000, status: "Available" },
    { id: "R008", number: "302", type: "Suite", price: 3000, status: "Maintenance" }
];

// BOOKING เป็นข้อมูลหัวรายการ ส่วน roomIds ทำหน้าที่จำลอง BOOKING_DETAIL
let bookings = [
    {
        id: "B001",
        guestId: "G001",
        roomIds: ["R002"],
        checkin: dateOffset(-1),
        checkout: dateOffset(2),
        total: 3600,
        status: "Checked-in"
    },
    {
        id: "B002",
        guestId: "G002",
        roomIds: ["R005"],
        checkin: dateOffset(1),
        checkout: dateOffset(3),
        total: 3600,
        status: "Confirmed"
    },
    {
        id: "B003",
        guestId: "G003",
        roomIds: ["R004"],
        checkin: dateOffset(4),
        checkout: dateOffset(6),
        total: 3600,
        status: "Confirmed"
    }
];

// HOUSEKEEPING_STATUS จำลองด้วย housekeepingStatus ของแต่ละห้อง
let housekeepingStatus = {
    R001: "Ready",
    R002: "Occupied",
    R003: "Cleaning",
    R004: "Ready",
    R005: "Occupied",
    R006: "Ready",
    R007: "Ready",
    R008: "Maintenance"
};

let calendarDate = new Date();

const pageTitles = {
    dashboard: ["Dashboard", "ภาพรวมการดำเนินงานของโรงแรม"],
    rooms: ["จัดการห้องพัก", "เพิ่ม แก้ไข และจัดการข้อมูลห้องพัก"],
    bookings: ["รายการจอง", "ตรวจสอบและจัดการรายการจองทั้งหมด"],
    guests: ["ข้อมูลลูกค้า", "จัดการข้อมูลลูกค้าของโรงแรม"],
    availability: ["ปฏิทินห้องพัก", "ตรวจสอบห้องว่างตามวันที่"],
    housekeeping: ["แม่บ้าน / ทำความสะอาด", "จัดการสถานะห้องพัก"]
};

// ======================================
// DATE FUNCTIONS
// ======================================

function dateOffset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function displayDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function money(value) {
    return Number(value).toLocaleString("th-TH") + " บาท";
}

function dateDiff(start, end) {
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    return Math.round((b - a) / 86400000);
}

// ======================================
// GENERAL FUNCTIONS
// ======================================

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

function getGuest(id) {
    return guests.find(g => g.id === id);
}

function getRoom(id) {
    return rooms.find(r => r.id === id);
}

function getStatusLabel(status) {
    const labels = {
        Available: "ห้องว่าง",
        Occupied: "มีผู้เข้าพัก",
        Cleaning: "กำลังทำความสะอาด",
        Maintenance: "ปิดปรับปรุง",
        Confirmed: "ยืนยันแล้ว",
        "Checked-in": "เช็กอินแล้ว",
        "Checked-out": "เช็กเอาต์แล้ว",
        Cancelled: "ยกเลิก",
        Ready: "พร้อมใช้งาน"
    };

    return labels[status] || status;
}

function statusBadge(status) {
    return `<span class="status ${status}">${getStatusLabel(status)}</span>`;
}

function generateId(prefix, list) {
    const max = list.reduce((maxValue, item) => {
        const number = parseInt(item.id.replace(prefix, ""), 10);
        return Math.max(maxValue, Number.isNaN(number) ? 0 : number);
    }, 0);

    return prefix + String(max + 1).padStart(3, "0");
}

// ======================================
// NAVIGATION
// ======================================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (!page) return;

    page.classList.add("active");

    const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (nav) nav.classList.add("active");

    document.getElementById("page-title").textContent = pageTitles[pageId][0];
    document.getElementById("page-subtitle").textContent = pageTitles[pageId][1];

    if (pageId === "dashboard") renderDashboard();
    if (pageId === "rooms") renderRooms();
    if (pageId === "bookings") renderBookings();
    if (pageId === "guests") renderGuests();
    if (pageId === "availability") renderCalendar();
    if (pageId === "housekeeping") renderHousekeeping();
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// ======================================
// DASHBOARD
// ======================================

function renderDashboard() {
    const available = rooms.filter(r => r.status === "Available").length;
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const cleaning = rooms.filter(r => r.status === "Cleaning").length;
    const maintenance = rooms.filter(r => r.status === "Maintenance").length;

    document.getElementById("total-rooms").textContent = rooms.length;
    document.getElementById("available-rooms").textContent = available;
    document.getElementById("total-bookings").textContent = bookings.length;
    document.getElementById("total-guests").textContent = guests.length;

    document.getElementById("summary-available").textContent = available;
    document.getElementById("summary-occupied").textContent = occupied;
    document.getElementById("summary-cleaning").textContent = cleaning;
    document.getElementById("summary-maintenance").textContent = maintenance;

    const latest = [...bookings].reverse().slice(0, 5);

    document.getElementById("dashboard-bookings").innerHTML = latest.length
        ? latest.map(booking => {
            const guest = getGuest(booking.guestId);

            return `
                <tr>
                    <td><strong>${booking.id}</strong></td>
                    <td>${guest ? guest.name : "ไม่พบข้อมูล"}</td>
                    <td>${displayDate(booking.checkin)}</td>
                    <td>${statusBadge(booking.status)}</td>
                </tr>
            `;
        }).join("")
        : `<tr><td colspan="4">ยังไม่มีรายการจอง</td></tr>`;
}

// ======================================
// ROOM MANAGEMENT
// ======================================

function renderRooms() {
    const search = document.getElementById("room-search").value.toLowerCase();
    const filter = document.getElementById("room-filter").value;

    const filtered = rooms.filter(room => {
        const matchSearch = room.number.toLowerCase().includes(search);
        const matchStatus = !filter || room.status === filter;
        return matchSearch && matchStatus;
    });

    document.getElementById("room-list").innerHTML = filtered.length
        ? filtered.map(room => `
            <div class="room-card">
                <div class="room-card-top">
                    <div>
                        <div class="room-number">ห้อง ${room.number}</div>
                        <div class="room-type">${room.type}</div>
                    </div>
                    ${statusBadge(room.status)}
                </div>

                <div class="room-price">${money(room.price)} <small>/ คืน</small></div>

                <div>
                    <button class="action-btn" onclick="editRoom('${room.id}')">แก้ไข</button>
                    <button class="action-btn delete-btn" onclick="deleteRoom('${room.id}')">ลบ</button>
                </div>
            </div>
        `).join("")
        : `<div class="panel">ไม่พบข้อมูลห้องพัก</div>`;
}

function openRoomModal(id = null) {
    document.getElementById("room-form").reset();
    document.getElementById("room-edit-id").value = id || "";
    document.getElementById("room-modal-title").textContent = id ? "แก้ไขห้องพัก" : "เพิ่มห้องพัก";

    if (id) {
        const room = getRoom(id);
        if (!room) return;

        document.getElementById("room-number").value = room.number;
        document.getElementById("room-type").value = room.type;
        document.getElementById("room-price").value = room.price;
        document.getElementById("room-status").value = room.status;
    }

    openModal("room-modal");
}

function editRoom(id) {
    openRoomModal(id);
}

document.getElementById("room-form").addEventListener("submit", event => {
    event.preventDefault();

    const id = document.getElementById("room-edit-id").value;
    const number = document.getElementById("room-number").value.trim();
    const type = document.getElementById("room-type").value;
    const price = Number(document.getElementById("room-price").value);
    const status = document.getElementById("room-status").value;

    if (rooms.some(r => r.number === number && r.id !== id)) {
        showToast("หมายเลขห้องนี้มีอยู่แล้ว");
        return;
    }

    if (id) {
        const room = getRoom(id);
        room.number = number;
        room.type = type;
        room.price = price;
        room.status = status;
        housekeepingStatus[id] = status === "Cleaning" ? "Cleaning" :
            status === "Maintenance" ? "Maintenance" : housekeepingStatus[id] || "Ready";

        showToast("แก้ไขข้อมูลห้องพักเรียบร้อย");
    } else {
        const newId = generateId("R", rooms);

        rooms.push({
            id: newId,
            number,
            type,
            price,
            status
        });

        housekeepingStatus[newId] = status === "Cleaning" ? "Cleaning" :
            status === "Maintenance" ? "Maintenance" : "Ready";

        showToast("เพิ่มห้องพักเรียบร้อย");
    }

    closeModal("room-modal");
    renderRooms();
    renderDashboard();
    renderHousekeeping();
});

function deleteRoom(id) {
    const hasBooking = bookings.some(booking =>
        booking.roomIds.includes(id) &&
        !["Cancelled", "Checked-out"].includes(booking.status)
    );

    if (hasBooking) {
        showToast("ไม่สามารถลบห้องที่มีรายการจองอยู่ได้");
        return;
    }

    if (!confirm("ต้องการลบห้องพักนี้หรือไม่?")) return;

    rooms = rooms.filter(room => room.id !== id);
    delete housekeepingStatus[id];

    renderRooms();
    renderDashboard();
    renderHousekeeping();
    showToast("ลบห้องพักเรียบร้อย");
}

// ======================================
// GUEST MANAGEMENT
// ======================================

function renderGuests() {
    const search = document.getElementById("guest-search").value.toLowerCase();

    const filtered = guests.filter(guest =>
        guest.name.toLowerCase().includes(search) ||
        guest.phone.includes(search) ||
        guest.email.toLowerCase().includes(search)
    );

    document.getElementById("guest-list").innerHTML = filtered.length
        ? filtered.map(guest => {
            const count = bookings.filter(b => b.guestId === guest.id).length;

            return `
                <tr>
                    <td><strong>${guest.id}</strong></td>
                    <td>${guest.name}</td>
                    <td>${guest.phone}</td>
                    <td>${guest.email}</td>
                    <td>${count} รายการ</td>
                    <td>
                        <button class="action-btn" onclick="editGuest('${guest.id}')">แก้ไข</button>
                        <button class="action-btn delete-btn" onclick="deleteGuest('${guest.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }).join("")
        : `<tr><td colspan="6">ไม่พบข้อมูลลูกค้า</td></tr>`;
}

function openGuestModal(id = null) {
    document.getElementById("guest-form").reset();
    document.getElementById("guest-edit-id").value = id || "";
    document.getElementById("guest-modal-title").textContent = id ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มข้อมูลลูกค้า";

    if (id) {
        const guest = getGuest(id);
        if (!guest) return;

        document.getElementById("guest-name").value = guest.name;
        document.getElementById("guest-phone").value = guest.phone;
        document.getElementById("guest-email").value = guest.email;
    }

    openModal("guest-modal");
}

function editGuest(id) {
    openGuestModal(id);
}

document.getElementById("guest-form").addEventListener("submit", event => {
    event.preventDefault();

    const id = document.getElementById("guest-edit-id").value;
    const name = document.getElementById("guest-name").value.trim();
    const phone = document.getElementById("guest-phone").value.trim();
    const email = document.getElementById("guest-email").value.trim();

    if (guests.some(g => g.phone === phone && g.id !== id)) {
        showToast("เบอร์โทรศัพท์นี้มีในระบบแล้ว");
        return;
    }

    if (id) {
        const guest = getGuest(id);
        guest.name = name;
        guest.phone = phone;
        guest.email = email;
        showToast("แก้ไขข้อมูลลูกค้าเรียบร้อย");
    } else {
        guests.push({
            id: generateId("G", guests),
            name,
            phone,
            email
        });
        showToast("เพิ่มข้อมูลลูกค้าเรียบร้อย");
    }

    closeModal("guest-modal");
    renderGuests();
    renderDashboard();
    updateBookingGuestOptions();
});

function deleteGuest(id) {
    if (bookings.some(b => b.guestId === id && b.status !== "Cancelled")) {
        showToast("ไม่สามารถลบลูกค้าที่มีรายการจองได้");
        return;
    }

    if (!confirm("ต้องการลบข้อมูลลูกค้านี้หรือไม่?")) return;

    guests = guests.filter(g => g.id !== id);
    renderGuests();
    renderDashboard();
    updateBookingGuestOptions();
    showToast("ลบข้อมูลลูกค้าเรียบร้อย");
}

// ======================================
// BOOKING MANAGEMENT
// ======================================

function renderBookings() {
    const search = document.getElementById("booking-search").value.toLowerCase();
    const filter = document.getElementById("booking-filter").value;

    const filtered = bookings.filter(booking => {
        const guest = getGuest(booking.guestId);
        const guestName = guest ? guest.name.toLowerCase() : "";

        const matchSearch =
            booking.id.toLowerCase().includes(search) ||
            guestName.includes(search);

        const matchStatus = !filter || booking.status === filter;

        return matchSearch && matchStatus;
    });

    document.getElementById("booking-list").innerHTML = filtered.length
        ? filtered.map(booking => {
            const guest = getGuest(booking.guestId);
            const roomNumbers = booking.roomIds
                .map(id => getRoom(id))
                .filter(Boolean)
                .map(room => room.number)
                .join(", ");

            return `
                <tr>
                    <td><strong>${booking.id}</strong></td>
                    <td>${guest ? guest.name : "ไม่พบข้อมูล"}</td>
                    <td>${roomNumbers || "-"}</td>
                    <td>${displayDate(booking.checkin)}</td>
                    <td>${displayDate(booking.checkout)}</td>
                    <td>${money(booking.total)}</td>
                    <td>${statusBadge(booking.status)}</td>
                    <td>
                        <button class="action-btn" onclick="viewBooking('${booking.id}')">ดู</button>
                        ${booking.status === "Confirmed" ? `
                            <button class="action-btn" onclick="updateBookingStatus('${booking.id}', 'Checked-in')">เช็กอิน</button>
                            <button class="action-btn delete-btn" onclick="cancelBooking('${booking.id}')">ยกเลิก</button>
                        ` : ""}
                        ${booking.status === "Checked-in" ? `
                            <button class="action-btn" onclick="updateBookingStatus('${booking.id}', 'Checked-out')">เช็กเอาต์</button>
                        ` : ""}
                    </td>
                </tr>
            `;
        }).join("")
        : `<tr><td colspan="8">ไม่พบรายการจอง</td></tr>`;
}

function updateBookingGuestOptions() {
    const select = document.getElementById("booking-guest");

    select.innerHTML = guests.map(guest =>
        `<option value="${guest.id}">${guest.name}</option>`
    ).join("");

    if (!guests.length) {
        select.innerHTML = `<option value="">กรุณาเพิ่มข้อมูลลูกค้าก่อน</option>`;
    }
}

function openBookingModal() {
    if (!guests.length) {
        showToast("กรุณาเพิ่มข้อมูลลูกค้าก่อนสร้างการจอง");
        showPage("guests");
        return;
    }

    document.getElementById("booking-form").reset();

    updateBookingGuestOptions();

    const today = dateOffset(0);
    document.getElementById("checkin-date").min = today;
    document.getElementById("checkout-date").min = today;

    document.getElementById("checkin-date").value = today;
    document.getElementById("checkout-date").value = dateOffset(1);

    renderBookingRoomOptions();
    calculateBookingTotal();

    openModal("booking-modal");
}

function isRoomBooked(roomId, checkin, checkout) {
    return bookings.some(booking => {
        if (!booking.roomIds.includes(roomId)) return false;

        if (["Cancelled", "Checked-out"].includes(booking.status)) return false;

        // ช่วงวันจองทับซ้อนกันหรือไม่
        return checkin < booking.checkout && checkout > booking.checkin;
    });
}

function renderBookingRoomOptions() {
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date").value;

    const container = document.getElementById("booking-room-options");

    const availableRooms = rooms.filter(room => {
        if (["Cleaning", "Maintenance"].includes(room.status)) return false;

        if (!checkin || !checkout || checkout <= checkin) return false;

        return !isRoomBooked(room.id, checkin, checkout);
    });

    container.innerHTML = availableRooms.length
        ? availableRooms.map(room => `
            <label class="select-room-item">
                <input type="checkbox" value="${room.id}" onchange="calculateBookingTotal()">
                <span>
                    <strong>ห้อง ${room.number}</strong><br>
                    ${room.type} · ${money(room.price)}/คืน
                </span>
            </label>
        `).join("")
        : `<p>ไม่มีห้องว่างในช่วงวันที่เลือก</p>`;
}

function calculateBookingTotal() {
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date").value;

    const nights = dateDiff(checkin, checkout);

    const selectedIds = [...document.querySelectorAll("#booking-room-options input:checked")]
        .map(input => input.value);

    const total = selectedIds.reduce((sum, id) => {
        const room = getRoom(id);
        return sum + (room ? room.price * Math.max(nights, 0) : 0);
    }, 0);

    document.getElementById("booking-total").textContent = money(total);
}

document.getElementById("checkin-date").addEventListener("change", () => {
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date");

    checkout.min = checkin;

    if (checkout.value <= checkin) {
        const nextDay = new Date(checkin + "T00:00:00");
        nextDay.setDate(nextDay.getDate() + 1);
        checkout.value = formatDate(nextDay);
    }

    renderBookingRoomOptions();
    calculateBookingTotal();
});

document.getElementById("checkout-date").addEventListener("change", () => {
    renderBookingRoomOptions();
    calculateBookingTotal();
});

document.getElementById("booking-form").addEventListener("submit", event => {
    event.preventDefault();

    const guestId = document.getElementById("booking-guest").value;
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date").value;

    const selectedIds = [...document.querySelectorAll("#booking-room-options input:checked")]
        .map(input => input.value);

    if (!guestId) {
        showToast("กรุณาเลือกลูกค้า");
        return;
    }

    if (!checkin || !checkout || checkout <= checkin) {
        showToast("กรุณาตรวจสอบวันที่เข้าพักและวันออก");
        return;
    }

    if (selectedIds.length === 0) {
        showToast("กรุณาเลือกห้องพักอย่างน้อย 1 ห้อง");
        return;
    }

    const conflict = selectedIds.some(id =>
        isRoomBooked(id, checkin, checkout)
    );

    if (conflict) {
        showToast("มีห้องพักที่ถูกจองในช่วงวันที่เลือกแล้ว");
        renderBookingRoomOptions();
        return;
    }

    const nights = dateDiff(checkin, checkout);

    const total = selectedIds.reduce((sum, id) => {
        const room = getRoom(id);
        return sum + room.price * nights;
    }, 0);

    const newBooking = {
        id: generateId("B", bookings),
        guestId,
        roomIds: selectedIds,
        checkin,
        checkout,
        total,
        status: "Confirmed"
    };

    bookings.push(newBooking);

    closeModal("booking-modal");

    renderBookings();
    renderDashboard();
    renderCalendar();

    showToast("สร้างรายการจองเรียบร้อย");
});

function viewBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const guest = getGuest(booking.guestId);

    const roomNames = booking.roomIds.map(roomId => {
        const room = getRoom(roomId);
        return room ? `ห้อง ${room.number} (${room.type})` : "ไม่พบข้อมูลห้อง";
    });

    document.getElementById("booking-detail-content").innerHTML = `
        <div class="detail-list">
            <p><strong>รหัสการจอง:</strong> ${booking.id}</p>
            <p><strong>ลูกค้า:</strong> ${guest ? guest.name : "-"}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> ${guest ? guest.phone : "-"}</p>
            <p><strong>ห้องพัก:</strong> ${roomNames.join(", ")}</p>
            <p><strong>วันที่เช็กอิน:</strong> ${displayDate(booking.checkin)}</p>
            <p><strong>วันที่เช็กเอาต์:</strong> ${displayDate(booking.checkout)}</p>
            <p><strong>จำนวนคืน:</strong> ${dateDiff(booking.checkin, booking.checkout)} คืน</p>
            <p><strong>ราคารวม:</strong> ${money(booking.total)}</p>
            <p><strong>สถานะ:</strong> ${statusBadge(booking.status)}</p>
        </div>
    `;

    openModal("detail-modal");
}

function updateBookingStatus(id, status) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    booking.status = status;

    if (status === "Checked-in") {
        booking.roomIds.forEach(roomId => {
            const room = getRoom(roomId);
            if (room) room.status = "Occupied";
            housekeepingStatus[roomId] = "Occupied";
        });
    }

    if (status === "Checked-out") {
        booking.roomIds.forEach(roomId => {
            const room = getRoom(roomId);
            if (room) room.status = "Cleaning";
            housekeepingStatus[roomId] = "Cleaning";
        });
    }

    renderBookings();
    renderDashboard();
    renderRooms();
    renderHousekeeping();

    showToast("อัปเดตสถานะการจองเรียบร้อย");
}

function cancelBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    if (!confirm("ต้องการยกเลิกรายการจองนี้หรือไม่?")) return;

    booking.status = "Cancelled";

    renderBookings();
    renderDashboard();
    renderCalendar();

    showToast("ยกเลิกรายการจองเรียบร้อย");
}

// ======================================
// AVAILABILITY CALENDAR
// ======================================

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById("calendar-month").textContent =
        new Date(year, month, 1).toLocaleDateString("th-TH", {
            month: "long",
            year: "numeric"
        });

    const grid = document.getElementById("calendar-grid");

    const weekdays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    let html = weekdays.map(day =>
        `<div class="calendar-day heading">${day}</div>`
    ).join("");

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day muted"></div>`;
    }

    for (let day = 1; day <= lastDate; day++) {
        const date = formatDate(new Date(year, month, day));

        const dayBookings = bookings.filter(booking =>
            !["Cancelled", "Checked-out"].includes(booking.status) &&
            date >= booking.checkin &&
            date < booking.checkout
        );

        const events = dayBookings.map(booking => {
            const guest = getGuest(booking.guestId);
            return `<div class="calendar-event">${guest ? guest.name : booking.id}</div>`;
        }).join("");

        html += `
            <div class="calendar-day">
                <strong>${day}</strong>
                ${events}
            </div>
        `;
    }

    grid.innerHTML = html;
}

function changeCalendarMonth(amount) {
    calendarDate.setMonth(calendarDate.getMonth() + amount);
    renderCalendar();
}

// ======================================
// HOUSEKEEPING
// ======================================

function renderHousekeeping() {
    document.getElementById("housekeeping-list").innerHTML = rooms.map(room => {
        const status = housekeepingStatus[room.id] || "Ready";

        return `
            <tr>
                <td><strong>ห้อง ${room.number}</strong></td>
                <td>${room.type}</td>
                <td>${statusBadge(status === "Ready" ? "Available" : status)}</td>
                <td>
                    <select class="housekeeping-select" onchange="changeHousekeeping('${room.id}', this.value)">
                        <option value="Ready" ${status === "Ready" ? "selected" : ""}>พร้อมใช้งาน</option>
                        <option value="Cleaning" ${status === "Cleaning" ? "selected" : ""}>กำลังทำความสะอาด</option>
                        <option value="Maintenance" ${status === "Maintenance" ? "selected" : ""}>ปิดปรับปรุง</option>
                        <option value="Occupied" ${status === "Occupied" ? "selected" : ""}>มีผู้เข้าพัก</option>
                    </select>
                </td>
            </tr>
        `;
    }).join("");
}

function changeHousekeeping(roomId, status) {
    const room = getRoom(roomId);
    if (!room) return;

    const activeBooking = bookings.some(booking =>
        booking.roomIds.includes(roomId) &&
        booking.status === "Checked-in"
    );

    if (status === "Ready" && activeBooking) {
        showToast("ห้องนี้มีผู้เข้าพักอยู่ ไม่สามารถเปลี่ยนเป็นห้องว่างได้");
        renderHousekeeping();
        return;
    }

    housekeepingStatus[roomId] = status;
    room.status = status === "Ready" ? "Available" : status;

    renderHousekeeping();
    renderRooms();
    renderDashboard();

    showToast("อัปเดตสถานะห้องพักเรียบร้อย");
}

// ======================================
// INITIALIZE
// ======================================

document.getElementById("today").textContent =
    new Date().toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

renderDashboard();
renderRooms();
renderBookings();
renderGuests();
renderCalendar();
renderHousekeeping();
updateBookingGuestOptions();

// ปิด Modal เมื่อคลิกพื้นที่ด้านนอก
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});